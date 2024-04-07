import { blue, yellow } from "@ant-design/colors";
import { DeleteOutlined, EditOutlined, SelectOutlined, } from "@ant-design/icons";
import { Button } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import React from "react";
function Action(props) {
    const [activeInspect, setActiveInspect] = React.useState(false);
    return (React.createElement(ButtonGroup, null,
        props?.onInspect && (React.createElement(Button, { onClick: () => {
                props.onInspect(setActiveInspect);
            }, style: {
                color: activeInspect ? yellow[7] : blue[7],
            }, size: "small", type: "link" },
            React.createElement(SelectOutlined, null))),
        props?.onEdit && (React.createElement(Button, { onClick: props.onEdit, size: "small", type: "link" },
            React.createElement(EditOutlined, null))),
        props?.onDelete && (React.createElement(Button, { onClick: props.onDelete, size: "small", type: "link" },
            React.createElement(DeleteOutlined, null)))));
}
export default Action;
//# sourceMappingURL=Action.js.map