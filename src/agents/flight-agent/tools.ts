import { createTool } from "@iqai/adk";
import * as z from "zod";
import { callAmadeusApi } from "../../libs/helpers/amadeus";
import {
	airportSearchSchema,
	flightApiResponseSchema,
	priceAnalysisSchema,
} from "./_schema";

export const getAvailableFlightsTool = createTool({
	name: "get_available_flights",
	description: "Get available flights between two cities on a given date",
	schema: z.object({
		origin: z.string(),
		destination: z.string(),
		departureDate: z.string(),
		returnDate: z.string().optional(),
		adults: z.number().min(1).default(1),
		max: z.number().min(1).max(250).default(5),
	}),
	fn: async ({
		origin,
		destination,
		departureDate,
		returnDate,
		adults,
		max,
	}): Promise<string> => {
		try {
			const params: Record<string, string | number | boolean> = {
				originLocationCode: origin,
				destinationLocationCode: destination,
				departureDate,
				adults,
				max,
			};
			if (returnDate) params.returnDate = returnDate;

			const response = await callAmadeusApi(
				"/v2/shopping/flight-offers",
				params,
				flightApiResponseSchema,
			);
			const offers = response.data;

			if (!offers.length)
				return `No flights found from ${origin} to ${destination} on ${departureDate}.`;

			console.log(offers);

			return offers
				.map((offer, idx) => {
					const segments = offer.itineraries
						.map((it) =>
							it.segments
								.map(
									(seg) =>
										`${seg.departure.iataCode} → ${seg.arrival.iataCode} (${seg.departure.at} → ${seg.arrival.at})`,
								)
								.join(" | "),
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

export const flightPriceAnalysisTool = createTool({
	name: "flight_price_analysis",
	description:
		"Get price analysis for flights between two cities on a given date",
	schema: z.object({
		origin: z.string(),
		destination: z.string(),
		departureDate: z.string(),
	}),
	fn: async ({ origin, destination, departureDate }): Promise<string> => {
		try {
			const response = await callAmadeusApi(
				"/v1/travel-intelligence/flight-price-analysis",
				{ origin, destination, departureDate },
				priceAnalysisSchema,
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

export const searchAirportsTool = createTool({
	name: "search_airports",
	description: "Search for airports by keyword to get IATA codes",
	schema: z.object({
		keyword: z.string(),
		subType: z.enum(["AIRPORT", "CITY"]).default("AIRPORT"),
	}),
	fn: async ({ keyword, subType }): Promise<string> => {
		try {
			const response = await callAmadeusApi(
				"/v1/reference-data/locations",
				{ keyword, subType, "page[limit]": 10 },
				airportSearchSchema,
			);
			const airports = response.data;

			if (!airports.length)
				return `No airports or cities found for "${keyword}".`;

			return airports
				.map(
					(a) =>
						`${a.name} (${a.iataCode}) - ${a.address.cityName || "N/A"}, ${a.address.countryName || "N/A"}`,
				)
				.join("\n");
		} catch (err) {
			return `Unable to search airports: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
		}
	},
});
