import { handlers } from "@shared/lib/mocks";
import { setupWorker } from "msw/browser";
import React, { useEffect, useState } from "react";

const worker = setupWorker(...handlers);

interface MSWProviderProps {
  children: React.ReactNode;
}

export const MSWProvider: React.FC<MSWProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      if (import.meta.env.DEV) {
        try {
          console.log("Starting MSW worker...");
          await worker.start({
            onUnhandledRequest: "bypass",
          });
          console.log("MSW worker started successfully");
        } catch (error) {
          console.error("Failed to start MSW worker:", error);
        }
      }
      setIsReady(true);
    };

    initMSW();

    // No cleanup function to prevent redundant stop calls
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
