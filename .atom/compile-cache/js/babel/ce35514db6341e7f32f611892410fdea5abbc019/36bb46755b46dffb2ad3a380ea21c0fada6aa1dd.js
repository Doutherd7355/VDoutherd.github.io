Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.checkTarget = checkTarget;
exports.recursiveViewDestroy = recursiveViewDestroy;
exports.resolveHome = resolveHome;
exports.mkdirSyncRecursive = mkdirSyncRecursive;
exports.statsToPermissions = statsToPermissions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSpacePenViews = require('atom-space-pen-views');

var _viewsDirectoryView = require('./views/directory-view');

var _viewsDirectoryView2 = _interopRequireDefault(_viewsDirectoryView);

'use babel';

var addIconToElement = undefined;

var checkIgnoreRemote = function checkIgnoreRemote(item) {
  return item && (item.name.attr('data-path') === '/' || !atom.project.remoteftp.checkIgnore(item.name.attr('data-path')));
};
exports.checkIgnoreRemote = checkIgnoreRemote;
var checkIgnoreLocal = function checkIgnoreLocal(item) {
  return !atom.project.remoteftp.checkIgnore(item);
};
exports.checkIgnoreLocal = checkIgnoreLocal;
var checkPaths = function checkPaths(index, elem) {
  return elem.getPath ? elem.getPath() : '';
};
exports.checkPaths = checkPaths;
var hasProject = function hasProject() {
  return atom.project && atom.project.getPaths().length;
};
exports.hasProject = hasProject;
var multipleHostsEnabled = function multipleHostsEnabled() {
  return atom.config.get('remote-ftp.beta.multipleHosts');
};
exports.multipleHostsEnabled = multipleHostsEnabled;
var hasOwnProperty = function hasOwnProperty(_ref) {
  var obj = _ref.obj;
  var prop = _ref.prop;
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
exports.hasOwnProperty = hasOwnProperty;
var splitPaths = function splitPaths(path) {
  return path.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
};

exports.splitPaths = splitPaths;
var simpleSort = function simpleSort(a, b) {
  if (a.name === b.name) {
    return 0;
  }

  return a.name > b.name ? 1 : -1;
};

exports.simpleSort = simpleSort;
var simpleSortDepth = function simpleSortDepth(a, b) {
  if (a.depth === b.depth) {
    return 0;
  }

  return a.depth > b.depth ? -1 : 1;
};

exports.simpleSortDepth = simpleSortDepth;
var sortDepth = function sortDepth(a, b) {
  if (a.depth === b.depth) {
    return 0;
  }

  return a.depth > b.depth ? 1 : -1;
};

exports.sortDepth = sortDepth;
var countDepth = function countDepth(file) {
  file.depth = file.name.replace(/\\/g, '/').split('/').length;
};

exports.countDepth = countDepth;
var getObject = function getObject(_ref2) {
  var keys = _ref2.keys;
  var obj = _ref2.obj;

  if (!(keys instanceof Array)) throw new Error('keys is not an array');
  if (typeof obj !== 'object') throw new Error('obj is not an object');

  return keys.reduce(function (ret, key) {
    if (ret && hasOwnProperty({ obj: ret, prop: key })) return ret[key];
    return false;
  }, obj);
};

exports.getObject = getObject;
var setIconHandler = function setIconHandler(fn) {
  addIconToElement = fn;
};

exports.setIconHandler = setIconHandler;
var getIconHandler = function getIconHandler() {
  return addIconToElement;
};

exports.getIconHandler = getIconHandler;
var elapsedTime = function elapsedTime(milliseconds) {
  var ms = milliseconds;

  var days = Math.floor(ms / 86400000);
  ms %= 86400000;
  var hours = Math.floor(ms / 3600000);
  ms %= 3600000;
  var mins = Math.floor(ms / 60000);
  ms %= 60000;
  var secs = Math.floor(ms / 1000);
  ms %= 1000;

  return ((days ? days + 'd ' : '') + (hours ? (days && hours < 10 ? '0' : '') + hours + 'h ' : '') + (mins ? ((days || hours) && mins < 10 ? '0' : '') + mins + 'm ' : '') + (secs ? ((days || hours || mins) && secs < 10 ? '0' : '') + secs + 's ' : '')).replace(/^[dhms]\s+/, '').replace(/[dhms]\s+[dhms]/g, '').replace(/^\s+/, '').replace(/\s+$/, '') || '0s';
};

exports.elapsedTime = elapsedTime;
var separateRemoteItems = function separateRemoteItems(folder) {
  if (!folder) return false;

  var list = [];
  var filter = function filter(item) {
    if (item.name === '.' || item.name === '..') return;

    if (item.type !== 'd' && item.type !== 'l') {
      item.type = 'f';
    }

    list.push(item);
  };

  folder.forEach(filter);

  return list;
};

exports.separateRemoteItems = separateRemoteItems;
var logger = function logger(text) {
  console.log(text);
};

exports.logger = logger;
var localFilePrepare = function localFilePrepare(fileName, currentPath) {
  var file = undefined;
  var queue = undefined;

  if (fileName !== '.' && fileName !== '..') {
    var fullName = _path2['default'].join(currentPath, fileName);

    var stats = _fs2['default'].statSync(fullName);
    file = {
      name: fullName,
      size: stats.size,
      date: stats.mtime,
      type: stats.isFile() ? 'f' : 'd'
    };

    if (!stats.isFile()) {
      queue = fullName;
    }
  }

  return { file: file, queue: queue };
};

exports.localFilePrepare = localFilePrepare;
var traverseTree = function traverseTree(localPath, callback) {
  var list = [localFilePrepare('', localPath).file];
  var queue = [localPath];

  // search all files in localPath recursively
  while (queue.length > 0) {
    var currentPath = _path2['default'].normalize(queue.pop());

    if (!_fs2['default'].existsSync(currentPath)) {
      _fs2['default'].closeSync(_fs2['default'].openSync(currentPath, 'w'));
    }

    var filesFound = _fs2['default'].readdirSync(currentPath);

    var localFile = undefined;
    for (var i = 0; i < filesFound.length; i++) {
      localFile = localFilePrepare(filesFound[i], currentPath);
      list.push(localFile.file);

      if (localFile.queue) {
        queue.push(localFile.queue);
      }
    }
  }

  // depth counting & sorting
  list.forEach(countDepth);
  list.sort(sortDepth);

  // callback
  if (typeof callback === 'function') callback.apply(null, [list]);
};

exports.traverseTree = traverseTree;
var validateConfig = function validateConfig(data, configFileName) {
  try {
    // try to parse the json
    JSON.parse(data);
    return true;
  } catch (error) {
    (function () {
      // try to extract bad syntax location from error message
      var lineNumber = -1;
      var index = undefined;
      var regex = /at position ([0-9]+)$/;
      var result = error.message.match(regex);
      if (result && result.length > 0) {
        var cursorPos = parseInt(result[1], 10);
        // count lines until syntax error position
        var tmp = data.substr(0, cursorPos);
        for (lineNumber = -1, index = 0; index !== -1; lineNumber++, index = tmp.indexOf('\n', index + 1));
      }

      // show notification
      atom.notifications.addError('Could not parse `' + configFileName + '`', {
        detail: '' + error.message,
        dismissable: false
      });

      // open .ftpconfig file and mark the faulty line
      atom.workspace.open(configFileName).then(function (editor) {
        if (lineNumber === -1) return; // no line number to mark

        var decorationConfig = {
          'class': 'ftpconfig_line_error'
        };

        editor.getDecorations(decorationConfig).forEach(function (decoration) {
          decoration.destroy();
        });

        var range = editor.getBuffer().clipRange([[lineNumber, 0], [lineNumber, Infinity]]);

        var marker = editor.markBufferRange(range, {
          invalidate: 'inside'
        });

        decorationConfig.type = 'line';
        editor.decorateMarker(marker, decorationConfig);
      });
    })();
  }

  // return false, as the json is not valid
  return false;
};

exports.validateConfig = validateConfig;
var resolveTree = function resolveTree(path) {
  var views = (0, _atomSpacePenViews.$)('.remote-ftp-view [data-path="' + path + '"]');

  return views.map(function (err, item) {
    return (0, _atomSpacePenViews.$)(item).view() || null;
  }).get(0);
};

exports.resolveTree = resolveTree;
var getSelectedTree = function getSelectedTree() {
  var views = (0, _atomSpacePenViews.$)('.remote-ftp-view .selected');

  return views.map(function (err, item) {
    return (0, _atomSpacePenViews.$)(item).view() || null;
  }).get();
};

exports.getSelectedTree = getSelectedTree;

function checkTarget(e) {
  var disableRoot = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var view = (0, _atomSpacePenViews.$)(e.currentTarget).view();
  var hasProjectRoot = view.hasClass('project-root');
  var hasProjectRootHeader = (0, _atomSpacePenViews.$)(e.target).hasClass('project-root-header');

  if (!view || view instanceof _viewsDirectoryView2['default'] === false) return false;
  if (disableRoot && hasProjectRoot && !hasProjectRootHeader) return false;

  return true;
}

function recursiveViewDestroy(view) {
  view.getItemViews().folders.forEach(function (fView) {
    recursiveViewDestroy(fView);
    fView.destroy();
  });
}

function resolveHome(path) {
  return _path2['default'].normalize(path.replace('~', _os2['default'].homedir()));
}

function mkdirSyncRecursive(path) {
  var sep = _path2['default'].sep;
  var initDir = _path2['default'].isAbsolute(path) ? sep : '';

  path.split(sep).reduce(function (parentDir, childDir) {
    var curDir = _path2['default'].resolve(parentDir, childDir);
    if (!_fs2['default'].existsSync(curDir)) _fs2['default'].mkdirSync(curDir);

    return curDir;
  }, initDir);
}

function statsToPermissions(stats) {
  /* eslint no-bitwise: 0 */
  var PER_OTHER = { 1: 'x', 2: 'w', 4: 'r' };
  var PER_GROUP = { 8: 'x', 16: 'w', 32: 'r' };
  var PER_OWNER = { 64: 'x', 128: 'w', 256: 'r' };

  return {
    other: Object.keys(PER_OTHER).map(function (elem) {
      return stats.mode & elem ? PER_OTHER[elem] : '';
    }).reverse().join(''),
    group: Object.keys(PER_GROUP).map(function (elem) {
      return stats.mode & elem ? PER_GROUP[elem] : '';
    }).reverse().join(''),
    user: Object.keys(PER_OWNER).map(function (elem) {
      return stats.mode & elem ? PER_OWNER[elem] : '';
    }).reverse().join('')
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7a0JBQ0osSUFBSTs7OztvQkFDRixNQUFNOzs7O2lDQUNMLHNCQUFzQjs7a0NBQ2Qsd0JBQXdCOzs7O0FBTmxELFdBQVcsQ0FBQzs7QUFRWixJQUFJLGdCQUFnQixZQUFBLENBQUM7O0FBRWQsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBRyxJQUFJO1NBQUssSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEFBQUM7Q0FBQyxDQUFDOztBQUN4SixJQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixDQUFHLElBQUk7U0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7Q0FBQyxDQUFDOztBQUM3RSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUUsSUFBSTtTQUFNLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Q0FBQyxDQUFDOztBQUN6RSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVU7U0FBUyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTTtDQUFBLENBQUM7O0FBQ3hFLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CO1NBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUM7Q0FBQSxDQUFDOztBQUNw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cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgJCB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCBEaXJlY3RvcnlWaWV3IGZyb20gJy4vdmlld3MvZGlyZWN0b3J5LXZpZXcnO1xuXG5sZXQgYWRkSWNvblRvRWxlbWVudDtcblxuZXhwb3J0IGNvbnN0IGNoZWNrSWdub3JlUmVtb3RlID0gaXRlbSA9PiAoaXRlbSAmJiAoaXRlbS5uYW1lLmF0dHIoJ2RhdGEtcGF0aCcpID09PSAnLycgfHwgKCFhdG9tLnByb2plY3QucmVtb3RlZnRwLmNoZWNrSWdub3JlKGl0ZW0ubmFtZS5hdHRyKCdkYXRhLXBhdGgnKSkpKSk7XG5leHBvcnQgY29uc3QgY2hlY2tJZ25vcmVMb2NhbCA9IGl0ZW0gPT4gKCFhdG9tLnByb2plY3QucmVtb3RlZnRwLmNoZWNrSWdub3JlKGl0ZW0pKTtcbmV4cG9ydCBjb25zdCBjaGVja1BhdGhzID0gKGluZGV4LCBlbGVtKSA9PiAoZWxlbS5nZXRQYXRoID8gZWxlbS5nZXRQYXRoKCkgOiAnJyk7XG5leHBvcnQgY29uc3QgaGFzUHJvamVjdCA9ICgpID0+IGF0b20ucHJvamVjdCAmJiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGg7XG5leHBvcnQgY29uc3QgbXVsdGlwbGVIb3N0c0VuYWJsZWQgPSAoKSA9PiBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAuYmV0YS5tdWx0aXBsZUhvc3RzJyk7XG5leHBvcnQgY29uc3QgaGFzT3duUHJvcGVydHkgPSAoeyBvYmosIHByb3AgfSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG5leHBvcnQgY29uc3Qgc3BsaXRQYXRocyA9IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9eXFwvKy8sICcnKS5yZXBsYWNlKC9cXC8rJC8sICcnKS5zcGxpdCgnLycpO1xuXG5leHBvcnQgY29uc3Qgc2ltcGxlU29ydCA9IChhLCBiKSA9PiB7XG4gIGlmIChhLm5hbWUgPT09IGIubmFtZSkgeyByZXR1cm4gMDsgfVxuXG4gIHJldHVybiBhLm5hbWUgPiBiLm5hbWUgPyAxIDogLTE7XG59O1xuXG5leHBvcnQgY29uc3Qgc2ltcGxlU29ydERlcHRoID0gKGEsIGIpID0+IHtcbiAgaWYgKGEuZGVwdGggPT09IGIuZGVwdGgpIHsgcmV0dXJuIDA7IH1cblxuICByZXR1cm4gYS5kZXB0aCA+IGIuZGVwdGggPyAtMSA6IDE7XG59O1xuXG5leHBvcnQgY29uc3Qgc29ydERlcHRoID0gKGEsIGIpID0+IHtcbiAgaWYgKGEuZGVwdGggPT09IGIuZGVwdGgpIHsgcmV0dXJuIDA7IH1cblxuICByZXR1cm4gYS5kZXB0aCA+IGIuZGVwdGggPyAxIDogLTE7XG59O1xuXG5leHBvcnQgY29uc3QgY291bnREZXB0aCA9IChmaWxlKSA9PiB7XG4gIGZpbGUuZGVwdGggPSBmaWxlLm5hbWUucmVwbGFjZSgvXFxcXC9nLCAnLycpLnNwbGl0KCcvJykubGVuZ3RoO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldE9iamVjdCA9ICh7IGtleXMsIG9iaiB9KSA9PiB7XG4gIGlmICghKGtleXMgaW5zdGFuY2VvZiBBcnJheSkpIHRocm93IG5ldyBFcnJvcigna2V5cyBpcyBub3QgYW4gYXJyYXknKTtcbiAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgRXJyb3IoJ29iaiBpcyBub3QgYW4gb2JqZWN0Jyk7XG5cbiAgcmV0dXJuIGtleXMucmVkdWNlKChyZXQsIGtleSkgPT4ge1xuICAgIGlmIChyZXQgJiYgaGFzT3duUHJvcGVydHkoeyBvYmo6IHJldCwgcHJvcDoga2V5IH0pKSByZXR1cm4gcmV0W2tleV07XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LCBvYmopO1xufTtcblxuZXhwb3J0IGNvbnN0IHNldEljb25IYW5kbGVyID0gKGZuKSA9PiB7XG4gIGFkZEljb25Ub0VsZW1lbnQgPSBmbjtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRJY29uSGFuZGxlciA9ICgpID0+IGFkZEljb25Ub0VsZW1lbnQ7XG5cbmV4cG9ydCBjb25zdCBlbGFwc2VkVGltZSA9IChtaWxsaXNlY29uZHMpID0+IHtcbiAgbGV0IG1zID0gbWlsbGlzZWNvbmRzO1xuXG4gIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKG1zIC8gODY0MDAwMDApO1xuICBtcyAlPSA4NjQwMDAwMDtcbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKG1zIC8gMzYwMDAwMCk7XG4gIG1zICU9IDM2MDAwMDA7XG4gIGNvbnN0IG1pbnMgPSBNYXRoLmZsb29yKG1zIC8gNjAwMDApO1xuICBtcyAlPSA2MDAwMDtcbiAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3IobXMgLyAxMDAwKTtcbiAgbXMgJT0gMTAwMDtcblxuICByZXR1cm4gKChkYXlzID8gYCR7ZGF5c31kIGAgOiAnJykgK1xuICAgICAgKGhvdXJzID8gYCR7KChkYXlzKSAmJiBob3VycyA8IDEwID8gJzAnIDogJycpICsgaG91cnN9aCBgIDogJycpICtcbiAgICAgIChtaW5zID8gYCR7KChkYXlzIHx8IGhvdXJzKSAmJiBtaW5zIDwgMTAgPyAnMCcgOiAnJykgKyBtaW5zfW0gYCA6ICcnKSArXG4gICAgICAoc2VjcyA/IGAkeygoZGF5cyB8fCBob3VycyB8fCBtaW5zKSAmJiBzZWNzIDwgMTAgPyAnMCcgOiAnJykgKyBzZWNzfXMgYCA6ICcnKSlcbiAgICAucmVwbGFjZSgvXltkaG1zXVxccysvLCAnJylcbiAgICAucmVwbGFjZSgvW2RobXNdXFxzK1tkaG1zXS9nLCAnJylcbiAgICAucmVwbGFjZSgvXlxccysvLCAnJylcbiAgICAucmVwbGFjZSgvXFxzKyQvLCAnJykgfHwgJzBzJztcbn07XG5cbmV4cG9ydCBjb25zdCBzZXBhcmF0ZVJlbW90ZUl0ZW1zID0gKGZvbGRlcikgPT4ge1xuICBpZiAoIWZvbGRlcikgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IGxpc3QgPSBbXTtcbiAgY29uc3QgZmlsdGVyID0gKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbS5uYW1lID09PSAnLicgfHwgaXRlbS5uYW1lID09PSAnLi4nKSByZXR1cm47XG5cbiAgICBpZiAoaXRlbS50eXBlICE9PSAnZCcgJiYgaXRlbS50eXBlICE9PSAnbCcpIHtcbiAgICAgIGl0ZW0udHlwZSA9ICdmJztcbiAgICB9XG5cbiAgICBsaXN0LnB1c2goaXRlbSk7XG4gIH07XG5cbiAgZm9sZGVyLmZvckVhY2goZmlsdGVyKTtcblxuICByZXR1cm4gbGlzdDtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2dnZXIgPSAodGV4dCkgPT4ge1xuICBjb25zb2xlLmxvZyh0ZXh0KTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2NhbEZpbGVQcmVwYXJlID0gKGZpbGVOYW1lLCBjdXJyZW50UGF0aCkgPT4ge1xuICBsZXQgZmlsZTtcbiAgbGV0IHF1ZXVlO1xuXG4gIGlmIChmaWxlTmFtZSAhPT0gJy4nICYmIGZpbGVOYW1lICE9PSAnLi4nKSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSBQYXRoLmpvaW4oY3VycmVudFBhdGgsIGZpbGVOYW1lKTtcblxuICAgIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMoZnVsbE5hbWUpO1xuICAgIGZpbGUgPSB7XG4gICAgICBuYW1lOiBmdWxsTmFtZSxcbiAgICAgIHNpemU6IHN0YXRzLnNpemUsXG4gICAgICBkYXRlOiBzdGF0cy5tdGltZSxcbiAgICAgIHR5cGU6IHN0YXRzLmlzRmlsZSgpID8gJ2YnIDogJ2QnLFxuICAgIH07XG5cbiAgICBpZiAoIXN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICBxdWV1ZSA9IGZ1bGxOYW1lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGZpbGUsIHF1ZXVlIH07XG59O1xuXG5leHBvcnQgY29uc3QgdHJhdmVyc2VUcmVlID0gKGxvY2FsUGF0aCwgY2FsbGJhY2spID0+IHtcbiAgY29uc3QgbGlzdCA9IFtsb2NhbEZpbGVQcmVwYXJlKCcnLCBsb2NhbFBhdGgpLmZpbGVdO1xuICBjb25zdCBxdWV1ZSA9IFtsb2NhbFBhdGhdO1xuXG4gIC8vIHNlYXJjaCBhbGwgZmlsZXMgaW4gbG9jYWxQYXRoIHJlY3Vyc2l2ZWx5XG4gIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgY3VycmVudFBhdGggPSBQYXRoLm5vcm1hbGl6ZShxdWV1ZS5wb3AoKSk7XG5cbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoY3VycmVudFBhdGgpKSB7XG4gICAgICBmcy5jbG9zZVN5bmMoZnMub3BlblN5bmMoY3VycmVudFBhdGgsICd3JykpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVzRm91bmQgPSBmcy5yZWFkZGlyU3luYyhjdXJyZW50UGF0aCk7XG5cbiAgICBsZXQgbG9jYWxGaWxlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZXNGb3VuZC5sZW5ndGg7IGkrKykge1xuICAgICAgbG9jYWxGaWxlID0gbG9jYWxGaWxlUHJlcGFyZShmaWxlc0ZvdW5kW2ldLCBjdXJyZW50UGF0aCk7XG4gICAgICBsaXN0LnB1c2gobG9jYWxGaWxlLmZpbGUpO1xuXG4gICAgICBpZiAobG9jYWxGaWxlLnF1ZXVlKSB7XG4gICAgICAgIHF1ZXVlLnB1c2gobG9jYWxGaWxlLnF1ZXVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBkZXB0aCBjb3VudGluZyAmIHNvcnRpbmdcbiAgbGlzdC5mb3JFYWNoKGNvdW50RGVwdGgpO1xuICBsaXN0LnNvcnQoc29ydERlcHRoKTtcblxuICAvLyBjYWxsYmFja1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjay5hcHBseShudWxsLCBbbGlzdF0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQ29uZmlnID0gKGRhdGEsIGNvbmZpZ0ZpbGVOYW1lKSA9PiB7XG4gIHRyeSB7XG4gICAgLy8gdHJ5IHRvIHBhcnNlIHRoZSBqc29uXG4gICAgSlNPTi5wYXJzZShkYXRhKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyB0cnkgdG8gZXh0cmFjdCBiYWQgc3ludGF4IGxvY2F0aW9uIGZyb20gZXJyb3IgbWVzc2FnZVxuICAgIGxldCBsaW5lTnVtYmVyID0gLTE7XG4gICAgbGV0IGluZGV4O1xuICAgIGNvbnN0IHJlZ2V4ID0gL2F0IHBvc2l0aW9uIChbMC05XSspJC87XG4gICAgY29uc3QgcmVzdWx0ID0gZXJyb3IubWVzc2FnZS5tYXRjaChyZWdleCk7XG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY3Vyc29yUG9zID0gcGFyc2VJbnQocmVzdWx0WzFdLCAxMCk7XG4gICAgICAvLyBjb3VudCBsaW5lcyB1bnRpbCBzeW50YXggZXJyb3IgcG9zaXRpb25cbiAgICAgIGNvbnN0IHRtcCA9IGRhdGEuc3Vic3RyKDAsIGN1cnNvclBvcyk7XG4gICAgICBmb3IgKGxpbmVOdW1iZXIgPSAtMSwgaW5kZXggPSAwOyBpbmRleCAhPT0gLTE7IGxpbmVOdW1iZXIrKywgaW5kZXggPSB0bXAuaW5kZXhPZignXFxuJywgaW5kZXggKyAxKSk7XG4gICAgfVxuXG4gICAgLy8gc2hvdyBub3RpZmljYXRpb25cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYENvdWxkIG5vdCBwYXJzZSBcXGAke2NvbmZpZ0ZpbGVOYW1lfVxcYGAsIHtcbiAgICAgIGRldGFpbDogYCR7ZXJyb3IubWVzc2FnZX1gLFxuICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gb3BlbiAuZnRwY29uZmlnIGZpbGUgYW5kIG1hcmsgdGhlIGZhdWx0eSBsaW5lXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbihjb25maWdGaWxlTmFtZSkudGhlbigoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAobGluZU51bWJlciA9PT0gLTEpIHJldHVybjsgLy8gbm8gbGluZSBudW1iZXIgdG8gbWFya1xuXG4gICAgICBjb25zdCBkZWNvcmF0aW9uQ29uZmlnID0ge1xuICAgICAgICBjbGFzczogJ2Z0cGNvbmZpZ19saW5lX2Vycm9yJyxcbiAgICAgIH07XG5cbiAgICAgIGVkaXRvci5nZXREZWNvcmF0aW9ucyhkZWNvcmF0aW9uQ29uZmlnKS5mb3JFYWNoKChkZWNvcmF0aW9uKSA9PiB7XG4gICAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJhbmdlID0gZWRpdG9yLmdldEJ1ZmZlcigpLmNsaXBSYW5nZShbXG4gICAgICAgIFtsaW5lTnVtYmVyLCAwXSxcbiAgICAgICAgW2xpbmVOdW1iZXIsIEluZmluaXR5XSxcbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICdpbnNpZGUnLFxuICAgICAgfSk7XG5cbiAgICAgIGRlY29yYXRpb25Db25maWcudHlwZSA9ICdsaW5lJztcbiAgICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIGRlY29yYXRpb25Db25maWcpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gcmV0dXJuIGZhbHNlLCBhcyB0aGUganNvbiBpcyBub3QgdmFsaWRcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlc29sdmVUcmVlID0gKHBhdGgpID0+IHtcbiAgY29uc3Qgdmlld3MgPSAkKGAucmVtb3RlLWZ0cC12aWV3IFtkYXRhLXBhdGg9XCIke3BhdGh9XCJdYCk7XG5cbiAgcmV0dXJuIHZpZXdzLm1hcCgoZXJyLCBpdGVtKSA9PiAkKGl0ZW0pLnZpZXcoKSB8fCBudWxsKS5nZXQoMCk7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0U2VsZWN0ZWRUcmVlID0gKCkgPT4ge1xuICBjb25zdCB2aWV3cyA9ICQoJy5yZW1vdGUtZnRwLXZpZXcgLnNlbGVjdGVkJyk7XG5cbiAgcmV0dXJuIHZpZXdzLm1hcCgoZXJyLCBpdGVtKSA9PiAkKGl0ZW0pLnZpZXcoKSB8fCBudWxsKS5nZXQoKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1RhcmdldChlLCBkaXNhYmxlUm9vdCA9IGZhbHNlKSB7XG4gIGNvbnN0IHZpZXcgPSAkKGUuY3VycmVudFRhcmdldCkudmlldygpO1xuICBjb25zdCBoYXNQcm9qZWN0Um9vdCA9IHZpZXcuaGFzQ2xhc3MoJ3Byb2plY3Qtcm9vdCcpO1xuICBjb25zdCBoYXNQcm9qZWN0Um9vdEhlYWRlciA9ICQoZS50YXJnZXQpLmhhc0NsYXNzKCdwcm9qZWN0LXJvb3QtaGVhZGVyJyk7XG5cbiAgaWYgKCF2aWV3IHx8IHZpZXcgaW5zdGFuY2VvZiBEaXJlY3RvcnlWaWV3ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICBpZiAoZGlzYWJsZVJvb3QgJiYgaGFzUHJvamVjdFJvb3QgJiYgIWhhc1Byb2plY3RSb290SGVhZGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVWaWV3RGVzdHJveSh2aWV3KSB7XG4gIHZpZXcuZ2V0SXRlbVZpZXdzKCkuZm9sZGVycy5mb3JFYWNoKChmVmlldykgPT4ge1xuICAgIHJlY3Vyc2l2ZVZpZXdEZXN0cm95KGZWaWV3KTtcbiAgICBmVmlldy5kZXN0cm95KCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUhvbWUocGF0aCkge1xuICByZXR1cm4gUGF0aC5ub3JtYWxpemUocGF0aC5yZXBsYWNlKCd+Jywgb3MuaG9tZWRpcigpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBta2RpclN5bmNSZWN1cnNpdmUocGF0aCkge1xuICBjb25zdCBzZXAgPSBQYXRoLnNlcDtcbiAgY29uc3QgaW5pdERpciA9IFBhdGguaXNBYnNvbHV0ZShwYXRoKSA/IHNlcCA6ICcnO1xuXG4gIHBhdGguc3BsaXQoc2VwKS5yZWR1Y2UoKHBhcmVudERpciwgY2hpbGREaXIpID0+IHtcbiAgICBjb25zdCBjdXJEaXIgPSBQYXRoLnJlc29sdmUocGFyZW50RGlyLCBjaGlsZERpcik7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGN1ckRpcikpIGZzLm1rZGlyU3luYyhjdXJEaXIpO1xuXG4gICAgcmV0dXJuIGN1ckRpcjtcbiAgfSwgaW5pdERpcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGF0c1RvUGVybWlzc2lvbnMoc3RhdHMpIHtcbiAgLyogZXNsaW50IG5vLWJpdHdpc2U6IDAgKi9cbiAgY29uc3QgUEVSX09USEVSID0geyAxOiAneCcsIDI6ICd3JywgNDogJ3InIH07XG4gIGNvbnN0IFBFUl9HUk9VUCA9IHsgODogJ3gnLCAxNjogJ3cnLCAzMjogJ3InIH07XG4gIGNvbnN0IFBFUl9PV05FUiA9IHsgNjQ6ICd4JywgMTI4OiAndycsIDI1NjogJ3InIH07XG5cbiAgcmV0dXJuIHtcbiAgICBvdGhlcjogT2JqZWN0LmtleXMoUEVSX09USEVSKS5tYXAoZWxlbSA9PiAoKHN0YXRzLm1vZGUgJiBlbGVtKSA/IFBFUl9PVEhFUltlbGVtXSA6ICcnKSkucmV2ZXJzZSgpLmpvaW4oJycpLFxuICAgIGdyb3VwOiBPYmplY3Qua2V5cyhQRVJfR1JPVVApLm1hcChlbGVtID0+ICgoc3RhdHMubW9kZSAmIGVsZW0pID8gUEVSX0dST1VQW2VsZW1dIDogJycpKS5yZXZlcnNlKCkuam9pbignJyksXG4gICAgdXNlcjogT2JqZWN0LmtleXMoUEVSX09XTkVSKS5tYXAoZWxlbSA9PiAoKHN0YXRzLm1vZGUgJiBlbGVtKSA/IFBFUl9PV05FUltlbGVtXSA6ICcnKSkucmV2ZXJzZSgpLmpvaW4oJycpLFxuICB9O1xufVxuIl19