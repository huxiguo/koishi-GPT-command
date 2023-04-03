import { Context, Schema } from "koishi";
import axios from "axios";
export const name = "gpt";

export interface Config {}

export const Config: Schema<Config> = Schema.object({});
async function getData(msg) {
  try {
    const res = await axios({
      method: "GET",
      url: "http://43.139.183.186:8800/test",
      params: {
        msg: msg,
      },
    });
    return res.data;
  } catch (err) {
    return "不好意思,出错啦";
  }
}
export function apply(ctx: Context) {
  ctx.on("message", async (session) => {
    let message = session.content.replace(/<[^>]+> /g, "");
    if (session.content.includes('<at id="3187745885"/>')) {
      if (message == "你好" || message == "你好啊" || message == "你好呀") {
        session.send(
          <>
            <at id={session.userId} />
            {message}
          </>
        );
      } else {
        session.send(
          <>
            <quote id={session.messageId}></quote>
            <p>{"正在查找答案ing..."}</p>
          </>
        );
        let data = await getData(message);
        session.send(
          <>
            <quote id={session.messageId}></quote>
            <p>{data}</p>
          </>
        );
      }
    }
  });
  ctx.command("chat <message:text>").action(async (ctx) => {
    let message = ctx.session.content.replace(".chat ", "");
    if (message == "你好" || message == "你好啊" || message == "你好呀") {
      ctx.session.send(
        <>
          <at id={ctx.session.userId} />
          {message}
        </>
      );
    } else {
      ctx.session.send(
        <>
          <quote id={ctx.session.messageId}></quote>
          <p>{"正在查找答案ing..."}</p>
        </>
      );
      let data = await getData(message);
      ctx.session.send(
        <>
          <quote id={ctx.session.messageId}></quote>
          <p>{data}</p>
        </>
      );
    }
  });
}
