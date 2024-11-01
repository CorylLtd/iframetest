import './App.css';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from './auth/authConfig';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Xrm: any;
  }
}

function App() {
  const [isInIframe, setIsInIframe] = useState(false);
  const isInDynamics = typeof window.Xrm !== 'undefined';

  if (isInDynamics) {
    console.log('In Dynamics');

    // For example, get the current form's context
    const context = window.Xrm.Page;

    // Access form data
    const entityId = context.data.entity.getId();
    const entityName = context.data.entity.getEntityName();

    console.log('Entity ID:', entityId);
    console.log('Entity Name:', entityName);
  } else {
    console.log('Not in Dynamics');
    console.dir(window);
  }

  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    if (isInIframe) {
      instance
        .loginPopup({
          ...loginRequest,
          prompt: 'create',
        })
        .catch((error) => console.log(error));
    } else {
      instance
        .loginRedirect({
          ...loginRequest,
          prompt: 'create',
        })
        .catch((error) => console.log(error));
    }
  };

  const handleLogout = () => {
    if (isInIframe) {
      instance.logoutPopup().catch((error) => console.log(error));
    } else {
      instance.logoutRedirect().catch((error) => console.log(error));
    }
  };
  return (
    <div className='App'>
      <div>
        {isInIframe ? (
          <p>The app is running inside an iframe.</p>
        ) : (
          <p>The app is running outside an iframe.</p>
        )}
      </div>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <p>you are authenticated, {activeAccount.name}</p>
        ) : null}
        <button onClick={handleLogout}>Logout</button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleRedirect}>Sign in</button>
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
