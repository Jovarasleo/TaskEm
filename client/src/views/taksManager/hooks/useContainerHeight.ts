import { useEffect, RefObject } from "react";

const useContainerHeight = (
  textAreaRef: RefObject<HTMLElement | null>,
  input: string,
  inputField: boolean
) => {
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, input, inputField]);
};
export default useContainerHeight;
