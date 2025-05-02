import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import { NotFoundError } from "../../utils/helpers/api-error";
import { customSelectUser } from "../../utils/types/user/user";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError(
        "Não existe nenhum usuário cadastrado com esse email."
      );
    }

    return user;
  }

  async findUserById(id: number, select?: Partial<customSelectUser>) {
    const user = await this.userRepository.findById(id, select);

    if (!user) throw new NotFoundError("Email do remetente não encontrado.");

    return user;
  }
}
