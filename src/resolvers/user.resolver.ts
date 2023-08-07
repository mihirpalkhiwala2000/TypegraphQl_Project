import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, User, findUserInput } from "../schema/user.schema";
import UserService from "../service/user.service";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }
  @Mutation(() => User)
  findUser(@Arg("input") input: findUserInput) {
    return this.userService.findUser(input);
  }
  @Mutation(() => User)
  DeleteUser(@Arg("input") input: findUserInput) {
    return this.userService.deleteUser(input);
  }

  @Query(() => User, { nullable: true })
  me() {
    return {
      _id: "123",
      name: "Mihir",
      email: "Mihir@123.com",
    };
  }
}
