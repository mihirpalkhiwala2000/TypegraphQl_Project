"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToMongo() {
    try {
        await mongoose_1.default.connect(process.env.DB_URL);
        console.log("Connected to database");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
exports.connectToMongo = connectToMongo;
