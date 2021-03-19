/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { executeWithStatusMessage } from '../utils/status-executor';
import './Loyalty.css';

function SignIn() {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [name, setName] = useState(query.get('name') ?? '');
  const [email, setEmail] = useState(query.get('email') ?? '');
  const [statusMessage, setStatuMessage] = useState();

  async function submitHandler(event) {
    event.preventDefault();

    const [status] = await executeWithStatusMessage(async () => {
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

      window.location.href = `https://pay.google.com/gp/v/save/${details.token}`;
    });

    setStatuMessage(status);
  }

  return (
    <div className="Loyalty">
      <section>
        <h1>Sign In</h1>
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
            <div className="buttons">
              <button className="button-primary">Sign in</button>
            </div>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default SignIn;
