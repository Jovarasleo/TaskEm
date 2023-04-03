import { uid } from "../util/uid";

describe("uid", () => {
  it("should return a unique string", () => {
    const id1 = uid();
    const id2 = uid();

    expect(typeof id1).toBe("string");
    expect(id1).not.toEqual(id2);
  });
});
