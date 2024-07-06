import express, { Request, Response } from "express";
import { redisClient } from "../../db/redis/redis.conn";
import { sendMail } from "../../modules/mail";

export const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    interface loginInterface {
      email: string
    }

    type sendMailInterface = {
      address: string,
      name: string
    }[]

    type mailSendRespInterface = {
      status: boolean,
      data: any,
      alert_status: string,
      c_msg: string
    }

    const reqBody: loginInterface = req.body
    const { email } = reqBody
    if (!email) {
      return res.status(400).json({ status: false, data: [], c_msg: `Please enter a mail!`, alert_status: "error" })
    }
    const to: sendMailInterface = [{
      name: "user",
      address: email
    }]
    const OTP: number = Math.floor(100_000 + Math.random() * 900_000);
    const sendMailResp: mailSendRespInterface = await sendMail({ to, bcc: "", html: "", subject: "OTP for login", text: `The otp is ${OTP}` })
    if (sendMailResp.status) {

    }
    return res.status(200).json({ status: true, data: [{ status: "true" }], c_msg: `Mail sent to ${email}!`, alert_status: "success" })
  } catch (err) {
    console.log("/users/list err", err);
    return res.status(500).json({ status: false, data: [], c_msg: "Internal server error!", alert_status: 'error' });
  }
})



router.get("/users/list", async (req: Request, res: Response) => {
  try {
    const getOnlineUserList = await redisClient.json.get("online-user")
    if (!getOnlineUserList?.length) {
      return res.status(400).json({ status: false, data: [], alert_status: "error", c_msg: "No users is online!" })
    }
    return res.status(200).json({ status: true, data: getOnlineUserList, alert_status: "success", c_msg: "List retrieved!" })
  } catch (err) {
    console.log("/users/list err", err);
    return res.status(500).json({ status: false, data: [], c_msg: "Internal server error!", alert_status: 'error' });
  }
})

interface setOnlineUserInterface {
  name: string,
  socketId: string
}

router.post("/set/online", async (req: Request, res: Response) => {
  try {
    const { socketId, name } = req.body;
    const payload: setOnlineUserInterface = {
      name: name,
      socketId: socketId
    }
    const getOnlineUsersLen = await redisClient.json.ARRLEN("online-user")
    console.log("getOnlineUsersLen", getOnlineUsersLen);
    const successObj = { status: true, data: [{ status: true }], alert_status: "success", c_msg: "Session created!" }
    if (!getOnlineUsersLen) {
      const setObj = await redisClient.json.set("online-user", "$", [payload])
      if (setObj !== "OK") { return res.status(200).json({ status: false, data: [], alert_status: "error", c_msg: "Unable to create session at this moment, try again later!" }) }
      return res.status(200).json(successObj)
    }

    // * Check if name exists
    const checkExists = await redisClient.json.get("online-user", {
      path: [`$.[?(@.name == "${payload.name}")]`]
    })
    if (checkExists?.length) {
      return res.status(200).json({ status: false, data: [], alert_status: 'error', c_msg: "session already exists" })
    }
    // * If not exists add the user in session arr
    const mergeObj = await redisClient.json.ARRAPPEND("online-user", `$`, payload)
    if (!mergeObj?.length || !mergeObj[0]) {
      return res.status(200).json({ status: true, data: [], alert_status: 'error', c_msg: "session already exists" })
    }
    return res.status(200).json(successObj)
  } catch (err) {
    console.log("/users/list err", err);
    return res.status(500).json({ status: false, data: [], c_msg: "Internal server error!", alert_status: 'error' });
  }
})