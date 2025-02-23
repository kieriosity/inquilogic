import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./calendar"
import React from "react"

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "bordered"],
      description: "The visual style variant of the calendar",
    },
    initialView: {
      control: { type: "select" },
      options: ["Day", "Week", "Month", "Year"],
      description: "The initial view mode of the calendar",
    },
    onDateSelect: { action: "dateSelected" },
    onEventClick: { action: "eventClicked" },
    onAddEvent: { action: "addEventClicked" },
  },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof Calendar>

const sampleEvents = [
  {
    id: "1",
    title: "Lunar New Year",
    date: new Date(2025, 0, 29),
    type: "highlight" as const,
    isAllDay: true,
    description: "Celebration of the Lunar New Year",
  },
  {
    id: "2",
    title: "Sprint Planning",
    date: new Date(2025, 1, 21, 9, 0), // 9:00 AM
    endDate: new Date(2025, 1, 21, 10, 30), // 10:30 AM
    type: "default" as const,
    description: "Q1 Sprint Planning Meeting",
  },
  {
    id: "3",
    title: "Team Meeting",
    date: new Date(2025, 1, 21, 11, 0), // 11:00 AM
    endDate: new Date(2025, 1, 21, 12, 0), // 12:00 PM
    type: "default" as const,
    description: "Weekly Team Sync",
  },
  {
    id: "4",
    title: "Project Review",
    date: new Date(2025, 1, 21, 14, 30), // 2:30 PM
    endDate: new Date(2025, 1, 21, 16, 0), // 4:00 PM
    type: "success" as const,
    description: "End of Sprint Project Review",
  },
  {
    id: "5",
    title: "Code Deploy",
    date: new Date(2025, 1, 22, 11, 0), // 11:00 AM
    endDate: new Date(2025, 1, 22, 12, 0), // 12:00 PM
    type: "warning" as const,
    description: "Production Deployment",
  },
  {
    id: "6",
    title: "Company Holiday",
    date: new Date(2025, 1, 24),
    type: "highlight" as const,
    isAllDay: true,
    description: "Office Closed",
  },
  {
    id: "7",
    title: "Design Workshop",
    date: new Date(2025, 1, 21, 13, 0), // 1:00 PM
    endDate: new Date(2025, 1, 21, 14, 0), // 2:00 PM
    type: "default" as const,
    description: "UX Design Workshop",
  },
  {
    id: "8",
    title: "Sprint Ends",
    date: new Date(2025, 1, 21),
    type: "warning" as const,
    isAllDay: true,
    description: "End of Current Sprint",
  },
  {
    id: "9",
    title: "Late Night Deployment",
    date: new Date(2025, 1, 20, 23, 30), // Thursday 11:30 PM
    endDate: new Date(2025, 1, 21, 2, 0), // Friday 2:00 AM
    type: "warning" as const,
    description: "System deployment and verification",
  },
  {
    id: "10",
    title: "Post-Deployment Review",
    date: new Date(2025, 1, 21, 10, 0), // Friday 10:00 AM
    endDate: new Date(2025, 1, 21, 11, 0), // Friday 11:00 AM
    type: "default" as const,
    description: "Review deployment results and address any issues",
  },
  {
    id: "11",
    title: "Quick Status Update",
    date: new Date(2025, 1, 21, 10, 0), // Friday 10:00 AM
    endDate: new Date(2025, 1, 21, 10, 30), // Friday 10:30 AM
    type: "default" as const,
    description: "Brief team status check",
  },
]

export const MonthView: Story = {
  args: {
    variant: "bordered",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 1), // February 1, 2025
    initialView: "Month",
  },
}

export const WeekView: Story = {
  args: {
    variant: "bordered",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 21), // February 21, 2025
    initialView: "Week",
  },
  render: (args: React.ComponentProps<typeof Calendar>) => {
    const [date, setDate] = React.useState(args.initialDate)
    return (
      <Calendar
        {...args}
        initialDate={date}
        onDateSelect={(newDate: Date) => {
          setDate(newDate)
          args.onDateSelect?.(newDate)
        }}
      />
    )
  },
}

export const DayView: Story = {
  args: {
    variant: "bordered",
    initialView: "Day",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 21),
  },
}

export const EastCoastDayView: Story = {
  args: {
    variant: "bordered",
    initialView: "Day",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 21),
    timeZone: "America/New_York",
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar view in Eastern Time (ET)",
      },
    },
  },
}

export const WestCoastDayView: Story = {
  args: {
    variant: "bordered",
    initialView: "Day",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 21),
    timeZone: "America/Los_Angeles",
  },
  parameters: {
    docs: {
      description: {
        story: "Calendar view in Pacific Time (PT)",
      },
    },
  },
}

export const YearView: Story = {
  args: {
    variant: "bordered",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 1), // February 1, 2025
    initialView: "Year",
  },
}

export const WithoutEvents: Story = {
  args: {
    variant: "bordered",
    initialDate: new Date(2025, 1, 1), // February 1, 2025
    initialView: "Month",
  },
}

export const WithAddEventButton: Story = {
  args: {
    variant: "bordered",
    events: sampleEvents,
    initialDate: new Date(2025, 1, 1), // February 1, 2025
    initialView: "Month",
    onAddEvent: () => alert("Add Event clicked!"),
  },
}
