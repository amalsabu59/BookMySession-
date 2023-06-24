"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeanLoggedin = exports.checkAuthTokenAndGrandPermission = void 0;
function checkAuthTokenAndGrandPermission(req, res) {
    if (!req.headers.authorization) {
        res.status(403).json({ message: "Access Denied: Auth Token Required" });
        return false;
    }
    const authToken = req.headers.authorization.split(" ")[1];
    const sessionToken = req.session.bearerToken;
    if (authToken !== sessionToken) {
        res
            .status(403)
            .json({ message: "Access Denied: Auth Token Expired or not valid" });
        return false;
    }
    return true;
}
exports.checkAuthTokenAndGrandPermission = checkAuthTokenAndGrandPermission;
function isDeanLoggedin(req, res) {
    if (!req.headers.authorization) {
        res.status(403).json({ message: "Access Denied: Auth Token Required" });
        return false;
    }
    const authToken = req.headers.authorization.split(" ")[1];
    if (authToken.includes("dean")) {
        return true;
    }
    return false;
}
exports.isDeanLoggedin = isDeanLoggedin;
