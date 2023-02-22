import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import Button from "../button/Button";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useRef } from "react";

const Modal = ({ children, onConfirm, onCancel, visible }: any) => {
  const outsideModalRef = useRef<HTMLDialogElement | null>(null);

  useOutsideClick(onCancel, outsideModalRef);

  return (
    <>
      {createPortal(
        // <div className={styles.modalWrapper}>
        <dialog className={styles.modal} ref={outsideModalRef} open={visible}>
          <Button onClick={() => onConfirm()}>confirm</Button>
          <Button onClick={() => onCancel()}>cancel</Button>
        </dialog>,
        document.querySelector("#app") || document.body
      )}
    </>
  );
};
export default Modal;
