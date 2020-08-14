const fs = require("fs");
const jwt = require("jsonwebtoken");

module.exports = class Helper {
  static getJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath));
        return data;
      } catch (err) {
        console.error(error);
      }
    } else {
      fs.writeFileSync(filePath, JSON.stringify([]), { flag: "w+" });
      return [];
    }
  }

  static generateAccessToken(userData) {
    const secret = process.env.ACCESS_TOKEN_SECRET
      ? process.env.ACCESS_TOKEN_SECRET
      : "access-token-secret";

    return jwt.sign({ user: userData }, secret, {
      expiresIn: "1h",
    });
  }

  static generateRefreshToken(userData) {
    const secret = process.env.REFRESH_TOKEN_SECRET
      ? process.env.REFRESH_TOKEN_SECRET
      : "refresh-token-secret";

    return jwt.sign({ user: userData }, secret, {
      expiresIn: 1000 * 60 * 60 * 24 * 365,
    });
  }

  static verifyAccessToken(token) {
    const secret = process.env.ACCESS_TOKEN_SECRET
      ? process.env.ACCESS_TOKEN_SECRET
      : "access-token-secret";
    return jwt.verify(token, secret);
  }

  static verifyRefreshToken(token) {
    const secret = process.env.REFRESH_TOKEN_SECRET
      ? process.env.REFRESH_TOKEN_SECRET
      : "refresh-token-secret";
    return jwt.verify(token, secret);
  }
};
