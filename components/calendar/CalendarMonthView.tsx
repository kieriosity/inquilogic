import React, { FC } from "react"
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addDays, format } from "date-fns"
import { CalendarEvent } from "./Calendar.types"
import { isSameDay, isToday } from "./calendarDateUtils"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}

export const CalendarMonthView: FC<MonthViewProps> = ({ currentDate, events, onDateSelect, onEventClick }) => {
  // Build an array of days that covers the entire month grid
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // We expand to fill full weeks
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const getEventsForDay = (day: Date) => events.filter((ev) => isSameDay(ev.date, day))

  return (
    <div role="grid" aria-label="Month view" className="grid grid-cols-7 gap-px bg-gray-200">
      {/* Days of the week header */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dow) => (
        <div key={dow} className="bg-white py-2 text-center font-bold text-gray-500">
          {dow}
        </div>
      ))}

      {/* Day cells */}
      {days.map((day) => {
        const dayEvents = getEventsForDay(day)
        const isCurrentMonth = day.getMonth() === currentDate.getMonth()
        return (
          <div
            key={day.toISOString()}
            className={`min-h-[80px] bg-white p-2 ${
              !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
            } ${isToday(day) ? "border-2 border-blue-500" : ""}`}
            role="gridcell"
            onClick={() => onDateSelect?.(day)}
          >
            <div className="text-sm font-medium">{format(day, "d")}</div>
            {/* Render events */}
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick?.(ev)
                }}
              >
                {ev.title}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
