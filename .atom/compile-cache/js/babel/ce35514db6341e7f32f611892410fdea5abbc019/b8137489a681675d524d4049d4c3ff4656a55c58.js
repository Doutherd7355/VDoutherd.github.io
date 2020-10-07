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

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var Hyperclick = (function () {
  function Hyperclick() {
    _classCallCheck(this, Hyperclick);

    this.providerName = 'atom-ternjs-hyperclick';
    this.wordRegExp = new RegExp('(`(\\\\.|[^`\\\\])*`)|(\'(\\\\.|[^\'\\\\])*\')|("(\\\\.|[^"\\\\])*")|([a-zA-Z0-9_$]+)', 'g');
  }

  _createClass(Hyperclick, [{
    key: 'getSuggestionForWord',
    value: function getSuggestionForWord(editor, string, range) {
      return new Promise(function (resolve) {
        if (!string.trim()) {
          return resolve(null);
        }

        if (!_atomTernjsManager2['default'].client) {
          return resolve(null);
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {
          if (!data) {
            return resolve(null);
          }

          var _atom$project$relativizePath = atom.project.relativizePath(editor.getURI());

          var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

          var project = _atom$project$relativizePath2[0];
          var file = _atom$project$relativizePath2[1];

          _atomTernjsManager2['default'].client.getDefinition(file, range).then(function (data) {
            if (!data) {
              return resolve(null);
            }

            if (data && data.file) {
              resolve({
                range: range,
                callback: function callback() {

                  var path_to_go = _path2['default'].isAbsolute(data.file) ? data.file : project + '/' + data.file;
                  (0, _atomTernjsHelper.openFileAndGoTo)(data.start, path_to_go);
                }
              });
            }

            resolve(null);
          })['catch'](function () {
            return resolve(null);
          });
        });
      });
    }
  }]);

  return Hyperclick;
})();

exports['default'] = new Hyperclick();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaHlwZXJjbGljay1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7aUNBQ0gsdUJBQXVCOzs7O2dDQUNYLHNCQUFzQjs7QUFKdEQsV0FBVyxDQUFDOztJQU1OLFVBQVU7QUFDSCxXQURQLFVBQVUsR0FDQTswQkFEVixVQUFVOztBQUVaLFFBQUksQ0FBQyxZQUFZLEdBQUcsd0JBQXdCLENBQUM7QUFDN0MsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyx1RkFBdUYsRUFBRSxHQUFHLENBQUMsQ0FBQztHQUM1SDs7ZUFKRyxVQUFVOztXQU1NLDhCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFDLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDOUIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRTtBQUNsQixpQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7O0FBRUQsWUFBSSxDQUFDLCtCQUFRLE1BQU0sRUFBRTtBQUNuQixpQkFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7O0FBRUQsdUNBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDM0MsY0FBSSxDQUFDLElBQUksRUFBRTtBQUNULG1CQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUN0Qjs7NkNBQ3VCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7OztjQUE3RCxPQUFPO2NBQUUsSUFBSTs7QUFDcEIseUNBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZELGdCQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QscUJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RCOztBQUVELGdCQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHFCQUFPLENBQUM7QUFDTixxQkFBSyxFQUFFLEtBQUs7QUFDWix3QkFBUSxFQUFBLG9CQUFHOztBQUVULHNCQUFNLFVBQVUsR0FBRyxrQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQU0sT0FBTyxTQUFJLElBQUksQ0FBQyxJQUFJLEFBQUUsQ0FBQztBQUN0Rix5REFBZ0IsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDekM7ZUFDRixDQUFDLENBQUM7YUFDSjs7QUFFRCxtQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2YsQ0FBQyxTQUFNLENBQUM7bUJBQU0sT0FBTyxDQUFDLElBQUksQ0FBQztXQUFBLENBQUMsQ0FBQztTQUMvQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBekNHLFVBQVU7OztxQkE0Q0QsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1oeXBlcmNsaWNrLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCB7IG9wZW5GaWxlQW5kR29UbyB9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuY2xhc3MgSHlwZXJjbGljayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvdmlkZXJOYW1lID0gJ2F0b20tdGVybmpzLWh5cGVyY2xpY2snO1xuICAgIHRoaXMud29yZFJlZ0V4cCA9IG5ldyBSZWdFeHAoJyhgKFxcXFxcXFxcLnxbXmBcXFxcXFxcXF0pKmApfChcXCcoXFxcXFxcXFwufFteXFwnXFxcXFxcXFxdKSpcXCcpfChcIihcXFxcXFxcXC58W15cIlxcXFxcXFxcXSkqXCIpfChbYS16QS1aMC05XyRdKyknLCAnZycpO1xuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoZWRpdG9yLCBzdHJpbmcsIHJhbmdlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAoIXN0cmluZy50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbWFuYWdlci5jbGllbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICB9XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW3Byb2plY3QsIGZpbGVdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSk7XG4gICAgICAgIG1hbmFnZXIuY2xpZW50LmdldERlZmluaXRpb24oZmlsZSwgcmFuZ2UpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG51bGwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuZmlsZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIHJhbmdlOiByYW5nZSxcbiAgICAgICAgICAgICAgY2FsbGJhY2soKSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoX3RvX2dvID0gcGF0aC5pc0Fic29sdXRlKGRhdGEuZmlsZSkgPyBkYXRhLmZpbGUgOiBgJHtwcm9qZWN0fS8ke2RhdGEuZmlsZX1gO1xuICAgICAgICAgICAgICAgIG9wZW5GaWxlQW5kR29UbyhkYXRhLnN0YXJ0LCBwYXRoX3RvX2dvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4gcmVzb2x2ZShudWxsKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSHlwZXJjbGljaygpO1xuIl19