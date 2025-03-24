import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TaskContainer } from "../../views/taskManager/model/task";
import { getContainersIdb } from "../../db";

interface InitialContainerState {
  data: TaskContainer[];
  loading: boolean;
  error: null | string;
}

export const getContainersFromIdb = createAsyncThunk("container/getData", async () => {
  const data = await getContainersIdb();
  return data as TaskContainer[];
});

const containerReducer = createSlice({
  name: "container",
  initialState: {
    data: [],
    loading: false,
    error: "",
  } as InitialContainerState,
  reducers: {
    createContainer: (state, action) => {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    },
    deleteContainer: (state, action) => {
      const filteredData = state.data.filter((container) => {
        action.payload.containerId === container.containerId;
      });

      return {
        ...state,
        data: filteredData,
      };
    },
    deleteContainersByProject: (state, action) => {
      const filteredData = state.data.filter((container) => {
        action.payload.projectId === container.projectId;
      });

      return {
        ...state,
        data: filteredData,
      };
    },
    getContainers: (state, action) => {
      return {
        ...state,
        data: action.payload.sort((a: TaskContainer, b: TaskContainer) => a.position - b.position),
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContainersFromIdb.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContainersFromIdb.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.sort(
          (a: TaskContainer, b: TaskContainer) => a.position - b.position
        );
      })
      .addCase(getContainersFromIdb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "";
      });
  },
});

export const { createContainer, deleteContainer, deleteContainersByProject, getContainers } =
  containerReducer.actions;

export default containerReducer.reducer;
