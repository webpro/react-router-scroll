import { render, unmountComponentAtNode } from 'react-dom';
import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';

// a way to render any part of your app inside a MemoryRouter
// you pass it a list of steps to execute when the location
// changes, it will call back to you with stuff like
// `match` and `location`, and `history` so you can control
// the flow and make assertions.
const renderTestSequence = ({
  initialEntries,
  initialIndex,
  subject: Subject,
  steps,
  target,
}) => {
  class Assert extends React.Component {

    componentDidMount() {
      this.assert();
    }

    componentDidUpdate() {
      this.assert();
    }

    assert() {
      const nextStep = steps.shift();
      if (nextStep) {
        nextStep({ ...this.props, target });
      } else {
        unmountComponentAtNode(target);
      }
    }

    render() {
      return this.props.children;
    }
  }

  Assert.propTypes = {
    children: React.PropTypes.element.isRequired,
  };

  const Test = () => (<MemoryRouter
    initialIndex={initialIndex}
    initialEntries={initialEntries}
  >
    <Route
      render={props => (
        <Assert {...props}>
          <Subject />
        </Assert>
      )}
    />
  </MemoryRouter>);

  render(<Test />, target);
};

export default renderTestSequence;
