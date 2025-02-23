import type { Meta, StoryObj } from "@storybook/react"
import Button from "./button"
import { FaMagnifyingGlass, FaPlus, FaArrowRight } from "react-icons/fa6"
import { FaExternalLinkAlt } from "react-icons/fa";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "danger", "custom", "link"],
      description: "The visual style variant of the button",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "The size variant of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the button is disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    backgroundColor: {
      control: { type: "color" },
      description: "Custom background color (only works with variant='custom')",
      if: { arg: "variant", eq: "custom" },
    },
    hoverBackgroundColor: {
      control: { type: "color" },
      description:
        "Custom hover background color (only works with variant='custom'). If not provided, defaults to 10% darker than backgroundColor.",
      if: { arg: "variant", eq: "custom" },
    },
    href: {
      control: { type: "text" },
      description: "URL to navigate to when clicked (renders as <a> tag)",
    },
    onClick: {
      action: "clicked",
      description: "Function to call when the button is clicked",
    },
    leadingIcon: {
      description: "Icon component to display before the button text",
    },
    trailingIcon: {
      description: "Icon component to display after the button text",
    },
    children: {
      control: { type: "text" },
      description: "The content to display inside the button",
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    onClick: () => alert("Button clicked!"),
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
}

export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
}

export const Custom: Story = {
  args: {
    children: "Custom Button",
    variant: "custom",
    backgroundColor: "#9333ea",
  },
}

export const CustomWithHover: Story = {
  args: {
    children: "Custom Button With Hover",
    variant: "custom",
    backgroundColor: "#9333ea",
    hoverBackgroundColor: "#7e22ce",
  },
}

export const AsLink: Story = {
  args: {
    children: "Visit Documentation",
    href: "https://docs.example.com",
    trailingIcon: FaExternalLinkAlt,
  },
}

export const LinkButton: Story = {
  args: {
    children: "Edit",
    variant: "link",
    onClick: () => alert("Link button clicked!"),
  },
}

export const WithClickHandler: Story = {
  args: {
    children: "Click Me",
    onClick: () => alert("Button clicked!"),
  },
}

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
}

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
}

export const WithLeadingIcon: Story = {
  args: {
    children: "Add Item",
    leadingIcon: FaPlus,
    onClick: () => alert("Add item clicked!"),
  },
}

export const WithTrailingIcon: Story = {
  args: {
    children: "Next Step",
    trailingIcon: FaArrowRight,
    onClick: () => alert("Next step clicked!"),
  },
}

export const IconOnly: Story = {
  args: {
    "aria-label": "Search",
    children: null,
    leadingIcon: FaMagnifyingGlass,
    size: "icon",
    onClick: () => alert("Search clicked!"),
  },
}
