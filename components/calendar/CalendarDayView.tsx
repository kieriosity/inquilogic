import React, { FC, CSSProperties, useMemo, useCallback, KeyboardEvent, memo } from "react"
import { startOfDay, endOfDay, differenceInMinutes, addHours, parseISO } from "date-fns"
import { toZonedTime, format as tzFormat } from "date-fns-tz"
import { CalendarEvent, DayEventLayout, DayViewProps } from "./Calendar.types"

// Constants
const MINUTES_IN_DAY = 1440
const MINUTES_IN_HOUR = 60
const TOTAL_HOURS = 24
const BASE_EVENT_STYLE: CSSProperties = {
  position: "absolute",
  zIndex: 10,
}

// Utility functions
const ensureDate = (date: Date | string): Date => {
  return typeof date === "string" ? parseISO(date) : date
}

const toLocalZonedDate = (date: Date | string, timeZone: string): Date => {
  const parsed = ensureDate(date)
  if (isNaN(parsed.getTime())) {
    throw new Error("Invalid date provided")
  }
  return toZonedTime(parsed, timeZone)
}

const getClampedTimes = (event: CalendarEvent, dayStart: Date, dayEnd: Date) => {
  const eventStart = ensureDate(event.date)
  const eventEnd = event.endDate ? ensureDate(event.endDate) : eventStart

  if (eventEnd < dayStart || eventStart > dayEnd) {
    return {
      start: eventStart,
      end: eventEnd,
      isWithinDay: false,
      originalStart: eventStart,
      originalEnd: eventEnd,
    }
  }

  return {
    start: eventStart < dayStart ? dayStart : eventStart,
    end: eventEnd > dayEnd ? dayEnd : eventEnd,
    isWithinDay: true,
    originalStart: eventStart,
    originalEnd: eventEnd,
  }
}

const eventsOverlap = (a: { top: number; bottom: number }, b: { top: number; bottom: number }): boolean =>
  a.top < b.bottom && b.top < a.bottom

// Memoized event placement function
const placeEventsInColumns = (events: DayEventLayout[]): DayEventLayout[][] => {
  const columns: DayEventLayout[][] = []
  const sortedEvents = [...events].sort((a, b) => a.top - b.top)

  for (const ev of sortedEvents) {
    let placed = false
    for (const col of columns) {
      if (!col.some((x) => eventsOverlap(x, ev))) {
        col.push(ev)
        placed = true
        break
      }
    }
    if (!placed) {
      columns.push([ev])
    }
  }
  return columns
}

// Main component
export const CalendarDayView: FC<DayViewProps> = memo(({ currentDate, events, onEventClick, timeZone = "UTC" }) => {
  // Convert to local day once
  const localDay = useMemo(() => toLocalZonedDate(currentDate, timeZone), [currentDate, timeZone])
  const dayStart = useMemo(() => startOfDay(localDay), [localDay])
  const dayEnd = useMemo(() => endOfDay(localDay), [localDay])

  // Generate hours array with memoization
  const hours = useMemo(
    () =>
      Array.from({ length: TOTAL_HOURS }, (_, i) => ({
        hour: addHours(dayStart, i),
        label: tzFormat(addHours(dayStart, i), "h:00 a", { timeZone }),
      })),
    [dayStart, timeZone]
  )

  // Process events with memoization
  const { allDayEvents, timedLayouts } = useMemo(() => {
    const allDay: CalendarEvent[] = []
    const layouts: DayEventLayout[] = []

    events.forEach((ev) => {
      // First ensure we have Date objects
      const dateObj = ensureDate(ev.date)
      const endDateObj = ev.endDate ? ensureDate(ev.endDate) : dateObj

      // Then convert to local timezone
      const localStart = toLocalZonedDate(dateObj, timeZone)
      const localEnd = toLocalZonedDate(endDateObj, timeZone)

      const { start, end, isWithinDay, originalStart, originalEnd } = getClampedTimes(
        { ...ev, date: localStart, endDate: localEnd },
        dayStart,
        dayEnd
      )

      if (!isWithinDay) return

      if (ev.isAllDay) {
        allDay.push(ev)
      } else {
        layouts.push({
          event: ev,
          top: differenceInMinutes(start, dayStart),
          bottom: differenceInMinutes(end, dayStart),
          height: differenceInMinutes(end, start),
          start,
          end,
          originalStart,
          originalEnd,
        })
      }
    })

    return { allDayEvents: allDay, timedLayouts: layouts }
  }, [events, dayStart, dayEnd, timeZone])

  // Optimize group creation
  const groups = useMemo(() => {
    if (timedLayouts.length === 0) return []

    const sortedEvents = [...timedLayouts].sort((a, b) => a.top - b.top)
    const groups: DayEventLayout[][] = []
    let currentGroup: DayEventLayout[] = []

    sortedEvents.forEach((event) => {
      const lastEvent = currentGroup[currentGroup.length - 1]

      if (!lastEvent || eventsOverlap(lastEvent, event)) {
        currentGroup.push(event)
      } else {
        groups.push(currentGroup)
        currentGroup = [event]
      }
    })

    if (currentGroup.length) groups.push(currentGroup)
    return groups
  }, [timedLayouts])

  // Calculate final positions with memoization
  const finalPositions = useMemo(
    () =>
      groups.flatMap((group) => {
        if (group.length === 1) {
          const [layout] = group
          if (!layout) return []

          return [
            {
              layout,
              style: {
                ...BASE_EVENT_STYLE,
                top: `${layout.top}px`,
                height: `${layout.height}px`,
                left: "0%",
                width: "100%",
              },
            },
          ]
        }

        const columns = placeEventsInColumns(group)
        const totalCols = columns.length

        return columns.flatMap((col, colIndex) => {
          const colWidth = 100 / totalCols
          return col.map((layout) => ({
            layout,
            style: {
              ...BASE_EVENT_STYLE,
              top: `${layout.top}px`,
              height: `${layout.height}px`,
              left: `${colIndex * colWidth}%`,
              width: `${colWidth}%`,
            },
          }))
        })
      }),
    [groups]
  )

  // Optimized event handlers
  const handleKeyDown = useCallback(
    <T extends Element>(ev: KeyboardEvent<T>, layout: DayEventLayout) => {
      if (!onEventClick) return
      if (ev.key === "Enter" || ev.key === " ") {
        onEventClick(layout.event)
      }
    },
    [onEventClick]
  )

  // Render calendar grid
  return (
    <div
      role="grid"
      aria-label={`Day view for ${tzFormat(localDay, "MMMM d, yyyy", { timeZone })}`}
      aria-rowcount={TOTAL_HOURS}
    >
      {allDayEvents.length > 0 && (
        <div className="border-b border-gray-200 p-2">
          <h3 className="text-sm font-medium text-gray-600">All Day</h3>
          <div className="mt-1 space-y-1">
            {allDayEvents.map((ev) => (
              <button
                key={ev.id}
                className="block w-full rounded bg-blue-100 px-2 py-1 text-left text-sm"
                onClick={() => onEventClick?.(ev)}
                role="gridcell"
                aria-label={`All day event: ${ev.title}`}
                tabIndex={0}
                onKeyDown={(e) =>
                  handleKeyDown(e, {
                    event: ev,
                    top: 0,
                    bottom: 0,
                    height: 0,
                    start: ensureDate(ev.date),
                    end: ev.endDate ? ensureDate(ev.endDate) : ensureDate(ev.date),
                    originalStart: ensureDate(ev.date),
                    originalEnd: ev.endDate ? ensureDate(ev.endDate) : ensureDate(ev.date),
                  })
                }
              >
                <div className="font-medium">{ev.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="relative border-r border-l border-gray-200"
        style={{ height: `${MINUTES_IN_DAY}px` }}
        aria-label="Timed events container"
      >
        {hours.map((h, index) => (
          <div
            key={index}
            role="row"
            aria-rowindex={index + 1}
            className="absolute right-0 left-0 flex items-center border-b border-gray-200"
            style={{
              top: `${index * MINUTES_IN_HOUR}px`,
              height: `${MINUTES_IN_HOUR}px`,
            }}
          >
            <div className="w-[80px] flex-none px-2">
              <span className="text-sm text-gray-500">{h.label}</span>
            </div>
          </div>
        ))}

        <div className="absolute top-0 right-2 bottom-0 left-[80px]">
          {finalPositions.map(({ layout, style }) => {
            const ev = layout.event
            const ariaLabel = `Event: ${ev.title}, from ${tzFormat(layout.originalStart, "h:mmaaa", { timeZone })} to ${tzFormat(layout.originalEnd, "h:mmaaa", { timeZone })}`

            return (
              <div
                key={ev.id}
                id={`event-${ev.id}`}
                style={style}
                className="cursor-pointer overflow-hidden rounded bg-blue-100 p-1 shadow-sm focus:outline-none"
                onClick={() => onEventClick?.(ev)}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                onKeyDown={(e) => handleKeyDown(e, layout)}
              >
                <div className="flex items-center gap-1 text-xs">
                  <div className="flex-none">
                    <time dateTime={layout.originalStart.toISOString()}>
                      {tzFormat(layout.originalStart, "h:mmaaa", { timeZone })}
                    </time>
                    {" - "}
                    <time dateTime={layout.originalEnd.toISOString()}>
                      {tzFormat(layout.originalEnd, "h:mmaaa", { timeZone })}
                    </time>
                  </div>
                  <div className="truncate font-medium">{ev.title}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

CalendarDayView.displayName = "CalendarDayView"
