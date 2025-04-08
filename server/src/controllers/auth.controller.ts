import { Request, Response } from "express";
import { loginHandler, registrationHandler } from "../domainHandlers/authHandlers.js";
import { generateToken } from "../infrastructure/utils/jwtGenerator.js";
import { verifyToken } from "../infrastructure/middlewares/authentication.js";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const response = await registrationHandler(username, password, email);
    if (response.error || !response.success || !response.data) {
      return res.status(400).send({ success: false, error: response.error });
    }

    const jwtToken = generateToken(response.data);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).send({
      success: true,
      message: `user ${username} has been created`,
      user: response.data,
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).send({ success: false, error: ["Internal Server Error"] });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = await loginHandler(email, password);

    if (!response.success || !response.data) {
      return res.status(401).send({ success: false, error: ["incorrect credentials"], data: null });
    }

    const jwtToken = generateToken(response.data);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).send({
      success: true,
      data: response.data,
      error: null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: ["Internal server error"] });
    return;
  }
};

export const userAuthenticatedController = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(200).send({
        success: false,
        error: null,
      });
    }

    const verifiedUser = verifyToken(token);
    if (verifiedUser) {
      res.status(200).send({
        success: true,
        error: null,
      });
    } else {
      res.status(200).send({
        success: false,
        error: null,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: ["Internal server error"] });
    return;
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    res.clearCookie("token").status(200).send({ success: true, message: "Logged Out" });
  } catch (e) {
    return res.status(500).send({ success: false, error: "internal server error" });
  }
};
