import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers";
import { connectToMongo } from "./utils/mongo";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import cookieParser from "cookie-parser";
import { authChecker } from "./authorization";

const bootstrap = async () => {
  const schema = await buildSchema({
    resolvers,
    authChecker,
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  const app = express();
  const httpServer = createServer(app);
  app.use(cookieParser());
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context = {
        req,
        user: req.body.variables.input,
      };
      return context;
    },
    introspection: true,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });

  httpServer.listen({ port: 3000 }, () => {
    console.log("App is listening on port 3000");
  });
  connectToMongo();
};

bootstrap();
