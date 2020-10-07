Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _stripJsonComments = require('strip-json-comments');

var _stripJsonComments2 = _interopRequireDefault(_stripJsonComments);

var _ignore = require('ignore');

var _ignore2 = _interopRequireDefault(_ignore);

var _sshConfig = require('ssh-config');

var _sshConfig2 = _interopRequireDefault(_sshConfig);

var _helpers = require('./helpers');

var _directory = require('./directory');

var _directory2 = _interopRequireDefault(_directory);

var _progress = require('./progress');

var _progress2 = _interopRequireDefault(_progress);

var _connectorsFtp = require('./connectors/ftp');

var _connectorsFtp2 = _interopRequireDefault(_connectorsFtp);

var _connectorsSftp = require('./connectors/sftp');

var _connectorsSftp2 = _interopRequireDefault(_connectorsSftp);

var _dialogsPromptPassDialog = require('./dialogs/prompt-pass-dialog');

var _dialogsPromptPassDialog2 = _interopRequireDefault(_dialogsPromptPassDialog);

'use babel';

var SSH2_ALGORITHMS = require('ssh2-streams').constants.ALGORITHMS;

var Client = (function () {
  function Client() {
    _classCallCheck(this, Client);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    var self = this;
    self.info = null;
    self.connector = null;
    self.current = null;
    self.queue = [];

    self.configFileName = '.ftpconfig';
    self.ignoreBaseName = '.ftpignore';
    self.ignoreFilter = false;
    self.watchers = [];

    self.root = new _directory2['default']({
      name: '/',
      path: '/',
      client: this,
      isExpanded: true
    });

    self.status = 'NOT_CONNECTED'; // Options NOT_CONNECTED, CONNECTING, CONNECTED

    self.watch = {
      watcher: null,
      files: [],
      addListeners: function addListeners() {
        var watchData = (0, _helpers.getObject)({
          keys: ['info', 'watch'],
          obj: self
        });
        if (watchData === null || watchData === false) return;
        if (typeof watchData === 'string') watchData = [watchData];

        if (!Array.isArray(watchData) || watchData.length === 0) return;

        var ig = (0, _ignore2['default'])().add(watchData);

        (0, _atom.watchPath)(self.getProjectPath(), {}, function (events) {
          Object.keys(events).forEach(function (key) {
            var event = events[key];
            var relativePath = _path2['default'].relative(self.getProjectPath(), event.path);

            if (!ig.ignores(relativePath)) return;
            self.watch.files.push(relativePath);

            if (event.action === 'modified' && !relativePath.match(/(^|[/\\])\../)) {
              self.watch.queueUpload.apply(self, [event.path, function () {
                if (atom.config.get('remote-ftp.notifications.enableWatchFileChange')) {
                  atom.notifications.addInfo('Remote FTP: Change detected in: ' + event.path, {
                    dismissable: false
                  });
                }

                var index = self.watch.files.indexOf(relativePath);

                if (index > -1) {
                  delete self.watch.files[index];
                }
              }]);
            }
          });
        }).then(function (disposable) {
          return self.watchers.push(disposable);
        });

        atom.notifications.addInfo('Remote FTP: Added watch listeners.', {
          dismissable: false
        });
      },
      removeListeners: function removeListeners() {
        if (self.watchers.length > 0) {
          self.watchers.forEach(function (watcher) {
            return watcher.dispose();
          });

          atom.notifications.addInfo('Remote FTP: Stopped watch listeners.', {
            dismissable: false
          });

          self.watchers = [];
        }
      },
      queue: {},
      queueUpload: function queueUpload(fileName, callback) {
        var timeoutDuration = isNaN(parseInt(self.info.watchTimeout, 10)) === true ? 500 : parseInt(self.info.watchTimeout, 10);

        function scheduleUpload(file) {
          self.watch.queue[file] = setTimeout(function () {
            self.upload(file, callback);
          }, timeoutDuration);
        }

        if (self.watch.queue[fileName] !== null) {
          clearTimeout(self.watch.queue[fileName]);
          self.watch.queue[fileName] = null;
        }

        scheduleUpload(fileName);
      }

    };

    self.watch.addListeners = self.watch.addListeners.bind(self);
    self.watch.removeListeners = self.watch.removeListeners.bind(self);

    self.onDidConnected(self.watch.addListeners);
    self.onDidDisconnected(self.watch.removeListeners);

    self.events();
  }

  _createClass(Client, [{
    key: 'onDidChangeStatus',
    value: function onDidChangeStatus(callback) {
      var _this = this;

      this.subscriptions.add(this.emitter.on('change-status', function () {
        callback(_this.status);
      }));
    }
  }, {
    key: 'onDidConnected',
    value: function onDidConnected(callback) {
      var _this2 = this;

      this.subscriptions.add(this.emitter.on('connected', function () {
        callback(_this2.status);
        _this2.emitter.emit('change-status');
      }));
    }
  }, {
    key: 'onDidDisconnected',
    value: function onDidDisconnected(callback) {
      var _this3 = this;

      this.subscriptions.add(this.emitter.on('disconnected', function () {
        callback(_this3.status);
        _this3.emitter.emit('change-status');
      }));
    }
  }, {
    key: 'onDidClosed',
    value: function onDidClosed(callback) {
      var _this4 = this;

      this.subscriptions.add(this.emitter.on('closed', function () {
        callback(_this4.status);
      }));
    }
  }, {
    key: 'onDidDebug',
    value: function onDidDebug(callback) {
      this.subscriptions.add(this.emitter.on('debug', function (message) {
        callback(message);
      }));
    }
  }, {
    key: 'onDidQueueChanged',
    value: function onDidQueueChanged(callback) {
      this.subscriptions.add(this.emitter.on('queue-changed', function () {
        callback();
      }));
    }
  }, {
    key: 'events',
    value: function events() {
      var _this5 = this;

      this.subscriptions.add(atom.config.onDidChange('remote-ftp.dev.debugResponse', function (values) {
        _this5.watchDebug(values.newValue);
      }), atom.config.onDidChange('remote-ftp.tree.showProjectName', function () {
        _this5.setProjectName();
      }));
    }
  }, {
    key: 'setProjectName',
    value: function setProjectName() {
      if (typeof this.ftpConfigPath === 'undefined') return;

      var projectRoot = atom.config.get('remote-ftp.tree.showProjectName');
      var $rootName = (0, _atomSpacePenViews.$)('.ftptree-view .project-root > .header span');

      var rootName = '/';

      if (typeof this.info[projectRoot] !== 'undefined') {
        rootName = this.info[projectRoot];
      }

      this.root.name = rootName;
      $rootName.text(rootName);
    }
  }, {
    key: 'readConfig',
    value: function readConfig(callback) {
      var _this6 = this;

      var CSON = undefined;

      var error = function error(err) {
        if (typeof callback === 'function') callback.apply(_this6, [err]);
      };
      this.info = null;
      this.ftpConfigPath = this.getConfigPath();

      var csonConfig = new _atom.File(this.getFilePath(this.ftpConfigPath + '.cson'));

      if (this.ftpConfigPath === false) throw new Error('Remote FTP: getConfigPath returned false, but expected a string');

      var modifyConfig = function modifyConfig(json) {
        _this6.info = json;
        _this6.root.name = '';
        if (_this6.info.remote) {
          _this6.root.path = '/' + _this6.info.remote.replace(/^\/+/, '');
        } else {
          _this6.root.path = '/';
        }

        if (_this6.info.privatekey) {
          _this6.info.privatekey = (0, _helpers.resolveHome)(_this6.info.privatekey);
        }

        _this6.setProjectName();
      };

      var extendsConfig = function extendsConfig(json, err) {
        if (json !== null && typeof callback === 'function') {
          var sshConfigPath = atom.config.get('remote-ftp.connector.sshConfigPath');

          if (sshConfigPath && _this6.info.protocol === 'sftp') {
            var configPath = _path2['default'].normalize(sshConfigPath.replace('~', _os2['default'].homedir()));

            _fsPlus2['default'].readFile(configPath, 'utf8', function (fileErr, conf) {
              if (fileErr) return error(fileErr);

              var config = _sshConfig2['default'].parse(conf);

              var section = config.find({
                Host: _this6.info.host
              });

              if (section !== null && typeof section !== 'undefined') {
                (function () {
                  var mapping = new Map([['HostName', 'host'], ['Port', 'port'], ['User', 'user'], ['IdentityFile', 'privatekey'], ['ServerAliveInterval', 'keepalive'], ['ConnectTimeout', 'connTimeout']]);

                  section.config.forEach(function (line) {
                    var key = mapping.get(line.param);

                    if (typeof key !== 'undefined') {
                      _this6.info[key] = line.value;
                    }
                  });
                })();
              }

              return callback.apply(_this6, [err, _this6.info]);
            });
          } else {
            callback.apply(_this6, [err, json]);
          }
        }
      };

      if (csonConfig.existsSync()) {
        var _ret2 = (function () {
          if (typeof CSON === 'undefined') {
            CSON = require('cson-parser');
          }

          var json = null;

          csonConfig.read(true).then(function (content) {
            try {
              json = CSON.parse(content);
              modifyConfig(json);
            } catch (e) {
              atom.notifications.addError('Could not process `' + _this6.configFileName + '`.', {
                detail: e,
                dismissable: false
              });
            }

            extendsConfig(json, null);
          });

          return {
            v: undefined
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }

      _fsPlus2['default'].readFile(this.ftpConfigPath, 'utf8', function (err, res) {
        if (err) return error(err);

        var data = (0, _stripJsonComments2['default'])(res);
        var json = null;
        if ((0, _helpers.validateConfig)(data, _this6.configFileName)) {
          try {
            json = JSON.parse(data);

            modifyConfig(json);
          } catch (e) {
            atom.notifications.addError('Could not process `' + _this6.configFileName + '`.', {
              detail: e,
              dismissable: false
            });
          }
        }

        extendsConfig(json, err);

        return true;
      });
    }
  }, {
    key: 'getFilePath',
    value: function getFilePath(relativePath) {
      var projectPath = this.getProjectPath();
      if (projectPath === false) return false;
      return _path2['default'].resolve(projectPath, relativePath);
    }
  }, {
    key: 'getProjectPath',
    value: function getProjectPath() {
      var projectPath = null;

      if ((0, _helpers.multipleHostsEnabled)() === true) {
        var $currentProject = (0, _atomSpacePenViews.$)('.tree-view .project-root');

        projectPath = $currentProject.find('> .header span.name').data('path');
      } else {
        var firstDirectory = atom.project.getDirectories()[0];
        if (firstDirectory != null) projectPath = firstDirectory.path;
      }

      if (projectPath != null) {
        this.projectPath = projectPath;
        return projectPath;
      }

      return false;
    }
  }, {
    key: 'getConfigPath',
    value: function getConfigPath() {
      if (!(0, _helpers.hasProject)()) return false;

      return this.getFilePath('./' + this.configFileName);
    }
  }, {
    key: 'updateIgnore',
    value: function updateIgnore() {
      var ignorePath = this.getFilePath(this.ignoreBaseName);
      var ignoreFile = new _atom.File(ignorePath);

      if (!ignoreFile.existsSync()) {
        return false;
      }

      this.ignoreFilter = (0, _ignore2['default'])().add(ignoreFile.readSync(true));

      return true;
    }
  }, {
    key: 'checkIgnore',
    value: function checkIgnore(filepath) {
      var relativeFilepath = Client.toRelative(filepath);

      var ignoreIsActual = true;

      // updateIgnore when not set or .ftpignore is saved
      if (!this.ignoreFilter || relativeFilepath === this.getFilePath(this.ignoreBaseName)) {
        ignoreIsActual = this.updateIgnore();
      }

      if (ignoreIsActual && this.ignoreFilter.ignores(relativeFilepath)) {
        return true;
      }

      return false;
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this.connector && this.connector.isConnected();
    }
  }, {
    key: 'onceConnected',
    value: function onceConnected(onconnect) {
      var _this7 = this;

      if (this.connector && this.connector.isConnected()) {
        onconnect.apply(this);
        return true;
      } else if (typeof onconnect === 'function') {
        if (this.status === 'NOT_CONNECTED') {
          this.status = 'CONNECTING';
          this.readConfig(function (err) {
            if (err !== null) {
              _this7.status = 'NOT_CONNECTED';
              // NOTE: Remove notification as it will just say there
              // is no ftpconfig if none in directory all the time
              // atom.notifications.addError("Remote FTP: " + err);
              return;
            }
            _this7.connect(true);
          });
        }

        this.emitter.once('connected', onconnect);
        return false;
      }
      console.warn('Remote FTP: Not connected and typeof onconnect is ' + typeof onconnect);
      return false;
    }
  }, {
    key: 'connect',
    value: function connect(reconnect) {
      if (reconnect !== true) this.disconnect();
      if (this.isConnected()) return;
      if (!this.info) return;
      if (this.info.promptForPass === true) {
        this.promptForPass();
      } else if (this.info.keyboardInteractive === true) {
        this.promptForKeyboardInteractive();
      } else if (this.info.keyboardInteractiveForPass === true) {
        this.info.verifyCode = this.info.pass;
        this.doConnect();
      } else {
        this.doConnect();
      }
    }
  }, {
    key: 'doConnect',
    value: function doConnect() {
      var self = this;

      atom.notifications.addInfo('Remote FTP: Connecting...', {
        dismissable: false
      });

      var info = undefined;
      switch (self.info.protocol) {
        case 'ftp':
          {
            info = {
              host: self.info.host || '',
              port: self.info.port || 21,
              user: self.info.user || '',
              password: self.info.pass || '',
              secure: self.info.secure || '',
              secureOptions: self.info.secureOptions || '',
              connTimeout: self.info.timeout || 10000,
              pasvTimeout: self.info.timeout || 10000,
              forcePasv: self.info.forcePasv || true,
              keepalive: self.info.keepalive === undefined ? 10000 : self.info.keepalive, // long version, because 0 is a valid value
              debug: function debug(str) {
                var log = str.match(/^\[connection\] (>|<) '(.*?)(\\r\\n)?'$/);
                if (!log) return;
                if (log[2].match(/^PASS /)) log[2] = 'PASS ******';
                self.emitter.emit('debug', log[1] + ' ' + log[2]);
              }
            };
            self.connector = new _connectorsFtp2['default'](self);
            break;
          }

        case 'sftp':
          {
            info = {
              host: self.info.host || '',
              port: self.info.port || 22,
              username: self.info.user || '',
              readyTimeout: self.info.connTimeout || 10000,
              keepaliveInterval: self.info.keepalive || 10000,
              verifyCode: self.info.verifyCode || ''
            };

            if (self.info.pass) info.password = self.info.pass;

            if (self.info.privatekey) {
              self.info.privatekey = (0, _helpers.resolveHome)(self.info.privatekey);

              try {
                var pk = _fsPlus2['default'].readFileSync(self.info.privatekey);
                info.privateKey = pk;
              } catch (err) {
                atom.notifications.addError('Remote FTP: Could not read privateKey file', {
                  detail: err,
                  dismissable: true
                });
              }
            }

            if (self.info.passphrase) info.passphrase = self.info.passphrase;

            if (self.info.agent) info.agent = self.info.agent;

            if (self.info.agent === 'env') info.agent = process.env.SSH_AUTH_SOCK;

            if (self.info.hosthash) info.hostHash = self.info.hosthash;

            if (self.info.ignorehost) {
              // NOTE: hostVerifier doesn't run at all if it's not a function.
              // Allows you to skip hostHash option in ssh2 0.5+
              info.hostVerifier = false;
            }

            info.algorithms = {
              kex: SSH2_ALGORITHMS.SUPPORTED_KEX,
              cipher: SSH2_ALGORITHMS.SUPPORTED_CIPHER,
              serverHostKey: SSH2_ALGORITHMS.SUPPORTED_SERVER_HOST_KEY,
              hmac: SSH2_ALGORITHMS.SUPPORTED_HMAC,
              compress: SSH2_ALGORITHMS.SUPPORTED_COMPRESS
            };

            info.filePermissions = self.info.filePermissions;
            info.remoteCommand = self.info.remoteCommand;
            info.remoteShell = self.info.remoteShell;

            if (self.info.keyboardInteractive) info.tryKeyboard = true;
            if (self.info.keyboardInteractiveForPass) info.tryKeyboard = true;

            self.connector = new _connectorsSftp2['default'](self);
            break;
          }

        default:
          throw new Error('No `protocol` found in connection credential. Please recreate .ftpconfig file from Packages -> Remote FTP -> Create (S)FTP config file.');
      }

      self.connector.connect(info, function () {
        if (self.root.status !== 1) self.root.open();
        self.status = 'CONNECTED';
        self.emitter.emit('connected');

        atom.notifications.addSuccess('Remote FTP: Connected', {
          dismissable: false
        });
      });

      self.connector.on('closed', function (action) {
        if (self.status === 'NOT_CONNECTED') return;

        self.status = 'NOT_CONNECTED';
        self.emitter.emit('closed');

        atom.notifications.addInfo('Remote FTP: Connection closed', {
          dismissable: false
        });

        self.disconnect(function () {
          if (action === 'RECONNECT') self.connect(true);
        });
      });

      self.connector.on('ended', function () {
        self.emitter.emit('ended');
      });

      self.connector.on('error', function (err, code) {
        if (code === 421 || code === 'ECONNRESET') return;
        atom.notifications.addError('Remote FTP: Connection failed', {
          detail: err,
          dismissable: false
        });
      });

      self.watchDebug(atom.config.get('remote-ftp.dev.debugResponse'));
    }
  }, {
    key: 'watchDebug',
    value: function watchDebug(isWatching) {
      this.emitter.off('debug', _helpers.logger);

      if (isWatching) {
        this.emitter.on('debug', _helpers.logger);
      } else {
        this.emitter.off('debug', _helpers.logger);
      }
    }
  }, {
    key: 'disconnect',
    value: function disconnect(cb) {
      if (this.connector) {
        this.connector.disconnect();
        delete this.connector;
        this.connector = null;
      }

      if (this.root) {
        this.root.status = 0;
        this.root.destroy();
      }

      this.watch.removeListeners.apply(this);

      this.current = null;
      this.queue = [];

      this.status = 'NOT_CONNECTED';
      this.emitter.emit('disconnected');

      if (typeof cb === 'function') cb();

      return this;
    }
  }, {
    key: 'toRemote',
    value: function toRemote(local) {
      return _path2['default'].join(this.info.remote, atom.project.relativize(local)).replace(/\\/g, '/');
    }
  }, {
    key: 'toLocal',
    value: function toLocal(remote) {
      var target = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

      var projectPath = this.getProjectPath();
      var remoteLength = this.info.remote.length;

      if (projectPath === false) return false;
      if (typeof remote !== 'string') {
        throw new Error('Remote FTP: remote must be a string, was passed ' + typeof remote);
      }

      var path = null;
      if (remoteLength > 1) {
        path = './' + remote.substr(this.info.remote.length);
      } else {
        path = './' + remote;
      }

      return _path2['default'].resolve(_path2['default'].join(projectPath, target, './' + path.replace(/^\/+/, '')));
    }
  }, {
    key: '_next',
    value: function _next() {
      if (!this.isConnected()) return;

      this.current = this.queue.shift();

      if (this.current) this.current[1].apply(this, [this.current[2]]);

      if (typeof atom.project.remoteftp.emitter !== 'undefined') {
        atom.project.remoteftp.emitter.emit('queue-changed');
      }
    }
  }, {
    key: '_enqueue',
    value: function _enqueue(func, desc) {
      var progress = new _progress2['default']();

      this.queue.push([desc, func, progress]);
      if (this.queue.length === 1 && !this.current) this._next();else this.emitter.emit('queue-changed');

      return progress;
    }
  }, {
    key: 'abort',
    value: function abort() {
      var _this8 = this;

      if (this.isConnected()) {
        this.connector.abort(function () {
          _this8._next();
        });
      }

      return this;
    }
  }, {
    key: 'abortAll',
    value: function abortAll() {
      this.current = null;
      this.queue = [];

      if (this.isConnected()) {
        this.connector.abort();
      }

      this.emitter.emit('queue-changed');

      return this;
    }
  }, {
    key: 'list',
    value: function list(remote, recursive, callback) {
      var _this9 = this;

      this.onceConnected(function () {
        _this9._enqueue(function () {
          _this9.connector.list(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this9._next();
          });
        }, 'Listing ' + (recursive ? 'recursively ' : '') + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'downloadTo',
    value: function downloadTo(remotePath, targetPath, recursive, callback) {
      var _this10 = this;

      if (this.checkIgnore(remotePath)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this10._enqueue(function (progress) {
          _this10.connector.getTo(remotePath, targetPath, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this10._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Downloading ' + _path2['default'].basename(remotePath));
      });
    }
  }, {
    key: 'download',
    value: function download(remote, recursive, callback) {
      var _this11 = this;

      if (this.checkIgnore(remote)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this11._enqueue(function (progress) {
          _this11.connector.get(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this11._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Downloading ' + _path2['default'].basename(remote));
      });
    }
  }, {
    key: 'upload',
    value: function upload(local, callback) {
      var _this12 = this;

      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this12._enqueue(function (progress) {
          _this12.connector.put(local, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this12._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Uploading ' + _path2['default'].basename(local));
      });
    }
  }, {
    key: 'uploadTo',
    value: function uploadTo(local, remote, callback) {
      var _this13 = this;

      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      this.onceConnected(function () {
        _this13._enqueue(function (progress) {
          _this13.connector.putTo(local, remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this13._next();
          }, function (percent) {
            progress.setProgress(percent);
          });
        }, 'Uploading ' + _path2['default'].basename(local));
      });
    }
  }, {
    key: 'syncRemoteFileToLocal',
    value: function syncRemoteFileToLocal(remote, callback) {
      var _this14 = this;

      if (this.checkIgnore(remote)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        this._enqueue(function () {
          _this14.connector.get(remote, false, function (err) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }
            _this14._next();
          });
        }, 'Sync ' + _path2['default'].basename(remote));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'syncRemoteDirectoryToLocal',
    value: function syncRemoteDirectoryToLocal(remote, isFile, callback) {
      var _this15 = this;

      // TODO: Tidy up this function. Does ( probably ) not need to list from the connector
      // if isFile === true. Will need to check to see if that doesn't break anything before
      // implementing. In the meantime current solution should work for #453
      //
      // TODO: This method only seems to be referenced by the context menu command so gracefully
      // removing list without breaking this method should be do-able. 'isFile' is always sending
      // false at the moment inside commands.js
      if (!remote) return;

      // Check ignores
      if (remote !== '/' && this.checkIgnore(remote)) {
        this._next();
        return;
      }

      this._enqueue(function () {
        var local = _this15.toLocal(remote);

        _this15.connector.list(remote, true, function (err, remotes) {
          if (err) {
            if (typeof callback === 'function') callback.apply(null, [err]);

            return;
          }

          // Create folder if no exists in local
          (0, _helpers.mkdirSyncRecursive)(local);

          // remove ignored remotes
          if (_this15.ignoreFilter) {
            for (var i = remotes.length - 1; i >= 0; i--) {
              if (_this15.checkIgnore(remotes[i].name)) {
                remotes.splice(i, 1); // remove from list
              }
            }
          }

          (0, _helpers.traverseTree)(local, function (locals) {
            var error = function error() {
              if (typeof callback === 'function') callback.apply(null);
              _this15._next();
            };

            var n = function n() {
              var remoteOne = remotes.shift();
              var loc = undefined;

              if (!remoteOne) return error();

              var toLocal = _this15.toLocal(remoteOne.name);
              loc = null;

              for (var a = 0, b = locals.length; a < b; ++a) {
                if (locals[a].name === toLocal) {
                  loc = locals[a];
                  break;
                }
              }

              // Download only if not present on local or size differ
              if (!loc || remoteOne.size !== loc.size) {
                _this15.connector.get(remoteOne.name, true, function () {
                  return n();
                });
              } else {
                n();
              }

              return true;
            };

            if (remotes.length === 0) {
              _this15.connector.get(remote, false, function () {
                return n();
              });
              return;
            }
            n();
          });
        }, isFile);
        // NOTE: Added isFile to end of call to prevent breaking any functions
        // that already use list command. Is file is used only for ftp connector
        // as it will list a file as a file of itself unlinke with sftp which
        // will throw an error.
      }, 'Sync ' + _path2['default'].basename(remote));
    }
  }, {
    key: 'syncLocalFileToRemote',
    value: function syncLocalFileToRemote(local, callback) {
      var _this16 = this;

      // Check ignores
      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        // progress
        this._enqueue(function () {
          _this16.connector.put(local, function (err) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }
            _this16._next();
          });
        }, 'Sync: ' + _path2['default'].basename(local));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'syncLocalDirectoryToRemote',
    value: function syncLocalDirectoryToRemote(local, callback) {
      var _this17 = this;

      // Check ignores
      if (this.checkIgnore(local)) {
        this._next();
        return;
      }

      // verify active connection
      if (this.status === 'CONNECTED') {
        this._enqueue(function () {
          var remote = _this17.toRemote(local);

          _this17.connector.list(remote, true, function (err, remotes) {
            if (err) {
              if (typeof callback === 'function') callback.apply(null, [err]);
              return;
            }

            // remove ignored remotes
            if (_this17.ignoreFilter) {
              for (var i = remotes.length - 1; i >= 0; i--) {
                if (_this17.checkIgnore(remotes[i].name)) {
                  remotes.splice(i, 1); // remove from list
                }
              }
            }

            (0, _helpers.traverseTree)(local, function (locals) {
              var error = function error() {
                if (typeof callback === 'function') callback.apply(null);
                _this17._next();
              };

              // remove ignored locals
              if (_this17.ignoreFilter) {
                for (var i = locals.length - 1; i >= 0; i--) {
                  if (_this17.checkIgnore(locals[i].name)) {
                    locals.splice(i, 1); // remove from list
                  }
                }
              }

              var n = function n() {
                var nLocal = locals.shift();
                var nRemote = undefined;

                if (!nLocal) {
                  return error();
                }

                var toRemote = _this17.toRemote(nLocal.name);
                nRemote = null;

                for (var a = 0, b = remotes.length; a < b; ++a) {
                  if (remotes[a].name === toRemote) {
                    nRemote = remotes[a];
                    break;
                  }
                }

                // NOTE: Upload only if not present on remote or size differ
                if (!nRemote) {
                  if (nLocal.type === 'd') {
                    _this17.connector.mkdir(toRemote, false, function () {
                      return n();
                    });
                  } else if (nLocal.type === 'f') {
                    _this17.connector.put(nLocal.name, function () {
                      return n();
                    });
                  } else {
                    n();
                  }
                } else if (nRemote.size !== nLocal.size && nLocal.type === 'f') {
                  _this17.connector.put(nLocal.name, function () {
                    return n();
                  });
                } else {
                  n();
                }

                return true;
              };

              n();
            });
          });
        }, 'Sync ' + _path2['default'].basename(local));
      } else {
        atom.notifications.addError('Remote FTP: Not connected!', {
          dismissable: true
        });
      }
    }
  }, {
    key: 'mkdir',
    value: function mkdir(remote, recursive, callback) {
      var _this18 = this;

      this.onceConnected(function () {
        _this18._enqueue(function () {
          _this18.connector.mkdir(remote, recursive, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this18._next();
          });
        }, 'Creating folder ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'mkfile',
    value: function mkfile(remote, callback) {
      var _this19 = this;

      this.onceConnected(function () {
        _this19._enqueue(function () {
          _this19.connector.mkfile(remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this19._next();
          });
        }, 'Creating file ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'rename',
    value: function rename(source, dest, callback) {
      var _this20 = this;

      this.onceConnected(function () {
        _this20._enqueue(function () {
          _this20.connector.rename(source, dest, function (err) {
            if (typeof callback === 'function') callback.apply(null, [err]);
            _this20._next();
          });
        }, 'Renaming ' + _path2['default'].basename(source));
      });
      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(remote, callback) {
      var _this21 = this;

      this.onceConnected(function () {
        _this21._enqueue(function () {
          _this21.connector['delete'](remote, function () {
            if (typeof callback === 'function') callback.apply(undefined, arguments);
            _this21._next();
          });
        }, 'Deleting ' + _path2['default'].basename(remote));
      });

      return this;
    }
  }, {
    key: 'site',
    value: function site(command, callback) {
      var _this22 = this;

      this.onceConnected(function () {
        _this22.connector.site(command, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (typeof callback === 'function') callback(args);
        });
      });
    }
  }, {
    key: 'chmod',
    value: function chmod(path, mode, callback) {
      var _this23 = this;

      this.onceConnected(function () {
        _this23.connector.chmod(path, mode, callback);
      });
    }
  }, {
    key: 'chown',
    value: function chown(path, uid, gid, callback) {
      var _this24 = this;

      this.onceConnected(function () {
        if (typeof gid === 'function') {
          _this24.connector.chown(path, uid, gid);
        } else {
          _this24.connector.chown(path, uid, gid, callback);
        }
      });
    }
  }, {
    key: 'chgrp',
    value: function chgrp(path, uid, gid, callback) {
      var _this25 = this;

      this.onceConnected(function () {
        _this25.connector.chgrp(path, uid, gid, callback);
      });
    }
  }, {
    key: 'promptForPass',
    value: function promptForPass() {
      var _this26 = this;

      var dialog = new _dialogsPromptPassDialog2['default']('', true);
      dialog.on('dialog-done', function (e, pass) {
        _this26.info.pass = pass;
        _this26.info.passphrase = pass;
        dialog.close();
        _this26.doConnect();
      });
      dialog.attach();
    }
  }, {
    key: 'promptForKeyboardInteractive',
    value: function promptForKeyboardInteractive() {
      var _this27 = this;

      var dialog = new _dialogsPromptPassDialog2['default'](true);

      dialog.on('dialog-done', function (e, pass) {
        _this27.info.verifyCode = pass;
        dialog.close();
        _this27.doConnect();
      });

      dialog.attach();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.emitter.dispose();
      this.watch.removeListeners();
    }
  }], [{
    key: 'toRelative',
    value: function toRelative(path) {
      var relativePath = atom.project.relativize(path);

      if (!relativePath.length) {
        relativePath = '/';
      } else if (relativePath[0] === '/') {
        relativePath = relativePath.substr(1);
      }

      return relativePath;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O2tCQUNULElBQUk7Ozs7b0JBQzJDLE1BQU07O2lDQUNsRCxzQkFBc0I7O29CQUN2QixNQUFNOzs7O2lDQUNPLHFCQUFxQjs7OztzQkFDaEMsUUFBUTs7Ozt5QkFDTCxZQUFZOzs7O3VCQUNpRyxXQUFXOzt5QkFDeEgsYUFBYTs7Ozt3QkFDZCxZQUFZOzs7OzZCQUNqQixrQkFBa0I7Ozs7OEJBQ2pCLG1CQUFtQjs7Ozt1Q0FDUCw4QkFBOEI7Ozs7QUFmM0QsV0FBVyxDQUFDOztBQWlCWixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzs7SUFFaEQsTUFBTTtBQUNkLFdBRFEsTUFBTSxHQUNYOzBCQURLLE1BQU07O0FBRXZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixRQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRWhCLFFBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxjQUFjLEdBQUcsWUFBWSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzFCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVuQixRQUFJLENBQUMsSUFBSSxHQUFHLDJCQUFjO0FBQ3hCLFVBQUksRUFBRSxHQUFH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LENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWpELFVBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQ3hCLG9CQUFZLEdBQUcsR0FBRyxDQUFDO09BQ3BCLE1BQU0sSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQ2xDLG9CQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUN2Qzs7QUFFRCxhQUFPLFlBQVksQ0FBQztLQUNyQjs7O1NBcmxCa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRlMgZnJvbSAnZnMtcGx1cyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHsgRmlsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgd2F0Y2hQYXRoIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyAkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IFBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgc3RyaXBKc29uQ29tbWVudHMgZnJvbSAnc3RyaXAtanNvbi1jb21tZW50cyc7XG5pbXBvcnQgaWdub3JlIGZyb20gJ2lnbm9yZSc7XG5pbXBvcnQgc3NoQ29uZmlnIGZyb20gJ3NzaC1jb25maWcnO1xuaW1wb3J0IHsgbXVsdGlwbGVIb3N0c0VuYWJsZWQsIGdldE9iamVjdCwgaGFzUHJvamVjdCwgbG9nZ2VyLCB0cmF2ZXJzZVRyZWUsIHZhbGlkYXRlQ29uZmlnLCByZXNvbHZlSG9tZSwgbWtkaXJTeW5jUmVjdXJzaXZlIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBEaXJlY3RvcnkgZnJvbSAnLi9kaXJlY3RvcnknO1xuaW1wb3J0IFByb2dyZXNzIGZyb20gJy4vcHJvZ3Jlc3MnO1xuaW1wb3J0IEZUUCBmcm9tICcuL2Nvbm5lY3RvcnMvZnRwJztcbmltcG9ydCBTRlRQIGZyb20gJy4vY29ubmVjdG9ycy9zZnRwJztcbmltcG9ydCBQcm9tcHRQYXNzRGlhbG9nIGZyb20gJy4vZGlhbG9ncy9wcm9tcHQtcGFzcy1kaWFsb2cnO1xuXG5jb25zdCBTU0gyX0FMR09SSVRITVMgPSByZXF1aXJlKCdzc2gyLXN0cmVhbXMnKS5jb25zdGFudHMuQUxHT1JJVEhNUztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2VsZi5pbmZvID0gbnVsbDtcbiAgICBzZWxmLmNvbm5lY3RvciA9IG51bGw7XG4gICAgc2VsZi5jdXJyZW50ID0gbnVsbDtcbiAgICBzZWxmLnF1ZXVlID0gW107XG5cbiAgICBzZWxmLmNvbmZpZ0ZpbGVOYW1lID0gJy5mdHBjb25maWcnO1xuICAgIHNlbGYuaWdub3JlQmFzZU5hbWUgPSAnLmZ0cGlnbm9yZSc7XG4gICAgc2VsZi5pZ25vcmVGaWx0ZXIgPSBmYWxzZTtcbiAgICBzZWxmLndhdGNoZXJzID0gW107XG5cbiAgICBzZWxmLnJvb3QgPSBuZXcgRGlyZWN0b3J5KHtcbiAgICAgIG5hbWU6ICcvJyxcbiAgICAgIHBhdGg6ICcvJyxcbiAgICAgIGNsaWVudDogdGhpcyxcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBzZWxmLnN0YXR1cyA9ICdOT1RfQ09OTkVDVEVEJzsgLy8gT3B0aW9ucyBOT1RfQ09OTkVDVEVELCBDT05ORUNUSU5HLCBDT05ORUNURURcblxuICAgIHNlbGYud2F0Y2ggPSB7XG4gICAgICB3YXRjaGVyOiBudWxsLFxuICAgICAgZmlsZXM6IFtdLFxuICAgICAgYWRkTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgd2F0Y2hEYXRhID0gZ2V0T2JqZWN0KHtcbiAgICAgICAgICBrZXlzOiBbJ2luZm8nLCAnd2F0Y2gnXSxcbiAgICAgICAgICBvYmo6IHNlbGYsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAod2F0Y2hEYXRhID09PSBudWxsIHx8IHdhdGNoRGF0YSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgICAgaWYgKHR5cGVvZiB3YXRjaERhdGEgPT09ICdzdHJpbmcnKSB3YXRjaERhdGEgPSBbd2F0Y2hEYXRhXTtcblxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkod2F0Y2hEYXRhKSB8fCB3YXRjaERhdGEubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaWcgPSBpZ25vcmUoKS5hZGQod2F0Y2hEYXRhKTtcblxuICAgICAgICB3YXRjaFBhdGgoc2VsZi5nZXRQcm9qZWN0UGF0aCgpLCB7fSwgKGV2ZW50cykgPT4ge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGV2ZW50cykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBldmVudCA9IGV2ZW50c1trZXldO1xuICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gUGF0aC5yZWxhdGl2ZShzZWxmLmdldFByb2plY3RQYXRoKCksIGV2ZW50LnBhdGgpO1xuXG4gICAgICAgICAgICBpZiAoIWlnLmlnbm9yZXMocmVsYXRpdmVQYXRoKSkgcmV0dXJuO1xuICAgICAgICAgICAgc2VsZi53YXRjaC5maWxlcy5wdXNoKHJlbGF0aXZlUGF0aCk7XG5cbiAgICAgICAgICAgIGlmIChldmVudC5hY3Rpb24gPT09ICdtb2RpZmllZCcgJiYgIXJlbGF0aXZlUGF0aC5tYXRjaCgvKF58Wy9cXFxcXSlcXC4uLykpIHtcbiAgICAgICAgICAgICAgc2VsZi53YXRjaC5xdWV1ZVVwbG9hZC5hcHBseShzZWxmLCBbZXZlbnQucGF0aCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAubm90aWZpY2F0aW9ucy5lbmFibGVXYXRjaEZpbGVDaGFuZ2UnKSkge1xuICAgICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oYFJlbW90ZSBGVFA6IENoYW5nZSBkZXRlY3RlZCBpbjogJHtldmVudC5wYXRofWAsIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBzZWxmLndhdGNoLmZpbGVzLmluZGV4T2YocmVsYXRpdmVQYXRoKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi53YXRjaC5maWxlc1tpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLnRoZW4oZGlzcG9zYWJsZSA9PiBzZWxmLndhdGNoZXJzLnB1c2goZGlzcG9zYWJsZSkpO1xuXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdSZW1vdGUgRlRQOiBBZGRlZCB3YXRjaCBsaXN0ZW5lcnMuJywge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoc2VsZi53YXRjaGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VsZi53YXRjaGVycy5mb3JFYWNoKHdhdGNoZXIgPT4gd2F0Y2hlci5kaXNwb3NlKCkpO1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1JlbW90ZSBGVFA6IFN0b3BwZWQgd2F0Y2ggbGlzdGVuZXJzLicsIHtcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHNlbGYud2F0Y2hlcnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHF1ZXVlOiB7fSxcbiAgICAgIHF1ZXVlVXBsb2FkKGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCB0aW1lb3V0RHVyYXRpb24gPSBpc05hTihwYXJzZUludChzZWxmLmluZm8ud2F0Y2hUaW1lb3V0LCAxMCkpID09PSB0cnVlXG4gICAgICAgICAgPyA1MDBcbiAgICAgICAgICA6IHBhcnNlSW50KHNlbGYuaW5mby53YXRjaFRpbWVvdXQsIDEwKTtcblxuICAgICAgICBmdW5jdGlvbiBzY2hlZHVsZVVwbG9hZChmaWxlKSB7XG4gICAgICAgICAgc2VsZi53YXRjaC5xdWV1ZVtmaWxlXSA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc2VsZi51cGxvYWQoZmlsZSwgY2FsbGJhY2spO1xuICAgICAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi53YXRjaC5xdWV1ZVtmaWxlTmFtZV0gIT09IG51bGwpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoc2VsZi53YXRjaC5xdWV1ZVtmaWxlTmFtZV0pO1xuICAgICAgICAgIHNlbGYud2F0Y2gucXVldWVbZmlsZU5hbWVdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjaGVkdWxlVXBsb2FkKGZpbGVOYW1lKTtcbiAgICAgIH0sXG5cbiAgICB9O1xuXG4gICAgc2VsZi53YXRjaC5hZGRMaXN0ZW5lcnMgPSBzZWxmLndhdGNoLmFkZExpc3RlbmVycy5iaW5kKHNlbGYpO1xuICAgIHNlbGYud2F0Y2gucmVtb3ZlTGlzdGVuZXJzID0gc2VsZi53YXRjaC5yZW1vdmVMaXN0ZW5lcnMuYmluZChzZWxmKTtcblxuICAgIHNlbGYub25EaWRDb25uZWN0ZWQoc2VsZi53YXRjaC5hZGRMaXN0ZW5lcnMpO1xuICAgIHNlbGYub25EaWREaXNjb25uZWN0ZWQoc2VsZi53YXRjaC5yZW1vdmVMaXN0ZW5lcnMpO1xuXG4gICAgc2VsZi5ldmVudHMoKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU3RhdHVzKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignY2hhbmdlLXN0YXR1cycsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0dXMpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkQ29ubmVjdGVkKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignY29ubmVjdGVkJywgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh0aGlzLnN0YXR1cyk7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2Utc3RhdHVzJyk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgb25EaWREaXNjb25uZWN0ZWQoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkaXNjb25uZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuc3RhdHVzKTtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NoYW5nZS1zdGF0dXMnKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBvbkRpZENsb3NlZChjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2sodGhpcy5zdGF0dXMpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkRGVidWcoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkZWJ1ZycsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkUXVldWVDaGFuZ2VkKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbigncXVldWUtY2hhbmdlZCcsICgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBldmVudHMoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdyZW1vdGUtZnRwLmRldi5kZWJ1Z1Jlc3BvbnNlJywgKHZhbHVlcykgPT4ge1xuICAgICAgICB0aGlzLndhdGNoRGVidWcodmFsdWVzLm5ld1ZhbHVlKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3JlbW90ZS1mdHAudHJlZS5zaG93UHJvamVjdE5hbWUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0UHJvamVjdE5hbWUoKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBzZXRQcm9qZWN0TmFtZSgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZnRwQ29uZmlnUGF0aCA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybjtcblxuICAgIGNvbnN0IHByb2plY3RSb290ID0gYXRvbS5jb25maWcuZ2V0KCdyZW1vdGUtZnRwLnRyZWUuc2hvd1Byb2plY3ROYW1lJyk7XG4gICAgY29uc3QgJHJvb3ROYW1lID0gJCgnLmZ0cHRyZWUtdmlldyAucHJvamVjdC1yb290ID4gLmhlYWRlciBzcGFuJyk7XG5cbiAgICBsZXQgcm9vdE5hbWUgPSAnLyc7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuaW5mb1twcm9qZWN0Um9vdF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByb290TmFtZSA9IHRoaXMuaW5mb1twcm9qZWN0Um9vdF07XG4gICAgfVxuXG4gICAgdGhpcy5yb290Lm5hbWUgPSByb290TmFtZTtcbiAgICAkcm9vdE5hbWUudGV4dChyb290TmFtZSk7XG4gIH1cblxuICByZWFkQ29uZmlnKGNhbGxiYWNrKSB7XG4gICAgbGV0IENTT047XG5cbiAgICBjb25zdCBlcnJvciA9IChlcnIpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrLmFwcGx5KHRoaXMsIFtlcnJdKTtcbiAgICB9O1xuICAgIHRoaXMuaW5mbyA9IG51bGw7XG4gICAgdGhpcy5mdHBDb25maWdQYXRoID0gdGhpcy5nZXRDb25maWdQYXRoKCk7XG5cbiAgICBjb25zdCBjc29uQ29uZmlnID0gbmV3IEZpbGUodGhpcy5nZXRGaWxlUGF0aChgJHt0aGlzLmZ0cENvbmZpZ1BhdGh9LmNzb25gKSk7XG5cbiAgICBpZiAodGhpcy5mdHBDb25maWdQYXRoID09PSBmYWxzZSkgdGhyb3cgbmV3IEVycm9yKCdSZW1vdGUgRlRQOiBnZXRDb25maWdQYXRoIHJldHVybmVkIGZhbHNlLCBidXQgZXhwZWN0ZWQgYSBzdHJpbmcnKTtcblxuICAgIGNvbnN0IG1vZGlmeUNvbmZpZyA9IChqc29uKSA9PiB7XG4gICAgICB0aGlzLmluZm8gPSBqc29uO1xuICAgICAgdGhpcy5yb290Lm5hbWUgPSAnJztcbiAgICAgIGlmICh0aGlzLmluZm8ucmVtb3RlKSB7XG4gICAgICAgIHRoaXMucm9vdC5wYXRoID0gYC8ke3RoaXMuaW5mby5yZW1vdGUucmVwbGFjZSgvXlxcLysvLCAnJyl9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucm9vdC5wYXRoID0gJy8nO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pbmZvLnByaXZhdGVrZXkpIHtcbiAgICAgICAgdGhpcy5pbmZvLnByaXZhdGVrZXkgPSByZXNvbHZlSG9tZSh0aGlzLmluZm8ucHJpdmF0ZWtleSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0UHJvamVjdE5hbWUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZXh0ZW5kc0NvbmZpZyA9IChqc29uLCBlcnIpID0+IHtcbiAgICAgIGlmIChqc29uICE9PSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBzc2hDb25maWdQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdyZW1vdGUtZnRwLmNvbm5lY3Rvci5zc2hDb25maWdQYXRoJyk7XG5cbiAgICAgICAgaWYgKHNzaENvbmZpZ1BhdGggJiYgdGhpcy5pbmZvLnByb3RvY29sID09PSAnc2Z0cCcpIHtcbiAgICAgICAgICBjb25zdCBjb25maWdQYXRoID0gUGF0aC5ub3JtYWxpemUoc3NoQ29uZmlnUGF0aC5yZXBsYWNlKCd+Jywgb3MuaG9tZWRpcigpKSk7XG5cbiAgICAgICAgICBGUy5yZWFkRmlsZShjb25maWdQYXRoLCAndXRmOCcsIChmaWxlRXJyLCBjb25mKSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsZUVycikgcmV0dXJuIGVycm9yKGZpbGVFcnIpO1xuXG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBzc2hDb25maWcucGFyc2UoY29uZik7XG5cbiAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSBjb25maWcuZmluZCh7XG4gICAgICAgICAgICAgIEhvc3Q6IHRoaXMuaW5mby5ob3N0LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzZWN0aW9uICE9PSBudWxsICYmIHR5cGVvZiBzZWN0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjb25zdCBtYXBwaW5nID0gbmV3IE1hcChbXG4gICAgICAgICAgICAgICAgWydIb3N0TmFtZScsICdob3N0J10sXG4gICAgICAgICAgICAgICAgWydQb3J0JywgJ3BvcnQnXSxcbiAgICAgICAgICAgICAgICBbJ1VzZXInLCAndXNlciddLFxuICAgICAgICAgICAgICAgIFsnSWRlbnRpdHlGaWxlJywgJ3ByaXZhdGVrZXknXSxcbiAgICAgICAgICAgICAgICBbJ1NlcnZlckFsaXZlSW50ZXJ2YWwnLCAna2VlcGFsaXZlJ10sXG4gICAgICAgICAgICAgICAgWydDb25uZWN0VGltZW91dCcsICdjb25uVGltZW91dCddLFxuICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgICBzZWN0aW9uLmNvbmZpZy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gbWFwcGluZy5nZXQobGluZS5wYXJhbSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5mb1trZXldID0gbGluZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodGhpcywgW2VyciwgdGhpcy5pbmZvXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgW2VyciwganNvbl0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChjc29uQ29uZmlnLmV4aXN0c1N5bmMoKSkge1xuICAgICAgaWYgKHR5cGVvZiBDU09OID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBDU09OID0gcmVxdWlyZSgnY3Nvbi1wYXJzZXInKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGpzb24gPSBudWxsO1xuXG4gICAgICBjc29uQ29uZmlnLnJlYWQodHJ1ZSkudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGpzb24gPSBDU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgICAgICAgIG1vZGlmeUNvbmZpZyhqc29uKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ291bGQgbm90IHByb2Nlc3MgXFxgJHt0aGlzLmNvbmZpZ0ZpbGVOYW1lfVxcYC5gLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGUsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmRzQ29uZmlnKGpzb24sIG51bGwpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBGUy5yZWFkRmlsZSh0aGlzLmZ0cENvbmZpZ1BhdGgsICd1dGY4JywgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gZXJyb3IoZXJyKTtcblxuICAgICAgY29uc3QgZGF0YSA9IHN0cmlwSnNvbkNvbW1lbnRzKHJlcyk7XG4gICAgICBsZXQganNvbiA9IG51bGw7XG4gICAgICBpZiAodmFsaWRhdGVDb25maWcoZGF0YSwgdGhpcy5jb25maWdGaWxlTmFtZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgIG1vZGlmeUNvbmZpZyhqc29uKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ291bGQgbm90IHByb2Nlc3MgXFxgJHt0aGlzLmNvbmZpZ0ZpbGVOYW1lfVxcYC5gLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGUsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXh0ZW5kc0NvbmZpZyhqc29uLCBlcnIpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEZpbGVQYXRoKHJlbGF0aXZlUGF0aCkge1xuICAgIGNvbnN0IHByb2plY3RQYXRoID0gdGhpcy5nZXRQcm9qZWN0UGF0aCgpO1xuICAgIGlmIChwcm9qZWN0UGF0aCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gUGF0aC5yZXNvbHZlKHByb2plY3RQYXRoLCByZWxhdGl2ZVBhdGgpO1xuICB9XG5cbiAgZ2V0UHJvamVjdFBhdGgoKSB7XG4gICAgbGV0IHByb2plY3RQYXRoID0gbnVsbDtcblxuICAgIGlmIChtdWx0aXBsZUhvc3RzRW5hYmxlZCgpID09PSB0cnVlKSB7XG4gICAgICBjb25zdCAkY3VycmVudFByb2plY3QgPSAkKCcudHJlZS12aWV3IC5wcm9qZWN0LXJvb3QnKTtcblxuICAgICAgcHJvamVjdFBhdGggPSAkY3VycmVudFByb2plY3QuZmluZCgnPiAuaGVhZGVyIHNwYW4ubmFtZScpLmRhdGEoJ3BhdGgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmlyc3REaXJlY3RvcnkgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXTtcbiAgICAgIGlmIChmaXJzdERpcmVjdG9yeSAhPSBudWxsKSBwcm9qZWN0UGF0aCA9IGZpcnN0RGlyZWN0b3J5LnBhdGg7XG4gICAgfVxuXG4gICAgaWYgKHByb2plY3RQYXRoICE9IG51bGwpIHtcbiAgICAgIHRoaXMucHJvamVjdFBhdGggPSBwcm9qZWN0UGF0aDtcbiAgICAgIHJldHVybiBwcm9qZWN0UGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDb25maWdQYXRoKCkge1xuICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcy5nZXRGaWxlUGF0aChgLi8ke3RoaXMuY29uZmlnRmlsZU5hbWV9YCk7XG4gIH1cblxuICB1cGRhdGVJZ25vcmUoKSB7XG4gICAgY29uc3QgaWdub3JlUGF0aCA9IHRoaXMuZ2V0RmlsZVBhdGgodGhpcy5pZ25vcmVCYXNlTmFtZSk7XG4gICAgY29uc3QgaWdub3JlRmlsZSA9IG5ldyBGaWxlKGlnbm9yZVBhdGgpO1xuXG4gICAgaWYgKCFpZ25vcmVGaWxlLmV4aXN0c1N5bmMoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuaWdub3JlRmlsdGVyID0gaWdub3JlKCkuYWRkKGlnbm9yZUZpbGUucmVhZFN5bmModHJ1ZSkpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjaGVja0lnbm9yZShmaWxlcGF0aCkge1xuICAgIGNvbnN0IHJlbGF0aXZlRmlsZXBhdGggPSBDbGllbnQudG9SZWxhdGl2ZShmaWxlcGF0aCk7XG5cbiAgICBsZXQgaWdub3JlSXNBY3R1YWwgPSB0cnVlO1xuXG4gICAgLy8gdXBkYXRlSWdub3JlIHdoZW4gbm90IHNldCBvciAuZnRwaWdub3JlIGlzIHNhdmVkXG4gICAgaWYgKCF0aGlzLmlnbm9yZUZpbHRlciB8fCAocmVsYXRpdmVGaWxlcGF0aCA9PT0gdGhpcy5nZXRGaWxlUGF0aCh0aGlzLmlnbm9yZUJhc2VOYW1lKSkpIHtcbiAgICAgIGlnbm9yZUlzQWN0dWFsID0gdGhpcy51cGRhdGVJZ25vcmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaWdub3JlSXNBY3R1YWwgJiYgdGhpcy5pZ25vcmVGaWx0ZXIuaWdub3JlcyhyZWxhdGl2ZUZpbGVwYXRoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdG9yICYmIHRoaXMuY29ubmVjdG9yLmlzQ29ubmVjdGVkKCk7XG4gIH1cblxuICBvbmNlQ29ubmVjdGVkKG9uY29ubmVjdCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3RvciAmJiB0aGlzLmNvbm5lY3Rvci5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICBvbmNvbm5lY3QuYXBwbHkodGhpcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvbmNvbm5lY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ05PVF9DT05ORUNURUQnKSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ0NPTk5FQ1RJTkcnO1xuICAgICAgICB0aGlzLnJlYWRDb25maWcoKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ05PVF9DT05ORUNURUQnO1xuICAgICAgICAgICAgLy8gTk9URTogUmVtb3ZlIG5vdGlmaWNhdGlvbiBhcyBpdCB3aWxsIGp1c3Qgc2F5IHRoZXJlXG4gICAgICAgICAgICAvLyBpcyBubyBmdHBjb25maWcgaWYgbm9uZSBpbiBkaXJlY3RvcnkgYWxsIHRoZSB0aW1lXG4gICAgICAgICAgICAvLyBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJSZW1vdGUgRlRQOiBcIiArIGVycik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29ubmVjdCh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKCdjb25uZWN0ZWQnLCBvbmNvbm5lY3QpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zb2xlLndhcm4oYFJlbW90ZSBGVFA6IE5vdCBjb25uZWN0ZWQgYW5kIHR5cGVvZiBvbmNvbm5lY3QgaXMgJHt0eXBlb2Ygb25jb25uZWN0fWApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbm5lY3QocmVjb25uZWN0KSB7XG4gICAgaWYgKHJlY29ubmVjdCAhPT0gdHJ1ZSkgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSkgcmV0dXJuO1xuICAgIGlmICghdGhpcy5pbmZvKSByZXR1cm47XG4gICAgaWYgKHRoaXMuaW5mby5wcm9tcHRGb3JQYXNzID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnByb21wdEZvclBhc3MoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5mby5rZXlib2FyZEludGVyYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICB0aGlzLnByb21wdEZvcktleWJvYXJkSW50ZXJhY3RpdmUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5mby5rZXlib2FyZEludGVyYWN0aXZlRm9yUGFzcyA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5pbmZvLnZlcmlmeUNvZGUgPSB0aGlzLmluZm8ucGFzcztcbiAgICAgIHRoaXMuZG9Db25uZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9Db25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgZG9Db25uZWN0KCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1JlbW90ZSBGVFA6IENvbm5lY3RpbmcuLi4nLCB7XG4gICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBsZXQgaW5mbztcbiAgICBzd2l0Y2ggKHNlbGYuaW5mby5wcm90b2NvbCkge1xuICAgICAgY2FzZSAnZnRwJzoge1xuICAgICAgICBpbmZvID0ge1xuICAgICAgICAgIGhvc3Q6IHNlbGYuaW5mby5ob3N0IHx8ICcnLFxuICAgICAgICAgIHBvcnQ6IHNlbGYuaW5mby5wb3J0IHx8IDIxLFxuICAgICAgICAgIHVzZXI6IHNlbGYuaW5mby51c2VyIHx8ICcnLFxuICAgICAgICAgIHBhc3N3b3JkOiBzZWxmLmluZm8ucGFzcyB8fCAnJyxcbiAgICAgICAgICBzZWN1cmU6IHNlbGYuaW5mby5zZWN1cmUgfHwgJycsXG4gICAgICAgICAgc2VjdXJlT3B0aW9uczogc2VsZi5pbmZvLnNlY3VyZU9wdGlvbnMgfHwgJycsXG4gICAgICAgICAgY29ublRpbWVvdXQ6IHNlbGYuaW5mby50aW1lb3V0IHx8IDEwMDAwLFxuICAgICAgICAgIHBhc3ZUaW1lb3V0OiBzZWxmLmluZm8udGltZW91dCB8fCAxMDAwMCxcbiAgICAgICAgICBmb3JjZVBhc3Y6IHNlbGYuaW5mby5mb3JjZVBhc3YgfHwgdHJ1ZSxcbiAgICAgICAgICBrZWVwYWxpdmU6IChzZWxmLmluZm8ua2VlcGFsaXZlID09PSB1bmRlZmluZWQgPyAxMDAwMCA6IHNlbGYuaW5mby5rZWVwYWxpdmUpLCAvLyBsb25nIHZlcnNpb24sIGJlY2F1c2UgMCBpcyBhIHZhbGlkIHZhbHVlXG4gICAgICAgICAgZGVidWcoc3RyKSB7XG4gICAgICAgICAgICBjb25zdCBsb2cgPSBzdHIubWF0Y2goL15cXFtjb25uZWN0aW9uXFxdICg+fDwpICcoLio/KShcXFxcclxcXFxuKT8nJC8pO1xuICAgICAgICAgICAgaWYgKCFsb2cpIHJldHVybjtcbiAgICAgICAgICAgIGlmIChsb2dbMl0ubWF0Y2goL15QQVNTIC8pKSBsb2dbMl0gPSAnUEFTUyAqKioqKionO1xuICAgICAgICAgICAgc2VsZi5lbWl0dGVyLmVtaXQoJ2RlYnVnJywgYCR7bG9nWzFdfSAke2xvZ1syXX1gKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBzZWxmLmNvbm5lY3RvciA9IG5ldyBGVFAoc2VsZik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlICdzZnRwJzoge1xuICAgICAgICBpbmZvID0ge1xuICAgICAgICAgIGhvc3Q6IHNlbGYuaW5mby5ob3N0IHx8ICcnLFxuICAgICAgICAgIHBvcnQ6IHNlbGYuaW5mby5wb3J0IHx8IDIyLFxuICAgICAgICAgIHVzZXJuYW1lOiBzZWxmLmluZm8udXNlciB8fCAnJyxcbiAgICAgICAgICByZWFkeVRpbWVvdXQ6IHNlbGYuaW5mby5jb25uVGltZW91dCB8fCAxMDAwMCxcbiAgICAgICAgICBrZWVwYWxpdmVJbnRlcnZhbDogc2VsZi5pbmZvLmtlZXBhbGl2ZSB8fCAxMDAwMCxcbiAgICAgICAgICB2ZXJpZnlDb2RlOiBzZWxmLmluZm8udmVyaWZ5Q29kZSB8fCAnJyxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoc2VsZi5pbmZvLnBhc3MpIGluZm8ucGFzc3dvcmQgPSBzZWxmLmluZm8ucGFzcztcblxuICAgICAgICBpZiAoc2VsZi5pbmZvLnByaXZhdGVrZXkpIHtcbiAgICAgICAgICBzZWxmLmluZm8ucHJpdmF0ZWtleSA9IHJlc29sdmVIb21lKHNlbGYuaW5mby5wcml2YXRla2V5KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBwayA9IEZTLnJlYWRGaWxlU3luYyhzZWxmLmluZm8ucHJpdmF0ZWtleSk7XG4gICAgICAgICAgICBpbmZvLnByaXZhdGVLZXkgPSBwaztcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogQ291bGQgbm90IHJlYWQgcHJpdmF0ZUtleSBmaWxlJywge1xuICAgICAgICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5pbmZvLnBhc3NwaHJhc2UpIGluZm8ucGFzc3BocmFzZSA9IHNlbGYuaW5mby5wYXNzcGhyYXNlO1xuXG4gICAgICAgIGlmIChzZWxmLmluZm8uYWdlbnQpIGluZm8uYWdlbnQgPSBzZWxmLmluZm8uYWdlbnQ7XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5hZ2VudCA9PT0gJ2VudicpIGluZm8uYWdlbnQgPSBwcm9jZXNzLmVudi5TU0hfQVVUSF9TT0NLO1xuXG4gICAgICAgIGlmIChzZWxmLmluZm8uaG9zdGhhc2gpIGluZm8uaG9zdEhhc2ggPSBzZWxmLmluZm8uaG9zdGhhc2g7XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5pZ25vcmVob3N0KSB7XG4gICAgICAgICAgLy8gTk9URTogaG9zdFZlcmlmaWVyIGRvZXNuJ3QgcnVuIGF0IGFsbCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICAgICAgICAgIC8vIEFsbG93cyB5b3UgdG8gc2tpcCBob3N0SGFzaCBvcHRpb24gaW4gc3NoMiAwLjUrXG4gICAgICAgICAgaW5mby5ob3N0VmVyaWZpZXIgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluZm8uYWxnb3JpdGhtcyA9IHtcbiAgICAgICAgICBrZXg6IFNTSDJfQUxHT1JJVEhNUy5TVVBQT1JURURfS0VYLFxuICAgICAgICAgIGNpcGhlcjogU1NIMl9BTEdPUklUSE1TLlNVUFBPUlRFRF9DSVBIRVIsXG4gICAgICAgICAgc2VydmVySG9zdEtleTogU1NIMl9BTEdPUklUSE1TLlNVUFBPUlRFRF9TRVJWRVJfSE9TVF9LRVksXG4gICAgICAgICAgaG1hYzogU1NIMl9BTEdPUklUSE1TLlNVUFBPUlRFRF9ITUFDLFxuICAgICAgICAgIGNvbXByZXNzOiBTU0gyX0FMR09SSVRITVMuU1VQUE9SVEVEX0NPTVBSRVNTLFxuICAgICAgICB9O1xuXG4gICAgICAgIGluZm8uZmlsZVBlcm1pc3Npb25zID0gc2VsZi5pbmZvLmZpbGVQZXJtaXNzaW9ucztcbiAgICAgICAgaW5mby5yZW1vdGVDb21tYW5kID0gc2VsZi5pbmZvLnJlbW90ZUNvbW1hbmQ7XG4gICAgICAgIGluZm8ucmVtb3RlU2hlbGwgPSBzZWxmLmluZm8ucmVtb3RlU2hlbGw7XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5rZXlib2FyZEludGVyYWN0aXZlKSBpbmZvLnRyeUtleWJvYXJkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNlbGYuaW5mby5rZXlib2FyZEludGVyYWN0aXZlRm9yUGFzcykgaW5mby50cnlLZXlib2FyZCA9IHRydWU7XG5cbiAgICAgICAgc2VsZi5jb25uZWN0b3IgPSBuZXcgU0ZUUChzZWxmKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gYHByb3RvY29sYCBmb3VuZCBpbiBjb25uZWN0aW9uIGNyZWRlbnRpYWwuIFBsZWFzZSByZWNyZWF0ZSAuZnRwY29uZmlnIGZpbGUgZnJvbSBQYWNrYWdlcyAtPiBSZW1vdGUgRlRQIC0+IENyZWF0ZSAoUylGVFAgY29uZmlnIGZpbGUuJyk7XG4gICAgfVxuXG4gICAgc2VsZi5jb25uZWN0b3IuY29ubmVjdChpbmZvLCAoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5yb290LnN0YXR1cyAhPT0gMSkgc2VsZi5yb290Lm9wZW4oKTtcbiAgICAgIHNlbGYuc3RhdHVzID0gJ0NPTk5FQ1RFRCc7XG4gICAgICBzZWxmLmVtaXR0ZXIuZW1pdCgnY29ubmVjdGVkJyk7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCdSZW1vdGUgRlRQOiBDb25uZWN0ZWQnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgc2VsZi5jb25uZWN0b3Iub24oJ2Nsb3NlZCcsIChhY3Rpb24pID0+IHtcbiAgICAgIGlmIChzZWxmLnN0YXR1cyA9PT0gJ05PVF9DT05ORUNURUQnKSByZXR1cm47XG5cbiAgICAgIHNlbGYuc3RhdHVzID0gJ05PVF9DT05ORUNURUQnO1xuICAgICAgc2VsZi5lbWl0dGVyLmVtaXQoJ2Nsb3NlZCcpO1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnUmVtb3RlIEZUUDogQ29ubmVjdGlvbiBjbG9zZWQnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLmRpc2Nvbm5lY3QoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aW9uID09PSAnUkVDT05ORUNUJykgc2VsZi5jb25uZWN0KHRydWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLmNvbm5lY3Rvci5vbignZW5kZWQnLCAoKSA9PiB7XG4gICAgICBzZWxmLmVtaXR0ZXIuZW1pdCgnZW5kZWQnKTtcbiAgICB9KTtcblxuICAgIHNlbGYuY29ubmVjdG9yLm9uKCdlcnJvcicsIChlcnIsIGNvZGUpID0+IHtcbiAgICAgIGlmIChjb2RlID09PSA0MjEgfHwgY29kZSA9PT0gJ0VDT05OUkVTRVQnKSByZXR1cm47XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBGVFA6IENvbm5lY3Rpb24gZmFpbGVkJywge1xuICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLndhdGNoRGVidWcoYXRvbS5jb25maWcuZ2V0KCdyZW1vdGUtZnRwLmRldi5kZWJ1Z1Jlc3BvbnNlJykpO1xuICB9XG5cbiAgd2F0Y2hEZWJ1Zyhpc1dhdGNoaW5nKSB7XG4gICAgdGhpcy5lbWl0dGVyLm9mZignZGVidWcnLCBsb2dnZXIpO1xuXG4gICAgaWYgKGlzV2F0Y2hpbmcpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5vbignZGVidWcnLCBsb2dnZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXR0ZXIub2ZmKCdkZWJ1ZycsIGxvZ2dlcik7XG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChjYikge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rvcikge1xuICAgICAgdGhpcy5jb25uZWN0b3IuZGlzY29ubmVjdCgpO1xuICAgICAgZGVsZXRlIHRoaXMuY29ubmVjdG9yO1xuICAgICAgdGhpcy5jb25uZWN0b3IgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgIHRoaXMucm9vdC5zdGF0dXMgPSAwO1xuICAgICAgdGhpcy5yb290LmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLndhdGNoLnJlbW92ZUxpc3RlbmVycy5hcHBseSh0aGlzKTtcblxuICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuXG4gICAgdGhpcy5zdGF0dXMgPSAnTk9UX0NPTk5FQ1RFRCc7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2Rpc2Nvbm5lY3RlZCcpO1xuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIHRvUmVsYXRpdmUocGF0aCkge1xuICAgIGxldCByZWxhdGl2ZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZShwYXRoKTtcblxuICAgIGlmICghcmVsYXRpdmVQYXRoLmxlbmd0aCkge1xuICAgICAgcmVsYXRpdmVQYXRoID0gJy8nO1xuICAgIH0gZWxzZSBpZiAocmVsYXRpdmVQYXRoWzBdID09PSAnLycpIHtcbiAgICAgIHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlUGF0aC5zdWJzdHIoMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlbGF0aXZlUGF0aDtcbiAgfVxuXG4gIHRvUmVtb3RlKGxvY2FsKSB7XG4gICAgcmV0dXJuIFBhdGguam9pbihcbiAgICAgIHRoaXMuaW5mby5yZW1vdGUsXG4gICAgICBhdG9tLnByb2plY3QucmVsYXRpdml6ZShsb2NhbCksXG4gICAgKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gIH1cblxuICB0b0xvY2FsKHJlbW90ZSwgdGFyZ2V0ID0gJycpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHRoaXMuZ2V0UHJvamVjdFBhdGgoKTtcbiAgICBjb25zdCByZW1vdGVMZW5ndGggPSB0aGlzLmluZm8ucmVtb3RlLmxlbmd0aDtcblxuICAgIGlmIChwcm9qZWN0UGF0aCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodHlwZW9mIHJlbW90ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVtb3RlIEZUUDogcmVtb3RlIG11c3QgYmUgYSBzdHJpbmcsIHdhcyBwYXNzZWQgJHt0eXBlb2YgcmVtb3RlfWApO1xuICAgIH1cblxuICAgIGxldCBwYXRoID0gbnVsbDtcbiAgICBpZiAocmVtb3RlTGVuZ3RoID4gMSkge1xuICAgICAgcGF0aCA9IGAuLyR7cmVtb3RlLnN1YnN0cih0aGlzLmluZm8ucmVtb3RlLmxlbmd0aCl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aCA9IGAuLyR7cmVtb3RlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFBhdGgucmVzb2x2ZShQYXRoLmpvaW4ocHJvamVjdFBhdGgsIHRhcmdldCwgYC4vJHtwYXRoLnJlcGxhY2UoL15cXC8rLywgJycpfWApKTtcbiAgfVxuXG4gIF9uZXh0KCkge1xuICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZCgpKSByZXR1cm47XG5cbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50KSB0aGlzLmN1cnJlbnRbMV0uYXBwbHkodGhpcywgW3RoaXMuY3VycmVudFsyXV0pO1xuXG4gICAgaWYgKHR5cGVvZiBhdG9tLnByb2plY3QucmVtb3RlZnRwLmVtaXR0ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBhdG9tLnByb2plY3QucmVtb3RlZnRwLmVtaXR0ZXIuZW1pdCgncXVldWUtY2hhbmdlZCcpO1xuICAgIH1cbiAgfVxuXG4gIF9lbnF1ZXVlKGZ1bmMsIGRlc2MpIHtcbiAgICBjb25zdCBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcygpO1xuXG4gICAgdGhpcy5xdWV1ZS5wdXNoKFtkZXNjLCBmdW5jLCBwcm9ncmVzc10pO1xuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5jdXJyZW50KSB0aGlzLl9uZXh0KCk7XG5cbiAgICBlbHNlIHRoaXMuZW1pdHRlci5lbWl0KCdxdWV1ZS1jaGFuZ2VkJyk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gIH1cblxuICBhYm9ydCgpIHtcbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rvci5hYm9ydCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWJvcnRBbGwoKSB7XG4gICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICB0aGlzLnF1ZXVlID0gW107XG5cbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rvci5hYm9ydCgpO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdxdWV1ZS1jaGFuZ2VkJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3QocmVtb3RlLCByZWN1cnNpdmUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5saXN0KHJlbW90ZSwgcmVjdXJzaXZlLCAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBgTGlzdGluZyAke3JlY3Vyc2l2ZSA/ICdyZWN1cnNpdmVseSAnIDogJyd9JHtQYXRoLmJhc2VuYW1lKHJlbW90ZSl9YCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGRvd25sb2FkVG8ocmVtb3RlUGF0aCwgdGFyZ2V0UGF0aCwgcmVjdXJzaXZlLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLmNoZWNrSWdub3JlKHJlbW90ZVBhdGgpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLmdldFRvKHJlbW90ZVBhdGgsIHRhcmdldFBhdGgsIHJlY3Vyc2l2ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0sIChwZXJjZW50KSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3Muc2V0UHJvZ3Jlc3MocGVyY2VudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYERvd25sb2FkaW5nICR7UGF0aC5iYXNlbmFtZShyZW1vdGVQYXRoKX1gKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvd25sb2FkKHJlbW90ZSwgcmVjdXJzaXZlLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLmNoZWNrSWdub3JlKHJlbW90ZSkpIHtcbiAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IuZ2V0KHJlbW90ZSwgcmVjdXJzaXZlLCAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgfSwgKHBlcmNlbnQpID0+IHtcbiAgICAgICAgICBwcm9ncmVzcy5zZXRQcm9ncmVzcyhwZXJjZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBgRG93bmxvYWRpbmcgJHtQYXRoLmJhc2VuYW1lKHJlbW90ZSl9YCk7XG4gICAgfSk7XG4gIH1cblxuICB1cGxvYWQobG9jYWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUobG9jYWwpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKHByb2dyZXNzKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLnB1dChsb2NhbCwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0sIChwZXJjZW50KSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3Muc2V0UHJvZ3Jlc3MocGVyY2VudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYFVwbG9hZGluZyAke1BhdGguYmFzZW5hbWUobG9jYWwpfWApO1xuICAgIH0pO1xuICB9XG5cbiAgdXBsb2FkVG8obG9jYWwsIHJlbW90ZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShsb2NhbCkpIHtcbiAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IucHV0VG8obG9jYWwsIHJlbW90ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0sIChwZXJjZW50KSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3Muc2V0UHJvZ3Jlc3MocGVyY2VudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYFVwbG9hZGluZyAke1BhdGguYmFzZW5hbWUobG9jYWwpfWApO1xuICAgIH0pO1xuICB9XG5cbiAgc3luY1JlbW90ZUZpbGVUb0xvY2FsKHJlbW90ZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShyZW1vdGUpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdmVyaWZ5IGFjdGl2ZSBjb25uZWN0aW9uXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSAnQ09OTkVDVEVEJykge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLmdldChyZW1vdGUsIGZhbHNlLCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCwgW2Vycl0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYFN5bmMgJHtQYXRoLmJhc2VuYW1lKHJlbW90ZSl9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogTm90IGNvbm5lY3RlZCEnLCB7XG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3luY1JlbW90ZURpcmVjdG9yeVRvTG9jYWwocmVtb3RlLCBpc0ZpbGUsIGNhbGxiYWNrKSB7XG4gICAgLy8gVE9ETzogVGlkeSB1cCB0aGlzIGZ1bmN0aW9uLiBEb2VzICggcHJvYmFibHkgKSBub3QgbmVlZCB0byBsaXN0IGZyb20gdGhlIGNvbm5lY3RvclxuICAgIC8vIGlmIGlzRmlsZSA9PT0gdHJ1ZS4gV2lsbCBuZWVkIHRvIGNoZWNrIHRvIHNlZSBpZiB0aGF0IGRvZXNuJ3QgYnJlYWsgYW55dGhpbmcgYmVmb3JlXG4gICAgLy8gaW1wbGVtZW50aW5nLiBJbiB0aGUgbWVhbnRpbWUgY3VycmVudCBzb2x1dGlvbiBzaG91bGQgd29yayBmb3IgIzQ1M1xuICAgIC8vXG4gICAgLy8gVE9ETzogVGhpcyBtZXRob2Qgb25seSBzZWVtcyB0byBiZSByZWZlcmVuY2VkIGJ5IHRoZSBjb250ZXh0IG1lbnUgY29tbWFuZCBzbyBncmFjZWZ1bGx5XG4gICAgLy8gcmVtb3ZpbmcgbGlzdCB3aXRob3V0IGJyZWFraW5nIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBkby1hYmxlLiAnaXNGaWxlJyBpcyBhbHdheXMgc2VuZGluZ1xuICAgIC8vIGZhbHNlIGF0IHRoZSBtb21lbnQgaW5zaWRlIGNvbW1hbmRzLmpzXG4gICAgaWYgKCFyZW1vdGUpIHJldHVybjtcblxuICAgIC8vIENoZWNrIGlnbm9yZXNcbiAgICBpZiAocmVtb3RlICE9PSAnLycgJiYgdGhpcy5jaGVja0lnbm9yZShyZW1vdGUpKSB7XG4gICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbCA9IHRoaXMudG9Mb2NhbChyZW1vdGUpO1xuXG4gICAgICB0aGlzLmNvbm5lY3Rvci5saXN0KHJlbW90ZSwgdHJ1ZSwgKGVyciwgcmVtb3RlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCwgW2Vycl0pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGZvbGRlciBpZiBubyBleGlzdHMgaW4gbG9jYWxcbiAgICAgICAgbWtkaXJTeW5jUmVjdXJzaXZlKGxvY2FsKTtcblxuICAgICAgICAvLyByZW1vdmUgaWdub3JlZCByZW1vdGVzXG4gICAgICAgIGlmICh0aGlzLmlnbm9yZUZpbHRlcikge1xuICAgICAgICAgIGZvciAobGV0IGkgPSByZW1vdGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0lnbm9yZShyZW1vdGVzW2ldLm5hbWUpKSB7XG4gICAgICAgICAgICAgIHJlbW90ZXMuc3BsaWNlKGksIDEpOyAvLyByZW1vdmUgZnJvbSBsaXN0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdHJhdmVyc2VUcmVlKGxvY2FsLCAobG9jYWxzKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjay5hcHBseShudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW90ZU9uZSA9IHJlbW90ZXMuc2hpZnQoKTtcbiAgICAgICAgICAgIGxldCBsb2M7XG5cbiAgICAgICAgICAgIGlmICghcmVtb3RlT25lKSByZXR1cm4gZXJyb3IoKTtcblxuICAgICAgICAgICAgY29uc3QgdG9Mb2NhbCA9IHRoaXMudG9Mb2NhbChyZW1vdGVPbmUubmFtZSk7XG4gICAgICAgICAgICBsb2MgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBhID0gMCwgYiA9IGxvY2Fscy5sZW5ndGg7IGEgPCBiOyArK2EpIHtcbiAgICAgICAgICAgICAgaWYgKGxvY2Fsc1thXS5uYW1lID09PSB0b0xvY2FsKSB7XG4gICAgICAgICAgICAgICAgbG9jID0gbG9jYWxzW2FdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERvd25sb2FkIG9ubHkgaWYgbm90IHByZXNlbnQgb24gbG9jYWwgb3Igc2l6ZSBkaWZmZXJcbiAgICAgICAgICAgIGlmICghbG9jIHx8IHJlbW90ZU9uZS5zaXplICE9PSBsb2Muc2l6ZSkge1xuICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rvci5nZXQocmVtb3RlT25lLm5hbWUsIHRydWUsICgpID0+IG4oKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVtb3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdG9yLmdldChyZW1vdGUsIGZhbHNlLCAoKSA9PiBuKCkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgaXNGaWxlKTtcbiAgICAgIC8vIE5PVEU6IEFkZGVkIGlzRmlsZSB0byBlbmQgb2YgY2FsbCB0byBwcmV2ZW50IGJyZWFraW5nIGFueSBmdW5jdGlvbnNcbiAgICAgIC8vIHRoYXQgYWxyZWFkeSB1c2UgbGlzdCBjb21tYW5kLiBJcyBmaWxlIGlzIHVzZWQgb25seSBmb3IgZnRwIGNvbm5lY3RvclxuICAgICAgLy8gYXMgaXQgd2lsbCBsaXN0IGEgZmlsZSBhcyBhIGZpbGUgb2YgaXRzZWxmIHVubGlua2Ugd2l0aCBzZnRwIHdoaWNoXG4gICAgICAvLyB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgIH0sIGBTeW5jICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICB9XG5cbiAgc3luY0xvY2FsRmlsZVRvUmVtb3RlKGxvY2FsLCBjYWxsYmFjaykge1xuICAgIC8vIENoZWNrIGlnbm9yZXNcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShsb2NhbCkpIHtcbiAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnkgYWN0aXZlIGNvbm5lY3Rpb25cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdDT05ORUNURUQnKSB7XG4gICAgICAvLyBwcm9ncmVzc1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLnB1dChsb2NhbCwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrLmFwcGx5KG51bGwsIFtlcnJdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIGBTeW5jOiAke1BhdGguYmFzZW5hbWUobG9jYWwpfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBGVFA6IE5vdCBjb25uZWN0ZWQhJywge1xuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN5bmNMb2NhbERpcmVjdG9yeVRvUmVtb3RlKGxvY2FsLCBjYWxsYmFjaykge1xuICAgIC8vIENoZWNrIGlnbm9yZXNcbiAgICBpZiAodGhpcy5jaGVja0lnbm9yZShsb2NhbCkpIHtcbiAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnkgYWN0aXZlIGNvbm5lY3Rpb25cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdDT05ORUNURUQnKSB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3RlID0gdGhpcy50b1JlbW90ZShsb2NhbCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0b3IubGlzdChyZW1vdGUsIHRydWUsIChlcnIsIHJlbW90ZXMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjay5hcHBseShudWxsLCBbZXJyXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcmVtb3ZlIGlnbm9yZWQgcmVtb3Rlc1xuICAgICAgICAgIGlmICh0aGlzLmlnbm9yZUZpbHRlcikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHJlbW90ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tJZ25vcmUocmVtb3Rlc1tpXS5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHJlbW90ZXMuc3BsaWNlKGksIDEpOyAvLyByZW1vdmUgZnJvbSBsaXN0XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0cmF2ZXJzZVRyZWUobG9jYWwsIChsb2NhbHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjay5hcHBseShudWxsKTtcbiAgICAgICAgICAgICAgdGhpcy5fbmV4dCgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGlnbm9yZWQgbG9jYWxzXG4gICAgICAgICAgICBpZiAodGhpcy5pZ25vcmVGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGxvY2Fscy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSWdub3JlKGxvY2Fsc1tpXS5uYW1lKSkge1xuICAgICAgICAgICAgICAgICAgbG9jYWxzLnNwbGljZShpLCAxKTsgLy8gcmVtb3ZlIGZyb20gbGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuID0gKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBuTG9jYWwgPSBsb2NhbHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgbGV0IG5SZW1vdGU7XG5cbiAgICAgICAgICAgICAgaWYgKCFuTG9jYWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3IoKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IHRvUmVtb3RlID0gdGhpcy50b1JlbW90ZShuTG9jYWwubmFtZSk7XG4gICAgICAgICAgICAgIG5SZW1vdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGZvciAobGV0IGEgPSAwLCBiID0gcmVtb3Rlcy5sZW5ndGg7IGEgPCBiOyArK2EpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVtb3Rlc1thXS5uYW1lID09PSB0b1JlbW90ZSkge1xuICAgICAgICAgICAgICAgICAgblJlbW90ZSA9IHJlbW90ZXNbYV07XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBOT1RFOiBVcGxvYWQgb25seSBpZiBub3QgcHJlc2VudCBvbiByZW1vdGUgb3Igc2l6ZSBkaWZmZXJcbiAgICAgICAgICAgICAgaWYgKCFuUmVtb3RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5Mb2NhbC50eXBlID09PSAnZCcpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdG9yLm1rZGlyKHRvUmVtb3RlLCBmYWxzZSwgKCkgPT4gbigpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5Mb2NhbC50eXBlID09PSAnZicpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdG9yLnB1dChuTG9jYWwubmFtZSwgKCkgPT4gbigpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChuUmVtb3RlLnNpemUgIT09IG5Mb2NhbC5zaXplICYmIG5Mb2NhbC50eXBlID09PSAnZicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3Rvci5wdXQobkxvY2FsLm5hbWUsICgpID0+IG4oKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbigpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBuKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYFN5bmMgJHtQYXRoLmJhc2VuYW1lKGxvY2FsKX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdSZW1vdGUgRlRQOiBOb3QgY29ubmVjdGVkIScsIHtcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBta2RpcihyZW1vdGUsIHJlY3Vyc2l2ZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgdGhpcy5fZW5xdWV1ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdG9yLm1rZGlyKHJlbW90ZSwgcmVjdXJzaXZlLCAoLi4uYXJncykgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBgQ3JlYXRpbmcgZm9sZGVyICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBta2ZpbGUocmVtb3RlLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKCgpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IubWtmaWxlKHJlbW90ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYENyZWF0aW5nIGZpbGUgJHtQYXRoLmJhc2VuYW1lKHJlbW90ZSl9YCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbmFtZShzb3VyY2UsIGRlc3QsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuX2VucXVldWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5yZW5hbWUoc291cmNlLCBkZXN0LCAoZXJyKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2suYXBwbHkobnVsbCwgW2Vycl0pO1xuICAgICAgICAgIHRoaXMuX25leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBgUmVuYW1pbmcgJHtQYXRoLmJhc2VuYW1lKHNvdXJjZSl9YCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkZWxldGUocmVtb3RlLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLl9lbnF1ZXVlKCgpID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0b3IuZGVsZXRlKHJlbW90ZSwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgICB0aGlzLl9uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgYERlbGV0aW5nICR7UGF0aC5iYXNlbmFtZShyZW1vdGUpfWApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzaXRlKGNvbW1hbmQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuY29ubmVjdG9yLnNpdGUoY29tbWFuZCwgKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgY2FsbGJhY2soYXJncyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGNobW9kKHBhdGgsIG1vZGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuY29ubmVjdG9yLmNobW9kKHBhdGgsIG1vZGUsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNob3duKHBhdGgsIHVpZCwgZ2lkLCBjYWxsYmFjaykge1xuICAgIHRoaXMub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGdpZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5jaG93bihwYXRoLCB1aWQsIGdpZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbm5lY3Rvci5jaG93bihwYXRoLCB1aWQsIGdpZCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2hncnAocGF0aCwgdWlkLCBnaWQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5vbmNlQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuY29ubmVjdG9yLmNoZ3JwKHBhdGgsIHVpZCwgZ2lkLCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1cblxuICBwcm9tcHRGb3JQYXNzKCkge1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBQcm9tcHRQYXNzRGlhbG9nKCcnLCB0cnVlKTtcbiAgICBkaWFsb2cub24oJ2RpYWxvZy1kb25lJywgKGUsIHBhc3MpID0+IHtcbiAgICAgIHRoaXMuaW5mby5wYXNzID0gcGFzcztcbiAgICAgIHRoaXMuaW5mby5wYXNzcGhyYXNlID0gcGFzcztcbiAgICAgIGRpYWxvZy5jbG9zZSgpO1xuICAgICAgdGhpcy5kb0Nvbm5lY3QoKTtcbiAgICB9KTtcbiAgICBkaWFsb2cuYXR0YWNoKCk7XG4gIH1cblxuICBwcm9tcHRGb3JLZXlib2FyZEludGVyYWN0aXZlKCkge1xuICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBQcm9tcHRQYXNzRGlhbG9nKHRydWUpO1xuXG4gICAgZGlhbG9nLm9uKCdkaWFsb2ctZG9uZScsIChlLCBwYXNzKSA9PiB7XG4gICAgICB0aGlzLmluZm8udmVyaWZ5Q29kZSA9IHBhc3M7XG4gICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgIHRoaXMuZG9Db25uZWN0KCk7XG4gICAgfSk7XG5cbiAgICBkaWFsb2cuYXR0YWNoKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLndhdGNoLnJlbW92ZUxpc3RlbmVycygpO1xuICB9XG59XG4iXX0=