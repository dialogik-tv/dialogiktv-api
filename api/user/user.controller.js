const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");



module.exports = {
    getUsers: (req, res) => {
        db.User.findAll().then( (result) => res.json(result) );
    },
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        body.status = 0;

        db.User.create(body)
            .then( (result) => res.json({
                "message": `User ${body.username} successfully created`
            }) )
            .catch( (e) => {
                console.log();

                if(e.original.code == 'ER_DUP_ENTRY') {
                    return res.status(409).json({
                        "error": 'Duplicate constraint violation',
                        "message": e.original.sqlMessage
                    })
                } else {
                    return res.status(500).json({
                        "error": 'Database error, please try again later'
                    });
                }
            });
    },
    login: (req, res) => {
        const body = req.body;
        const invalidMessage = "Login failed";
        db.User.findOne({
            where: {
                email: body.email,
            }
        }).then(
            (result) => {
                if (!result) {
                    return res.status(401).json({
                        message: invalidMessage
                    });
                }
                const check = compareSync(body.password, result.password);

                if (check) {
                    result.password = undefined;
                    const jsonToken = sign({ result: result }, process.env.JWT_KEY, {
                        expiresIn: "14d"
                    });
                    return res.json({
                        message: "Login successful",
                        token: jsonToken
                    });
                } else {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }
            }
        );
    },
    getMe: (req, res) => {
        const owner = req.decoded.result.username;
        db.User.findOne({
            where: {
                username: owner
            }
        }).then( (result) => res.json(result) )
    },
    getUserByUserId: (req, res) => {
        db.User.findByPk(req.body.id).then( (result) => {
            if(!result) {
                return res.status(404).json({
                    message: `No user found with id ${id}`
                })
            }
            return res.json(result)
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const owner = req.decoded.result.username;

        // Hash password if passed
        if(typeof body.password !== 'undefined') {
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
        }

        // Update user
        db.User.update(body, {
            where: {
                username: owner
            }
        }).then( (result) => {
            result = result[0];

            // In case owner's username does not match any entry in database
            if(result !== 1) {
                return res.status(500).json({
                    error: `Error updating ${owner}`
                })
            }

            // Else
            let message = `User ${owner} successfully updated`;
            return res.json({message: message});
        })
        .catch( (e) => {
            let error = 'Error updating user';
            console.log(error, e);
            return res.status(500).json( {error:error} );
        });
    },
    deleteUser: (req, res) => {
        const owner = req.decoded.result.username;
        db.User.destroy({
            where: {
                username: owner
            }
        }).then( (result) => res.json(result) );
    }
};
