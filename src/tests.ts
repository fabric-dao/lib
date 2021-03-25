import {
  publish,
  send
} from ".";
import {assert} from "chai";

describe("Testing Message Choice", () => {
  it("Publish content", (done) => {
    const data = Buffer.from("This is a test")
    publish(data, "use_wallet").then((id) => {
      console.log(id)
      assert(!!id)
    }).finally(() => {
      done()
    })
  });
  it("Send message", (done) => {
    const data = Buffer.from("This is a test")
    const receiver = ""
    send(data, receiver, "use_wallet").then((id) => {
      console.log(id)
      assert(!!id)
    }).finally(() => {
      done()
    })
  });
});