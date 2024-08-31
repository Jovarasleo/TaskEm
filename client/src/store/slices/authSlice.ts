import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const ENDPOINT_URL = process.env.BACKEND_ADDRESS;

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  username: string;
}

interface UserData {
  username: string;
  email: string;
}

interface InitialState {
  loading: boolean;
  userData: UserData;
  loggedIn: boolean;
  message: null | string;
  error: null | string;
  success: boolean;
}

interface RegisteredUserDto {
  success: boolean;
  message: string;
  user: {
    username: string;
    email: string;
  };
  error?: string;
}

const REQUEST_INIT: RequestInit = {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  // credentials: "same-origin", // include, *same-origin, omit
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/user`, {
        ...REQUEST_INIT,
        body: JSON.stringify({ username, email, password }), // body data type must match "Content-Type" header
      });

      const data: RegisteredUserDto = await response.json();

      if (response.ok) {
        return data;
      } else {
        if (data) {
          return rejectWithValue({ payload: { error: data.error } });
        } else {
          return rejectWithValue({ payload: { error: "unknown error" } });
        }
      }
    } catch (error) {
      return rejectWithValue({ payload: { error: "unknown error" } });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginUser, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/user/login`, {
        ...REQUEST_INIT,
        body: JSON.stringify({ email, password }), // body data type must match "Content-Type" header
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        // Error response, handle it here
        if (data) {
          return rejectWithValue({ error: data });
        } else {
          return rejectWithValue({ error: "Unknown error occurred." });
        }
      }
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${ENDPOINT_URL}/user/logout`, REQUEST_INIT);
    const data = await response.json();

    if (response.ok) {
      // Successful response
      return data;
    } else {
      // Error response, handle it here
      if (data) {
        return rejectWithValue({ error: data });
      } else {
        return rejectWithValue({ error: "Unknown error occurred." });
      }
    }
  } catch (error) {
    return rejectWithValue({ error });
  }
});

const initialState: InitialState = {
  loading: false,
  userData: { username: "", email: "" }, // for user object
  loggedIn: false,
  message: null,
  error: null,
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state) => {
      return {
        ...state,
        loggedIn: true,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success;
        state.message = action.payload.message;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error;
        state.success = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.loggedIn = true;
        state.message = action.payload.message;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error;
        state.success = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.loggedIn = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error || "Unknown error";
        state.success = false;
      });
  },
});

export const { userLoggedIn } = authSlice.actions;

export default authSlice.reducer;
