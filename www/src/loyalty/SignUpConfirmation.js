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

import './Loyalty.css';

function SignUpConfirmation({ jwt }) {
  return (
    <div className="Loyalty">
      <section>
        <h1>Confirmation</h1>
        <p>This confirmation screen is for demonstration purposes only.</p>
        <p>
          The recommendation is to send the user a confirmation email with a link to Save to Google Pay. The advantage
          of sending an email is that it also be used to verify the user's email address.
        </p>

        {/* Step 1: add save to google pay link */}
      </section>
    </div>
  );
}

export default SignUpConfirmation;
