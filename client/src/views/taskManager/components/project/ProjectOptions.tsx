import Dropdown from "@components/dropdown/Dropdown";

interface Props {
  hasProjects: boolean;
  deleteProject: () => void;
  deleteContainers: () => void;
  deleteTask: () => void;
}

const ProjectMenu = ({ hasProjects, deleteProject, deleteContainers, deleteTask }: Props) => {
  if (!hasProjects) {
    return null;
  }

  return (
    <Dropdown
      options={[
        {
          title: "delete",
          onClick: () => {
            deleteProject();
            deleteContainers();
            deleteTask();
          },
        },
      ]}
    />
  );
};

export default ProjectMenu;
