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
        <a href={`https://pay.google.com/gp/v/save/${jwt}`} target="_blank" rel="noreferrer">
          Save to Google Pay
        </a>
      </section>
    </div>
  );
}

export default SignUpConfirmation;
