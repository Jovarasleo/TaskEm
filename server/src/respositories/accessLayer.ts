import { ContainerRepository } from "./containerRepository.js";
import { ProjectRepository } from "./projectRepository.js";
import { TaskRepository } from "./taskRespository.js";
import { UserRepository } from "./userRepository.js";

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
