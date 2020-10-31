import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import config from "../config/config";
import { User } from "../entities/User";

class AuthController {

  static checkToken = async (req: Request, res: Response) => {

    let token: string = req.headers.authorization;
    let jwtPayload;

    //Try to validate the token and get data
    try {
      jwtPayload = jwt.verify(token, config.jwtSecret);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      console.log("token error:", error);
      //If token is not valid, respond with 401 (unauthorized)
      res.status(401).send("Not valid token");
      return;
    }

    const inOneWeek = new Date();
    inOneWeek.setDate(inOneWeek.getDate() + 7);
    const inOneWeekTime = inOneWeek.getTime() / 1000;
    if (inOneWeekTime > jwtPayload.exp) {

      const { userId, username } = jwtPayload;
      token = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: "28d",
      });
    }

    res.status(200).send(token);
  };

  static login = async (req: Request, res: Response) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send();
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
      return;
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "28d" }
    );

    res.send({ username: user.username, token });
  };

  static register = async (req: Request, res: Response) => {

    console.log(req.body);
    const user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.hashPassword();

    let errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    const userRepository = getRepository(User);

    const usersWithSameUsername = await userRepository.find({
      where: { username: user.username },
    });
    if (usersWithSameUsername.length > 0) {
      res.status(409).send("username already in use");
      return;
    }

    let savedUser;
    await userRepository.save(user).then(saved => {
      savedUser = saved;
    }).catch(error => {
      console.log('error', error);
      res.status(500).send("internal error");
    });

    const token = jwt.sign(
      { userId: savedUser.id, username: savedUser.username },
      config.jwtSecret,
      { expiresIn: "28d" }
    );

    res.send({ username: user.username, token });
  };

  static changePassword = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
