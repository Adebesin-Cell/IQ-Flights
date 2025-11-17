import z from "zod";
import { getCityCodes } from "../../libs/helpers/get-city-code";
import { createTool } from "@iqai/adk";

export const getCityCodesTool = createTool({
  name: "get_city_codes",
  description: "Fetches the IATA code for a single city name.",
  schema: z.object({
    city: z.string().min(1),
    limit: z.number().default(3),
  }),
  fn: async ({ city, limit }) => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    try {
      const cityResults = await getCityCodes(city, limit);
      const results = cityResults.map((c) => ({ name: c.name, iataCode: c.iataCode }));
      await delay(150);
      return results;
    } catch (err) {
      console.warn(`⚠️ Failed to fetch IATA codes for "${city}":`, err);
      return [];
    }
  },
});