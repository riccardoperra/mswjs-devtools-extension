export function NotDetected() {
  return (
    <div class="h-[100svh] w-full justify-center bg-neutral-900">
      <div class="alert radius-0">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class={"text-lg"}>
            MSW (Mock Service Worker) has not been detected.
          </span>
        </div>
      </div>
      <div class={"mt-4 px-4 text-sm"}>
        Make sure you are following the{" "}
        <a
          href={
            "https://github.com/riccardoperra/mswjs-devtools-extension/blob/main/README.md"
          }
          target={"_blank"}
          class={"link link-accent"}
        >
          integration guide
        </a>
        &nbsp;in order to load this extension.
      </div>
    </div>
  );
}
