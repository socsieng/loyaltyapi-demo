import { Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './home/Home';
import SignIn from './loyalty/SignIn';
import SignUp from './loyalty/SignUp';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Header />}

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/sign-in">
          <SignIn />
        </Route>
        <Route exact path="/sign-up">
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
