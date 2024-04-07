import { blue, yellow } from "@ant-design/colors";
import {
  DeleteOutlined,
  EditOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import React from "react";

interface ActionProps {
  onInspect?: (
    setActiveInspect: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function Action(props: ActionProps): React.FC<ActionProps> {
  const [activeInspect, setActiveInspect] = React.useState<boolean>(false);

  return (
    <ButtonGroup>
      {props?.onInspect && (
        <Button
          onClick={() => {
            props.onInspect(setActiveInspect);
          }}
          style={{
            color: activeInspect ? yellow[7] : blue[7],
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
  );
}

export default Action;
