const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    createTool,
    getTools,
    getUnpublishedTools,
    getToolByIdOrSlug,
    getSimilarTools,
    updateTool,
    publishTool,
    rejectTool,
    deleteTool
} = require("./tool.controller");

router.post("/tool/create", checkToken, createTool);
router.get("/tools", getTools);
router.get("/tools/unpublished", checkToken, getUnpublishedTools);
router.get("/tools/:filter", getTools);
router.get("/tool/similar/:id", getSimilarTools);
router.get("/tool/:slug", getToolByIdOrSlug);
router.patch("/tool/edit/:id", checkToken, updateTool);
router.patch("/tool/publish/:id", checkToken, publishTool);
router.patch("/tool/reject/:id", checkToken, rejectTool);
router.delete("/tool/delete/:id", checkToken, deleteTool);

module.exports = router;
