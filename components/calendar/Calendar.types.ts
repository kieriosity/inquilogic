// Common types & interfaces
export interface CalendarEvent {
  id: string
  title: string
  date: Date | string
  endDate?: Date | string
  isAllDay?: boolean
}

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onAddEvent?: () => void
  initialDate?: Date
  initialView?: ViewMode
  variant?: "default" | "bordered"
  /** The time zone in which to display the calendar, e.g. "America/New_York" */
  timeZone?: string
}

export type ViewMode = "Day" | "Week" | "Month" | "Year"

export interface DayEventLayout {
  event: CalendarEvent
  top: number
  bottom: number
  height: number
  start: Date
  end: Date
  originalStart: Date
  originalEnd: Date
}

export interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  timeZone?: string
}
