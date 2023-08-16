"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("./resolvers");
const mongo_1 = require("./utils/mongo");
const http_1 = require("http");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authorization_1 = require("./authorization");
const bootstrap = async () => {
    const schema = await (0, type_graphql_1.buildSchema)({
        resolvers: resolvers_1.resolvers,
        authChecker: authorization_1.authChecker,
        emitSchemaFile: path_1.default.resolve(__dirname, "schema.gql"),
    });
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use((0, cookie_parser_1.default)());
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        // context: ({ req }) => {
        //   const context = {
        //     req,
        //     user: req.body.variables.input,
        //   };
        //   return context;
        // },
        // introspection: true,
        // csrfPrevention: true,
        // cache: "bounded",
        // plugins: [
        //   ApolloServerPluginDrainHttpServer({ httpServer }),
        //   {
        //     async serverWillStart() {
        //       return {
        //         async drainServer() {
        //           await serverCleanup.dispose();
        //         },
        //       };
        //     },
        //   },
        //   ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        // ],
    });
    await server.start();
    server.applyMiddleware({ app });
    const PORT = 8080;
    const HOST = "0.0.0.0";
    app.listen(PORT, HOST, () => {
        console.log(`Running on http://${HOST}:${PORT}`);
    });
    (0, mongo_1.connectToMongo)();
};
bootstrap();
