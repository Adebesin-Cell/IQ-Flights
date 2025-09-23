# Project TODO & Roadmap

This document outlines the current status of the `iq-flights` agent, potential improvements, and ideas for future features. Contributions are welcome!

## ✅ What's Done

-   **Core Agent Architecture**: A hierarchical agent structure is in place with a `root_travel_agent` orchestrating sub-agents.
-   **Flight Agent**: A dedicated `flight_agent` is implemented with tools for:
    -   Searching for available flights (`getAvailableFlightsTool`).
    -   Analyzing flight prices (`flightPriceAnalysisTool`).
    -   Looking up airport IATA codes (`searchAirportsTool`).
-   **Hotel Agent**: A `hotel_agent` is implemented with tools for:
    -   Searching for hotels (`searchHotelsTool`).
    -   Getting hotel details (`hotelDetailsTool`).
    -   Analyzing hotel prices (`hotelPriceTool`).
-   **Intelligent Orchestration**: The `root_travel_agent` is responsible for resolving city/airport names to IATA codes before delegating tasks to the appropriate sub-agent.
-   **Environment Configuration**: Secure and validated environment variable management using `zod`.
-   **Developer Tooling**: The project is set up with `pnpm`, `tsx` for live-reloading, and is compatible with the ADK CLI for interactive testing (`adk run`, `adk web`).

## 🚀 Potential Improvements

-   **[ ] Refactor Tool Sharing**: The `searchAirportsTool` is used by both the `root_agent` and `flight_agent`. Consider moving it to a shared `src/tools/` directory to avoid duplication and improve modularity.
-   **[ ] Add Unit & Integration Tests**: Implement a testing framework (like Vitest or Jest) to write tests for tools and agent interactions. This will improve reliability and make refactoring safer.
-   **[ ] Enhance Error Handling**: Improve error handling within tools. For example, what happens if the Amadeus API is down or returns an error? The agent should be able to handle this gracefully.
-   **[ ] State Management**: For multi-turn conversations (e.g., "Find a flight... now find a hotel for those dates"), implement a more robust state management solution to carry context between turns.
-   **[ ] Caching Layer**: Implement a caching mechanism for API calls that are frequently repeated, such as airport code lookups, to reduce latency and API costs.

## ✨ Cool Future Features

-   **[ ] Car Rental Agent**: Add a `car_rental_agent` to search for and book rental cars, completing the travel trifecta.
-   **[ ] Itinerary Planning Agent**: Create a higher-level agent that can plan a full trip. A user could say, "Plan a 5-day trip to Paris for me," and the agent would orchestrate flights, hotels, and activities.
-   **[ ] User Profile & Preferences**: Allow the agent to store user preferences (e.g., preferred airline, seating choice, hotel chains, budget) to provide more personalized recommendations.
-   **[ ] Real-time Price Tracking**: Add a feature to track the price of a specific flight or hotel and notify the user when the price drops.
-   **[ ] Multi-Modal Travel**: Extend the agent to handle other forms of travel, like trains or buses.
-   **[ ] Local Activities/Tours Agent**: Add an agent that can suggest and book local tours, restaurant reservations, or event tickets at the destination.

## 🤝 How to Contribute

Contributions are highly encouraged! If you want to work on any of the items above or have a new idea:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes.**
4.  **Submit a pull request** with a clear description of what you've done.

If you're tackling a larger feature, it's a good idea to open an issue first to discuss the approach.
