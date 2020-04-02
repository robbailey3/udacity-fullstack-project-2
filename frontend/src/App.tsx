import * as React from 'react';
import FormView from './components/FormView';
import Header from './components/Header';
import QuestionView from './components/QuestionView';
import QuizView from './components/QuizView';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './stylesheets/App.scss';

// import logo from './logo.svg';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
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
  }
}
