import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/User";
import environment from "../configs/index";
import { decryptString, encryptString } from "../utils/crypt";
import { sendMail } from "../utils/verifyEmail";
const authController = {
  login: async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }
    try {
      const { email, password } = req.body;
      let user = await UserModel.findOne({ email });
      if (!user) return res.status(401).send({ error: "User does not exist." });
      let match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send({ error: "Incorrect Password." });

      const payload = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          verify: user.verify,
          avatar: user.avatar,
          pricing: user.pricing,
        },
      };
      if (!user.verify) return res.send({ token: "", user: payload.user });
      jwt.sign(payload, environment.secretKey, (err, token) => {
        if (err) throw err;
        res.send({ token, user: payload.user });
      });
    } catch (error: any) {
      return res.status(500).send({ error: "Server Error" });
    }
  },

  register: async (req: any, res: any) => {
    const ip = req.clientIp;
    console.log("ip: ", ip);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }
    try {
      const { email, name, password, repassword, phone, address } = req.body;
      if (password !== repassword)
        return res
          .status(400)
          .send({ error: "Password confirmation does not match" });
      let user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).send({ error: "Email already exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      console.log(hash);
      user = new UserModel({
        email,
        name,
        phone,
        address,
        password: hash,
        origin: password,
      });
      await user.save();
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          verify: user.verify,
        },
      };
      res.status(200).send({ token: "", user: payload.user });
    } catch (e: any) {
      return res.status(500).send({ error: "Server Error" });
    }
  },
  change: async (req: any, res: any) => {
    const email = req.user.email;
    const { name, avatar, passwordOld, passwordNew, passwordNewRe } = req.body;
    try {
      let user = await UserModel.findOne({ email });
      if (!user) return res.status(401).send({ error: "User does not exist." });
      if (!name) return res.status(400).send({ error: "Name Required" });
      if (passwordOld) {
        if (passwordNewRe !== passwordNew)
          return res
            .status(400)
            .send({ error: "Password confirmation does not match" });
        let match = await bcrypt.compare(passwordOld, user.password);
        if (!match)
          return res.status(401).send({ error: "Incorrect Password." });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(passwordNew, salt);
        user.password = hash;
        user.origin = passwordNew;
      }
      user.avatar = avatar;
      user.name = name;
      await user.save();
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          verify: user.verify,
          avatar: user.avatar,
          pricing: user.pricing,
        },
      };
      jwt.sign(payload, environment.secretKey, (err, token) => {
        if (err) throw err;
        res.send({ token, user: payload.user });
      });
    } catch (e: any) {
      return res.status(500).send({ error: "Server Error" });
    }
  },

  verify: (req: any, res: any) => {
    const { email } = req.body;
    const tokenEmail = encryptString(email);
    // --------send email
    sendMail(
      email,
      `HubFul Reset Password verification`,
      `Please access this link to verify your email. ${
        environment.frontEnd + "/auth/verify/" + tokenEmail
      }`
    );
    res.send(environment.frontEnd + "/auth/verify/" + tokenEmail);
    console.log(environment.frontEnd + "/auth/verify/" + tokenEmail);
  },

  verifyEmail: async (req: any, res: any) => {
    const { token } = req.body;
    try {
      const email = decryptString(token);

      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: "User does not exist." });
      }
      if (user.verify) {
        return res.status(400).send({ error: "Already verified." });
      }
      user.verify = true;
      await user.save();
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          verify: user.verify,
          avatar: user.avatar,
          pricing: user.pricing,
        },
      };
      jwt.sign(payload, environment.secretKey, (err, token) => {
        if (err) throw err;
        res.send({ token, user: payload.user });
      });
    } catch (e) {
      return res.status(500).send({ error: "Server Error." });
    }
  },

  resetEmail: async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }
    const { email } = req.body;
    try {
      let user = await UserModel.findOne({ email });
      if (!user)
        return res.status(400).send({ error: "Email does not exist." });
      const tokenEmail = encryptString(email);
      //---send email
      sendMail(
        email,
        `HubFul Sign Up email verification`,
        `Please access this link to verify your email. ${
          environment.frontEnd + "/auth/reset/" + tokenEmail
        }`
      );
      res.send(environment.frontEnd + "/auth/reset/" + tokenEmail);
      console.log(environment.frontEnd + "/auth/reset/" + tokenEmail);
    } catch (e) {
      return res.status(500).send({ error: "Server Error." });
    }
  },

  verifyToken: async (req: any, res: any) => {
    const { token } = req.body;
    try {
      const email = decryptString(token);

      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: "User does not exist." });
      }
      res.send({ email });
    } catch (e) {
      return res.status(500).send({ error: "Server Error." });
    }
  },

  reset: async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array()[0].msg });
    }
    try {
      const { email, password, rePassword } = req.body;
      if (password !== rePassword)
        return res
          .status(400)
          .send({ error: "Password confirmation does not match" });
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: "Email does not exists." });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
      user.origin = password;
      await user.save();
      res.status(200).send({ user });
    } catch (e: any) {
      return res.status(500).send({ error: "Server Error" });
    }
  },

  users: async (req: any, res: any) => {
    const result: any = (await UserModel.find()) as IUser[];
    res.send(result);
  },

  contact: async (req: any, res: any) => {
    const { email, name, phone, message } = req.body;
    // --------send email
    try {
      const result = sendMail(
        environment.adminEmail,
        `Message from ${name}`,
        `email: ${email}, Phone Number: ${phone}, message: ${message}
       `
      );
      return res.send(result);
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  },
};

export const authValidation = {
  login: [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  reset: [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  resetEmail: [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
  ],
  register: [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("name", "Name is required").not().isEmpty(),
    check("phone", "Phone Number is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
  ],
};
export default authController;
