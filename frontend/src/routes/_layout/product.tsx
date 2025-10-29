import { createFileRoute } from "@tanstack/react-router"

import PostSalesWizard from "@/components/PostSales/PostSalesWizard"

export const Route = createFileRoute("/_layout/product")({
  component: PostSalesWizard,
})