import { createTool } from "@iqai/adk";
import * as z from "zod";
import { callAmadeusApi } from "../libs/helpers/amadeus";
import { airportSearchSchema } from "./flight-agent/_schema";
import { formatDate } from "../libs/helpers/format-date";


export const searchAirportsTool = createTool({
	name: "search_airports",
	description:
		"Search airports or cities by keyword to retrieve their IATA codes.",
	schema: z.object({
		keyword: z
			.string()
			.describe(
				"Partial or full city/airport name to search for, e.g., 'Paris'",
			),
		subType: z
			.enum(["AIRPORT", "CITY"])
			.default("AIRPORT")
			.describe(
				"Specify whether to search for airports or cities (default: AIRPORT)",
			),
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


export const normalizeDateTool = createTool({
  name: "normalize_date",
  description:
    "Parse or format dates. Can extract dates from natural language queries (e.g., 'tomorrow 3pm') or format raw ISO dates (e.g., '2025-10-07T10:35:00'). Always returns a single string with both ISO and readable values.",
  schema: z.object({
    query: z.string().describe("Natural language query OR raw ISO date string."),
  }),
  fn: ({ query }) => {
    try {
      const result = formatDate(query);
      return `ISO: ${result.iso}, Readable: ${result.readable}`;
    } catch (err) {
      return `ERROR (Readable: Unable to parse/format date: ${err instanceof Error ? err.message : "Unknown error"})`;
    }
  },
});