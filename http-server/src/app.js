import _ from 'lodash';
import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import minimist from 'minimist';
import socketIO from 'socket.io';
import rethinkdbdash from 'rethinkdbdash';

const r = rethinkdbdash();
const argv = minimist(process.argv.slice(2));
const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

router.get('/', (req, res) => {
    res.json({ hello: "world" });
});
app.use(router);

const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', async socket => {
    // console.log('got a connection', sockets.length);
    socket.on('join-lobby', async (reason) => {
        socket.join('lobby');
        const servers = await r.db('testing').table('server').orderBy(r.desc('created_at')).limit(50).run();
        socket.emit('server:list', servers);
    });
    socket.on('left-lobby', (reason) => {
        socket.leave('lobby');
    });
    socket.on('join-server', async serverID => {
        socket.join(`server-${serverID}`);
        const gameObjects = await r.db('testing').table('game_object').filter({serverID}).run();
        socket.emit('game_object:list', gameObjects);
    });
    socket.on('left-server', serverID => {
        socket.leave(`server-${serverID}`);
    });
});
server.listen(+argv['port'], () => {
    console.log(`Listening for http clients: ${argv['host']}:${+argv['port']}`);
    r.db('testing').table('server').changes().run()
    .then(cursor => {
        cursor.each((error, change) => {
            if (!error) {
                io.to('lobby').emit('server:change', change);
            }
        });
    });
    r.db('testing').table('game_object').changes().run()
    .then(cursor => {
        cursor.each((error, change) => {
            if (!error && change.new_val.serverID) {
                io.to(`server-${change.new_val.serverID}`).emit('game_object:change', change);
            }
        });
    });
});
