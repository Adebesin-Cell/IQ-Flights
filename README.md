
<div align="center">

<img src="https://files.catbox.moe/vumztw.png" alt="ADK TypeScript Logo" width="120" />

<br/>

# AI Travel Agent

**An intelligent, multi-agent system for planning your travel, built with the `@iqai/adk` library.**

_Flights • Hotels • Smart Assistance_

---

</div>

Welcome! This project is an AI-powered travel assistant designed to make trip planning a breeze. It uses a sophisticated, hierarchical agent system to handle different aspects of your journey. You can ask it to find flights, search for hotels, and it will intelligently figure out the details for you.

## ✨ Features

-   **Hierarchical Agent System**: A main `root_travel_agent` orchestrates tasks, delegating to specialized agents.
-   **✈️ Flight Agent**: Finds the best flight options for your trip.
    -   Searches for available flights between cities.
    -   Analyzes flight prices to find good deals.
-   **🏨 Hotel Agent**: Helps you find the perfect place to stay.
    -   Searches for hotels at your destination.
    -   Provides detailed information about specific hotels.
-   **📍 Smart Location Handling**: Automatically converts city names (like "Paris") into IATA codes (like "CDG") needed for flight and hotel searches.

## 🚀 Get Started

Ready to try it out? Here’s how to get the agent running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/iq-flights.git
cd iq-flights
```

### 2. Install Dependencies

This project uses `pnpm` for fast and efficient package management. This will install all the necessary packages listed in `package.json`.

```bash
pnpm install
```

You can also use this template directly by copying the files, but using the CLI is recommended for best results.

### Running the Agent

**Default (Production/Development) Route**

To run your agent in production or for standard development, use:
```bash
pnpm dev
```

**Fast Iteration & Agent Setup (ADK CLI)**

For rapid prototyping, interactive testing, or initial agent setup, use the ADK CLI:
```bash
adk run   # Interactive CLI chat with your agents
adk web   # Web interface for easy testing and demonstration
```

## 📁 Folder Structure
The main agent code lives in `index.ts` where the subagents live inside the `agents` folder. The `agents/agent.ts` file is compatible with the ADK CLI for easy testing.

```
├── src/
│   ├── agents/
│   │   ├── agent.ts          # Root agent (ADK CLI compatible)
│   │   ├── joke-agent/       # Joke-telling sub-agent
│   │   │   ├── agent.ts
│   │   │   └── tools.ts
│   │   └── weather-agent/    # Weather information sub-agent
│   │       ├── agent.ts
│   │       └── tools.ts
│   ├── env.ts                # Environment variable validation
│   └── index.ts              # Main execution entry point
```

## ⚙️ Environment Setup
Make sure to configure your environment variables:

```bash
cp .env.example .env
```

## 🧰 Dev Tools
This starter includes:
- **GitHub Actions**: CI/CD pipeline
- 📦 **PNPM**: Fast package manager
- 🤖 **ADK CLI**: Interactive testing with `adk run` and `adk web`

## 🧪 Testing Your Agent

**Traditional Testing**: Run `pnpm dev` to execute the sample questions.

**Interactive Testing with ADK CLI**:
1. Install: `npm install -g @iqai/adk-cli`
2. Run: `adk run` for CLI chat or `adk web` for web interface
3. Perfect for development, testing, and demonstrating your agent's capabilities

## 🏗️ Building Your Agent
1. **Create new agents** in the `src/agents/` directory
2. **Add tools** to your agents in the `tools/` subdirectory
3. **Configure services** in the `src/services/` directory
4. **Update environment** variables in `src/env.ts`

## 📚 Links
- [ADK Documentation](https://adk.iqai.com)
- [ADK GitHub Repository](https://github.com/IQAIcom/adk-ts)

## 🆘 Support
If you encounter any issues or have questions:
- 📝 [Create an issue](https://github.com/IQAIcom/adk-ts/issues)
- 💬 [Start a discussion](https://github.com/IQAIcom/adk-ts/discussions)