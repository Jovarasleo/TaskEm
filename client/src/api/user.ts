import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "store/configureStore";

const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/user",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) {
        // include token in req header
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  reducerPath: "user",
  tagTypes: ["Post"],
  endpoints: (build) => ({
    createUser: build.mutation({
      query(user) {
        return {
          url: "",
          method: "POST",
          body: user,
        };
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      // invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    getUser: build.query({
      query() {
        return {
          url: "",
          method: "GET",
        };
      },
    }),
    updateUser: build.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      // transformResponse: (response: { data: User }, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
      invalidatesTags: ["Post"],
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
    }),
  }),
});

export { userApi };
export const { useUpdateUserMutation, useCreateUserMutation, useGetUserQuery } = userApi;
