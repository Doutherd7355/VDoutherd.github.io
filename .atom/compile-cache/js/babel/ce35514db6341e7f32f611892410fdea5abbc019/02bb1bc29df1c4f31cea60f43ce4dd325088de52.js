Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _dialog = require('./dialog');

var _dialog2 = _interopRequireDefault(_dialog);

'use babel';

var atom = global.atom;

var PromptPassDialog = (function (_Dialog) {
  _inherits(PromptPassDialog, _Dialog);

  function PromptPassDialog() {
    var isInteractive = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    _classCallCheck(this, PromptPassDialog);

    _get(Object.getPrototypeOf(PromptPassDialog.prototype), 'constructor', this).call(this, {
      prompt: isInteractive ? 'Enter Vertification Code for keyboard-interactive:' : 'Enter password/passphrase only for this session:',
      select: false
    });

    var self = this;
    var passwordModel = self.miniEditor.getModel();

    passwordModel.clearTextPassword = new _atom.TextBuffer('');

    var changing = false;
    passwordModel.buffer.onDidChange(function (obj) {
      if (!changing) {
        changing = true;
        passwordModel.clearTextPassword.setTextInRange(obj.oldRange, obj.newText);
        passwordModel.buffer.setTextInRange(obj.newRange, '*'.repeat(obj.newText.length));
        changing = false;
      }
    });

    var coreConfirmListeners = atom.commands.inlineListenersByCommandName['core:confirm'].get(self.element);
    coreConfirmListeners.splice(0, coreConfirmListeners.length);

    atom.commands.add(self.element, {
      'core:confirm': function coreConfirm() {
        self.onConfirm(passwordModel.clearTextPassword.getText());
      }
    });
  }

  _createClass(PromptPassDialog, [{
    key: 'onConfirm',
    value: function onConfirm(pass) {
      this.trigger('dialog-done', [pass]);
    }
  }]);

  return PromptPassDialog;
})(_dialog2['default']);

exports['default'] = PromptPassDialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFMkIsTUFBTTs7c0JBQ2QsVUFBVTs7OztBQUg3QixXQUFXLENBQUM7O0FBS1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFFSixnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUV4QixXQUZRLGdCQUFnQixHQUVBO1FBQXZCLGFBQWEseURBQUcsS0FBSzs7MEJBRmQsZ0JBQWdCOztBQUdqQywrQkFIaUIsZ0JBQWdCLDZDQUczQjtBQUNKLFlBQU0sRUFBRSxhQUFhLEdBQUcsb0RBQW9ELEdBQUcsa0RBQWtEO0FBQ2pJLFlBQU0sRUFBRSxLQUFLO0tBQ2QsRUFBRTs7QUFFSCxRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFakQsaUJBQWEsQ0FBQyxpQkFBaUIsR0FBRyxxQkFBZSxFQUFFLENBQUMsQ0FBQzs7QUFFckQsUUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGlCQUFhLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsZ0JBQVEsR0FBRyxJQUFJLENBQUM7QUFDaEIscUJBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUUscUJBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbEYsZ0JBQVEsR0FBRyxLQUFLLENBQUM7T0FDbEI7S0FDRixDQUFDLENBQUM7O0FBRUgsUUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDMUcsd0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5QixvQkFBYyxFQUFFLHVCQUFNO0FBQ3BCLFlBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7T0FDM0Q7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUEvQmtCLGdCQUFnQjs7V0FpQzFCLG1CQUFDLElBQUksRUFBRTtBQUNkLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNyQzs7O1NBbkNrQixnQkFBZ0I7OztxQkFBaEIsZ0JBQWdCIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL3Byb21wdC1wYXNzLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBUZXh0QnVmZmVyIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgRGlhbG9nIGZyb20gJy4vZGlhbG9nJztcblxuY29uc3QgYXRvbSA9IGdsb2JhbC5hdG9tO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9tcHRQYXNzRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICBjb25zdHJ1Y3Rvcihpc0ludGVyYWN0aXZlID0gZmFsc2UpIHtcbiAgICBzdXBlcih7XG4gICAgICBwcm9tcHQ6IGlzSW50ZXJhY3RpdmUgPyAnRW50ZXIgVmVydGlmaWNhdGlvbiBDb2RlIGZvciBrZXlib2FyZC1pbnRlcmFjdGl2ZTonIDogJ0VudGVyIHBhc3N3b3JkL3Bhc3NwaHJhc2Ugb25seSBmb3IgdGhpcyBzZXNzaW9uOicsXG4gICAgICBzZWxlY3Q6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgcGFzc3dvcmRNb2RlbCA9IHNlbGYubWluaUVkaXRvci5nZXRNb2RlbCgpO1xuXG4gICAgcGFzc3dvcmRNb2RlbC5jbGVhclRleHRQYXNzd29yZCA9IG5ldyBUZXh0QnVmZmVyKCcnKTtcblxuICAgIGxldCBjaGFuZ2luZyA9IGZhbHNlO1xuICAgIHBhc3N3b3JkTW9kZWwuYnVmZmVyLm9uRGlkQ2hhbmdlKChvYmopID0+IHtcbiAgICAgIGlmICghY2hhbmdpbmcpIHtcbiAgICAgICAgY2hhbmdpbmcgPSB0cnVlO1xuICAgICAgICBwYXNzd29yZE1vZGVsLmNsZWFyVGV4dFBhc3N3b3JkLnNldFRleHRJblJhbmdlKG9iai5vbGRSYW5nZSwgb2JqLm5ld1RleHQpO1xuICAgICAgICBwYXNzd29yZE1vZGVsLmJ1ZmZlci5zZXRUZXh0SW5SYW5nZShvYmoubmV3UmFuZ2UsICcqJy5yZXBlYXQob2JqLm5ld1RleHQubGVuZ3RoKSk7XG4gICAgICAgIGNoYW5naW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb3JlQ29uZmlybUxpc3RlbmVycyA9IGF0b20uY29tbWFuZHMuaW5saW5lTGlzdGVuZXJzQnlDb21tYW5kTmFtZVsnY29yZTpjb25maXJtJ10uZ2V0KHNlbGYuZWxlbWVudCk7XG4gICAgY29yZUNvbmZpcm1MaXN0ZW5lcnMuc3BsaWNlKDAsIGNvcmVDb25maXJtTGlzdGVuZXJzLmxlbmd0aCk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZChzZWxmLmVsZW1lbnQsIHtcbiAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB7XG4gICAgICAgIHNlbGYub25Db25maXJtKHBhc3N3b3JkTW9kZWwuY2xlYXJUZXh0UGFzc3dvcmQuZ2V0VGV4dCgpKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBvbkNvbmZpcm0ocGFzcykge1xuICAgIHRoaXMudHJpZ2dlcignZGlhbG9nLWRvbmUnLCBbcGFzc10pO1xuICB9XG5cbn1cbiJdfQ==