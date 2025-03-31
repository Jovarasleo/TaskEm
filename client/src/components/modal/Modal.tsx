import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { CSSTransition } from "react-transition-group";
import { ReactNode, useRef } from "react";
import Button from "../button/Button";

interface Props {
  width?: number;
  visible?: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const Modal = ({ children, width, visible, onConfirm, onCancel }: Props) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(onCancel, [nodeRef]);

  return (
    <>
      {createPortal(
        <CSSTransition
          in={visible}
          timeout={300}
          nodeRef={nodeRef}
          classNames={{
            enterActive: styles.animateModal,
            enterDone: styles.animateModal,
          }}
          unmountOnExit
        >
          <div className={styles.modalWrapper}>
            <div style={{ maxWidth: width }} className={styles.modal} ref={nodeRef}>
              {children ? (
                children
              ) : (
                <div className={styles.modalButtonsWrapper}>
                  <Button
                    type="select"
                    onClick={() => {
                      onConfirm && onConfirm();
                      onCancel();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button onClick={() => onCancel()}>Cancel</Button>
                </div>
              )}
            </div>
          </div>
        </CSSTransition>,
        document.querySelector("#app") || document.body
      )}
    </>
  );
};
export default Modal;
