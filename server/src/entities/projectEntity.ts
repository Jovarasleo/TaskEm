export interface IProject {
  projectId: string;
  projectName: string;
  uuid: string;
}

class Project {
  readonly projectId: string;
  projectName: string;

  constructor(projectId: string, projectName: string) {
    this.projectId = projectId;
    this.projectName = projectName;
  }

  async validateProject() {
    let errors = [];

    if (!this.projectId) {
      errors.push("Project is missing Unique Identifier");
    }

    if (!this.projectName) {
      errors.push("Project is missing name");
    }

    if (errors.length > 0) {
      return { error: errors };
    } else {
      return {
        projectId: this.projectId,
        projectName: this.projectName,
      };
    }
  }
}

export default Project;
