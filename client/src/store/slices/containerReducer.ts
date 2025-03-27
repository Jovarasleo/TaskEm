import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TaskContainer } from "../../views/taskManager/model/task";
import { getContainersIdb } from "../../db";

interface TaskContainerStoreState {
  data: TaskContainer[];
  loading: boolean;
  error: null | string;
}

export const clientLoadLocalContainers = createAsyncThunk(
  "container/clientLoadLocalContainers",
  async (projectId: string) => await getContainersIdb(projectId)
);

const loadContainers = (
  state: TaskContainerStoreState,
  action: {
    payload: TaskContainer[];
    type: string;
  }
) => ({
  ...state,
  data: action.payload,
});

const createContainer = (
  state: TaskContainerStoreState,
  action: {
    payload: TaskContainer;
    type: string;
  }
) => {
  const newContainers = state.data.filter(
    (container) => container.projectId === action.payload.projectId
  );

  return { ...state, data: [...newContainers, action.payload] };
};

const deleteContainer = (
  state: TaskContainerStoreState,
  action: {
    payload: TaskContainer;
    type: string;
  }
) => {
  const filteredData = state.data.filter((container) => {
    action.payload.containerId !== container.containerId;
  });

  return {
    ...state,
    data: filteredData,
  };
};

const deleteProjectContainers = (
  state: TaskContainerStoreState,
  action: {
    payload: { projectId: string };
    type: string;
  }
) => {
  const filteredData = state.data.filter((container) => {
    container.projectId === action.payload.projectId;
  });

  return {
    ...state,
    data: filteredData,
  };
};

const containerReducer = createSlice({
  name: "container",
  initialState: {
    data: [],
    loading: false,
    error: "",
  } as TaskContainerStoreState,
  reducers: {
    serverLoadContainers: (state, action) => loadContainers(state, action),
    clientCreateContainer: (state, action) => createContainer(state, action),
    serverCreateContainer: (state, action) => createContainer(state, action),
    clientDeleteContainer: (state, action) => deleteContainer(state, action),
    serverDeleteContainer: (state, action) => deleteContainer(state, action),
    clientDeleteProjectContainers: (state, action) => deleteProjectContainers(state, action),
    serverDeleteProjectContainers: (state, action) => deleteProjectContainers(state, action),
  },
  extraReducers(builder) {
    builder
      .addCase(clientLoadLocalContainers.pending, (state) => {
        state.loading = true;
      })
      .addCase(clientLoadLocalContainers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.sort(
          (a: TaskContainer, b: TaskContainer) => a.position - b.position
        );
      })
      .addCase(clientLoadLocalContainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  serverLoadContainers,
  clientCreateContainer,
  serverCreateContainer,
  clientDeleteContainer,
  serverDeleteContainer,
  clientDeleteProjectContainers,
  serverDeleteProjectContainers,
} = containerReducer.actions;

export default containerReducer.reducer;
