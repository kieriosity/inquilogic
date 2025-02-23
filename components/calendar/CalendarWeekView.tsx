import React, { FC } from "react"
import { startOfWeek, endOfWeek, eachDayOfInterval, addHours, format, parseISO } from "date-fns"
import { CalendarEvent, ViewMode } from "./Calendar.types"
import { isSameDay, isToday, getEventDuration, formatTime } from "./calendarDateUtils"

// Utility function to ensure we have a Date object
const ensureDate = (date: Date | string): Date => {
  return typeof date === "string" ? parseISO(date) : date
}

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  setCurrentDate?: (date: Date) => void
  setViewMode?: (mode: ViewMode) => void
}

export const CalendarWeekView: FC<WeekViewProps> = ({ currentDate, events, onEventClick, setCurrentDate, setViewMode }) => {
  // Create an array of days in the current week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }) // Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Hours in a day
  const hours = Array.from({ length: 24 }, (_, i) => addHours(weekStart, i))

  // Collect events for each day
  const allEvents = weekDays.map((day) => {
    return {
      day,
      dayEvents: events.filter((ev) => {
        const eventDate = ensureDate(ev.date)
        return isSameDay(eventDate, day)
      }),
    }
  })

  return (
    <div role="grid" aria-label="Week view" className="flex flex-col">
      {/* Days Header */}
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-white p-2" />
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="bg-white p-2 text-center font-bold">
            {format(day, "EEE")}
            <div className={`text-sm font-normal ${isToday(day) ? "font-bold text-blue-600" : ""}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Hours / Day Cells */}
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        {/* Hour labels */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={`hour-${hourIndex}`}>
            <div className="bg-white p-2 text-sm text-gray-500">{format(hour, "h:00 a")}</div>
            {weekDays.map((day, dayIndex) => {
              // Find any events matching this day & hour
              const dayEvents = allEvents[dayIndex]?.dayEvents || []
              const dayData = dayEvents.filter((ev) => {
                const eventDate = ensureDate(ev.date)
                return eventDate.getHours() === hour.getHours()
              })

              return (
                <div
                  key={`cell-${dayIndex}-${hourIndex}`}
                  className="min-h-[60px] bg-white p-1"
                  role="gridcell"
                  aria-selected={isToday(day) ? "true" : "false"}
                >
                  {dayData.map((ev) => {
                    const eventDate = ensureDate(ev.date)
                    const eventEndDate = ev.endDate ? ensureDate(ev.endDate) : eventDate
                    
                    return (
                      <div
                        key={ev.id}
                        onClick={() => onEventClick?.(ev)}
                        style={{
                          marginTop: `${eventDate.getMinutes()}px`,
                          minHeight: `${Math.max(20, getEventDuration(eventDate, eventEndDate))}px`,
                        }}
                        className="cursor-pointer rounded bg-blue-100 p-1"
                      >
                        <div className="text-xs">{formatTime(eventDate)}</div>
                        <div className="font-medium">{ev.title}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
