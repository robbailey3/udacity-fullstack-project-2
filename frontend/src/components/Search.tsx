import * as React from 'react';
import QuestionView from './QuestionView';

class Search extends React.Component {
  private readonly URL_BASE = 'http://localhost:5000';

  public search: any;

  constructor(public props: any, public state: any) {
    super(props);
  }

  public componentDidMount() {
    this.setState({ query: '' });
  }

  public getInfo = (event) => {
    event.preventDefault();
    const { query } = this.state;
    const { submitSearch } = this.props;
    submitSearch.call(this, query);
  };

  public handleInputChange = () => {
    this.setState({
      query: this.search.value
    });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public render() {
    return (
      <form onSubmit={this.getInfo}>
        <input
          placeholder="Search questions..."
          ref={(input) => {
            this.search = input;
          }}
          onChange={this.handleInputChange}
        />
        <input type="submit" value="Submit" className="button" />
      </form>
    );
  }
}

export default Search;
