import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/user",
  }),
  reducerPath: "user",
  tagTypes: ["Post"],
  endpoints: (build) => ({
    createUser: build.mutation({
      query(user) {
        return {
          url: `/`,
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
        url: `/login`,
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
    }),
  }),
});

export { userApi };
export const { useUpdateUserMutation, useCreateUserMutation } = userApi;
