import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import HomePage from './Home';
import GamePage from './Game';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/game" component={GamePage} />
      </Switch>
    </Router>    
  );
}

export default App;
