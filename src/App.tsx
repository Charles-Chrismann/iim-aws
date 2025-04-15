import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

type Props = {
  signOut?: () => void;
  user?: any;
};

function App({ signOut, user }: Props) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Bienvenue, {user?.username} 👋</h1>
      <p>Tu es connecté via AWS Cognito ✅</p>
      <button
        onClick={signOut}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          background: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default withAuthenticator(App);
