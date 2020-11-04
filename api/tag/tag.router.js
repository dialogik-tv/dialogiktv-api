const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    getTags,
    getTag,
    addToolTag,
    updateTag,
    deleteTag
} = require("./tag.controller");

router.get("/tags", getTags);
router.get("/tag/:tag", getTag);
router.post("/tag/create", checkToken, addToolTag);
router.patch("/tag/edit/:id", checkToken, updateTag);
router.delete("/tag/delete/:id", checkToken, deleteTag);

module.exports = router;
