const HttpError = require("http-errors");
const jwt = require('jsonwebtoken');


const {JWT_SECRET} = process.env

const EXCLUDE = [
    '/user/login',
    '/user/register',
]

function authorization(req, res, next) {
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
module.exports = authorization