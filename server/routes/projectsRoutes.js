const express = require("express");
const postControllers = require("../controllers/projectsControllers");
const router = express.Router();

router
  .route("/")
  .get(postControllers.getAllProjects)
  .post(postControllers.createNewProject);

router.route("/:id").get(postControllers.getProjectById);

module.exports = router;
