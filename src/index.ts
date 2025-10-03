import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * Main function demonstrating basic ADK agent usage.
 *
 * Creates a root travel agent with sub-agents for flights and hotels,
 * then processes a series of sample questions to showcase the agent's
 * capabilities in orchestrating tasks and using tools.
 */
async function main() {
	const questions = [
		"Find me a flight from New York to London for next Monday.",
		"What's the price like for a flight from San Francisco to Paris on 2024-12-25?",
		"Find me 3 flights from Tokyo to Sydney departing on 2024-11-15 and returning on 2024-11-22 for 2 adults.",
		"What is the IATA code for Berlin?",
    "List flights from London to Paris for the next 7 days",
    "Book the cheapest flight from London to Paris for the next 7 days"
	];

	console.log("🤖 Initializing Root Travel Agent...");
	const { runner } = await getRootAgent();

	for (const question of questions) {
		console.log(`📝 Question: ${question}`);
		const response = await runner.ask(question);
		console.log(`🤖 Response: ${response}`);
	}
}

main().catch(console.error);
