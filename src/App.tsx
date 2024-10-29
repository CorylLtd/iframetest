import './App.css';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from './auth/authConfig';

function App() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: 'create',
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  };
  return (
    <div className='App'>
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
