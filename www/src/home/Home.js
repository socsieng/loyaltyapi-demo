import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="Home">
      <img src="/images/logo.svg" className="logo" alt="logo" />
      <h1>Google Pay Loyalty API Demo</h1>
      <section className="content">
        <p>
          This ample site is used to demonstrate how to integrate with the Google Pay Loyalty APIs to save a loyalty
          pass to Google Pay. This site will also handle Enrollment and Sign in request for a seamless sign up
          experience when triggered from Google surfaces like Google Pay.
        </p>
        <p>This site is built using React, Node.js, and uses Firebase Functions for hosting APIs.</p>
        <p>Visit the loyalty pages:</p>
        <ul>
          <li>
            <Link to="/sign-up">Loyalty sign-up</Link>
          </li>
          <li>
            <Link to="/sign-in">Loyalty sign-in</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
