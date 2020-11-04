const jwt = require("jsonwebtoken");
module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        if (token) {
            // Remove Bearer from string
            token = token.slice(7);
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        error: "Invalid token"
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(401).json({
                error: "Unauthorized user"
            });
        }
    }
};
