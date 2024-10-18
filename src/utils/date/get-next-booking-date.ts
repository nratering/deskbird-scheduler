import { DateTime } from "luxon";

export function getNextBookingDate(daysFromNow: number = 6): DateTime {
  return DateTime.now()
    .setZone("Europe/Amsterdam")
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .plus({ day: daysFromNow })
    ;
}
