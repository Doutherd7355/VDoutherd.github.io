Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var RenameView = require('./atom-ternjs-rename-view');

var Rename = (function () {
  function Rename() {
    _classCallCheck(this, Rename);

    this.disposables = [];

    this.renameView = null;
    this.renamePanel = null;

    this.hideListener = this.hide.bind(this);
  }

  _createClass(Rename, [{
    key: 'init',
    value: function init() {

      this.renameView = new RenameView();
      this.renameView.initialize(this);

      this.renamePanel = atom.workspace.addModalPanel({

        item: this.renameView,
        priority: 0,
        visible: false
      });

      atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');

      _atomTernjsEvents2['default'].on('rename-hide', this.hideListener);

      this.registerCommands();
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', this.show.bind(this)));
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.renamePanel && this.renamePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      var codeEditor = atom.workspace.getActiveTextEditor();
      var currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({ includeNonWordCharacters: false });
      var currentName = codeEditor.getTextInBufferRange(currentNameRange);

      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();

      this.renamePanel.show();
      this.renameView.nameEditor.focus();
    }
  }, {
    key: 'updateAllAndRename',
    value: function updateAllAndRename(newName) {
      var _this = this;

      if (!_atomTernjsManager2['default'].client) {

        this.hide();

        return;
      }

      var idx = 0;
      var editors = atom.workspace.getTextEditors();

      for (var editor of editors) {

        if (!(0, _atomTernjsHelper.isValidEditor)(editor) || atom.project.relativizePath(editor.getURI())[0] !== _atomTernjsManager2['default'].client.projectDir) {

          idx++;

          continue;
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (++idx === editors.length) {

            var activeEditor = atom.workspace.getActiveTextEditor();
            var cursor = activeEditor.getLastCursor();

            if (!cursor) {

              return;
            }

            var position = cursor.getBufferPosition();

            _atomTernjsManager2['default'].client.rename(atom.project.relativizePath(activeEditor.getURI())[1], { line: position.row, ch: position.column }, newName).then(function (data) {

              if (!data) {

                return;
              }

              _this.rename(data);
            })['catch'](_servicesDebug2['default'].handleCatchWithNotification).then(_this.hideListener);
          }
        })['catch'](_servicesDebug2['default'].handleCatch).then(this.hideListener);
      }
    }
  }, {
    key: 'rename',
    value: function rename(data) {

      var dir = _atomTernjsManager2['default'].server.projectDir;

      if (!dir) {

        return;
      }

      var translateColumnBy = data.changes[0].text.length - data.name.length;

      for (var change of data.changes) {

        change.file = change.file.replace(/^.\//, '');
        change.file = _path2['default'].resolve(atom.project.relativizePath(dir)[0], change.file);
      }

      var changes = (0, _underscorePlus.uniq)(data.changes, function (item) {

        return JSON.stringify(item);
      });

      var currentFile = false;
      var arr = [];
      var idx = 0;

      for (var change of changes) {

        if (currentFile !== change.file) {

          currentFile = change.file;
          idx = arr.push([]) - 1;
        }

        arr[idx].push(change);
      }

      for (var arrObj of arr) {

        this.openFilesAndRename(arrObj, translateColumnBy);
      }

      this.hide();
    }
  }, {
    key: 'openFilesAndRename',
    value: function openFilesAndRename(obj, translateColumnBy) {
      var _this2 = this;

      atom.workspace.open(obj[0].file).then(function (textEditor) {

        var currentColumnOffset = 0;
        var idx = 0;
        var buffer = textEditor.getBuffer();
        var checkpoint = buffer.createCheckpoint();

        for (var change of obj) {

          _this2.setTextInRange(buffer, change, currentColumnOffset, idx === obj.length - 1, textEditor);
          currentColumnOffset += translateColumnBy;

          idx++;
        }

        buffer.groupChangesSinceCheckpoint(checkpoint);
      });
    }
  }, {
    key: 'setTextInRange',
    value: function setTextInRange(buffer, change, offset, moveCursor, textEditor) {

      change.start += offset;
      change.end += offset;
      var position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      var end = position.translate(new _atom.Point(0, length));
      var range = new _atom.Range(position, end);
      buffer.setTextInRange(range, change.text);

      if (!moveCursor) {

        return;
      }

      var cursor = textEditor.getLastCursor();

      cursor && cursor.setBufferPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];

      _atomTernjsEvents2['default'].off('rename-hide', this.hideListener);

      this.renameView && this.renameView.destroy();
      this.renameView = null;

      this.renamePanel && this.renamePanel.destroy();
      this.renamePanel = null;
    }
  }]);

  return Rename;
})();

exports['default'] = new Rename();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Z0NBSW9CLHNCQUFzQjs7OztpQ0FDdEIsdUJBQXVCOzs7O29CQUlwQyxNQUFNOzs4QkFDTSxpQkFBaUI7O29CQUNuQixNQUFNOzs7O2dDQUtoQixzQkFBc0I7OzZCQUNYLGtCQUFrQjs7OztBQWpCcEMsV0FBVyxDQUFDOztBQUVaLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztJQWlCbEQsTUFBTTtBQUVDLFdBRlAsTUFBTSxHQUVJOzBCQUZWLE1BQU07O0FBSVIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFDOztlQVZHLE1BQU07O1dBWU4sZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqQyxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDOztBQUU5QyxZQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDckIsZ0JBQVEsRUFBRSxDQUFDO0FBQ1gsZUFBTyxFQUFFLEtBQUs7T0FDZixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsY0FBYyxDQUFD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QVUsR0FBRyxJQUFJLENBQUM7O0FBRXZCLFVBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMvQyxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztLQUN6Qjs7O1NBbk5HLE1BQU07OztxQkFzTkcsSUFBSSxNQUFNLEVBQUUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZW5hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUmVuYW1lVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcnKTtcblxuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCB7XG4gIFBvaW50LFxuICBSYW5nZVxufSBmcm9tICdhdG9tJztcbmltcG9ydCB7dW5pcX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtcbiAgZGlzcG9zZUFsbCxcbiAgZm9jdXNFZGl0b3IsXG4gIGlzVmFsaWRFZGl0b3Jcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IGRlYnVnIGZyb20gJy4vc2VydmljZXMvZGVidWcnO1xuXG5jbGFzcyBSZW5hbWUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbnVsbDtcbiAgICB0aGlzLnJlbmFtZVBhbmVsID0gbnVsbDtcblxuICAgIHRoaXMuaGlkZUxpc3RlbmVyID0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbmV3IFJlbmFtZVZpZXcoKTtcbiAgICB0aGlzLnJlbmFtZVZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcblxuICAgICAgaXRlbTogdGhpcy5yZW5hbWVWaWV3LFxuICAgICAgcHJpb3JpdHk6IDAsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMucmVuYW1lUGFuZWwpLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlbmFtZS1wYW5lbCcsICdwYW5lbC1ib3R0b20nKTtcblxuICAgIGVtaXR0ZXIub24oJ3JlbmFtZS1oaWRlJywgdGhpcy5oaWRlTGlzdGVuZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnJlbmFtZScsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBoaWRlKCkge1xuXG4gICAgdGhpcy5yZW5hbWVQYW5lbCAmJiB0aGlzLnJlbmFtZVBhbmVsLmhpZGUoKTtcblxuICAgIGZvY3VzRWRpdG9yKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgY29uc3QgY29kZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJyZW50TmFtZVJhbmdlID0gY29kZUVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSh7aW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBmYWxzZX0pO1xuICAgIGNvbnN0IGN1cnJlbnROYW1lID0gY29kZUVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShjdXJyZW50TmFtZVJhbmdlKTtcblxuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dChjdXJyZW50TmFtZSk7XG4gICAgdGhpcy5yZW5hbWVWaWV3Lm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5zZWxlY3RBbGwoKTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwuc2hvdygpO1xuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmZvY3VzKCk7XG4gIH1cblxuICB1cGRhdGVBbGxBbmRSZW5hbWUobmV3TmFtZSkge1xuXG4gICAgaWYgKCFtYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICB0aGlzLmhpZGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHggPSAwO1xuICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpO1xuXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgZWRpdG9ycykge1xuXG4gICAgICBpZiAoXG4gICAgICAgICFpc1ZhbGlkRWRpdG9yKGVkaXRvcikgfHxcbiAgICAgICAgYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMF0gIT09IG1hbmFnZXIuY2xpZW50LnByb2plY3REaXJcbiAgICAgICkge1xuXG4gICAgICAgIGlkeCsrO1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCsraWR4ID09PSBlZGl0b3JzLmxlbmd0aCkge1xuXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBhY3RpdmVFZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgICAgICAgICBpZiAoIWN1cnNvcikge1xuXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgbWFuYWdlci5jbGllbnQucmVuYW1lKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVFZGl0b3IuZ2V0VVJJKCkpWzFdLCB7bGluZTogcG9zaXRpb24ucm93LCBjaDogcG9zaXRpb24uY29sdW1ufSwgbmV3TmFtZSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5yZW5hbWUoZGF0YSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGRlYnVnLmhhbmRsZUNhdGNoV2l0aE5vdGlmaWNhdGlvbilcbiAgICAgICAgICAgIC50aGVuKHRoaXMuaGlkZUxpc3RlbmVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChkZWJ1Zy5oYW5kbGVDYXRjaClcbiAgICAgICAgLnRoZW4odGhpcy5oaWRlTGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmFtZShkYXRhKSB7XG5cbiAgICBjb25zdCBkaXIgPSBtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyO1xuXG4gICAgaWYgKCFkaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYW5zbGF0ZUNvbHVtbkJ5ID0gZGF0YS5jaGFuZ2VzWzBdLnRleHQubGVuZ3RoIC0gZGF0YS5uYW1lLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGNoYW5nZSBvZiBkYXRhLmNoYW5nZXMpIHtcblxuICAgICAgY2hhbmdlLmZpbGUgPSBjaGFuZ2UuZmlsZS5yZXBsYWNlKC9eLlxcLy8sICcnKTtcbiAgICAgIGNoYW5nZS5maWxlID0gcGF0aC5yZXNvbHZlKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChkaXIpWzBdLCBjaGFuZ2UuZmlsZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZXMgPSB1bmlxKGRhdGEuY2hhbmdlcywgKGl0ZW0pID0+IHtcblxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRGaWxlID0gZmFsc2U7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGxldCBpZHggPSAwO1xuXG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuXG4gICAgICBpZiAoY3VycmVudEZpbGUgIT09IGNoYW5nZS5maWxlKSB7XG5cbiAgICAgICAgY3VycmVudEZpbGUgPSBjaGFuZ2UuZmlsZTtcbiAgICAgICAgaWR4ID0gYXJyLnB1c2goW10pIC0gMTtcbiAgICAgIH1cblxuICAgICAgYXJyW2lkeF0ucHVzaChjaGFuZ2UpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgYXJyT2JqIG9mIGFycikge1xuXG4gICAgICB0aGlzLm9wZW5GaWxlc0FuZFJlbmFtZShhcnJPYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIG9wZW5GaWxlc0FuZFJlbmFtZShvYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KSB7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG9ialswXS5maWxlKS50aGVuKCh0ZXh0RWRpdG9yKSA9PiB7XG5cbiAgICAgIGxldCBjdXJyZW50Q29sdW1uT2Zmc2V0ID0gMDtcbiAgICAgIGxldCBpZHggPSAwO1xuICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgIGNvbnN0IGNoZWNrcG9pbnQgPSBidWZmZXIuY3JlYXRlQ2hlY2twb2ludCgpO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBvYmopIHtcblxuICAgICAgICB0aGlzLnNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBjdXJyZW50Q29sdW1uT2Zmc2V0LCBpZHggPT09IG9iai5sZW5ndGggLSAxLCB0ZXh0RWRpdG9yKTtcbiAgICAgICAgY3VycmVudENvbHVtbk9mZnNldCArPSB0cmFuc2xhdGVDb2x1bW5CeTtcblxuICAgICAgICBpZHgrKztcbiAgICAgIH1cblxuICAgICAgYnVmZmVyLmdyb3VwQ2hhbmdlc1NpbmNlQ2hlY2twb2ludChjaGVja3BvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBvZmZzZXQsIG1vdmVDdXJzb3IsIHRleHRFZGl0b3IpIHtcblxuICAgIGNoYW5nZS5zdGFydCArPSBvZmZzZXQ7XG4gICAgY2hhbmdlLmVuZCArPSBvZmZzZXQ7XG4gICAgY29uc3QgcG9zaXRpb24gPSBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChjaGFuZ2Uuc3RhcnQpO1xuICAgIGxlbmd0aCA9IGNoYW5nZS5lbmQgLSBjaGFuZ2Uuc3RhcnQ7XG4gICAgY29uc3QgZW5kID0gcG9zaXRpb24udHJhbnNsYXRlKG5ldyBQb2ludCgwLCBsZW5ndGgpKTtcbiAgICBjb25zdCByYW5nZSA9IG5ldyBSYW5nZShwb3NpdGlvbiwgZW5kKTtcbiAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UocmFuZ2UsIGNoYW5nZS50ZXh0KTtcblxuICAgIGlmICghbW92ZUN1cnNvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBjdXJzb3IgJiYgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIGVtaXR0ZXIub2ZmKCdyZW5hbWUtaGlkZScsIHRoaXMuaGlkZUxpc3RlbmVyKTtcblxuICAgIHRoaXMucmVuYW1lVmlldyAmJiB0aGlzLnJlbmFtZVZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMucmVuYW1lVmlldyA9IG51bGw7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsICYmIHRoaXMucmVuYW1lUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMucmVuYW1lUGFuZWwgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSZW5hbWUoKTtcbiJdfQ==