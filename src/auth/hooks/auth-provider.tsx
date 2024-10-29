import {
  AuthenticationResult,
  EventType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import { PropsWithChildren } from 'react';
import { MsalProvider } from '@azure/msal-react';

export default function AuthProvider({ children }: PropsWithChildren) {
  const msalInstance = new PublicClientApplication(msalConfig);

  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  msalInstance.addEventCallback((event) => {
    const authenticationResult = event.payload as AuthenticationResult;
    const account = authenticationResult?.account;
    if (event.eventType === EventType.LOGIN_SUCCESS && account) {
      msalInstance.setActiveAccount(account);
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
