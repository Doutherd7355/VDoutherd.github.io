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

var AddDialog = (function (_Dialog) {
  _inherits(AddDialog, _Dialog);

  function AddDialog(initialPath, isFile) {
    _classCallCheck(this, AddDialog);

    _get(Object.getPrototypeOf(AddDialog.prototype), 'constructor', this).call(this, {
      prompt: isFile ? 'Enter the path for the new file.' : 'Enter the path for the new folder.',
      initialPath: initialPath,
      select: false,
      iconClass: isFile ? 'icon-file-add' : 'icon-file-directory-create'
    });

    this.isCreatingFile = isFile;
  }

  _createClass(AddDialog, [{
    key: 'onConfirm',
    value: function onConfirm(relativePath) {
      this.trigger('new-path', [relativePath]);
    }
  }]);

  return AddDialog;
})(_dialog2['default']);

exports['default'] = AddDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL2FkZC1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFVBQVU7Ozs7QUFGN0IsV0FBVyxDQUFDOztJQUlTLFNBQVM7WUFBVCxTQUFTOztBQUVqQixXQUZRLFNBQVMsQ0FFaEIsV0FBVyxFQUFFLE1BQU0sRUFBRTswQkFGZCxTQUFTOztBQUcxQiwrQkFIaUIsU0FBUyw2Q0FHcEI7QUFDSixZQUFNLEVBQUUsTUFBTSxHQUFHLGtDQUFrQyxHQUFHLG9DQUFvQztBQUMxRixpQkFBVyxFQUFYLFdBQVc7QUFDWCxZQUFNLEVBQUUsS0FBSztBQUNiLGVBQVMsRUFBRSxNQUFNLEdBQUcsZUFBZSxHQUFHLDRCQUE0QjtLQUNuRSxFQUFFOztBQUVILFFBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDO0dBQzlCOztlQVhrQixTQUFTOztXQWFuQixtQkFBQyxZQUFZLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQzFDOzs7U0Fma0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2RpYWxvZ3MvYWRkLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vZGlhbG9nJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRkRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsUGF0aCwgaXNGaWxlKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcHJvbXB0OiBpc0ZpbGUgPyAnRW50ZXIgdGhlIHBhdGggZm9yIHRoZSBuZXcgZmlsZS4nIDogJ0VudGVyIHRoZSBwYXRoIGZvciB0aGUgbmV3IGZvbGRlci4nLFxuICAgICAgaW5pdGlhbFBhdGgsXG4gICAgICBzZWxlY3Q6IGZhbHNlLFxuICAgICAgaWNvbkNsYXNzOiBpc0ZpbGUgPyAnaWNvbi1maWxlLWFkZCcgOiAnaWNvbi1maWxlLWRpcmVjdG9yeS1jcmVhdGUnLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pc0NyZWF0aW5nRmlsZSA9IGlzRmlsZTtcbiAgfVxuXG4gIG9uQ29uZmlybShyZWxhdGl2ZVBhdGgpIHtcbiAgICB0aGlzLnRyaWdnZXIoJ25ldy1wYXRoJywgW3JlbGF0aXZlUGF0aF0pO1xuICB9XG5cbn1cbiJdfQ==