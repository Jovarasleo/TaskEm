export interface IProject {
  projectId: string;
  projectName: string;
  ownerId: string;
}

class Project {
  readonly projectId: string;
  readonly ownerId: string;
  projectName: string;

  constructor(projectId: string, projectName: string, ownerId: string) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.ownerId = ownerId;
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
