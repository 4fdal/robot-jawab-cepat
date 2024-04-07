import { Input, Modal } from "antd";
import React from "react";

interface ModalEditTextProps {
  open: boolean;
  title: string | null;
  value: number | string | null;
  onOk: (value) => void;
  onCancel: () => void;
}

function ModalEditText(
  props: ModalEditTextProps
): React.FC<ModalEditTextProps> {
  const [value, setValue] = React.useState<string | number | null>(props.value);
  const input: { current: HTMLInputElement } = React.useRef<{
    current: HTMLInputElement;
  }>();

  return (
    <Modal
      open={props.open}
      title={props.title}
      okButtonProps={{
        style: {
          color: "black",
          boxShadow: "none",
          border: "1px solid gray",
        },
      }}
      onCancel={props.onCancel}
      onOk={() => {
        props.onOk(input.current?.resizableTextArea?.textArea?.value);
      }}
    >
      <Input.TextArea
        placeholder="Soal"
        rows={4}
        ref={input}
        defaultValue={props.value}
      />
    </Modal>
  );
}

export default ModalEditText;
