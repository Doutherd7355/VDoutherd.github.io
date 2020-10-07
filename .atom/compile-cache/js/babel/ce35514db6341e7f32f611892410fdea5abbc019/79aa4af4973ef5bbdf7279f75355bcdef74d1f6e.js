Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _iceteeFtp = require('@icetee/ftp');

var _iceteeFtp2 = _interopRequireDefault(_iceteeFtp);

var _connector = require('../connector');

var _connector2 = _interopRequireDefault(_connector);

var _notifications = require('../notifications');

var _helpers = require('../helpers');

'use babel';

function tryApply(callback, context, args) {
  if (typeof callback === 'function') {
    callback.apply(context, args);
  }
}

var ConnectorFTP = (function (_Connector) {
  _inherits(ConnectorFTP, _Connector);

  function ConnectorFTP() {
    _classCallCheck(this, ConnectorFTP);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(ConnectorFTP.prototype), 'constructor', this).apply(this, args);

    this.ftp = null;
    this.client = atom.project.remoteftp;
  }

  _createClass(ConnectorFTP, [{
    key: 'isConnected',
    value: function isConnected() {
      return this.ftp && this.ftp.connected;
    }
  }, {
    key: '_isConnectedApply',
    value: function _isConnectedApply(completed) {
      if (!this.isConnected()) {
        tryApply(completed, null, ['Not connected']);
        return false;
      }
      return true;
    }
  }, {
    key: 'connect',
    value: function connect(info, completed) {
      var _this = this;

      this.info = info;

      this.ftp = new _iceteeFtp2['default']();
      this.ftp.on('greeting', function (msg) {
        _this.emit('greeting', msg);
      }).on('ready', function () {
        _this.emit('connected');

        // disable keepalive manually when specified in .ftpconfig
        _this.ftp._socket.setKeepAlive(_this.info.keepalive > 0);

        tryApply(completed, _this, []);
      }).on('end', function () {
        _this.emit('ended');
      }).on('error', function (err) {
        var errCode = (0, _helpers.getObject)({
          obj: err,
          keys: ['code']
        });

        if (errCode === 421 || errCode === 'ECONNRESET') {
          _this.emit('closed', 'RECONNECT');
          return;
        }

        _this.emit('error', err, errCode);
      });

      this.ftp.connect(this.info);

      this.ftp._parser.on('response', function (code, text) {
        _this.emit('response', code, text);
      });

      return this;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(completed) {
      if (this.ftp) {
        this.ftp.destroy();
        this.ftp = null;
      }

      tryApply(completed, null, []);

      return this;
    }
  }, {
    key: 'abort',
    value: function abort(completed) {
      if (!this._isConnectedApply(completed)) return false;

      this.ftp.abort(function () {
        tryApply(completed, null, []);
      });

      return this;
    }
  }, {
    key: 'list',
    value: function list(path, recursive, completed, isFile) {
      var _this2 = this;

      if (!this._isConnectedApply(completed)) return false;

      // NOTE: isFile is included as the list command from FTP does not throw an error
      // when you try to get the files in a file.

      var showHiddenFiles = atom.config.get('remote-ftp.tree.showHiddenFiles');
      var nPath = _path2['default'].posix.resolve(path);

      if (isFile === true) {
        completed.apply(null, [null, []]);
        return true;
      }
      if (recursive) {
        (function () {
          var list = [];
          var digg = 0;

          var error = function error() {
            tryApply(completed, null, [null, list]);
          };

          var l = function l(np) {
            var p = _path2['default'].posix.resolve(np);
            ++digg;
            _this2.ftp.list(showHiddenFiles ? '-al ' + p : p, function (err, lis) {
              if (err) return error();

              if (lis) {
                lis.forEach(function (item) {
                  if (item.name === '.' || item.name === '..') return;
                  // NOTE: if the same, then we synhronize file
                  if (p !== item.name) item.name = p + '/' + item.name;

                  if (item.type === 'd' || item.type === 'l') {
                    list.push(item);
                    l(item.name);
                  } else {
                    item.type = 'f';
                    list.push(item);
                  }
                });
              }
              if (--digg === 0) error();

              return true;
            });
          };
          l(nPath);
        })();
      } else {
        this.ftp.list(showHiddenFiles ? '-al ' + nPath : nPath, function (err, lis) {
          var list = [];

          if (lis && !err) {
            list = (0, _helpers.separateRemoteItems)(lis);
          }

          tryApply(completed, null, [err, list]);
        });
      }

      return this;
    }
  }, {
    key: 'mlsd',
    value: function mlsd(path, completed) {
      if (!this._isConnectedApply(completed)) return;

      var nPath = _path2['default'].posix.resolve(path);

      this.ftp.mlsd(nPath, function (err, lis) {
        var list = [];

        if (lis && !err) {
          list = (0, _helpers.separateRemoteItems)(lis);
        }

        tryApply(completed, null, [err, list]);
      });
    }
  }, {
    key: 'type',
    value: function type(path, cb) {
      var _this3 = this;

      this.ftp.cwd(path, function (res) {
        var rtn = 'd';

        if (res && res.code !== 250) {
          rtn = 'f';
        }

        _this3.ftp.cwd('/', function () {
          cb(rtn);
        });
      });
    }
  }, {
    key: '_getFile',
    value: function _getFile(path, completed, progress) {
      var _this4 = this;

      var npath = _path2['default'].posix.resolve(path);
      var local = this.client.toLocal(npath);

      _fsPlus2['default'].makeTreeSync(_path2['default'].dirname(local));

      var size = -1;
      var pool = undefined;

      this.once('150', function (reply) {
        var str = reply.match(/([0-9]+)\s*(bytes)/);
        if (str) {
          size = parseInt(str[1], 10) || -1;
          pool = setInterval(function () {
            if (!_this4.ftp || !_this4.ftp._pasvSocket) return;
            var read = _this4.ftp._pasvSocket.bytesRead;
            tryApply(progress, null, [read / size]);
          }, 250);
        }
      });

      this.client.checkIgnore(npath);
      if (this.client.ignoreFilter) {
        if (this.client.ignoreFilter.ignores(npath)) {
          tryApply(completed, null, [null]);
          return;
        }
      }

      this.ftp.get(npath, function (error, stream) {
        if (error) {
          if (pool) clearInterval(pool);
          tryApply(completed, null, [error]);
          return;
        }

        var dest = _fsPlus2['default'].createWriteStream(local);

        dest.on('unpipe', function () {
          if (pool) clearInterval(pool);

          tryApply(completed, null, []);
        });

        dest.on('error', function (cerror) {
          if (cerror.code === 'EISDIR') {
            (0, _notifications.isEISDIR)(cerror.path, function (model) {
              _fsPlus2['default'].removeSync(cerror.path);
              _this4.get(npath);

              model.removeNotification();
            });
          }

          if (pool) clearInterval(pool);

          tryApply(completed, null, [cerror]);
        });

        stream.pipe(dest);
      });
    }
  }, {
    key: '_getFileTo',
    value: function _getFileTo(path, targetPath, completed, progress) {
      var _this5 = this;

      var npath = _path2['default'].posix.resolve(path);

      _fsPlus2['default'].makeTreeSync(_path2['default'].dirname(targetPath));

      var size = -1;
      var pool = undefined;

      this.once('150', function (reply) {
        var str = reply.match(/([0-9]+)\s*(bytes)/);
        if (str) {
          size = parseInt(str[1], 10) || -1;
          pool = setInterval(function () {
            if (!_this5.ftp || !_this5.ftp._pasvSocket) return;
            var read = _this5.ftp._pasvSocket.bytesRead;
            tryApply(progress, null, [read / size]);
          }, 250);
        }
      });

      this.client.checkIgnore(npath);
      if (this.client.ignoreFilter) {
        if (this.client.ignoreFilter.ignores(npath)) {
          tryApply(completed, null, [null]);
        }
      }

      this.ftp.get(npath, function (error, stream) {
        if (error) {
          if (pool) clearInterval(pool);
          tryApply(completed, null, [error]);
          return;
        }

        var dest = _fsPlus2['default'].createWriteStream(targetPath);

        dest.on('unpipe', function () {
          if (pool) clearInterval(pool);

          tryApply(completed, null, []);
        });

        dest.on('error', function (cerror) {
          if (cerror.code === 'EISDIR') {
            (0, _notifications.isEISDIR)(cerror.path, function (model) {
              _fsPlus2['default'].removeSync(cerror.path);
              _this5.get(npath);

              model.removeNotification();
            });
          }

          if (pool) clearInterval(pool);

          tryApply(completed, null, [cerror]);
        });

        stream.pipe(dest);
      });
    }
  }, {
    key: '_getFolder',
    value: function _getFolder(path, recursive, completed, progress) {
      var _this6 = this;

      var npath = _path2['default'].posix.resolve(path);

      this.list(npath, recursive, function (lError, list) {
        _this6.client.checkIgnore(npath);

        list.unshift({ name: npath, type: 'd' });
        list.forEach(function (item, index, object) {
          if (_this6.client.ignoreFilter) {
            if (_this6.client.ignoreFilter.ignores(item.name)) {
              object.splice(index, 1);
            }
          }
          item.depth = (0, _helpers.splitPaths)(item.name).length;
        });
        list.sort(_helpers.sortDepth);

        var error = null;
        var i = -1;
        var size = 0;
        var read = 0;
        var pool = undefined;

        var total = list.length;

        var e = function e() {
          tryApply(completed, null, [error, list]);
        };

        var n = function n() {
          ++i;
          if (pool) clearInterval(pool);
          tryApply(progress, null, [i / total]);

          var item = list.shift();
          if (typeof item === 'undefined' || item === null) return e();

          var nLocal = _this6.client.toLocal(item.name);

          if (item.type === 'd' || item.type === 'l') {
            try {
              _fsPlus2['default'].makeTreeSync(nLocal);
            } catch (cerror) {
              if (cerror.code === 'EEXIST') {
                (0, _notifications.isEEXIST)(cerror.path, function (model) {
                  _fsPlus2['default'].removeSync(cerror.path);
                  _this6.get(npath);
                  // FS.makeTreeSync(nLocal);

                  model.removeNotification();
                });
              }
            }

            n();
          } else {
            size = 0;
            read = 0;

            _this6.once('150', function (reply) {
              var str = reply.match(/([0-9]+)\s*(bytes)/);
              if (str) {
                size = parseInt(str[1], 10) || -1;
                pool = setInterval(function () {
                  if (!_this6.ftp || !_this6.ftp._pasvSocket) return;
                  read = _this6.ftp._pasvSocket.bytesRead;
                  tryApply(progress, null, [i / total + read / size / total]);
                }, 250);
              }
            });

            _this6.ftp.get(item.name, function (getError, stream) {
              if (getError) {
                error = getError;

                if (/Permission denied/.test(error)) {
                  (0, _notifications.isPermissionDenied)(item.name);
                }

                return n();
              }

              var dest = _fsPlus2['default'].createWriteStream(nLocal);

              dest.on('unpipe', function () {
                return n();
              });
              dest.on('error', function () {
                return n();
              });

              stream.pipe(dest);

              return true;
            });
          }
          return true;
        };
        n();
      });
    }
  }, {
    key: '_getFolderTo',
    value: function _getFolderTo(remotePath, targetPath, recursive, completed, progress) {
      var _this7 = this;

      var npath = _path2['default'].posix.resolve(remotePath);

      this.list(npath, recursive, function (lError, list) {
        _this7.client.checkIgnore(npath);

        list.unshift({ name: npath, type: 'd' });
        list.forEach(function (item, index, object) {
          if (_this7.client.ignoreFilter) {
            if (_this7.client.ignoreFilter.ignores(item.name)) {
              object.splice(index, 1);
            }
          }
          item.depth = (0, _helpers.splitPaths)(item.name).length;
        });
        list.sort(_helpers.sortDepth);

        var error = null;
        var i = -1;
        var size = 0;
        var read = 0;
        var pool = undefined;

        var total = list.length;

        var e = function e() {
          tryApply(completed, null, [error, list]);
        };

        var n = function n() {
          ++i;
          if (pool) clearInterval(pool);
          tryApply(progress, null, [i / total]);

          var item = list.shift();

          if (typeof item === 'undefined' || item === null) return e();

          var nLocal = _path2['default'].join(targetPath, '..', item.name);

          if (item.type === 'd' || item.type === 'l') {
            try {
              _fsPlus2['default'].makeTreeSync(nLocal);
            } catch (cerror) {
              if (cerror.code === 'EEXIST') {
                (0, _notifications.isEEXIST)(cerror.path, function (model) {
                  _fsPlus2['default'].removeSync(cerror.path);
                  _this7.get(npath);
                  // FS.makeTreeSync(nLocal);

                  model.removeNotification();
                });
              }
            }

            n();
          } else {
            size = 0;
            read = 0;

            _this7.once('150', function (reply) {
              var str = reply.match(/([0-9]+)\s*(bytes)/);
              if (str) {
                size = parseInt(str[1], 10) || -1;
                pool = setInterval(function () {
                  if (!_this7.ftp || !_this7.ftp._pasvSocket) return;
                  read = _this7.ftp._pasvSocket.bytesRead;
                  tryApply(progress, null, [i / total + read / size / total]);
                }, 250);
              }
            });

            _this7.ftp.get(item.name, function (getError, stream) {
              if (getError) {
                error = getError;

                if (/Permission denied/.test(error)) {
                  (0, _notifications.isPermissionDenied)(item.name);
                }

                return n();
              }

              var dest = _fsPlus2['default'].createWriteStream(nLocal);

              dest.on('unpipe', function () {
                return n();
              });
              dest.on('error', function () {
                return n();
              });

              stream.pipe(dest);

              return true;
            });
          }
          return true;
        };
        n();
      });
    }
  }, {
    key: 'getTo',
    value: function getTo(remotePath, targetPath, recursive, completed, progress) {
      var _this8 = this;

      if (!this._isConnectedApply(completed)) return;

      this.type(remotePath, function (type) {
        if (type === 'f') {
          _this8._getFileTo(remotePath, targetPath, completed, progress);
        } else {
          _this8._getFolderTo(remotePath, targetPath, recursive, completed, progress);
        }
      });
    }
  }, {
    key: 'get',
    value: function get(path, recursive, completed, progress) {
      var _this9 = this;

      if (!this._isConnectedApply(completed)) return;

      var npath = _path2['default'].posix.resolve(path);

      this.type(npath, function (type) {
        if (type === 'f') {
          _this9._getFile(npath, completed, progress);
        } else {
          _this9._getFolder(npath, recursive, completed, progress);
        }
      });
    }
  }, {
    key: 'putTo',
    value: function putTo(sourcePath, targetPath, completed, progress) {
      var _this10 = this;

      if (!this._isConnectedApply(completed)) return false;

      var remote = this.client.toRemote(targetPath);

      if (_fsPlus2['default'].isFileSync(sourcePath)) {
        var _ret2 = (function () {
          // File
          var stats = _fsPlus2['default'].statSync(sourcePath);
          var size = stats.size;
          var written = 0;

          var e = function e(err) {
            tryApply(completed, null, [err || null, [{ name: sourcePath, type: 'f' }]]);
          };
          var pool = setInterval(function () {
            if (!_this10.ftp || !_this10.ftp._pasvSocket) return;
            written = _this10.ftp._pasvSocket.bytesWritten;
            tryApply(progress, null, [written / size]);
          }, 250);

          return {
            v: _this10.ftp.put(sourcePath, remote, function (err) {
              var fatal = false;

              if (/Permission denied/.test(err)) {
                (0, _notifications.isPermissionDenied)(sourcePath);
                fatal = true;
                return e(err);
              }

              if (err && !fatal) {
                _this10.mkdir(_path2['default'].dirname(remote).replace(/\\/g, '/'), true, function () {
                  _this10.ftp.put(sourcePath, remote, function (putError) {
                    if (pool) clearInterval(pool);
                    return e(putError);
                  });
                });
              }
              if (pool) clearInterval(pool);
              return e();
            })
          };
        })();

        if (typeof _ret2 === 'object') return _ret2.v;
      }

      return (0, _helpers.traverseTree)(sourcePath, function (list) {
        _this10.mkdir(remote, true, function () {
          var error = undefined;
          var i = -1;
          var size = 0;
          var written = 0;

          var total = list.length;
          var pool = setInterval(function () {
            if (!_this10.ftp || !_this10.ftp._pasvSocket) return;
            written = _this10.ftp._pasvSocket.bytesWritten;
            tryApply(progress, null, [i / total + written / size / total]);
          }, 250);
          var e = function e() {
            if (pool) clearInterval(pool);
            tryApply(completed, null, [error, list]);
          };
          var n = function n() {
            if (++i >= list.length) return e();

            var item = list[i];

            var nRemote = _path2['default'].posix.join(_path2['default'].dirname(remote), _this10.client.toRemote(item.name));

            if (item.type === 'd' || item.type === 'l') {
              _this10.ftp.mkdir(nRemote, function (mkdirErr) {
                if (mkdirErr) error = mkdirErr;
                return n();
              });
            } else {
              var stats = _fsPlus2['default'].statSync(item.name);
              size = stats.size;
              written = 0;

              _this10.ftp.put(item.name, nRemote, function (putErr) {
                if (putErr) error = putErr;
                return n();
              });
            }
            return true;
          };
          return n();
        });
      });
    }
  }, {
    key: 'put',
    value: function put(path, completed, progress) {
      var _this11 = this;

      if (!this._isConnectedApply(completed)) return false;

      var remote = this.client.toRemote(path);

      if (_fsPlus2['default'].isFileSync(path)) {
        (function () {
          // NOTE: File
          var stats = _fsPlus2['default'].statSync(path);
          var size = stats.size;
          var written = 0;

          var e = function e(err) {
            tryApply(completed, null, [err || null, [{ name: path, type: 'f' }]]);
          };
          var pool = setInterval(function () {
            if (!_this11.ftp || !_this11.ftp._pasvSocket) return;
            written = _this11.ftp._pasvSocket.bytesWritten;
            tryApply(progress, null, [written / size]);
          }, 250);

          _this11.ftp.put(path, remote, function (err) {
            var fatal = false;

            if (/Permission denied/.test(err)) {
              (0, _notifications.isPermissionDenied)(path);
              fatal = true;
              return e(err);
            }

            if (err && !fatal) {
              _this11.mkdir(_path2['default'].dirname(remote).replace(/\\/g, '/'), true, function () {
                _this11.ftp.put(path, remote, function (putError) {
                  if (pool) clearInterval(pool);
                  return e(putError);
                });
              });
            }
            if (pool) clearInterval(pool);
            return e();
          });
        })();
      } else {
        // NOTE: Folder
        (0, _helpers.traverseTree)(path, function (list) {
          _this11.mkdir(remote, true, function () {
            var error = undefined;
            var i = -1;
            var size = 0;
            var written = 0;

            var total = list.length;
            var pool = setInterval(function () {
              if (!_this11.ftp || !_this11.ftp._pasvSocket) return;
              written = _this11.ftp._pasvSocket.bytesWritten;
              tryApply(progress, null, [i / total + written / size / total]);
            }, 250);
            var e = function e() {
              if (pool) clearInterval(pool);
              tryApply(completed, null, [error, list]);
            };
            var n = function n() {
              if (++i >= list.length) return e();
              var item = list[i];
              var nRemote = _this11.client.toRemote(item.name);
              if (item.type === 'd' || item.type === 'l') {
                _this11.ftp.mkdir(nRemote, function (mkdirErr) {
                  if (mkdirErr) error = mkdirErr;
                  return n();
                });
              } else {
                var stats = _fsPlus2['default'].statSync(item.name);
                size = stats.size;
                written = 0;
                _this11.ftp.put(item.name, nRemote, function (putErr) {
                  if (putErr) error = putErr;
                  return n();
                });
              }
              return true;
            };
            return n();
          });
        });
      }

      return this;
    }
  }, {
    key: 'mkdir',
    value: function mkdir(path, recursive, completed) {
      var _this12 = this;

      if (!this._isConnectedApply(completed)) return false;

      var remotes = (0, _helpers.splitPaths)(path);
      var dirs = ['/' + remotes.slice(0, remotes.length).join('/')];
      var remotePath = (0, _helpers.splitPaths)(this.client.info.remote);

      if (recursive) {
        for (var a = remotes.length - 1; a > 0; --a) {
          // Observe the specified path
          var sRemote = '/' + remotePath.slice(0, a).join('/');
          var pRemote = '/' + remotes.slice(0, a).join('/');

          if (sRemote !== pRemote) {
            dirs.unshift('/' + remotes.slice(0, a).join('/'));
          }
        }
      }

      var n = function n() {
        var dir = dirs.shift();
        var last = dirs.length === 0;

        _this12.ftp.list(dir, false, function (errList, list) {
          if (typeof list !== 'undefined') {
            var dirName = path.split('/').pop();
            var folders = list.filter(function (o) {
              return o.type === 'd' || o.type === 'l';
            });
            var dirNames = folders.map(function (o) {
              return o.name;
            });

            if (typeof list !== 'undefined' && dirNames.indexOf(dirName) > -1) {
              if (last) {
                tryApply(completed, null, [errList || null]);
                return;
              }

              n();
              return;
            }
          }

          _this12.ftp.mkdir(dir, function (err) {
            if (last) {
              tryApply(completed, null, [err || null]);
            } else {
              return n();
            }

            return false;
          });
        });
      };

      n();

      return this;
    }
  }, {
    key: 'mkfile',
    value: function mkfile(path, completed) {
      var _this13 = this;

      if (!this._isConnectedApply(completed)) return false;

      var local = this.client.toLocal(path);
      var empty = new Buffer('', 'utf8');
      var enableTransfer = atom.config.get('remote-ftp.notifications.enableTransfer');

      this.ftp.list(path, false, function (listErr, list) {
        if (typeof list !== 'undefined') {
          var files = list.filter(function (o) {
            return o.type === '-';
          });

          // File exists
          if (files.length !== 0) {
            if (enableTransfer) (0, _notifications.isAlreadyExits)(path, 'file');

            tryApply(completed, null, [listErr]);
            return;
          }
        }

        _this13.ftp.put(empty, path, function (putErr) {
          if (putErr) {
            tryApply(completed, null, [putErr]);
            return;
          }

          _fsPlus2['default'].makeTreeSync(_path2['default'].dirname(local));
          _fsPlus2['default'].writeFile(local, empty, function (err2) {
            tryApply(completed, null, [err2]);
          });
        });
      });

      return this;
    }
  }, {
    key: 'rename',
    value: function rename(source, dest, completed) {
      var _this14 = this;

      if (!this._isConnectedApply(completed)) return false;

      this.ftp.rename(source, dest, function (err) {
        if (err) {
          tryApply(completed, null, [err]);
        } else {
          _fsPlus2['default'].rename(_this14.client.toLocal(source), _this14.client.toLocal(dest), function (rErr) {
            tryApply(completed, null, [rErr]);
          });
        }
      });

      return this;
    }
  }, {
    key: 'site',
    value: function site(command, completed) {
      if (!this._isConnectedApply(completed)) return false;

      this.ftp.site(command, function (err) {
        if (err) {
          tryApply(completed, null, [err]);
        }
      });

      return this;
    }
  }, {
    key: 'chmod',
    value: function chmod(path, mode) {
      var completed = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

      if (!this._isConnectedApply(completed)) return false;

      if (this.isConnected()) {
        this.ftp.site('CHMOD ' + mode + ' ' + path, completed);
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return this;
    }
  }, {
    key: 'chown',
    value: function chown(path, owner) {
      var completed = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

      if (!this._isConnectedApply(completed)) return false;

      if (this.isConnected()) {
        this.ftp.site('CHOWN ' + owner + ' ' + path, completed);
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return this;
    }
  }, {
    key: 'chgrp',
    value: function chgrp(path, group) {
      var completed = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

      if (!this._isConnectedApply(completed)) return false;

      if (this.isConnected()) {
        this.ftp.site('CHGRP ' + group + ' ' + path, completed);
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return this;
    }
  }, {
    key: 'delete',
    value: function _delete(path, completed) {
      var _this15 = this;

      if (!this._isConnectedApply(completed)) return false;

      this.type(path, function (type) {
        if (type === 'f') {
          // NOTE: File
          _this15.ftp['delete'](path, function (err) {
            tryApply(completed, null, [err, [{ name: path, type: 'f' }]]);
          });
        } else {
          // NOTE: Folder
          _this15.list(path, true, function (err, list) {
            list.forEach(function (item) {
              item.depth = (0, _helpers.splitPaths)(item.name).length;
            });
            list.sort(_helpers.simpleSortDepth);

            var done = 0;

            var e = function e() {
              _this15.ftp.rmdir(path, function (eErr) {
                tryApply(completed, null, [eErr, list]);
              });
            };
            list.forEach(function (item) {
              ++done;
              var fn = item.type === 'd' || item.type === 'l' ? 'rmdir' : 'delete';
              _this15.ftp[fn](item.name, function () {
                if (--done === 0) return e();
                return true;
              });
            });
            if (list.length === 0) e();
          });
        }
      });

      return this;
    }
  }]);

  return ConnectorFTP;
})(_connector2['default']);

exports['default'] = ConnectorFTP;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jb25uZWN0b3JzL2Z0cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7eUJBQ1AsYUFBYTs7Ozt5QkFDUCxjQUFjOzs7OzZCQUNtQyxrQkFBa0I7O3VCQUNZLFlBQVk7O0FBUGpILFdBQVcsQ0FBQzs7QUFTWixTQUFTLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUN6QyxNQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUNsQyxZQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztHQUMvQjtDQUNGOztJQUVLLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxHQUNLOzBCQURqQixZQUFZOztzQ0FDRCxJQUFJO0FBQUosVUFBSTs7O0FBQ2pCLCtCQUZFLFlBQVksOENBRUwsSUFBSSxFQUFFOztBQUVmLFFBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7R0FDdEM7O2VBTkcsWUFBWTs7V0FRTCx1QkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztLQUN2Qzs7O1dBRWdCLDJCQUFDLFNBQVMsRUFBRTtBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3ZCLGdCQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDN0MsZUFBTyxLQUFLLENBQUM7T0FDZDtBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVNLGlCQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7OztBQUN2QixVQUFJLENB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QUssR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDN0Isd0JBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7ZUFDekMsQ0FBQyxDQUFDO2FBQ0osQ0FBQztBQUNGLGdCQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3JCLGdCQUFFLElBQUksQ0FBQztBQUNQLGtCQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3ZFLHNCQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQU07QUFDNUIsb0JBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7QUFDN0IsdUJBQU8sSUFBSSxDQUFDO2VBQ2IsQ0FBQyxDQUFDO2FBQ0osQ0FBQyxDQUFDO0FBQ0gsZ0JBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7V0FDNUIsQ0FBQyxDQUFDO1NBQ0o7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1NBNzNCRyxZQUFZOzs7cUJBaTRCSCxZQUFZIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jb25uZWN0b3JzL2Z0cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRlMgZnJvbSAnZnMtcGx1cyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBGVFAgZnJvbSAnQGljZXRlZS9mdHAnO1xuaW1wb3J0IENvbm5lY3RvciBmcm9tICcuLi9jb25uZWN0b3InO1xuaW1wb3J0IHsgaXNFRVhJU1QsIGlzRUlTRElSLCBpc0FscmVhZHlFeGl0cywgaXNQZXJtaXNzaW9uRGVuaWVkIH0gZnJvbSAnLi4vbm90aWZpY2F0aW9ucyc7XG5pbXBvcnQgeyBnZXRPYmplY3QsIHNlcGFyYXRlUmVtb3RlSXRlbXMsIHNwbGl0UGF0aHMsIHNpbXBsZVNvcnREZXB0aCwgc29ydERlcHRoLCB0cmF2ZXJzZVRyZWUgfSBmcm9tICcuLi9oZWxwZXJzJztcblxuZnVuY3Rpb24gdHJ5QXBwbHkoY2FsbGJhY2ssIGNvbnRleHQsIGFyZ3MpIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9XG59XG5cbmNsYXNzIENvbm5lY3RvckZUUCBleHRlbmRzIENvbm5lY3RvciB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuZnRwID0gbnVsbDtcbiAgICB0aGlzLmNsaWVudCA9IGF0b20ucHJvamVjdC5yZW1vdGVmdHA7XG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5mdHAgJiYgdGhpcy5mdHAuY29ubmVjdGVkO1xuICB9XG5cbiAgX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSB7XG4gICAgaWYgKCF0aGlzLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgWydOb3QgY29ubmVjdGVkJ10pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbm5lY3QoaW5mbywgY29tcGxldGVkKSB7XG4gICAgdGhpcy5pbmZvID0gaW5mbztcblxuICAgIHRoaXMuZnRwID0gbmV3IEZUUCgpO1xuICAgIHRoaXMuZnRwXG4gICAgICAub24oJ2dyZWV0aW5nJywgKG1zZykgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2dyZWV0aW5nJywgbXNnKTtcbiAgICAgIH0pXG4gICAgICAub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2Nvbm5lY3RlZCcpO1xuXG4gICAgICAgIC8vIGRpc2FibGUga2VlcGFsaXZlIG1hbnVhbGx5IHdoZW4gc3BlY2lmaWVkIGluIC5mdHBjb25maWdcbiAgICAgICAgdGhpcy5mdHAuX3NvY2tldC5zZXRLZWVwQWxpdmUodGhpcy5pbmZvLmtlZXBhbGl2ZSA+IDApO1xuXG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgdGhpcywgW10pO1xuICAgICAgfSlcbiAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2VuZGVkJyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgY29uc3QgZXJyQ29kZSA9IGdldE9iamVjdCh7XG4gICAgICAgICAgb2JqOiBlcnIsXG4gICAgICAgICAga2V5czogWydjb2RlJ10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChlcnJDb2RlID09PSA0MjEgfHwgZXJyQ29kZSA9PT0gJ0VDT05OUkVTRVQnKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdjbG9zZWQnLCAnUkVDT05ORUNUJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVyciwgZXJyQ29kZSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuZnRwLmNvbm5lY3QodGhpcy5pbmZvKTtcblxuICAgIHRoaXMuZnRwLl9wYXJzZXIub24oJ3Jlc3BvbnNlJywgKGNvZGUsIHRleHQpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgncmVzcG9uc2UnLCBjb2RlLCB0ZXh0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGlzY29ubmVjdChjb21wbGV0ZWQpIHtcbiAgICBpZiAodGhpcy5mdHApIHtcbiAgICAgIHRoaXMuZnRwLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZnRwID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtdKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWJvcnQoY29tcGxldGVkKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZEFwcGx5KGNvbXBsZXRlZCkpIHJldHVybiBmYWxzZTtcblxuICAgIHRoaXMuZnRwLmFib3J0KCgpID0+IHtcbiAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW10pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0KHBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkLCBpc0ZpbGUpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gTk9URTogaXNGaWxlIGlzIGluY2x1ZGVkIGFzIHRoZSBsaXN0IGNvbW1hbmQgZnJvbSBGVFAgZG9lcyBub3QgdGhyb3cgYW4gZXJyb3JcbiAgICAvLyB3aGVuIHlvdSB0cnkgdG8gZ2V0IHRoZSBmaWxlcyBpbiBhIGZpbGUuXG5cbiAgICBjb25zdCBzaG93SGlkZGVuRmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAudHJlZS5zaG93SGlkZGVuRmlsZXMnKTtcbiAgICBjb25zdCBuUGF0aCA9IFBhdGgucG9zaXgucmVzb2x2ZShwYXRoKTtcblxuICAgIGlmIChpc0ZpbGUgPT09IHRydWUpIHtcbiAgICAgIGNvbXBsZXRlZC5hcHBseShudWxsLCBbbnVsbCwgW11dKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAocmVjdXJzaXZlKSB7XG4gICAgICBjb25zdCBsaXN0ID0gW107XG4gICAgICBsZXQgZGlnZyA9IDA7XG5cbiAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4geyB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtudWxsLCBsaXN0XSk7IH07XG5cbiAgICAgIGNvbnN0IGwgPSAobnApID0+IHtcbiAgICAgICAgY29uc3QgcCA9IFBhdGgucG9zaXgucmVzb2x2ZShucCk7XG4gICAgICAgICsrZGlnZztcbiAgICAgICAgdGhpcy5mdHAubGlzdCgoc2hvd0hpZGRlbkZpbGVzID8gYC1hbCAke3B9YCA6IHApLCAoZXJyLCBsaXMpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gZXJyb3IoKTtcblxuICAgICAgICAgIGlmIChsaXMpIHtcbiAgICAgICAgICAgIGxpcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLm5hbWUgPT09ICcuJyB8fCBpdGVtLm5hbWUgPT09ICcuLicpIHJldHVybjtcbiAgICAgICAgICAgICAgLy8gTk9URTogaWYgdGhlIHNhbWUsIHRoZW4gd2Ugc3luaHJvbml6ZSBmaWxlXG4gICAgICAgICAgICAgIGlmIChwICE9PSBpdGVtLm5hbWUpIGl0ZW0ubmFtZSA9IGAke3B9LyR7aXRlbS5uYW1lfWA7XG5cbiAgICAgICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2QnIHx8IGl0ZW0udHlwZSA9PT0gJ2wnKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGwoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLnR5cGUgPSAnZic7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKC0tZGlnZyA9PT0gMCkgZXJyb3IoKTtcblxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBsKG5QYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mdHAubGlzdCgoc2hvd0hpZGRlbkZpbGVzID8gYC1hbCAke25QYXRofWAgOiBuUGF0aCksIChlcnIsIGxpcykgPT4ge1xuICAgICAgICBsZXQgbGlzdCA9IFtdO1xuXG4gICAgICAgIGlmIChsaXMgJiYgIWVycikge1xuICAgICAgICAgIGxpc3QgPSBzZXBhcmF0ZVJlbW90ZUl0ZW1zKGxpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnIsIGxpc3RdKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbWxzZChwYXRoLCBjb21wbGV0ZWQpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgblBhdGggPSBQYXRoLnBvc2l4LnJlc29sdmUocGF0aCk7XG5cbiAgICB0aGlzLmZ0cC5tbHNkKG5QYXRoLCAoZXJyLCBsaXMpID0+IHtcbiAgICAgIGxldCBsaXN0ID0gW107XG5cbiAgICAgIGlmIChsaXMgJiYgIWVycikge1xuICAgICAgICBsaXN0ID0gc2VwYXJhdGVSZW1vdGVJdGVtcyhsaXMpO1xuICAgICAgfVxuXG4gICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnIsIGxpc3RdKTtcbiAgICB9KTtcbiAgfVxuXG4gIHR5cGUocGF0aCwgY2IpIHtcbiAgICB0aGlzLmZ0cC5jd2QocGF0aCwgKHJlcykgPT4ge1xuICAgICAgbGV0IHJ0biA9ICdkJztcblxuICAgICAgaWYgKHJlcyAmJiByZXMuY29kZSAhPT0gMjUwKSB7XG4gICAgICAgIHJ0biA9ICdmJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5mdHAuY3dkKCcvJywgKCkgPT4ge1xuICAgICAgICBjYihydG4pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0RmlsZShwYXRoLCBjb21wbGV0ZWQsIHByb2dyZXNzKSB7XG4gICAgY29uc3QgbnBhdGggPSBQYXRoLnBvc2l4LnJlc29sdmUocGF0aCk7XG4gICAgY29uc3QgbG9jYWwgPSB0aGlzLmNsaWVudC50b0xvY2FsKG5wYXRoKTtcblxuICAgIEZTLm1ha2VUcmVlU3luYyhQYXRoLmRpcm5hbWUobG9jYWwpKTtcblxuICAgIGxldCBzaXplID0gLTE7XG4gICAgbGV0IHBvb2w7XG5cbiAgICB0aGlzLm9uY2UoJzE1MCcsIChyZXBseSkgPT4ge1xuICAgICAgY29uc3Qgc3RyID0gcmVwbHkubWF0Y2goLyhbMC05XSspXFxzKihieXRlcykvKTtcbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgc2l6ZSA9IHBhcnNlSW50KHN0clsxXSwgMTApIHx8IC0xO1xuICAgICAgICBwb29sID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgICAgY29uc3QgcmVhZCA9IHRoaXMuZnRwLl9wYXN2U29ja2V0LmJ5dGVzUmVhZDtcbiAgICAgICAgICB0cnlBcHBseShwcm9ncmVzcywgbnVsbCwgW3JlYWQgLyBzaXplXSk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNsaWVudC5jaGVja0lnbm9yZShucGF0aCk7XG4gICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlcikge1xuICAgICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlci5pZ25vcmVzKG5wYXRoKSkge1xuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtudWxsXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmZ0cC5nZXQobnBhdGgsIChlcnJvciwgc3RyZWFtKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKHBvb2wpIGNsZWFySW50ZXJ2YWwocG9vbCk7XG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2Vycm9yXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVzdCA9IEZTLmNyZWF0ZVdyaXRlU3RyZWFtKGxvY2FsKTtcblxuICAgICAgZGVzdC5vbigndW5waXBlJywgKCkgPT4ge1xuICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcblxuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtdKTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXN0Lm9uKCdlcnJvcicsIChjZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGNlcnJvci5jb2RlID09PSAnRUlTRElSJykge1xuICAgICAgICAgIGlzRUlTRElSKGNlcnJvci5wYXRoLCAobW9kZWwpID0+IHtcbiAgICAgICAgICAgIEZTLnJlbW92ZVN5bmMoY2Vycm9yLnBhdGgpO1xuICAgICAgICAgICAgdGhpcy5nZXQobnBhdGgpO1xuXG4gICAgICAgICAgICBtb2RlbC5yZW1vdmVOb3RpZmljYXRpb24oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb29sKSBjbGVhckludGVydmFsKHBvb2wpO1xuXG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2NlcnJvcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbS5waXBlKGRlc3QpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZpbGVUbyhwYXRoLCB0YXJnZXRQYXRoLCBjb21wbGV0ZWQsIHByb2dyZXNzKSB7XG4gICAgY29uc3QgbnBhdGggPSBQYXRoLnBvc2l4LnJlc29sdmUocGF0aCk7XG5cbiAgICBGUy5tYWtlVHJlZVN5bmMoUGF0aC5kaXJuYW1lKHRhcmdldFBhdGgpKTtcblxuICAgIGxldCBzaXplID0gLTE7XG4gICAgbGV0IHBvb2w7XG5cbiAgICB0aGlzLm9uY2UoJzE1MCcsIChyZXBseSkgPT4ge1xuICAgICAgY29uc3Qgc3RyID0gcmVwbHkubWF0Y2goLyhbMC05XSspXFxzKihieXRlcykvKTtcbiAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgc2l6ZSA9IHBhcnNlSW50KHN0clsxXSwgMTApIHx8IC0xO1xuICAgICAgICBwb29sID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgICAgY29uc3QgcmVhZCA9IHRoaXMuZnRwLl9wYXN2U29ja2V0LmJ5dGVzUmVhZDtcbiAgICAgICAgICB0cnlBcHBseShwcm9ncmVzcywgbnVsbCwgW3JlYWQgLyBzaXplXSk7XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNsaWVudC5jaGVja0lnbm9yZShucGF0aCk7XG4gICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlcikge1xuICAgICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlci5pZ25vcmVzKG5wYXRoKSkge1xuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtudWxsXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5mdHAuZ2V0KG5wYXRoLCAoZXJyb3IsIHN0cmVhbSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChwb29sKSBjbGVhckludGVydmFsKHBvb2wpO1xuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnJvcl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlc3QgPSBGUy5jcmVhdGVXcml0ZVN0cmVhbSh0YXJnZXRQYXRoKTtcblxuICAgICAgZGVzdC5vbigndW5waXBlJywgKCkgPT4ge1xuICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcblxuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtdKTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXN0Lm9uKCdlcnJvcicsIChjZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGNlcnJvci5jb2RlID09PSAnRUlTRElSJykge1xuICAgICAgICAgIGlzRUlTRElSKGNlcnJvci5wYXRoLCAobW9kZWwpID0+IHtcbiAgICAgICAgICAgIEZTLnJlbW92ZVN5bmMoY2Vycm9yLnBhdGgpO1xuICAgICAgICAgICAgdGhpcy5nZXQobnBhdGgpO1xuXG4gICAgICAgICAgICBtb2RlbC5yZW1vdmVOb3RpZmljYXRpb24oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb29sKSBjbGVhckludGVydmFsKHBvb2wpO1xuXG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2NlcnJvcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbS5waXBlKGRlc3QpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZvbGRlcihwYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MpIHtcbiAgICBjb25zdCBucGF0aCA9IFBhdGgucG9zaXgucmVzb2x2ZShwYXRoKTtcblxuICAgIHRoaXMubGlzdChucGF0aCwgcmVjdXJzaXZlLCAobEVycm9yLCBsaXN0KSA9PiB7XG4gICAgICB0aGlzLmNsaWVudC5jaGVja0lnbm9yZShucGF0aCk7XG5cbiAgICAgIGxpc3QudW5zaGlmdCh7IG5hbWU6IG5wYXRoLCB0eXBlOiAnZCcgfSk7XG4gICAgICBsaXN0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlcikge1xuICAgICAgICAgIGlmICh0aGlzLmNsaWVudC5pZ25vcmVGaWx0ZXIuaWdub3JlcyhpdGVtLm5hbWUpKSB7XG4gICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5kZXB0aCA9IHNwbGl0UGF0aHMoaXRlbS5uYW1lKS5sZW5ndGg7XG4gICAgICB9KTtcbiAgICAgIGxpc3Quc29ydChzb3J0RGVwdGgpO1xuXG4gICAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgICAgbGV0IGkgPSAtMTtcbiAgICAgIGxldCBzaXplID0gMDtcbiAgICAgIGxldCByZWFkID0gMDtcbiAgICAgIGxldCBwb29sO1xuXG4gICAgICBjb25zdCB0b3RhbCA9IGxpc3QubGVuZ3RoO1xuXG4gICAgICBjb25zdCBlID0gKCkgPT4ge1xuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnJvciwgbGlzdF0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgbiA9ICgpID0+IHtcbiAgICAgICAgKytpO1xuICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcbiAgICAgICAgdHJ5QXBwbHkocHJvZ3Jlc3MsIG51bGwsIFtpIC8gdG90YWxdKTtcblxuICAgICAgICBjb25zdCBpdGVtID0gbGlzdC5zaGlmdCgpO1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW0gPT09IG51bGwpIHJldHVybiBlKCk7XG5cbiAgICAgICAgY29uc3QgbkxvY2FsID0gdGhpcy5jbGllbnQudG9Mb2NhbChpdGVtLm5hbWUpO1xuXG4gICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdkJyB8fCBpdGVtLnR5cGUgPT09ICdsJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBGUy5tYWtlVHJlZVN5bmMobkxvY2FsKTtcbiAgICAgICAgICB9IGNhdGNoIChjZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChjZXJyb3IuY29kZSA9PT0gJ0VFWElTVCcpIHtcbiAgICAgICAgICAgICAgaXNFRVhJU1QoY2Vycm9yLnBhdGgsIChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIEZTLnJlbW92ZVN5bmMoY2Vycm9yLnBhdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KG5wYXRoKTtcbiAgICAgICAgICAgICAgICAvLyBGUy5tYWtlVHJlZVN5bmMobkxvY2FsKTtcblxuICAgICAgICAgICAgICAgIG1vZGVsLnJlbW92ZU5vdGlmaWNhdGlvbigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZSA9IDA7XG4gICAgICAgICAgcmVhZCA9IDA7XG5cbiAgICAgICAgICB0aGlzLm9uY2UoJzE1MCcsIChyZXBseSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gcmVwbHkubWF0Y2goLyhbMC05XSspXFxzKihieXRlcykvKTtcbiAgICAgICAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgICAgICAgc2l6ZSA9IHBhcnNlSW50KHN0clsxXSwgMTApIHx8IC0xO1xuICAgICAgICAgICAgICBwb29sID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgcmVhZCA9IHRoaXMuZnRwLl9wYXN2U29ja2V0LmJ5dGVzUmVhZDtcbiAgICAgICAgICAgICAgICB0cnlBcHBseShwcm9ncmVzcywgbnVsbCwgWyhpIC8gdG90YWwpICsgKHJlYWQgLyBzaXplIC8gdG90YWwpXSk7XG4gICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmZ0cC5nZXQoaXRlbS5uYW1lLCAoZ2V0RXJyb3IsIHN0cmVhbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldEVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZ2V0RXJyb3I7XG5cbiAgICAgICAgICAgICAgaWYgKC9QZXJtaXNzaW9uIGRlbmllZC8udGVzdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBpc1Blcm1pc3Npb25EZW5pZWQoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRlc3QgPSBGUy5jcmVhdGVXcml0ZVN0cmVhbShuTG9jYWwpO1xuXG4gICAgICAgICAgICBkZXN0Lm9uKCd1bnBpcGUnLCAoKSA9PiBuKCkpO1xuICAgICAgICAgICAgZGVzdC5vbignZXJyb3InLCAoKSA9PiBuKCkpO1xuXG4gICAgICAgICAgICBzdHJlYW0ucGlwZShkZXN0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgICAgbigpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZvbGRlclRvKHJlbW90ZVBhdGgsIHRhcmdldFBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkLCBwcm9ncmVzcykge1xuICAgIGNvbnN0IG5wYXRoID0gUGF0aC5wb3NpeC5yZXNvbHZlKHJlbW90ZVBhdGgpO1xuXG4gICAgdGhpcy5saXN0KG5wYXRoLCByZWN1cnNpdmUsIChsRXJyb3IsIGxpc3QpID0+IHtcbiAgICAgIHRoaXMuY2xpZW50LmNoZWNrSWdub3JlKG5wYXRoKTtcblxuICAgICAgbGlzdC51bnNoaWZ0KHsgbmFtZTogbnBhdGgsIHR5cGU6ICdkJyB9KTtcbiAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5jbGllbnQuaWdub3JlRmlsdGVyKSB7XG4gICAgICAgICAgaWYgKHRoaXMuY2xpZW50Lmlnbm9yZUZpbHRlci5pZ25vcmVzKGl0ZW0ubmFtZSkpIHtcbiAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpdGVtLmRlcHRoID0gc3BsaXRQYXRocyhpdGVtLm5hbWUpLmxlbmd0aDtcbiAgICAgIH0pO1xuICAgICAgbGlzdC5zb3J0KHNvcnREZXB0aCk7XG5cbiAgICAgIGxldCBlcnJvciA9IG51bGw7XG4gICAgICBsZXQgaSA9IC0xO1xuICAgICAgbGV0IHNpemUgPSAwO1xuICAgICAgbGV0IHJlYWQgPSAwO1xuICAgICAgbGV0IHBvb2w7XG5cbiAgICAgIGNvbnN0IHRvdGFsID0gbGlzdC5sZW5ndGg7XG5cbiAgICAgIGNvbnN0IGUgPSAoKSA9PiB7XG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2Vycm9yLCBsaXN0XSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBuID0gKCkgPT4ge1xuICAgICAgICArK2k7XG4gICAgICAgIGlmIChwb29sKSBjbGVhckludGVydmFsKHBvb2wpO1xuICAgICAgICB0cnlBcHBseShwcm9ncmVzcywgbnVsbCwgW2kgLyB0b3RhbF0pO1xuXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0LnNoaWZ0KCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyB8fCBpdGVtID09PSBudWxsKSByZXR1cm4gZSgpO1xuXG4gICAgICAgIGNvbnN0IG5Mb2NhbCA9IFBhdGguam9pbih0YXJnZXRQYXRoLCAnLi4nLCBpdGVtLm5hbWUpO1xuXG4gICAgICAgIGlmIChpdGVtLnR5cGUgPT09ICdkJyB8fCBpdGVtLnR5cGUgPT09ICdsJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBGUy5tYWtlVHJlZVN5bmMobkxvY2FsKTtcbiAgICAgICAgICB9IGNhdGNoIChjZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChjZXJyb3IuY29kZSA9PT0gJ0VFWElTVCcpIHtcbiAgICAgICAgICAgICAgaXNFRVhJU1QoY2Vycm9yLnBhdGgsIChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgIEZTLnJlbW92ZVN5bmMoY2Vycm9yLnBhdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0KG5wYXRoKTtcbiAgICAgICAgICAgICAgICAvLyBGUy5tYWtlVHJlZVN5bmMobkxvY2FsKTtcblxuICAgICAgICAgICAgICAgIG1vZGVsLnJlbW92ZU5vdGlmaWNhdGlvbigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZSA9IDA7XG4gICAgICAgICAgcmVhZCA9IDA7XG5cbiAgICAgICAgICB0aGlzLm9uY2UoJzE1MCcsIChyZXBseSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RyID0gcmVwbHkubWF0Y2goLyhbMC05XSspXFxzKihieXRlcykvKTtcbiAgICAgICAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgICAgICAgc2l6ZSA9IHBhcnNlSW50KHN0clsxXSwgMTApIHx8IC0xO1xuICAgICAgICAgICAgICBwb29sID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgcmVhZCA9IHRoaXMuZnRwLl9wYXN2U29ja2V0LmJ5dGVzUmVhZDtcbiAgICAgICAgICAgICAgICB0cnlBcHBseShwcm9ncmVzcywgbnVsbCwgWyhpIC8gdG90YWwpICsgKHJlYWQgLyBzaXplIC8gdG90YWwpXSk7XG4gICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmZ0cC5nZXQoaXRlbS5uYW1lLCAoZ2V0RXJyb3IsIHN0cmVhbSkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldEVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9yID0gZ2V0RXJyb3I7XG5cbiAgICAgICAgICAgICAgaWYgKC9QZXJtaXNzaW9uIGRlbmllZC8udGVzdChlcnJvcikpIHtcbiAgICAgICAgICAgICAgICBpc1Blcm1pc3Npb25EZW5pZWQoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRlc3QgPSBGUy5jcmVhdGVXcml0ZVN0cmVhbShuTG9jYWwpO1xuXG4gICAgICAgICAgICBkZXN0Lm9uKCd1bnBpcGUnLCAoKSA9PiBuKCkpO1xuICAgICAgICAgICAgZGVzdC5vbignZXJyb3InLCAoKSA9PiBuKCkpO1xuXG4gICAgICAgICAgICBzdHJlYW0ucGlwZShkZXN0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9O1xuICAgICAgbigpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VG8ocmVtb3RlUGF0aCwgdGFyZ2V0UGF0aCwgcmVjdXJzaXZlLCBjb21wbGV0ZWQsIHByb2dyZXNzKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZEFwcGx5KGNvbXBsZXRlZCkpIHJldHVybjtcblxuICAgIHRoaXMudHlwZShyZW1vdGVQYXRoLCAodHlwZSkgPT4ge1xuICAgICAgaWYgKHR5cGUgPT09ICdmJykge1xuICAgICAgICB0aGlzLl9nZXRGaWxlVG8ocmVtb3RlUGF0aCwgdGFyZ2V0UGF0aCwgY29tcGxldGVkLCBwcm9ncmVzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRGb2xkZXJUbyhyZW1vdGVQYXRoLCB0YXJnZXRQYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0KHBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkLCBwcm9ncmVzcykge1xuICAgIGlmICghdGhpcy5faXNDb25uZWN0ZWRBcHBseShjb21wbGV0ZWQpKSByZXR1cm47XG5cbiAgICBjb25zdCBucGF0aCA9IFBhdGgucG9zaXgucmVzb2x2ZShwYXRoKTtcblxuICAgIHRoaXMudHlwZShucGF0aCwgKHR5cGUpID0+IHtcbiAgICAgIGlmICh0eXBlID09PSAnZicpIHtcbiAgICAgICAgdGhpcy5fZ2V0RmlsZShucGF0aCwgY29tcGxldGVkLCBwcm9ncmVzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRGb2xkZXIobnBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkLCBwcm9ncmVzcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdXRUbyhzb3VyY2VQYXRoLCB0YXJnZXRQYXRoLCBjb21wbGV0ZWQsIHByb2dyZXNzKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZEFwcGx5KGNvbXBsZXRlZCkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IHJlbW90ZSA9IHRoaXMuY2xpZW50LnRvUmVtb3RlKHRhcmdldFBhdGgpO1xuXG4gICAgaWYgKEZTLmlzRmlsZVN5bmMoc291cmNlUGF0aCkpIHtcbiAgICAgIC8vIEZpbGVcbiAgICAgIGNvbnN0IHN0YXRzID0gRlMuc3RhdFN5bmMoc291cmNlUGF0aCk7XG4gICAgICBjb25zdCBzaXplID0gc3RhdHMuc2l6ZTtcbiAgICAgIGxldCB3cml0dGVuID0gMDtcblxuICAgICAgY29uc3QgZSA9IChlcnIpID0+IHtcbiAgICAgICAgdHJ5QXBwbHkoY29tcGxldGVkLCBudWxsLCBbZXJyIHx8IG51bGwsIFt7IG5hbWU6IHNvdXJjZVBhdGgsIHR5cGU6ICdmJyB9XV0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBvb2wgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgIHdyaXR0ZW4gPSB0aGlzLmZ0cC5fcGFzdlNvY2tldC5ieXRlc1dyaXR0ZW47XG4gICAgICAgIHRyeUFwcGx5KHByb2dyZXNzLCBudWxsLCBbd3JpdHRlbiAvIHNpemVdKTtcbiAgICAgIH0sIDI1MCk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZ0cC5wdXQoc291cmNlUGF0aCwgcmVtb3RlLCAoZXJyKSA9PiB7XG4gICAgICAgIGxldCBmYXRhbCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgvUGVybWlzc2lvbiBkZW5pZWQvLnRlc3QoZXJyKSkge1xuICAgICAgICAgIGlzUGVybWlzc2lvbkRlbmllZChzb3VyY2VQYXRoKTtcbiAgICAgICAgICBmYXRhbCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGUoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIgJiYgIWZhdGFsKSB7XG4gICAgICAgICAgdGhpcy5ta2RpcihQYXRoLmRpcm5hbWUocmVtb3RlKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJy8nKSwgdHJ1ZSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmZ0cC5wdXQoc291cmNlUGF0aCwgcmVtb3RlLCAocHV0RXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZShwdXRFcnJvcik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvb2wpIGNsZWFySW50ZXJ2YWwocG9vbCk7XG4gICAgICAgIHJldHVybiBlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhdmVyc2VUcmVlKHNvdXJjZVBhdGgsIChsaXN0KSA9PiB7XG4gICAgICB0aGlzLm1rZGlyKHJlbW90ZSwgdHJ1ZSwgKCkgPT4ge1xuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIGxldCBpID0gLTE7XG4gICAgICAgIGxldCBzaXplID0gMDtcbiAgICAgICAgbGV0IHdyaXR0ZW4gPSAwO1xuXG4gICAgICAgIGNvbnN0IHRvdGFsID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHBvb2wgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLmZ0cCB8fCAhdGhpcy5mdHAuX3Bhc3ZTb2NrZXQpIHJldHVybjtcbiAgICAgICAgICB3cml0dGVuID0gdGhpcy5mdHAuX3Bhc3ZTb2NrZXQuYnl0ZXNXcml0dGVuO1xuICAgICAgICAgIHRyeUFwcGx5KHByb2dyZXNzLCBudWxsLCBbKGkgLyB0b3RhbCkgKyAod3JpdHRlbiAvIHNpemUgLyB0b3RhbCldKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgY29uc3QgZSA9ICgpID0+IHtcbiAgICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcbiAgICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnJvciwgbGlzdF0pO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBuID0gKCkgPT4ge1xuICAgICAgICAgIGlmICgrK2kgPj0gbGlzdC5sZW5ndGgpIHJldHVybiBlKCk7XG5cbiAgICAgICAgICBjb25zdCBpdGVtID0gbGlzdFtpXTtcblxuICAgICAgICAgIGNvbnN0IG5SZW1vdGUgPSBQYXRoLnBvc2l4LmpvaW4oUGF0aC5kaXJuYW1lKHJlbW90ZSksIHRoaXMuY2xpZW50LnRvUmVtb3RlKGl0ZW0ubmFtZSkpO1xuXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gJ2QnIHx8IGl0ZW0udHlwZSA9PT0gJ2wnKSB7XG4gICAgICAgICAgICB0aGlzLmZ0cC5ta2RpcihuUmVtb3RlLCAobWtkaXJFcnIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG1rZGlyRXJyKSBlcnJvciA9IG1rZGlyRXJyO1xuICAgICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gRlMuc3RhdFN5bmMoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgIHNpemUgPSBzdGF0cy5zaXplO1xuICAgICAgICAgICAgd3JpdHRlbiA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuZnRwLnB1dChpdGVtLm5hbWUsIG5SZW1vdGUsIChwdXRFcnIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHB1dEVycikgZXJyb3IgPSBwdXRFcnI7XG4gICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1dChwYXRoLCBjb21wbGV0ZWQsIHByb2dyZXNzKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZEFwcGx5KGNvbXBsZXRlZCkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IHJlbW90ZSA9IHRoaXMuY2xpZW50LnRvUmVtb3RlKHBhdGgpO1xuXG4gICAgaWYgKEZTLmlzRmlsZVN5bmMocGF0aCkpIHtcbiAgICAgIC8vIE5PVEU6IEZpbGVcbiAgICAgIGNvbnN0IHN0YXRzID0gRlMuc3RhdFN5bmMocGF0aCk7XG4gICAgICBjb25zdCBzaXplID0gc3RhdHMuc2l6ZTtcbiAgICAgIGxldCB3cml0dGVuID0gMDtcblxuICAgICAgY29uc3QgZSA9IChlcnIpID0+IHtcbiAgICAgICAgdHJ5QXBwbHkoY29tcGxldGVkLCBudWxsLCBbZXJyIHx8IG51bGwsIFt7IG5hbWU6IHBhdGgsIHR5cGU6ICdmJyB9XV0pO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IHBvb2wgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5mdHAgfHwgIXRoaXMuZnRwLl9wYXN2U29ja2V0KSByZXR1cm47XG4gICAgICAgIHdyaXR0ZW4gPSB0aGlzLmZ0cC5fcGFzdlNvY2tldC5ieXRlc1dyaXR0ZW47XG4gICAgICAgIHRyeUFwcGx5KHByb2dyZXNzLCBudWxsLCBbd3JpdHRlbiAvIHNpemVdKTtcbiAgICAgIH0sIDI1MCk7XG5cbiAgICAgIHRoaXMuZnRwLnB1dChwYXRoLCByZW1vdGUsIChlcnIpID0+IHtcbiAgICAgICAgbGV0IGZhdGFsID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKC9QZXJtaXNzaW9uIGRlbmllZC8udGVzdChlcnIpKSB7XG4gICAgICAgICAgaXNQZXJtaXNzaW9uRGVuaWVkKHBhdGgpO1xuICAgICAgICAgIGZhdGFsID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gZShlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyciAmJiAhZmF0YWwpIHtcbiAgICAgICAgICB0aGlzLm1rZGlyKFBhdGguZGlybmFtZShyZW1vdGUpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAnLycpLCB0cnVlLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZnRwLnB1dChwYXRoLCByZW1vdGUsIChwdXRFcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwb29sKSBjbGVhckludGVydmFsKHBvb2wpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlKHB1dEVycm9yKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcbiAgICAgICAgcmV0dXJuIGUoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOT1RFOiBGb2xkZXJcbiAgICAgIHRyYXZlcnNlVHJlZShwYXRoLCAobGlzdCkgPT4ge1xuICAgICAgICB0aGlzLm1rZGlyKHJlbW90ZSwgdHJ1ZSwgKCkgPT4ge1xuICAgICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgICBsZXQgaSA9IC0xO1xuICAgICAgICAgIGxldCBzaXplID0gMDtcbiAgICAgICAgICBsZXQgd3JpdHRlbiA9IDA7XG5cbiAgICAgICAgICBjb25zdCB0b3RhbCA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgIGNvbnN0IHBvb2wgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZnRwIHx8ICF0aGlzLmZ0cC5fcGFzdlNvY2tldCkgcmV0dXJuO1xuICAgICAgICAgICAgd3JpdHRlbiA9IHRoaXMuZnRwLl9wYXN2U29ja2V0LmJ5dGVzV3JpdHRlbjtcbiAgICAgICAgICAgIHRyeUFwcGx5KHByb2dyZXNzLCBudWxsLCBbKGkgLyB0b3RhbCkgKyAod3JpdHRlbiAvIHNpemUgLyB0b3RhbCldKTtcbiAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgIGNvbnN0IGUgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocG9vbCkgY2xlYXJJbnRlcnZhbChwb29sKTtcbiAgICAgICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2Vycm9yLCBsaXN0XSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCsraSA+PSBsaXN0Lmxlbmd0aCkgcmV0dXJuIGUoKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2ldO1xuICAgICAgICAgICAgY29uc3QgblJlbW90ZSA9IHRoaXMuY2xpZW50LnRvUmVtb3RlKGl0ZW0ubmFtZSk7XG4gICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcpIHtcbiAgICAgICAgICAgICAgdGhpcy5mdHAubWtkaXIoblJlbW90ZSwgKG1rZGlyRXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1rZGlyRXJyKSBlcnJvciA9IG1rZGlyRXJyO1xuICAgICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3Qgc3RhdHMgPSBGUy5zdGF0U3luYyhpdGVtLm5hbWUpO1xuICAgICAgICAgICAgICBzaXplID0gc3RhdHMuc2l6ZTtcbiAgICAgICAgICAgICAgd3JpdHRlbiA9IDA7XG4gICAgICAgICAgICAgIHRoaXMuZnRwLnB1dChpdGVtLm5hbWUsIG5SZW1vdGUsIChwdXRFcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocHV0RXJyKSBlcnJvciA9IHB1dEVycjtcbiAgICAgICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIG4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG1rZGlyKHBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkKSB7XG4gICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZEFwcGx5KGNvbXBsZXRlZCkpIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IHJlbW90ZXMgPSBzcGxpdFBhdGhzKHBhdGgpO1xuICAgIGNvbnN0IGRpcnMgPSBbYC8ke3JlbW90ZXMuc2xpY2UoMCwgcmVtb3Rlcy5sZW5ndGgpLmpvaW4oJy8nKX1gXTtcbiAgICBjb25zdCByZW1vdGVQYXRoID0gc3BsaXRQYXRocyh0aGlzLmNsaWVudC5pbmZvLnJlbW90ZSk7XG5cbiAgICBpZiAocmVjdXJzaXZlKSB7XG4gICAgICBmb3IgKGxldCBhID0gcmVtb3Rlcy5sZW5ndGggLSAxOyBhID4gMDsgLS1hKSB7XG4gICAgICAgIC8vIE9ic2VydmUgdGhlIHNwZWNpZmllZCBwYXRoXG4gICAgICAgIGNvbnN0IHNSZW1vdGUgPSBgLyR7cmVtb3RlUGF0aC5zbGljZSgwLCBhKS5qb2luKCcvJyl9YDtcbiAgICAgICAgY29uc3QgcFJlbW90ZSA9IGAvJHtyZW1vdGVzLnNsaWNlKDAsIGEpLmpvaW4oJy8nKX1gO1xuXG4gICAgICAgIGlmIChzUmVtb3RlICE9PSBwUmVtb3RlKSB7XG4gICAgICAgICAgZGlycy51bnNoaWZ0KGAvJHtyZW1vdGVzLnNsaWNlKDAsIGEpLmpvaW4oJy8nKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG4gPSAoKSA9PiB7XG4gICAgICBjb25zdCBkaXIgPSBkaXJzLnNoaWZ0KCk7XG4gICAgICBjb25zdCBsYXN0ID0gZGlycy5sZW5ndGggPT09IDA7XG5cbiAgICAgIHRoaXMuZnRwLmxpc3QoZGlyLCBmYWxzZSwgKGVyckxpc3QsIGxpc3QpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgICAgICAgY29uc3QgZm9sZGVycyA9IGxpc3QuZmlsdGVyKG8gPT4gby50eXBlID09PSAnZCcgfHwgby50eXBlID09PSAnbCcpO1xuICAgICAgICAgIGNvbnN0IGRpck5hbWVzID0gZm9sZGVycy5tYXAobyA9PiBvLm5hbWUpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBsaXN0ICE9PSAndW5kZWZpbmVkJyAmJiBkaXJOYW1lcy5pbmRleE9mKGRpck5hbWUpID4gLTEpIHtcbiAgICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2Vyckxpc3QgfHwgbnVsbF0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG4oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZ0cC5ta2RpcihkaXIsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAobGFzdCkge1xuICAgICAgICAgICAgdHJ5QXBwbHkoY29tcGxldGVkLCBudWxsLCBbZXJyIHx8IG51bGxdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIG4oKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbWtmaWxlKHBhdGgsIGNvbXBsZXRlZCkge1xuICAgIGlmICghdGhpcy5faXNDb25uZWN0ZWRBcHBseShjb21wbGV0ZWQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBsb2NhbCA9IHRoaXMuY2xpZW50LnRvTG9jYWwocGF0aCk7XG4gICAgY29uc3QgZW1wdHkgPSBuZXcgQnVmZmVyKCcnLCAndXRmOCcpO1xuICAgIGNvbnN0IGVuYWJsZVRyYW5zZmVyID0gYXRvbS5jb25maWcuZ2V0KCdyZW1vdGUtZnRwLm5vdGlmaWNhdGlvbnMuZW5hYmxlVHJhbnNmZXInKTtcblxuICAgIHRoaXMuZnRwLmxpc3QocGF0aCwgZmFsc2UsIChsaXN0RXJyLCBsaXN0KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGxpc3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gbGlzdC5maWx0ZXIobyA9PiBvLnR5cGUgPT09ICctJyk7XG5cbiAgICAgICAgLy8gRmlsZSBleGlzdHNcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgIGlmIChlbmFibGVUcmFuc2ZlcikgaXNBbHJlYWR5RXhpdHMocGF0aCwgJ2ZpbGUnKTtcblxuICAgICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2xpc3RFcnJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5mdHAucHV0KGVtcHR5LCBwYXRoLCAocHV0RXJyKSA9PiB7XG4gICAgICAgIGlmIChwdXRFcnIpIHtcbiAgICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtwdXRFcnJdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBGUy5tYWtlVHJlZVN5bmMoUGF0aC5kaXJuYW1lKGxvY2FsKSk7XG4gICAgICAgIEZTLndyaXRlRmlsZShsb2NhbCwgZW1wdHksIChlcnIyKSA9PiB7XG4gICAgICAgICAgdHJ5QXBwbHkoY29tcGxldGVkLCBudWxsLCBbZXJyMl0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW5hbWUoc291cmNlLCBkZXN0LCBjb21wbGV0ZWQpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdGhpcy5mdHAucmVuYW1lKHNvdXJjZSwgZGVzdCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlcnJdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZTLnJlbmFtZSh0aGlzLmNsaWVudC50b0xvY2FsKHNvdXJjZSksIHRoaXMuY2xpZW50LnRvTG9jYWwoZGVzdCksIChyRXJyKSA9PiB7XG4gICAgICAgICAgdHJ5QXBwbHkoY29tcGxldGVkLCBudWxsLCBbckVycl0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2l0ZShjb21tYW5kLCBjb21wbGV0ZWQpIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdGhpcy5mdHAuc2l0ZShjb21tYW5kLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2Vycl0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjaG1vZChwYXRoLCBtb2RlLCBjb21wbGV0ZWQgPSAoKSA9PiB7fSkge1xuICAgIGlmICghdGhpcy5faXNDb25uZWN0ZWRBcHBseShjb21wbGV0ZWQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmZ0cC5zaXRlKGBDSE1PRCAke21vZGV9ICR7cGF0aH1gLCBjb21wbGV0ZWQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcGxldGVkKC4uLlsnTm90IGNvbm5lY3RlZCddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNob3duKHBhdGgsIG93bmVyLCBjb21wbGV0ZWQgPSAoKSA9PiB7fSkge1xuICAgIGlmICghdGhpcy5faXNDb25uZWN0ZWRBcHBseShjb21wbGV0ZWQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLmZ0cC5zaXRlKGBDSE9XTiAke293bmVyfSAke3BhdGh9YCwgY29tcGxldGVkKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjaGdycChwYXRoLCBncm91cCwgY29tcGxldGVkID0gKCkgPT4ge30pIHtcbiAgICBpZiAoIXRoaXMuX2lzQ29ubmVjdGVkQXBwbHkoY29tcGxldGVkKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgdGhpcy5mdHAuc2l0ZShgQ0hHUlAgJHtncm91cH0gJHtwYXRofWAsIGNvbXBsZXRlZCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wbGV0ZWQoLi4uWydOb3QgY29ubmVjdGVkJ10pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZGVsZXRlKHBhdGgsIGNvbXBsZXRlZCkge1xuICAgIGlmICghdGhpcy5faXNDb25uZWN0ZWRBcHBseShjb21wbGV0ZWQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICB0aGlzLnR5cGUocGF0aCwgKHR5cGUpID0+IHtcbiAgICAgIGlmICh0eXBlID09PSAnZicpIHtcbiAgICAgICAgLy8gTk9URTogRmlsZVxuICAgICAgICB0aGlzLmZ0cC5kZWxldGUocGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgIHRyeUFwcGx5KGNvbXBsZXRlZCwgbnVsbCwgW2VyciwgW3sgbmFtZTogcGF0aCwgdHlwZTogJ2YnIH1dXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTk9URTogRm9sZGVyXG4gICAgICAgIHRoaXMubGlzdChwYXRoLCB0cnVlLCAoZXJyLCBsaXN0KSA9PiB7XG4gICAgICAgICAgbGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLmRlcHRoID0gc3BsaXRQYXRocyhpdGVtLm5hbWUpLmxlbmd0aDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsaXN0LnNvcnQoc2ltcGxlU29ydERlcHRoKTtcblxuICAgICAgICAgIGxldCBkb25lID0gMDtcblxuICAgICAgICAgIGNvbnN0IGUgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZ0cC5ybWRpcihwYXRoLCAoZUVycikgPT4ge1xuICAgICAgICAgICAgICB0cnlBcHBseShjb21wbGV0ZWQsIG51bGwsIFtlRXJyLCBsaXN0XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgKytkb25lO1xuICAgICAgICAgICAgY29uc3QgZm4gPSBpdGVtLnR5cGUgPT09ICdkJyB8fCBpdGVtLnR5cGUgPT09ICdsJyA/ICdybWRpcicgOiAnZGVsZXRlJztcbiAgICAgICAgICAgIHRoaXMuZnRwW2ZuXShpdGVtLm5hbWUsICgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKC0tZG9uZSA9PT0gMCkgcmV0dXJuIGUoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApIGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbm5lY3RvckZUUDtcbiJdfQ==