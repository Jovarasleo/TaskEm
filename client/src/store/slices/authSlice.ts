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
  error: string[];
  success: boolean;
}

interface RegisteredUserDto {
  success: boolean;
  message: string;
  user: {
    username: string;
    email: string;
  };
  error?: string[];
}

interface RejectValue {
  rejectValue: { error: string[] };
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

export const registerUser = createAsyncThunk<RegisteredUserDto, RegisterUser, RejectValue>(
  "auth/register",
  async ({ username, email, password }: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/auth`, {
        ...REQUEST_INIT,
        body: JSON.stringify({ username, email, password }), // body data type must match "Content-Type" header
      });

      const data: RegisteredUserDto = await response.json();

      if (response.ok) {
        return data;
      } else {
        const error = Array.isArray(data?.error) ? data.error : ["Unknown error occurred."];
        return rejectWithValue({ error });
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue({ error: ["Unknown error occurred."] });
    }
  }
);

export const loginUser = createAsyncThunk<RegisteredUserDto, LoginUser, RejectValue>(
  "auth/login",
  async ({ email, password }: LoginUser, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`${ENDPOINT_URL}/auth/login`, {
        ...REQUEST_INIT,
        body: JSON.stringify({ email, password }),
      });
      const data: RegisteredUserDto = await response.json();

      if (response.ok) {
        return data;
      } else {
        const error = Array.isArray(data?.error) ? data.error : ["Unknown error occurred."];
        return rejectWithValue({ error });
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue({ error: ["Unknown error occurred."] });
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, RejectValue>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/auth/logout`, REQUEST_INIT);
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        const error = Array.isArray(data?.error) ? data.error : ["Unknown error occurred."];
        return rejectWithValue({ error });
      }
    } catch (error) {
      return rejectWithValue({ error: ["Unknown error occurred."] });
    }
  }
);

export const isAuth = createAsyncThunk<boolean, void, RejectValue>(
  "auth/isAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ENDPOINT_URL}/auth/isAuth`, {
        ...REQUEST_INIT,
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        return data.success;
      } else {
        const error = Array.isArray(data?.error) ? data.error : ["Unknown error occurred."];
        return rejectWithValue({ error });
      }
    } catch (error) {
      return rejectWithValue({ error: ["Unknown error occurred."] });
    }
  }
);

const initialState: InitialState = {
  loading: true,
  userData: { username: "", email: "" }, // for user object
  loggedIn: false,
  message: null,
  error: [],
  success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      console.log({ action });
      return {
        ...state,
        loggedIn: action.payload,
      };
    },
    clearAuthError: (state) => {
      console.log("clear reducer called");
      return {
        ...state,
        error: [],
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
        state.error = [];
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error ?? [];
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
        state.error = [];
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error ?? [];
        state.success = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.loggedIn = false;
        state.error = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error ?? [];
        state.success = false;
      })
      .addCase(isAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(isAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.loggedIn = action.payload;
        state.error = [];
      })
      .addCase(isAuth.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error ?? [];
        state.success = false;
      });
  },
});

export const { userLoggedIn, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
