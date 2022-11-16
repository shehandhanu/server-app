import Jwt from "jsonwebtoken";
import { User } from "../models";

export const authenticate = async (req, res, next) => {
  try {
    const tokenFromRequest = req.header("Authorization");
    if (!tokenFromRequest) {
      return res.status(401).json({
        code: 401,
        message: "Access denied, token missing",
        dev_message: "token_not_found",
      });
    } else {
      try {
        const decodeData = Jwt.verify(tokenFromRequest, process.env.JWT_SCRETE);
        const user = await User.findOne({
          _id: decodeData._id,
          auth_token: tokenFromRequest,
        }).select("_id user_name role permissions");

        if (!user) {
          return res.status(404).json({
            code: 404,
            message: "User record not found",
            dev_message: "user_not_found",
          });
        }

        req.auth_token = tokenFromRequest;
        req.user = user;

        next();
      } catch (error) {
        switch (error.name) {
          case "TokenExpiredError":
            return res.status(401).json({
              code: 401,
              message: "Access denied, token expired",
              dev_message: "token_expired",
            });
          case "JsonWebTokenError":
            return res.status(401).json({
              code: 401,
              message: "Access denied, invalid token",
              dev_message: "invalid_token",
            });
          default:
            return res.status(400).json({
              code: 400,
              message: error.message,
              dev_message: "token_validation_error",
            });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      dev_message: "auth_error",
    });
  }
};
