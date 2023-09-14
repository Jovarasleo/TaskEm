import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TaskContainer } from "../../views/taksManager/model/task";

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
  status: string; // 'idle', 'loading', 'succeeded', or 'failed'
  error: null | string;
}

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  return fetchUserFromAPI();
});

const containerReducer = createSlice({
  name: "task",
  initialState: {
    status: "",
    error: "",
    data: testData,
  } as InitialContainerState,
  reducers: {
    createContainer: (state, action) => {
      return state;
    },
  },
});

export const { createContainer } = containerReducer.actions;

export default containerReducer.reducer;
