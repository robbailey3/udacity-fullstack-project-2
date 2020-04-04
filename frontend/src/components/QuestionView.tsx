import * as React from 'react';
import { store } from 'react-notifications-component';
import Question from './Question';
import Search from './Search';
import http from '../utils/http-request';
import '../stylesheets/App.scss';

class QuestionView extends React.Component {
  private readonly URL_BASE = 'http://localhost:5000'; // This is because the flask app is running on port 5000

  constructor(
    public props: React.Props<any>,
    public state: React.ComponentState
  ) {
    super(props);
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: {},
      currentCategory: null
    };
  }

  public componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    const { page } = this.state;
    http.get(`${this.URL_BASE}/questions?page=${page}`).subscribe({
      next: (result) => {
        this.setState({
          isLoaded: true,
          questions: result.questions,
          totalQuestions: result.total_questions,
          categories: result.categories,
          currentCategory: result.current_category
        });
      },
      error: (err: Error) => {
        store.addNotification({
          title: 'Error',
          message: `${err}. Unable to load questions.`,
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'fadeOut'],
          dismiss: {
            duration: 5000
          }
        });
        console.log(err);
      }
    });
  };

  public getByCategory(id: number) {
    http.get(`${this.URL_BASE}/categories/${id}/questions`).subscribe({
      next: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        });
      },
      error: (err) => {
        store.addNotification({
          title: 'Error',
          message: `${err}. Unable to load categories.`,
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

  public submitSearch(searchTerm) {
    http
      .post(`${this.URL_BASE}/questions`, JSON.stringify({ searchTerm }))
      .subscribe({
        next: (result) => {
          this.setState({
            questions: result.questions,
            totalQuestions: result.total_questions,
            currentCategory: result.current_category
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
    //   url: `/questions`, //TODO: update request URL
    //   type: "POST",
    //   dataType: "json",
    //   contentType: "application/json",
    //   data: JSON.stringify({ searchTerm: searchTerm }),
    //   xhrFields: {
    //     withCredentials: true
    //   },
    //   crossDomain: true,
    //   success: result => {
    //     this.setState({
    //       questions: result.questions,
    //       totalQuestions: result.total_questions,
    //       currentCategory: result.current_category
    //     });
    //     return;
    //   },
    //   error: error => {
    //     alert("Unable to load questions. Please try your request again");
    //     return;
    //   }
    // });
  }

  public questionAction(id) {
    return (action) => {
      if (action === 'DELETE') {
        if (window.confirm('are you sure you want to delete the question?')) {
          http.delete(`${this.URL_BASE}/questions/${id}`).subscribe({
            next: () => this.getQuestions(),
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
          //   url: `/questions/${id}`, //TODO: update request URL
          //   type: "DELETE",
          //   success: result => {
          //     this.getQuestions();
          //   },
          //   error: error => {
          //     alert("Unable to load questions. Please try your request again");
          //     return;
          //   }
          // });
        }
      }
    };
  }

  public selectPage(num: number) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  public createPagination() {
    const { totalQuestions, page } = this.state;
    const pageNumbers: JSX.Element[] = [];
    const maxPage = Math.ceil(totalQuestions / 10);
    for (let i = 1; i <= maxPage; i += 1) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === page ? 'active' : ''}`}
          role="link"
          tabIndex={0}
          onKeyDown={() => {}}
          onClick={() => {
            this.selectPage(i);
          }}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  }

  public render() {
    const { isLoaded, categories, questions } = this.state;
    if (isLoaded) {
      return (
        <div className="question-view">
          <div className="categories-list">
            <button
              type="button"
              onClick={() => {
                this.getQuestions();
              }}
            >
              <h2>Categories</h2>
            </button>
            <ul>
              {categories.map((category, index) => (
                <li key={category.type}>
                  <button
                    key={category.id}
                    className="button button-ghost"
                    onClick={() => {
                      this.getByCategory(category.id);
                    }}
                    onKeyUp={($event) => {
                      if ($event.key === 'Enter') {
                        this.getByCategory(category.id);
                      }
                    }}
                    tabIndex={0}
                    type="button"
                  >
                    {category.type}
                    <img
                      className="category"
                      src={`public/${category.type}.svg`}
                      alt={category.type}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <Search submitSearch={this.submitSearch} />
          </div>
          <div className="questions-list">
            <h2>Questions</h2>
            {questions.map((q) => (
              <Question
                key={q.id}
                question={q.question}
                answer={q.answer}
                category={
                  categories.filter((cat) => {
                    return cat.id === q.category;
                  })[0]
                }
                difficulty={q.difficulty}
                questionAction={this.questionAction(q.id)}
              />
            ))}
            <div className="pagination-menu">{this.createPagination()}</div>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default QuestionView;
