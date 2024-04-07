import "@/App.css";
import {
  PlusCircleOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Flex, List, Row, Spin } from "antd";

import React from "react";
import Draggable from "react-draggable";
import Action from "./components/Action";
import ModalEditText from "./components/ModalEditText";
import { RequestChatGPT } from "@/helpers/RequestChatGpt";

interface AppProps {
  rootId: string;
}

function App(props: AppProps): React.FC<AppProps> {
  const rootId = props.rootId;

  const [visible, setVisible] = React.useState<boolean | null>(null);

  const [defaultDocument, setDefaultDocument] =
    React.useState<Document>(document);
  const [targetMouseOverElement, setTargetMouseOverElement] =
    React.useState<HTMLElement | null>(null);
  const [targetMouseOutElement, setTargetMouseOutElement] =
    React.useState<HTMLElement | null>(null);

  const [soal, setSoal] = React.useState<string | null>(null);
  const [pilihan, setPilihan] = React.useState<Array<string>>([]);
  const [jawaban, setJawaban] = React.useState<string | null>(null);
  const [loadingJabawan, setLoadingJawaban] = React.useState<boolean>(false);

  const [inspectSoal, setInspectSoal] = React.useState<{
    isActive: React.Dispatch<React.SetStateAction<boolean>>;
  } | null>(null);

  const [openEditSoal, setOpenEditSoal] = React.useState<boolean>(false);

  const [inspectPilihan, setInspectPilihan] = React.useState<{
    isActive: React.Dispatch<React.SetStateAction<boolean>>;
    index: number;
  } | null>(null);

  const [openEditPilihan, setOpenEditPilihan] = React.useState<boolean>(false);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);

  const jalankanInspectElement = () => {
    defaultDocument.onmouseover = ({ target }: MouseEvent | null) => {
      if (target) {
        if (
          !target.matches(
            `#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`
          )
        ) {
          target.style.border = "2px solid blue";
          setTargetMouseOverElement(target);
        }
      }
    };

    defaultDocument.onmouseout = ({ target }: MouseEvent | null) => {
      if (target) {
        if (
          !target.matches(
            `#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`
          )
        ) {
          target.style.border = "";
          setTargetMouseOutElement(target);
        }
      }
    };
  };

  const tanganiMulaiMemilih = () => {
    setTargetMouseOverElement(null);
    setTargetMouseOutElement(null);

    setSoal(null);
    setPilihan([]);
    setJawaban(null);

    setInspectSoal(null);
    setInspectPilihan(null);

    jalankanInspectElement();
  };

  const tanganiBerhentiMemilih = () => {
    defaultDocument.onmouseover = null;
    defaultDocument.onmouseout = null;
  };

  React.useEffect(() => {
    if (targetMouseOverElement) {
      targetMouseOverElement.onclick = ({ target: eTarget }) => {
        if (
          eTarget.innerText != null &&
          eTarget.innerText != "" &&
          inspectSoal == null &&
          inspectPilihan == null
        ) {
          if (soal == null) setSoal(eTarget.innerText);
          else setPilihan([...pilihan, eTarget.innerText]);
        } else if (inspectSoal != null) {
          setSoal(eTarget.innerText);
          inspectSoal.isActive(false);
          setInspectSoal(null);
        } else if (inspectPilihan != null) {
          pilihan[inspectPilihan.index] = eTarget.innerText;
          setPilihan([...pilihan]);
          inspectPilihan.isActive(false);
          setInspectPilihan(null);
        }
      };

      return () => {
        targetMouseOverElement.onclick = null;
      };
    }
  }, [
    targetMouseOverElement,
    soal,
    pilihan,
    jawaban,
    inspectSoal,
    inspectPilihan,
  ]);

  React.useEffect(() => {
    const handleCromeMessage = (request, sender, sendResponse) => {
      if (request?.query?.visible) {
        console.log(request?.query);
        setVisible(request?.query?.visible);
      }
      sendResponse(true);
    };
    chrome.runtime.onMessage.addListener(handleCromeMessage);
    return () => chrome.runtime.onMessage.removeListener(handleCromeMessage);
  }, [visible]);

  console.log(visible);

  return (
    visible && (
      <Draggable>
        <div className="app-content">
          <ModalEditText
            title="Edit Soal"
            open={openEditSoal}
            value={soal}
            onCancel={() => setOpenEditSoal(false)}
            onOk={(soal) => {
              setSoal(soal);
              setOpenEditSoal(false);
            }}
          />
          <ModalEditText
            title="Edit Pilihan"
            open={openEditPilihan}
            value={pilihan[editIndex]}
            onCancel={() => setOpenEditPilihan(false)}
            onOk={(txtPilihan) => {
              pilihan[editIndex] = txtPilihan;
              setPilihan([...pilihan]);
              setOpenEditPilihan(false);
            }}
          />
          <Card
            style={{
              maxHeight: 700,
              width: 400,
              overflowY: "auto",
            }}
            title={
              <Button
                onClick={tanganiMulaiMemilih}
                size="small"
                type="link"
                title="Jawaban Baru"
              >
                <PlusCircleOutlined />
              </Button>
            }
            extra={
              <Flex gap="middle" align="flex-end">
                <Button
                  size="small"
                  type="link"
                  onClick={tanganiBerhentiMemilih}
                  title="Berhenti Melakukan Pemilihan Element"
                >
                  <StopOutlined />
                </Button>
              </Flex>
            }
          >
            <List
              size="small"
              header={
                <Row>
                  <Col flex={1}>
                    <p>{soal}</p>
                  </Col>

                  {soal != null && soal != "" && (
                    <Col flex={1}>
                      <Action
                        onInspect={(isActive) => {
                          isActive(true);
                          setInspectSoal({
                            isActive,
                          });
                        }}
                        onEdit={() => {
                          setOpenEditSoal(true);
                        }}
                      />
                    </Col>
                  )}
                </Row>
              }
              dataSource={pilihan}
              renderItem={(item, index) => (
                <List.Item>
                  <Row>
                    <Col flex={1}>
                      <p>{`${String.fromCharCode(65 + index)}. ${item}`}</p>
                    </Col>

                    <Col flex={1}>
                      <Action
                        onInspect={(isActive) => {
                          isActive(true);
                          setInspectPilihan({
                            index,
                            isActive,
                          });
                        }}
                        onEdit={() => {
                          setOpenEditPilihan(true);
                          setEditIndex(index);
                        }}
                        onDelete={() => {
                          setPilihan([
                            ...pilihan.filter(
                              (_, filterIndex) => filterIndex != index
                            ),
                          ]);
                        }}
                      />
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
            <Col md={24} style={{ marginTop: 5 }}>
              <Row>
                <Button
                  onClick={() => {
                    const question =
                      "Berikan jawaban pada soal dibawah ini, cukup hanya menjawab pada pilihan yang telah tersedia berseta labelnya : \n\n " +
                      soal +
                      "\n" +
                      pilihan
                        .map(
                          (item, index) =>
                            `${String.fromCharCode(65 + index)}. ${item}`
                        )
                        .join("\n");

                    setLoadingJawaban(true);
                    new RequestChatGPT()
                      .getAnswers(question)
                      .then((jawaban) => {
                        setJawaban(jawaban);
                      })
                      .catch((err) => setJawaban(err.message))
                      .finally(() => setLoadingJawaban(false));
                  }}
                  icon={<SearchOutlined />}
                >
                  Cari Jawaban
                </Button>
              </Row>
              <Divider />
              {loadingJabawan ? <Spin size="small" /> : jawaban}
            </Col>
          </Card>
        </div>
      </Draggable>
    )
  );
}

export default App;
