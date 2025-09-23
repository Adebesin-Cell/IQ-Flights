import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * Main function demonstrating basic ADK agent usage.
 *
 * Creates a root agent with sub-agents for weather and jokes,
 * then processes a series of sample questions to showcase
 * the agent's capabilities in routing requests to appropriate
 * specialized sub-agents.
 */
async function main() {
	const questions = ["List flights from London to Paris for the next 7 days", "Book the cheapest flight from London to Paris for the next 7 days"];

	const { runner } = await getRootAgent();

	for (const question of questions) {
		console.log(`📝 Question: ${question}`);
		const response = await runner.ask(question);
		console.log(`🤖 Response: ${response}`);
	}
}

main().catch(console.error);
