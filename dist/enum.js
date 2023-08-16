"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
const type_graphql_1 = require("type-graphql");
var Phone;
(function (Phone) {
    Phone[Phone["ANDROID"] = 0] = "ANDROID";
    Phone[Phone["IOS"] = 1] = "IOS";
})(Phone || (exports.Phone = Phone = {}));
(0, type_graphql_1.registerEnumType)(Phone, {
    name: "Phone",
    description: "Phone os",
});
