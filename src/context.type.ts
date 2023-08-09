import { User } from "./schema/user.schema";

export interface Context {
  currentUser: User;
}
