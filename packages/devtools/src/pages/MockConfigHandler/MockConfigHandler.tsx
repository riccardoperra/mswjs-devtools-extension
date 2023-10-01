import { For, VoidProps } from "solid-js";
import { SerializedMockConfig } from "@mswjs-devtools/shared";
import { Checkbox } from "@codeui/kit";
import { ScrollableWrapper } from "../../components/ScrollableWrapper/ScrollableWrapper";

interface MockConfigHandlerProps {
  mocks: SerializedMockConfig[];
  setSkipMock: (id: string, skip: boolean) => void;
}

export function MockConfigHandler(props: VoidProps<MockConfigHandlerProps>) {
  return (
    <>
      <div class="px-4 my-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">Mocks config</h1>
      </div>
      <ScrollableWrapper>
        <For each={props.mocks}>
          {(mock) => {
            return (
              <div class={"py-2 flex items-center"}>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <Checkbox
                      checked={!mock.skip}
                      onChange={(checked) =>
                        props.setSkipMock(mock.id, checked)
                      }
                    />
                    <span class="label-text ml-4 normal-case">
                      {mock.label}
                    </span>
                  </label>
                </div>
              </div>
            );
          }}
        </For>
      </ScrollableWrapper>
    </>
  );
}
