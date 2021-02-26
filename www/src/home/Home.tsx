import './Home.css';

function Home() {
  return (
    <div className="Home">
      <img src="/images/logo.svg" className="logo" alt="logo" />
      <h1>Google Pay Loyalty API Demo</h1>
      <section className="content">
        <p>
          This ample site is used to demonstrate how to integrate with the Google Pay Loyalty Enrollment and Sign-In
          APIs with NodeJS and Firebase functions.
        </p>
      </section>
    </div>
  );
}

export default Home;
