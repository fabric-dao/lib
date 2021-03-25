import {
  publish,
  send
} from ".";
import {assert} from "chai";

describe("Testing Message Choice", () => {
  it("Publish content", (done) => {
    const data = Buffer.from("This is a test")
    publish(data).then((id) => {
      console.log(id)
      assert(!!id)
    }).finally(() => {
      done()
    })
  });
  it("Send message", (done) => {
    const data = Buffer.from("This is a test")
    const receiver = ""
    send(data, receiver).then((id) => {
      console.log(id)
      assert(!!id)
    }).finally(() => {
      done()
    })
  });
});