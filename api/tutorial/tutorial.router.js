const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    getTutorials,
    getTutorial,
    addToolTutorial,
    updateTutorial,
    deleteTutorial
} = require("./tutorial.controller");

router.get("/tutorials", getTutorials);
router.get("/tutorial/:id", getTutorial);
router.post("/tutorial/create", checkToken, addToolTutorial);
router.patch("/tutorial/edit/:id", checkToken, updateTutorial);
router.delete("/tutorial/delete/:id", checkToken, deleteTutorial);

module.exports = router;
