import express from "express";
import jwt from "jsonwebtoken";
import { google } from "googleapis";

const router = express.Router();

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.TOKEN_SECRET as string,
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

router.get("/google", (req, res) => {
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
  }
});

router.get("/google/callback", async (req, res) => {
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
    const jwtToken = generateToken(data);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect(process.env.HOME_PAGE_URL || ""); // Redirect FE to main page
  } catch (ex) {
    console.error(ex);
  }
});

router.use("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;
