import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest =
  (schema: any) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.shape.body) {
        req.body = await schema.shape.body.parseAsync(req.body);
      }

      if (schema.shape.query) {
        req.query = await schema.shape.query.parseAsync(req.query);
      }

      if (schema.shape.params) {
        req.params = await schema.shape.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
