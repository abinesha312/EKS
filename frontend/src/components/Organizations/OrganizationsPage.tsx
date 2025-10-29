import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Table,
  Avatar,
} from "@chakra-ui/react"
import { useState } from "react"
import { 
  FiSearch, 
  FiGrid, 
  FiCheckCircle, 
  FiCalendar, 
  FiUsers,
  FiMoreVertical,
  FiEye,
  FiEdit,
  FiXCircle
} from "react-icons/fi"

import { InputGroup } from "@/components/ui/input-group"
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu"

// Sample organization data
const organizationsData = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logo: "https://via.placeholder.com/40/blue/white?text=TC",
    industry: "Technology",
    status: "active",
    plan: "enterprise",
    employees: 250,
    modelsUsed: 12,
    monthlyUsage: 45600,
    subscribedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Healthcare Plus",
    logo: "https://via.placeholder.com/40/green/white?text=HP",
    industry: "Healthcare", 
    status: "active",
    plan: "professional",
    employees: 500,
    modelsUsed: 8,
    monthlyUsage: 23400,
    subscribedDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Finance First Bank",
    logo: "https://via.placeholder.com/40/red/white?text=FF",
    industry: "Finance",
    status: "trial",
    plan: "trial", 
    employees: 1200,
    modelsUsed: 3,
    monthlyUsage: 8900,
    subscribedDate: "2024-03-10",
  },
  {
    id: 4,
    name: "EduTech Institute",
    logo: "https://via.placeholder.com/40/orange/white?text=ET",
    industry: "Education",
    status: "active", 
    plan: "starter",
    employees: 75,
    modelsUsed: 5,
    monthlyUsage: 12300,
    subscribedDate: "2024-01-28",
  },
  {
    id: 5,
    name: "Retail Masters",
    logo: "https://via.placeholder.com/40/purple/white?text=RM",
    industry: "Retail",
    status: "inactive",
    plan: "professional",
    employees: 150,
    modelsUsed: 0,
    monthlyUsage: 0,
    subscribedDate: "2023-12-05",
  },
  {
    id: 6,
    name: "Manufacturing Co",
    logo: "https://via.placeholder.com/40/teal/white?text=MC",
    industry: "Manufacturing",
    status: "active",
    plan: "enterprise", 
    employees: 800,
    modelsUsed: 15,
    monthlyUsage: 67800,
    subscribedDate: "2024-02-14",
  },
]

function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrganizations, setFilteredOrganizations] = useState(organizationsData)

  // Filter organizations based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query) {
      setFilteredOrganizations(organizationsData)
    } else {
      const filtered = organizationsData.filter(org =>
        org.name.toLowerCase().includes(query.toLowerCase()) ||
        org.industry.toLowerCase().includes(query.toLowerCase()) ||
        org.plan.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredOrganizations(filtered)
    }
  }

  // Calculate statistics
  const totalOrganizations = organizationsData.length
  const activeOrganizations = organizationsData.filter(org => org.status === "active").length
  const trialOrganizations = organizationsData.filter(org => org.status === "trial").length
  const totalMonthlyUsage = organizationsData.reduce((sum, org) => sum + org.monthlyUsage, 0)

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { colorScheme: "green", icon: FiCheckCircle },
      inactive: { colorScheme: "gray", icon: FiXCircle },
      trial: { colorScheme: "yellow", icon: FiCalendar },
    }
    
    const config = configs[status as keyof typeof configs]
    return (
      <Badge colorScheme={config.colorScheme} variant="solid">
        <HStack gap={1}>
          <Box as={config.icon} boxSize={3} />
          <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </HStack>
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const configs = {
      enterprise: { colorScheme: "purple" as const, variant: "solid" as const },
      professional: { colorScheme: "blue" as const, variant: "solid" as const },
      starter: { colorScheme: "green" as const, variant: "solid" as const },
      trial: { variant: "outline" as const, colorScheme: "gray" as const },
    }
    
    const config = configs[plan as keyof typeof configs]
    return (
      <Badge colorScheme={config.colorScheme} variant={config.variant}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    )
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <VStack align="stretch" gap={8}>
      {/* Header */}
      <Box>
        <Heading size="xl" mb={2}>
          Organizations
        </Heading>
        <Text color="fg.muted">
          Manage and monitor your organization accounts and their usage
        </Text>
      </Box>

      {/* Statistics Cards */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        <GridItem>
          <Card.Root>
            <Card.Body p={6}>
              <HStack gap={4}>
                <Box as={FiGrid} boxSize={8} color="blue.500" />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {totalOrganizations}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Total Organizations
                  </Text>
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        <GridItem>
          <Card.Root>
            <Card.Body p={6}>
              <HStack gap={4}>
                <Box as={FiCheckCircle} boxSize={8} color="green.500" />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {activeOrganizations}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Active Organizations
                  </Text>
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        <GridItem>
          <Card.Root>
            <Card.Body p={6}>
              <HStack gap={4}>
                <Box as={FiCalendar} boxSize={8} color="yellow.500" />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {trialOrganizations}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Trial Organizations
                  </Text>
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        <GridItem>
          <Card.Root>
            <Card.Body p={6}>
              <HStack gap={4}>
                <Box as={FiUsers} boxSize={8} color="purple.500" />
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {formatNumber(totalMonthlyUsage)}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Monthly Usage
                  </Text>
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>

      {/* Search and Filter */}
      <Card.Root>
        <Card.Body p={6}>
          <Flex justify="space-between" align="center">
            <InputGroup maxW="400px" startElement={<FiSearch />}>
              <Input
                placeholder="Search by organization name, industry, or plan"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Organizations Table */}
      <Card.Root>
        <Card.Body p={6}>
          <Text fontWeight="bold" fontSize="lg" mb={4}>
            Organizations ({filteredOrganizations.length})
          </Text>
          
                    <Box overflowX="auto">
            <Table.Root size={{ base: "sm", md: "md" }}>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Organization</Table.ColumnHeader>
                  <Table.ColumnHeader>Industry</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader>Plan</Table.ColumnHeader>
                  <Table.ColumnHeader>Employees</Table.ColumnHeader>
                  <Table.ColumnHeader>Models Used</Table.ColumnHeader>
                  <Table.ColumnHeader>Monthly Usage</Table.ColumnHeader>
                  <Table.ColumnHeader>Subscribed Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Actions</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredOrganizations.map((org) => (
                  <Table.Row key={org.id}>
                    <Table.Cell>
                      <HStack gap={3}>
                        <Avatar.Root size="sm">
                          <Avatar.Image src={org.logo} />
                          <Avatar.Fallback>{org.name.split(' ').map(n => n[0]).join('')}</Avatar.Fallback>
                        </Avatar.Root>
                        <Text fontWeight="medium">{org.name}</Text>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell>{org.industry}</Table.Cell>
                    <Table.Cell>{getStatusBadge(org.status)}</Table.Cell>
                    <Table.Cell>{getPlanBadge(org.plan)}</Table.Cell>
                    <Table.Cell>{formatNumber(org.employees)}</Table.Cell>
                    <Table.Cell>{org.modelsUsed}</Table.Cell>
                    <Table.Cell>{formatNumber(org.monthlyUsage)}</Table.Cell>
                    <Table.Cell>{formatDate(org.subscribedDate)}</Table.Cell>
                    <Table.Cell>
                      <MenuRoot>
                        <MenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <FiMoreVertical />
                          </Button>
                        </MenuTrigger>
                        <MenuContent>
                          <MenuItem value="view" gap={2}>
                            <FiEye />
                            View Details
                          </MenuItem>
                          <MenuItem value="edit" gap={2}>
                            <FiEdit />
                            Edit Organization
                          </MenuItem>
                          <MenuItem value="remove" gap={2} color="red.500">
                            <FiXCircle />
                            Remove Access
                          </MenuItem>
                        </MenuContent>
                      </MenuRoot>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {filteredOrganizations.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="fg.muted">
                No organizations found matching your search criteria
              </Text>
            </Box>
          )}
        </Card.Body>
      </Card.Root>
    </VStack>
  )
}

export default OrganizationsPage