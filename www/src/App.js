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

import { Route, Switch, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Home from './home/Home';
import Rewards from './loyalty/Rewards';
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
        <Route exact path="/rewards">
          <Rewards />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
