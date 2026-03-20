import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch {
          throw new Error("Invalid JSON in 'data'");
        }
      }

      req.body = await schema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
