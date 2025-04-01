import { FaTrashAlt } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { IoPersonAdd } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/configureStore";
import {
  clientEditProject,
  deleteProjectWithRelatedData,
  selectProjectWithRelatedData,
} from "../../../../store/slices/projectReducer";
import { Project } from "../../model/task";
import styles from "./styles.module.scss";
import clsx from "clsx";
import Dropdown from "../../../../components/dropdown/Dropdown";

function ProjectList() {
  const dispatch: AppDispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.project);
  const navigate = useNavigate();

  const getOptions = (project: Project) => [
    {
      node: (
        <div className="flex items-center gap-2">
          <span>
            <FaTrashAlt />
          </span>
          Delete
        </div>
      ),
      key: "Delete",
      onClick: () => dispatch(deleteProjectWithRelatedData(project)),
    },
    {
      node: (
        <div className="flex items-center gap-2">
          <span>
            <MdEdit />
          </span>
          Edit
        </div>
      ),
      key: "Edit",
      onClick: () =>
        dispatch(clientEditProject({ ...project, projectName: "Namu darbai (shared)" })),
    },
    {
      node: (
        <div className="flex items-center gap-2">
          <span>
            <IoPersonAdd />
          </span>
          Add user
        </div>
      ),
      key: "Add",
      onClick: () => console.log("TODO: Add user invitation"),
    },
  ];

  if (!projects.data.length) {
    return (
      <section className={styles.selectProject}>
        <h3>No task boards yet!</h3>
      </section>
    );
  }

  return (
    <section className={styles.selectProject}>
      {projects.data.map((project: Project) => {
        return (
          <div key={project.projectId} className="flex border-b-1">
            <button
              className={clsx(
                project.projectId === projects?.selected?.projectId && "text-orange-300",
                "cursor-pointer w-full hover:text-orange-200 transition-colors py-2 px-1 text-left"
              )}
              onClick={() => {
                navigate("/");
                dispatch(selectProjectWithRelatedData(project));
              }}
            >
              {project.projectName}
            </button>
            <Dropdown
              className="flex items-center px-4 cursor-pointer group"
              options={getOptions(project)}
            >
              <BsThreeDots className="group-hover:text-orange-200" />
            </Dropdown>
          </div>
        );
      })}
    </section>
  );
}
export default ProjectList;
