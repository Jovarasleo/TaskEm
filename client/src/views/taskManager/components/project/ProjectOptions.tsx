import Dropdown from "@components/dropdown/Dropdown";

interface Props {
  deleteProject: () => void;
}

const ProjectMenu = ({ deleteProject }: Props) => {
  return (
    <Dropdown
      options={[
        {
          title: "delete",
          onClick: () => {
            deleteProject();
          },
        },
      ]}
    />
  );
};

export default ProjectMenu;
