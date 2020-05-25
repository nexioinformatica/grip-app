export interface Operator {
  // IdOperatore: 10,
  // Nome: "Operatore 1",
  // Sigla: null,
  // UserName: "operatore1",
  // Attivo: true,
  // AbilitatoAPI: true,
  // AbilitatoAttivitaReparto: true
  IdOperatore: number;
  Nome: string;
  Sigla: string;
  UserName: string;
  Attivo: boolean;
  AbilitatoAPI: boolean;
  AbilitatoAttivitaReparto: boolean;
}

export type Operators = Operator[];
