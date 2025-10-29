import { createFileRoute } from "@tanstack/react-router"

import OrganizationsPage from "@/components/Organizations/OrganizationsPage"

export const Route = createFileRoute("/_layout/organizations")({
  component: OrganizationsPage,
})