import styles from "./LoadingPage.module.css";
import { VoidProps } from "solid-js";

interface LoadingPageProps {}

export function LoadingPage(props: VoidProps<LoadingPageProps>) {
  return (
    <div class="h-[100svh] w-full flex items-center justify-center">
      <div class={styles.LoadingWrapper}>
        <div class={styles.Loading}>
          <div class={styles.MswLogo} />
        </div>
      </div>
    </div>
  );
}
