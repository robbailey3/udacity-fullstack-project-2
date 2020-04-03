import * as React from 'react';
import '../stylesheets/Question.scss';
import PropTypes from 'prop-types';

class Question extends React.Component {
  constructor(public props: any, public state: React.ComponentState) {
    super(props);
    this.state = {
      visibleAnswer: false
    };
    console.log(this);
  }

  public flipVisibility() {
    const { visibleAnswer } = this.props;
    this.setState({ visibleAnswer: !visibleAnswer });
  }

  public render() {
    const { question, answer, category, difficulty } = this.props;
    return (
      <div className="Question-holder">
        <div className="Question">{question}</div>
        <div className="Question-status">
          <img
            className="category"
            src={`public/${category.type}.svg`}
            alt={`${category.type}`}
          />
          <div className="difficulty">
            Difficulty:
            {difficulty}
          </div>
          <img
            src="public/delete.png"
            className="delete"
            onClick={() => this.props.questionAction('DELETE')}
          />
        </div>
        <div
          className="show-answer button"
          onClick={() => this.flipVisibility()}
        >
          {this.state.visibleAnswer ? 'Hide' : 'Show'} Answer
        </div>
        <div className="answer-holder">
          <span
            style={{
              visibility: this.state.visibleAnswer ? 'visible' : 'hidden'
            }}
          >
            Answer: {answer}
          </span>
        </div>
      </div>
    );
  }
}
export default Question;
