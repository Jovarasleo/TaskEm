import clsx from "clsx";
import Modal from "../../../../components/modal/Modal";
import { MdDashboardCustomize } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/configureStore";
import { clientLoadContainers } from "../../../../store/slices/containerReducer";
import { clientCreateProject } from "../../../../store/slices/projectReducer";
import { clientLoadTasks } from "../../../../store/slices/taskReducer";
import { uid } from "../../../../util/uid";
import { defaultContainers } from "../../model/containers";
import { Input } from "../../../../components/input/Input";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@heroui/react";

const schema = object({
  title: string().required(),
}).required();

function CreateProject() {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
    },
  });

  const submit = handleSubmit((formValues) => {
    const projectId = uid();
    const containers = defaultContainers(projectId);

    dispatch(
      clientCreateProject({
        project: {
          projectId,
          projectName: formValues.title,
        },
        containers,
      })
    );
    dispatch(clientLoadTasks([]));
    dispatch(clientLoadContainers(containers));

    reset();
    onClose();
  });

  return (
    <>
      <div className="my-4">
        <button
          onClick={() => onOpen()}
          className={clsx(
            isOpen && "bg-neutral-700",
            "flex justify-center rounded-full items-center ml-auto p-2 bg-neutral-100 group hover:bg-neutral-700 cursor-pointer transition-colors"
          )}
        >
          <MdDashboardCustomize
            className={clsx(
              isOpen ? "text-[#f98e4c]" : "text-neutral-700",
              "size-7 group-hover:text-[#f98e4c] transition-colors"
            )}
          />
        </button>
      </div>
      <Modal title="New task board" isOpen={isOpen} onConfirm={submit} onClose={() => onClose()}>
        <div className="flex flex-col gap-4">
          <Input id="Board title" label="Board title" {...register("title")} />
          <p>{errors.title?.message}</p>
          <Input id="Add members" label="Add members" />
        </div>
      </Modal>
    </>
  );
}
export default CreateProject;
