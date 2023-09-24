import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Actions, Project, Task } from "../../views/taksManager/model/task";
import { getProjects, setProject, removeProject, putProject } from "../../db";
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
    try {
      const data = await removeProject(projectId);
      return data;
    } catch (error) {
      throw error;
    }
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

    try {
      const data = await putProject(foundProject);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const setProjectToIdb = createAsyncThunk(
  "project/setData",

  async (project: { projectId: string; projectName: string }) => {
    console.log("setting");
    const newProject = { ...project, count: 0, containerOrder: [] };
    try {
      const data = await setProject(newProject);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const getProjectFromIdb = createAsyncThunk("project/getData", async () => {
  try {
    const data = await getProjects();
    return data as Project[];
  } catch (error) {
    throw error;
  }
});

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
    createProject: (state) => {
      return state;
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

export const { createProject, selectProject, renameProject, deleteProject } = projectSlice.actions;

export default projectSlice.reducer;
