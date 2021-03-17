import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SignUpConfirmation from './SignUpConfirmation';
import { executeWithStatusMessage } from '../utils/status-executor';
import './Loyalty.css';

function SignUp() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [name, setName] = useState(query.get('name') ?? '');
  const [email, setEmail] = useState(query.get('email') ?? '');
  const [terms, setTerms] = useState(false);
  const [jwt, setJwt] = useState();
  const [statusMessage, setStatuMessage] = useState();

  async function submitHandler(event) {
    event.preventDefault();

    const [status] = await executeWithStatusMessage(async () => {
      // Step 1: call our API to create a loyaltyObject
      const result = await fetch('/api/loyalty/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const details = await result.json();

      // Step 3: redirect users to google pay if in redirect mode
      if (query.get('mode') === 'redirect') {
        window.location.href = `https://pay.google.com/gp/v/save/${details.token}`;
        return;
      }

      // Step 2: set JWT based on API response
      setJwt(details.token);
    });

    setStatuMessage(status);
  }

  return (
    <div className="Loyalty">
      {jwt ? (
        <SignUpConfirmation jwt={jwt} />
      ) : (
        <section>
          <h1>Sign Up Form</h1>
          {statusMessage}
          <form onSubmit={submitHandler}>
            <fieldset>
              <label className="field">
                <span className="label">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Enter name..."
                />
              </label>
              <label className="field">
                <span className="label">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter email address..."
                />
              </label>
              <label className="checkbox">
                <input type="checkbox" checked={terms} onChange={event => setTerms(event.target.checked)} />
                <div className="text">
                  <p>I agree to the following terms:</p>
                  <p>This site is used for demonstration purposes only and is not a real loyalty program.</p>
                  <p>
                    The name and email address provided above will not be shared with any third parties. You are welcome
                    to use a fake name and email address for the purpose of this demonstration.
                  </p>
                </div>
              </label>
              <div className="buttons">
                <button className="button-primary" disabled={!terms}>
                  Sign up
                </button>
              </div>
            </fieldset>
          </form>
        </section>
      )}
    </div>
  );
}

export default SignUp;
