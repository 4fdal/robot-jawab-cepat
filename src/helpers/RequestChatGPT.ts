import { message } from "antd";

export class RequestChatGPT {
  private Cookie: string | null =
    "__Host-next-auth.csrf-token=fac7c2ba2cf59ab751566514c93688d7b09b1c033a40a83b3ed91bd3b45ae5db%7Cd18fd652e33a4408a83ed8d838ae33fb0b6e478dbd9b44910acc25ff8b6645f2; __Secure-next-auth.callback-url=https%3A%2F%2Fonramp.g2.services.openai.com; oai-did=e8566c58-ddf7-43d8-b159-ca551c76c94c; __cf_bm=UcuBqloViWLXBnN6k5QPRyjKBbJc8rh6.tMwdDYRMjY-1712417736-1.0.1.1-vcCTfERmaVzpCR.JX2oo7SB4UlnekLPKUgChZxdvtIS47TPoXZIrynQSBVNVaXOaEVz7PE.Xm.4w5yqzJYFXnA; __cflb=0H28vVfF4aAyg2hkHFTZ1MVfKmWgNcKEweRXNgMNhwB; _cfuvid=21XoTr1SGxHsCjTV8xShbyYtREwhXcOQIOrFkSQ6KSk-1712416703709-0.0.1.1-604800000; _dd_s=rum=0&expire=1712418726033; cf_clearance=1qTrdSnJy21Z1C7Uht3rLglpmFfoP4oMtZd3.Sg1bcM-1712416705-1.0.1.1-_.dOX.vVvIWj2sam7zPAJgiRpS8lVnzGNpenO26e8umERpcJ6w.hC5BjWzJw5MO1Hxp18EBf.6DWg6tFCXrmDQ";

  public setCookie(Cookie: string) {
    this.Cookie = Cookie;
  }

  public getUUIDV4() {
    return "00" + crypto.randomUUID().slice(2);
  }

  public async getOpenAISentinelChatRequirementsToken(): Promise<
    string | null
  > {
    const url: string =
      "https://chat.openai.com/backend-anon/sentinel/chat-requirements";

    const res: Response = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: this.Cookie as string | undefined,
        "Content-Type": "application/json",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        TE: "trailers",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
      },

      credentials: "include",
    });

    if (!res.ok) {
      console.error(
        "[errors]",
        this.getOpenAISentinelChatRequirementsToken.name,
        {
          status: res.status,
          response: await res.json(),
        }
      );
      return null;
    }

    return (await res.json()).token;
  }

  public async getAnswers(question: string): Promise<any> {
    const url = "https://chat.openai.com/backend-anon/conversation";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Cookie: this.Cookie as string | undefined,
        "OpenAI-Sentinel-Chat-Requirements-Token":
          (await this.getOpenAISentinelChatRequirementsToken()) as
            | string
            | undefined,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        TE: "trailers",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
      },
      body: JSON.stringify({
        action: "next",
        messages: [
          {
            id: this.getUUIDV4(),
            author: {
              role: "user",
            },
            content: {
              content_type: "text",
              parts: [question],
            },
            metadata: {},
          },
        ],
        parent_message_id: this.getUUIDV4(),
        model: "text-davinci-002-render-sha",
        timezone_offset_min: -420,
        suggestions: [],
        history_and_training_disabled: false,
        conversation_mode: {
          kind: "primary_assistant",
          plugin_ids: null,
        },
        force_paragen: false,
        force_rate_limit: false,
        websocket_request_id: this.getUUIDV4(),
      }),
      credentials: "include",
    });

    if (!res.ok) {
      console.error(
        "[errors]",
        this.getAnswers.name,
        JSON.stringify({
          status: res.status,
          response: await res.json(),
        })
      );

      return null;
    }

    const stream = res.body;
    const render = stream?.getReader();

    if (render) {
      let data = { message: { content: { parts: [] } } };
      do {
        let text = new TextDecoder().decode((await render.read()).value);
        if (text.indexOf("data: ") != -1) {
          try {
            data = JSON.parse(text.substring("data: ".length).trim());
          } catch (error) {}
        }
      } while (!(await render.read()).done);

      return data?.message?.content?.parts.join("\n");
    }

    return null;
  }
}
