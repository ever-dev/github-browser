import { Header, Content } from "./components";
import styles from "./styles.module.css";

export default function DefaultLayout({ children }) {
  return (
    <div className={styles.root}>
      <Header />
      <Content>{children}</Content>
    </div>
  );
}
