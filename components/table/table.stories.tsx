import { useState } from "react"
import type { Meta, StoryObj, ArgTypes } from "@storybook/react"
import Table from "./table"
import TableStatus from "./table-status"
import Pagination from "../pagination/pagination"
import type { TableProps } from "./table"

const baseArgTypes: Partial<ArgTypes<TableProps>> = {
  variant: {
    control: { type: "select" },
    options: ["default", "error"],
    description: "The visual style variant of the table",
    table: { defaultValue: { summary: "default" } },
  },
  selectedRows: {
    control: { type: "object" },
    description: "Array of selected row IDs",
    table: { defaultValue: { summary: "[]" } },
  },
  itemsPerPage: {
    control: { type: "number" },
    description: "Number of items to show per page",
    table: { defaultValue: { summary: "10" } },
  },
}

const baseArgs = {
  variant: "default" as const,
  selectedRows: [] as string[],
  itemsPerPage: 10,
  // New adjustable parameter for total rows to generate
  totalRows: 50,
}

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {
    ...baseArgTypes,
    totalRows: {
      control: { type: "number" },
      description: "Total number of rows to generate for pagination",
      table: { defaultValue: { summary: "50" } },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof Table>

// Generate sample data with more realistic and varied content
const generateSampleData = (count: number) => {
  const companies = ["Acme Corp", "TechStart", "GlobalSys", "DataFlow", "CloudNet", "InnoTech", "SmartSolutions"]
  const domains = ["example.com", "tech.co", "data.io", "cloud.net", "smart.org", "inno.com"]
  const departments = ["Engineering", "Sales", "Marketing", "Support", "Operations", "HR", "Finance"]
  const statuses = [
    { variant: "success", label: "Active" },
    { variant: "warning", label: "Pending" },
    { variant: "error", label: "Inactive" },
  ]

  return Array.from({ length: count }, (_, index) => {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const department = departments[Math.floor(Math.random() * departments.length)]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const randomNumber = Math.floor(Math.random() * 10000)
    
    // Generate a random date within the past 2 years
    const dateOffset = Math.floor(Math.random() * 730) // 2 years in days
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - dateOffset)
    
    // Create a more descriptive name using company and department
    const itemName = `${company} - ${department} Project ${index + 1}`
    
    return {
      id: `${index + 1}`,
      name: itemName,
      date: randomDate.toLocaleDateString(),
      number: randomNumber,
      email: `project${index + 1}@${domain}`,
      status: <TableStatus variant={randomStatus.variant as any} label={randomStatus.label} />,
    }
  })
}

// Update the columns to have more descriptive labels
const columns = [
  { id: "name", key: "name", label: "Project Name", sortable: true },
  { id: "date", key: "date", label: "Creation Date", sortable: true },
  { id: "number", key: "number", label: "Budget ($)", sortable: true },
  { id: "email", key: "email", label: "Contact Email", sortable: true },
  { id: "status", key: "status", label: "Project Status", sortable: false },
]

type TableRow = {
  id: string
  name: string
  date: string
  number: number
  email: string
  status: React.ReactNode
}

// Interactive wrapper component for the stories
const InteractiveTable = (args: any) => {
  // Destructure totalRows so it's not passed to the Table component
  const { totalRows, ...tableArgs } = args
  // Generate dynamic data based on totalRows parameter
  const generatedData = generateSampleData(totalRows || 50)
  const [selectedRows, setSelectedRows] = useState<string[]>(tableArgs.selectedRows || [])
  const [sortedData, setSortedData] = useState(generatedData)
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? generatedData.map((row) => row.id) : [])
  }

  const handleRowSelect = (rowId: string, checked: boolean) => {
    setSelectedRows((prev) => (checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)))
  }

  const handleSort = (columnId: string) => {
    const key = columnId as keyof TableRow
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      if (aValue === bValue) return 0

      if (key === "number") {
        return direction === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
      }

      if (key === "date") {
        return direction === "asc"
          ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
          : new Date(bValue as string).getTime() - new Date(aValue as string).getTime()
      }

      return direction === "asc"
        ? (aValue as string) < (bValue as string)
          ? -1
          : 1
        : (aValue as string) > (bValue as string)
        ? -1
        : 1
    })

    setSortedData(sorted)
    setSortConfig({ key, direction })
  }

  // Calculate the slice of data for the current page
  const startIndex = (currentPage - 1) * tableArgs.itemsPerPage
  const endIndex = startIndex + tableArgs.itemsPerPage
  const displayedData = sortedData.slice(startIndex, endIndex)

  return (
    <>
      <Table
        {...tableArgs} // Spread only the valid props
        data={displayedData}
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onRowSelect={handleRowSelect}
        onSort={handleSort}
      />
      <Pagination
        totalItems={sortedData.length}
        itemsPerPage={tableArgs.itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        className="mt-4"
      />
    </>
  )
}

export const WithPagination: Story = {
  render: (args) => <InteractiveTable {...args} />,
  args: {
    ...baseArgs,
    columns,
    totalRows: 100, // Increased to 100 rows
    itemsPerPage: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "A paginated table showing 100 projects with 10 items per page. Features include sorting by columns, row selection, and status indicators. The data includes project names, creation dates, budgets, contact emails, and status.",
      },
    },
  },
}

export const LargePaginatedDataset: Story = {
  render: (args) => <InteractiveTable {...args} />,
  args: {
    ...baseArgs,
    columns,
    totalRows: 200, // Increased to 200 rows
    itemsPerPage: 15,
  },
  parameters: {
    docs: {
      description: {
        story: "A large dataset with 200 projects displayed across multiple pages, showing 15 items per page. Perfect for testing pagination with a substantial amount of data. Includes full sorting and selection capabilities.",
      },
    },
  },
}
