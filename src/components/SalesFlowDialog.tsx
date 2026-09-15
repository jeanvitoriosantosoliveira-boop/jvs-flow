import { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Info, Loader2, Quote, Save } from "lucide-react";
import { toast } from "sonner";
import { SalesFlowStep } from "@/components/SalesFlowStep";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { getSalesScript } from "@/data/salesScripts";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { LeadScriptFlow, SalesFlowAnswers, SalesFlowAnswerValue, SalesFlowLead } from "@/types/salesFlow";

const STEP_TITLES = [
  "Preparação",
  "Abertura e decisor",
  "Gancho dos 30 segundos",
  "Quatro perguntas",
  "A virada",
  "Apresentação da solução",
  "Demonstração",
  "Objeções",
  "Resultado",
];

const OUTCOME_LABELS: Record<string, string> = {
  demo_scheduled: "Demonstração agendada",
  call_back: "Falar com o decisor depois",
  follow_up: "Manter em acompanhamento",
  no_interest: "Sem interesse",
  no_contact: "Não foi possível falar",
};

interface SalesFlowDialogProps {
  open: boolean;
  lead: SalesFlowLead | null;
  flow: LeadScriptFlow | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (flow: LeadScriptFlow) => void;
}

function parseAnswers(value: Json): SalesFlowAnswers {
  if (!value || Array.isArray(value) || typeof value !== "object") return {};
  return value as SalesFlowAnswers;
}

export function SalesFlowDialog({ open, lead, flow, onOpenChange, onSaved }: SalesFlowDialogProps) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<SalesFlowAnswers>({});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const readOnly = flow?.status === "completed";
  const script = getSalesScript(flow?.script_key ?? "");

  useEffect(() => {
    if (!open || !flow) return;
    setAnswers(parseAnswers(flow.answers));
    setStep(flow.status === "completed" ? 0 : Math.min(flow.current_step, STEP_TITLES.length - 1));
  }, [open, flow]);

  function changeAnswer(key: string, value: SalesFlowAnswerValue) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function validateCurrentStep() {
    if (step === 1 && !answers.contact_role) {
      toast.error("Informe quem atendeu a ligação.");
      return false;
    }
    if (step === 1) {
      const contactRole = String(answers.contact_role);
      if (contactRole === "manager" && !answers.participates_decisions) {
        toast.error("Informe se o gerente participa das decisões.");
        return false;
      }
      const needsDecisionMaker = contactRole === "salesperson"
        || contactRole === "reception"
        || (contactRole === "manager" && answers.participates_decisions === "no");
      if (needsDecisionMaker && !answers.reached_decision_maker) {
        toast.error("Informe se foi possível falar com o responsável.");
        return false;
      }
      if ((!needsDecisionMaker || answers.reached_decision_maker === "yes") && !answers.accepted_thirty_seconds) {
        toast.error("Informe se a pessoa aceitou ouvir os 30 segundos.");
        return false;
      }
    }
    if (step === STEP_TITLES.length - 1 && !answers.call_outcome) {
      toast.error("Informe o resultado da ligação.");
      return false;
    }
    return true;
  }

  async function persist(nextStep: number, complete = false) {
    if (!flow || !lead) return false;
    setSaving(true);
    const completedAt = complete ? new Date().toISOString() : null;
    const normalizedAnswers: SalesFlowAnswers = {
      ...answers,
      specific_observation: String(answers.specific_observation ?? "").trim() || script.defaultObservation,
    };
    const { data, error } = await supabase
      .from("lead_script_flows")
      .update({
        answers: normalizedAnswers as Json,
        current_step: nextStep,
        status: complete ? "completed" : "in_progress",
        completed_at: completedAt,
      })
      .eq("id", flow.id)
      .select()
      .single();

    if (error) {
      setSaving(false);
      toast.error("Não foi possível salvar o Script Flow: " + error.message);
      return false;
    }

    const savedFlow = data as LeadScriptFlow;
    setAnswers(normalizedAnswers);
    onSaved(savedFlow);

    if (complete) {
      const outcome = String(normalizedAnswers.call_outcome ?? "");
      const finalNotes = String(normalizedAnswers.final_notes ?? "").trim();
      const body = `Script Flow concluído · ${OUTCOME_LABELS[outcome] ?? outcome}${finalNotes ? ` · ${finalNotes}` : ""}`;
      const { error: activityError } = await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        user_id: user?.id ?? flow.created_by,
        kind: "call",
        body,
      });
      if (activityError) toast.error("Flow salvo, mas não foi possível registrar a atividade.");
    }

    setSaving(false);
    return true;
  }

  async function goNext() {
    if (readOnly) {
      if (step === STEP_TITLES.length - 1) onOpenChange(false);
      else setStep((current) => current + 1);
      return;
    }
    if (!validateCurrentStep()) return;
    if (step === STEP_TITLES.length - 1) {
      if (await persist(step, true)) {
        toast.success("Script Flow concluído e registrado no histórico.");
        onOpenChange(false);
      }
      return;
    }
    const contactRole = String(answers.contact_role ?? "");
    const needsDecisionMaker = contactRole === "salesperson"
      || contactRole === "reception"
      || (contactRole === "manager" && answers.participates_decisions === "no");
    const nextStep = step === 1 && needsDecisionMaker && answers.reached_decision_maker !== "yes"
      ? 8
      : step === 1 && answers.accepted_thirty_seconds === "no"
        ? 7
        : step === 6 && answers.demo_accepted === "yes"
          ? 8
          : step + 1;
    if (await persist(nextStep)) setStep(nextStep);
  }

  async function goBack() {
    const contactRole = String(answers.contact_role ?? "");
    const skippedToResultFromDecisionMaker = step === 8
      && (contactRole === "salesperson"
        || contactRole === "reception"
        || (contactRole === "manager" && answers.participates_decisions === "no"))
      && answers.reached_decision_maker !== "yes";
    const previousStep = skippedToResultFromDecisionMaker
      ? 1
      : step === 8 && answers.demo_accepted === "yes"
        ? 6
        : step === 7 && answers.accepted_thirty_seconds === "no"
          ? 1
          : Math.max(0, step - 1);
    if (readOnly) {
      setStep(previousStep);
      return;
    }
    if (await persist(previousStep)) setStep(previousStep);
  }

  async function saveAndClose() {
    if (await persist(step)) {
      toast.success("Progresso salvo.");
      onOpenChange(false);
    }
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (nextOpen || readOnly || saving) {
      onOpenChange(nextOpen);
      return;
    }
    void persist(step).then((saved) => {
      if (saved) onOpenChange(false);
    });
  }

  if (!lead || !flow) return null;
  const progress = Math.round(((step + 1) / STEP_TITLES.length) * 100);

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <div>
              <DialogTitle>Script Flow · {lead.name}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">{script.title} · Etapa {step + 1} de {STEP_TITLES.length} — {STEP_TITLES[step]}</p>
            </div>
            <Badge variant={readOnly ? "secondary" : "outline"}>{readOnly ? "Concluído" : `${progress}%`}</Badge>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-3">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="border-accent/40 text-accent gap-1">
              <Quote className="w-3 h-3" /> Grifado: leia para o cliente
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Info className="w-3 h-3" /> Cinza: orientação interna
            </Badge>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-1 py-3">
          <SalesFlowStep step={step} lead={lead} script={script} answers={answers} readOnly={readOnly} onChange={changeAnswer} />
        </div>

        <DialogFooter className="border-t border-border pt-4 sm:justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={goBack} disabled={step === 0 || saving}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            {!readOnly && (
              <Button variant="ghost" onClick={saveAndClose} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> Salvar e fechar
              </Button>
            )}
          </div>
          <Button onClick={goNext} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            {step === STEP_TITLES.length - 1
              ? <>{readOnly ? "Fechar" : "Concluir"} <CheckCircle2 className="w-4 h-4 ml-1" /></>
              : <>Avançar <ChevronRight className="w-4 h-4 ml-1" /></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
