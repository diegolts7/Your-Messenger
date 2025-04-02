import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { UserRepository } from "../../repositories/user/UserRepository";
import { RegisterBodyType } from "../../schemas/auth/register.schema";
import { ConflictError } from "../../utils/helpers/api-error";

export class AuthService {
  static async verifyLoginAndSendOTPCode() {}

  static async registerUser({ email, name, handle }: RegisterBodyType) {
    const { emailExists, handleExists } =
      await AuthRepository.checkEmailAndHandle({ email, handle });

    if (emailExists) {
      throw new ConflictError(
        "Já existe um usuário cadastrado com esse email."
      );
    }

    if (handleExists) {
      throw new ConflictError(
        "Já existe um usuário cadastrado com esse handle."
      );
    }

    await UserRepository.createUser({
      email,
      name,
      handle,
    });
  }
}
