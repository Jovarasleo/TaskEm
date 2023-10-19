import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProjects, putProject, removeProject, setProject } from "../../db";
import { Project } from "../../views/taksManager/model/task";
import { RootState } from "../configureStore";

interface InitialProjectState {
  data: Project[] | [];
  selected: Project;
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

export const removeProjectFromIdb = createAsyncThunk(
  "project/removeData",

  async (projectId: string) => {
    const data = await removeProject(projectId);
    return data;
  }
);

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

export const setProjectToIdb = createAsyncThunk(
  "project/setData",

  async (project: { projectId: string; projectName: string }) => {
    const newProject = { ...project, count: 0, containerOrder: [] };
    const data = await setProject(newProject);
    return data;
  }
);

export const getProjectFromIdb = createAsyncThunk("project/getData", async () => {
  const data = await getProjects();
  return data as Project[];
});

// export const getProjectFromBE = createAsyncThunk("http://localhost:3000/project", async () => {
//   const data = await getProjects();
//   return data as Project[];
// });

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    selected: {},
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
      const editableProject = state.data.find(
        (project) => project.projectId === state.selected.projectId
      );
      if (editableProject) {
        editableProject.projectName = action.payload;
        state.selected = editableProject;
      }
    },
    deleteProject: (state) => {
      const currentProjectIndex = state.data.findIndex(
        (project) => project.projectId === state.selected.projectId
      );

      state.data = state.data.filter((project) => project.projectId !== state.selected.projectId);
      state.selected = state.data[nextProject(currentProjectIndex, state.data.length)] ?? {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setProjectToIdb.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setProjectToIdb.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(setProjectToIdb.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      })
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
