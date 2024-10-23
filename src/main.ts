import * as dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import {
  DESKBIRD_RESOURCE_ID,
  DESKBIRD_WORKSPACE_ID,
  DESKBIRD_ZONE_ITEM_ID,
  GOOGLE_API_KEY,
} from './constants';
import { createBooking } from './utils/create-booking';
import { getNextBookingDate } from './utils/date/get-next-booking-date';
import { getNewAccessToken } from './utils/get-new-access-token';

// Main function
// test
async function run() {
  const refreshToken = process.env.REFRESH_TOKEN;

  if (!refreshToken) {
    console.error('DESKBIRD_ACCESS_TOKEN is not set');
    return;
  }

  if (!GOOGLE_API_KEY) {
    console.error('Google API key is not set');
    return;
  }

  if (
    !DESKBIRD_RESOURCE_ID ||
    !DESKBIRD_ZONE_ITEM_ID ||
    !DESKBIRD_WORKSPACE_ID
  ) {
    console.error(
      'DESKBIRD_RESOURCE_ID, DESKBIRD_ZONE_ITEM_ID, DESKBIRD_WORKSPACE_ID are not set'
    );
    return;
  }

  const accessToken = await getNewAccessToken(refreshToken);
  if (!accessToken) {
    console.error('accessToken is not set');
    return;
  }

  const bookingDate = getNextBookingDate(6);

  if (bookingDate.weekday === 6 || bookingDate.weekday === 7) {
    console.log('Booking is on weekend, skipping...');
    return;
  }

  const startDateTime = bookingDate.set({ hour: 9 });
  const endDateTime = bookingDate.set({ hour: 18 });

  const data = {
    bookings: [
      {
        bookingStartTime: startDateTime.toMillis(),
        bookingEndTime: endDateTime.toMillis(),
        isAnonymous: false,
        resourceId: DESKBIRD_RESOURCE_ID,
        zoneItemId: parseInt(DESKBIRD_ZONE_ITEM_ID, 10),
        workspaceId: DESKBIRD_WORKSPACE_ID,
      },
    ],
  };

  try {
    const response = await createBooking(data, accessToken);
    const successfulBookings = response.successfulBookings.length;
    const failedBookings = response.failedBookings.length;

    console.log(`SuccessfulBookings: ${successfulBookings}`);
    console.log(`FailedBookings: ${failedBookings}`);
    if (failedBookings > 0) {
      console.dir(response.failedBookings, { depth: null });

      // exit process with code 1
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to run the booking process:', error);

    // exit process with code 1
    process.exit(1);
  }
}

// Run the main function
run().catch(console.error);
