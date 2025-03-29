import { ContainerRepository } from "./containerRepository";
import { ProjectRepository } from "./projectRepository";
import { TaskRepository } from "./taskRespository";
import { UserRepository } from "./userRepository";

class AccessLayer {
  public user: UserRepository;
  public task: TaskRepository;
  public container: ContainerRepository;
  public project: ProjectRepository;

  constructor() {
    this.user = new UserRepository();
    this.task = new TaskRepository();
    this.container = new ContainerRepository();
    this.project = new ProjectRepository();
  }
}

const accessLayer = new AccessLayer();
export { accessLayer };
