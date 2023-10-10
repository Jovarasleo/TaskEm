import { useEffect, RefObject } from "react";
function useOutsideClick(callback: () => void, el: RefObject<HTMLElement | null | undefined>) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (el?.current && !el?.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [el, callback]);
}
export default useOutsideClick;
