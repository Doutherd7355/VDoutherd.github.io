Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var atom = global.atom;

var Dialog = (function (_View) {
  _inherits(Dialog, _View);

  _createClass(Dialog, null, [{
    key: 'content',
    value: function content(opts) {
      var _this = this;

      var options = opts || {};

      return this.div({
        'class': 'tree-view-dialog overlay from-top'
      }, function () {
        _this.label(options.prompt, {
          'class': 'icon',
          outlet: 'text'
        });
        _this.subview('miniEditor', new _atomSpacePenViews.TextEditorView({
          mini: true
        }));
        _this.div({
          'class': 'error-message',
          outlet: 'error'
        });
      });
    }
  }]);

  function Dialog(opts) {
    var _this2 = this;

    _classCallCheck(this, Dialog);

    var options = opts || {};
    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, options);
    var self = this;

    this.prompt = options.prompt || '';
    this.initialPath = options.initialPath || '';
    this.select = options.select || false;
    this.iconClass = options.iconClass || '';

    if (this.iconClass) {
      this.text.addClass(this.iconClass);
    }

    atom.commands.add(this.element, {
      'core:confirm': function coreConfirm() {
        self.onConfirm(self.miniEditor.getText());
      },
      'core:cancel': function coreCancel() {
        self.cancel();
      }
    });

    this.miniEditor.on('blur', function () {
      _this2.close();
    });

    this.miniEditor.getModel().onDidChange(function () {
      _this2.showError();
    });

    if (this.initialPath) {
      this.miniEditor.getModel().setText(this.initialPath);
    }

    if (this.select) {
      var ext = _path2['default'].extname(this.initialPath);
      var _name = _path2['default'].basename(this.initialPath);
      var selEnd = undefined;

      if (_name === ext) {
        selEnd = this.initialPath.length;
      } else {
        selEnd = this.initialPath.length - ext.length;
      }

      var range = [[0, this.initialPath.length - _name.length], [0, selEnd]];

      this.miniEditor.getModel().setSelectedBufferRange(range);
    }
  }

  _createClass(Dialog, [{
    key: 'attach',
    value: function attach() {
      this.panel = atom.workspace.addModalPanel({ item: this.element });

      this.miniEditor.focus();
      this.miniEditor.getModel().scrollToCursorPosition();
    }
  }, {
    key: 'close',
    value: function close() {
      var destroyPanel = this.panel;

      this.panel = null;

      if (destroyPanel) {
        destroyPanel.destroy();
      }

      atom.workspace.getActivePane().activate();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.close();

      (0, _atomSpacePenViews.$)('.ftp-view').focus();
    }
  }, {
    key: 'showError',
    value: function showError(message) {
      this.error.text(message);

      if (message) {
        this.flashError();
      }
    }
  }]);

  return Dialog;
})(_atomSpacePenViews.View);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL2RpYWxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztpQ0FDaUIsc0JBQXNCOztBQUg5RCxXQUFXLENBQUM7O0FBS1osSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzs7SUFFSixNQUFNO1lBQU4sTUFBTTs7ZUFBTixNQUFNOztXQUVYLGlCQUFDLElBQUksRUFBRTs7O0FBQ25CLFVBQU0sT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O0FBRTNCLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNkLGlCQUFPLG1DQUFtQztPQUMzQyxFQUFFLFlBQU07QUFDUCxjQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3pCLG1CQUFPLE1BQU07QUFDYixnQkFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7QUFDSCxjQUFLLE9BQU8sQ0FBQyxZQUFZLEVBQUUsc0NBQW1CO0FBQzVDLGNBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDLENBQUM7QUFDSixjQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLGVBQWU7QUFDdEIsZ0JBQU0sRUFBRSxPQUFPO1NBQ2hCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7QUFFVSxXQXRCUSxNQUFNLENBc0JiLElBQUksRUFBRTs7OzBCQXRCQyxNQUFNOztBQXVCdkIsUUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUMzQiwrQkF4QmlCLE1BQU0sNkNBd0JqQixPQUFPLEVBQUU7QUFDZixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDbkMsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztBQUM3QyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7O0FBRXpDLFFBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUFFOztBQUUzRCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLG9CQUFjLEVBQUUsdUJBQU07QUFDcEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7T0FDM0M7QUFDRCxtQkFBYSxFQUFFLHNCQUFNO0FBQ25CLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFNO0FBQy9CLGFBQUssS0FBSyxFQUFFLENBQUM7S0FDZCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUMzQyxhQUFLLFNBQVMsRUFBRSxDQUFDO0tBQ2xCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3REOztBQUVELFFBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFVBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDM0MsVUFBTSxLQUFJLEdBQUcsa0JBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QyxVQUFJLE1BQU0sWUFBQSxDQUFDOztBQUVYLFVBQUksS0FBSSxLQUFLLEdBQUcsRUFBRTtBQUNoQixjQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7T0FDbEMsTUFBTTtBQUNMLGNBQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO09BQy9DOztBQUVELFVBQU0sS0FBSyxHQUFHLENBQ1osQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUMxQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FDWixDQUFDOztBQUVGLFVBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDMUQ7R0FDRjs7ZUF6RWtCLE1BQU07O1dBMkVuQixrQkFBRztBQUNQLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7O0FBRWxFLFVBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0tBQ3JEOzs7V0FFSSxpQkFBRztBQUNOLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLFlBQVksRUFBRTtBQUNoQixvQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3hCOztBQUVELFVBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDM0M7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUViLGdDQUFFLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3hCOzs7V0FFUSxtQkFBQyxPQUFPLEVBQUU7QUFDakIsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXpCLFVBQUksT0FBTyxFQUFFO0FBQUUsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO09BQUU7S0FDcEM7OztTQXhHa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2RpYWxvZ3MvZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgJCwgVmlldywgVGV4dEVkaXRvclZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmNvbnN0IGF0b20gPSBnbG9iYWwuYXRvbTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIGV4dGVuZHMgVmlldyB7XG5cbiAgc3RhdGljIGNvbnRlbnQob3B0cykge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBvcHRzIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuZGl2KHtcbiAgICAgIGNsYXNzOiAndHJlZS12aWV3LWRpYWxvZyBvdmVybGF5IGZyb20tdG9wJyxcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmxhYmVsKG9wdGlvbnMucHJvbXB0LCB7XG4gICAgICAgIGNsYXNzOiAnaWNvbicsXG4gICAgICAgIG91dGxldDogJ3RleHQnLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnN1YnZpZXcoJ21pbmlFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcoe1xuICAgICAgICBtaW5pOiB0cnVlLFxuICAgICAgfSkpO1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2Vycm9yLW1lc3NhZ2UnLFxuICAgICAgICBvdXRsZXQ6ICdlcnJvcicsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gb3B0cyB8fCB7fTtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucHJvbXB0ID0gb3B0aW9ucy5wcm9tcHQgfHwgJyc7XG4gICAgdGhpcy5pbml0aWFsUGF0aCA9IG9wdGlvbnMuaW5pdGlhbFBhdGggfHwgJyc7XG4gICAgdGhpcy5zZWxlY3QgPSBvcHRpb25zLnNlbGVjdCB8fCBmYWxzZTtcbiAgICB0aGlzLmljb25DbGFzcyA9IG9wdGlvbnMuaWNvbkNsYXNzIHx8ICcnO1xuXG4gICAgaWYgKHRoaXMuaWNvbkNsYXNzKSB7IHRoaXMudGV4dC5hZGRDbGFzcyh0aGlzLmljb25DbGFzcyk7IH1cblxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgJ2NvcmU6Y29uZmlybSc6ICgpID0+IHtcbiAgICAgICAgc2VsZi5vbkNvbmZpcm0oc2VsZi5taW5pRWRpdG9yLmdldFRleHQoKSk7XG4gICAgICB9LFxuICAgICAgJ2NvcmU6Y2FuY2VsJzogKCkgPT4ge1xuICAgICAgICBzZWxmLmNhbmNlbCgpO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubWluaUVkaXRvci5vbignYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMubWluaUVkaXRvci5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pbml0aWFsUGF0aCkge1xuICAgICAgdGhpcy5taW5pRWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dCh0aGlzLmluaXRpYWxQYXRoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3QpIHtcbiAgICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZSh0aGlzLmluaXRpYWxQYXRoKTtcbiAgICAgIGNvbnN0IG5hbWUgPSBwYXRoLmJhc2VuYW1lKHRoaXMuaW5pdGlhbFBhdGgpO1xuICAgICAgbGV0IHNlbEVuZDtcblxuICAgICAgaWYgKG5hbWUgPT09IGV4dCkge1xuICAgICAgICBzZWxFbmQgPSB0aGlzLmluaXRpYWxQYXRoLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbEVuZCA9IHRoaXMuaW5pdGlhbFBhdGgubGVuZ3RoIC0gZXh0Lmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmFuZ2UgPSBbXG4gICAgICAgIFswLCB0aGlzLmluaXRpYWxQYXRoLmxlbmd0aCAtIG5hbWUubGVuZ3RoXSxcbiAgICAgICAgWzAsIHNlbEVuZF0sXG4gICAgICBdO1xuXG4gICAgICB0aGlzLm1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKTtcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLmVsZW1lbnQgfSk7XG5cbiAgICB0aGlzLm1pbmlFZGl0b3IuZm9jdXMoKTtcbiAgICB0aGlzLm1pbmlFZGl0b3IuZ2V0TW9kZWwoKS5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBjb25zdCBkZXN0cm95UGFuZWwgPSB0aGlzLnBhbmVsO1xuXG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG5cbiAgICBpZiAoZGVzdHJveVBhbmVsKSB7XG4gICAgICBkZXN0cm95UGFuZWwuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcblxuICAgICQoJy5mdHAtdmlldycpLmZvY3VzKCk7XG4gIH1cblxuICBzaG93RXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMuZXJyb3IudGV4dChtZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlKSB7IHRoaXMuZmxhc2hFcnJvcigpOyB9XG4gIH1cblxufVxuIl19