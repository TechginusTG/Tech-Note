'use client';

import { ReduxProvider } from "./store/provider";
import { AuthProvider } from "./auth-provider";
import I18nProvider from "./i18n-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SessionProvider>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
