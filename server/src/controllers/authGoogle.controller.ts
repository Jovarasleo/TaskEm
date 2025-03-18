import { Request, Response } from "express";
import {
  createUserGateway,
  findUserGateway,
} from "../gateways/user.gateway.js";

import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { createGoogleUserHandler } from "../handlers/authGoogleHandler.js";

const generateToken = (user: any) => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("missing token secret");
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URL = process.env.REDIRECT_CALLBACK_URL || "";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const generateUrl = async (req: Request, res: Response) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: JSON.stringify({
        callbackUrl: req.body.callbackUrl,
        userId: req.body.userId,
      }),
    });
    res.redirect(url);
  } catch (ex) {
    console.error(ex);
    res.status(500).send({ success: false, error: "internal server error" });
    return;
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const urlParams = new URLSearchParams(req.url);
    const code = urlParams.get("code") ?? "";

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name || !data.id) {
      return res.status(500);
    }

    const foundUser = await findUserGateway(data.email);

    if (!foundUser.length) {
      await createGoogleUserHandler(
        { findUserGateway, createUserGateway },
        { username: data.name, id: data.id, email: data.email }
      );
    }

    const jwtToken = generateToken(data);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect(process.env.HOME_PAGE_URL || ""); // Redirect FE to main page
  } catch (ex) {
    console.error(ex);
  }
};
