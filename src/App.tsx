import { Button, Col, List, Row } from "antd";
import "./App.css";
import React from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface AppProps {}

function App(props: AppProps): React.FC<AppProps> {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        from: "popup",
        query: {
          visible,
        },
      });
    });
  }, [visible]);

  return (
    <List
      dataSource={[
        <Row justify={"space-between"}>
          <Col flex={1}>Disable</Col>
          <Col flex={1}>
            <Button
              onClick={() => {
                setVisible(!visible);
              }}
            >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
          </Col>
        </Row>,
      ]}
      renderItem={(renderItem) => <List.Item>{renderItem}</List.Item>}
    />
  );
}

export default App;
