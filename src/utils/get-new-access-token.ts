import { GOOGLE_API_KEY, GOOGLE_API_URL } from "../constants";

const API_URL = `${GOOGLE_API_URL}${GOOGLE_API_KEY}`;

export async function getNewAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      console.log("Access token successfully created");
      return data.access_token;
    } else {
      console.error("Failed to get a new access token");
      console.error("Response:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching new access token:", error);
    return null;
  }
}
