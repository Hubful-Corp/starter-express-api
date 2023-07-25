import { createPaymentLink } from "../utils/stripe.util";
import { dPricing } from "../data/pricing";
import UserModel, { IUser } from "../models/User";
import environment from "../configs";
import PricingModel from "../models/Pricing";
import { decryptString, encryptString } from "../utils/crypt";

const paymentController = {
  generatePricingLink: async (req: any, res: any) => {
    const email = req.user.email;
    const { id, method } = req.body;
    try {
      const user: any = await UserModel.findOne({ email });
      if (!user) return res.status(400).send({ error: "This work is illegal" });
      if (user.pricing !== "hn0")
        return res
          .status(400)
          .send({ error: "You already selected pricing plan." });

      const detail = dPricing.find((pricing) => {
        return pricing.id === id;
      });
      if (!detail)
        return res.status(400).send({ error: "This work is illegal" });
      const pricing = new PricingModel({
        userId: user._id,
        method: method,
        price: detail.price,
        pricingName: detail.id,
      });
      await pricing.save();
      if (method == "stripe") {
        const paymentLink = await createPaymentLink(
          detail.price,
          detail.description,
          `${environment.frontEnd}/pricing/success/${encryptString(
            pricing._id.toString()
          )}`
        );
        console.log(
          `${environment.frontEnd}/pricing/success/${encryptString(
            pricing._id.toString()
          )}`
        );
        return res.send(paymentLink);
      }
    } catch (e) {
      res.status(500).send({ error: "Server Error" });
    }
  },
  verifyPricing: async (req: any, res: any) => {
    const { token } = req.body;
    try {
      const id = decryptString(token);

      let pricing = await PricingModel.findById(id);
      if (!pricing) {
        return res.status(400).send({ error: "Pricing does not exist" });
      }
      if (pricing.verify) {
        return res.status(400).send({ error: "Already verified." });
      }
      pricing.verify = true;
      await pricing.save();
      const userId = pricing.userId;
      let user = await UserModel.findById(userId);
      if (!user) return res.status(400).send({ error: "User does not exist" });
      user.pricing = pricing.pricingName;
      await user.save();
      res.send(pricing);
    } catch (e) {
      return res.status(500).send({ error: "Server Error" });
    }
  },
  pricings: async (req: any, res: any) => {
    try {
      const result = await PricingModel.find().populate("userId", [
        "name",
        "avatar",
      ]);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Server Error" });
    }
  },
};

export default paymentController;
