import type { Meta, StoryObj } from "@storybook/react"
import CardGroup from "./card-group"
import Card from "@/components/card/card"

const meta: Meta<typeof CardGroup> = {
  title: "Components/CardGroup",
  component: CardGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CardGroup>

const sampleCards = [
  {
    title: "Thailand Sunset",
    imageUrl: "/uploads/thailand-sunset.jpg",
    children: "Experience the breathtaking beauty of a Thai sunset.",
  },
  {
    title: "Mountain Trek",
    imageUrl: "/uploads/mountain-trek.jpg",
    children: "Discover the thrill of mountain trekking.",
  },
  {
    title: "Beach Paradise",
    imageUrl: "/uploads/beach-paradise.jpg",
    children: "Relax in a serene beach paradise.",
  },
  {
    title: "City Lights",
    imageUrl: "/uploads/city-lights.jpg",
    children: "Explore the vibrant city nightlife.",
  },
]

export const ThreeColumns: Story = {
  args: {
    columns: "3",
    children: sampleCards.slice(0, 3).map((card, index) => (
      <Card key={index} {...card} />
    )),
  },
}

export const TwoColumns: Story = {
  args: {
    columns: "2",
    children: sampleCards.slice(0, 4).map((card, index) => (
      <Card key={index} {...card} />
    )),
  },
}

export const FourColumns: Story = {
  args: {
    columns: "4",
    children: sampleCards.map((card, index) => (
      <Card key={index} {...card} />
    )),
  },
}
