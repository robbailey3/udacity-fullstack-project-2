import * as React from 'react';

import '../stylesheets/QuizView.scss';
import { store } from 'react-notifications-component';
import http from '../utils/http-request';

const questionsPerPlay = 5;

class QuizView extends React.Component {
  private readonly URL_BASE = 'http://localhost:5000'; // This is because the flask app is running on port 5000

  constructor(public props: any, public state: any) {
    super(props);
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      categories: [],
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    };
  }

  public componentDidMount() {
    this.getCategories();
    // $.ajax({
    //   url: `/categories`, //TODO: update request URL
    //   type: "GET",
    //   success: result => {
    //     this.setState({ categories: result.categories });
    //     return;
    //   },
    //   error: error => {
    //     alert("Unable to load categories. Please try your request again");
    //     return;
    //   }
    // });
  }

  public getCategories() {
    http.get(`${this.URL_BASE}/categories`).subscribe({
      next: (response) => {
        this.setState({ categories: response.result });
        console.log(response);
      },
      error: (err) => {
        store.addNotification({
          title: 'Error',
          message: `${err}. Something went wrong.`,
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 5000
          }
        });
      }
    });
  }

  selectCategory = ({ type, id = 0 }) => {
    this.setState({ quizCategory: { type, id } }, this.getNextQuestion);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getNextQuestion = () => {
    const { previousQuestions, currentQuestion, quizCategory } = this.state;
    // const previousQuestions = [...previousQuestions];
    if (currentQuestion.id) {
      previousQuestions.push(currentQuestion.id);
    }
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    http
      .post(
        `${this.URL_BASE}/questions/play`,
        JSON.stringify({
          previousQuestions,
          quizCategory
        }),
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.setState({
            showAnswer: false,
            previousQuestions,
            currentQuestion: response.question,
            guess: '',
            forceEnd: !response.question
          });
        },
        error: (err) => {
          store.addNotification({
            title: 'Error',
            message: `${err}. Something went wrong.`,
            type: 'danger',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 5000
            }
          });
        }
      });
    // $.ajax({
    //   url: "/quizzes", //TODO: update request URL
    //   type: "POST",
    //   dataType: "json",
    //   contentType: "application/json",
    //   data: JSON.stringify({
    //     previous_questions: previousQuestions,
    //     quiz_category: this.state.quizCategory
    //   }),
    //   xhrFields: {
    //     withCredentials: true
    //   },
    //   crossDomain: true,
    //   success: result => {
    //     this.setState({
    //       showAnswer: false,
    //       previousQuestions: previousQuestions,
    //       currentQuestion: result.question,
    //       guess: "",
    //       forceEnd: result.question ? false : true
    //     });
    //     return;
    //   },
    //   error: error => {
    //     alert("Unable to load question. Please try your request again");
    //     return;
    //   }
    // });
  };

  public submitGuess = (event) => {
    const { guess, numCorrect } = this.state;
    event.preventDefault();
    const formatGuess = guess
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const evaluate = this.evaluateAnswer();
    this.setState({
      numCorrect: !evaluate ? numCorrect : numCorrect + 1,
      showAnswer: true
    });
  };

  public restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    });
  };

  private evaluateAnswer = () => {
    const { guess, currentQuestion } = this.state;
    const formatGuess = guess
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const answerArray = currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.includes(formatGuess);
  };

  private renderPrePlay() {
    const { categories } = this.state;
    console.log(categories);
    if (categories.length > 0) {
      return (
        <div className="quiz-play-holder">
          <div className="choose-header">Choose Category</div>
          <div className="category-holder">
            <div
              className="play-category"
              onClick={this.selectCategory}
              onKeyUp={($event) => {
                if ($event.key === 'Enter') {
                  return 'meow';
                }
              }}
              tabIndex={0}
              role="button"
            >
              ALL
            </div>
            {categories.map((category: any, index: number) => {
              return (
                <div
                  key={category.id}
                  className="play-category"
                  role="link"
                  tabIndex={0}
                  onClick={() => {
                    this.selectCategory({
                      type: category.type,
                      id: category.id
                    });
                  }}
                  onKeyUp={($event) => {
                    if ($event.key === 'Enter') {
                      this.selectCategory({
                        type: category.type,
                        id: category.id
                      });
                    }
                  }}
                >
                  {category.type}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }

  private renderFinalScore() {
    const { numCorrect } = this.state;
    return (
      <div className="quiz-play-holder">
        <div className="final-header">
          Your Final Score is
          {numCorrect}
        </div>
        <button
          type="button"
          className="play-again button"
          onClick={this.restartGame}
        >
          Play Again?
        </button>
      </div>
    );
  }

  public renderCorrectAnswer() {
    const { guess, currentQuestion } = this.state;
    const formatGuess = guess
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const evaluate = this.evaluateAnswer();
    return (
      <div className="quiz-play-holder">
        <div className="quiz-question">{currentQuestion.question}</div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>
          {evaluate ? 'You were correct!' : 'You were incorrect'}
        </div>
        <div className="quiz-answer">{currentQuestion.answer}</div>
        <div
          className="next-question button"
          onClick={this.getNextQuestion}
          onKeyUp={($event) => {
            if ($event.key === 'Enter') {
              this.getNextQuestion();
            }
          }}
          role="button"
          tabIndex={0}
        >
          Next Question
        </div>
      </div>
    );
  }

  private renderPlay() {
    const {
      previousQuestions,
      forceEnd,
      showAnswer,
      currentQuestion
    } = this.state;
    // eslint-disable-next-line no-nested-ternary
    return previousQuestions.length === questionsPerPlay || forceEnd ? (
      this.renderFinalScore()
    ) : showAnswer ? (
      this.renderCorrectAnswer()
    ) : (
      <div className="quiz-play-holder">
        <div className="quiz-question">{currentQuestion.question}</div>
        <form onSubmit={this.submitGuess}>
          <input type="text" name="guess" onChange={this.handleChange} />
          <input
            className="submit-guess button"
            type="submit"
            value="Submit Answer"
          />
        </form>
      </div>
    );
  }

  public render() {
    const { quizCategory } = this.state;
    return quizCategory ? this.renderPlay() : this.renderPrePlay();
  }
}

export default QuizView;
