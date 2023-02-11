const Project = require("../model/Project");

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
};

exports.createNewProject = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const project = new Project(title, body);
    await project.save();
    res.status(201).send({ message: `Project ${title} created successfully` });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).send(project);
  } catch (error) {
    next(error);
  }
};
