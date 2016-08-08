'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirebaseTransport = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createChannel;

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

var _storybookChannel = require('@kadira/storybook-channel');

var _storybookChannel2 = _interopRequireDefault(_storybookChannel);

var _app = require('firebase/app');

var _app2 = _interopRequireDefault(_app);

require('firebase/database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createChannel(_ref) {
  var url = _ref.url;

  var transport = new FirebaseTransport({ url: url });
  return new _storybookChannel2.default({ transport: transport });
}

var FirebaseTransport = exports.FirebaseTransport = function () {
  function FirebaseTransport(_ref2) {
    var _this = this;

    var url = _ref2.url;

    _classCallCheck(this, FirebaseTransport);

    this._handler = null;
    this._ref = this._createRef(url);
    this._ref.on('value', after(1, function (s) {
      return _this._handler(s.val());
    }));
  }

  _createClass(FirebaseTransport, [{
    key: 'setHandler',
    value: function setHandler(handler) {
      this._handler = handler;
    }
  }, {
    key: 'send',
    value: function send(event) {
      this._ref.set(event);
    }
  }, {
    key: '_createRef',
    value: function _createRef(url) {
      var parsedUrl = (0, _urlParse2.default)(url);
      var protocol = parsedUrl.protocol;
      var host = parsedUrl.host;
      var pathname = parsedUrl.pathname;

      var config = { databaseURL: protocol + '//' + host };
      var id = Math.random().toString(16).slice(2);
      var app = _app2.default.initializeApp(config, id);
      return app.database().ref(pathname);
    }
  }]);

  return FirebaseTransport;
}();

// This helper will skip first n invocations of the function fn.
// This is used to skip the initial value received from firebase.
// We're only interested in values which are set after created time.

function after(n, fn) {
  var called = 0;
  return function () {
    return ++called < n ? null : fn.apply(undefined, arguments);
  };
}