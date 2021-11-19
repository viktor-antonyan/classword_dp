const jwt = require('jsonwebtoken');
const fs = require('fs')

const {connection} = require('../database/connection');
const {StatusCodes} = require('http-status-codes');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const mimeTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
}

class User {
    // login user
    static login = async (req, res, next) => {
        try {
            const {email, password} = req.body
            const res = new Promise((resolve, reject) => {
                connection.query('select * from `users` where email=?', [email], function (error, results, fields) {
                    if (error) return reject(error);
                    resolve(results)
                });
            });
            const user = await res
            const isMatch = await bcrypt.compare(password, res.password);

            if (!user || !isMatch) {
                return res.json({status: 403, message: 'incorrect email or password'})
            }

            const token = jwt.sign({userId: user.id}, JWT_SECRET)
            res.json({
                user,
                token
            })
        } catch (e) {
            next(e)
        }
    }

    // Get all
    static index = (req, res) => {

    }

    // Get auth user
    static auth = async (req, res, next) => {
        try {
            const {userId} = req
            if (!userId) {
                return res.json({status: 403, message: 'user is not authorized'})
            }
            let userData = new Promise((resolve, reject) => {
                connection.query('select * from `users` where id=?', [userId], function (error, results, fields) {
                    if (error) return reject(error);
                    resolve(results)
                });
            });

            let result = await userData;
            delete result[0].password;
            return res.status(StatusCodes.OK).json({message: 'success', data: result});
        } catch (e) {
            next(e)
        }
    }

    // Get by :id
    static show = async (req, res) => {
        let userData = new Promise((resolve, reject) => {
            connection.query('select * from `users` where id=?', [req.params.id], function (error, results, fields) {
                if (error) return reject(error);
                console.log("Line 2")
                console.table(results);

                resolve(results)
            });
        });

        console.log("Line 4")
        let result = await userData;
        console.log(result)
        console.log("Line 5")

        delete result[0].password;

        console.log("Line 3")

        return res.status(StatusCodes.OK).json({message: 'success', data: result});
    }

    // Create a new user
    static create = async function (req, res) {
        try {
            const {file} = req
            const imgName = `${file.fieldname}-${Date.now()}${mimeTypes[file.mimetype]}`
            const folder = `public/images`
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, {recursive: true})
            }
            const fileName = folder + '/' + imgName
            fs.writeFileSync(fileName, file.buffer)

            const passwordHash = bcrypt.hashSync(req.body.password, 5)
            let data = new Promise((resolve, reject) => {
                connection.query('INSERT INTO `users` (`name`, `email`, `password`, `gender`, `dob`,`avatar`) VALUES (?,?,?,?,?,?)', [req.body.name, req.body.email, passwordHash, req.body.gender, req.body.dob, fileName], function (error, results, fields) {
                    if (error) reject(error);

                    console.table(results);
                    return resolve(results)
                });
            });

            let results = await data;

            return res.status(201).json({message: 'success', data: {id: results.insertId}});
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'error', data: error});
        }
    }

    // Update user by :id
    static update = function (req, res) {
        // Create a new user
    }


    // Delete user by :id
    static destroy = function (req, res) {
        // Create a new user
    }
}

module.exports = {User}