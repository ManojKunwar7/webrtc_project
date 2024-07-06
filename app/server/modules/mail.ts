import nodemailer from "nodemailer"

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.gmail_token
  },
  secure: false
})

type mailSendPayloadInterface = {
  to:
  {
    name: string,
    address: string
  }[] | [] | string,
  bcc:
  {
    name: string,
    address: string
  }[] | undefined | [] | string,
  subject: string | undefined
  text: string | undefined,
  html: string | undefined
}

type mailSendRespInterface = {
  status: boolean,
  data: any,
  alert_status: string,
  c_msg: string
}

export const sendMail = async <mailSendRespInterface>(payload: mailSendPayloadInterface) => {
  return new Promise<mailSendRespInterface>(async (resolve: any, reject: any) => {
    try {
      await transport.sendMail({
        from: process.env.email,
        to: payload.to,
        bcc: payload.bcc,
        subject: payload.subject,
        text: payload.text,
        html: payload.html
      }, (err, info) => {
        if (err) {
          return reject(err)
        }
        console.log(info.envelope);
        console.log(info.messageId);
        return resolve({ status: true, data: [info], alert_status: "error", c_msg: "Mail sent!" })
      })
    } catch (error) {
      console.error("sendMail error", error)
      return reject(error)
    }
  })
}