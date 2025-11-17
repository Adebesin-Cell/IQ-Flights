import { AgentBuilder, LlmAgent } from "@iqai/adk";
import { env } from "../env";
import { getFlightAgent } from "./flight-agent/agent";
import { getHotelAgent } from "./hotel-agent/agent";
import { ORCHESTRATOR_AGENT_PROMPT, ROOT_TRAVEL_AGENT_PROMPT } from "../assets/prompts";
import { getIataAgent } from "./iata-agent/agent";
import { openrouter } from "../libs/helpers/openrouter";

export const getRootAgent = () => {
  const iataResolver = getIataAgent();
  const orchestrator = getOrchestratorAgent();

  return AgentBuilder.create("root_travel_agent")
    .withDescription("Top-level travel orchestrator for flights and hotels.")
    .withInstruction(ROOT_TRAVEL_AGENT_PROMPT)
    .withModel(openrouter(env.LLM_MODEL))
    .asSequential([iataResolver, orchestrator])
    .build();
};

export const getOrchestratorAgent = () => {
  const flightAgent = getFlightAgent();
  const hotelAgent = getHotelAgent();

  return new LlmAgent({
    name: "root_orchestrator",
    description: "Final travel planner after IATA resolution.",
    model: openrouter(env.LLM_MODEL),
    subAgents: [flightAgent, hotelAgent],
    instruction: ORCHESTRATOR_AGENT_PROMPT,
  });
};
