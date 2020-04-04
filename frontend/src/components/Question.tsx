import * as React from 'react';
import '../stylesheets/Question.scss';

class Question extends React.Component {
  constructor(public props: any, public state: React.ComponentState) {
    super(props);
    this.state = {
      visibleAnswer: false
    };
  }

  public flipVisibility() {
    const { visibleAnswer } = this.state;
    this.setState({ visibleAnswer: !visibleAnswer });
  }

  public render() {
    // Using some destructuring assignments
    const {
      question,
      answer,
      category,
      difficulty,
      questionAction
    } = this.props;

    const { visibleAnswer } = this.state;

    return (
      <div className="Question-holder">
        <div className="Question">{question}</div>
        <div className="Question-status">
          <img
            className="category"
            src={`public/${category.type}.svg`}
            alt={`${category.type}`}
          />
          <div className="difficulty">Difficulty: {difficulty}</div>
          <button onClick={() => questionAction('DELETE')} type="button">
            <img src="public/delete.png" className="delete" alt="bin icon" />
          </button>
        </div>
        <div
          className="show-answer button"
          tabIndex={0}
          onClick={() => this.flipVisibility()}
          onKeyUp={($event) => {
            if ($event.key === 'Enter') {
              this.flipVisibility();
            }
          }}
          role="button"
        >
          {visibleAnswer ? 'Hide' : 'Show'} Answer
        </div>
        <div className="answer-holder">
          <span
            style={{
              visibility: visibleAnswer ? 'visible' : 'hidden'
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
