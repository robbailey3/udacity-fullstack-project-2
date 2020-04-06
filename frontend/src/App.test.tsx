import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div') as HTMLElement;
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
