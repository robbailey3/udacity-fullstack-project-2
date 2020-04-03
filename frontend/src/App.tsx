import * as React from 'react';
import ReactNotification from 'react-notifications-component';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FormView from './components/FormView';
import Header from './components/Header';
import QuestionView from './components/QuestionView';
import QuizView from './components/QuizView';
import './stylesheets/App.scss';
// import logo from './logo.svg';
const App = () => {
  return (
    <div className="App">
      <ReactNotification />
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={QuestionView} />
          <Route path="/add" component={FormView} />
          <Route path="/play" component={QuizView} />
          <Route component={QuestionView} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
