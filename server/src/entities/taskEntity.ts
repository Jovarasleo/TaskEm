export interface ITask {
  taskId: string;
  projectId: string;
  containerId: string;
  value: string;
  count: number;
  position: bigint;
}

class Task {
  readonly taskId: string;
  readonly projectId: string;
  containerId: string;
  value: string;
  count: number;
  position: bigint;

  constructor(
    taskId: string,
    projectId: string,
    containerId: string,
    value: string,
    count: number,
    position: bigint
  ) {
    this.taskId = taskId;
    this.projectId = projectId;
    this.containerId = containerId;
    this.value = value;
    this.count = count;
    this.position = position;
  }

  async validate() {
    let errors = [];

    if (!this.taskId) {
      errors.push("Task is missing task id");
    }

    if (!this.containerId) {
      errors.push("Container is missing container id");
    }

    if (!this.projectId) {
      errors.push("Container is missing project id");
    }

    if (errors.length > 0) {
      return { error: errors };
    } else {
      return {
        taskId: this.taskId,
        projectId: this.projectId,
        containerId: this.containerId,
        value: this.value,
        count: this.count,
        position: this.position,
      };
    }
  }
}

export default Task;
