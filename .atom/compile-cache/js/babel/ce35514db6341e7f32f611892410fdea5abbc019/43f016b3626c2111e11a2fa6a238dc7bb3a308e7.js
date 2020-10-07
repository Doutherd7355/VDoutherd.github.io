Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _configTernConfig = require('../config/tern-config');

var _underscorePlus = require('underscore-plus');

'use babel';

var maxPendingRequests = 50;

var Server = (function () {
  function Server(projectRoot, client) {
    var _this = this;

    _classCallCheck(this, Server);

    this.onError = function (e) {

      _this.restart('Child process error: ' + e);
    };

    this.onDisconnect = function () {

      console.warn('child process disconnected.');
    };

    this.onWorkerMessage = function (e) {

      if (e.error && e.error.isUncaughtException) {

        _this.restart('UncaughtException: ' + e.error.message + '. Restarting Server...');

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';
      var id = e.id;

      if (!id) {

        console.error('no id given', e);

        return;
      }

      if (isError) {

        _this.rejects[id] && _this.rejects[id](e.error);
      } else {

        _this.resolves[id] && _this.resolves[id](e.data);
      }

      delete _this.resolves[id];
      delete _this.rejects[id];

      _this.pendingRequest--;
    };

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.pendingRequest = 0;

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = (0, _underscorePlus.clone)(_configTernConfig.defaultServerConfig);

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this2.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage);
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this3 = this;

      if (this.pendingRequest >= maxPendingRequests) {

        this.restart('Max number of pending requests reached. Restarting server...');

        return;
      }

      var requestID = _uuid2['default'].v1();

      this.pendingRequest++;

      return new Promise(function (resolve, reject) {

        _this3.resolves[requestID] = resolve;
        _this3.rejects[requestID] = reject;

        _this3.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'restart',
    value: function restart(message) {

      atom.notifications.addError(message || 'Restarting Server...', {

        dismissable: false
      });

      _atomTernjsManager2['default'].destroyServer(this.projectDir);
      _atomTernjsManager2['default'].startServer(this.projectDir);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      for (var key in this.rejects) {

        this.rejects[key]('Server is being destroyed. Rejecting.');
      }

      this.resolves = {};
      this.rejects = {};

      this.pendingRequest = 0;

      try {

        this.child.disconnect();
      } catch (error) {

        console.error(error);
      }
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message + '. Please restart atom after the file is fixed. This issue isn\'t fully covered yet.', { dismissable: true });

        _atomTernjsManager2['default'].destroyServer(this.projectDir);
      }
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          for (var _name in this.defaultConfig.plugins) {

            if (!Object.prototype.hasOwnProperty.call(data.plugins, _name)) {

              data.plugins[_name] = this.defaultConfig.plugins[_name];
            }
          }
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBRW9CLHVCQUF1Qjs7OztnQ0FDbEIsc0JBQXNCOztrQkFDaEMsSUFBSTs7OztvQkFDRixNQUFNOzs7O29CQUNOLE1BQU07Ozs7NkJBQ1IsZUFBZTs7Ozt5QkFDUixXQUFXOzs7O29CQUNoQixNQUFNOzs7OzJCQUNDLGNBQWM7Ozs7dUNBQ1osOEJBQThCOzs7O2dDQUN0Qix1QkFBdUI7OzhCQUlsRCxpQkFBaUI7O0FBaEJ4QixXQUFXLENBQUM7O0FBa0JaLElBQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDOztJQUVULE1BQU07QUFFZCxXQUZRLE1BQU0sQ0FFYixXQUFXLEVBQUUsTUFBTSxFQUFFOzs7MEJBRmQsTUFBTTs7U0FtRnpCLE9BQU8sR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFZixZQUFLLE9BQU8sMkJBQXlCLENBQUMsQ0FBRyxDQUFDO0tBQzNDOztTQUVELFlBQVksR0FBRyxZQUFNOztBQUVuQixhQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDN0M7O1NBNkRELGVBQWUsR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFdkIsVUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUU7O0FBRTFDLGNBQUssT0FBTyx5QkFBdUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLDRCQUF5QixDQUFDOztBQUU1RSxlQUFPO09BQ1I7O0FBRUQsVUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUM7QUFDOUQsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEVBQUUsRUFBRTs7QUFFUCxl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QUFDO1dBRTNFLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSw0QkFBMEIsTUFBTSxTQUFNOztBQUUvRCx5QkFBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gscUJBQVM7V0FDVjtTQUNGOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxlQUFPLENBQUMsa0JBQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ3RDOztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FsWWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQge2ZpbGVFeGlzdHN9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5pbXBvcnQgcmVzb2x2ZUZyb20gZnJvbSAncmVzb2x2ZS1mcm9tJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHtkZWZhdWx0U2VydmVyQ29uZmlnfSBmcm9tICcuLi9jb25maWcvdGVybi1jb25maWcnO1xuXG5pbXBvcnQge1xuICBjbG9uZVxufSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5jb25zdCBtYXhQZW5kaW5nUmVxdWVzdHMgPSA1MDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0Um9vdCwgY2xpZW50KSB7XG5cbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuXG4gICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgIHRoaXMucmVqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdCA9IDA7XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBwcm9qZWN0Um9vdDtcbiAgICB0aGlzLmRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vbm9kZV9tb2R1bGVzL3Rlcm4nKTtcblxuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IGNsb25lKGRlZmF1bHRTZXJ2ZXJDb25maWcpO1xuXG4gICAgY29uc3QgaG9tZURpciA9IHByb2Nlc3MuZW52LkhPTUUgfHwgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEU7XG5cbiAgICBpZiAoaG9tZURpciAmJiBmcy5leGlzdHNTeW5jKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpKSB7XG5cbiAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpO1xuICAgIH1cblxuICAgIHRoaXMucHJvamVjdEZpbGVOYW1lID0gJy50ZXJuLXByb2plY3QnO1xuICAgIHRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgaWYgKCF0aGlzLnByb2plY3REaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgdGhpcy5wcm9qZWN0RmlsZU5hbWUpKTtcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLmRlZmF1bHRDb25maWc7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuYXN5bmMgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMudGVyblNlcnZlckdldEZpbGVBc3luYztcbiAgICB0aGlzLmNvbmZpZy5kZXBlbmRlbmN5QnVkZ2V0ID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0O1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbJ2RvY19jb21tZW50J10gPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCBkZWZzID0gdGhpcy5maW5kRGVmcyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgcGx1Z2lucyA9IHRoaXMubG9hZFBsdWdpbnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IGZpbGVzID0gW107XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkpIHtcblxuICAgICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkuZm9yRWFjaCgocGF0KSA9PiB7XG5cbiAgICAgICAgZ2xvYi5zeW5jKHBhdCwgeyBjd2Q6IHRoaXMucHJvamVjdERpciB9KS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcblxuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZCA9IGNwLmZvcmsocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vYXRvbS10ZXJuanMtc2VydmVyLXdvcmtlci5qcycpKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdtZXNzYWdlJywgdGhpcy5vbldvcmtlck1lc3NhZ2UpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Vycm9yJywgdGhpcy5vbkVycm9yKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdkaXNjb25uZWN0JywgdGhpcy5vbkRpc2Nvbm5lY3QpO1xuICAgIHRoaXMuY2hpbGQuc2VuZCh7XG5cbiAgICAgIHR5cGU6ICdpbml0JyxcbiAgICAgIGRpcjogdGhpcy5wcm9qZWN0RGlyLFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGRlZnM6IGRlZnMsXG4gICAgICBwbHVnaW5zOiBwbHVnaW5zLFxuICAgICAgZmlsZXM6IGZpbGVzXG4gICAgfSk7XG4gIH1cblxuICBvbkVycm9yID0gKGUpID0+IHtcblxuICAgIHRoaXMucmVzdGFydChgQ2hpbGQgcHJvY2VzcyBlcnJvcjogJHtlfWApO1xuICB9XG5cbiAgb25EaXNjb25uZWN0ID0gKCkgPT4ge1xuXG4gICAgY29uc29sZS53YXJuKCdjaGlsZCBwcm9jZXNzIGRpc2Nvbm5lY3RlZC4nKTtcbiAgfVxuXG4gIHJlcXVlc3QodHlwZSwgZGF0YSkge1xuXG4gICAgaWYgKHRoaXMucGVuZGluZ1JlcXVlc3QgPj0gbWF4UGVuZGluZ1JlcXVlc3RzKSB7XG5cbiAgICAgIHRoaXMucmVzdGFydCgnTWF4IG51bWJlciBvZiBwZW5kaW5nIHJlcXVlc3RzIHJlYWNoZWQuIFJlc3RhcnRpbmcgc2VydmVyLi4uJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcmVxdWVzdElEID0gdXVpZC52MSgpO1xuXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdCsrO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5yZXNvbHZlc1tyZXF1ZXN0SURdID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMucmVqZWN0c1tyZXF1ZXN0SURdID0gcmVqZWN0O1xuXG4gICAgICB0aGlzLmNoaWxkLnNlbmQoe1xuXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGlkOiByZXF1ZXN0SUQsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZmx1c2goKSB7XG5cbiAgICB0aGlzLnJlcXVlc3QoJ2ZsdXNoJywge30pLnRoZW4oKCkgPT4ge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQWxsIGZpbGVzIGZldGNoZWQgYW5kIGFuYWx5emVkLicpO1xuICAgIH0pO1xuICB9XG5cbiAgZG9udExvYWQoZmlsZSkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5kb250TG9hZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmRvbnRMb2FkLnNvbWUoKHBhdCkgPT4ge1xuXG4gICAgICByZXR1cm4gbWluaW1hdGNoKGZpbGUsIHBhdCk7XG4gICAgfSk7XG4gIH1cblxuICByZXN0YXJ0KG1lc3NhZ2UpIHtcblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlIHx8ICdSZXN0YXJ0aW5nIFNlcnZlci4uLicsIHtcblxuICAgICAgZGlzbWlzc2FibGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBtYW5hZ2VyLmRlc3Ryb3lTZXJ2ZXIodGhpcy5wcm9qZWN0RGlyKTtcbiAgICBtYW5hZ2VyLnN0YXJ0U2VydmVyKHRoaXMucHJvamVjdERpcik7XG4gIH1cblxuICBvbldvcmtlck1lc3NhZ2UgPSAoZSkgPT4ge1xuXG4gICAgaWYgKGUuZXJyb3IgJiYgZS5lcnJvci5pc1VuY2F1Z2h0RXhjZXB0aW9uKSB7XG5cbiAgICAgIHRoaXMucmVzdGFydChgVW5jYXVnaHRFeGNlcHRpb246ICR7ZS5lcnJvci5tZXNzYWdlfS4gUmVzdGFydGluZyBTZXJ2ZXIuLi5gKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRXJyb3IgPSBlLmVycm9yICE9PSAnbnVsbCcgJiYgZS5lcnJvciAhPT0gJ3VuZGVmaW5lZCc7XG4gICAgY29uc3QgaWQgPSBlLmlkO1xuXG4gICAgaWYgKCFpZCkge1xuXG4gICAgICBjb25zb2xlLmVycm9yKCdubyBpZCBnaXZlbicsIGUpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzRXJyb3IpIHtcblxuICAgICAgdGhpcy5yZWplY3RzW2lkXSAmJiB0aGlzLnJlamVjdHNbaWRdKGUuZXJyb3IpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5yZXNvbHZlc1tpZF0gJiYgdGhpcy5yZXNvbHZlc1tpZF0oZS5kYXRhKTtcbiAgICB9XG5cbiAgICBkZWxldGUgdGhpcy5yZXNvbHZlc1tpZF07XG4gICAgZGVsZXRlIHRoaXMucmVqZWN0c1tpZF07XG5cbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0LS07XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgaWYgKCF0aGlzLmNoaWxkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnJlamVjdHMpIHtcblxuICAgICAgdGhpcy5yZWplY3RzW2tleV0oJ1NlcnZlciBpcyBiZWluZyBkZXN0cm95ZWQuIFJlamVjdGluZy4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc29sdmVzID0ge307XG4gICAgdGhpcy5yZWplY3RzID0ge307XG5cbiAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0ID0gMDtcblxuICAgIHRyeSB7XG5cbiAgICAgIHRoaXMuY2hpbGQuZGlzY29ubmVjdCgpO1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcmVhZEpTT04oZmlsZU5hbWUpIHtcblxuICAgIGlmIChmaWxlRXhpc3RzKGZpbGVOYW1lKSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlTmFtZSwgJ3V0ZjgnKTtcblxuICAgIHRyeSB7XG5cbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIGBCYWQgSlNPTiBpbiAke2ZpbGVOYW1lfTogJHtlLm1lc3NhZ2V9LiBQbGVhc2UgcmVzdGFydCBhdG9tIGFmdGVyIHRoZSBmaWxlIGlzIGZpeGVkLiBUaGlzIGlzc3VlIGlzbid0IGZ1bGx5IGNvdmVyZWQgeWV0LmAsXG4gICAgICAgIHsgZGlzbWlzc2FibGU6IHRydWUgfVxuICAgICAgKTtcblxuICAgICAgbWFuYWdlci5kZXN0cm95U2VydmVyKHRoaXMucHJvamVjdERpcik7XG4gICAgfVxuICB9XG5cbiAgcmVhZFByb2plY3RGaWxlKGZpbGVOYW1lKSB7XG5cbiAgICBsZXQgZGF0YSA9IHRoaXMucmVhZEpTT04oZmlsZU5hbWUpO1xuXG4gICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBvcHRpb24gaW4gdGhpcy5kZWZhdWx0Q29uZmlnKSB7XG5cbiAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShvcHRpb24pKSB7XG5cbiAgICAgICAgZGF0YVtvcHRpb25dID0gdGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl07XG5cbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uID09PSAncGx1Z2lucycpIHtcblxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5kZWZhdWx0Q29uZmlnLnBsdWdpbnMpIHtcblxuICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEucGx1Z2lucywgbmFtZSkpIHtcblxuICAgICAgICAgICAgZGF0YS5wbHVnaW5zW25hbWVdID0gdGhpcy5kZWZhdWx0Q29uZmlnLnBsdWdpbnNbbmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmaW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBmYWxsYmFja0Rpcikge1xuXG4gICAgbGV0IGxvY2FsID0gcGF0aC5yZXNvbHZlKHByb2plY3REaXIsIGZpbGUpO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgJiYgZnMuZXhpc3RzU3luYyhsb2NhbCkpIHtcblxuICAgICAgcmV0dXJuIGxvY2FsO1xuICAgIH1cblxuICAgIGxldCBzaGFyZWQgPSBwYXRoLnJlc29sdmUoZmFsbGJhY2tEaXIsIGZpbGUpO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2hhcmVkKSkge1xuXG4gICAgICByZXR1cm4gc2hhcmVkO1xuICAgIH1cbiAgfVxuXG4gIGZpbmREZWZzKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IGRlZnMgPSBbXTtcbiAgICBsZXQgc3JjID0gY29uZmlnLmxpYnMuc2xpY2UoKTtcblxuICAgIGlmIChjb25maWcuZWNtYVNjcmlwdCAmJiBzcmMuaW5kZXhPZignZWNtYXNjcmlwdCcpID09PSAtMSkge1xuXG4gICAgICBzcmMudW5zaGlmdCgnZWNtYXNjcmlwdCcpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3JjLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgIGxldCBmaWxlID0gc3JjW2ldO1xuXG4gICAgICBpZiAoIS9cXC5qc29uJC8udGVzdChmaWxlKSkge1xuXG4gICAgICAgIGZpbGUgPSBgJHtmaWxlfS5qc29uYDtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID1cbiAgICAgICAgdGhpcy5maW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBwYXRoLnJlc29sdmUodGhpcy5kaXN0RGlyLCAnZGVmcycpKSB8fFxuICAgICAgICByZXNvbHZlRnJvbShwcm9qZWN0RGlyLCBgdGVybi0ke3NyY1tpXX1gKVxuICAgICAgICA7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtzcmNbaV19YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBsaWJyYXJ5ICR7c3JjW2ldfVxcbmAsIHtcblxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZm91bmQpIHtcblxuICAgICAgICBkZWZzLnB1c2godGhpcy5yZWFkSlNPTihmb3VuZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZzO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zO1xuICAgIGxldCBvcHRpb25zID0ge307XG4gICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgcGx1Z2luIGluIHBsdWdpbnMpIHtcblxuICAgICAgbGV0IHZhbCA9IHBsdWdpbnNbcGx1Z2luXTtcblxuICAgICAgaWYgKCF2YWwpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID1cbiAgICAgICAgdGhpcy5maW5kRmlsZShgJHtwbHVnaW59LmpzYCwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ3BsdWdpbicpKSB8fFxuICAgICAgICByZXNvbHZlRnJvbShwcm9qZWN0RGlyLCBgdGVybi0ke3BsdWdpbn1gKVxuICAgICAgICA7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYCR7dGhpcy5wcm9qZWN0RGlyfS9ub2RlX21vZHVsZXMvdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIHBsdWdpbiAke3BsdWdpbn1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cy5wdXNoKGZvdW5kKTtcbiAgICAgIG9wdGlvbnNbcGF0aC5iYXNlbmFtZShwbHVnaW4pXSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxufVxuIl19