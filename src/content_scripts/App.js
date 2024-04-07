import "@/App.css";
import { PlusCircleOutlined, SearchOutlined, StopOutlined, } from "@ant-design/icons";
import { Button, Card, Col, Divider, Flex, List, Row, Spin } from "antd";
import React from "react";
import Draggable from "react-draggable";
import Action from "./components/Action";
import ModalEditText from "./components/ModalEditText";
import { RequestChatGPT } from "@/helpers/RequestChatGpt";
function App(props) {
    const rootId = props.rootId;
    const [visible, setVisible] = React.useState(null);
    const [defaultDocument, setDefaultDocument] = React.useState(document);
    const [targetMouseOverElement, setTargetMouseOverElement] = React.useState(null);
    const [targetMouseOutElement, setTargetMouseOutElement] = React.useState(null);
    const [soal, setSoal] = React.useState(null);
    const [pilihan, setPilihan] = React.useState([]);
    const [jawaban, setJawaban] = React.useState(null);
    const [loadingJabawan, setLoadingJawaban] = React.useState(false);
    const [inspectSoal, setInspectSoal] = React.useState(null);
    const [openEditSoal, setOpenEditSoal] = React.useState(false);
    const [inspectPilihan, setInspectPilihan] = React.useState(null);
    const [openEditPilihan, setOpenEditPilihan] = React.useState(false);
    const [editIndex, setEditIndex] = React.useState(null);
    const jalankanInspectElement = () => {
        defaultDocument.onmouseover = ({ target }) => {
            if (target) {
                if (!target.matches(`#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`)) {
                    target.style.border = "2px solid blue";
                    setTargetMouseOverElement(target);
                }
            }
        };
        defaultDocument.onmouseout = ({ target }) => {
            if (target) {
                if (!target.matches(`#${rootId}, #${rootId} *, .ant-modal-content, .ant-modal-content *`)) {
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
                if (eTarget.innerText != null &&
                    eTarget.innerText != "" &&
                    inspectSoal == null &&
                    inspectPilihan == null) {
                    if (soal == null)
                        setSoal(eTarget.innerText);
                    else
                        setPilihan([...pilihan, eTarget.innerText]);
                }
                else if (inspectSoal != null) {
                    setSoal(eTarget.innerText);
                    inspectSoal.isActive(false);
                    setInspectSoal(null);
                }
                else if (inspectPilihan != null) {
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
                setVisible(request?.query?.visible)
            }
            sendResponse(true);
        };
        chrome.runtime.onMessage.addListener(handleCromeMessage);
        return () => chrome.runtime.onMessage.removeListener(handleCromeMessage);
    }, [visible]);
    return (React.createElement(Draggable, null,
        React.createElement("div", { className: "app-content" },
            React.createElement(ModalEditText, {
                title: "Edit Soal", open: openEditSoal, value: soal, onCancel: () => setOpenEditSoal(false), onOk: (soal) => {
                    setSoal(soal);
                    setOpenEditSoal(false);
                }
            }),
            React.createElement(ModalEditText, {
                title: "Edit Pilihan", open: openEditPilihan, value: pilihan[editIndex], onCancel: () => setOpenEditPilihan(false), onOk: (txtPilihan) => {
                    pilihan[editIndex] = txtPilihan;
                    setPilihan([...pilihan]);
                    setOpenEditPilihan(false);
                }
            }),
            React.createElement(Card, {
                style: {
                    maxHeight: 700,
                    width: 400,
                    overflowY: "auto",
                }, title: React.createElement(Button, { onClick: tanganiMulaiMemilih, size: "small", type: "link", title: "Jawaban Baru" },
                    React.createElement(PlusCircleOutlined, null)), extra: React.createElement(Flex, { gap: "middle", align: "flex-end" },
                        React.createElement(Button, { size: "small", type: "link", onClick: tanganiBerhentiMemilih, title: "Berhenti Melakukan Pemilihan Element" },
                            React.createElement(StopOutlined, null)))
            },
                React.createElement(List, {
                    size: "small", header: React.createElement(Row, null,
                        React.createElement(Col, { flex: 1 },
                            React.createElement("p", null, soal)),
                        soal != null && soal != "" && (React.createElement(Col, { flex: 1 },
                            React.createElement(Action, {
                                onInspect: (isActive) => {
                                    isActive(true);
                                    setInspectSoal({
                                        isActive,
                                    });
                                }, onEdit: () => {
                                    setOpenEditSoal(true);
                                }
                            })))), dataSource: pilihan, renderItem: (item, index) => (React.createElement(List.Item, null,
                                React.createElement(Row, null,
                                    React.createElement(Col, { flex: 1 },
                                        React.createElement("p", null, `${String.fromCharCode(65 + index)}. ${item}`)),
                                    React.createElement(Col, { flex: 1 },
                                        React.createElement(Action, {
                                            onInspect: (isActive) => {
                                                isActive(true);
                                                setInspectPilihan({
                                                    index,
                                                    isActive,
                                                });
                                            }, onEdit: () => {
                                                setOpenEditPilihan(true);
                                                setEditIndex(index);
                                            }, onDelete: () => {
                                                setPilihan([
                                                    ...pilihan.filter((_, filterIndex) => filterIndex != index),
                                                ]);
                                            }
                                        })))))
                }),
                React.createElement(Col, { md: 24, style: { marginTop: 5 } },
                    React.createElement(Row, null,
                        React.createElement(Button, {
                            onClick: () => {
                                const question = "Berikan jawaban pada soal dibawah ini, cukup hanya menjawab pada pilihan yang telah tersedia berseta labelnya : \n\n " +
                                    soal +
                                    "\n" +
                                    pilihan
                                        .map((item, index) => `${String.fromCharCode(65 + index)}. ${item}`)
                                        .join("\n");
                                setLoadingJawaban(true);
                                new RequestChatGPT()
                                    .getAnswers(question)
                                    .then((jawaban) => {
                                        setJawaban(jawaban);
                                    })
                                    .catch((err) => setJawaban(err.message))
                                    .finally(() => setLoadingJawaban(false));
                            }, icon: React.createElement(SearchOutlined, null)
                        }, "Cari Jawaban")),
                    React.createElement(Divider, null),
                    loadingJabawan ? React.createElement(Spin, { size: "small" }) : jawaban)))));
}
export default App;
//# sourceMappingURL=App.js.map