Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

'use babel';

var error = function ERROR(callback) {
  if (typeof callback === 'function') {
    callback.apply(this, ['Abstract connector']);
  }
};

var Connector = (function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(client) {
    _classCallCheck(this, Connector);

    _get(Object.getPrototypeOf(Connector.prototype), 'constructor', this).call(this);
    var self = this;
    self.client = client;
    self.info = {};
  }

  _createClass(Connector, [{
    key: 'connect',
    value: function connect(info, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'abort',
    value: function abort(completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'list',
    value: function list(path, recursive, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'get',
    value: function get(path, recursive, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'put',
    value: function put(path, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'mkdir',
    value: function mkdir(path, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'mkfile',
    value: function mkfile(path, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'rename',
    value: function rename(source, dest, completed) {
      error(completed);
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(path, completed) {
      error(completed);
      return this;
    }
  }], [{
    key: 'isConnected',
    value: function isConnected() {
      return false;
    }
  }]);

  return Connector;
})(_events.EventEmitter);

exports['default'] = Connector;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jb25uZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUU2QixRQUFROztBQUZyQyxXQUFXLENBQUM7O0FBSVosSUFBTSxLQUFLLEdBQUcsU0FBUyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ3JDLE1BQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFlBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0dBQzlDO0NBQ0YsQ0FBQzs7SUFFbUIsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxDQUNoQixNQUFNLEVBQUU7MEJBREQsU0FBUzs7QUFFMUIsK0JBRmlCLFNBQVMsNkNBRWxCO0FBQ1IsUUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0dBQ2hCOztlQU5rQixTQUFTOztXQVlyQixpQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQ3ZCLFdBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFUyxvQkFBQyxTQUFTLEVBQUU7QUFDcEIsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVJLGVBQUMsU0FBUyxFQUFFO0FBQ2YsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVHLGNBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFDL0IsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVFLGFBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7QUFDOUIsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pCLGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVFLGFBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUNuQixXQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUksZUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQ3JCLFdBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFSyxnQkFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO0FBQ3RCLFdBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFSyxnQkFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUM5QixXQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUssaUJBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtBQUN0QixXQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakIsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBcERpQix1QkFBRztBQUNuQixhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0FWa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2Nvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5jb25zdCBlcnJvciA9IGZ1bmN0aW9uIEVSUk9SKGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBbJ0Fic3RyYWN0IGNvbm5lY3RvciddKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29ubmVjdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoY2xpZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBzZWxmLmNsaWVudCA9IGNsaWVudDtcbiAgICBzZWxmLmluZm8gPSB7fTtcbiAgfVxuXG4gIHN0YXRpYyBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25uZWN0KGluZm8sIGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkaXNjb25uZWN0KGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBhYm9ydChjb21wbGV0ZWQpIHtcbiAgICBlcnJvcihjb21wbGV0ZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdChwYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQocGF0aCwgcmVjdXJzaXZlLCBjb21wbGV0ZWQpIHtcbiAgICBlcnJvcihjb21wbGV0ZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHV0KHBhdGgsIGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBta2RpcihwYXRoLCBjb21wbGV0ZWQpIHtcbiAgICBlcnJvcihjb21wbGV0ZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbWtmaWxlKHBhdGgsIGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW5hbWUoc291cmNlLCBkZXN0LCBjb21wbGV0ZWQpIHtcbiAgICBlcnJvcihjb21wbGV0ZWQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGVsZXRlKHBhdGgsIGNvbXBsZXRlZCkge1xuICAgIGVycm9yKGNvbXBsZXRlZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==