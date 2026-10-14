const jwt = require("jsonwebtoken")

class JWTService {
  verify(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "sathish77");
      return payload;
    } catch {
      throw new Error("Invalid token");
    }
  }
}

module.exports = new JWTService();
