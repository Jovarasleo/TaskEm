import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project, TaskContainer } from "../../views/taksManager/model/task";
import { getContainers, setContainers } from "../../db";
import { uid } from "../../util/uid";

interface InitialUserState {
  data: { name: string };
  loading: boolean;
  signed: boolean;
  error: null | string;
}

interface User {
  username: string;
  password: string;
  email: string;
}

const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/user/",
  }),
  tagTypes: ["Post"],
  endpoints: (build) => ({
    createUser: build.mutation({
      query(user) {
        return {
          url: `register`,
          method: "POST",
          body: user,
        };
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      // invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    updateUser: build.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: (user) => ({
        url: `/register`,
        method: "PATCH",
        body: user,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: User }, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
      invalidatesTags: ["Post"],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry }
      ) {},
    }),
  }),
});

export const { useUpdateUserMutation, useCreateUserMutation } = userApi;

// export const registerUser = createAsyncThunk("user/createUser", async (userData: User) => {
//   const { email, username, password } = userData;
//   const getUserData = createUser({ email, username, password });
//   return getUserData;
// });

// const userReducer = createSlice({
//   name: "task",
//   initialState: {
//     data: {},
//     loading: false,
//     signed: false,
//     error: "",
//   } as InitialUserState,
//   reducers: {},
//   extraReducers(builder) {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.signed = true;
//         state.data = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message ?? "";
//       });
//   },
// });

// // export const { createContainer } = userReducer.actions;

// export default userReducer.reducer;
