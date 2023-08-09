import { registerEnumType } from "type-graphql";

export enum Phone {
  ANDROID,
  IOS,
}

registerEnumType(Phone, {
  name: "Phone",
  description: "Phone os",
});
