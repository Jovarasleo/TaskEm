import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { CSSTransition } from "react-transition-group";
import { ReactNode, useRef } from "react";
import Button from "../button/Button";
import clsx from "clsx";

interface Props {
  width?: number;
  visible?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const Modal = ({ children, width, visible, onConfirm, onCancel }: Props) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(onCancel, [nodeRef], true);
  //TODO: fix modal looks

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
          <div
            className={clsx(styles.modalWrapper, "z-10001")}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div style={{ maxWidth: width }} className={styles.modal} ref={nodeRef}>
              {children ? (
                children
              ) : (
                <div className={clsx(styles.modalButtonsWrapper, "z-10001")}>
                  <Button
                    type="select"
                    onClick={() => {
                      onConfirm();
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
