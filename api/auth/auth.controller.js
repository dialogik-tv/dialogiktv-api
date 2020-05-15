const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const db = require ("../../models");

module.exports = {
    register: (req, res) => {
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
                    const jsonToken = sign({ result: result }, process.env.JWT_SECRET, {
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
    }
};
