import { useState } from "react";
import styles from "./styles.module.scss";

interface TaskProps {
  dataTestId?: string;
}
function Task({ dataTestId }: TaskProps) {
  const [isInput, setIsInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInput((prevState) => (prevState = true));
  };
  const handleKeypress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setIsInput((prevState) => (prevState = false));
    }
  };
  return (
    <div
      className={styles.taskWrapper}
      data-testid={dataTestId}
      onClick={() => setIsInput(false)}
    >
      {isInput ? (
        <textarea
          autoFocus
          rows={1}
          className={styles.textarea}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => handleKeypress(e)}
          value={inputValue}
        />
      ) : (
        <button className={styles.button} onClick={(e) => handleButtonClick(e)}>
          {inputValue.length ? inputValue : "task describtion"}
        </button>
      )}
    </div>
  );
}
export default Task;
