const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createTool,
    getTools,
    searchTools,
    getToolByIdOrSlug,
    updateTool,
    deleteTool
} = require("./tool.controller");

router.post("/tool/create", checkToken, createTool);
router.get("/tools", getTools);
router.get("/tools/search/:filter", searchTools);
router.get("/tool/:slug", getToolByIdOrSlug);
router.patch("/tool/edit/:id", checkToken, updateTool);
router.delete("/tool/delete/:id", checkToken, deleteTool);

module.exports = router;
