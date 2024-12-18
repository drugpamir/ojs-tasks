import { CalendarApi } from "./calendarApi";
import { CalendarDummyStorage } from "./calendarDummyStorage";
import { CalendarFireBaseStorage } from "./calendarFireBaseStorage";
import { CalendarLocalStorage } from "./calendarLocalStorage";

type CalendarApiLibrary = {
  [key: string]: CalendarApi;
};

export const calendarApiTypes: CalendarApiLibrary = {
  CalendarDummyStorage: new CalendarDummyStorage(),
  CalendarLocalStorage: new CalendarLocalStorage(),
  CalendarFireBaseStorage: new CalendarFireBaseStorage(),
};
