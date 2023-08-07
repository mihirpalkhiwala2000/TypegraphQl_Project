import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers";
import { connectToMongo } from "./utils/mongo";

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers,
  });

  const app = express();
  app.use(cookieParser());

  const server = await new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () => {
    console.log("App is listening on port 3000");
  });
  connectToMongo();
};

bootstrap();
