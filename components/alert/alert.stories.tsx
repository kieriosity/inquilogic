import type { Meta, StoryObj } from "@storybook/react"
import Alert from "./alert"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "The severity level and visual style of the alert",
      table: {
        defaultValue: { summary: "info" }
      }
    },
    size: {
      control: "select",
      options: ["standard", "slim"],
      description: "The size variant of the alert",
      table: {
        defaultValue: { summary: "standard" }
      }
    },
    title: {
      control: "text",
      description: "Optional title text displayed above the main message"
    },
    children: {
      control: "text",
      description: "The main content of the alert"
    }
  }
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: {
    variant: "info",
    title: "Information",
    children: "This is an informational message for the user.",
  },
}

export const Success: Story = {
  args: {
    variant: "success",
    title: "Success",
    children: "The operation completed successfully!",
  },
}

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Warning",
    children: "Please review the changes before proceeding.",
  },
}

export const Error: Story = {
  args: {
    variant: "error",
    title: "Error",
    children: "An error occurred while processing your request.",
  },
}

export const SlimAlert: Story = {
  args: {
    variant: "info",
    size: "slim",
    children: "This is a compact alert message.",
  },
}

export const WithoutTitle: Story = {
  args: {
    variant: "success",
    children: "A simple success message without a title.",
  },
}

export const LongContent: Story = {
  args: {
    variant: "info",
    title: "Important Update",
    children: "This alert contains a longer message that might span multiple lines. It demonstrates how the alert component handles larger content while maintaining readability and proper spacing.",
  },
}
