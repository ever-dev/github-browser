import { useMemo } from "react";

import { LanguageTag } from "..";
import styles from "./styles.module.css";

export default function RepoCard({ repoInfo }) {
  const languages = useMemo(() => {
    return Object.keys(repoInfo.languages).sort((lang1, lang2) =>
      repoInfo.languages[lang1] < repoInfo.languages[lang2]
        ? 1
        : repoInfo.languages[lang1] > repoInfo.languages[lang2]
        ? -1
        : 0
    );
  }, [repoInfo]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>{repoInfo.name}</div>
      <div className={styles.body}>
        <p>{repoInfo.description}</p>
        <span>Languages:</span>
        <br />
        {languages.length > 0 ? (
          <div className={styles.languages}>
            {languages.map((lang) => (
              <div key={lang} className={styles.language}>
                <LanguageTag lang={lang} key={lang} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.languages}>
            <div className={styles.language}>
              <LanguageTag lang="No Languages Detected" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
