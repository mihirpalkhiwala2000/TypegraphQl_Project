// import { User } from "./schema/user.schema";
// import { type AuthChecker } from "type-graphql";

// export interface Context {
//   user?: User;
// }

// // Auth checker function
// export const authChecker: AuthChecker<Context> = ({ context: user }, role) => {
//   console.log(user);
//   // Check user
//   if (!user) {
//     // No user, restrict access
//     return false;
//   }

//   // Check '@Authorized()'
//   if (!role) {
//     // Only authentication required
//     return true;
//   }

//   // Check '@Authorized(...)' roles overlap
//   return role == "User";
// };
