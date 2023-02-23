import { useGenerateId } from "../useGenerateId";

describe("uid", () => {
  it("should return a unique string", () => {
    const id1 = useGenerateId();
    const id2 = useGenerateId();

    expect(typeof id1).toBe("string");
    expect(id1).not.toEqual(id2);
  });
});
