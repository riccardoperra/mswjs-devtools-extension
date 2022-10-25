import * as styles from "./LoadingPage.css";
import { VoidProps } from "solid-js";
import { wrapper } from "./LoadingPage.css";

interface LoadingPageProps {}

export function LoadingPage(props: VoidProps<LoadingPageProps>) {
  return (
    <div class={styles.wrapper}>
      <div class={styles.loading}>
        <div class={styles.mswLogo} />
      </div>
    </div>
  );
}
