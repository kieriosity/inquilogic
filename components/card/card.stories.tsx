import type { Meta, StoryObj } from "@storybook/react"
import Card from "./card"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    title: "Card Title",
    children: "This is a simple card with a title and some content.",
  },
}

export const WithButton: Story = {
  args: {
    title: "Interactive Card",
    children: "This card has a button that you can click.",
    buttonText: "Click Me",
    onButtonClick: () => alert("Button clicked!"),
  },
}

export const WithMediaTop: Story = {
  args: {
    title: "Thailand Sunset",
    width: "double",
    layout: "media-top",
    imageUrl: "/uploads/thailand-sunset.jpg",
    children: "Experience the breathtaking beauty of a Thai sunset, where vibrant colors paint the sky in an unforgettable display of natural wonder.",
  },
}

export const WithMediaHeader: Story = {
  args: {
    title: "London Bridge",
    width: "full",
    layout: "media-header",
    imageUrl: "/uploads/london-bridge.jpg",
    children: "Discover the pristine beaches and crystal-clear waters of this tropical paradise.",
    buttonText: "Click Me",
    onButtonClick: () => alert("Button clicked!"),
  },
}
