import { Input, Modal } from "antd"
import React from "react"

function ModalEditText(props) {
    const input = React.useRef()

    return (
        <Modal
            open={props.open}
            title={props.title}
            okButtonProps={{
                style: {
                    color: "black",
                    boxShadow: "none",
                    border: "1px solid gray"
                }
            }}
            onCancel={props.onCancel}
            onOk={() => {
                props.onOk(input.current?.resizableTextArea?.textArea?.value)
            }}
        >
            <Input.TextArea
                placeholder="Soal"
                rows={4}
                ref={input}
                defaultValue={props.value}
            />
        </Modal>
    )
}

export default ModalEditText
