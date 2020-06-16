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

export enum ReasonTypeKey {
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

export interface ReasonType {
  key: ReasonTypeKey;
  label: string;
}

export type ReasonTypes = SelectList<
  SelectListItem<ReasonType, string>,
  ReasonType
>;

export type Freshman = string; // it: Matricola

export type Quantity = number;

export interface NewMovement {
  TipoCausale: ReasonTypeKey;
  Matricole: Freshman[];
  Quantita: Quantity[];
}

export type SelectList<T, K> = { data: T[]; default: K };
export type SelectListItem<K, V> = { key: K; value: V };

export interface BarcodeDecode {
  Tipo: string;
  Id: number;
}

export enum ActionTypeKey {
  MachineAndOperator = 1,
  Machine = 2,
  Operator = 3,
}

export interface ActionType {
  key: ActionTypeKey;
  label: string;
}

export interface StartProcessing {
  //TODO: complete this type with api docs (not available until now!)
}
