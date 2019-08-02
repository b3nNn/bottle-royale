import React from 'react';
import AppRouter from './app-router.component';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          date: new Date(),
          socket: null,
          net: 'offline'
      };
      this.socket = null;
      this.onConnect = this.onConnect.bind(this);
      this.onDisconnect = this.onDisconnect.bind(this);
    }

    onConnect() {
        this.setState({
            net: 'online'
        })
    }

    onDisconnect() {
        this.setState({
            net: 'offline'
        })
    }

    init() {
        window.addEventListener('load', () => {
            this.socket = io('http://localhost:8082/');
            this.setState(() => ({
                socket: this.socket
            }));
            this.socket.on('connect', this.onConnect);
            this.socket.on('disconnect', this.onDisconnect);
        });
    }

    destroy() {
        if (this.socket) {
            this.socket.off('connect', this.onConnect);
            this.socket.off('disconnect', this.onDisconnect);
        }
    }

    componentDidMount() {
        this.init();
        this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
        this.destroy();
        clearInterval(this.timerID);
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  
    tick() {
        this.setState(state => ({
            date: new Date(),
        }));
    }

    render() {
        let serverList;

        if (this.socket === null) {
            serverList = 'Loading please wait ...';
        } else {
            serverList = <AppRouter socket={this.state.socket} />;
        }
        return (
            <div class="container-fluid">
                <div class="row">
                    <div class="col">
                        <h3>{this.state.date.toLocaleTimeString()} - {this.state.net}</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                    {serverList}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;