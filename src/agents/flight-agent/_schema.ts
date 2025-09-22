import z from "zod";

// Define Zod schema for a single segment
const segmentSchema = z.object({
	departure: z.object({ iataCode: z.string(), at: z.string() }),
	arrival: z.object({ iataCode: z.string(), at: z.string() }),
	carrierCode: z.string(),
	number: z.string(),
});

const itinerarySchema = z.object({
	segments: z.array(segmentSchema),
});

const flightOfferSchema = z.object({
	type: z.string(),
	id: z.string(),
	source: z.string(),
	instantTicketingRequired: z.boolean(),
	nonHomogeneous: z.boolean(),
	oneWay: z.boolean(),
	lastTicketingDate: z.string(),
	numberOfBookableSeats: z.number(),
	validatingAirlineCodes: z.array(z.string()),
	itineraries: z.array(itinerarySchema),
	price: z.object({
		currency: z.string(),
		total: z.string(),
		base: z.string(),
	}),
	travelerPricings: z.array(z.any()),
});

const flightOffersSchema = z.array(flightOfferSchema);

// Schema for full API response
export const flightApiResponseSchema = z.object({
	data: flightOffersSchema,
});

export const priceAnalysisSchema = z.object({
	data: z.object({
		type: z.string(),
		id: z.string(),
		origin: z.string(),
		destination: z.string(),
		departureDate: z.string(),
		price: z.object({
			total: z.number(),
			currency: z.string(),
		}),
	}),
});

export const airportSearchSchema = z.object({
	data: z.array(
		z.object({
			iataCode: z.string(),
			name: z.string(),
			detailedName: z.string().optional(),
			address: z.object({
				cityName: z.string().optional(),
				cityCode: z.string().optional(),
				countryName: z.string().optional(),
				countryCode: z.string().optional(),
			}),
		}),
	),
	meta: z.object({
		count: z.number(),
		links: z.object({
			self: z.string(),
		}),
	}),
});
