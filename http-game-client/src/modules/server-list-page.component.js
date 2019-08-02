import React from 'react';
import ReactDOM from 'react-dom';
import Async from 'react-async';
import { Link } from "react-router-dom";

class Server extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <span>Server: <Link to={`/server/${this.props.server.serverID}`}>{this.props.server.serverID}</Link> - {this.props.server.created_at}</span>
          </div>
        );
    }
}


class ServerListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            servers: []
        };
        this.onServerList = this.onServerList.bind(this);
        this.onServerChange = this.onServerChange.bind(this);
    }

    onServerList(servers) {
        this.setState((state, props) => ({
            servers: servers
        }));
    }

    onServerChange(change) {
        console.log('server:change', change);
        if (!change.old_val) {
            this.state.servers.unshift(change.new_val);
            this.setState((state, props) => ({
                servers: state.servers
            }));
        } else {

        }
    }

    componentDidMount() {
        this.props.socket.emit('join-lobby');
        this.props.socket.on('server:list', this.onServerList);
        this.props.socket.on('server:change', this.onServerChange);
    }
  
    componentWillUnmount() {
        this.props.socket.emit('left-lobby');
        this.props.socket.off('server:list', this.onServerList);
        this.props.socket.off('server:change', this.onServerChange);
    }

    render() {
        return (
            <div>
                {this.state.servers.map((server, idx) => <Server key={idx} server={server} />)}
            </div>
        );
    }
}

export default ServerListPage;
