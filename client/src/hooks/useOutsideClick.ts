import { useEffect, RefObject } from "react";
function useOutsideClick(callback: () => void, refs: RefObject<HTMLElement | null | undefined>[]) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        refs.every((el) => el?.current) &&
        refs.every((el) => !el?.current?.contains(event.target as Node))
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [refs, callback]);
}
export default useOutsideClick;
