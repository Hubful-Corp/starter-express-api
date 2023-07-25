import { model, Schema } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  phone: string;
  address: string;
  role: string;
  origin: string;
  password: string;
  avatar: string;
  verify: boolean;
  pricing: string;
}
const ModelSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    origin: { type: String, required: true },
    address: {
      type: String,
      required: true,
    },
    phone: { type: String },
    role: { type: String, default: "user" },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
    },
    verify: { type: Boolean, default: false },
    pricing: { type: String, default: "hn0" },
  },
  { timestamps: true }
);

const UserModel = model("User", ModelSchema);
export default UserModel;
