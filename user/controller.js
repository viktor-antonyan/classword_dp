const { connection } = require('../database/connection');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const {getUserByEmail, getUserById} = require("../utils/queryHp");

class User {

    // Get all
    static index = async (req, res, next) => {
        try {
            await connection.query('SELECT * FROM members', function (error, results, fields) {
                if (error) throw error;
                res.status(StatusCodes.OK)
                res.json({
                    status: 'ok',
                    members: results
                })
            });
        } catch (e) {
            next(e)
        }
    }

    // Get by :id
    static show = async (req, res, next) => {
        try {
            const {id} = req.params
            await connection.query(`SELECT * FROM members WHERE id = ${id}`, function (error, results, fields) {
                if (error) throw error;
                res.status(StatusCodes.OK)
                res.json({
                    data: results
                })
            });
        } catch (e) {
            next(e)
        }
    }

    // Create a new user
    static create = async function (req, res, next) {
        try {
            let now = new Date();
            const momentDate = moment(now).format('YYYY-MM-DD')

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(HttpError('validation error', errors.array()))
            }
            const {first_name, last_name, email, date_of_birth} = req.body
            const created_at = momentDate
            const updated_at = momentDate
            const candidate = await getUserByEmail(email)
            if (candidate[0]) {
                res.json({
                    status: 'error',
                    message: "email already exists"
                })
            }
            await connection.query(`INSERT INTO members(first_name, last_name, email, date_of_birth, created_at, updated_at) 
                                    VALUES('${first_name}','${last_name}','${email}','${date_of_birth}','${created_at}','${updated_at}')`,
                function (error, results, fields) {
                    if (error) throw error;
                    res.status(StatusCodes.CREATED)
                    res.json({
                        message: 'success'
                    })
                });
        } catch (e) {
            next(e)
        }

        return res.status(201).json({ message: 'success' });
    }

    // Update user by :id
    static update = async function (req, res, next) {
        try {
            let now = new Date();
            const momentDate = moment(now).format('YYYY-MM-DD')
            const errors = validationResult(req)
            const updated_at = momentDate

            if (!errors.isEmpty()) {
                return next(HttpError('validation error', errors.array()))
            }
            const {first_name, last_name, email, date_of_birth} = req.body
            const candidate = await getUserByEmail(email);
            if (!candidate[0]) {
                res.json({
                    status: 'error',
                    message: "not a user in email" + email
                })
            }

            await connection.query(`UPDATE members SET first_name = '${first_name}', last_name = '${last_name}', date_of_birth = '${date_of_birth}', updated_at = '${updated_at}'  
                WHERE email = '${email}'`, function (error, results, fields) {
                if (error) throw error;

                res.status(StatusCodes.UPDATE)
                res.json({
                    message: 'user successfully updated'
                })
            });
        } catch (e) {
            next(e)
        }    }

    // Delete user by :id
    static destroy = async function (req, res, next) {
        try {
            let {id} = req.params
            const candidate = await getUserById(id);
            if (!candidate[0]) {
                throw new Error('not user in id' + id)
            }

            await connection.query(`DELETE FROM members WHERE id = '${id}'`, function (error, results, fields) {
                if (error) throw error;

                res.status(StatusCodes.DELETE)
                res.json({
                    message: 'user successfully deleted'
                })
            });
        } catch (e) {
            next(e)
        }    }
}

module.exports = { User }