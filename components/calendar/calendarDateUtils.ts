// calendarDateUtils.ts
import { isSameDay as fnIsSameDay, isToday as fnIsToday, differenceInMinutes, format } from "date-fns"

export const isSameDay = fnIsSameDay
export const isToday = fnIsToday
export const getEventDuration = (start: Date, end?: Date) => {
  if (!end) return 60 // default 1 hour
  return differenceInMinutes(end, start)
}

export const formatTime = (date: Date) => format(date, "h:mma") // e.g., 4:30PM
