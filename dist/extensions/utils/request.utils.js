"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestUtils {
    constructor(router) {
        this.router = router;
        this.router.use((req, res, next) => {
            this.request = req;
            this.response = res;
            next();
        });
    }
    addDataToState(key, data) {
        return (this.response.locals[key] = data);
    }
    getDataFromState(key) {
        return this.response.locals[key] || null;
    }
    getRequestUser() {
        return this.response.locals.user;
    }
}
exports.default = RequestUtils;
