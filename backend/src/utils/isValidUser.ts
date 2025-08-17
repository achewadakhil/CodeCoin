import fetch from "node-fetch";

export default async function checkLeetCodeUser(username: string) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query checkUser($username: String!) {
          matchedUser(username: $username) {
            username
          }
        }
      `,
      variables: { username }
    }),
  });

  const json = await response.json() as {
    data: {
      matchedUser: { username: string } | null;
    };
  };

  return json.data.matchedUser !== null;
}
