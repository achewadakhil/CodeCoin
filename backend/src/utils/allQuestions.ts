import fetch from "node-fetch";

export default async function getProblemMappings() {
  const limit = 100;
  let skip = 0;
  const mapping: Record<string, string> = {};
  
  try {
    while (true) {
      const query = `
        query problemsetQuestionList($limit: Int, $skip: Int) {
          problemsetQuestionListV2(
            categorySlug: ""
            limit: $limit
            skip: $skip
          ) {
            questions {
              questionFrontendId
              titleSlug
            }
          }
        }
      `;

      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { limit, skip },
        }),
      });

      const data = await response.json() as {
        errors?: any;
        data?: {
          problemsetQuestionListV2?: {
            questions?: Array<{ questionFrontendId: string; titleSlug: string }>;
          };
        };
      };

      if (data.errors) {
        console.error("GraphQL Errors:", data.errors);
        return null;
      }

      if (!data.data || !data.data.problemsetQuestionListV2) {
        console.error("Unexpected response:", data);
        return null;
      }

      const questions = data.data.problemsetQuestionListV2.questions;

      if (!questions || questions.length === 0) break; 

      questions.forEach((q: any) => {
        mapping[q.questionFrontendId] = q.titleSlug;
      });

      console.log(`Fetched ${skip + questions.length} questions...`);

      skip += limit;

      if (questions.length < limit) break;
    }

    return mapping;
  } catch (err) {
    console.error("Failed to fetch problems:", err);
    return null;
  }
}
