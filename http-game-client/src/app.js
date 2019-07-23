import React from 'react';
import ReactDOM from 'react-dom';

class Server extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <span>Server: <a href="">{this.props.server.serverID}</a> - {this.props.server.created_at}</span>
          </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          date: new Date(),
          servers: props.servers || [],
          net: 'offline'
      };
    }

    componentDidMount() {
        window.addEventListener('load', () => {
            this.socket = io('http://localhost:8082/');
            this.socket.on('connect', () => {
                this.socket.emit('join-lobby');
                this.setState({
                    net: 'online'
                })
            });
            this.socket.on('disconnect', () => {
                this.setState({
                    net: 'offline'
                })
            });
            this.socket.on('server:list', servers => {
                console.log('server:list', servers);
                this.setState((state, props) => ({
                    servers: servers
                }));
            });
            this.socket.on('game_object:list', servers => {
                console.log('game_object:list', servers);
            });
            this.socket.on('server:change', change => {
                if (!change.old_val) {
                    this.state.servers.unshift(change.new_val);
                    this.setState((state, props) => ({
                        servers: state.servers
                    }));
                } else {

                }
                console.log('server:change', change);
            });
            this.socket.on('game_object:change', change => {
                if (!change.old_val) {
                    this.state.servers.unshift(change.new_val);
                    this.setState((state, props) => ({
                        servers: state.servers
                    }));
                } else {

                }
                console.log('server:change', change);
            });
        });
        this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
        this.setState(state => ({
            date: new Date(),
        }));
    }

    servers() {
        // fetch('http://localhost:8082/')
        // .then(response => response.json())
        // .then(response => {
        //     this.state.servers.push({
        //         name: 'test',
        //         date: new Date()
        //     });
        //     this.setState((state, props) => ({
        //         servers: state.servers
        //     }));
        // });
    }
  
    render() {
      return (
        <div>
          <h3>{this.state.date.toLocaleTimeString()} - {this.state.net}</h3>
          {this.state.servers.map((server, idx) => <Server key={idx} server={server}>
            </Server>)}
        </div>
      );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));
