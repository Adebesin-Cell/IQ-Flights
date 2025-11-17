import { LlmAgent } from "@iqai/adk";
import { env } from "../../env";
import { openrouter } from "../../libs/helpers/openrouter";
import { getCityCodesTool } from "./tools";
import { z } from "zod";

const outputSchema = z.object({
    iataResolved: z.array(
      z.object({
        name: z.string(),
        iataCode: z.string(),
      })
    ),
    userQuery: z.string(),
  });

export const getIataAgent = () => {

  return new LlmAgent({
    name: "root_iata_resolver",
    description: "Resolves all city/airport names into IATA codes before orchestration.",
    model: openrouter(env.LLM_MODEL),
    tools: [getCityCodesTool],
    instruction: `
You are the Root IATA Resolver.

1. Read the user query exactly as provided.
2. Extract ALL cities or airports mentioned.
3. For each city/airport, call "get_city_codes".
4. Respond ONLY with pure JSON in this exact format:

Rules:
- No commentary.
- No explanations.
- No extra fields.
- NEVER output anything outside the JSON root.
`,
    outputSchema,
    disallowTransferToPeers: true,
    disallowTransferToParent: false,
  });
};
