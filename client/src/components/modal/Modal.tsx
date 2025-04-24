import { ReactNode } from "react";

import {
  Button,
  Modal as HeroModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface Props {
  title?: string;
  size?: "md" | "sm" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full";
  isOpen?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmText?: string;
}

const Modal = ({
  children,
  size = "md",
  isOpen,
  onClose,
  title,
  onConfirm,
  confirmDisabled = false,
  confirmText = "Create",
}: Props) => {
  return (
    <HeroModal isOpen={isOpen} size={size} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {onConfirm && (
                <Button color="primary" onPress={onConfirm} disabled={confirmDisabled}>
                  {confirmText}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
};
export default Modal;
