import { IRss } from 'app/entities/rss/rss.model';

export interface IClient {
  id?: number;
  nameCl?: string;
  logo?: string | null;
  pathLogs?: string | null;
  type?: string | null;
  rsses?: IRss[] | null;
}

export class Client implements IClient {
  constructor(
    public id?: number,
    public nameCl?: string,
    public logo?: string | null,
    public pathLogs?: string | null,
    public type?: string | null,
    public rsses?: IRss[] | null
  ) {}
}

export function getClientIdentifier(client: IClient): number | undefined {
  return client.id;
}
