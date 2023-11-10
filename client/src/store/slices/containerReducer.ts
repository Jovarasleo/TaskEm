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

interface InitialContainerState {
  data: TaskContainer[] | [];
  loading: boolean;
  error: null | string;
}

export const fetchUserAsync = createAsyncThunk("user/fetchUser", async () => {
  return fetchUserFromAPI();
});

export const getContainersFromIdb = createAsyncThunk("container/getData", async () => {
  try {
    const data = await getContainers();
    return data as TaskContainer[];
  } catch (error) {
    throw error;
  }
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
        data: [
          ...state.data,
          ...action.payload.sort((a: TaskContainer, b: TaskContainer) => a.position - b.position),
        ],
      };
    },

    deleteContainers: (state, action) => {
      const filteredData = state.data.filter((container) => {
        return action.payload.some(
          (projectContainer: TaskContainer) =>
            projectContainer.containerId !== container.containerId
        );
      });

      console.log({ filteredData });
      return {
        ...state,
        data: filteredData,
      };
    },

    setSocketContainers: (state, action) => {
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

export const { createContainer, deleteContainers, setSocketContainers } = containerReducer.actions;

export default containerReducer.reducer;
