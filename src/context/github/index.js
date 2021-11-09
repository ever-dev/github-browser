import { createContext, useReducer, useCallback, useContext } from "react";

import { httpClient } from "../../utilities";

// states and initial values
const initialState = {
  isLoadingRepos: false,
  repos: [],
  loadingReposError: null,

  isLoadingRepoDetails: false,
  repoDetails: null,
  repoDetailsError: null,
  selectedRepo: null,
};

export const actionTypes = {
  FETCH_REPOS: "FETCH_REPOS",
  FETCH_REPOS_SUCCESS: "FETCH_REPOS_SUCCESS",
  FETCH_REPOS_FAILED: "FETCH_REPOS_FAILED",

  FETCH_REPO_DETAILS: "FETCH_REPO_DETAILS",
  FETCH_REPO_DETAILS_SUCCESS: "FETCH_REPO_DETAILS_SUCCESS",
  FETCH_REPO_DETAILS_FAILED: "FETCH_REPO_DETAILS_FAILED",
};

// action types and reducers
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_REPOS: {
      return {
        ...state,
        isLoadingRepos: true,
        repos: [],
        selectedRepo: null,
        loadingReposError: null,
      };
    }

    case actionTypes.FETCH_REPOS_SUCCESS: {
      return {
        ...state,
        isLoadingRepos: false,
        repos: action.payload,
        loadingReposError: null,
      };
    }

    case actionTypes.FETCH_REPOS_FAILED: {
      return {
        ...state,
        isLoadingRepos: false,
        repos: [],
        loadingReposError: action.payload,
      };
    }

    case actionTypes.FETCH_REPO_DETAILS: {
      return {
        ...state,
        isLoadingRepoDetails: true,
        repoDetails: null,
        repoDetailsError: null,
        selectedRepo: action.payload,
      };
    }

    case actionTypes.FETCH_REPO_DETAILS_SUCCESS: {
      return {
        ...state,
        isLoadingRepoDetails: false,
        repoDetails: action.payload,
        repoDetailsError: null,
      };
    }

    case actionTypes.FETCH_REPO_DETAILS_FAILED: {
      return {
        ...state,
        isLoadingRepoDetails: false,
        repoDetails: null,
        repoDetailsError: action.payload,
      };
    }
  }
};

const GithubContext = createContext({
  ...initialState,
});

const getReadmeFromRepo = async (repo) => {
  const defaultBranch = await httpClient(
    `https://api.github.com/repos/${repo.full_name}/branches/${repo.default_branch}`
  );
  const branchTrees = await httpClient(
    `https://api.github.com/repos/${repo.full_name}/git/trees/${defaultBranch.commit.commit.tree.sha}`
  );

  const readmeBlob = branchTrees.tree.find(
    (item) => item.path.toLowerCase() === "readme.md"
  );

  if (readmeBlob) {
    const readmeContent = await fetch(
      `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${readmeBlob.path}`
    ).then((res) => res.text());

    const readmeHtml = await fetch(`https://api.github.com/markdown`, {
      method: "POST",
      body: JSON.stringify({ text: readmeContent }),
    }).then((res) => res.text());
    return readmeHtml;
  } else {
    return null;
  }
};

export const GithubProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleRetrieveRepos = useCallback((username) => {
    dispatch({
      type: actionTypes.FETCH_REPOS,
    });

    httpClient(
      `https://api.github.com/search/repositories?sort=stars&order=desc&q=${encodeURIComponent(
        `user:${username}`
      )}`
    )
      .then((repos) => {
        // filter forked repos
        return (
          (repos &&
            repos.items &&
            repos.items.filter((repo) => repo.fork === false)) ||
          []
        );
      })
      .then((repos) => {
        if (repos.length === 0) {
          throw new Error("No repos found");
        }
        return Promise.all(
          repos.map(async (repo) => {
            const languages = await httpClient(repo.languages_url).catch(
              (err) => {
                return {
                  "Error while fetching languages": 0,
                };
              }
            );

            return {
              ...repo,
              languages,
            };
          })
        );
      })
      .then((repos) => {
        dispatch({
          type: actionTypes.FETCH_REPOS_SUCCESS,
          payload: repos,
        });
      })
      .catch((err) => {
        dispatch({
          type: actionTypes.FETCH_REPOS_FAILED,
          payload: err.message,
        });
      });
  }, []);

  const handleSelectRepo = useCallback(
    (repoId) => {
      const repo = state.repos.find((repo) => repo.id === repoId);

      dispatch({
        type: actionTypes.FETCH_REPO_DETAILS,
        payload: repo,
      });

      Promise.all([httpClient(repo.subscribers_url), getReadmeFromRepo(repo)])
        .then(([subscribers, readmeBlob]) => {
          dispatch({
            type: actionTypes.FETCH_REPO_DETAILS_SUCCESS,
            payload: {
              subscribers,
              readmeBlob,
            },
          });
        })
        .catch((err) => {
          dispatch({
            type: actionTypes.FETCH_REPO_DETAILS_FAILED,
            payload: err.message,
          });
        });
    },
    [state.repos]
  );

  return (
    <GithubContext.Provider
      value={{
        ...state,
        retrieveRepos: handleRetrieveRepos,
        selectRepo: handleSelectRepo,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
export const useGithubContext = () => useContext(GithubContext);
