import { ParentProps } from "solid-js";

interface FooterProps {
  version: string;
}

export function Footer(props: ParentProps<FooterProps>) {
  return (
    <footer
      class={
        "fixed bottom-0 right-0 pb-1 pr-2 w-full text-right bg-base-200 text-base-content"
      }
    >
      <span>
        <a
          target={"_blank"}
          href={"https://github.com/riccardoperra/mswjs-devtools-extension"}
        >
          Github
        </a>
      </span>
      <span class={"mx-2"}>/</span>
      <span>Version {props.version}</span>
    </footer>
  );
}
