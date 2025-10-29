
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Text,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { PaymentsService } from "../../client";

interface TransactionHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export function TransactionHistory({ 
  limit = 50, 
  showFilters: _showFilters = true 
}: TransactionHistoryProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transactions", limit],
    queryFn: () => PaymentsService.getUserPayments({ 
      skip: 0, 
      limit 
    }),
  });

  if (isLoading) {
    return (
      <Box p={4}>
        <Spinner />
        <Text>Loading transactions...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Error loading transactions</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold">Transaction History</Text>
      <Text>Found {data?.data?.length || 0} transactions</Text>
      <Button onClick={() => refetch()}>Refresh</Button>
      
      {data?.data?.map((transaction: any) => (
        <Box key={transaction.id} p={3} border="1px" borderColor="gray.200" mt={2}>
          <Text>Description: {transaction.description || "No description"}</Text>
          <Text>Amount: ${transaction.amount}</Text>
          <Text>Status: {transaction.status}</Text>
        </Box>
      ))}
    </Box>
  );
} 