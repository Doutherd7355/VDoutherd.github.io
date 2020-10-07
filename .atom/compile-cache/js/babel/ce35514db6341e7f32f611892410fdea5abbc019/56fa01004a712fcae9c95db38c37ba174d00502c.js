Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsServer = require('./atom-ternjs-server');

var _atomTernjsServer2 = _interopRequireDefault(_atomTernjsServer);

var _atomTernjsClient = require('./atom-ternjs-client');

var _atomTernjsClient2 = _interopRequireDefault(_atomTernjsClient);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsDocumentation = require('./atom-ternjs-documentation');

var _atomTernjsDocumentation2 = _interopRequireDefault(_atomTernjsDocumentation);

var _atomTernjsReference = require('./atom-ternjs-reference');

var _atomTernjsReference2 = _interopRequireDefault(_atomTernjsReference);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsType = require('./atom-ternjs-type');

var _atomTernjsType2 = _interopRequireDefault(_atomTernjsType);

var _atomTernjsConfig = require('./atom-ternjs-config');

var _atomTernjsConfig2 = _interopRequireDefault(_atomTernjsConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsRename = require('./atom-ternjs-rename');

var _atomTernjsRename2 = _interopRequireDefault(_atomTernjsRename);

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Manager = (function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.disposables = [];
    /**
     * collection of all active clients
     * @type {Array}
     */
    this.clients = [];
    /**
     * reference to the client for the active text-editor
     * @type {Client}
     */
    this.client = null;
    /**
     * collection of all active servers
     * @type {Array}
     */
    this.servers = [];
    /**
     * reference to the server for the active text-editor
     * @type {Server}
     */
    this.server = null;
    this.editors = [];
  }

  _createClass(Manager, [{
    key: 'activate',
    value: function activate() {

      this.registerListeners();
      this.registerCommands();

      _atomTernjsConfig2['default'].init();
      _atomTernjsDocumentation2['default'].init();
      _atomTernjsPackageConfig2['default'].init();
      _atomTernjsProvider2['default'].init();
      _atomTernjsReference2['default'].init();
      _atomTernjsRename2['default'].init();
      _atomTernjsType2['default'].init();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
      this.editors.forEach(function (editor) {
        return (0, _atomTernjsHelper.disposeAll)(editor.disposables);
      });
      this.editors = [];

      for (var server of this.servers) {

        server.destroy();
      }

      this.servers = [];
      this.clients = [];

      this.server = null;
      this.client = null;

      _atomTernjsDocumentation2['default'] && _atomTernjsDocumentation2['default'].destroy();
      _atomTernjsReference2['default'] && _atomTernjsReference2['default'].destroy();
      _atomTernjsType2['default'] && _atomTernjsType2['default'].destroy();
      _atomTernjsPackageConfig2['default'] && _atomTernjsPackageConfig2['default'].destroy();
      _atomTernjsRename2['default'] && _atomTernjsRename2['default'].destroy();
      _atomTernjsConfig2['default'] && _atomTernjsConfig2['default'].destroy();
      _atomTernjsProvider2['default'] && _atomTernjsProvider2['default'].destroy();
      _servicesNavigation2['default'].reset();
    }
  }, {
    key: 'startServer',
    value: function startServer(projectDir) {

      if (!(0, _atomTernjsHelper.isDirectory)(projectDir)) {

        return false;
      }

      if (this.getServerForProject(projectDir)) {

        return true;
      }

      var client = new _atomTernjsClient2['default'](projectDir);
      this.clients.push(client);

      this.servers.push(new _atomTernjsServer2['default'](projectDir, client));

      this.setActiveServerAndClient(projectDir);

      return true;
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(uRI) {

      this.server = this.getServerForProject(uRI);
      this.client = this.getClientForProject(uRI);
    }
  }, {
    key: 'destroyClient',
    value: function destroyClient(projectDir) {
      var _this = this;

      var clients = this.clients.slice();

      clients.forEach(function (client, i) {

        if (client.projectDir === projectDir) {

          _this.clients.splice(i, 1);
        }
      });
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(projectDir) {
      var _this2 = this;

      var servers = this.servers.slice();

      servers.forEach(function (server, i) {

        if (server.projectDir === projectDir) {

          server.destroy();
          _this2.servers.splice(i, 1);
          _this2.destroyClient(projectDir);
        }
      });
    }
  }, {
    key: 'destroyUnusedServers',
    value: function destroyUnusedServers() {
      var _this3 = this;

      var projectDirs = this.editors.map(function (editor) {
        return editor.projectDir;
      });
      var servers = this.servers.slice();

      servers.forEach(function (server) {

        if (!projectDirs.includes(server.projectDir)) {

          _this3.destroyServer(server.projectDir);
        }
      });
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      return this.servers.filter(function (server) {
        return server.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      return this.clients.filter(function (client) {
        return client.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getEditor',
    value: function getEditor(id) {

      return this.editors.filter(function (editor) {
        return editor.id === id;
      }).pop();
    }
  }, {
    key: 'destroyEditor',
    value: function destroyEditor(id) {
      var _this4 = this;

      var editors = this.editors.slice();

      editors.forEach(function (editor, i) {

        if (editor.id === id) {

          (0, _atomTernjsHelper.disposeAll)(editor.disposables);
          _this4.editors.splice(i, 1);
        }
      });
    }
  }, {
    key: 'getProjectDir',
    value: function getProjectDir(uRI) {
      var _atom$project$relativizePath = atom.project.relativizePath(uRI);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var project = _atom$project$relativizePath2[0];
      var file = _atom$project$relativizePath2[1];

      if (project) {

        return project;
      }

      if (file) {

        var absolutePath = _path2['default'].resolve(__dirname, file);

        return _path2['default'].dirname(absolutePath);
      }

      return undefined;
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var _this5 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!(0, _atomTernjsHelper.isValidEditor)(editor)) {

          return;
        }

        var uRI = editor.getURI();
        var projectDir = _this5.getProjectDir(uRI);
        var serverCreatedOrPresent = _this5.startServer(projectDir);

        if (!serverCreatedOrPresent) {

          return;
        }

        var id = editor.id;
        var disposables = [];

        // Register valid editor
        _this5.editors.push({

          id: id,
          projectDir: projectDir,
          disposables: disposables
        });

        disposables.push(editor.onDidDestroy(function () {

          _this5.destroyEditor(id);
          _this5.destroyUnusedServers();
        }));

        disposables.push(editor.onDidChangeCursorPosition(function (e) {

          // do only query the type if this is the last cursor
          if (!e.cursor || !e.cursor.isLastCursor()) {

            return;
          }

          if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletion) {

            _this5.client && _atomTernjsType2['default'].queryType(editor, e);
          }
        }));

        disposables.push(editor.getBuffer().onDidSave(function (e) {

          _this5.client && _this5.client.update(editor);
        }));

        if (atom.config.get('atom-ternjs.debug')) {

          console.log('observing: ' + uRI);
        }
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('rename-hide');

        if (!(0, _atomTernjsHelper.isValidEditor)(item)) {

          _atomTernjsEvents2['default'].emit('reference-hide');
        } else {

          var uRI = item.getURI();
          var projectDir = _this5.getProjectDir(uRI);

          _this5.setActiveServerAndClient(projectDir);
        }
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this6 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('reference-hide');
        _atomTernjsEvents2['default'].emit('rename-hide');
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this6.client) {

          _this6.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        _this6.server && _this6.server.flush();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateBack', function (e) {

        _servicesNavigation2['default'].goTo(-1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateForward', function (e) {

        _servicesNavigation2['default'].goTo(1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        _this6.client && _this6.client.definition();
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this6.server && _this6.server.restart();
      }));
    }
  }]);

  return Manager;
})();

exports['default'] = new Manager();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Z0NBRW1CLHNCQUFzQjs7OztnQ0FDdEIsc0JBQXNCOzs7O2dDQUNyQixzQkFBc0I7Ozs7dUNBQ2hCLDZCQUE2Qjs7OzttQ0FDakMseUJBQXlCOzs7O3VDQUNyQiw4QkFBOEI7Ozs7OEJBQ3ZDLG9CQUFvQjs7OztnQ0FDbEIsc0JBQXNCOzs7O2dDQUtsQyxzQkFBc0I7O2tDQUNSLHdCQUF3Qjs7OztnQ0FDMUIsc0JBQXNCOzs7O2tDQUNsQix1QkFBdUI7Ozs7b0JBQzdCLE1BQU07Ozs7QUFsQnZCLFdBQVcsQ0FBQzs7SUFvQk4sT0FBTztBQUVBLFdBRlAsT0FBTyxHQUVHOzBCQUZWLE9BQU87O0FBSVQsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7O0FBS3RCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7OztBQUtsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Ozs7QUFLbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7O0FBS2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COztlQTFCRyxPQUFPOztXQTRCSCxvQkFBRzs7QUFFVCxVQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN6QixVQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7QUFFeEIsb0NBQU8sSUFBSSxFQUFFLENBQUM7QUFDZCwyQ0FBYyxJQUFJLEVBQUUsQ0FBQztBQUNyQiwyQ0FBYyxJQUFJLEVBQUUsQ0FBQztBQUNyQixzQ0FBUyxJQUFJLEVBQUUsQ0FBQztBQUNoQix1Q0FBVSxJQUFJLEVBQUUsQ0FBQztBQUNqQixvQ0FBTyxJQUFJLEVBQUUsQ0FBQztB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LHFCQUFxQixFQUFFLFVBQUMsQ0FBQyxFQUFLOztBQUV0RixlQUFLLE1BQU0sSUFBSSxPQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN0QyxDQUFDLENBQUMsQ0FBQztLQUNMOzs7U0F6VEcsT0FBTzs7O3FCQTRURSxJQUFJLE9BQU8sRUFBRSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFNlcnZlciBmcm9tICcuL2F0b20tdGVybmpzLXNlcnZlcic7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4vYXRvbS10ZXJuanMtY2xpZW50JztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBkb2N1bWVudGF0aW9uIGZyb20gJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbic7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHR5cGUgZnJvbSAnLi9hdG9tLXRlcm5qcy10eXBlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1jb25maWcnO1xuaW1wb3J0IHtcbiAgaXNEaXJlY3RvcnksXG4gIGlzVmFsaWRFZGl0b3IsXG4gIGRpc3Bvc2VBbGxcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IHJlbmFtZSBmcm9tICcuL2F0b20tdGVybmpzLXJlbmFtZSc7XG5pbXBvcnQgbmF2aWdhdGlvbiBmcm9tICcuL3NlcnZpY2VzL25hdmlnYXRpb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNsYXNzIE1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIC8qKlxuICAgICAqIGNvbGxlY3Rpb24gb2YgYWxsIGFjdGl2ZSBjbGllbnRzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIC8qKlxuICAgICAqIHJlZmVyZW5jZSB0byB0aGUgY2xpZW50IGZvciB0aGUgYWN0aXZlIHRleHQtZWRpdG9yXG4gICAgICogQHR5cGUge0NsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogY29sbGVjdGlvbiBvZiBhbGwgYWN0aXZlIHNlcnZlcnNcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgLyoqXG4gICAgICogcmVmZXJlbmNlIHRvIHRoZSBzZXJ2ZXIgZm9yIHRoZSBhY3RpdmUgdGV4dC1lZGl0b3JcbiAgICAgKiBAdHlwZSB7U2VydmVyfVxuICAgICAqL1xuICAgIHRoaXMuc2VydmVyID0gbnVsbDtcbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuXG4gICAgY29uZmlnLmluaXQoKTtcbiAgICBkb2N1bWVudGF0aW9uLmluaXQoKTtcbiAgICBwYWNrYWdlQ29uZmlnLmluaXQoKTtcbiAgICBwcm92aWRlci5pbml0KCk7XG4gICAgcmVmZXJlbmNlLmluaXQoKTtcbiAgICByZW5hbWUuaW5pdCgpO1xuICAgIHR5cGUuaW5pdCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMuZWRpdG9ycy5mb3JFYWNoKGVkaXRvciA9PiBkaXNwb3NlQWxsKGVkaXRvci5kaXNwb3NhYmxlcykpO1xuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBzZXJ2ZXIgb2YgdGhpcy5zZXJ2ZXJzKSB7XG5cbiAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXJ2ZXJzID0gW107XG4gICAgdGhpcy5jbGllbnRzID0gW107XG5cbiAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5jbGllbnQgPSBudWxsO1xuXG4gICAgZG9jdW1lbnRhdGlvbiAmJiBkb2N1bWVudGF0aW9uLmRlc3Ryb3koKTtcbiAgICByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRlc3Ryb3koKTtcbiAgICB0eXBlICYmIHR5cGUuZGVzdHJveSgpO1xuICAgIHBhY2thZ2VDb25maWcgJiYgcGFja2FnZUNvbmZpZy5kZXN0cm95KCk7XG4gICAgcmVuYW1lICYmIHJlbmFtZS5kZXN0cm95KCk7XG4gICAgY29uZmlnICYmIGNvbmZpZy5kZXN0cm95KCk7XG4gICAgcHJvdmlkZXIgJiYgcHJvdmlkZXIuZGVzdHJveSgpO1xuICAgIG5hdmlnYXRpb24ucmVzZXQoKTtcbiAgfVxuXG4gIHN0YXJ0U2VydmVyKHByb2plY3REaXIpIHtcblxuICAgIGlmICghaXNEaXJlY3RvcnkocHJvamVjdERpcikpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmdldFNlcnZlckZvclByb2plY3QocHJvamVjdERpcikpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudChwcm9qZWN0RGlyKTtcbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuXG4gICAgdGhpcy5zZXJ2ZXJzLnB1c2gobmV3IFNlcnZlcihwcm9qZWN0RGlyLCBjbGllbnQpKTtcblxuICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KHByb2plY3REaXIpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzZXRBY3RpdmVTZXJ2ZXJBbmRDbGllbnQodVJJKSB7XG5cbiAgICB0aGlzLnNlcnZlciA9IHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdCh1UkkpO1xuICAgIHRoaXMuY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KHVSSSk7XG4gIH1cblxuICBkZXN0cm95Q2xpZW50KHByb2plY3REaXIpIHtcblxuICAgIGNvbnN0IGNsaWVudHMgPSB0aGlzLmNsaWVudHMuc2xpY2UoKTtcblxuICAgIGNsaWVudHMuZm9yRWFjaCgoY2xpZW50LCBpKSA9PiB7XG5cbiAgICAgIGlmIChjbGllbnQucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95U2VydmVyKHByb2plY3REaXIpIHtcblxuICAgIGNvbnN0IHNlcnZlcnMgPSB0aGlzLnNlcnZlcnMuc2xpY2UoKTtcblxuICAgIHNlcnZlcnMuZm9yRWFjaCgoc2VydmVyLCBpKSA9PiB7XG5cbiAgICAgIGlmIChzZXJ2ZXIucHJvamVjdERpciA9PT0gcHJvamVjdERpcikge1xuXG4gICAgICAgIHNlcnZlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuc2VydmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHRoaXMuZGVzdHJveUNsaWVudChwcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3lVbnVzZWRTZXJ2ZXJzKCkge1xuXG4gICAgY29uc3QgcHJvamVjdERpcnMgPSB0aGlzLmVkaXRvcnMubWFwKGVkaXRvciA9PiBlZGl0b3IucHJvamVjdERpcik7XG4gICAgY29uc3Qgc2VydmVycyA9IHRoaXMuc2VydmVycy5zbGljZSgpO1xuXG4gICAgc2VydmVycy5mb3JFYWNoKHNlcnZlciA9PiB7XG5cbiAgICAgIGlmICghcHJvamVjdERpcnMuaW5jbHVkZXMoc2VydmVyLnByb2plY3REaXIpKSB7XG5cbiAgICAgICAgdGhpcy5kZXN0cm95U2VydmVyKHNlcnZlci5wcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFNlcnZlckZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgcmV0dXJuIHRoaXMuc2VydmVycy5maWx0ZXIoc2VydmVyID0+IHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKS5wb3AoKTtcbiAgfVxuXG4gIGdldENsaWVudEZvclByb2plY3QocHJvamVjdERpcikge1xuXG4gICAgcmV0dXJuIHRoaXMuY2xpZW50cy5maWx0ZXIoY2xpZW50ID0+IGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKS5wb3AoKTtcbiAgfVxuXG4gIGdldEVkaXRvcihpZCkge1xuXG4gICAgcmV0dXJuIHRoaXMuZWRpdG9ycy5maWx0ZXIoZWRpdG9yID0+IGVkaXRvci5pZCA9PT0gaWQpLnBvcCgpO1xuICB9XG5cbiAgZGVzdHJveUVkaXRvcihpZCkge1xuXG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9ycy5zbGljZSgpO1xuXG4gICAgZWRpdG9ycy5mb3JFYWNoKChlZGl0b3IsIGkpID0+IHtcblxuICAgICAgaWYgKGVkaXRvci5pZCA9PT0gaWQpIHtcblxuICAgICAgICBkaXNwb3NlQWxsKGVkaXRvci5kaXNwb3NhYmxlcyk7XG4gICAgICAgIHRoaXMuZWRpdG9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRQcm9qZWN0RGlyKHVSSSkge1xuXG4gICAgY29uc3QgW3Byb2plY3QsIGZpbGVdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHVSSSk7XG5cbiAgICBpZiAocHJvamVjdCkge1xuXG4gICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9XG5cbiAgICBpZiAoZmlsZSkge1xuXG4gICAgICBjb25zdCBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBmaWxlKTtcblxuICAgICAgcmV0dXJuIHBhdGguZGlybmFtZShhYnNvbHV0ZVBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZWdpc3Rlckxpc3RlbmVycygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXG4gICAgICBpZiAoIWlzVmFsaWRFZGl0b3IoZWRpdG9yKSkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdVJJID0gZWRpdG9yLmdldFVSSSgpO1xuICAgICAgY29uc3QgcHJvamVjdERpciA9IHRoaXMuZ2V0UHJvamVjdERpcih1UkkpO1xuICAgICAgY29uc3Qgc2VydmVyQ3JlYXRlZE9yUHJlc2VudCA9IHRoaXMuc3RhcnRTZXJ2ZXIocHJvamVjdERpcik7XG5cbiAgICAgIGlmICghc2VydmVyQ3JlYXRlZE9yUHJlc2VudCkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaWQgPSBlZGl0b3IuaWQ7XG4gICAgICBjb25zdCBkaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgICAvLyBSZWdpc3RlciB2YWxpZCBlZGl0b3JcbiAgICAgIHRoaXMuZWRpdG9ycy5wdXNoKHtcblxuICAgICAgICBpZCxcbiAgICAgICAgcHJvamVjdERpcixcbiAgICAgICAgZGlzcG9zYWJsZXNcbiAgICAgIH0pO1xuXG4gICAgICBkaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuXG4gICAgICAgIHRoaXMuZGVzdHJveUVkaXRvcihpZCk7XG4gICAgICAgIHRoaXMuZGVzdHJveVVudXNlZFNlcnZlcnMoKTtcbiAgICAgIH0pKTtcblxuICAgICAgZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZSkgPT4ge1xuXG4gICAgICAgIC8vIGRvIG9ubHkgcXVlcnkgdGhlIHR5cGUgaWYgdGhpcyBpcyB0aGUgbGFzdCBjdXJzb3JcbiAgICAgICAgaWYgKCFlLmN1cnNvciB8fCAhZS5jdXJzb3IuaXNMYXN0Q3Vyc29yKCkpIHtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uKSB7XG5cbiAgICAgICAgICB0aGlzLmNsaWVudCAmJiB0eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgICAgIGRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZSkgPT4ge1xuXG4gICAgICAgIHRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LnVwZGF0ZShlZGl0b3IpO1xuICAgICAgfSkpO1xuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdG9tLXRlcm5qcy5kZWJ1ZycpKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coYG9ic2VydmluZzogJHt1Ukl9YCk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKGl0ZW0pID0+IHtcblxuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZW5hbWUtaGlkZScpO1xuXG4gICAgICBpZiAoIWlzVmFsaWRFZGl0b3IoaXRlbSkpIHtcblxuICAgICAgICBlbWl0dGVyLmVtaXQoJ3JlZmVyZW5jZS1oaWRlJyk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgY29uc3QgdVJJID0gaXRlbS5nZXRVUkkoKTtcbiAgICAgICAgY29uc3QgcHJvamVjdERpciA9IHRoaXMuZ2V0UHJvamVjdERpcih1UkkpO1xuXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KHByb2plY3REaXIpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnLCAoZSkgPT4ge1xuXG4gICAgICBlbWl0dGVyLmVtaXQoJ3R5cGUtZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ2RvY3VtZW50YXRpb24tZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ3JlZmVyZW5jZS1oaWRlJyk7XG4gICAgICBlbWl0dGVyLmVtaXQoJ3JlbmFtZS1oaWRlJyk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmxpc3RGaWxlcycsIChlKSA9PiB7XG5cbiAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgIHRoaXMuY2xpZW50LmZpbGVzKCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgY29uc29sZS5kaXIoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpmbHVzaCcsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMuc2VydmVyICYmIHRoaXMuc2VydmVyLmZsdXNoKCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOm5hdmlnYXRlQmFjaycsIChlKSA9PiB7XG5cbiAgICAgIG5hdmlnYXRpb24uZ29UbygtMSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOm5hdmlnYXRlRm9yd2FyZCcsIChlKSA9PiB7XG5cbiAgICAgIG5hdmlnYXRpb24uZ29UbygxKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6ZGVmaW5pdGlvbicsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LmRlZmluaXRpb24oKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F0b20tdGVybmpzOnJlc3RhcnQnLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5yZXN0YXJ0KCk7XG4gICAgfSkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNYW5hZ2VyKCk7XG4iXX0=