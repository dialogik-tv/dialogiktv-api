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
                    code: 500,
                    message: "Database error"
                });
            }
            return res.status(200).json({
                code: 200,
                data: results
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        const invalidMessage = "Invalid email or password";
        getUserByUserEmail(body.email, (error, results) => {
            if (error) {
                console.log(error);
            }
            if (!results) {
                return res.json({
                    code: 401,
                    message: invalidMessage
                });
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsonToken = sign({ result: results }, process.env.JWT_KEY, {
                    expiresIn: "14d"
                });
                return res.json({
                    code: 200,
                    message: "Login successful",
                    token: jsonToken
                });
            } else {
                return res.json({
                    code: 401,
                    message: "Invalid email or password"
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
                    code: 404,
                    message: "Record not found"
                });
            }
            results.password = undefined;
            return res.json({
                code: 200,
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
                code: 200,
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
                code: 200,
                message: "Update successful"
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
                    code: 404,
                    message: "Record not found"
                });
            }
            return res.json({
                code: 200,
                message: "User successfully deleted"
            });
        });
    }
};
