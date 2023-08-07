import { getModelForClass, index, pre, prop } from "@typegoose/typegoose";
import { IsEmail, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import { errorMsgs } from "../constant";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
@index({ email: 1 })
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: errorMsgs.passwordLengthError,
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class findUserInput {
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: errorMsgs.passwordLengthError,
  })
  @Field(() => String)
  password: string;
}
