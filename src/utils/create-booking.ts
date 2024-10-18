import { API_BASE_URL } from "../constants";

interface Booking {
    bookingStartTime: number;
    bookingEndTime: number;
    isAnonymous: boolean;
    resourceId: string;
    zoneItemId: number;
    workspaceId: string;
}

interface BookingData {
    bookings: Booking[];
}

export async function createBooking(data: BookingData, accessToken: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}
