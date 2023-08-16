"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = void 0;
const authChecker = ({ context: { user } }, roles) => {
    if (roles.length === 0) {
        // if `@Authorized()`, check only if user exists
        return user !== undefined;
    }
    // there are some roles defined now
    if (!user) {
        // and if no user, restrict access
        return false;
    }
    if (roles.some((role) => role === user.role)) {
        // grant access if the roles overlap
        return true;
    }
    // no roles matched, restrict access
    return false;
};
exports.authChecker = authChecker;
