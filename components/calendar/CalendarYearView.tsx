import React, { FC } from "react"
import { startOfYear, endOfYear, eachMonthOfInterval, format, parseISO } from "date-fns"
import { CalendarEvent, ViewMode } from "./Calendar.types"

// Utility function to ensure we have a Date object
const ensureDate = (date: Date | string): Date => {
  return typeof date === "string" ? parseISO(date) : date
}

interface YearViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  setCurrentDate?: (date: Date) => void
  setViewMode?: (mode: ViewMode) => void
}

export const CalendarYearView: FC<YearViewProps> = ({
  currentDate,
  events,
  onEventClick,
  setCurrentDate,
  setViewMode,
}) => {
  const yearStart = startOfYear(currentDate)
  const yearEnd = endOfYear(currentDate)
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  return (
    <div role="grid" aria-label="Year view" className="grid grid-cols-4 gap-4 p-4">
      {months.map((monthDate) => {
        // Count events in this month
        const monthEvents = events.filter((ev) => {
          const eventDate = ensureDate(ev.date)
          return eventDate.getMonth() === monthDate.getMonth() && eventDate.getFullYear() === monthDate.getFullYear()
        })

        return (
          <div
            key={monthDate.toISOString()}
            role="gridcell"
            className="cursor-pointer rounded border border-gray-200 p-4 hover:bg-gray-50"
            onClick={() => {
              setCurrentDate?.(monthDate)
              setViewMode?.("Month")
            }}
          >
            <h3 className="mb-2 text-lg font-semibold">{format(monthDate, "MMMM")}</h3>
            {monthEvents.length > 0 && <div className="text-sm text-gray-600">{monthEvents.length} events</div>}
          </div>
        )
      })}
    </div>
  )
}
