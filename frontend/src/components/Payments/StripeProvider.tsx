import { ReactNode, createContext, useContext } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { PaymentsService } from "../../client";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = (publishableKey: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface StripeContextType {
  stripe: Promise<Stripe | null> | null;
  publishableKey: string | null;
}

const StripeContext = createContext<StripeContextType | null>(null);

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const { data: stripeConfig, isLoading, error } = useQuery({
    queryKey: ["stripe-config"],
    queryFn: () => PaymentsService.getPaymentConfig(),
  });

  if (isLoading) {
    return <div>Loading payment system...</div>;
  }

  if (error || !stripeConfig?.publishable_key) {
    console.error("Failed to load Stripe configuration:", error);
    return <div>Payment system unavailable</div>;
  }

  const stripePromise = getStripe(stripeConfig.publishable_key);

  return (
    <StripeContext.Provider 
      value={{ 
        stripe: stripePromise, 
        publishableKey: stripeConfig.publishable_key 
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}

export function useStripeConfig() {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeConfig must be used within a StripeProvider');
  }
  return context;
} 