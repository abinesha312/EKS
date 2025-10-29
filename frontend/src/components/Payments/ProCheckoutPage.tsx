import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Flex,
  Field,
  Heading,
  Input,
  Stack,
  VStack,
  HStack,
  Text,
  Card,
  Separator,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiShield, FiLock, FiTruck, FiCreditCard } from "react-icons/fi";
import { PaymentsService } from "../../client";

interface ProCheckoutPageProps {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  orderTotal?: number;
  orderDescription?: string;
}

function CheckoutForm({ 
  onSuccess, 
  onError, 
  orderTotal = 49.99, 
  orderDescription = "Premium Service Package" 
}: ProCheckoutPageProps) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [paymentIntentId, _setPaymentIntentId] = useState<string>("");
  
  // Suppress unused parameter warnings
  void onError;
  void orderDescription;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Payment system not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "An error occurred");
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/success`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess?.(paymentIntentId);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4}>
        <PaymentElement />
        
        {error && (
          <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
            <Text color="red.600" fontSize="sm">{error}</Text>
          </Box>
        )}
        
        <Button 
          type="submit" 
          colorScheme="red" 
          size="lg"
          w="full" 
          loading={isProcessing}
          loadingText="Processing..."
          disabled={!stripe}
        >
          Complete Payment ${orderTotal.toFixed(2)}
        </Button>
      </VStack>
    </form>
  );
}

export function ProCheckoutPage({ 
  onSuccess,
  onError,
  orderTotal = 49.99,
  orderDescription = "Premium Service Package"
}: ProCheckoutPageProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "US",
    phone: ""
  });

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: (request: any) =>
      PaymentsService.createPaymentIntent({ requestBody: request }),
    onSuccess: (data) => {
      setClientSecret(data.client_secret);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Failed to create payment intent";
      onError?.(errorMessage);
    },
  });

  const handleCreatePayment = () => {
    createPaymentIntentMutation.mutate({
      amount: orderTotal,
      currency: "usd",
      description: orderDescription,
    });
  };

  return (
    <Container maxW="container.lg" py={10}>
      <VStack gap={8}>
        <Box textAlign="center">
          <Heading mb={2}>Secure Checkout</Heading>
          <Text color="gray.600">Complete your order with confidence</Text>
        </Box>

        <Grid 
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
          gap={8}
          w="full"
          alignItems="start"
        >
          
          {/* Delivery Information */}
          <GridItem>
            <Card.Root>
              <Card.Header>
                <HStack>
                  <FiTruck color="var(--chakra-colors-blue-500)" />
                  <Heading size="md">Delivery Information</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <Field.Root required>
                      <Field.Label>Full Name</Field.Label>
                      <Input 
                        placeholder="John Doe"
                        value={deliveryInfo.name}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>Phone Number</Field.Label>
                      <Input 
                        placeholder="+1 (555) 123-4567"
                        value={deliveryInfo.phone}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                      />
                    </Field.Root>
                  </Grid>
                  
                  <Field.Root required>
                    <Field.Label>Email Address</Field.Label>
                    <Input 
                      type="email"
                      placeholder="you@email.com"
                      value={deliveryInfo.email}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                    />
                  </Field.Root>
                  
                  <Field.Root required>
                    <Field.Label>Delivery Address</Field.Label>
                    <Input 
                      placeholder="123 Main St, Apt 4B"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                    />
                  </Field.Root>
                  
                  <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
                    <Field.Root required>
                      <Field.Label>City</Field.Label>
                      <Input 
                        placeholder="New York"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>ZIP Code</Field.Label>
                      <Input 
                        placeholder="10001"
                        value={deliveryInfo.postalCode}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, postalCode: e.target.value})}
                      />
                    </Field.Root>
                  </Grid>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Order Summary */}
            <Card.Root mt={6}>
              <Card.Header>
                <Heading size="md">Order Summary</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  <Flex justify="space-between">
                    <Text>{orderDescription}</Text>
                    <Text fontWeight="medium">${orderTotal.toFixed(2)}</Text>
                  </Flex>
                  <Separator />
                  <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                    <Text>Total</Text>
                    <Text>${orderTotal.toFixed(2)}</Text>
                  </Flex>
                </VStack>
              </Card.Body>
            </Card.Root>
          </GridItem>

          {/* Payment Section */}
          <GridItem>
            <Card.Root>
              <Card.Header>
                <HStack>
                  <FiCreditCard color="var(--chakra-colors-green-500)" />
                  <Heading size="md">Payment Method</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                {clientSecret ? (
                  <CheckoutForm 
                    onSuccess={onSuccess}
                    onError={onError}
                    orderTotal={orderTotal}
                    orderDescription={orderDescription}
                  />
                ) : (
                  <VStack gap={4}>
                    <Text color="gray.600" textAlign="center" mb={4}>
                      Ready to complete your purchase of ${orderTotal.toFixed(2)}?
                    </Text>
                    <Button 
                      colorScheme="red" 
                      size="lg"
                      w="full" 
                      loading={createPaymentIntentMutation.isPending}
                      loadingText="Preparing Payment..."
                      onClick={handleCreatePayment}
                    >
                      Proceed to Payment
                    </Button>
                  </VStack>
                )}
              </Card.Body>
            </Card.Root>

            {/* Security Badges */}
            <VStack gap={3} mt={6} p={4} bg="gray.50" borderRadius="md">
              <HStack gap={4}>
                <HStack gap={2}>
                  <FiShield color="var(--chakra-colors-green-500)" style={{ width: "16px", height: "16px" }} />
                  <Text fontSize="sm" color="gray.600">SSL Secured</Text>
                </HStack>
                <HStack gap={2}>
                  <FiLock color="var(--chakra-colors-green-500)" style={{ width: "16px", height: "16px" }} />
                  <Text fontSize="sm" color="gray.600">256-bit Encryption</Text>
                </HStack>
              </HStack>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                Your payment information is processed securely. We do not store credit card details.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
} 