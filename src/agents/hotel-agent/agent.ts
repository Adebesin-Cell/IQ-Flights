import { LlmAgent } from "@iqai/adk"; // path to the above prompt
import { HOTEL_AGENT_INSTRUCTION } from "../../assets/prompts";
import { env } from "../../env";
import { hotelDetailsTool, hotelPriceTool, searchHotelsTool } from "./tools";

export const getHotelAgent = () =>
	new LlmAgent({
		name: "hotel_agent",
		description:
			"Provides hotel search, details, and price analysis for travel planning",
		model: env.LLM_MODEL,
		tools: [searchHotelsTool, hotelDetailsTool, hotelPriceTool],
		instruction: HOTEL_AGENT_INSTRUCTION,
	});
