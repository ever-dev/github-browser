import { Suspense } from "react";
import { lazy } from "react";
import { GithubProvider, useGithubContext } from "../context/github";
import { DefaultLayout } from "../layouts";
import { Loading } from "../components";

const HomePage = lazy(() => import("./HomePage"));
const RepoDetailPage = lazy(() => import("./RepoDetailPage"));

function Routes() {
  const { selectedRepo } = useGithubContext();

  if (selectedRepo) {
    return <RepoDetailPage />;
  } else {
    return <HomePage />;
  }
}

function App() {
  return (
    <GithubProvider>
      <DefaultLayout>
        <Suspense fallback={<Loading />}>
          <Routes />
        </Suspense>
      </DefaultLayout>
    </GithubProvider>
  );
}

export default App;
