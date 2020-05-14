const {
    create,
    getUserByUserEmail,
    getUserByUserId,
    getUsers,
    updateUser,
    deleteUser
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection errror"
                });
            }
            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (error, results) => {
            if (error) {
                console.log(error);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, "qwe1234", {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1,
                    message: "login successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    success: 0,
                    data: "Invalid email or password"
                });
            }
        });
    },
    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserId(id, (error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not Found"
                });
            }
            results.password = undefined;
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    getUsers: (req, res) => {
        getUsers((error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            return res.json({
                success: 1,
                data: results
            });
        });
    },
    updateUsers: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            return res.json({
                success: 1,
                message: "updated successfully"
            });
        });
    },
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                });
            }
            return res.json({
                success: 1,
                message: "user deleted successfully"
            });
        });
    }
};
