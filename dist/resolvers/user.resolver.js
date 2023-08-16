"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const user_schema_1 = require("../schema/user.schema");
const user_service_1 = __importDefault(require("../service/user.service"));
const notification_types_1 = require("../notification-types");
let UserResolver = class UserResolver {
    constructor(userService) {
        this.userService = userService;
        this.userService = new user_service_1.default();
    }
    async eligibleToVote(user) {
        if (user.age >= 18) {
            await user_schema_1.UserModel.findByIdAndUpdate(user._id, { eligibleToVote: true });
            return true;
        }
        await user_schema_1.UserModel.findByIdAndUpdate(user._id, { eligibleToVote: false });
        return false;
    }
    async createUser(input, pubSub) {
        const createdUser = await this.userService.createUser(input);
        const { _id, name } = createdUser;
        const payload = {
            command: "create",
            id: _id,
            name,
            message: `The created user's name is ${createdUser.name} and email id is ${createdUser.email} `,
        };
        await pubSub.publish("NOTIFICATIONS", payload);
        return createdUser;
    }
    async createAdmin(input, pubSub) {
        const createdUser = await this.userService.createUser(input);
        const { _id, name } = createdUser;
        const payload = {
            command: "create",
            id: _id,
            name,
            message: `The created admin's name is ${createdUser.name} and email id is ${createdUser.email} `,
        };
        await pubSub.publish("ADMINNOTIFICATIONS", payload);
        return createdUser;
    }
    findUser(input) {
        return this.userService.findUser(input);
    }
    async DeleteUser(input, pubSub) {
        const deletedUser = await this.userService.deleteUser(input);
        if (deletedUser) {
            const { name, _id } = deletedUser;
            const payload = {
                command: "delete",
                id: _id,
                name,
                message: `The deleted user's name is ${deletedUser.name} and email id is ${deletedUser.email} `,
            };
            await pubSub.publish("DELETENOTIFICATIONS", payload);
            return deletedUser;
        }
    }
    SubNotification({ id, message, name, command }) {
        return {
            id,
            name,
            message,
            command,
            date: new Date(),
        };
    }
    me() {
        return {
            _id: "123",
            name: "Mihir",
            email: "Mihir@123.com",
        };
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "eligibleToVote", null);
__decorate([
    (0, type_graphql_1.Authorized)("User")
    // @UseMiddleware(LogAccessMiddleware)
    ,
    (0, type_graphql_1.Mutation)(() => user_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.CreateUserInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Authorized)("Admin")
    // @UseMiddleware(LogAccessMiddleware)
    ,
    (0, type_graphql_1.Mutation)(() => user_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.CreateUserInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.findUserInput]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "findUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_schema_1.User),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.findUserInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "DeleteUser", null);
__decorate([
    (0, type_graphql_1.Subscription)({
        topics: ["NOTIFICATIONS", "DELETENOTIFICATIONS", "ADMINNOTIFICATIONS"],
        filter: ({ payload }) => payload.name === "Mihir",
    }),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", notification_types_1.Notification)
], UserResolver.prototype, "SubNotification", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_schema_1.User, { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => user_schema_1.User),
    __metadata("design:paramtypes", [user_service_1.default])
], UserResolver);
exports.default = UserResolver;
