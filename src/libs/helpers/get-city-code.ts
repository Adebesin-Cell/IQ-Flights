import { z } from "zod";
import { callAmadeusApi } from "./amadeus";

const amadeusLocationSchema = z.object({
  name: z.string(),
  detailedName: z.string(),
  iataCode: z.string(),
  subType: z.string(),
});

const amadeusDataSchema = z.object({
  data: z.array(amadeusLocationSchema),
});

export const citySchema = z.object({
  name: z.string(),
  iataCode: z.string(),
  countryCode: z.string(),
});
export const citiesSchema = z.array(citySchema);

export async function getCityCodes(keyword: string, limit = 50) {
  if (!keyword) return [];

  const response = await callAmadeusApi(
    "/v1/reference-data/locations",
    {
      keyword,
      subType: "CITY",
      "page[limit]": limit,
    },
    amadeusDataSchema
  );

  const cities = response.data.map((loc) => {
    const parts = loc.detailedName.split("/");
    const countryCode = parts.length > 1 ? parts[parts.length - 1] : "";
    return {
      name: loc.name,
      iataCode: loc.iataCode,
      countryCode,
    };
  });

  return citiesSchema.parse(cities);
}
