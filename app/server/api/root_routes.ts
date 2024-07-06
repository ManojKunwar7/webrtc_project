import { app } from '../server'

import { router as sessionRouter } from "./routes/session.routes"

app.use("/session", sessionRouter);