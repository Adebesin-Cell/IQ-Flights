import { LlmAgent } from "@iqai/adk";
import { FLIGHT_AGENT_INSTRUCTION } from "../../assets/prompts";
import { env } from "../../env";
import { searchAirportsTool } from "../tools";
import { flightPriceAnalysisTool, getAvailableFlightsTool } from "./tools";

export const getFlightAgent = () => {
	return new LlmAgent({
		name: "flight_agent",
		description:
			"Your personal AI travel assistant for flight searches and analysis",
		model: env.LLM_MODEL,
		tools: [
			getAvailableFlightsTool,
			flightPriceAnalysisTool,
			searchAirportsTool,
		],
		instruction: FLIGHT_AGENT_INSTRUCTION,
	});
};
