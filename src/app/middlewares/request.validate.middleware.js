import { logger } from "../../utils";

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      logger.error(`Request validation failed: ${error.message}`);
      res.status(400).json({ info: error.message });
    }
  };
};
