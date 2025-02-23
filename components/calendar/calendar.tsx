import React, { forwardRef, useState } from "react"
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears, format } from "date-fns"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Button } from "../button/button"
import { CalendarProps, CalendarEvent, ViewMode } from "./Calendar.types"
import { CalendarDayView } from "./CalendarDayView"
import { CalendarWeekView } from "./CalendarWeekView"
import { CalendarMonthView } from "./CalendarMonthView"
import { CalendarYearView } from "./CalendarYearView"

const calendarVariants = cva("w-full bg-white rounded-lg shadow", {
  variants: {
    variant: {
      default: "",
      bordered: "border border-gray-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      variant,
      events = [],
      onDateSelect,
      onEventClick,
      onAddEvent,
      initialDate,
      initialView = "Month",
      timeZone,
      ...props
    },
    ref
  ) => {
    const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date())
    const [viewMode, setViewMode] = useState<ViewMode>(initialView)

    // Navigate
    const handlePrevious = () => {
      switch (viewMode) {
        case "Day":
          setCurrentDate((d) => subDays(d, 1))
          break
        case "Week":
          setCurrentDate((d) => subWeeks(d, 1))
          break
        case "Month":
          setCurrentDate((d) => subMonths(d, 1))
          break
        case "Year":
          setCurrentDate((d) => subYears(d, 1))
          break
      }
    }

    const handleNext = () => {
      switch (viewMode) {
        case "Day":
          setCurrentDate((d) => addDays(d, 1))
          break
        case "Week":
          setCurrentDate((d) => addWeeks(d, 1))
          break
        case "Month":
          setCurrentDate((d) => addMonths(d, 1))
          break
        case "Year":
          setCurrentDate((d) => addYears(d, 1))
          break
      }
    }

    const handleToday = () => {
      setCurrentDate(new Date())
    }

    // Header text
    const getHeaderText = () => {
      switch (viewMode) {
        case "Day":
          return format(currentDate, "EEEE, MMM d, yyyy") // e.g. "Monday, Jan 9, 2024"
        case "Week": {
          // Example: "Jan 1 - Jan 7, 2024"
          const start = format(subDays(currentDate, currentDate.getDay()), "MMM d")
          const end = format(addDays(currentDate, 6 - currentDate.getDay()), "MMM d, yyyy")
          return `${start} - ${end}`
        }
        case "Month":
          return format(currentDate, "MMMM yyyy") // e.g. "January 2024"
        case "Year":
          return format(currentDate, "yyyy") // e.g. "2024"
      }
    }

    // Render correct view
    const renderView = () => {
      switch (viewMode) {
        case "Day":
          return (
            <CalendarDayView
              currentDate={currentDate}
              events={events}
              onEventClick={onEventClick}
              timeZone={timeZone}
            />
          )
        case "Week":
          return <CalendarWeekView currentDate={currentDate} events={events} onEventClick={onEventClick} />
        case "Month":
          return (
            <CalendarMonthView
              currentDate={currentDate}
              events={events}
              onDateSelect={onDateSelect}
              onEventClick={onEventClick}
            />
          )
        case "Year":
          return (
            <CalendarYearView
              currentDate={currentDate}
              events={events}
              setCurrentDate={setCurrentDate}
              setViewMode={setViewMode}
            />
          )
      }
    }

    return (
      <div
        ref={ref}
        className={cn(calendarVariants({ variant }), className)}
        {...props}
        role="region"
        aria-label="Calendar"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold">{getHeaderText()}</h2>

          {/* View mode buttons */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1">
              {(["Day", "Week", "Month", "Year"] as ViewMode[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewMode(view)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    viewMode === view ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center rounded-lg border border-gray-200">
              <button onClick={handlePrevious} aria-label="Previous" className="rounded-full p-2 hover:bg-gray-100">
                <FaChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleToday}
                aria-label="Today"
                className="rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Today
              </button>
              <button onClick={handleNext} aria-label="Next" className="rounded-full p-2 hover:bg-gray-100">
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Add Event button */}
            {onAddEvent && (
              <Button variant="primary" size="default" onClick={onAddEvent}>
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Calendar Content */}
        {renderView()}
      </div>
    )
  }
)

Calendar.displayName = "Calendar"
