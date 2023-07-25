import jwt from "jsonwebtoken";
import environment from "../configs";
const adminMiddleware = (req: any, res: any, next: any) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).send({ error: "No token, authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, environment.secretKey);
    req.user = decoded.user;

    if (!req.user.role || req.user.role !== "admin")
      return res.status(403).send({ error: "You are not admin" });

    next();
  } catch (e: any) {
    console.log(e.message);
    res.status(403).send({ error: "Token is not valid " });
  }
};
export default adminMiddleware;
