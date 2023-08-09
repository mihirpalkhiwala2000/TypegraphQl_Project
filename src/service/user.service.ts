import { errorMsgs } from "../constant";
import { UserModel } from "../schema/user.schema";
import bcrypt from "bcrypt";

class UserService {
  createUser = async (input: any) => {
    return UserModel.create(input);
  };

  findUser = async (input: any) => {
    const { email, password } = input;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw Error(errorMsgs.incorrectEmail);
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw Error(errorMsgs.incorrectPassword);
    }
    return user;
  };

  deleteUser = async (input: any) => {
    const user = await this.findUser(input);
    const { _id } = user;
    const deletedUser = await UserModel.deleteOne({ _id });

    if (deletedUser) {
      return user;
    }
    return null;
  };
}

export default UserService;
