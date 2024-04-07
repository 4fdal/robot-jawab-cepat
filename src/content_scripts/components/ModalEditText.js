import { Input, Modal } from "antd";
import React from "react";
function ModalEditText(props) {
    const [value, setValue] = React.useState(props.value);
    const input = React.useRef();
    return (React.createElement(Modal, { open: props.open, title: props.title, okButtonProps: {
            style: {
                color: "black",
                boxShadow: "none",
                border: "1px solid gray",
            },
        }, onCancel: props.onCancel, onOk: () => {
            props.onOk(input.current?.resizableTextArea?.textArea?.value);
        } },
        React.createElement(Input.TextArea, { placeholder: "Soal", rows: 4, ref: input, defaultValue: props.value })));
}
export default ModalEditText;
//# sourceMappingURL=ModalEditText.js.map