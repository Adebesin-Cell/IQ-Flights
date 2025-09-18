import { z } from "zod";
import { env } from "../../env";

const tokenResponseSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	token_type: z.string().optional(),
});

const amadeusErrorSchema = z.object({
	errors: z.array(
		z.object({
			status: z.number(),
			code: z.string(),
			title: z.string(),
			detail: z.string().optional(),
		}),
	),
});

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

/**
 * Get a valid Amadeus OAuth token (caches until expiration)
 */
async function getAmadeusToken() {
	const now = Date.now();

	// Return cached token if still valid
	if (cachedToken && tokenExpiry && now < tokenExpiry) {
		return cachedToken;
	}

	const params = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: env.AMADEUS_API_KEY,
		client_secret: env.AMADEUS_API_SECRET,
	});

	try {
		const res = await fetch(
			"https://test.api.amadeus.com/v1/security/oauth2/token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params,
			},
		);

		if (!res.ok) {
			throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
		}

		const rawData = await res.json();

		const data = tokenResponseSchema.parse(rawData);

		cachedToken = data.access_token;
		tokenExpiry = now + (data.expires_in - 10) * 1000; // subtract 10s buffer

		return cachedToken;
	} catch (error) {
		cachedToken = null;
		tokenExpiry = null;

		if (error instanceof z.ZodError) {
			throw new Error(`Invalid token response format: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Generic helper to call Amadeus APIs
 */
export async function callAmadeusApi<T>(
	endpoint: string,
	queryParams: Record<string, string | number | boolean>,
	responseSchema: z.ZodSchema<T>,
): Promise<T> {
	const token = await getAmadeusToken();
	const params = new URLSearchParams();

	// Handle different parameter types properly
	for (const [key, value] of Object.entries(queryParams)) {
		if (value !== undefined && value !== null) {
			params.append(key, String(value));
		}
	}

	try {
		const res = await fetch(
			`https://test.api.amadeus.com${endpoint}?${params.toString()}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			},
		);

		const rawJson = await res.json();

		if (!res.ok) {
			const errorResult = amadeusErrorSchema.safeParse(rawJson);
			if (errorResult.success) {
				const firstError = errorResult.data.errors[0];
				throw new Error(
					`Amadeus API Error (${firstError.status}): ${firstError.title} - ${firstError.detail || firstError.code}`,
				);
			} else {
				throw new Error(`API request failed: ${res.status} ${res.statusText}`);
			}
		}

		return responseSchema.parse(rawJson);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Invalid API response format: ${error.message}`);
		}
		throw error;
	}
}
