Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _eventKit = require('event-kit');

var _helpers = require('./helpers');

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

'use babel';

var Directory = (function () {
  function Directory(params) {
    var _this = this;

    _classCallCheck(this, Directory);

    this.emitter = new _eventKit.Emitter();

    this.parent = null;
    this.name = '';
    this.path = '';
    this.client = null;
    this.isExpanded = false;
    this.isSelected = false;
    this.status = 0;
    this.folders = [];
    this.files = [];
    this.original = null;

    Object.keys(params).forEach(function (n) {
      if (Object.prototype.hasOwnProperty.call(_this, n)) {
        _this[n] = params[n];
      }
    });
  }

  _createClass(Directory, [{
    key: 'destroy',
    value: function destroy() {
      this.folders.forEach(function (folder) {
        folder.destroy();
      });
      this.folders = [];

      this.files.forEach(function (file) {
        file.destroy();
      });
      this.files = [];

      if (!this.isRoot) {
        this.emitter.emit('destroyed');
        this.emitter.dispose();
      }
    }
  }, {
    key: 'sort',
    value: function sort() {
      this.folders.sort(_helpers.simpleSort);
      this.files.sort(_helpers.simpleSort);
    }
  }, {
    key: 'exists',
    value: function exists(name, isdir) {
      if (isdir) {
        for (var a = 0, b = this.folders.length; a < b; ++a) {
          if (this.folders[a].name === name) {
            return a;
          }
        }
      } else {
        for (var a = 0, b = this.files.length; a < b; ++a) {
          if (this.files[a].name === name) {
            return a;
          }
        }
      }

      return null;
    }
  }, {
    key: 'open',
    value: function open(recursive, complete) {
      var _this2 = this;

      var client = this.root.client;

      client.list(this.remote, false, function (err, list) {
        if (err) {
          atom.notifications.addError('Remote FTP: ' + err, {
            dismissable: false
          });
          return;
        }

        _this2.status = 1;

        var folders = [];
        var files = [];

        list.forEach(function (item) {
          var name = _path2['default'].basename(item.name);
          var index = undefined;
          var entry = undefined;

          if (item.type === 'd' || item.type === 'l') {
            if (name === '.' || name === '..') {
              return;
            }

            index = _this2.exists(name, true);

            if (index === null) {
              entry = new Directory({
                parent: _this2,
                original: item,
                name: name
              });
            } else {
              entry = _this2.folders[index];
              _this2.folders.splice(index, 1);
            }

            folders.push(entry);

            _this2.emitter.emit('did-change-folder', folders);
          } else {
            index = _this2.exists(name, true);

            if (index === null) {
              entry = new _file2['default']({
                parent: _this2,
                original: item,
                name: name
              });
            } else {
              entry = _this2.files[index];
              _this2.files.splice(index, 1);
            }

            entry.size = item.size;
            entry.date = item.date;

            files.push(entry);

            _this2.emitter.emit('did-change-file', files);
          }
        });

        _this2.folders.forEach(function (folder) {
          folder.destroy();
        });
        _this2.folders = folders;

        _this2.files.forEach(function (file) {
          file.destroy();
        });
        _this2.files = files;

        if (recursive) {
          _this2.folders.forEach(function (folder) {
            if (folder.status === 0) {
              return;
            }

            folder.open(true);
          });
        }

        if (typeof complete === 'function') {
          complete.call(null);
        }

        _this2.emitter.emit('did-change-items', _this2);
      });
    }
  }, {
    key: 'openPath',
    value: function openPath(opath) {
      var _this3 = this;

      var remainingPath = opath.replace(this.remote, '');

      if (remainingPath.startsWith('/')) {
        remainingPath = remainingPath.substr(1);
      }

      if (remainingPath.length > 0) {
        var remainingPathSplit = remainingPath.split('/');

        if (remainingPathSplit.length > 0 && this.folders.length > 0) {
          (function () {
            var nextPath = _this3.remote;

            if (!nextPath.endsWith('/')) {
              nextPath += '/';
            }

            nextPath += remainingPathSplit[0];

            _this3.folders.forEach(function (folder) {
              if (folder.remote === nextPath) {
                folder.isExpanded = true;

                if (folder.folders.length > 0) {
                  folder.openPath(opath);
                } else {
                  folder.open(false, function () {
                    folder.openPath(opath);
                  });
                }
              }
            });
          })();
        }
      }
    }
  }, {
    key: 'onChangeFolder',
    value: function onChangeFolder(callback) {
      return this.emitter.on('did-change-folder', callback);
    }
  }, {
    key: 'onChangeFile',
    value: function onChangeFile(callback) {
      return this.emitter.on('did-change-file', callback);
    }
  }, {
    key: 'onChangeItems',
    value: function onChangeItems(callback) {
      return this.emitter.on('did-change-items', callback);
    }
  }, {
    key: 'onChangeExpanded',
    value: function onChangeExpanded(callback) {
      return this.emitter.on('did-change-expanded', callback);
    }
  }, {
    key: 'onChangeSelect',
    value: function onChangeSelect(callback) {
      return this.emitter.on('did-change-select', callback);
    }
  }, {
    key: 'onDestroyed',
    value: function onDestroyed(callback) {
      return this.emitter.on('destroyed', callback);
    }
  }, {
    key: 'isRoot',
    get: function get() {
      return this.parent === null;
    }
  }, {
    key: 'root',
    get: function get() {
      if (this.parent) {
        return this.parent.root;
      }

      return this;
    }
  }, {
    key: 'local',
    get: function get() {
      if (this.parent) {
        var p = _path2['default'].normalize(_path2['default'].join(this.parent.local, this.name));

        if (_path2['default'].sep !== '/') p = p.replace(/\\/g, '/');

        return p;
      }

      return (0, _helpers.multipleHostsEnabled)() === true ? this.client.projectPath : atom.project.getPaths()[0];
    }
  }, {
    key: 'remote',
    get: function get() {
      if (this.parent) {
        var p = _path2['default'].normalize(_path2['default'].join(this.parent.remote, this.name));

        if (_path2['default'].sep !== '/') p = p.replace(/\\/g, '/');

        return p;
      }

      return this.path;
    }
  }, {
    key: 'setIsExpanded',
    set: function set(value) {
      this.emitter.emit('did-change-expanded', value);
      this.isExpanded = value;
    }
  }, {
    key: 'setIsSelected',
    set: function set(value) {
      this.isSelected = value;
      this.emitter.emit('did-change-select', value);
    }
  }]);

  return Directory;
})();

exports['default'] = Directory;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaXJlY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7Ozt3QkFDQyxXQUFXOzt1QkFDYyxXQUFXOztvQkFDM0MsUUFBUTs7OztBQUx6QixXQUFXLENBQUM7O0lBT04sU0FBUztBQUNGLFdBRFAsU0FBUyxDQUNELE1BQU0sRUFBRTs7OzBCQURoQixTQUFTOztBQUVYLFFBQUksQ0FBQyxPQUFPLEdBQUcsdUJBQWEsQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixVQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNqQyxVQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksUUFBTyxDQUFDLENBQUMsRUFBRTtBQUNqRCxjQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNyQjtLQUNGLENBQUMsQ0FBQztHQUNKOztlQXBCRyxTQUFTOztXQXNCTixtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMs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LENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVqRSxZQUFJLGtCQUFLLEdBQUcsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVoRCxlQUFPLENBQUMsQ0FBQztPQUNWOztBQUVELGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjs7O1NBRWdCLGFBQUMsS0FBSyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0tBQ3pCOzs7U0FFZ0IsYUFBQyxLQUFLLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7OztTQXJQRyxTQUFTOzs7cUJBd1BBLFNBQVMiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2RpcmVjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEVtaXR0ZXIgfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHsgbXVsdGlwbGVIb3N0c0VuYWJsZWQsIHNpbXBsZVNvcnQgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlJztcblxuY2xhc3MgRGlyZWN0b3J5IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLm5hbWUgPSAnJztcbiAgICB0aGlzLnBhdGggPSAnJztcbiAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgdGhpcy5pc0V4cGFuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc1NlbGVjdGVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSAwO1xuICAgIHRoaXMuZm9sZGVycyA9IFtdO1xuICAgIHRoaXMuZmlsZXMgPSBbXTtcbiAgICB0aGlzLm9yaWdpbmFsID0gbnVsbDtcblxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaCgobikgPT4ge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBuKSkge1xuICAgICAgICB0aGlzW25dID0gcGFyYW1zW25dO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmZvbGRlcnMuZm9yRWFjaCgoZm9sZGVyKSA9PiB7XG4gICAgICBmb2xkZXIuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9sZGVycyA9IFtdO1xuXG4gICAgdGhpcy5maWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICBmaWxlLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICB0aGlzLmZpbGVzID0gW107XG5cbiAgICBpZiAoIXRoaXMuaXNSb290KSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGVzdHJveWVkJyk7XG4gICAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNvcnQoKSB7XG4gICAgdGhpcy5mb2xkZXJzLnNvcnQoc2ltcGxlU29ydCk7XG4gICAgdGhpcy5maWxlcy5zb3J0KHNpbXBsZVNvcnQpO1xuICB9XG5cbiAgZXhpc3RzKG5hbWUsIGlzZGlyKSB7XG4gICAgaWYgKGlzZGlyKSB7XG4gICAgICBmb3IgKGxldCBhID0gMCwgYiA9IHRoaXMuZm9sZGVycy5sZW5ndGg7IGEgPCBiOyArK2EpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9sZGVyc1thXS5uYW1lID09PSBuYW1lKSB7IHJldHVybiBhOyB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGEgPSAwLCBiID0gdGhpcy5maWxlcy5sZW5ndGg7IGEgPCBiOyArK2EpIHtcbiAgICAgICAgaWYgKHRoaXMuZmlsZXNbYV0ubmFtZSA9PT0gbmFtZSkgeyByZXR1cm4gYTsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgb3BlbihyZWN1cnNpdmUsIGNvbXBsZXRlKSB7XG4gICAgY29uc3QgY2xpZW50ID0gdGhpcy5yb290LmNsaWVudDtcblxuICAgIGNsaWVudC5saXN0KHRoaXMucmVtb3RlLCBmYWxzZSwgKGVyciwgbGlzdCkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFJlbW90ZSBGVFA6ICR7ZXJyfWAsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhdHVzID0gMTtcblxuICAgICAgY29uc3QgZm9sZGVycyA9IFtdO1xuICAgICAgY29uc3QgZmlsZXMgPSBbXTtcblxuICAgICAgbGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBwYXRoLmJhc2VuYW1lKGl0ZW0ubmFtZSk7XG4gICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgbGV0IGVudHJ5O1xuXG4gICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdkJyB8fCBpdGVtLnR5cGUgPT09ICdsJykge1xuICAgICAgICAgIGlmIChuYW1lID09PSAnLicgfHwgbmFtZSA9PT0gJy4uJykgeyByZXR1cm47IH1cblxuICAgICAgICAgIGluZGV4ID0gdGhpcy5leGlzdHMobmFtZSwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIGVudHJ5ID0gbmV3IERpcmVjdG9yeSh7XG4gICAgICAgICAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgICAgICAgICAgb3JpZ2luYWw6IGl0ZW0sXG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW50cnkgPSB0aGlzLmZvbGRlcnNbaW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5mb2xkZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9sZGVycy5wdXNoKGVudHJ5KTtcblxuICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWZvbGRlcicsIGZvbGRlcnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGluZGV4ID0gdGhpcy5leGlzdHMobmFtZSwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIGVudHJ5ID0gbmV3IEZpbGUoe1xuICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIG9yaWdpbmFsOiBpdGVtLFxuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5ID0gdGhpcy5maWxlc1tpbmRleF07XG4gICAgICAgICAgICB0aGlzLmZpbGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZW50cnkuc2l6ZSA9IGl0ZW0uc2l6ZTtcbiAgICAgICAgICBlbnRyeS5kYXRlID0gaXRlbS5kYXRlO1xuXG4gICAgICAgICAgZmlsZXMucHVzaChlbnRyeSk7XG5cbiAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1maWxlJywgZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5mb2xkZXJzLmZvckVhY2goKGZvbGRlcikgPT4geyBmb2xkZXIuZGVzdHJveSgpOyB9KTtcbiAgICAgIHRoaXMuZm9sZGVycyA9IGZvbGRlcnM7XG5cbiAgICAgIHRoaXMuZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4geyBmaWxlLmRlc3Ryb3koKTsgfSk7XG4gICAgICB0aGlzLmZpbGVzID0gZmlsZXM7XG5cbiAgICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgICAgdGhpcy5mb2xkZXJzLmZvckVhY2goKGZvbGRlcikgPT4ge1xuICAgICAgICAgIGlmIChmb2xkZXIuc3RhdHVzID09PSAwKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgZm9sZGVyLm9wZW4odHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIChjb21wbGV0ZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29tcGxldGUuY2FsbChudWxsKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaXRlbXMnLCB0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9wZW5QYXRoKG9wYXRoKSB7XG4gICAgbGV0IHJlbWFpbmluZ1BhdGggPSBvcGF0aC5yZXBsYWNlKHRoaXMucmVtb3RlLCAnJyk7XG5cbiAgICBpZiAocmVtYWluaW5nUGF0aC5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHJlbWFpbmluZ1BhdGggPSByZW1haW5pbmdQYXRoLnN1YnN0cigxKTtcbiAgICB9XG5cbiAgICBpZiAocmVtYWluaW5nUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCByZW1haW5pbmdQYXRoU3BsaXQgPSByZW1haW5pbmdQYXRoLnNwbGl0KCcvJyk7XG5cbiAgICAgIGlmIChyZW1haW5pbmdQYXRoU3BsaXQubGVuZ3RoID4gMCAmJiB0aGlzLmZvbGRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgbmV4dFBhdGggPSB0aGlzLnJlbW90ZTtcblxuICAgICAgICBpZiAoIW5leHRQYXRoLmVuZHNXaXRoKCcvJykpIHsgbmV4dFBhdGggKz0gJy8nOyB9XG5cbiAgICAgICAgbmV4dFBhdGggKz0gcmVtYWluaW5nUGF0aFNwbGl0WzBdO1xuXG4gICAgICAgIHRoaXMuZm9sZGVycy5mb3JFYWNoKChmb2xkZXIpID0+IHtcbiAgICAgICAgICBpZiAoZm9sZGVyLnJlbW90ZSA9PT0gbmV4dFBhdGgpIHtcbiAgICAgICAgICAgIGZvbGRlci5pc0V4cGFuZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGZvbGRlci5mb2xkZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZm9sZGVyLm9wZW5QYXRoKG9wYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvbGRlci5vcGVuKGZhbHNlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9sZGVyLm9wZW5QYXRoKG9wYXRoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZUZvbGRlcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtZm9sZGVyJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25DaGFuZ2VGaWxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1maWxlJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25DaGFuZ2VJdGVtcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtaXRlbXMnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkNoYW5nZUV4cGFuZGVkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1leHBhbmRlZCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uQ2hhbmdlU2VsZWN0KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1zZWxlY3QnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRlc3Ryb3llZChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2Rlc3Ryb3llZCcsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGdldCBpc1Jvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID09PSBudWxsO1xuICB9XG5cbiAgZ2V0IHJvb3QoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQucm9vdDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldCBsb2NhbCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGxldCBwID0gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKHRoaXMucGFyZW50LmxvY2FsLCB0aGlzLm5hbWUpKTtcblxuICAgICAgaWYgKHBhdGguc2VwICE9PSAnLycpIHAgPSBwLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG11bHRpcGxlSG9zdHNFbmFibGVkKCkgPT09IHRydWUgPyB0aGlzLmNsaWVudC5wcm9qZWN0UGF0aCA6IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICB9XG5cbiAgZ2V0IHJlbW90ZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIGxldCBwID0gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKHRoaXMucGFyZW50LnJlbW90ZSwgdGhpcy5uYW1lKSk7XG5cbiAgICAgIGlmIChwYXRoLnNlcCAhPT0gJy8nKSBwID0gcC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhdGg7XG4gIH1cblxuICBzZXQgc2V0SXNFeHBhbmRlZCh2YWx1ZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWV4cGFuZGVkJywgdmFsdWUpO1xuICAgIHRoaXMuaXNFeHBhbmRlZCA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IHNldElzU2VsZWN0ZWQodmFsdWUpIHtcbiAgICB0aGlzLmlzU2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1zZWxlY3QnLCB2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0b3J5O1xuIl19