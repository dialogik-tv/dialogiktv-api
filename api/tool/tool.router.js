const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createTool,
    getTools,
    getToolById,
    updateTool,
    deleteTool
} = require("./tool.controller");

router.post("/tool/create", checkToken, createTool);
router.get("/tools", getTools);
router.get("/tools/:slug", getToolById);
router.patch("/tool/edit/:id", checkToken, updateTool);
router.delete("/tool/delete/:id", checkToken, deleteTool);

module.exports = router;
