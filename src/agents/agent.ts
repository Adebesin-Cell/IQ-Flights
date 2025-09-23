import { AgentBuilder } from "@iqai/adk";
import { ROOT_TRAVEL_AGENT_PROMPT } from "../assets/prompts";
import { env } from "../env";
import { getFlightAgent } from "./flight-agent/agent";
import { getHotelAgent } from "./hotel-agent/agent";
import { normalizeDateTool, searchAirportsTool } from "./tools";

export const getRootAgent = () => {
	const flightAgent = getFlightAgent();
	const hotelAgent = getHotelAgent();

	return AgentBuilder.create("root_travel_agent")
		.withDescription(
			"Root travel agent that orchestrates flights, hotels, and airport lookups. Ensures all city/airport names are resolved to valid IATA codes before passing to sub-agents.",
		)
		.withInstruction(ROOT_TRAVEL_AGENT_PROMPT)
		.withModel(env.LLM_MODEL)
		.withTools(searchAirportsTool, normalizeDateTool)
		.withSubAgents([flightAgent, hotelAgent])
		.build();
};
