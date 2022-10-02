import { useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface LinkProps {
  children: React.ReactNode;
  page: string;
}

export default function Test({ page, children }: LinkProps) {
  const [status, setStatus] = useState(false);
  return (
    <a
      id="linkItem"
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
