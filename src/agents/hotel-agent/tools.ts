import { createTool } from "@iqai/adk";
import * as z from "zod";
import { callAmadeusApi } from "../../libs/helpers/amadeus";
import { hotelDetailsSchema, hotelsSchema } from "./_schema";

export const searchHotelsTool = createTool({
	name: "search_hotels",
	description: "Search hotels in a city",
	schema: z.object({
		cityCode: z.string().describe("IATA city code, e.g., NYC"),
		checkInDate: z.string().describe("YYYY-MM-DD"),
		checkOutDate: z.string().describe("YYYY-MM-DD"),
		adults: z.number().min(1).default(1),
		limit: z.number().min(1).max(20).default(5),
	}),
	fn: async ({
		cityCode,
		checkInDate,
		checkOutDate,
		adults,
		limit,
	}): Promise<string> => {
		try {
			const hotels = await callAmadeusApi(
				"/v2/shopping/hotel-offers",
				{ cityCode, checkInDate, checkOutDate, adults, pageLimit: limit },
				hotelsSchema,
			);

			if (!hotels.length)
				return `No hotels found in ${cityCode} from ${checkInDate} to ${checkOutDate}.`;

			return hotels
				.map(
					(h, i) =>
						`${i + 1}. ${h.name}${h.rating ? ` (${h.rating}★)` : ""} - ${h.cityCode}` +
						(h.hotelDistance?.distance
							? `, ${h.hotelDistance.distance}${h.hotelDistance.distanceUnit || ""} away`
							: ""),
				)
				.join("\n");
		} catch (err) {
			return `Unable to fetch hotels: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
		}
	},
});

// --- Hotel Details Tool ---
export const hotelDetailsTool = createTool({
	name: "hotel_details",
	description: "Get detailed information for a specific hotel",
	schema: z.object({
		hotelId: z.string().describe("Hotel dupeId or chainCode"),
	}),
	fn: async ({ hotelId }): Promise<string> => {
		try {
			const hotel = await callAmadeusApi(
				`/v2/shopping/hotel-offers/${hotelId}`,
				{},
				hotelDetailsSchema,
			);

			return `Hotel: ${hotel.name}
Description: ${hotel.description || "No description available"}
Facilities: ${hotel.facilities?.join(", ") || "N/A"}
Media: ${hotel.media?.map((m) => m.uri).join(", ") || "N/A"}`;
		} catch (err) {
			return `Unable to fetch hotel details: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
		}
	},
});

// --- Hotel Price Tool ---
export const hotelPriceTool = createTool({
	name: "hotel_price",
	description: "Analyze hotel pricing for a given city and dates",
	schema: z.object({
		cityCode: z.string(),
		checkInDate: z.string(),
		checkOutDate: z.string(),
		adults: z.number().min(1).default(1),
	}),
	fn: async ({
		cityCode,
		checkInDate,
		checkOutDate,
		adults,
	}): Promise<string> => {
		try {
			const hotelPrices = await callAmadeusApi(
				"/v2/shopping/hotel-offers",
				{ cityCode, checkInDate, checkOutDate, adults, pageLimit: 10 },
				hotelsSchema,
			);

			if (!hotelPrices.length)
				return `No pricing information available for hotels in ${cityCode}.`;

			return hotelPrices
				.map(
					(h) =>
						`${h.name}${h.rating ? ` (${h.rating}★)` : ""} - ${h.cityCode}`,
				)
				.join("\n");
		} catch (err) {
			return `Unable to fetch hotel pricing: ${err instanceof Error ? err.message : "Unknown error"}. Please try again later.`;
		}
	},
});
