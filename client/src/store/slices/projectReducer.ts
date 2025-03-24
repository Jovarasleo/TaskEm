import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectsIdb } from "../../db";
import { Project } from "../../views/taskManager/model/task";
import { deleteContainersByProject } from "./containerReducer";
import { deleteTasksByProject } from "./taskReducer";

interface InitialProjectState {
  data: Project[] | [];
  selected: Project | null;
  status: "loading" | "succeeded" | "idle" | "failed";
  loading: boolean;
  error: null | string;
}

const nextProject = (currentIndex: number, projectsCount: number) => {
  if (currentIndex === 0) {
    return 0;
  }

  if (currentIndex === projectsCount) {
    return projectsCount - 1;
  }

  return currentIndex - 1;
};

//is it needed?
// export const updateProjectToIdb = createAsyncThunk(
//   "project/updateData",

//   async (projectId: string, { getState }) => {
//     const currentState = getState() as RootState;
//     const foundProject = currentState.project.data.find(
//       (project) => project.projectId === projectId
//     );
//     if (!foundProject) {
//       return;
//     }

//     const data = await putProject(foundProject);
//     return data;
//   }
// );

export const deleteProjectThunk = createAsyncThunk(
  "project/deleteProject",
  async (project: Project, { dispatch }) => {
    try {
      dispatch(deleteContainersByProject(project));
      dispatch(deleteTasksByProject(project));
      dispatch(deleteProject(project));
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }
);

export const getProjectFromIdb = createAsyncThunk("project/getData", async () => {
  const data = await getProjectsIdb();
  return data as Project[];
});

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    selected: null,
    loading: false,
    status: "idle",
    error: null,
  } as InitialProjectState,
  reducers: {
    getProjects: (state, action) => {
      const projects = action.payload;
      return { ...state, data: projects };
    },
    createProject: (state, action) => {
      const newProject = action.payload;
      return { ...state, data: [...state.data, newProject] };
    },
    selectProject: (state, action) => {
      state.selected = action.payload;
    },
    renameProject: (state, action) => {
      const editableProject = state.data.find(
        (project) => project.projectId === action.payload.projectId
      );
      if (editableProject) {
        editableProject.projectName = action.payload.projectName;
        state.selected = editableProject;
      }
    },
    deleteProject: (state, action) => {
      const currentProjectIndex = state.data.findIndex(
        (project) => project.projectId === action.payload.projectId
      );

      state.data = state.data.filter((project) => project.projectId !== action.payload.projectId);
      state.selected = state.data[nextProject(currentProjectIndex, state.data.length)] ?? null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProjectFromIdb.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(getProjectFromIdb.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.loading = false;
        if (action.payload.length) {
          state.selected = action.payload[0];
        }
      })
      .addCase(getProjectFromIdb.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const { getProjects, createProject, selectProject, renameProject, deleteProject } =
  projectSlice.actions;

export default projectSlice.reducer;
