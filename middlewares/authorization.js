import jwt from "jsonwebtoken";
import HttpError from "http-errors";

const {JWT_SECRET} = process.env

const EXCLUDE = [
    '/login',
    '/register',
]

export function authorization(req, res, next) {
    try {
        const {url} = req
        if (EXCLUDE.includes(url)) {
            return next()
        }
        const {authorization} = req.headers
        const token = authorization.split(' ')[1]
        const data = jwt.verify(token, JWT_SECRET)
        let userId = data.userId
        if (!userId) {
            throw HttpError(403)
        }
        req.userId = userId
        next()
    } catch (e) {
        next(e)
    }
}