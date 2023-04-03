import { useEffect, RefObject } from "react";
function useOutsideClick(
  callback: () => void,
  el: RefObject<HTMLElement | null | undefined>
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (el?.current && !el?.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [el, callback]);
}
export default useOutsideClick;
