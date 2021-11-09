import styles from "./styles.module.css";

import colors from "./colors.json";

export default function LanguageTag({ lang }) {
  const bgColor = colors[lang] ? colors[lang].color : "#eee";
  const fgColor = colors[lang] ? "white" : "black";
  const borderColor = colors[lang] ? colors[lang].color : "#777";

  return (
    <div
      className={styles.tag}
      style={{
        backgroundColor: bgColor,
        color: fgColor,
        borderColor: borderColor,
      }}
    >
      {lang}
    </div>
  );
}
