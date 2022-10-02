import { useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface LinkProps {
  children: React.ReactNode;
  page: string;
  dataTestId?: string;
}

export default function Test({ page, children, dataTestId }: LinkProps) {
  const [status, setStatus] = useState(false);
  return (
    <a
      data-testid={dataTestId}
      className={clsx(status ? styles.hovered : styles.normal)}
      href={page || "#"}
      onMouseEnter={() => {
        setStatus(true);
      }}
      onMouseLeave={() => {
        setStatus(false);
      }}
    >
      {children}
    </a>
  );
}
