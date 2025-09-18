import { LlmAgent } from "@iqai/adk";
import { CITY_CODES_AGENT_INSTRUCTION } from "../../assets/prompts";
import { env } from "../../env";
import { cityCodesTool } from "./tools";

/**
 * City Codes Agent
 */
export const getCityCodesAgent = () =>
	new LlmAgent({
		name: "city_codes_agent",
		description: "Provides city codes for flight and travel searches",
		model: env.LLM_MODEL,
		tools: [cityCodesTool],
		instruction: CITY_CODES_AGENT_INSTRUCTION,
	});
