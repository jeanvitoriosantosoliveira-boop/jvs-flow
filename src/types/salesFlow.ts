import type { Json } from "@/integrations/supabase/types";

export type SalesFlowStatus = "in_progress" | "completed" | "abandoned";
export type SalesFlowAnswerValue = string | boolean | string[] | null;
export type SalesFlowAnswers = Record<string, SalesFlowAnswerValue>;

export interface SalesFlowLead {
  id: string;
  name: string;
  company: string | null;
  niche?: string | null;
  owner_id: string | null;
}

export interface LeadScriptFlow {
  id: string;
  lead_id: string;
  created_by: string;
  script_key: string;
  script_version: number;
  status: SalesFlowStatus;
  current_step: number;
  answers: Json;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
