import { fetch } from "@/api/github/graphql/common";

export interface User {
  viewer: {
    login: string;
  };
}

export default async function fetchUser(token: string): Promise<User> {
  return fetch<User>(
    token,
    `query {
  viewer {
    login
  }
}`
  );
}
