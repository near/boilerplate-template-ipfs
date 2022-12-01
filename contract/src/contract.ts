import { NearBindgen, near, call, view, UnorderedMap } from "near-sdk-js";
import { File } from "./types";

@NearBindgen({})
class FilesNear {
  files: UnorderedMap<File[]> = new UnorderedMap<File[]>("ipfs-files");

  @call({})
  add_file({ cid, name }: { cid: string; name: string }) {
    const sender = near.predecessorAccountId();
    const senders_files = this.files.get(sender) || [];
    senders_files.push(new File({ cid, name }));
    this.files.set(sender, senders_files);
  }

  @view({})
  get_files({
    account_id,
    from_index = 0,
    limit = 10,
  }: {
    account_id: string;
    from_index: number;
    limit: number;
  }): File[] {
    const files = this.files.get(account_id);
    if (!files) {
      return [];
    }
    return files.slice(from_index, from_index + limit);
  }
}
