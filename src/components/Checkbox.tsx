import { VoidProps } from "solid-js";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox(props: VoidProps<CheckboxProps>) {
  return (
    <input
      type="checkbox"
      checked={props.checked}
      classList={{
        checkbox: true,
        "checkbox-primary": props.checked,
      }}
      onChange={(event) => props.onChange(event.currentTarget.checked)}
    />
  );
}
