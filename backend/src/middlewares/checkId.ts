import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
import { AuthService } from "../services/auth.service";

export const checkId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authservice = new AuthService();
  const user: User = await authservice.getUser(req.headers.authorization);

  if (user.id === req.params.id) next();
  else res.status(401).send("Not Authorized");
};
