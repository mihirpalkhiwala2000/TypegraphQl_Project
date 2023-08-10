import { getModelForClass, index, pre, prop } from "@typegoose/typegoose";
import { IsEmail, MinLength } from "class-validator";
import {
  Authorized,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import bcrypt from "bcrypt";
import { errorMsgs } from "../constant";
import { ObjectId } from "mongoose";
import { Phone } from "../enum";

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
  _id: ObjectId;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true, unique: true })
  email: string;

  @Field(() => Number)
  @prop({ required: true })
  age: number;

  @Field(() => Boolean, { nullable: true })
  @prop()
  eligibleToVote?: boolean;

  @Field(() => Phone)
  @prop({ required: true })
  phoneBrand: Phone;

  @Authorized("Admin")
  @Field(() => String, { nullable: true })
  @prop()
  role?: string;

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

  @Field(() => String)
  role?: string;

  @Field(() => Phone)
  phoneBrand: Phone;

  @Field(() => Number)
  age: number;
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
