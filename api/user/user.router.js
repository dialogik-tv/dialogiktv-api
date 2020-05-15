const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    // getUserById,
    getUserByUsername,
    getUsers,
    getMe,
    updateUser,
    deleteUser
} = require("./user.controller");

// Public routes
router.get("/users", getUsers);
router.get("/user/:username", getUserByUsername);

// JWT auth required routes
router.get("/user/me", checkToken, getMe);
router.patch("/user/edit", checkToken, updateUser);
router.delete("/user/delete", checkToken, deleteUser);

module.exports = router;
