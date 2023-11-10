import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = "http://127.0.0.1:3000";

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  username: string;
}

export const registerUser = createAsyncThunk(
  "auth/register",

  async ({ username, email, password }: RegisterUser, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/user`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ username, email, password }), // body data type must match "Content-Type" header
      });

      const data = await response.json();

      if (response.ok) {
        // Successful response
        localStorage.setItem("userToken", data.token);
        return data;
      } else {
        // Error response, handle it here
        if (data) {
          return rejectWithValue(data);
        } else {
          return rejectWithValue("Unknown error occurred.");
        }
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginUser, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendURL}/user/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
    const response = await fetch(`${backendURL}/user/logout`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });

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

const initialState = {
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
        state.success = true; // registration successful
        state.message = action.payload.message;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload?.error;
        state.success = false; // registration successful
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // registration successful
        state.loggedIn = true;
        state.message = action.payload.message;
        state.userData = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload.error;
        state.success = false; // registration successful
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true; // registration
        state.loggedIn = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload.message;
        state.success = false; // registration successful
      });
  },
});

export const { userLoggedIn } = authSlice.actions;

export default authSlice.reducer;
