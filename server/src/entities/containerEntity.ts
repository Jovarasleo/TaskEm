export interface IContainer {
  containerId: string;
  containerName: string;
  position: bigint;
  createdAt: string;
  modifiedAt: string;
  projectId: string;
}

class Container {
  containerId: string;
  containerName: string;
  position: bigint;
  createdAt: string;
  modifiedAt: string;
  readonly projectId: string;

  constructor(
    containerId: string,
    containerName: string,
    position: bigint,
    createdAt: string,
    modifiedAt: string,
    projectId: string
  ) {
    this.containerId = containerId;
    this.containerName = containerName;
    this.position = position;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.projectId = projectId;
  }

  async validate() {
    let errors = [];

    if (!this.createdAt) {
      errors.push("Container is missing creation date");
    }

    if (!this.modifiedAt) {
      errors.push("Container is missing modified at");
    }

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
        createdAt: this.createdAt,
        modifiedAt: this.modifiedAt,
        projectId: this.projectId,
      };
    }
  }
}

export default Container;
