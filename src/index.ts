import Arweave from "arweave";
import Transaction from "arweave/node/lib/transaction";
import FileType from "file-type";
import {JWKInterface} from "arweave/node/lib/wallet";

import ArDB from 'ardb';
import {GQLEdgeTransactionInterface, GQLTransactionInterface} from "ardb/lib/faces/gql";

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

const ardb = new ArDB(client);


const APP_NAME = "MessageChoice - DEV"

const addTags = (
  tx: Transaction,
  tags?: { name: string; value: string }[]
): Transaction => {
  const allTags = [
    // add default tags
    {name: "App-Name", value: APP_NAME},
    {name: "App-Version", value: "0.0.0"},
    // add custom tags
    ...(tags || []),
  ];

  for (const tag of allTags) {
    tx.addTag(tag.name, tag.value);
  }

  return tx;
};

const defaultQuery = ardb.search('transactions').tag("App-Name", APP_NAME)

// publish public content
export const publish = async (data: Buffer, jwk: JWKInterface | "use_wallet" = "use_wallet"): Promise<string> => {
  const res = await FileType.fromBuffer(data);
  const type = res?.mime || "text/plain";

  const tx = await client.createTransaction(
    {
      data,
    },
    jwk
  );

  addTags(tx, [{name: "Content-Type", value: type}, {name: "Action", value: "Publish"}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};

// send private data content
export const send = async (data: Buffer, address: string, jwk: JWKInterface | "use_wallet" = "use_wallet"): Promise<string> => {
  const res = await FileType.fromBuffer(data);
  const type = res?.mime || "text/plain";

  // todo encrypt data

  const tx = await client.createTransaction(
    {
      data,
      target: address,
    },
    jwk
  );

  addTags(tx, [{name: "Content-Type", value: type}, {name: "Action", value: "Message"}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};

// load public feed
export const feed = async (from_address: string | string[]) => {
  const transactions = await ardb.search('transactions').tag("App-Name", APP_NAME).from(from_address).tag('Action', 'Publish').findAll() as GQLEdgeTransactionInterface[];

  const data: any[] = []

  for (let tx of transactions) {
    const res = await client.transactions.getData(tx.node.id, {
      decode: true,
      string: true,
    });

    data.push({
        data: res.toString(),
        from: tx.node.owner.address,
        timestamp: tx.node.block.timestamp,
        to: tx.node.recipient
      }
    );
  }
  return data
};

// load messages with another address
export const messages = async (from_address: string, to_address: string) => {
  return await defaultQuery.from(from_address).to(to_address).tag('Action', 'Message').findAll();
};

// subscribe to address
export const subscribe = async (address: string, jwk: JWKInterface | "use_wallet" = "use_wallet") => {
  const tx = await client.createTransaction(
    {
      data: Math.random().toString().slice(-4),
      target: address,
    },
    jwk
  );

  addTags(tx, [{name: "Action", value: "Subscribe"}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};

// unsubscribe from address
export const unsubscribe = async (address: string, jwk: JWKInterface | "use_wallet" = "use_wallet") => {
  const tx = await client.createTransaction(
    {
      data: Math.random().toString().slice(-4),
      target: address,
    },
    jwk
  );

  addTags(tx, [{name: "Action", value: "Unsubscribe"}]);
  await client.transactions.sign(tx, jwk);
  await client.transactions.post(tx);

  return tx.id;
};
