const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createTool,
    getTools,
    getToolBySlug,
    updateTool,
    deleteTool,
    addTag
} = require("./tool.controller");

// Tool routes
router.post("/tool/create", checkToken, createTool);
router.get("/tools", getTools);
router.get("/tool/:slug", getToolBySlug);
router.patch("/tool/edit/:slug", checkToken, updateTool);
router.delete("/tool/delete/:slug", checkToken, deleteTool);

// Tag routes
router.post("/tool/tag", checkToken, addTag);

module.exports = router;
