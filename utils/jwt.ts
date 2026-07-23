import { AuthPayload } from "@/types";
import jwt, { JwtPayload } from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET || "secret";

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET === "secret")) {
  throw new Error("JWT_SECRET harus di-set dengan nilai acak yang kuat di environment production");
}

export const generateToken = async (payload: JwtPayload) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export const validateToken = (token: string) => {
  return jwt.verify(token, secretKey) as AuthPayload;
};
