const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    // getUserById,
    getUserByUsername,
    getUsers,
    getEngineers,
    getMe,
    updateUser,
    deleteUser
} = require("./user.controller");

// JWT auth required routes
router.get("/user/me", checkToken, getMe);
router.patch("/user/edit", checkToken, updateUser);
router.delete("/user/delete", checkToken, deleteUser);

// Public routes
router.get("/users", checkToken, getUsers);
router.get("/users/engineers", getEngineers);
router.get("/user/:username", getUserByUsername);

module.exports = router;
