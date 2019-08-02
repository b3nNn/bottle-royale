import _ from 'lodash';
import 'three';
import React from 'react';
import GameRenderer from './game-renderer';

class ServerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameObjects: []
        };
        this.onGameObjectList = this.onGameObjectList.bind(this);
        this.onGameObjectChange = this.onGameObjectChange.bind(this);
        this.renderer = new GameRenderer('container', document, window);
        console.log('ServerPage props', props);
    }

    onGameObjectList(gameObjects) {
        console.log('game_object:list', gameObjects);
        this.setState((state, props) => ({
            gameObjects: _.concat(state.gameObjects, gameObjects)
        }));
    }

    onGameObjectChange(change) {
        // console.log('game_object:change', change);
        if (!change.old_val) {
            this.state.gameObjects.unshift(change.new_val);
            this.setState((state, props) => ({
                servers: state.servers
            }));
        } else {

        }
    }

    componentDidMount() {
        this.renderer.init();
        this.renderer.animate();
        this.props.socket.emit('join-server', this.props.match.params.id);
        this.props.socket.on('game_object:list', this.onGameObjectList);
        this.props.socket.on('game_object:change', this.onGameObjectChange);
    }
  
    componentWillUnmount() {
        this.props.socket.emit('left-server', this.props.match.params.id);
        this.props.socket.off('game_object:list', this.onGameObjectList);
        this.props.socket.off('game_object:change', this.onGameObjectChange);
    }

    render() {
        return (
            <div id="container">
            </div>
        );
    }
}

export default ServerPage;