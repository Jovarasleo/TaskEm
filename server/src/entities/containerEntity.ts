export interface IContainer {
  containerId: string;
  containerName: string;
  position: bigint;
  projectId: string;
}

class Container {
  containerId: string;
  containerName: string;
  position: bigint;
  readonly projectId: string;

  constructor(
    containerId: string,
    containerName: string,
    position: bigint,
    projectId: string
  ) {
    this.containerId = containerId;
    this.containerName = containerName;
    this.position = position;
    this.projectId = projectId;
  }

  async validate() {
    let errors = [];

    if (!this.containerId) {
      errors.push("Container is missing Unique Identifier");
    }

    if (!this.projectId) {
      errors.push("Container is missing ProjectId");
    }

    if (!this.containerName) {
      errors.push("Container is missing name");
    }

    if (errors.length > 0) {
      return { error: errors };
    } else {
      return {
        containerId: this.containerId,
        containerName: this.containerName,
        position: this.position,
        projectId: this.projectId,
      };
    }
  }
}

export default Container;
