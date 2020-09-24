import socketIOClient from 'socket.io-client';

const socketUrlServer =
  process.env.REACT_APP_NODE_SERVER || 'http://localhost:3001';
const socket = socketIOClient(socketUrlServer);

export { socket, socketUrlServer };
