export class File {
  cid: string;
  name: string;

  constructor({ cid, name }: File) {
    this.cid = cid;
    this.name = name;
  }
}
