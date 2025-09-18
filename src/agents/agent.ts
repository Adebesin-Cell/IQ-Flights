import { AgentBuilder } from "@iqai/adk";
import { ROOT_TRAVEL_AGENT_PROMPT } from "../assets/prompts";
import { env } from "../env";
import { getCityCodesAgent } from "./city-code-agent/agent";
import { getFlightAgent } from "./flight-agent/agent";
import { getHotelAgent } from "./hotel-agent/agent";

export const getRootAgent = () => {
	const flightAgent = getFlightAgent();
	const hotelAgent = getHotelAgent();
	const cityCodesAgent = getCityCodesAgent();

	return AgentBuilder.create("root_travel_agent")
		.withDescription(
			"Root travel agent that orchestrates flight searches, hotel bookings, and city code lookups for a seamless travel planning experience.",
		)
		.withInstruction(ROOT_TRAVEL_AGENT_PROMPT)
		.withModel(env.LLM_MODEL)
		.withSubAgents([flightAgent, hotelAgent, cityCodesAgent])
		.build();
};
