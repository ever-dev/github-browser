import { useCallback, useState } from "react";
import { useGithubContext } from "../../context/github";
import { RepoCard } from "../../components";

import styles from "./styles.module.css";

export default function HomePage() {
  const {
    isLoadingRepos,
    repos,
    loadingReposError,
    retrieveRepos,
    selectRepo,
  } = useGithubContext();
  const [userName, setUserName] = useState("");

  const handleUserNameChange = useCallback((e) => {
    setUserName(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    if (userName) {
      retrieveRepos(userName);
    }
  }, [retrieveRepos, userName]);

  const handleSelectRepo = useCallback(
    (repoId) => {
      selectRepo(repoId);
    },
    [selectRepo]
  );

  return (
    <div>
      <div className={styles.searchBar}>
        <input value={userName} onChange={handleUserNameChange} />
        <button type="button" onClick={handleSearch} disabled={!userName}>
          Search
        </button>
      </div>

      <div className={styles.result}>
        {loadingReposError ? (
          <div className={styles.textCenter}>{loadingReposError}</div>
        ) : isLoadingRepos ? (
          <div className={styles.textCenter}>Loading...</div>
        ) : repos && repos.length > 0 ? (
          <div className={styles.repos}>
            {repos.map((repoInfo) => (
              <div
                key={repoInfo.id}
                className={styles.repo}
                onClick={() => handleSelectRepo(repoInfo.id)}
              >
                <RepoCard repoInfo={repoInfo} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.textCenter}>
            Please type username and click search button to see repos!
          </div>
        )}
      </div>
    </div>
  );
}
