"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreFavicon = void 0;
const ignoreFavicon = (req, res, next) => {
    if (req.originalUrl.includes("favicon.ico")) {
        res.status(204).end();
    }
    next();
};
exports.ignoreFavicon = ignoreFavicon;
// export const unknownEndpoint = (
//   req: Request,
//   _res: Response,
//   next: NextFunction
// ) => {
//   next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404))
// }
