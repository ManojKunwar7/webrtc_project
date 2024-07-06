import { createClient } from "redis"


export let redisClient: any;

async function createConnection() {
  redisClient = await createClient({
    socket: {
      host: "localhost",
      port: 6379
    }
  }).on("connect", () => console.log(`connected to redis!!!`))
  .on("ready", () => console.log(`ready to use redis!!!`))
  .on("error", (err) => console.error("Redis err --> ", err))
  .connect()
}
createConnection();