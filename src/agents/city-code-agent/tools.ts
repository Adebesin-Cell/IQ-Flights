import { createTool } from "@iqai/adk";
import * as z from "zod";
import {
	getCityCodes,
	POPULAR_CITY_CODES,
} from "../../libs/helpers/get-city-code";

/**
 * Tool to get city codes
 */
export const cityCodesTool = createTool({
	name: "get_city_codes",
	description:
		"Retrieve IATA city codes for a given city keyword or return popular cities if no keyword is provided",
	schema: z.object({
		keyword: z.string().optional().describe("Partial city name to search"),
	}),
	fn: async ({ keyword }): Promise<string> => {
		try {
			let cities: { code: string; name: string }[] = [];

			if (!keyword) {
				cities = POPULAR_CITY_CODES;
			} else {
				const results = await getCityCodes(keyword);

				cities = results.map((city) => ({
					code: city.iataCode,
					name: city.name,
				}));
			}

			if (!cities.length)
				return `No city codes found for "${keyword || "popular cities"}".`;

			return cities.map((c) => `${c.code} - ${c.name}`).join("\n");
		} catch (err) {
			return `Unable to fetch city codes: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
		}
	},
});
