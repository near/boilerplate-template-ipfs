/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class FilesNEAR {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async getFiles({ accountId }) {
    return await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_files',
      args: { account_id: accountId },
    });
  }

  async addFile({ cid, name }) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'add_file',
      args: { cid, name },
    });
  }
}
