Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _editorLinter = require('./editor-linter');

var _editorLinter2 = _interopRequireDefault(_editorLinter);

var EditorRegistry = (function () {
  function EditorRegistry() {
    var _this = this;

    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.lintOnOpen', function (lintOnOpen) {
      _this.lintOnOpen = lintOnOpen;
    }));
  }

  _createClass(EditorRegistry, [{
    key: 'activate',
    value: function activate() {
      var _this2 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        _this2.createFromTextEditor(textEditor);
      }));
    }
  }, {
    key: 'get',
    value: function get(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'createFromTextEditor',
    value: function createFromTextEditor(textEditor) {
      var _this3 = this;

      var editorLinter = this.editorLinters.get(textEditor);
      if (editorLinter) {
        return editorLinter;
      }
      editorLinter = new _editorLinter2['default'](textEditor);
      editorLinter.onDidDestroy(function () {
        _this3.editorLinters['delete'](textEditor);
      });
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      if (this.lintOnOpen) {
        editorLinter.lint();
      }
      return editorLinter;
    }
  }, {
    key: 'hasSibling',
    value: function hasSibling(editorLinter) {
      var buffer = editorLinter.getEditor().getBuffer();

      return Array.from(this.editorLinters.keys()).some(function (item) {
        return item.getBuffer() === buffer;
      });
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.editorLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.editorLinters.values()) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUU2QyxNQUFNOzs0QkFFMUIsaUJBQWlCOzs7O0lBRXBDLGNBQWM7QUFNUCxXQU5QLGNBQWMsR0FNSjs7OzBCQU5WLGNBQWM7O0FBT2hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFOUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLFVBQVUsRUFBSTtBQUNyRCxZQUFLLFVBQVUsR0FBRyxVQUFVLENBQUE7S0FDN0IsQ0FBQyxDQUNILENBQUE7R0FDRjs7ZUFqQkcsY0FBYzs7V0FrQlYsb0JBQUc7OztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUEsVUFBVSxFQUFJO0FBQzlDLGVBQUssb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDdEMsQ0FBQyxDQUNILENBQUE7S0FDRjs7O1dBQ0UsYUFBQyxVQUFzQixFQUFpQjtBQUN6QyxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQzFDOzs7V0FDbUIsOEJBQUMsVUFBc0IsRUFBZ0I7OztBQUN6RCxVQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNyRCxVQUFJLFlBQVksRUFBRTtBQUNoQixlQUFPLFlBQVksQ0FBQTtPQUNwQjtBQUNELGtCQUFZLEdBQUcsOEJBQWlCLFVBQVUsQ0FBQyxDQUFBO0FBQzNDLGtCQUFZLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDOUIsZUFBSyxhQUFhLFVBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUN0QyxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQzFDLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixvQkFBWSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ3BCO0FBQ0QsYUFBTyxZQUFZLENBQUE7S0FDcEI7OztXQUNTLG9CQUFDLFlBQTBCLEVBQVc7QUFDOUMsVUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFBOztBQUVuRCxhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssTUFBTTtPQUFBLENBQUMsQ0FBQTtLQUN2Rjs7O1dBQ00saUJBQUMsUUFBOEMsRUFBYztBQUNsRSxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1Qzs7O1dBQ00sbUJBQUc7QUFDUixXQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDL0MsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2hCO0FBQ0QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBMURHLGNBQWM7OztxQkE2REwsY0FBYyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRWRpdG9yTGludGVyIGZyb20gJy4vZWRpdG9yLWxpbnRlcidcblxuY2xhc3MgRWRpdG9yUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyXG4gIGxpbnRPbk9wZW46IGJvb2xlYW5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBlZGl0b3JMaW50ZXJzOiBNYXA8VGV4dEVkaXRvciwgRWRpdG9yTGludGVyPlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmxpbnRPbk9wZW4nLCBsaW50T25PcGVuID0+IHtcbiAgICAgICAgdGhpcy5saW50T25PcGVuID0gbGludE9uT3BlblxuICAgICAgfSksXG4gICAgKVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnModGV4dEVkaXRvciA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlRnJvbVRleHRFZGl0b3IodGV4dEVkaXRvcilcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBnZXQodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6ID9FZGl0b3JMaW50ZXIge1xuICAgIHJldHVybiB0aGlzLmVkaXRvckxpbnRlcnMuZ2V0KHRleHRFZGl0b3IpXG4gIH1cbiAgY3JlYXRlRnJvbVRleHRFZGl0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcik6IEVkaXRvckxpbnRlciB7XG4gICAgbGV0IGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9yTGludGVycy5nZXQodGV4dEVkaXRvcilcbiAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICByZXR1cm4gZWRpdG9yTGludGVyXG4gICAgfVxuICAgIGVkaXRvckxpbnRlciA9IG5ldyBFZGl0b3JMaW50ZXIodGV4dEVkaXRvcilcbiAgICBlZGl0b3JMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZWRpdG9yTGludGVycy5kZWxldGUodGV4dEVkaXRvcilcbiAgICB9KVxuICAgIHRoaXMuZWRpdG9yTGludGVycy5zZXQodGV4dEVkaXRvciwgZWRpdG9yTGludGVyKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdvYnNlcnZlJywgZWRpdG9yTGludGVyKVxuICAgIGlmICh0aGlzLmxpbnRPbk9wZW4pIHtcbiAgICAgIGVkaXRvckxpbnRlci5saW50KClcbiAgICB9XG4gICAgcmV0dXJuIGVkaXRvckxpbnRlclxuICB9XG4gIGhhc1NpYmxpbmcoZWRpdG9yTGludGVyOiBFZGl0b3JMaW50ZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3JMaW50ZXIuZ2V0RWRpdG9yKCkuZ2V0QnVmZmVyKClcblxuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZWRpdG9yTGludGVycy5rZXlzKCkpLnNvbWUoaXRlbSA9PiBpdGVtLmdldEJ1ZmZlcigpID09PSBidWZmZXIpXG4gIH1cbiAgb2JzZXJ2ZShjYWxsYmFjazogKGVkaXRvckxpbnRlcjogRWRpdG9yTGludGVyKSA9PiB2b2lkKTogRGlzcG9zYWJsZSB7XG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLmZvckVhY2goY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmVkaXRvckxpbnRlcnMudmFsdWVzKCkpIHtcbiAgICAgIGVudHJ5LmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yUmVnaXN0cnlcbiJdfQ==