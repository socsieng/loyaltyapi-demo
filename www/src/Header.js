import { Link } from 'react-router-dom';
import './App.css';

function Header() {
  return (
    <header className="Header">
      <img src="/images/logo.svg" className="logo" alt="logo" />
      <Link className="home" to="/">
        Google Pay Loyalty API Demo
      </Link>
    </header>
  );
}

export default Header;
