import "@/App.css"
import {
    PlusCircleOutlined,
    SearchOutlined,
    StopOutlined
} from "@ant-design/icons"
import { Button, Card, Col, Divider, Flex, List, Row, Spin } from "antd"

import React from "react"
import Draggable from "react-draggable"
import Action from "./components/Action"
import ModalEditText from "./components/ModalEditText"
import { RequestChatGPT } from "@/helpers/RequestChatGpt"
import { MSG_TYPE_HTTP_RESPONSE, MSG_TYPE_HTTP_SEND, MSG_TYPE_SETTINGS } from "../constants/type_chrome_message"

function App(props) {
    const rootId = props.rootId

    const [visible, setVisible] = React.useState(null)

    const [defaultDocument, setDefaultDocument] = React.useState(document)
    const [targetMouseOverElement, setTargetMouseOverElement] = React.useState(
        null
    )
    const [targetMouseOutElement, setTargetMouseOutElement] = React.useState(null)

    const [soal, setSoal] = React.useState(null)
    const [pilihan, setPilihan] = React.useState([])
    const [jawaban, setJawaban] = React.useState(null)
    const [loadingJabawan, setLoadingJawaban] = React.useState(false)

    const [inspectSoal, setInspectSoal] = React.useState(null)

    const [openEditSoal, setOpenEditSoal] = React.useState(false)

    const [inspectPilihan, setInspectPilihan] = React.useState(null)

    const [openEditPilihan, setOpenEditPilihan] = React.useState(false)
    const [editIndex, setEditIndex] = React.useState(null)

    const jalankanInspectElement = () => {
        defaultDocument.onmouseover = ({ target }) => {
            if (target) {
                if (
                    !target.matches(
                        `#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`
                    )
                ) {
                    target.style.border = "2px solid blue"
                    setTargetMouseOverElement(target)
                }
            }
        }

        defaultDocument.onmouseout = ({ target }) => {
            if (target) {
                if (
                    !target.matches(
                        `#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`
                    )
                ) {
                    target.style.border = ""
                    setTargetMouseOutElement(target)
                }
            }
        }
    }

    const tanganiMulaiMemilih = () => {
        setTargetMouseOverElement(null)
        setTargetMouseOutElement(null)

        setSoal(null)
        setPilihan([])
        setJawaban(null)

        setInspectSoal(null)
        setInspectPilihan(null)

        jalankanInspectElement()
    }

    const tanganiBerhentiMemilih = () => {
        defaultDocument.onmouseover = null
        defaultDocument.onmouseout = null
    }

    React.useEffect(() => {
        if (targetMouseOverElement) {
            targetMouseOverElement.onclick = ({ target: eTarget }) => {
                if (
                    eTarget.innerText != null &&
                    eTarget.innerText != "" &&
                    inspectSoal == null &&
                    inspectPilihan == null
                ) {
                    if (soal == null) setSoal(eTarget.innerText)
                    else setPilihan([...pilihan, eTarget.innerText])
                } else if (inspectSoal != null) {
                    setSoal(eTarget.innerText)
                    inspectSoal.isActive(false)
                    setInspectSoal(null)
                } else if (inspectPilihan != null) {
                    pilihan[inspectPilihan.index] = eTarget.innerText
                    setPilihan([...pilihan])
                    inspectPilihan.isActive(false)
                    setInspectPilihan(null)
                }
            }

            return () => {
                targetMouseOverElement.onclick = null
            }
        }
    }, [
        targetMouseOverElement,
        soal,
        pilihan,
        jawaban,
        inspectSoal,
        inspectPilihan
    ])

    React.useEffect(() => {
        chrome.storage.sync.get(['visible'], (result) => {
            if (result.visible == undefined) {
                const defaultVisible = false
                chrome.storage.sync.set({ visible: defaultVisible })
                setVisible(defaultVisible)
            }
            else {
                setVisible(result.visible)
            }
        })

        const handleChanged = (result, area) => {
            if (area === 'sync') {
                if (!result.visible) tanganiBerhentiMemilih()
                setVisible(result.visible)
            }
        }
        chrome.storage.onChanged.addListener(handleChanged)
        return () => chrome.storage.onChanged.removeListener(handleChanged)
    }, [visible])

    React.useEffect(() => {
        chrome.runtime.onMessage.addListener((result) => {
            if (result.type == MSG_TYPE_HTTP_RESPONSE) {
                console.log(result.data, "result with App.jsx")
                // todo code ...
            }
        })
    }, [jawaban])

    return (
        visible && (
            <Draggable>
                <div className="app-content">
                    <ModalEditText
                        title="Edit Soal"
                        open={openEditSoal}
                        value={soal}
                        onCancel={() => setOpenEditSoal(false)}
                        onOk={soal => {
                            setSoal(soal)
                            setOpenEditSoal(false)
                        }}
                    />
                    <ModalEditText
                        title="Edit Pilihan"
                        open={openEditPilihan}
                        value={pilihan[editIndex]}
                        onCancel={() => setOpenEditPilihan(false)}
                        onOk={txtPilihan => {
                            pilihan[editIndex] = txtPilihan
                            setPilihan([...pilihan])
                            setOpenEditPilihan(false)
                        }}
                    />
                    <Card
                        style={{
                            maxHeight: 700,
                            width: 400,
                            overflowY: "auto"
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
                                                onInspect={isActive => {
                                                    isActive(true)
                                                    setInspectSoal({
                                                        isActive
                                                    })
                                                }}
                                                onEdit={() => {
                                                    setOpenEditSoal(true)
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
                                                onInspect={isActive => {
                                                    isActive(true)
                                                    setInspectPilihan({
                                                        index,
                                                        isActive
                                                    })
                                                }}
                                                onEdit={() => {
                                                    setOpenEditPilihan(true)
                                                    setEditIndex(index)
                                                }}
                                                onDelete={() => {
                                                    setPilihan([
                                                        ...pilihan.filter(
                                                            (_, filterIndex) => filterIndex != index
                                                        )
                                                    ])
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
                                        tanganiBerhentiMemilih();

                                        (async () => {
                                            setLoadingJawaban(true)
                                            
                                            const instruction = (await chrome.storage.sync.get(['instruction'])).instruction

                                            const question = "instruksi : " + instruction + "\n\n\n" +
                                                "pertanyaan : " + soal + "\n\n\n" +
                                                "pilihan : " + pilihan
                                                    .map(
                                                        (item, index) =>
                                                            `${String.fromCharCode(65 + index)}. ${item}`
                                                    )
                                                    .join("\n");

                                            const jawaban = await chrome.runtime.sendMessage({
                                                type: MSG_TYPE_HTTP_SEND,
                                                question
                                            })

                                            setJawaban(jawaban)
                                            setLoadingJawaban(false)
                                        })();
                                    }}
                                    icon={<SearchOutlined />}
                                >
                                    Cari Jawaban
                                </Button>
                            </Row>
                            <Divider />
                            {loadingJabawan ? <Spin size="small" /> : jawaban?.split("\n").map(item => (<p>{item}</p>))}
                        </Col>
                    </Card>
                </div>
            </Draggable>
        )
    )
}

export default App
