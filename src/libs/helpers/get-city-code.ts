import * as z from "zod";
import { callAmadeusApi } from "./amadeus";

export const POPULAR_CITY_CODES = [
	{ code: "NYC", name: "New York" },
	{ code: "LON", name: "London" },
	{ code: "PAR", name: "Paris" },
	{ code: "BER", name: "Berlin" },
	{ code: "MAD", name: "Madrid" },
	{ code: "SIN", name: "Singapore" },
	{ code: "BKK", name: "Bangkok" },
];

const citySchema = z.object({
	name: z.string(),
	iataCode: z.string(),
	countryCode: z.string(),
});

const citiesSchema = z.array(citySchema);

/**
 * Fetch city codes from Amadeus (dynamic search)
 */
export async function getCityCodes(keyword: string, limit = 50) {
	if (!keyword) return []; // fallback if no keyword

	const cities = await callAmadeusApi(
		"/v1/reference-data/locations",
		{
			keyword,
			subType: "CITY",
			"page[limit]": limit,
		},
		citiesSchema,
	);

	return cities;
}
