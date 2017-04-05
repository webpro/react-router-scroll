import scrollTop from 'dom-helpers/query/scrollTop';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import ScrollContainer from '../src/ScrollContainer';
import ScrollBehaviorContext from '../src/ScrollBehaviorContext';

import { ScrollableComponent } from './components';
// import { createElementRoutes } from './routes';
import renderTestSequence from './stepping';

describe('<ScrollContainer>', () => {
  let container;

  beforeEach(() => {
    window.history.replaceState(null, null, '/');

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  // Create a new history every time to avoid old state.
  [
    MemoryRouter,
  ].forEach((createHistory) => {
    describe(createHistory.name, () => {
      it('should have correct default behavior', (done) => {
        const Page = () => (
          <ScrollContainer scrollKey="container">
            <ScrollableComponent />
          </ScrollContainer>
        );

        const App = () => (
          <ScrollBehaviorContext>
            <Page />
          </ScrollBehaviorContext>
        );

        const steps = [
          ({ history }) => {
            scrollTop(container.firstChild, 10000);
            history.push('/other');
          },
          ({ history }) => {
            expect(scrollTop(container.firstChild)).to.equal(0);
            history.goBack();
          },
          () => {
            expect(scrollTop(container.firstChild)).to.equal(10000);
            done();
          },
        ];

        renderTestSequence({
          subject: App,
          steps,
          target: container,
        });
      });

      it('should have support custom behavior', (done) => {
        const Page = () => (
          <ScrollContainer
            scrollKey="container"
            shouldUpdateScroll={() => [0, 5000]}
          >
            <ScrollableComponent />
          </ScrollContainer>
        );

        const App = () => (
          <ScrollBehaviorContext>
            <Page />
          </ScrollBehaviorContext>
        );

        const steps = [
          ({ history }) => {
            scrollTop(container.firstChild, 10000);
            history.push('/other');
          },
          ({ history }) => {
            expect(scrollTop(container.firstChild)).to.equal(5000);
            history.goBack();
          },
          () => {
            expect(scrollTop(container.firstChild)).to.equal(5000);
            done();
          },
        ];

        renderTestSequence({
          subject: App,
          steps,
          target: container,
        });
      });
    });
  });
});
