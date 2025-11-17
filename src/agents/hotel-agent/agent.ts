import { LlmAgent } from "@iqai/adk";
import { HOTEL_AGENT_INSTRUCTION } from "../../assets/prompts";
import { env } from "../../env";
import { hotelDetailsTool, hotelPriceTool, searchHotelsTool } from "./tools";
import { openrouter } from "../../libs/helpers/openrouter";

export const getHotelAgent = () =>
	new LlmAgent({
		name: "hotel_agent",
		description:
			"Provides hotel search, details, and price analysis for travel planning",
		model: openrouter(env.LLM_MODEL),
		tools: [searchHotelsTool, hotelDetailsTool, hotelPriceTool],
		instruction: HOTEL_AGENT_INSTRUCTION,
	});
