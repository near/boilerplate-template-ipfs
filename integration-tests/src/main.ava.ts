import { Worker, NearAccount } from "near-workspaces";
import anyTest, { TestFn } from "ava";
import { File } from "../../contract/src/types";

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount("contract-account");
  const testAccount = await root.createSubAccount("test-account");
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2]);

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, testAccount };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed to stop the Sandbox:", error);
  });
});

test("returns the default set of files", async (t) => {
  const { root, contract } = t.context.accounts;
  const files: File[] = await contract.view("get_files", {
    account_id: root.accountId,
  });
  t.is(files.length, 0);
});

test("uploads a file", async (t) => {
  const { root, contract, testAccount } = t.context.accounts;

  const testFile1 = {
    cid: "QmYswJPDbPhSp15KsRwh69D1AAYPCZhtKA688UY3evHWye",
    name: "a_file.png",
  };

  const testFile2 = {
    cid: "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR",
    name: "another_file.png",
  };

  await root.call(contract, "add_file", testFile1);
  const rootFiles: File[] = await contract.view("get_files", {
    account_id: root.accountId,
  });
  t.deepEqual(rootFiles, [testFile1]);

  await testAccount.call(contract, "add_file", testFile2);
  const testAccountFiles: File[] = await contract.view("get_files", {
    account_id: testAccount.accountId,
  });
  t.deepEqual(testAccountFiles, [testFile2]);

  // Ensure our 2 accounts have 2 different files on-chain.
  t.notDeepEqual(rootFiles, testAccountFiles);
});
