import dotenv from "dotenv";
dotenv.config();
const environment = {
  port: process.env.PORT || 4000,
  frontEnd: process.env.FRONT || "http://localhost:3000",
  dbUrl: process.env.DB || "mongodb://127.0.0.1:27017/hubful",
  secretKey: process.env.SECRET || "secret key",
  stripeKey: process.env.STRIPE || "sk_test_SDW389DQGDhMECGX5FavT5c100hZsiy8WZ",
  email: process.env.SUPPORT || "support@hubful.com",
  password: process.env.SUPPORTPWD || "password",
  adminEmail: process.env.ADMIN || "0xsmart23@gmail.com",
};

export default environment;
