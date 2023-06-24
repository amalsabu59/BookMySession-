import { Request, Response } from "express";

import { SessionData } from "express-session";
interface CustomSessionData extends SessionData {
  bearerToken?: string;
}

export function checkAuthTokenAndGrandPermission(
  req: Request,
  res: Response
): boolean {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "Access Denied: Auth Token Required" });
    return false;
  }

  const authToken = req.headers.authorization.split(" ")[1];

  const sessionToken = (req.session as CustomSessionData).bearerToken;
  if (authToken !== sessionToken) {
    res
      .status(403)
      .json({ message: "Access Denied: Auth Token Expired or not valid" });
    return false;
  }

  return true;
}

export function isDeanLoggedin(req: Request, res: Response): boolean {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "Access Denied: Auth Token Required" });
    return false;
  }
  const authToken = req.headers.authorization.split(" ")[1];

  if (authToken.includes("dean")) {
    return true;
  }
  return false;
}
