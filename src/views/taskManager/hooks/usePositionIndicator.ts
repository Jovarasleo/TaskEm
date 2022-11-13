import { useEffect, useState } from "react";

const usePositionIndicator = (
  toContainer: string,
  container: string,
  nextIndex: number | null,
  index: number,
  arrayLength: number
) => {
  const [pointer, setPointer] = useState("");

  useEffect(() => {
    if (toContainer === container) {
      if (nextIndex === index) {
        setPointer("before");
      }
      if (nextIndex === index + 1 && nextIndex >= arrayLength) {
        setPointer("after");
      }
      return () => {
        setPointer("");
      };
    }
  }, [toContainer, container, nextIndex, index]);

  return pointer;
};
export default usePositionIndicator;
