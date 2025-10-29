import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  VStack,
  Text,
  NumberInput,
  Textarea,
  Card,
  Heading,
} from "@chakra-ui/react";

import { PaymentsService } from "../../client";
import { useStripeConfig } from "./StripeProvider";

interface PaymentFormProps {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  defaultAmount?: number;
  defaultDescription?: string;
}

// Payment form content that uses Stripe hooks
function PaymentFormContent({
  onSuccess,
  onError,
  amount,
  description,
  paymentIntentId,
  onBack,
}: {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  amount: number;
  description: string;
  paymentIntentId: string;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  
  // Suppress unused parameter warning
  void onError;
  
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
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
      } else if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
        onSuccess?.(paymentIntentId);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <VStack gap={4} align="stretch">
        <Box textAlign="center" py={8}>
          <Text fontSize="xl" fontWeight="bold" color="green.600" mb={2}>
            Payment Successful! 🎉
          </Text>
          <Text color="gray.600">
            Your payment of ${amount.toFixed(2)} has been processed successfully.
          </Text>
        </Box>
        <Button onClick={onBack}>Make Another Payment</Button>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
          <Text fontWeight="medium" mb={2}>
            Payment Amount: ${amount.toFixed(2)} USD
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            {description}
          </Text>
          
          <PaymentElement 
            options={{
              layout: "tabs",
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
        >
          Pay ${amount.toFixed(2)}
        </Button>

        <Button variant="outline" onClick={onBack}>
          Change Amount
        </Button>
      </VStack>
    </form>
  );
}

export function PaymentForm({
  onSuccess,
  onError,
  defaultAmount = 10.00,
  defaultDescription = "Payment",
}: PaymentFormProps) {
  const { stripe } = useStripeConfig();
    // const queryClient = useQueryClient();
  
  const [amount, setAmount] = useState(defaultAmount);
  const [description, setDescription] = useState(defaultDescription);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    createPaymentIntentMutation.mutate({
      amount: amount,
      currency: "usd",
      description: description || "Payment",
    });
  };

  const handleBack = () => {
    setClientSecret("");
    setPaymentIntentId("");
    setError("");
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack gap={6} align="stretch">
          <Heading size="lg">Make a Payment</Heading>
          
          {!clientSecret ? (
            // Payment setup form
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" mb={1}>Amount (USD)</Text>
                <NumberInput.Root
                  value={amount.toString()}
                  onValueChange={(details) => setAmount(parseFloat(details.value) || 0)}
                  min={0.50}
                  max={999999}
                >
                  <NumberInput.Input placeholder="0.00" />
                  <NumberInput.Control>
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                  </NumberInput.Control>
                </NumberInput.Root>
              </Box>

              <Box>
                <Text fontSize="sm" mb={1}>Description (optional)</Text>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this payment for?"
                  rows={3}
                />
              </Box>

              {error && (
                <Box p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                  <Text color="red.600" fontSize="sm">{error}</Text>
                </Box>
              )}

              <Button
                onClick={handleCreatePaymentIntent}
                loading={createPaymentIntentMutation.isPending}
                loadingText="Creating..."
                colorScheme="red"
                size="lg"
              >
                Create Payment
              </Button>
            </VStack>
          ) : (
            // Payment form with Stripe Elements
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
              <PaymentFormContent
                onSuccess={onSuccess}
                onError={onError}
                amount={amount}
                description={description}
                paymentIntentId={paymentIntentId}
                onBack={handleBack}
              />
            </Elements>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
} 