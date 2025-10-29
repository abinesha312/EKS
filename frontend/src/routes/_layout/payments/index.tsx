import { Container, Heading, VStack, Tabs } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

import { StripeProvider } from "../../../components/Payments/StripeProvider";
import { PaymentForm } from "../../../components/Payments/PaymentForm";
import { TransactionHistory } from "../../../components/Payments/TransactionHistory";
import { CheckoutPage } from "../../../components/Payments/CheckoutPage";
import { ProCheckoutPage } from "../../../components/Payments/ProCheckoutPage";

export const Route = createFileRoute("/_layout/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log("Payment successful:", paymentIntentId);
    // You can add any post-payment logic here
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    // You can add error handling logic here
  };

  return (
    <Container maxW="7xl" py={6}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">Payment Portal</Heading>
        
        <Tabs.Root variant="enclosed" colorPalette="red" defaultValue="pro-checkout">
          <Tabs.List>
            <Tabs.Trigger value="pro-checkout">Pro Checkout</Tabs.Trigger>
            <Tabs.Trigger value="checkout">E-commerce Checkout</Tabs.Trigger>
            <Tabs.Trigger value="payment">Simple Payment</Tabs.Trigger>
            <Tabs.Trigger value="history">Transaction History</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.ContentGroup>
            <Tabs.Content value="pro-checkout" px={0}>
              <StripeProvider>
                <ProCheckoutPage
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  orderTotal={49.99}
                  orderDescription="Premium Service Package"
                />
              </StripeProvider>
            </Tabs.Content>
            
            <Tabs.Content value="checkout" px={0}>
              <StripeProvider>
                <CheckoutPage
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  orderItems={[
                    { 
                      id: "1", 
                      name: "Premium Service", 
                      description: "Monthly subscription with advanced features", 
                      price: 29.99, 
                      quantity: 1 
                    },
                    { 
                      id: "2", 
                      name: "Setup Fee", 
                      description: "One-time setup and configuration", 
                      price: 10.00, 
                      quantity: 1 
                    }
                  ]}
                />
              </StripeProvider>
            </Tabs.Content>
            
            <Tabs.Content value="payment" px={0}>
              <StripeProvider>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  defaultAmount={25.00}
                  defaultDescription="Service Payment"
                />
              </StripeProvider>
            </Tabs.Content>
            
            <Tabs.Content value="history" px={0}>
              <TransactionHistory limit={20} />
            </Tabs.Content>
          </Tabs.ContentGroup>
        </Tabs.Root>
      </VStack>
    </Container>
  );
} 