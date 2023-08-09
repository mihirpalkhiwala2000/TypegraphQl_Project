import { ObjectId } from "mongoose";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Notification {
  @Field((type) => ID)
  id: ObjectId;

  @Field({ nullable: true })
  message?: string;

  @Field((type) => Date)
  date: Date;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  command?: string;
}

export interface NotificationPayload {
  id: ObjectId;
  name: string;
  command: string;
  message?: string;
}
