import { MSG_TYPE_HTTP_RESPONSE, MSG_TYPE_HTTP_SEND } from "./src/constants/type_chrome_message";
import { RequestChatGPT } from "./src/helpers/RequestChatGPT";


const PesanSaya = async () => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Hello")
        }, 10000)
    })
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == MSG_TYPE_HTTP_SEND) {
        (async () => {
            const data = await new RequestChatGPT().getAnswers(request.question)
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: MSG_TYPE_HTTP_RESPONSE,
                    data
                });
            });
            sendResponse(data)
        })()
    }
    return true
});