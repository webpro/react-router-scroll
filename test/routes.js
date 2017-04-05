import React from 'react';
import { Route } from 'react-router-dom';

function Page1() {
  return (
    <div style={{ width: 20000, height: 20000 }} />
  );
}

function Page2() {
  return (
    <div style={{ width: 10000, height: 10000 }} />
  );
}

export const syncRoutes = [
  <Route path="/" exact key="page1" component={Page1} />,
  <Route path="/page2" key="page2" component={Page2} />,
];

export function createElementRoutes(Page) {
  return (
    <Page>
      <Route exact path="/" />
      <Route path="/other" />
    </Page>
  );
}
