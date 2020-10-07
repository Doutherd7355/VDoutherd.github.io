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

var MoveDialog = (function (_Dialog) {
  _inherits(MoveDialog, _Dialog);

  function MoveDialog(initialPath, isFile) {
    _classCallCheck(this, MoveDialog);

    _get(Object.getPrototypeOf(MoveDialog.prototype), 'constructor', this).call(this, {
      prompt: isFile ? 'Enter the new path for the file.' : 'Enter the new path for the folder.',
      initialPath: initialPath,
      select: true,
      iconClass: isFile ? 'icon-file-add' : 'icon-file-directory-create'
    });

    this.isCreatingFile = isFile;
  }

  _createClass(MoveDialog, [{
    key: 'onConfirm',
    value: function onConfirm(absolutePath) {
      this.trigger('path-changed', [absolutePath]);
    }
  }]);

  return MoveDialog;
})(_dialog2['default']);

exports['default'] = MoveDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL21vdmUtZGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUVtQixVQUFVOzs7O0FBRjdCLFdBQVcsQ0FBQzs7SUFJUyxVQUFVO1lBQVYsVUFBVTs7QUFFbEIsV0FGUSxVQUFVLENBRWpCLFdBQVcsRUFBRSxNQUFNLEVBQUU7MEJBRmQsVUFBVTs7QUFHM0IsK0JBSGlCLFVBQVUsNkNBR3JCO0FBQ0osWUFBTSxFQUFFLE1BQU0sR0FBRyxrQ0FBa0MsR0FBRyxvQ0FBb0M7QUFDMUYsaUJBQVcsRUFBWCxXQUFXO0FBQ1gsWUFBTSxFQUFFLElBQUk7QUFDWixlQUFTLEVBQUUsTUFBTSxHQUFHLGVBQWUsR0FBRyw0QkFBNEI7S0FDbkUsRUFBRTs7QUFFSCxRQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztHQUM5Qjs7ZUFYa0IsVUFBVTs7V0FhcEIsbUJBQUMsWUFBWSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUM5Qzs7O1NBZmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL21vdmUtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBEaWFsb2cgZnJvbSAnLi9kaWFsb2cnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3ZlRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3Rvcihpbml0aWFsUGF0aCwgaXNGaWxlKSB7XG4gICAgc3VwZXIoe1xuICAgICAgcHJvbXB0OiBpc0ZpbGUgPyAnRW50ZXIgdGhlIG5ldyBwYXRoIGZvciB0aGUgZmlsZS4nIDogJ0VudGVyIHRoZSBuZXcgcGF0aCBmb3IgdGhlIGZvbGRlci4nLFxuICAgICAgaW5pdGlhbFBhdGgsXG4gICAgICBzZWxlY3Q6IHRydWUsXG4gICAgICBpY29uQ2xhc3M6IGlzRmlsZSA/ICdpY29uLWZpbGUtYWRkJyA6ICdpY29uLWZpbGUtZGlyZWN0b3J5LWNyZWF0ZScsXG4gICAgfSk7XG5cbiAgICB0aGlzLmlzQ3JlYXRpbmdGaWxlID0gaXNGaWxlO1xuICB9XG5cbiAgb25Db25maXJtKGFic29sdXRlUGF0aCkge1xuICAgIHRoaXMudHJpZ2dlcigncGF0aC1jaGFuZ2VkJywgW2Fic29sdXRlUGF0aF0pO1xuICB9XG5cbn1cbiJdfQ==