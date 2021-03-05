import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Loyalty.css';
import SaveToGooglePayButton from './SaveToGooglePayButton';

function SignUp() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [name, setName] = useState(query.get('name') ?? '');
  const [email, setEmail] = useState(query.get('email') ?? '');
  const [terms, setTerms] = useState(false);
  const [jwt, setJwt] = useState();
  const shouldRedirect = query.get('source') === 'discoverable';

  async function submitHandler(event) {
    event.preventDefault();
    const result = await fetch('/api/loyalty/jwt', {
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

    if (shouldRedirect) {
      window.location.href = `https://pay.google.com/gp/v/save/${details.token}`;
    } else {
      setJwt(details.token);
    }
  }

  return (
    <div className="Loyalty">
      {jwt ? (
        <section>
          <h1>Confirmation</h1>
          <p>
            This confirmation screen is for demonstration purposes only. The recommendation is to send the user a
            confirmation email with a link to Save to Google Pay. One additional benefit of doing this is that the
            user's email address can also be verified.
          </p>
          <SaveToGooglePayButton jwt={jwt} />
          <p>
            In the confirmation email, include the{' '}
            <a href={`https://pay.google.com/gp/v/save/${jwt}`} target="_blank" rel="noreferrer">
              Save to Google Pay
            </a>{' '}
            link instead of the Save to Google Pay button.
          </p>
        </section>
      ) : (
        <section>
          <h1>Sign Up Form</h1>
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
