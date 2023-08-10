import {
  type MiddlewareInterface,
  type NextFn,
  type ResolverData,
} from "type-graphql";
import { Service } from "typedi";
import { type Context } from "./context.type";

@Service()
export class LogAccessMiddleware implements MiddlewareInterface<Context> {
  constructor() {}

  async use({ context }: ResolverData<Context>, next: NextFn) {
    console.log(
      "🚀 ~ file: middleware.ts:14 ~ LogAccessMiddleware ~ use ~ context:",
      context.user
    );
    return next();
  }
}
