import { User } from "./schema/user.schema";
import { type AuthChecker } from "type-graphql";

export interface Context {
  user?: User;
}

export const authChecker: AuthChecker<Context> = (
  { context: { user } },
  roles
) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if user exists
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }
  if (roles.some((role: string) => role === user.role)) {
    // grant access if the roles overlap
    return true;
  }

  // no roles matched, restrict access
  return false;
};
