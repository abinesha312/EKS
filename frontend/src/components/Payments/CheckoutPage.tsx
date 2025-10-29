import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Card,
  Heading,
  Grid,
  GridItem,
  Separator,
  Container,
} from "@chakra-ui/react";
import { FiShield, FiLock, FiCreditCard, FiCheck } from "react-icons/fi";
import { PaymentsService } from "../../client";
import { useStripeConfig } from "./StripeProvider";

interface CheckoutPageProps {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  orderItems?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
  }>;
}

// Component that uses Stripe hooks - only rendered when wrapped in Elements
function CheckoutFormContent({
  onSuccess,
  onError,
  paymentIntentId,
  total,
  billingDetails,
  setBillingDetails,
}: {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  paymentIntentId: string;
  total: number;
  billingDetails: any;
  setBillingDetails: (details: any) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  // const queryClient = useQueryClient();
  
  // Suppress unused parameter warnings
  void onError;
  void setBillingDetails;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              address: {
                line1: billingDetails.address,
                city: billingDetails.city,
                postal_code: billingDetails.postal_code,
                country: billingDetails.country,
              }
            }
          }
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
      } else if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
        onSuccess?.(paymentIntentId);
        // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Container maxW="4xl" py={8}>
        <Card.Root>
          <Card.Body p={8} textAlign="center">
            <FiCheck 
              color="var(--chakra-colors-green-500)" 
              style={{ 
                width: "64px", 
                height: "64px", 
                marginBottom: "16px", 
                marginLeft: "auto", 
                marginRight: "auto", 
                display: "block" 
              }} 
            />
            <Heading size="lg" mb={4}>Payment Successful!</Heading>
            <Text color="gray.600" mb={6}>
              Thank you for your purchase. You'll receive a confirmation email shortly.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Payment ID: {paymentIntentId}
            </Text>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4}>
        <Box w="full" p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <PaymentElement 
            options={{
              layout: "tabs",
              defaultValues: {
                billingDetails: {
                  name: billingDetails.name,
                  email: billingDetails.email,
                  address: {
                    line1: billingDetails.address,
                    city: billingDetails.city,
                    postal_code: billingDetails.postal_code,
                    country: billingDetails.country,
                  }
                }
              }
            }}
          />
        </Box>

        {error && (
          <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
            <Text color="red.600" fontSize="sm">{error}</Text>
          </Box>
        )}

        <Button
          type="submit"
          loading={isProcessing}
          loadingText="Processing..."
          disabled={!stripe || !elements}
          colorScheme="green"
          size="lg"
          w="full"
        >
          Complete Payment ${total.toFixed(2)}
        </Button>
      </VStack>
    </form>
  );
}

export function CheckoutPage({
  onSuccess,
  onError,
  orderItems = [
    { id: "1", name: "Premium Service", description: "Monthly subscription", price: 29.99, quantity: 1 }
  ]
}: CheckoutPageProps) {
  const { stripe } = useStripeConfig();
  // const queryClient = useQueryClient();

  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    country: "US"
  });

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: (request: { amount: number; currency: string; description: string }) =>
      PaymentsService.createPaymentIntent({ requestBody: request }),
    onSuccess: (data: any) => {
      setClientSecret(data.client_secret);
      setPaymentIntentId(data.payment_intent_id);
      setError("");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || "Failed to create payment intent";
      setError(errorMessage);
      onError?.(errorMessage);
    },
  });

  const handleCreatePaymentIntent = () => {
    createPaymentIntentMutation.mutate({
      amount: total,
      currency: "usd",
      description: `Order: ${orderItems.map(item => item.name).join(", ")}`,
    });
  };

  return (
    <Container maxW="7xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
        {/* Order Summary */}
        <GridItem>
          <Card.Root>
            <Card.Header>
              <Heading size="lg">Order Summary</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap={4} align="stretch">
                {/* Order Items */}
                {orderItems.map((item) => (
                  <HStack key={item.id} justify="space-between" p={4} bg="gray.50" borderRadius="md">
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium">{item.name}</Text>
                      {item.description && (
                        <Text fontSize="sm" color="gray.600">{item.description}</Text>
                      )}
                    </VStack>
                    <VStack align="end" gap={1}>
                      <Text fontWeight="medium">${item.price.toFixed(2)}</Text>
                      <Text fontSize="sm" color="gray.600">Qty: {item.quantity}</Text>
                    </VStack>
                  </HStack>
                ))}

                <Separator />

                {/* Totals */}
                <HStack justify="space-between">
                  <Text>Subtotal:</Text>
                  <Text>${subtotal.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Tax (8%):</Text>
                  <Text>${tax.toFixed(2)}</Text>
                </HStack>
                <Separator />
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">Total:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    ${total.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Payment Method */}
        <GridItem>
          <Card.Root>
            <Card.Header>
              <HStack>
                <FiCreditCard />
                <Heading size="md">Payment Method</Heading>
              </HStack>
            </Card.Header>
            <Card.Body>
              {!clientSecret ? (
                <VStack gap={4}>
                  <Text color="gray.600" textAlign="center">
                    Click "Review Order" to proceed with payment
                  </Text>
                  
                  {error && (
                    <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                      <Text color="red.600" fontSize="sm">{error}</Text>
                    </Box>
                  )}
                  
                  <Button
                    onClick={handleCreatePaymentIntent}
                    loading={createPaymentIntentMutation.isPending}
                    loadingText="Preparing..."
                    colorScheme="red"
                    size="lg"
                    w="full"
                  >
                    Review Order
                  </Button>
                </VStack>
              ) : (
                <Elements 
                  stripe={stripe} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#0570de",
                        colorBackground: "#ffffff",
                        colorText: "#30313d",
                        colorDanger: "#df1b41",
                        fontFamily: "Ideal Sans, system-ui, sans-serif",
                        spacingUnit: "2px",
                        borderRadius: "4px",
                      },
                    },
                  }}
                >
                  <CheckoutFormContent
                    onSuccess={onSuccess}
                    onError={onError}
                    paymentIntentId={paymentIntentId}
                    total={total}
                    billingDetails={billingDetails}
                    setBillingDetails={setBillingDetails}
                  />
                </Elements>
              )}
            </Card.Body>
          </Card.Root>

          {/* Security Notice */}
          <Card.Root mt={6}>
            <Card.Body>
              <VStack gap={3}>
                <HStack>
                  <FiShield color="var(--chakra-colors-green-500)" />
                  <Text fontWeight="medium">Secure Payment</Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                </Text>
                <HStack gap={4} color="gray.400">
                  <FiLock />
                  <Text fontSize="xs">256-bit SSL Encrypted</Text>
                </HStack>
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>
    </Container>
  );
} 