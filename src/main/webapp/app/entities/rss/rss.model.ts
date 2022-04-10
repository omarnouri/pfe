export interface IRss {
  id?: number;
  titre?: string;
  url?: string;
  estActive?: boolean | null;
}

export class Rss implements IRss {
  constructor(public id?: number, public titre?: string, public url?: string, public estActive?: boolean | null) {
    this.estActive = this.estActive ?? false;
  }
}

export function getRssIdentifier(rss: IRss): number | undefined {
  return rss.id;
}
