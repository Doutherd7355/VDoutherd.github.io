Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashDebounce = require('lodash/debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _helpers = require('./helpers');

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (!atom.workspace.isTextEditor(editor)) {
      throw new Error('EditorLinter expects a valid TextEditor');
    }
    var editorBuffer = editor.getBuffer();
    var debouncedLint = (0, _lodashDebounce2['default'])(function () {
      _this.emitter.emit('should-lint', false);
    }, 50, { leading: true });

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    // This debouncing is for beautifiers, if they change contents of the editor and save
    // Linter should count that group of events as one.
    this.subscriptions.add(this.editor.onDidSave(debouncedLint));
    // This is to relint in case of external changes to the opened file
    this.subscriptions.add(editorBuffer.onDidReload(debouncedLint));
    // NOTE: TextEditor::onDidChange immediately invokes the callback if the text editor was *just* created
    // Using TextBuffer::onDidChange doesn't have the same behavior so using it instead.
    this.subscriptions.add((0, _helpers.subscriptiveObserve)(atom.config, 'linter.lintOnChangeInterval', function (interval) {
      return editorBuffer.onDidChange((0, _lodashDebounce2['default'])(function () {
        _this.emitter.emit('should-lint', true);
      }, interval));
    }));
  }

  _createClass(EditorLinter, [{
    key: 'getEditor',
    value: function getEditor() {
      return this.editor;
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.emitter.dispose();
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUQsTUFBTTs7OEJBQzFDLGlCQUFpQjs7Ozt1QkFFRixXQUFXOztJQUUxQixZQUFZO0FBS3BCLFdBTFEsWUFBWSxDQUtuQixNQUFrQixFQUFFOzs7MEJBTGIsWUFBWTs7QUFNN0IsUUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3hDLFlBQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQTtLQUMzRDtBQUNELFFBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUN2QyxRQUFNLGFBQWEsR0FBRyxpQ0FDcEIsWUFBTTtBQUNKLFlBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDeEMsRUFDRCxFQUFFLEVBQ0YsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQ2xCLENBQUE7O0FBRUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQU0sTUFBSyxPQUFPLEVBQUU7S0FBQSxDQUFDLENBQUMsQ0FBQTs7O0FBR3RFLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7O0FBRTVELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTs7O0FBRy9ELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixrQ0FBb0IsSUFBSSxDQUFDLE1BQU0sRUFBRSw2QkFBNkIsRUFBRSxVQUFBLFFBQVE7YUFDdEUsWUFBWSxDQUFDLFdBQVcsQ0FDdEIsaUNBQVMsWUFBTTtBQUNiLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDdkMsRUFBRSxRQUFRLENBQUMsQ0FDYjtLQUFBLENBQ0YsQ0FDRixDQUFBO0dBQ0Y7O2VBdkNrQixZQUFZOztXQXdDdEIscUJBQWU7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25COzs7V0FDRyxnQkFBNEI7VUFBM0IsUUFBaUIseURBQUcsS0FBSzs7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzNDOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBeERrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItbGludGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHN1YnNjcmlwdGl2ZU9ic2VydmUgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvckxpbnRlciB7XG4gIGVkaXRvcjogVGV4dEVkaXRvclxuICBlbWl0dGVyOiBFbWl0dGVyXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3RvcihlZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VkaXRvckxpbnRlciBleHBlY3RzIGEgdmFsaWQgVGV4dEVkaXRvcicpXG4gICAgfVxuICAgIGNvbnN0IGVkaXRvckJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGNvbnN0IGRlYm91bmNlZExpbnQgPSBkZWJvdW5jZShcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgZmFsc2UpXG4gICAgICB9LFxuICAgICAgNTAsXG4gICAgICB7IGxlYWRpbmc6IHRydWUgfSxcbiAgICApXG5cbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB0aGlzLmRpc3Bvc2UoKSkpXG4gICAgLy8gVGhpcyBkZWJvdW5jaW5nIGlzIGZvciBiZWF1dGlmaWVycywgaWYgdGhleSBjaGFuZ2UgY29udGVudHMgb2YgdGhlIGVkaXRvciBhbmQgc2F2ZVxuICAgIC8vIExpbnRlciBzaG91bGQgY291bnQgdGhhdCBncm91cCBvZiBldmVudHMgYXMgb25lLlxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRTYXZlKGRlYm91bmNlZExpbnQpKVxuICAgIC8vIFRoaXMgaXMgdG8gcmVsaW50IGluIGNhc2Ugb2YgZXh0ZXJuYWwgY2hhbmdlcyB0byB0aGUgb3BlbmVkIGZpbGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckJ1ZmZlci5vbkRpZFJlbG9hZChkZWJvdW5jZWRMaW50KSlcbiAgICAvLyBOT1RFOiBUZXh0RWRpdG9yOjpvbkRpZENoYW5nZSBpbW1lZGlhdGVseSBpbnZva2VzIHRoZSBjYWxsYmFjayBpZiB0aGUgdGV4dCBlZGl0b3Igd2FzICpqdXN0KiBjcmVhdGVkXG4gICAgLy8gVXNpbmcgVGV4dEJ1ZmZlcjo6b25EaWRDaGFuZ2UgZG9lc24ndCBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yIHNvIHVzaW5nIGl0IGluc3RlYWQuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHN1YnNjcmlwdGl2ZU9ic2VydmUoYXRvbS5jb25maWcsICdsaW50ZXIubGludE9uQ2hhbmdlSW50ZXJ2YWwnLCBpbnRlcnZhbCA9PlxuICAgICAgICBlZGl0b3JCdWZmZXIub25EaWRDaGFuZ2UoXG4gICAgICAgICAgZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgdHJ1ZSlcbiAgICAgICAgICB9LCBpbnRlcnZhbCksXG4gICAgICAgICksXG4gICAgICApLFxuICAgIClcbiAgfVxuICBnZXRFZGl0b3IoKTogVGV4dEVkaXRvciB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yXG4gIH1cbiAgbGludChvbkNoYW5nZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50Jywgb25DaGFuZ2UpXG4gIH1cbiAgb25TaG91bGRMaW50KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1saW50JywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==