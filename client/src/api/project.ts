import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "store/configureStore";
import { Project } from "views/taksManager/model/task";

const projectsApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:3000/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.userToken;
      if (token) {
        // include token in req header
        headers.set("authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  tagTypes: ["POST", "GET", "PUT"],
  endpoints: (build) => ({
    getProjects: build.mutation({
      query(project: Project) {
        return {
          url: `/project`,
          method: "GET",
          body: project,
        };
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      // invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    setProject: build.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: (project: Project) => ({
        url: `/project`,
        method: "POST",
        body: project,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: any }, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response: { status: string | number }, meta, arg) => response.status,
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
    }),
  }),
});

export { projectsApi };
export const { useGetProjectsMutation, useSetProjectMutation } = projectsApi;
