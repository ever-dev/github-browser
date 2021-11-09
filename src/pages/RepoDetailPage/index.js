import { Loading } from "../../components";
import { useGithubContext } from "../../context/github";
import styles from "./styles.module.css";

export default function RepoDetailPage() {
  const { selectedRepo, isLoadingRepoDetails, repoDetails, repoDetailsError } =
    useGithubContext();

  return (
    <div className={styles.container}>
      <div className={styles.basicInfo}>
        <div className={styles.ownerInfo}>
          <img
            className={styles.avatar}
            alt={selectedRepo.owner.login}
            src={selectedRepo.owner.avatar_url}
            width="100"
          />
          <span>{selectedRepo.owner.login}</span>
        </div>

        <div className={styles.repoInfo}>
          <h1 className={styles.heading}>{selectedRepo.name}</h1>
          <span>{selectedRepo.description}</span>
          <br />
          <span>
            ⭐️: {selectedRepo.stargazers_count} &nbsp; ⑂:{" "}
            {selectedRepo.forks_count} &nbsp; 👀: {selectedRepo.watchers_count}
          </span>
        </div>
      </div>
      {isLoadingRepoDetails ? (
        <Loading />
      ) : repoDetailsError ? (
        <div>{repoDetailsError}</div>
      ) : repoDetails ? (
        <div>
          {repoDetails.subscribers && repoDetails.subscribers.length > 0 && (
            <div>
              <p>Subscribers:</p>
              <div className={styles.subscribers}>
                {repoDetails.subscribers.map((subscriber) => (
                  <img
                    key={subscriber.id}
                    src={subscriber.avatar_url}
                    className={styles.subscriber}
                    title={subscriber.login}
                    alt={subscriber.login}
                  />
                ))}
              </div>
            </div>
          )}
          {repoDetails.readmeBlob && (
            <div>
              <p>Readme:</p>
              <div>{repoDetails.readmeBlob}</div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
