import styles from "./modal.module.scss";
import { createPortal } from "react-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { CSSTransition } from "react-transition-group";
import { ReactNode, useEffect, useRef } from "react";
import { IoIosClose } from "react-icons/io";
import Button from "../button/Button";
import clsx from "clsx";

interface Props {
  title?: string;
  width?: number;
  visible?: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmText?: string;
}

const Modal = ({
  children,
  width,
  visible,
  onCancel,
  title,
  onConfirm,
  confirmDisabled = false,
  confirmText = "Create",
}: Props) => {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useOutsideClick(onCancel, [modalRef], true);

  useEffect(() => {
    if (visible && closeButtonRef.current) {
      closeButtonRef.current?.focus();
    }
  }, [visible]);

  //TODO: fix modal looks
  return (
    <>
      {createPortal(
        <CSSTransition
          in={visible}
          timeout={200}
          nodeRef={backdropRef}
          classNames={{
            enterActive: styles.animateModal,
            enterDone: styles.animateModal,
          }}
          unmountOnExit
        >
          <div
            id="modal-backdrop"
            className="z-10001 bg-neutral-900/75 absolute inset-0 opacity-0 transition-opacity transition-duration-200"
            ref={backdropRef}
            onKeyDown={(e) => (e.key === "Escape" ? onCancel() : {})}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div
              ref={modalRef}
              style={{ maxWidth: width }}
              className={clsx(styles.modal, "bg-white p-4 relatie")}
            >
              <button
                ref={closeButtonRef}
                onClick={onCancel}
                className="group cursor-pointer float-right"
              >
                <IoIosClose className="size-7 group-hover:text-orange-400 transition-colors" />
              </button>
              {title && <h4 className="mb-4 text-xl">{title}</h4>}
              {children}
              {onConfirm && (
                <div className="flex mt-8">
                  <Button
                    className="ml-auto mr-0"
                    type="primary"
                    onClick={onConfirm}
                    disabled={confirmDisabled}
                  >
                    {confirmText}
                  </Button>
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
