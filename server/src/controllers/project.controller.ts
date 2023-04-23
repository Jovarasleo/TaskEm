import Project from "../gateway/project.gateway";
import { Request, Response, NextFunction } from "express";

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.findAll();
    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
};

export const createNewProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, body } = req.body;
    const project = new Project(title, body);
    await project.save();
    res.status(201).send({ message: `Project ${title} created successfully` });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    res.status(200).send(project);
  } catch (error) {
    next(error);
  }
};
