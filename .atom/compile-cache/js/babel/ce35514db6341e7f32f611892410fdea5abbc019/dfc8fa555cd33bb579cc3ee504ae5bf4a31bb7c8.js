Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _servicesDebug = require('./services/debug');

'use babel';

var Client = (function () {
  function Client(projectDir) {
    _classCallCheck(this, Client);

    this.projectDir = projectDir;
    // collection files the server currently holds in its set of analyzed files
    this.analyzedFiles = [];
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: _path2['default'].normalize(file),
          end: end,
          types: true,
          includeKeywords: true,
          sort: _atomTernjsPackageConfig2['default'].options.sort,
          guess: _atomTernjsPackageConfig2['default'].options.guess,
          docs: _atomTernjsPackageConfig2['default'].options.documentation,
          urls: _atomTernjsPackageConfig2['default'].options.urls,
          origins: _atomTernjsPackageConfig2['default'].options.origins,
          lineCharPositions: true,
          caseInsensitive: _atomTernjsPackageConfig2['default'].options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: _path2['default'].normalize(file),
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: _path2['default'].normalize(file),
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor) {

      return this.post('query', { files: [{

          type: 'full',
          name: _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]),
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, start, text) {

      return this.post('query', [{

        type: 'full',
        name: _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]),
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var buffer = editor.getBuffer();

      if (!buffer.isModified()) {

        return Promise.resolve({});
      }

      var uRI = editor.getURI();

      if (!uRI) {

        return Promise.reject({ type: 'info', message: _servicesDebug.messages.noURI });
      }

      var file = _path2['default'].normalize(atom.project.relativizePath(uRI)[1]);

      // check if this file is excluded via dontLoad
      if (_atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // do not request files if we already know it is registered
      if (this.analyzedFiles.includes(file)) {

        return this.updateFull(editor);
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        var files = data.files;

        if (files) {

          files.forEach(function (file) {
            return file = _path2['default'].normalize(file);
          });
          _this.analyzedFiles = files;
        }

        var registered = files && files.includes(file);

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, start, text)
          // else
          return _this.updateFull(editor);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: _path2['default'].normalize(file),
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = _path2['default'].normalize(atom.project.relativizePath(editor.getURI())[1]);
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      var _atom$project$relativizePath = atom.project.relativizePath(editor.getURI());

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var project = _atom$project$relativizePath2[0];
      var file = _atom$project$relativizePath2[1];

      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: _path2['default'].normalize(file),
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          if (_servicesNavigation2['default'].set(data)) {

            var path_to_go = _path2['default'].isAbsolute(data.file) ? data.file : project + '/' + data.file;
            (0, _atomTernjsHelper.openFileAndGoTo)(data.start, path_to_go);
          }
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'getDefinition',
    value: function getDefinition(file, range) {
      return this.post('query', {
        query: {
          type: 'definition',
          file: _path2['default'].normalize(file),
          start: {
            line: range.start.row,
            ch: range.start.column
          },
          end: {
            line: range.end.row,
            ch: range.end.column
          }
        }
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = _atomTernjsManager2['default'].server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztpQ0FDSCx1QkFBdUI7Ozs7dUNBQ2pCLDhCQUE4Qjs7OztnQ0FHakQsc0JBQXNCOztrQ0FDTix1QkFBdUI7Ozs7NkJBQ3ZCLGtCQUFrQjs7QUFUekMsV0FBVyxDQUFDOztJQVdTLE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixVQUFVLEVBQUU7MEJBRkwsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0dBQ3pCOztlQVBrQixNQUFNOztXQVNkLHFCQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7O0FBRXJCLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRXhCLGFBQUssRUFBRTs7QUFFTCxjQUFJLEVBQUUsYUFBYTtBQUNuQixjQUFJLEVBQUUsa0JBQUssU0FBUyxDQUFDLElBQUksQ0FBQztBQUMxQixhQUFHLEVBQUUsR0FBRztBQUNSLGVBQUssRUFBRSxJQUFJO0FBQ1gseUJBQWUsRUFBRSxJQUFJO0FBQ3JCLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsSUFBSTtBQUNoQyxlQUFLLEVBQUUscUNBQWMsT0FBTyxDQUFDLEtBQUs7QUFDbEMsY0FBSSxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxhQUFhO0FBQ3pDLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsSUFBSTtBQUNoQyxpQkFBTyxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxPQUFPO0FBQ3RDLDJCQUFpQixFQUFFLElBQUk7QUFDdkIseUJBQWUsRUFBRSxxQ0FBYyxPQUFPLENBQUMsZUFBZTtTQUN2RDtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFWSx1QkFBQyxJQUFJLEVBQUUsR0FB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L2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtcbiAgb3BlbkZpbGVBbmRHb1RvXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vc2VydmljZXMvbmF2aWdhdGlvbic7XG5pbXBvcnQge21lc3NhZ2VzfSBmcm9tICcuL3NlcnZpY2VzL2RlYnVnJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0RGlyKSB7XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0RGlyO1xuICAgIC8vIGNvbGxlY3Rpb24gZmlsZXMgdGhlIHNlcnZlciBjdXJyZW50bHkgaG9sZHMgaW4gaXRzIHNldCBvZiBhbmFseXplZCBmaWxlc1xuICAgIHRoaXMuYW5hbHl6ZWRGaWxlcyA9IFtdO1xuICB9XG5cbiAgY29tcGxldGlvbnMoZmlsZSwgZW5kKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAnY29tcGxldGlvbnMnLFxuICAgICAgICBmaWxlOiBwYXRoLm5vcm1hbGl6ZShmaWxlKSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIHR5cGVzOiB0cnVlLFxuICAgICAgICBpbmNsdWRlS2V5d29yZHM6IHRydWUsXG4gICAgICAgIHNvcnQ6IHBhY2thZ2VDb25maWcub3B0aW9ucy5zb3J0LFxuICAgICAgICBndWVzczogcGFja2FnZUNvbmZpZy5vcHRpb25zLmd1ZXNzLFxuICAgICAgICBkb2NzOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuZG9jdW1lbnRhdGlvbixcbiAgICAgICAgdXJsczogcGFja2FnZUNvbmZpZy5vcHRpb25zLnVybHMsXG4gICAgICAgIG9yaWdpbnM6IHBhY2thZ2VDb25maWcub3B0aW9ucy5vcmlnaW5zLFxuICAgICAgICBsaW5lQ2hhclBvc2l0aW9uczogdHJ1ZSxcbiAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuY2FzZUluc2Vuc2l0aXZlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkb2N1bWVudGF0aW9uKGZpbGUsIGVuZCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RvY3VtZW50YXRpb24nLFxuICAgICAgICBmaWxlOiBwYXRoLm5vcm1hbGl6ZShmaWxlKSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZnMoZmlsZSwgZW5kKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVmcycsXG4gICAgICAgIGZpbGU6IHBhdGgubm9ybWFsaXplKGZpbGUpLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRnVsbChlZGl0b3IpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgeyBmaWxlczogW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogcGF0aC5ub3JtYWxpemUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0pLFxuICAgICAgdGV4dDogZWRpdG9yLmdldFRleHQoKVxuICAgIH1dfSk7XG4gIH1cblxuICB1cGRhdGVQYXJ0KGVkaXRvciwgc3RhcnQsIHRleHQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogcGF0aC5ub3JtYWxpemUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0pLFxuICAgICAgb2Zmc2V0OiB7XG5cbiAgICAgICAgbGluZTogc3RhcnQsXG4gICAgICAgIGNoOiAwXG4gICAgICB9LFxuICAgICAgdGV4dDogZWRpdG9yLmdldFRleHQoKVxuICAgIH1dKTtcbiAgfVxuXG4gIHVwZGF0ZShlZGl0b3IpIHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblxuICAgIGlmICghYnVmZmVyLmlzTW9kaWZpZWQoKSkge1xuICAgICAgXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9XG5cbiAgICBjb25zdCB1UkkgPSBlZGl0b3IuZ2V0VVJJKCk7XG5cbiAgICBpZiAoIXVSSSkge1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe3R5cGU6ICdpbmZvJywgbWVzc2FnZTogbWVzc2FnZXMubm9VUkl9KTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gcGF0aC5ub3JtYWxpemUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHVSSSlbMV0pO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBmaWxlIGlzIGV4Y2x1ZGVkIHZpYSBkb250TG9hZFxuICAgIGlmIChcbiAgICAgIG1hbmFnZXIuc2VydmVyICYmXG4gICAgICBtYW5hZ2VyLnNlcnZlci5kb250TG9hZChmaWxlKVxuICAgICkge1xuXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9XG5cbiAgICAvLyBkbyBub3QgcmVxdWVzdCBmaWxlcyBpZiB3ZSBhbHJlYWR5IGtub3cgaXQgaXMgcmVnaXN0ZXJlZFxuICAgIGlmICh0aGlzLmFuYWx5emVkRmlsZXMuaW5jbHVkZXMoZmlsZSkpIHtcblxuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRnVsbChlZGl0b3IpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBmaWxlIGlzIHJlZ2lzdGVyZWQsIGVsc2UgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuZmlsZXMoKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIGNvbnN0IGZpbGVzID0gZGF0YS5maWxlcztcblxuICAgICAgaWYgKGZpbGVzKSB7XG5cbiAgICAgICAgZmlsZXMuZm9yRWFjaChmaWxlID0+IGZpbGUgPSBwYXRoLm5vcm1hbGl6ZShmaWxlKSk7XG4gICAgICAgIHRoaXMuYW5hbHl6ZWRGaWxlcyA9IGZpbGVzO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWdpc3RlcmVkID0gZmlsZXMgJiYgZmlsZXMuaW5jbHVkZXMoZmlsZSk7XG5cbiAgICAgIGlmIChyZWdpc3RlcmVkKSB7XG5cbiAgICAgICAgLy8gY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgICAgICAvLyBpZiBidWZmZXIuZ2V0TWF4Q2hhcmFjdGVySW5kZXgoKSA+IDUwMDBcbiAgICAgICAgLy8gICBzdGFydCA9IDBcbiAgICAgICAgLy8gICBlbmQgPSAwXG4gICAgICAgIC8vICAgdGV4dCA9ICcnXG4gICAgICAgIC8vICAgZm9yIGRpZmYgaW4gZWRpdG9yTWV0YS5kaWZmc1xuICAgICAgICAvLyAgICAgc3RhcnQgPSBNYXRoLm1heCgwLCBkaWZmLm9sZFJhbmdlLnN0YXJ0LnJvdyAtIDUwKVxuICAgICAgICAvLyAgICAgZW5kID0gTWF0aC5taW4oYnVmZmVyLmdldExpbmVDb3VudCgpLCBkaWZmLm9sZFJhbmdlLmVuZC5yb3cgKyA1KVxuICAgICAgICAvLyAgICAgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShbW3N0YXJ0LCAwXSwgW2VuZCwgYnVmZmVyLmxpbmVMZW5ndGhGb3JSb3coZW5kKV1dKVxuICAgICAgICAvLyAgIHByb21pc2UgPSB0aGlzLnVwZGF0ZVBhcnQoZWRpdG9yLCBzdGFydCwgdGV4dClcbiAgICAgICAgLy8gZWxzZVxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVGdWxsKGVkaXRvcik7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cblxuICByZW5hbWUoZmlsZSwgZW5kLCBuZXdOYW1lKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVuYW1lJyxcbiAgICAgICAgZmlsZTogcGF0aC5ub3JtYWxpemUoZmlsZSksXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICBuZXdOYW1lOiBuZXdOYW1lXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0eXBlKGVkaXRvciwgcG9zaXRpb24pIHtcblxuICAgIGNvbnN0IGZpbGUgPSBwYXRoLm5vcm1hbGl6ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSk7XG4gICAgY29uc3QgZW5kID0ge1xuXG4gICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICBjaDogcG9zaXRpb24uY29sdW1uXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICd0eXBlJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgIHByZWZlckZ1bmN0aW9uOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZWZpbml0aW9uKCkge1xuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcbiAgICBjb25zdCBbcHJvamVjdCwgZmlsZV0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RlZmluaXRpb24nLFxuICAgICAgICBmaWxlOiBwYXRoLm5vcm1hbGl6ZShmaWxlKSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cblxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgaWYgKGRhdGEgJiYgZGF0YS5zdGFydCkge1xuXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uLnNldChkYXRhKSkge1xuXG4gICAgICAgICAgY29uc3QgcGF0aF90b19nbyA9IHBhdGguaXNBYnNvbHV0ZShkYXRhLmZpbGUpID8gZGF0YS5maWxlIDogYCR7cHJvamVjdH0vJHtkYXRhLmZpbGV9YDtcbiAgICAgICAgICBvcGVuRmlsZUFuZEdvVG8oZGF0YS5zdGFydCwgcGF0aF90b19nbyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldERlZmluaXRpb24oZmlsZSwgcmFuZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHR5cGU6ICdkZWZpbml0aW9uJyxcbiAgICAgICAgZmlsZTogcGF0aC5ub3JtYWxpemUoZmlsZSksXG4gICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgbGluZTogcmFuZ2Uuc3RhcnQucm93LFxuICAgICAgICAgIGNoOiByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgICAgfSxcbiAgICAgICAgZW5kOiB7XG4gICAgICAgICAgbGluZTogcmFuZ2UuZW5kLnJvdyxcbiAgICAgICAgICBjaDogcmFuZ2UuZW5kLmNvbHVtblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmaWxlcygpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdmaWxlcydcbiAgICAgIH1cblxuICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBwb3N0KHR5cGUsIGRhdGEpIHtcblxuICAgIGNvbnN0IHByb21pc2UgPSBtYW5hZ2VyLnNlcnZlci5yZXF1ZXN0KHR5cGUsIGRhdGEpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cbiJdfQ==