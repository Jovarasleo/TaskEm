import db from "../../config/db";

class Project {
  title: string;
  body: string;

  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }

  async save() {
    const sql = "INSERT INTO projects (title, body) VALUES (?, ?)";
    const values = [this.title, this.body];

    try {
      const [newProject] = await db.execute(sql, values);
      return newProject;
    } catch (error) {
      console.log(error);
    }
  }

  static async findAll() {
    const sql = "SELECT * FROM projects";

    try {
      const [projects] = await db.execute(sql);
      return projects;
    } catch (error) {
      console.log(error);
    }
  }

  static async findById(id: string) {
    const sql = "SELECT * FROM projects WHERE id = ?";

    try {
      const [project] = await db.execute(sql, [id]);
      return project;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Project;
