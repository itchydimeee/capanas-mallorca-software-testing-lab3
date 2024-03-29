import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PogsForm from './pogs';
import ReadPogs from './readPogs';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={PogsForm} />
        <Route path="/readPogs" component={ReadPogs} />
      </Switch>
    </Router>
  );
};

export default App;
