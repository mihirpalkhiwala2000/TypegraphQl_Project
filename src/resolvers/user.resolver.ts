import {
  Arg,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import {
  CreateUserInput,
  User,
  UserModel,
  findUserInput,
} from "../schema/user.schema";
import UserService from "../service/user.service";
import { NotificationPayload, Notification } from "../notification-types";
import { LogAccessMiddleware } from "../middleware";

@Resolver(() => User)
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @FieldResolver()
  async eligibleToVote(@Root() user: any): Promise<boolean> {
    if (user.age >= 18) {
      await UserModel.findByIdAndUpdate(user._id, { eligibleToVote: true });
      return true;
    }
    await UserModel.findByIdAndUpdate(user._id, { eligibleToVote: false });
    return false;
  }
  @UseMiddleware(LogAccessMiddleware)
  @Mutation(() => User)
  async createUser(
    @Arg("input") input: CreateUserInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const createdUser = await this.userService.createUser(input);
    const { _id, name } = createdUser;

    const payload: NotificationPayload = {
      command: "create",
      id: _id,
      name,
      message: `The created user's name is ${createdUser.name} and email id is ${createdUser.email} `,
    };
    await pubSub.publish("NOTIFICATIONS", payload);

    return createdUser;
  }

  @Mutation(() => User)
  findUser(@Arg("input") input: findUserInput) {
    return this.userService.findUser(input);
  }

  @Mutation(() => User)
  async DeleteUser(
    @Arg("input") input: findUserInput,
    @PubSub() pubSub: PubSubEngine
  ) {
    const deletedUser = await this.userService.deleteUser(input);
    if (deletedUser) {
      const { name, _id } = deletedUser;
      const payload: NotificationPayload = {
        command: "delete",
        id: _id,
        name,
        message: `The deleted user's name is ${deletedUser.name} and email id is ${deletedUser.email} `,
      };
      await pubSub.publish("DELETENOTIFICATIONS", payload);
      return deletedUser;
    }
  }
  @Subscription({
    topics: ["NOTIFICATIONS", "DELETENOTIFICATIONS"],
    filter: ({ payload }: ResolverFilterData<NotificationPayload>) =>
      payload.name === "Mihir",
  })
  SubNotification(
    @Root() { id, message, name, command }: NotificationPayload
  ): Notification {
    return {
      id,
      name,
      message,
      command,
      date: new Date(),
    };
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
