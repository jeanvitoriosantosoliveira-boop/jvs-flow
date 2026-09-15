import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info, Quote } from "lucide-react";
import {
  CALL_OBJECTIVE, CENTRAL_PHRASES, DECISION_MAKER_GUIDANCE, DEMO_CONFIRMATION,
  DEFAULT_STORE_OBSERVATION, DEMO_INVITATION, DIAGNOSTIC_QUESTIONS, FINAL_OBJECTIVE, OBJECTIONS,
  OPENING_SCRIPT, PRE_CALL_CHECKLIST, RECEPTION_QUESTION_RESPONSE, SOLUTION_SCRIPT,
  THIRTY_SECONDS_CONTEXT, THIRTY_SECONDS_SCRIPT, TURN_GUIDANCE, TURN_SCRIPT,
} from "@/data/vehicleStoreSalesScript";
import type { SalesFlowAnswers, SalesFlowAnswerValue, SalesFlowLead } from "@/types/salesFlow";

interface SalesFlowStepProps {
  step: number;
  lead: SalesFlowLead;
  answers: SalesFlowAnswers;
  readOnly: boolean;
  onChange: (key: string, value: SalesFlowAnswerValue) => void;
}

function ScriptBlock({ title, lines }: { title: string; lines: readonly string[] }) {
  return (
    <Card className="p-4 bg-accent/10 border-accent/40 border-l-4 border-l-accent">
      <p className="text-xs font-bold uppercase tracking-wide text-accent mb-2 flex items-center gap-1.5">
        <Quote className="w-3.5 h-3.5" /> Leia para o cliente · {title}
      </p>
      <div className="space-y-2 text-sm font-medium">
        {lines.map((line) => <p key={line}>“{line}”</p>)}
      </div>
    </Card>
  );
}

function ContextBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
      <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" /> Orientação para o vendedor
      </p>
      {children}
    </div>
  );
}

function TextAnswer({ id, label, value, readOnly, rows = 3, onChange }: {
  id: string;
  label: string;
  value: string;
  readOnly: boolean;
  rows?: number;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} rows={rows} disabled={readOnly} onChange={(event) => onChange(id, event.target.value)} />
    </div>
  );
}

function Choice({ id, label, value, readOnly, onChange }: {
  id: string;
  label: string;
  value: string;
  readOnly: boolean;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} disabled={readOnly} onValueChange={(next) => onChange(id, next)}>
        <SelectTrigger><SelectValue placeholder="Selecione a resposta" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Sim</SelectItem>
          <SelectItem value="no">Não</SelectItem>
          <SelectItem value="partial">Parcialmente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function SalesFlowStep({ step, lead, answers, readOnly, onChange }: SalesFlowStepProps) {
  const text = (key: string) => typeof answers[key] === "string" ? answers[key] as string : "";
  const selectedObjections = Array.isArray(answers.objections) ? answers.objections as string[] : [];
  const contactRole = text("contact_role") as keyof typeof DECISION_MAKER_GUIDANCE | "";
  const leadName = lead.name || lead.company || "responsável";
  const observation = text("specific_observation") || DEFAULT_STORE_OBSERVATION;
  const replaceTokens = (line: string) => line.replace("[NOME]", leadName).replace("[OBSERVAÇÃO ESPECÍFICA]", observation);

  if (step === 0) {
    return (
      <div className="space-y-5">
        <ContextBlock>
          <p className="font-medium text-foreground">{CALL_OBJECTIVE.title}</p>
          <p>{CALL_OBJECTIVE.description}</p>
          <p className="mt-2">{CALL_OBJECTIVE.change}</p>
        </ContextBlock>
        <TextAnswer id="specific_observation" label="Observação real sobre a loja (opcional)" value={text("specific_observation")} readOnly={readOnly} onChange={onChange} />
        <ContextBlock>Se ficar vazio, será utilizado: “{DEFAULT_STORE_OBSERVATION}”.</ContextBlock>
        <div className="space-y-2">
          <Label>Checklist antes de ligar</Label>
          {PRE_CALL_CHECKLIST.map((item, index) => {
            const key = `checklist_${index}`;
            return (
              <label key={item} className="flex items-start gap-2 text-sm">
                <Checkbox checked={answers[key] === true} disabled={readOnly} onCheckedChange={(checked) => onChange(key, checked === true)} />
                <span>{item}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 1) {
    const guidance = contactRole ? DECISION_MAKER_GUIDANCE[contactRole] : null;
    const needsResponsible = contactRole === "salesperson" || contactRole === "reception" || (contactRole === "manager" && text("participates_decisions") === "no");
    const canPitch = contactRole === "owner"
      || (contactRole === "manager" && !!text("participates_decisions") && text("participates_decisions") !== "no")
      || (needsResponsible && text("reached_decision_maker") === "yes");
    return (
      <div className="space-y-5">
        <ScriptBlock title="Abertura — identificar o responsável" lines={OPENING_SCRIPT.map(replaceTokens)} />
        <div className="space-y-1.5">
          <Label>Qual é a função de quem atendeu? *</Label>
          <Select value={contactRole} disabled={readOnly} onValueChange={(value) => onChange("contact_role", value)}>
            <SelectTrigger><SelectValue placeholder="Selecione o perfil" /></SelectTrigger>
            <SelectContent>
              {Object.entries(DECISION_MAKER_GUIDANCE).map(([id, item]) => <SelectItem key={id} value={id}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {guidance && <ScriptBlock title="Fala conforme quem atendeu" lines={[guidance.script]} />}
        {contactRole === "manager" && (
          <>
            <Choice id="participates_decisions" label="Participa das decisões comerciais e de divulgação?" value={text("participates_decisions")} readOnly={readOnly} onChange={onChange} />
            {text("participates_decisions") === "yes" && <ScriptBlock title="Continue" lines={["Perfeito, então consegue me ajudar."]} />}
            {text("participates_decisions") === "no" && <ScriptBlock title="Continue" lines={["Tranquilo. Quem normalmente cuida dessa parte aí na loja?"]} />}
          </>
        )}
        {contactRole === "reception" && (
          <>
            <Choice id="asked_call_subject" label="Perguntou sobre o assunto da ligação?" value={text("asked_call_subject")} readOnly={readOnly} onChange={onChange} />
            {text("asked_call_subject") === "yes" && <ScriptBlock title="Resposta sugerida" lines={[RECEPTION_QUESTION_RESPONSE]} />}
          </>
        )}
        {needsResponsible && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Nome do responsável</Label><Input value={text("decision_maker_name")} disabled={readOnly} onChange={(event) => onChange("decision_maker_name", event.target.value)} /></div>
              <div className="space-y-1.5"><Label>Melhor horário para contato</Label><Input value={text("best_contact_time")} disabled={readOnly} onChange={(event) => onChange("best_contact_time", event.target.value)} /></div>
            </div>
            <Choice id="reached_decision_maker" label="Conseguiu falar com o responsável durante esta ligação?" value={text("reached_decision_maker")} readOnly={readOnly} onChange={onChange} />
            {text("reached_decision_maker") === "no" && (
              <p className="text-sm text-warning">O fluxo seguirá diretamente para o resultado da ligação.</p>
            )}
          </>
        )}
        {canPitch && (
          <>
            <Choice id="accepted_thirty_seconds" label="A pessoa aceitou ouvir os 30 segundos?" value={text("accepted_thirty_seconds")} readOnly={readOnly} onChange={onChange} />
            {text("accepted_thirty_seconds") === "no" && (
              <TextAnswer id="opening_reaction" label="O que ela respondeu?" value={text("opening_reaction")} readOnly={readOnly} onChange={onChange} />
            )}
          </>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-5">
        <ScriptBlock title="Se ele topar os 30 segundos" lines={THIRTY_SECONDS_SCRIPT} />
        <TextAnswer id="google_hook_answer" label="O que o cliente disse sobre o que encontra no Google?" value={text("google_hook_answer")} readOnly={readOnly} onChange={onChange} />
        <ContextBlock>{THIRTY_SECONDS_CONTEXT} Agora faça somente as quatro perguntas decisórias, uma por vez, sem falar de site.</ContextBlock>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-5">
        <ContextBlock>Faça uma pergunta por vez. Escute, registre e não antecipe a solução.</ContextBlock>
        {DIAGNOSTIC_QUESTIONS.map((question) => (
          <Card key={question.id} className="p-4 space-y-4">
            <p className="font-semibold text-sm">{question.title}</p>
            <ScriptBlock title="Pergunta" lines={[replaceTokens(question.prompt)]} />
            <TextAnswer id={question.id} label="Resposta do cliente" value={text(question.id)} readOnly={readOnly} onChange={onChange} />
            {"followUp" in question && (
              <>
                <ScriptBlock title="Pergunta de conclusão" lines={[question.followUp]} />
                <TextAnswer id={question.followUpId} label="Resposta do cliente" value={text(question.followUpId)} readOnly={readOnly} onChange={onChange} />
              </>
            )}
          </Card>
        ))}
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-5">
        <ContextBlock>{TURN_GUIDANCE}</ContextBlock>
        <ScriptBlock title="A virada" lines={[TURN_SCRIPT]} />
        <TextAnswer id="turn_summary" label="Resumo personalizado da operação" value={text("turn_summary")} readOnly={readOnly} rows={5} onChange={onChange} />
        <Choice id="summary_confirmed" label="O cliente confirmou seu entendimento?" value={text("summary_confirmed")} readOnly={readOnly} onChange={onChange} />
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="space-y-5">
        <ScriptBlock title="Apresentação da solução" lines={SOLUTION_SCRIPT} />
        <TextAnswer id="solution_reaction" label="Reação e observações do cliente" value={text("solution_reaction")} readOnly={readOnly} onChange={onChange} />
      </div>
    );
  }

  if (step === 6) {
    const invitation = DEMO_INVITATION
      .replace("[OPÇÃO 1]", text("demo_option_one") || "[OPÇÃO 1]")
      .replace("[OPÇÃO 2]", text("demo_option_two") || "[OPÇÃO 2]");
    return (
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Primeira opção</Label><Input type="datetime-local" value={text("demo_option_one")} disabled={readOnly} onChange={(event) => onChange("demo_option_one", event.target.value)} /></div>
          <div className="space-y-1.5"><Label>Segunda opção</Label><Input type="datetime-local" value={text("demo_option_two")} disabled={readOnly} onChange={(event) => onChange("demo_option_two", event.target.value)} /></div>
        </div>
        <ScriptBlock title="Convite para demonstração" lines={[invitation]} />
        <Choice id="demo_accepted" label="A demonstração foi aceita?" value={text("demo_accepted")} readOnly={readOnly} onChange={onChange} />
        {text("demo_accepted") === "yes" && (
          <>
            <div className="space-y-1.5"><Label>Horário confirmado</Label><Input type="datetime-local" value={text("demo_scheduled_at")} disabled={readOnly} onChange={(event) => onChange("demo_scheduled_at", event.target.value)} /></div>
            <ScriptBlock title="Confirmação" lines={[DEMO_CONFIRMATION]} />
          </>
        )}
        {text("demo_accepted") === "no" && <p className="text-sm text-warning">Avance para registrar a objeção e usar a resposta recomendada.</p>}
      </div>
    );
  }

  if (step === 7) {
    const toggleObjection = (id: string, checked: boolean) => {
      onChange("objections", checked ? [...selectedObjections, id] : selectedObjections.filter((item) => item !== id));
    };
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Marque as objeções apresentadas. A resposta correspondente aparecerá durante a call.</p>
        {OBJECTIONS.map((objection) => {
          const checked = selectedObjections.includes(objection.id);
          return (
            <Card key={objection.id} className={`p-4 ${checked ? "border-primary/40" : ""}`}>
              <label className="flex items-start gap-2 font-medium text-sm">
                <Checkbox checked={checked} disabled={readOnly} onCheckedChange={(value) => toggleObjection(objection.id, value === true)} />
                <span>“{objection.label}”</span>
              </label>
              {checked && <div className="mt-3"><ScriptBlock title="Resposta sugerida" lines={[objection.response]} /></div>}
            </Card>
          );
        })}
        <TextAnswer id="objection_notes" label="Resposta do cliente após tratar as objeções" value={text("objection_notes")} readOnly={readOnly} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Resultado da ligação *</Label>
        <Select value={text("call_outcome")} disabled={readOnly} onValueChange={(value) => onChange("call_outcome", value)}>
          <SelectTrigger><SelectValue placeholder="Selecione o resultado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="demo_scheduled">Demonstração agendada</SelectItem>
            <SelectItem value="call_back">Falar com o decisor depois</SelectItem>
            <SelectItem value="follow_up">Manter em acompanhamento</SelectItem>
            <SelectItem value="no_interest">Sem interesse</SelectItem>
            <SelectItem value="no_contact">Não foi possível falar</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TextAnswer id="final_notes" label="Resumo final da ligação" value={text("final_notes")} readOnly={readOnly} rows={5} onChange={onChange} />
      <ScriptBlock title="Frases centrais" lines={CENTRAL_PHRASES} />
      <ContextBlock><strong>Objetivo final:</strong> {FINAL_OBJECTIVE}</ContextBlock>
    </div>
  );
}
