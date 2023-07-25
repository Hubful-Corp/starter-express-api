import express from "express";
import authMiddleware from "../middlewares/auth";
import authController, { authValidation } from "../controllers/auth.controller";
import paymentController from "../controllers/payment.controller";
import adminMiddleware from "../middlewares/admin";

const router = express.Router();
router.get("/hello", (req, res) => {
  res.send("hello world");
});
router.post("/auth/login", authValidation.login, authController.login);
router.post("/auth/register", authValidation.register, authController.register);
router.post("/auth/verify", authController.verify);
router.post("/auth/verify/email", authController.verifyEmail);
router.post("/auth/reset", authValidation.reset, authController.reset);
router.post(
  "/auth/reset/send",
  authValidation.resetEmail,
  authController.resetEmail
);
router.post("/auth/verify/token", authController.verifyToken);
router.post("/auth/change", authMiddleware, authController.change); //-----------------------------imiplement
router.get("/auth/users", adminMiddleware, authController.users); //----------------------------------admin

router.post("/auth/contact", authController.contact);

//--------server middle ware, auth middleware......
router.post(
  "/api/pricing/generate",
  authMiddleware,
  paymentController.generatePricingLink
);
router.post(
  "/api/pricing/verify",
  authMiddleware,
  paymentController.verifyPricing
);
router.get(
  "/api/pricing/pricings",
  adminMiddleware,
  paymentController.pricings
);
export default router;
