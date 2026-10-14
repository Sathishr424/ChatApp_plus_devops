import jwt from "jsonwebtoken"
import { User } from "../models/User";
import { InvalidToken } from "../exceptions/InvalidToken";
import { JwtPayload } from "../interfaces";

class JWTService {
  sign(user: User) {
    return jwt.sign({
        userId: user.id,
        email: user.email,
        username: user.username,
      } as JwtPayload,
      process.env.JWT_SECRET || "sathish77",
      {
        expiresIn: "24hr"
      }
    )
  }

  verify(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "sathish77") as JwtPayload;
      return payload;
    } catch {
      throw new InvalidToken();
    }
  }
}

export default new JWTService();
