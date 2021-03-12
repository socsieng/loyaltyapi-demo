import { useState } from 'react';
import { executeWithStatusMessage } from '../utils/status-executor';
import './Loyalty.css';

function Rewards() {
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState(0);
  const [statusMessage, setStatuMessage] = useState();
  const statusMessageOptions = {
    success: result => (
      <p>
        Points successfully updated. View{' '}
        <a href={`https://pay.google.com/gp/v/object/${result.id}`} target="_blank" rel="noreferrer">
          loyalty pass
        </a>
        .
      </p>
    ),
  };

  async function submitHandler(event) {
    event.preventDefault();

    const [status] = await executeWithStatusMessage(async () => {
      const result = await fetch(`/api/loyalty/${encodeURIComponent(email)}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points,
        }),
      });

      return await result.json();
    }, statusMessageOptions);

    setStatuMessage(status);
  }

  return (
    <div className="Loyalty">
      <section>
        <h1>Update rewards points</h1>
        {statusMessage}
        <p>
          This page is used to update rewards points on a loyalty pass. This is used for demonstration purposes only.
          Under normal circumstances, an update to your customers' loyalty points would be triggered by either your
          point of sales terminal or your back-end services.
        </p>
        <form onSubmit={submitHandler}>
          <fieldset>
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
            <label className="field">
              <span className="label">Points</span>
              <input type="number" value={points} onChange={event => setPoints(event.target.value)} required />
            </label>
            <div className="buttons">
              <button className="button-primary">Update</button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default Rewards;
