import type { Meta, StoryObj } from "@storybook/react"
import Checkbox from "./checkbox"

// Base configuration objects to reduce duplication
const baseArgTypes = {
  checked: {
    control: { type: "boolean" as const },
    description: "Whether the checkbox is checked",
    table: { defaultValue: { summary: "false" } },
  },
  disabled: {
    control: { type: "boolean" as const },
    description: "Whether the checkbox is disabled",
    table: { defaultValue: { summary: "false" } },
  },
  required: {
    control: { type: "boolean" as const },
    description: "Whether the checkbox is required",
    table: { defaultValue: { summary: "false" } },
  },
  error: {
    control: { type: "boolean" as const },
    description: "Whether to show the checkbox in an error state",
    table: { defaultValue: { summary: "false" } },
  },
  errorMessage: {
    control: { type: "text" as const },
    description: "Error message to display when in error state",
    if: { arg: "error", eq: true },
  },
}

const baseArgs = {
  label: "Default label",
  description: "",
  descriptionLayout: "block" as const,
}

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    ...baseArgTypes,
    label: {
      control: { type: "text" as const },
      description: "The label text for the checkbox",
    },
    description: {
      control: { type: "text" as const },
      description: "Additional descriptive text",
    },
    descriptionLayout: {
      control: { type: "radio" as const },
      options: ["block", "inline"] as const,
      description: "Layout for the description text",
      table: { defaultValue: { summary: "block" } },
    },
    onChange: {
      action: "changed",
      description: "Function called when the checkbox state changes",
    },
    "aria-label": {
      control: { type: "text" as const },
      description: "aria-label for checkbox without visible label",
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    ...baseArgs,
    label: "Accept terms and conditions",
  },
}

export const WithDescription: Story = {
  args: {
    ...baseArgs,
    label: "Subscribe to newsletter",
    description: "Get weekly updates about new products and features",
  },
}

export const WithInlineDescription: Story = {
  args: {
    ...baseArgs,
    label: "Subscribe to newsletter",
    description: "Get weekly updates",
    descriptionLayout: "inline",
  },
}

export const Required: Story = {
  args: {
    ...baseArgs,
    label: "Accept terms and conditions",
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    ...baseArgs,
    label: "Disabled checkbox",
    disabled: true,
  },
}

export const Error: Story = {
  args: {
    ...baseArgs,
    label: "Accept terms and conditions",
    error: true,
    errorMessage: "You must accept the terms and conditions",
  },
}

export const Checked: Story = {
  args: {
    ...baseArgs,
    label: "Pre-checked checkbox",
    checked: true,
  },
}
