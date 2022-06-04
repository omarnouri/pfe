export interface IFile {
  name?: string;
  type?: string;
  size?: number;
  updateDate: number;
}

export class File implements IFile {
  constructor(public name?: string, public type?: string, public size?: number, public updateDate: number = new Date().getTime()) {}
}
