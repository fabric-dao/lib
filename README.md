# Fabric-DAO

## Installation
```
yarn add @fabric-dao/lib
```

## Usage
```ts
import { send, publish, messages, feed } from "@fabric-dao/lib";
```

### Sending a private message
```ts
const data = Buffer.from("This is a test")
const receiver = "..."
const txID = await send(data, receiver)
```

### Publishing content
```ts
const data = Buffer.from("This is a test")
const txID = await publish(data)
```

#### Using a JWK
By default Message Choice uses [ArConnect](https://arconnect.io) to handle transactions.
If you want to use a JWK simply add it as a parameter into `send(data, receiver, jwk)` or `publish(data, jwk)`

### Retrieving messages
```ts
const from_address = "..."
const to_address = "..."
const allMessages = await messages(from_address, to_address)
```

### Retrieving published content
```ts
const from_address = "..."
const content = await feed(from_address)
```