import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjectsIdb } from "../../db";
import { Project } from "../../views/taskManager/model/task";
import { clientDeleteProjectContainers, clientLoadLocalContainers } from "./containerReducer";
import { clientDeleteProjectTasks, clientLoadLocalTasks } from "./taskReducer";
import { RootState } from "../configureStore";

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

export const clientLoadLocalProjects = createAsyncThunk(
  "project/clientLoadLocalProjects",
  async (_, { dispatch }) => {
    const projects = await getProjectsIdb();

    if (projects.length > 0) {
      dispatch(clientLoadLocalContainers(projects[0].projectId));
      dispatch(clientLoadLocalTasks(projects[0].projectId));
    }

    return projects;
  }
);

export const deleteProjectWithRelatedData = createAsyncThunk(
  "project/deleteProject",
  async (project: Project, { dispatch, getState }) => {
    try {
      dispatch(clientDeleteProjectContainers(project));
      dispatch(clientDeleteProjectTasks(project));
      dispatch(clientDeleteProject(project));

      const state = getState() as RootState;
      const projects = state.project.data.filter((p) => p.projectId !== project.projectId);

      // Select the next available project, if any
      if (projects.length > 0) {
        const nextProjectIndex = nextProject(
          state.project.data.findIndex((p) => p.projectId === project.projectId),
          state.project.data.length
        );
        dispatch(selectProjectWithRelatedData(projects[nextProjectIndex]));
      } else {
        dispatch(clientSelectProject(null)); // No projects left
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }
);

export const selectProjectWithRelatedData = createAsyncThunk(
  "project/clientLoadProjectsWithRelatedData",
  async (project: Project, { dispatch }) => {
    dispatch(clientSelectProject(project));
    dispatch(clientLoadLocalContainers(project.projectId));
    dispatch(clientLoadLocalTasks(project.projectId));
  }
);

const loadProjects = (state: ProjectStoreState, action: { payload: Project[]; type: string }) => ({
  ...state,
  data: action.payload,
});

const createProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => ({
  ...state,
  data: [...state.data, action.payload],
  selected: action.payload,
});

const selectProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => ({
  ...state,
  selected: action.payload,
});

const editProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => {
  const index = state.data.findIndex((project) => project.projectId === action.payload.projectId);

  return {
    ...state,
    data: [...state.data.slice(0, index), action.payload, ...state.data.slice(index + 1)],
    selected: action.payload,
  };
};

const deleteProject = (state: ProjectStoreState, action: { payload: Project; type: string }) => {
  return {
    ...state,
    data: state.data.filter((project) => project.projectId !== action.payload.projectId),
  };
};

const loadProject = (state: ProjectStoreState, action: { payload: Project[]; type: string }) => ({
  ...state,
  data: action.payload,
});

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
    clientLoadProjects: (state, action) => loadProject(state, action),
    clientSelectProject: (state, action) => selectProject(state, action),
    serverLoadProjects: (state, action) => loadProjects(state, action),
    clientCreateProject: (state, action) => createProject(state, action),
    serverCreateProject: (state, action) => createProject(state, action),
    clientEditProject: (state, action) => editProject(state, action),
    serverEditProject: (state, action) => editProject(state, action),
    clientDeleteProject: (state, action) => deleteProject(state, action),
    serverDeleteProject: (state, action) => deleteProject(state, action),
  },
  extraReducers(builder) {
    builder
      .addCase(clientLoadLocalProjects.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(clientLoadLocalProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.loading = false;
        if (action.payload.length) {
          state.selected = action.payload[0];
        }
      })
      .addCase(clientLoadLocalProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  clientLoadProjects,
  serverLoadProjects,
  clientCreateProject,
  serverCreateProject,
  clientDeleteProject,
  serverDeleteProject,
  clientEditProject,
  serverEditProject,
  clientSelectProject,
} = projectSlice.actions;

export default projectSlice.reducer;
