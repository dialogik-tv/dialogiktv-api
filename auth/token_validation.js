const jwt = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // Remove Bearer from string
            token = token.slice(7);
            jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                if (error) {
                    return res.json({
                        code: 401,
                        message: "Invalid token"
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                code: 401,
                message: "Unauthorized user"
            });
        }
    }
};
