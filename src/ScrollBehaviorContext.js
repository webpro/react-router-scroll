import React from 'react';
import { withRouter } from 'react-router-dom';
import ScrollBehavior from 'scroll-behavior';
import PropTypes from 'prop-types';

import SessionStorage from './StateStorage';

class ScrollContext extends React.Component {

  static propTypes = {
    shouldUpdateScroll: PropTypes.func,
    children: PropTypes.element.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    scrollBehavior: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const { history } = props;

    this.scrollBehavior = new ScrollBehavior({
      addTransitionHook: history.listen,
      stateStorage: new SessionStorage(),
      getCurrentLocation: () => this.props.location,
      shouldUpdateScroll: this.shouldUpdateScroll,
    });

    this.scrollBehavior.updateScroll(null, this.getRouterProps());
  }

  getChildContext() {
    return {
      scrollBehavior: this,
    };
  }

  componentDidUpdate(prevProps) {
    const { location, history } = this.props;
    const prevLocation = prevProps.location;

    if (location === prevLocation) {
      return;
    }

    const prevRouterProps = {
      history: prevProps.history,
      location: prevProps.location,
    };

    this.scrollBehavior.updateScroll(prevRouterProps, { history, location });
  }

  componentWillUnmount() {
    this.scrollBehavior.stop();
  }

  getRouterProps() {
    const { history, location } = this.props;
    return { history, location };
  }

  shouldUpdateScroll = (prevRouterProps, routerProps) => {
    const { shouldUpdateScroll } = this.props;
    if (!shouldUpdateScroll) {
      return true;
    }

    // Hack to allow accessing scrollBehavior._stateStorage.
    return shouldUpdateScroll.call(
      this.scrollBehavior, prevRouterProps, routerProps,
    );
  };

  registerElement = (key, element, shouldUpdateScroll) => {
    this.scrollBehavior.registerElement(
      key, element, shouldUpdateScroll, this.getRouterProps(),
    );
  };

  unregisterElement = (key) => {
    this.scrollBehavior.unregisterElement(key);
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export default withRouter(ScrollContext);
