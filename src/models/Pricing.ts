import { model, Schema } from "mongoose";

const ModelSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    pricingName: {
      type: String,
      required: true,
    },
    verify: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PricingModel = model("Pricing", ModelSchema);
export default PricingModel;
