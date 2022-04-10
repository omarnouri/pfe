import { IChaine } from 'app/entities/chaine/chaine.model';

export interface IAnomalie {
  id?: number;
  msgAno?: string;
  msgSol?: string | null;
  chaine?: IChaine | null;
}

export class Anomalie implements IAnomalie {
  constructor(public id?: number, public msgAno?: string, public msgSol?: string | null, public chaine?: IChaine | null) {}
}

export function getAnomalieIdentifier(anomalie: IAnomalie): number | undefined {
  return anomalie.id;
}
