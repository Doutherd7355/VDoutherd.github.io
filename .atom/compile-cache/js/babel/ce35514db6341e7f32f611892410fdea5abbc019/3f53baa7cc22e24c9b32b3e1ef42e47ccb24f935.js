Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _dialog = require('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

'use babel';

var NavigateTo = (function (_Dialog) {
  _inherits(NavigateTo, _Dialog);

  function NavigateTo() {
    _classCallCheck(this, NavigateTo);

    _get(Object.getPrototypeOf(NavigateTo.prototype), 'constructor', this).call(this, {
      prompt: 'Enter the path to navigate to.',
      initialPath: '/',
      select: false,
      iconClass: 'icon-file-directory'
    });
  }

  _createClass(NavigateTo, [{
    key: 'onConfirm',
    value: function onConfirm(path) {
      this.trigger('navigate-to', path);
    }
  }]);

  return NavigateTo;
})(_dialog2['default']);

exports['default'] = NavigateTo;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL25hdmlnYXRlLXRvLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFbUIsVUFBVTs7OztBQUY3QixXQUFXLENBQUM7O0lBSVMsVUFBVTtZQUFWLFVBQVU7O0FBRWxCLFdBRlEsVUFBVSxHQUVmOzBCQUZLLFVBQVU7O0FBRzNCLCtCQUhpQixVQUFVLDZDQUdyQjtBQUNKLFlBQU0sRUFBRSxnQ0FBZ0M7QUFDeEMsaUJBQVcsRUFBRSxHQUFHO0FBQ2hCLFlBQU0sRUFBRSxLQUFLO0FBQ2IsZUFBUyxFQUFFLHFCQUFxQjtLQUNqQyxFQUFFO0dBQ0o7O2VBVGtCLFVBQVU7O1dBV3BCLG1CQUFDLElBQUksRUFBRTtBQUNkLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ25DOzs7U0Fia0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2RpYWxvZ3MvbmF2aWdhdGUtdG8tZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9kaWFsb2cnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYXZpZ2F0ZVRvIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBwcm9tcHQ6ICdFbnRlciB0aGUgcGF0aCB0byBuYXZpZ2F0ZSB0by4nLFxuICAgICAgaW5pdGlhbFBhdGg6ICcvJyxcbiAgICAgIHNlbGVjdDogZmFsc2UsXG4gICAgICBpY29uQ2xhc3M6ICdpY29uLWZpbGUtZGlyZWN0b3J5JyxcbiAgICB9KTtcbiAgfVxuXG4gIG9uQ29uZmlybShwYXRoKSB7XG4gICAgdGhpcy50cmlnZ2VyKCduYXZpZ2F0ZS10bycsIHBhdGgpO1xuICB9XG5cbn1cbiJdfQ==