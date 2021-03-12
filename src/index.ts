import Arweave from "arweave";
import Transaction from "arweave/node/lib/transaction";
import FileType from "file-type";

const client = new Arweave({});

const addTags = (
  tx: Transaction,
  tags?: { name: string; value: string }[]
): Transaction => {
  const allTags = [
    // add default tags
    {name: "App-Name", value: "MessageChoice - DEV"},
    {name: "App-Version", value: "0.0.0"},
    // add custom tags
    ...(tags || []),
  ];

  for (const tag of allTags) {
    tx.addTag(tag.name, tag.value);
  }

  return tx;
};

// publish public content
export const publish = async (data: Buffer): Promise<string> => {
  const res = await FileType.fromBuffer(data);
  const type = res?.mime || "text/plain";

  const tx = await client.createTransaction(
    {
      data,
    },
    jwk
  );

  addTags(tx, [{name: "Content-Type", value: type}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};

// send private data content
export const send = async (data: Buffer, address: string): Promise<string> => {
  const res = await FileType.fromBuffer(data);
  const type = res?.mime || "text/plain";

  const tx = await client.createTransaction(
    {
      data,
      target: address,
    },
    jwk
  );

  addTags(tx, [{name: "Content-Type", value: type}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};

// load my public feed
export const feed = () => {
};

// load messages with another address
export const messages = (address: string) => {
};

// subscribe to address
// todo maybe as smart contract
export const subscribe = (address: string) => {
};

// unsubscribe from address
// todo maybe as smart contract
export const unsubscribe = (address: string) => {
};
