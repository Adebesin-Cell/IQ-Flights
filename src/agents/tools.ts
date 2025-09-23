import { createTool } from "@iqai/adk";
import * as chrono from "chrono-node";
import { format, isValid, parseISO } from "date-fns";
import * as z from "zod";
import { callAmadeusApi } from "../libs/helpers/amadeus";
import { airportSearchSchema } from "./flight-agent/_schema";

/**
 * Tool for searching airports and cities.
 */
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

/**
 * Tool for extracting, normalizing, and formatting dates.
 * Always returns a string: "ISO: <iso>, Readable: <readable>"
 */
export const normalizeDateTool = createTool({
	name: "normalize_date",
	description:
		"Parse or format dates. Can extract dates from natural language queries (e.g., 'tomorrow 3pm') or format raw ISO dates (e.g., '2025-10-07T10:35:00'). Always returns a single string with both ISO and readable values.",
	schema: z.object({
		query: z
			.string()
			.describe("Natural language query OR raw ISO date string."),
	}),
	fn: ({ query }) => {
		try {
			let date: Date | null = null;

			// Case 1: Already looks like ISO string
			if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(query)) {
				date = parseISO(query);
			} else {
				// Case 2: Parse natural language query
				const result = chrono.parse(query)[0];
				if (!result) {
					return "DATE_REQUIRED (Readable: Date required)";
				}
				date = result.start.date();
			}

			if (!isValid(date)) {
				return `INVALID_DATE (Readable: Invalid date for "${query}")`;
			}

			// ISO (machine use) → datetime if time present, else just date
			const iso =
				date.getHours() || date.getMinutes()
					? format(date, "yyyy-MM-dd'T'HH:mm")
					: format(date, "yyyy-MM-dd");

			// Readable (user-facing)
			const readable =
				date.getHours() || date.getMinutes()
					? format(date, "PPpp")
					: format(date, "PPP");

			return `ISO: ${iso}, Readable: ${readable}`;
		} catch (err) {
			return `ERROR (Readable: Unable to parse/format date: ${
				err instanceof Error ? err.message : "Unknown error"
			})`;
		}
	},
});
