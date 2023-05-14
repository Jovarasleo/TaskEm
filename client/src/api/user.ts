import { useMutation, useQuery } from "@tanstack/react-query";

export function createUser({ password, email }: any) {
  const { mutate, error, data } = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:3000/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => data),
  });

  return { mutate, error, data };
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
