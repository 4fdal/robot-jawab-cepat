export class RequestChatGPT {
    Cookie =
        "oai-did=e8566c58-ddf7-43d8-b159-ca551c76c94c; cf_clearance=Nvs2spdVsxUlTjwzYBGtSxTkCTK4uWw7EyRWnJA7hrA-1712487396-1.0.1.1-IgvGRjc8n0WNdbDTcpnOveyYuvo5N_1gCNk03e2NH4fFvneLdc.F6ji823u2.v3VNF9FRoKIS_3PgEoMWllUwA; ajs_user_id=e8566c58-ddf7-43d8-b159-ca551c76c94c; ajs_anonymous_id=d59f598a-7fa4-4749-a53c-01f36d1a3f3d; __Host-next-auth.csrf-token=baa233f50645530953c3e33834cac71e90fe78d5474e84549d7c6531da2231c4%7C62a20b18d7837541522370bc2dd29f2abbd9a435e1d72cd429fbb16e414adf0e; __Secure-next-auth.callback-url=https%3A%2F%2Fchat.openai.com; __cf_bm=.m64nxfczxBIadlBFR1bKrZtXRpWZyCl4_Tt0cDF6lg-1712487394-1.0.1.1-8GtZplZdWnjF2W2.HRLkIYejwvHaTSnHVUPchiyOPIACxmcksQh3O1vTyY_fCfsm75F459tBmNOYatEhXujnIQ; __cflb=0H28vVfF4aAyg2hkHFTZ1MVfKmWgNcKF3Gw23wqqCAy; _cfuvid=sEnBd1BDhJkx_Iq3piDOs3BBqH0QiPmxh1z2FPoV3YQ-1712487394174-0.0.1.1-604800000; _dd_s=rum=0&expire=1712488315636"

    setCookie(Cookie) {
        this.Cookie = Cookie
    }

    getUUIDV4() {
        return "00" + crypto.randomUUID().slice(2)
    }

    async getSessionSite() {
        const url = "https://chat.openai.com/api/auth/session";
        const res = await fetch(url, {
            method: "GET",
            credentials: "include",
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
                Cookie: this.Cookie,
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
                Cookie: this.Cookie,
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

            return "[errors] "+json.detail
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
