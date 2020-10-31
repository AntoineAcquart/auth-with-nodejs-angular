import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entities/User";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = "admin";
    user.hashPassword();
    const userRepository = getRepository(User);
    user = await userRepository.save(user);
    console.log("user", user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return;
  }
}
