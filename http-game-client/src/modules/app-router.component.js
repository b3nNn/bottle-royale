import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ServerListPage from './server-list-page.component';
import ServerPage from './server-page.component';

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router basename="#" >
              <Route exact path="/" render={(props) => <ServerListPage {...this.props} />} />
              <Route path="/server/:id" render={(props) => <ServerPage {...this.props} match={props.match} />} />
            </Router>
          );
    }
}

export default AppRouter;