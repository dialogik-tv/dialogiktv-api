const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createTool,
    getToolsByTag,
    getTools,
    getToolBySlug,
    updateTool,
    deleteTool
} = require("./tool.controller");

router.post("/tool/create", checkToken, createTool);
router.get("/tools/tag/:tag", getToolsByTag);
router.get("/tools", getTools);
router.get("/tool/:slug", getToolBySlug);
router.patch("/tool/edit/:id", checkToken, updateTool);
router.delete("/tool/delete/:id", checkToken, deleteTool);

module.exports = router;
