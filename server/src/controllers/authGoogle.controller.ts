import { Request, Response } from "express";
import { google } from "googleapis";
import { generateToken } from "../infrastructure/utils/jwtGenerator.js";
import { googleUserRegistrationHandler } from "../domainHandlers/googleAuthHandlers.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URL = process.env.REDIRECT_CALLBACK_URL || "";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"];

export const generateGoogleLoginUrlController = async (req: Request, res: Response) => {
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
    res.status(500).send({ success: false, error: "Internal server error", data: null });
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
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
      return res.status(400).send({ success: false, error: "Missing request data", data: null });
    }

    const response = await googleUserRegistrationHandler(data.name, data.id, data.email);
    if (!response.success || !response.data) {
      return res.status(500).send({ success: false, error: "Something went wrong data", data: null });
    }

    const jwtToken = generateToken(response.data);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect(process.env.HOME_PAGE_URL || ""); // Redirect FE to main page
  } catch (ex) {
    console.error(ex);
    res.status(500).send({ success: false, error: "Internal server error", data: null });
  }
};
