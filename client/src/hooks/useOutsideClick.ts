import { useEffect, RefObject } from "react";
function useOutsideClick(
  callback: () => void,
  refs: RefObject<HTMLElement | null | undefined>[],
  ignoreModal = false
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const modal = document.querySelector(".modalWrapper");
      if (modal && modal.contains(event.target as Node) && !ignoreModal) {
        return;
      }

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
  }, [refs, callback, ignoreModal]);
}
export default useOutsideClick;
