const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createUser,
    login,
    // getUserById,
    getUserByUsername,
    getUsers,
    getMe,
    updateUser,
    deleteUser
} = require("./user.controller");

// Routes (register, login and /users are special,
// all others follow /user/<subpath> principle)
router.post("/register", createUser);
router.post("/login", login);
router.get("/users", checkToken, getUsers);
router.get("/user/me", checkToken, getMe);
// router.get("/user/:id", checkToken, getUserByUserId);
router.get("/user/:username", checkToken, getUserByUsername);
router.patch("/user/edit", checkToken, updateUser);
router.delete("/user/delete", checkToken, deleteUser);

module.exports = router;
