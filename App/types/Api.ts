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

// export interface Reason {
//   IdCausale: number;
//   Codice: string;
//   Descrizione: string;
// }

// export type Reasons = Reason[];

export interface Movement {
  IdMovimento: number;
  Data: string;
  // TODO: to complete
}

export enum ReasonType {
  Specified = 0,
  UnloadProd = 1,
  LoadProd = 2,
  LoadRemnant = 3,
  LoadScrap = 4,
  // 0 = Specificata (valorizzare il campo IdCausale con la causale desiderata),
  // 1 = Scarico per Produzione,
  // 2 = Carico da Produzione,
  // 3 = Carico Avanzo,
  // 4 = Carico Scarto
}

export type ReasonTypes = SelectList<
  SelectListItem<ReasonType, string>,
  ReasonType
>;

export type Freshman = string; // it: Matricola

export type Quantity = number;

export interface NewMovement {
  TipoCausale: ReasonType;
  Matricole: Freshman[];
  Quantita: Quantity[];
}

export type SelectList<T, K> = { data: T[]; default: K };
export type SelectListItem<K, V> = { key: K; value: V };