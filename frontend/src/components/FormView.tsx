import * as React from 'react';

import '../stylesheets/FormView.scss';
import { store } from 'react-notifications-component';
import http from '../utils/http-request';

class FormView extends React.Component {
  private readonly URL_BASE = 'http://localhost:5000'; // This is because the flask app is running on port 5000

  constructor(public props: any, public state: any) {
    super(props);
    this.state = {
      question: '',
      answer: '',
      difficulty: 1,
      category: 1,
      categories: [{}]
    };
  }

  public componentDidMount() {
    http.get(`${this.URL_BASE}/categories`).subscribe({
      next: (response) => {
        this.setState({ categories: response.result });
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
    //   $.ajax({
    //     url: `/categories`, //TODO: update request URL
    //     type: "GET",
    //     success: result => {
    //       this.setState({ categories: result.categories });
    //       return;
    //     },
    //     error: error => {
    //       alert("Unable to load categories. Please try your request again");
    //       return;
    //     }
    //   });
    // }
    // submitQuestion = event => {
    //   event.preventDefault();
    //   $.ajax({
    //     url: "/questions", //TODO: update request URL
    //     type: "POST",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({
    //       question: this.state.question,
    //       answer: this.state.answer,
    //       difficulty: this.state.difficulty,
    //       category: this.state.category
    //     }),
    //     xhrFields: {
    //       withCredentials: true
    //     },
    //     crossDomain: true,
    //     success: result => {
    //       (document.getElementById("add-question-form") as any).reset();
    //       return;
    //     },
    //     error: error => {
    //       alert("Unable to add question. Please try your request again");
    //       return;
    //     }
    //   });
  }

  public handleChange = (event) => {
    console.log(this);
    this.setState({ [event.target.name]: event.target.value });
  };

  public submitQuestion = ($event: React.FormEvent<HTMLFormElement>) => {
    $event.preventDefault();
    console.log(this);
    const { question, answer, difficulty, category } = this.state;
    const headers = new Headers();
    headers.append('content-type', 'application/json');
    http
      .post(
        `${this.URL_BASE}/questions`,
        JSON.stringify({
          question,
          answer,
          difficulty: parseInt(difficulty, 10),
          category
        }),
        { headers }
      )
      .subscribe({
        next: (response) => {
          store.addNotification({
            title: 'Success',
            message: 'Question successfully added.',
            type: 'success',
            insert: 'top',
            container: 'top-right',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            dismiss: {
              duration: 5000
            }
          });
          (document.getElementById(
            'add-question-form'
          ) as HTMLFormElement).reset();
        },
        error: (err) => {
          store.addNotification({
            title: 'Error',
            message: 'Ooops, something went wrong with that. Please try again.',
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
  };

  public render() {
    const { categories } = this.state;

    if (categories) {
      return (
        <div id="add-form">
          <h2>Add a New Trivia Question</h2>
          <form
            className="form-view"
            id="add-question-form"
            onSubmit={this.submitQuestion}
          >
            <label htmlFor="name">
              Question
              <input type="text" name="question" onChange={this.handleChange} />
            </label>
            <label htmlFor="answer">
              Answer
              <input type="text" name="answer" onChange={this.handleChange} />
            </label>
            <label htmlFor="difficulty">
              Difficulty
              <select name="difficulty" onChange={this.handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
            <label htmlFor="category">
              Category
              <select name="category" onChange={this.handleChange}>
                {categories.map((category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.type}
                    </option>
                  );
                })}
              </select>
            </label>
            <input type="submit" className="button" value="Submit" />
          </form>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default FormView;
