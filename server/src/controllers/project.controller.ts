import { getUserProjectsGateway } from "../gateway/project.gateway";
import { Request, Response, NextFunction } from "express";
import UserProjects from "../project-cases/projectInterators";

export const getAllUserProjects = async (req: Request, res: Response) => {
  const { uuid } = req.body;
  try {
    const projects = UserProjects({ getUserProjectsGateway }, { uuid });
    const response = await projects;
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error: get projects" });
  }
};

// export const createNewProject = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log(req, res);
//     // const { title, body } = req.body;
//     // const project = new Project(title, body);
//     // await project.save();
//     res.status(201).send({ message: `hmmm` });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getProjectById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const project = await Project.findById(id);
//     res.status(200).send(project);
//   } catch (error) {
//     next(error);
//   }
// };
