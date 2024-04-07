import { blue, yellow } from "@ant-design/colors"
import { DeleteOutlined, EditOutlined, SelectOutlined } from "@ant-design/icons"
import { Button } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import React from "react"

function Action(props) {
    const [activeInspect, setActiveInspect] = React.useState(false)

    return (
        <ButtonGroup>
            {props?.onInspect && (
                <Button
                    onClick={() => {
                        props.onInspect(setActiveInspect)
                    }}
                    style={{
                        color: activeInspect ? yellow[7] : blue[7]
                    }}
                    size="small"
                    type="link"
                >
                    <SelectOutlined />
                </Button>
            )}

            {props?.onEdit && (
                <Button onClick={props.onEdit} size="small" type="link">
                    <EditOutlined />
                </Button>
            )}

            {props?.onDelete && (
                <Button onClick={props.onDelete} size="small" type="link">
                    <DeleteOutlined />
                </Button>
            )}
        </ButtonGroup>
    )
}

export default Action
