import { useState } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/configureStore";
import { clientLoadContainers } from "../../../../store/slices/containerReducer";
import { clientCreateProject } from "../../../../store/slices/projectReducer";
import { clientLoadTasks } from "../../../../store/slices/taskReducer";
import { uid } from "../../../../util/uid";
import { defaultContainers } from "../../model/containers";

function CreateProject() {
  const dispatch: AppDispatch = useDispatch();
  const [projectName, setProjectName] = useState("");
  const [addNew, setAddNew] = useState(false);

  const handleCreate = () => {
    const projectId = uid();
    // const projectName = newProjectName.trim();

    const containers = defaultContainers(projectId);

    dispatch(
      clientCreateProject({
        project: {
          projectId,
          projectName: "bynis 300",
        },
        containers,
      })
    );
    dispatch(clientLoadTasks([]));
    dispatch(clientLoadContainers(containers));

    setProjectName("");
    setAddNew(false);
  };

  return (
    <div className="my-4">
      <button
        onClick={handleCreate}
        className="flex justify-center rounded-full items-center ml-auto p-2 bg-neutral-100 group hover:bg-neutral-700 cursor-pointer transition-colors"
      >
        <MdDashboardCustomize className="size-7 group-hover:text-[#f98e4c] text-neutral-700 transition-colors" />
      </button>
    </div>
  );
}
export default CreateProject;
