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
import clsx from "clsx";
import Dropdown from "../../../../components/dropdown/Dropdown";
import Modal from "../../../../components/modal/Modal";
import { Input } from "../../../../components/input/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import "./project.css";

const getOptions = (
  dispatch: AppDispatch,
  project: Project,
  handleEdit: (project: Project) => void
) => [
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
    onClick: () => handleEdit(project),
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

const projectEditSchema = object({
  projectId: string().required(),
  projectName: string().required(),
}).required();

function ProjectList() {
  const dispatch: AppDispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const projects = useSelector((state: RootState) => state.project);
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(projectEditSchema),
    defaultValues: {
      projectId: "",
      projectName: "",
    },
  });

  const handleEdit = ({ projectId, projectName }: Project) => {
    setModalVisible(true);
    reset({ projectId, projectName });
  };

  const submit = handleSubmit((formValues) => {
    dispatch(clientEditProject(formValues));

    reset();
    setModalVisible(false);
  });

  if (!projects.data.length) {
    return (
      <section className="selectProject">
        <h3>No task boards yet!</h3>
      </section>
    );
  }

  return (
    <section className="selectProject">
      {projects.data.map((project: Project) => {
        const active = project.projectId === projects?.selected?.projectId;
        return (
          <div key={project.projectId} className="flex border-b-1">
            <button
              className={clsx(
                active && "text-orange-300",
                !active && "hover:text-orange-200",
                "cursor-pointer w-full transition-colors py-2 px-1 text-left"
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
              options={getOptions(dispatch, project, handleEdit)}
            >
              <BsThreeDots className="group-hover:text-orange-200" />
            </Dropdown>
          </div>
        );
      })}
      <Modal
        title="Edit title"
        confirmText="Save"
        visible={modalVisible}
        onConfirm={submit}
        confirmDisabled={!isDirty}
        onCancel={() => setModalVisible(false)}
      >
        <div className="flex flex-col gap-4">
          <Input id="Board title" label="Board title" {...register("projectName")} />
          <p className="formError">{errors.projectName?.message}</p>
        </div>
      </Modal>
    </section>
  );
}
export default ProjectList;
