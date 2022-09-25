export interface IArticle {
  title?: string;
  subtitle?: string;
  content?: string;
  pubDate: string;
}

export class Article implements IArticle {
  constructor(public title?: string, public subtitle?: string, public content?: string, public pubDate: string = '1990') {}
}
