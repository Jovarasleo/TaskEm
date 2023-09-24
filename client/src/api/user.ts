import { useMutation, useQuery } from "@tanstack/react-query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function createUser({ email, password, name }: any) {
  const { mutate, error, data, isLoading } = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:3000/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      })
        .then((response) => response.json())
        .then((data) => data),
  });

  return { mutate, error, data, isLoading };
}

export function login(token: any) {
  const { error, data } = useQuery({
    queryKey: ["project"],
    queryFn: () =>
      fetch(`http://localhost:3000/project`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => data),
  });

  return { error, data };
}

interface User {
  username: string;
  password: string;
  email: string;
}

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

export { userApi };
export const { useUpdateUserMutation, useCreateUserMutation } = userApi;
