import axios from "axios";

export interface GraphQLResponse<T> {
  data: T | null;
  errors?: Array<{
    message: string;
    locations: Array<{ line: number; column: number }>;
  }>;
}

export async function fetch<T>(token: string, query: string): Promise<T> {
  let response = await axios.post(
    "https://api.github.com/graphql",
    {
      query
    },
    {
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  );
  let graphQLResponse = response.data as GraphQLResponse<T>;
  if (
    graphQLResponse.data === null ||
    (graphQLResponse.errors && graphQLResponse.errors.length > 0)
  ) {
    throw new Error(
      (graphQLResponse.errors || []).map((error) => error.message).join("; ")
    );
  }
  return graphQLResponse.data;
}
