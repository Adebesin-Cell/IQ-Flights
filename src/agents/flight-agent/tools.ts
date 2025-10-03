import { createTool } from "@iqai/adk";
import * as z from "zod";
import { callAmadeusApi } from "../../libs/helpers/amadeus";
import { flightApiResponseSchema, priceAnalysisSchema, airportSearchSchema } from "./_schema";
import { formatDate } from "../../libs/helpers/format-date";

/**
 * Tool for fetching available flights between two cities.
 */
export const getAvailableFlightsTool = createTool({
  name: "get_available_flights",
  description: "Retrieve available flight offers between two cities for given dates.",
  schema: z.object({
    origin: z.string().describe("IATA code of the origin airport, e.g., JFK"),
    destination: z.string().describe("IATA code of the destination airport, e.g., LHR"),
    departureDate: z.string().describe("Departure date in YYYY-MM-DD format"),
    returnDate: z.string().optional().describe("Optional return date in YYYY-MM-DD format for round trips"),
    adults: z.number().min(1).default(1).describe("Number of adult passengers (must be at least 1)"),
    max: z.number().min(1).max(250).default(5).describe("Maximum number of flight offers to return (1–250)"),
  }),
  fn: async ({ origin, destination, departureDate, returnDate, adults, max }): Promise<string> => {
    try {
      const params: Record<string, string | number | boolean> = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults,
        max,
      };
      if (returnDate) params.returnDate = returnDate;

      const response = await callAmadeusApi("/v2/shopping/flight-offers", params, flightApiResponseSchema);
      const offers = response.data;

      if (!offers.length)
        return `No flights found from ${origin} to ${destination} on ${departureDate}.`;

      return offers
        .map((offer, idx) => {
          const segments = offer.itineraries
            .map((it) =>
              it.segments
                .map((seg) => {
                  const dep = formatDate(seg.departure.at);
                  const arr = formatDate(seg.arrival.at);
                  return `${seg.departure.iataCode} → ${seg.arrival.iataCode} (${dep.readable} → ${arr.readable})`;
                })
                .join(" | ")
            )
            .join("\n");
          return `${idx + 1}. Airline: ${offer.validatingAirlineCodes.join(", ")}, Price: ${offer.price.total} ${offer.price.currency}\nSegments:\n${segments}`;
        })
        .join("\n\n");
    } catch (err) {
      return `Unable to fetch flights: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
    }
  },
});

/**
 * Tool for analyzing average or typical flight prices.
 */
export const flightPriceAnalysisTool = createTool({
  name: "flight_price_analysis",
  description: "Analyze historical and average flight prices for a given route and date.",
  schema: z.object({
    origin: z.string().describe("IATA code of the origin airport, e.g., SFO"),
    destination: z.string().describe("IATA code of the destination airport, e.g., CDG"),
    departureDate: z.string().describe("Date of departure in YYYY-MM-DD format"),
  }),
  fn: async ({ origin, destination, departureDate }): Promise<string> => {
    try {
      const response = await callAmadeusApi(
        "/v1/travel-intelligence/flight-price-analysis",
        { origin, destination, departureDate },
        priceAnalysisSchema
      );
      const data = response.data;

      if (!data)
        return `No price analysis available for ${origin} → ${destination} on ${departureDate}.`;

      return `Flight Price Analysis for ${origin} → ${destination} on ${departureDate}:\n- Total Price: ${data.price.total} ${data.price.currency}`;
    } catch (err) {
      return `Unable to fetch price analysis: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
    }
  },
});
