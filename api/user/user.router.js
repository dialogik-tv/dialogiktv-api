const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createUser,
    login,
    getUserByUserId,
    getUsers,
    getMe,
    updateUser,
    deleteUser
} = require("./user.controller");

router.get("/users", checkToken, getUsers);
router.post("/user", createUser);
router.get("/user", checkToken, getMe);
router.get("/user/:id", checkToken, getUserByUserId);
router.post("/login", login);
router.patch("/user", checkToken, updateUser);
router.delete("/user", checkToken, deleteUser);

module.exports = router;
