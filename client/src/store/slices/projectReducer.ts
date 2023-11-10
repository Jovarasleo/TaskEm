import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjects, putProject } from "../../db";
import { Project } from "../../views/taksManager/model/task";
import { RootState } from "../configureStore";

interface InitialProjectState {
  data: Project[] | [];
  selected: Project | null;
  status: string; // 'idle', 'loading', 'succeeded', or 'failed'
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

export const updateProjectToIdb = createAsyncThunk(
  "project/updateData",

  async (projectId: string, { getState }) => {
    const currentState = getState() as RootState;
    const foundProject = currentState.project.data.find(
      (project) => project.projectId === projectId
    );
    if (!foundProject) {
      return;
    }

    const data = await putProject(foundProject);
    return data;
  }
);

export const getProjectFromIdb = createAsyncThunk("project/getData", async () => {
  const data = await getProjects();
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
    syncProjects: (state) => {
      return state;
    },
    setProjects: (state, action) => {
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
      console.log(action.payload);
      const editableProject = state.data.find(
        (project) => project.projectId === action.payload.projectId
      );
      if (editableProject) {
        editableProject.projectName = action.payload.projectName;
        state.selected = editableProject;
      }
    },
    deleteProject: (state, action) => {
      console.log(action.payload);
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

export const {
  setProjects,
  createProject,
  selectProject,
  renameProject,
  deleteProject,
  syncProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
