"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
const user_schema_1 = require("../schema/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.createUser = async (input) => {
            return user_schema_1.UserModel.create(input);
        };
        this.findUser = async (input) => {
            const { email, password } = input;
            const user = await user_schema_1.UserModel.findOne({ email: email });
            if (!user) {
                throw Error(constant_1.errorMsgs.incorrectEmail);
            }
            const match = await bcrypt_1.default.compare(password, user.password);
            if (!match) {
                throw Error(constant_1.errorMsgs.incorrectPassword);
            }
            return user;
        };
        this.deleteUser = async (input) => {
            const user = await this.findUser(input);
            const { _id } = user;
            const deletedUser = await user_schema_1.UserModel.deleteOne({ _id });
            if (deletedUser) {
                return user;
            }
            return null;
        };
    }
}
exports.default = UserService;
