import { AuthPayload } from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "secret";

export const generateToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export const validateToken = (token: string) => {
  return jwt.verify(token, secretKey) as AuthPayload;
};
