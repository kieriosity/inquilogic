import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Pagination from "./pagination"

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    totalItems: {
      control: { type: "number" },
      description: "Total number of items to paginate",
    },
    itemsPerPage: {
      control: { type: "number" },
      description: "Number of items to show per page",
    },
    currentPage: {
      control: { type: "number" },
      description: "Current active page",
    },
    onPageChange: {
      description: "Callback function when page changes",
    },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof Pagination>

// Interactive story with state
export const Default = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1)
    return <Pagination totalItems={74} itemsPerPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
  },
}

export const FewPages = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1)
    return <Pagination totalItems={30} itemsPerPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
  },
}

export const ManyPages = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(10)
    return <Pagination totalItems={500} itemsPerPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
  },
}

export const NearStart = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(3)
    return <Pagination totalItems={500} itemsPerPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
  },
}

export const NearEnd = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(48)
    return <Pagination totalItems={500} itemsPerPage={10} currentPage={currentPage} onPageChange={setCurrentPage} />
  },
}
