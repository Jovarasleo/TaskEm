import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectsIdb } from "../../db";
import { Project } from "../../views/taskManager/model/task";
import { clientDeleteProjectContainers } from "./containerReducer";
import { clientDeleteProjectTasks } from "./taskReducer";

interface ProjectStoreState {
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

export const deleteProjectWithRelatedData = createAsyncThunk(
  "project/deleteProject",
  async (project: Project, { dispatch }) => {
    try {
      dispatch(clientDeleteProjectContainers(project));
      dispatch(clientDeleteProjectTasks(project));
      dispatch(clientDeleteProject(project));
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }
);

export const clientLoadProjects = createAsyncThunk(
  "project/clientLoadProjects",
  async () => await getProjectsIdb()
);

const loadProjects = (state: ProjectStoreState, action: { payload: Project[]; type: string }) => ({
  ...state,
  data: action.payload,
});

const createProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => ({
  ...state,
  data: [...state.data, action.payload],
});

const selectProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => ({
  ...state,
  select: action.payload,
});

const editProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => {
  const project = state.data.find((project) => project.projectId === action.payload.projectId);
  if (project) {
    project.projectName = action.payload.projectName;

    return {
      ...state,
      selected: project,
    };
  }

  return state;
};

const deleteProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => {
  const currentProjectIndex = state.data.findIndex(
    (project) => project.projectId === action.payload.projectId
  );

  return {
    ...state,
    data: state.data.filter((project) => project.projectId !== action.payload.projectId),
    selected: state.data[nextProject(currentProjectIndex, state.data.length)] ?? null,
  };
};

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    selected: null,
    loading: false,
    status: "idle",
    error: null,
  } as ProjectStoreState,
  reducers: {
    clientSelectProject: (state, action) => selectProject(state, action),
    serverLoadProjects: (state, action) => loadProjects(state, action),
    clientCreateProject: (state, action) => createProject(state, action),
    serverCreateProject: (state, action) => createProject(state, action),
    clientEditProject: (state, action) => editProject(state, action),
    serverEditProject: (state, action) => editProject(state, action),
    clientDeleteProject: (state, action) => deleteProject(state, action),
  },
  extraReducers(builder) {
    builder
      .addCase(clientLoadProjects.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(clientLoadProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.loading = false;
        if (action.payload.length) {
          state.selected = action.payload[0];
        }
      })
      .addCase(clientLoadProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  serverLoadProjects,
  clientCreateProject,
  clientDeleteProject,
  clientEditProject,
  clientSelectProject,
} = projectSlice.actions;

export default projectSlice.reducer;
