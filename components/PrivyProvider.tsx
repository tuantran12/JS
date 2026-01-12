"use client";

import { PrivyProvider as PrivyProviderSDK } from "@privy-io/react-auth";
import { ReactNode } from "react";

export function PrivyProvider({ children }: { children: ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!privyAppId) {
    console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set");
    return <>{children}</>;
  }

  return (
    <PrivyProviderSDK
      appId={privyAppId}
      config={{
        // Appearance
        appearance: {
          theme: "dark",
          accentColor: "#FFFF02",
          logo: "https://app.senkai.xyz/logo.svg",
        },

        // Login methods - email, wallet, social
        loginMethods: ["email", "wallet"],

        // Embedded wallets with Solana support
        embeddedWallets: {
          solana: {
            createOnLogin: "users-without-wallets",
          },
        },

        // Legal links
        legal: {
          termsAndConditionsUrl: "https://app.senkai.xyz/terms",
          privacyPolicyUrl: "https://app.senkai.xyz/privacy",
        },
      }}
    >
      {children}
    </PrivyProviderSDK>
  );
}
