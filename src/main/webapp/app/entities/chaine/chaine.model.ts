import { IAnomalie } from 'app/entities/anomalie/anomalie.model';

export interface IChaine {
  id?: number;
  libelle?: string;
  process?: string;
  anomalies?: IAnomalie[] | null;
}

export class Chaine implements IChaine {
  constructor(public id?: number, public libelle?: string, public process?: string, public anomalies?: IAnomalie[] | null) {}
}

export function getChaineIdentifier(chaine: IChaine): number | undefined {
  return chaine.id;
}
