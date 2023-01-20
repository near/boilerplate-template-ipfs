# IPFS NEAR Contract

The smart contract exposes two methods to enable storing and retrieving a file references in the NEAR network.

```ts
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
```

<br />
# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16.
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

<br />

## 1. Build and Deploy the Contract
You can automatically compile and deploy the contract in the NEAR testnet by running:

```bash
npm run deploy
```

Once finished, check the `neardev/dev-account` file to find the address in which the contract was deployed:

```bash
cat ./neardev/dev-account
# e.g. dev-1659899566943-21539992274727
```

<br />

## 2. Retrieve the file references

`get_files` is a read-only method (aka `view` method).

`View` methods can be called for **free** by anyone, even people **without a NEAR account**!

```bash
# Use near-cli to get the greeting
near view <dev-account> get_files '{"account_id":"your account id"}'
```

<br />

## 3. Store a file reference
`add_file` changes the contract's state, for which it is a `call` method.

`Call` methods can only be invoked using a NEAR account, since the account needs to pay GAS for the transaction.

```bash
# Use near-cli to set a new greeting
near call <dev-account> add_file '{"cid":"cid", "name": "file name"}' --accountId <dev-account>
```

**Tip:** If you would like to call `add_file` using your own account, first login into NEAR using:

```bash
# Use near-cli to login your NEAR account
near login
```

and then use the logged account to sign the transaction: `--accountId <your-account>`.