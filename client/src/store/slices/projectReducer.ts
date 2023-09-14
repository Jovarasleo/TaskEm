import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Actions, Project, Task } from "../../views/taksManager/model/task";

interface InitialProjectState {
  data: Project[] | [];
  status: string; // 'idle', 'loading', 'succeeded', or 'failed'
  error: null | string;
}

const testData = [
  {
    projectId: "123",
    projectName: "test",
    count: 1,
  },
];

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: testData,
    status: "idle", // 'idle', 'loading', 'succeeded', or 'failed'
    error: null,
  } as InitialProjectState,
  reducers: {
    createProject: (state, action) => {
      return state;
    },
  },
});

export const { createProject } = projectSlice.actions;

export default projectSlice.reducer;
