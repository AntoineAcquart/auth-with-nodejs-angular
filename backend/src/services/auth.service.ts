import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

export class AuthService {
  public getUser = async (token: string): Promise<User> => {
    let jwtPayload;

    //Try to validate the token and get data
    try {
      jwtPayload = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return null;
    }
    const { userId } = jwtPayload;
    const userRepository = getRepository(User);

    return await userRepository.findOne(userId);
  };
}
