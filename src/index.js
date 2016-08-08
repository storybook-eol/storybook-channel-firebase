import parse from 'url-parse';
import Channel from '@kadira/storybook-channel';
import firebase from 'firebase/app';
import 'firebase/database';

export default function createChannel({ url }) {
  const transport = new FirebaseTransport({ url });
  return new Channel({ transport });
}

export class FirebaseTransport {
  constructor({ url }) {
    this._handler = null;
    this._ref = this._createRef();
    this._ref.on('value', after(1, s => this._handler(s.val())));
  }

  setHandler(handler) {
    this._handler = handler;
  }

  send(event) {
    this._ref.set(event);
  }

  _createRef(url) {
    const parsedUrl = parse(url);
    const { protocol, host, pathname } = parsedUrl;
    const config = { databaseURL: `${protocol}//${host}` };
    const id = Math.random().toString(16).slice(2);
    const app = firebase.initializeApp(config, id);
    return app.database().ref(pathname);
  }
}

// This helper will skip first n invocations of the function fn.
// This is used to skip the initial value received from firebase.
// We're only interested in values which are set after created time.

function after(n, fn) {
  let called = 0;
  return function (...args) {
    return (++called < n) ? null : fn(...args);
  };
}
