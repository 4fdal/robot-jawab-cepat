export class RequestChatGPT {

    async getCookie() {
        return (await chrome.storage.sync.get(['cookie'])).cookie
    }

    getUUIDV4() {
        return "00" + crypto.randomUUID().slice(2)
    }

    async getSessionSite() {
        const url = "https://chat.openai.com/api/auth/session";
        const res = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "TE": "trailers",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            },
        });

        if (!res.ok) {
            throw {
                status: res.status,
                response: await res.json(),
            };
        }

        return res.headers.getSetCookie();

    }

    async getOpenAISentinelChatRequirementsToken() {
        const url =
            "https://chat.openai.com/backend-anon/sentinel/chat-requirements"

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Cookie: await this.getCookie(),
                "Content-Type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                TE: "trailers",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
            },

            credentials: "same-origin"
        })

        if (!res.ok) {
            console.error(
                "[errors]",
                this.getOpenAISentinelChatRequirementsToken.name,
                {
                    status: res.status,
                    response: await res.json()
                }
            )
            return null
        }

        return (await res.json()).token
    }

    async getAnswers(question) {

        await this.getSessionSite()

        const url = "https://chat.openai.com/backend-anon/conversation"
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Cookie: await this.getCookie(),
                "OpenAI-Sentinel-Chat-Requirements-Token": await this.getOpenAISentinelChatRequirementsToken(),
                "Content-Type": "application/json",
                Accept: "text/event-stream",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                TE: "trailers",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
            },
            body: JSON.stringify({
                action: "next",
                messages: [
                    {
                        id: this.getUUIDV4(),
                        author: {
                            role: "user"
                        },
                        content: {
                            content_type: "text",
                            parts: [question]
                        },
                        metadata: {}
                    }
                ],
                parent_message_id: this.getUUIDV4(),
                model: "text-davinci-002-render-sha",
                timezone_offset_min: -420,
                suggestions: [],
                history_and_training_disabled: false,
                conversation_mode: {
                    kind: "primary_assistant",
                    plugin_ids: null
                },
                force_paragen: false,
                force_rate_limit: false,
                websocket_request_id: this.getUUIDV4()
            }),
            credentials: "same-origin"
        })

        if (!res.ok) {

            var json = await res.json()

            console.error(
                "[errors]",
                this.getAnswers.name,
                JSON.stringify({
                    status: res.status,
                    response: json
                })
            )

            return "[errors] " + json.detail
        }

        const stream = res.body
        const render = stream?.getReader()

        if (render) {
            let data = { message: { content: { parts: [] } } }
            do {
                let text = new TextDecoder().decode((await render.read()).value)
                if (text.indexOf("data: ") != -1) {
                    try {
                        data = JSON.parse(text.substring("data: ".length).trim())
                    } catch (error) { }
                }
            } while (!(await render.read()).done)

            return data?.message?.content?.parts.join("\n")
        }

        return null
    }
}
