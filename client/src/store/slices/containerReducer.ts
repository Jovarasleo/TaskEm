import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Project, TaskContainer } from "../../views/taksManager/model/task";
import { getContainers, setContainers } from "../../db";
import { uid } from "../../util/uid";

const fetchUserFromAPI = async () => {
  try {
    // Simulated async operation (replace with actual API call)
    const response = await fetch("/api/user");
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw error;
  }
};

const testData = [
  {
    containerId: "1",
    containerName: "todo",
    projectId: "123",
  },
  {
    containerId: "1234",
    containerName: "test2",
    projectId: "123",
  },
  {
    containerId: "12345",
    containerName: "test3",
    projectId: "123",
  },
];

interface InitialContainerState {
  data: TaskContainer[] | [];
  loading: boolean;
  error: null | string;
}

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  return fetchUserFromAPI();
});

export const setContainersToIdb = createAsyncThunk(
  "container/setData",
  async (projectId: string) => {
    const position = new Date().getTime();
    const containers = [
      {
        containerId: uid(),
        containerName: "Todo",
        position: position - 1000,
        projectId,
      },
      {
        containerId: uid(),
        containerName: "In Progress",
        position: position,
        projectId,
      },
      {
        containerId: uid(),
        containerName: "Done",
        position: position + 1000,
        projectId,
      },
    ];

    try {
      const data = await setContainers(projectId, containers);
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const getContainersFromIdb = createAsyncThunk("container/getData", async () => {
  try {
    const data = await getContainers();
    return data as TaskContainer[];
  } catch (error) {
    throw error;
  }
});

const containerReducer = createSlice({
  name: "task",
  initialState: {
    data: testData,
    loading: false,
    error: "",
  } as InitialContainerState,
  reducers: {
    createContainer: (state) => {
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getContainersFromIdb.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContainersFromIdb.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getContainersFromIdb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "";
      });
  },
});

export const { createContainer } = containerReducer.actions;

export default containerReducer.reducer;
