import { NextFunction, Request, Response } from "express"

export const sessionChecker = (req: Request, res: Response, next: NextFunction) => {
  try {
    
  } catch (error) {
    console.log("session checker error", error)
  }
}