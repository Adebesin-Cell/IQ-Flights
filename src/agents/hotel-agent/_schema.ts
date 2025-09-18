import * as z from "zod";

export const hotelSchema = z.object({
	chainCode: z.string(),
	dupeId: z.string(),
	name: z.string(),
	rating: z.string().optional(),
	cityCode: z.string(),
	hotelDistance: z
		.object({
			distance: z.string().optional(),
			distanceUnit: z.string().optional(),
		})
		.optional(),
	amenities: z.array(z.string()).optional(),
});

export const hotelsSchema = z.array(hotelSchema);

export const hotelDetailsSchema = z.object({
	chainCode: z.string(),
	dupeId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	facilities: z.array(z.string()).optional(),
	media: z
		.array(z.object({ uri: z.string(), category: z.string().optional() }))
		.optional(),
});
