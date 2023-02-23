import styles from "./dropdown.module.scss";

const Dropdown = ({ options, visibility }: any) => {
  if (!visibility) {
    return null;
  }

  return (
    <div className={styles.dropdownWrapper}>
      <ul>
        {options?.map(({ title, onClick }: any) => {
          return (
            <li key={title} className={styles.dropdownElement}>
              <button onClick={() => onClick()}>{title}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
