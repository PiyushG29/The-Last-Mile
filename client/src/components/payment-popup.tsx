import { useEffect, useRef, useState } from "react";
import { CreditCard, IndianRupee, Loader2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type StripeCardElement = {
  mount: (selector: string | HTMLElement) => void;
  unmount: () => void;
};

type StripeElements = {
  create: (type: "card", options?: Record<string, unknown>) => StripeCardElement;
};

type StripeInstance = {
  elements: () => StripeElements;
  confirmCardPayment: (
    clientSecret: string,
    options: { payment_method: { card: StripeCardElement } },
  ) => Promise<{ error?: { message?: string }; paymentIntent?: { status?: string } }>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeInstance;
  }
}

type PaymentPopupProps = {
  amount: number;
  onClose: () => void;
  onPaid: () => void;
};

function loadStripeScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Stripe) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://js.stripe.com/v3/"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Stripe.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Stripe."));
    document.head.appendChild(script);
  });
}

function useDemoPaymentMode() {
  return !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

export function PaymentPopup({ amount, onClose, onPaid }: PaymentPopupProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const stripeRef = useRef<StripeInstance | null>(null);
  const cardRef = useRef<StripeCardElement | null>(null);
  const cardMountId = "stripe-card-element";
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    let cancelled = false;

    async function initializePayment() {
      try {
        setError("");
        if (useDemoPaymentMode()) {
          setDemoMode(true);
          setIsReady(true);
          return;
        }

        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency: "inr",
          }),
        });

        const responseText = await response.text();
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok || !contentType.includes("application/json")) {
          setDemoMode(true);
          setIsReady(true);
          return;
        }

        const paymentIntent = JSON.parse(responseText);

        if (cancelled) return;

        if (paymentIntent.demo || !publishableKey) {
          setDemoMode(true);
          setIsReady(true);
          return;
        }

        await loadStripeScript();

        if (cancelled || !window.Stripe) return;

        const stripe = window.Stripe(publishableKey);
        const elements = stripe.elements();
        const card = elements.create("card", {
          style: {
            base: {
              color: "hsl(var(--foreground))",
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              "::placeholder": { color: "hsl(var(--muted-foreground))" },
            },
          },
        });

        const mountNode = document.getElementById(cardMountId);
        if (mountNode) {
          card.mount(mountNode);
        }

        stripeRef.current = stripe;
        cardRef.current = card;
        setClientSecret(paymentIntent.clientSecret);
        setIsReady(true);
      } catch (paymentError) {
        const message = paymentError instanceof Error ? paymentError.message : "Unable to initialize payment.";
        setError(message);
      }
    }

    initializePayment();

    return () => {
      cancelled = true;
      cardRef.current?.unmount();
    };
  }, [amount, publishableKey]);

  const handlePayment = async () => {
    if (demoMode) {
      onPaid();
      return;
    }

    if (!stripeRef.current || !cardRef.current || !clientSecret) {
      setError("Payment is not ready yet.");
      return;
    }

    setIsPaying(true);
    setError("");

    const result = await stripeRef.current.confirmCardPayment(clientSecret, {
      payment_method: { card: cardRef.current },
    });

    setIsPaying(false);

    if (result.error) {
      setError(result.error.message || "Payment failed.");
      return;
    }

    onPaid();
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-foreground/45 px-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border-primary/25 bg-gradient-card p-6 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Lock className="h-3.5 w-3.5" />
              Secure Stripe payment
            </div>
            <h2 className="font-display text-2xl font-bold">Complete payment</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pay before confirming your e-rickshaw ride.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-5 rounded-md border border-border/60 bg-background/55 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ride fare</span>
            <span className="flex items-center font-display text-2xl font-bold text-gradient-accent">
              <IndianRupee className="h-5 w-5" />
              {amount}
            </span>
          </div>
        </div>

        {demoMode ? (
          <div className="mb-5 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm text-muted-foreground">
            Stripe keys are not configured, so this local build is using demo payment mode.
          </div>
        ) : (
          <div className="mb-5 rounded-md border border-border/70 bg-background/70 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-primary" />
              Card details
            </div>
            <div id={cardMountId} className="min-h-8" />
          </div>
        )}

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground shadow-glow-primary hover:bg-primary/90"
          disabled={!isReady || isPaying}
          onClick={handlePayment}
        >
          {isPaying || !isReady ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {demoMode ? "Pay & confirm ride" : "Pay securely"}
        </Button>
      </Card>
    </div>
  );
}
