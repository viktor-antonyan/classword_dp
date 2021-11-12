const { connection } = require('../database/connection');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

class User {

    // Get all
    static index = (req, res) => {

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

        console.log("Line 3")

        return res.status(StatusCodes.OK).json({ message: 'success', data: result });
    }

    // Create a new user
    static create = function (req, res) {
        const errors = validationResult(req);

        connection.query('INSERT INTO `users` (`name`,`gender`,`dob`) VALUES (?,?,?)', [req.body.name, req.body.gender, req.body.dob], function (error, results, fields) {
            if (error) throw error;

            console.table(results)
        })

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return res.status(201).json({ message: 'success' });
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

module.exports = { User }