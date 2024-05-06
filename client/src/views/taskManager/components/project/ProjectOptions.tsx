import Dropdown from "@components/dropdown/Dropdown";

interface Props {
  deleteProject: () => void;
  deleteContainers: () => void;
  deleteTask: () => void;
}

const ProjectMenu = ({ deleteProject, deleteContainers, deleteTask }: Props) => {
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
