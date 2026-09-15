export interface SalesScriptGuidance {
  label: string;
  script: string;
}

export interface SalesScriptQuestion {
  id: string;
  title: string;
  prompt: string;
  context?: string;
  followUpId?: string;
  followUp?: string;
  followUpWhenIncludes?: readonly string[];
}

export interface SalesScriptObjection {
  id: string;
  label: string;
  response: string;
}

export interface SalesScriptDefinition {
  key: string;
  version: number;
  title: string;
  defaultObservation: string;
  callObjective: {
    title: string;
    description: string;
    change: string;
  };
  openingScript: readonly string[];
  thirtySecondsScript: readonly string[];
  thirtySecondsContext: string;
  decisionMakerGuidance: Record<"owner" | "manager" | "salesperson" | "reception", SalesScriptGuidance>;
  receptionQuestionResponse: string;
  diagnosticQuestions: readonly SalesScriptQuestion[];
  turnGuidance: string;
  turnScript: string;
  solutionScript: readonly string[];
  valueScript: readonly string[];
  demoInvitation: string;
  demoConfirmation: string;
  objections: readonly SalesScriptObjection[];
  centralPhrases: readonly string[];
  preCallChecklist: readonly string[];
  finalObjective: string;
}
