import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ProfilePictureForm } from './components/ProfilePictureForm';
import { AddressForm } from './components/AddressForm';
import { UserAddresses } from './components/UserAddresses';
import { UserData } from './components/userData';
import { post } from '@aws-amplify/api';

Amplify.configure(amplifyconfig);

type Props = {
  signOut?: () => void;
  user?: {
    signInDetails: {
      authFlowType: string;
      loginId: string;
    };
    userId: string;
    username: string;
  };
};

function App({ signOut, user }: Props) {
  const [userFromDynamoDB, setUserFromDynamoDB] = useState<any | null>(null);
  const [refreshAddresses, setRefreshAddresses] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const operation = post({
          apiName: "users", // must match aws-exports.js
          path: "/getUser",
          options: { body: { id: user!.userId } },
        });
        const apiResponse = await operation.response;
        const data = await apiResponse.body.json()
        console.log(data)
        setUserFromDynamoDB(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user?.userId]);

  return (
    <div>

      {(user && userFromDynamoDB) && (
        <>
          <div
            style={{
              maxWidth: "768px",
              display: "flex",
              margin: "1rem auto",
              gap: ".5rem"
            }}
          >
            <ProfilePictureForm user={userFromDynamoDB} setUser={setUserFromDynamoDB} />
            <UserData
              userId={user.userId}
              user={userFromDynamoDB}
              error={error}
              loading={loading}
            />
          </div>
          <AddressForm
            userId={user.userId}
            onSuccess={() => setRefreshAddresses((prev) => !prev)}
          />
          <UserAddresses
            userId={user.userId}
            refreshSignal={refreshAddresses}
          />

          <div className='w-full grid place-items-center'>
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
        </>
      )}
    </div>
  );
}

export default withAuthenticator(App);

