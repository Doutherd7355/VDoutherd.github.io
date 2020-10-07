Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ssh2 = require('ssh2');

var _ssh22 = _interopRequireDefault(_ssh2);

var _connector = require('../connector');

var _connector2 = _interopRequireDefault(_connector);

var _notifications = require('../notifications');

var _helpers = require('../helpers');

'use babel';

var ConnectorSFTP = (function (_Connector) {
  _inherits(ConnectorSFTP, _Connector);

  function ConnectorSFTP() {
    _classCallCheck(this, ConnectorSFTP);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(ConnectorSFTP.prototype), 'constructor', this).apply(this, args);

    this.ssh2 = null;
    this.sftp = null;
    this.status = 'disconnected';
  }

  _createClass(ConnectorSFTP, [{
    key: 'isConnected',
    value: function isConnected() {
      var self = this;

      return self.status !== 'disconnected' && self.sftp;
    }
  }, {
    key: 'connect',
    value: function connect(info, completed) {
      var self = this;

      self.info = info;
      self.info.debug = true;
      self.customFilePermissions = self.info.filePermissions;

      var debug = self.info.debug;
      var connectInfo = Object.assign({}, self.info);

      delete connectInfo.filePermissions;

      self.status = 'connecting';

      self.ssh2 = new _ssh22['default']();

      self.ssh2.on('banner', function (msg) {
        self.emit('greeting', msg);
      });

      self.ssh2.on('ready', function () {
        self.ssh2.sftp(function (err, sftp) {
          if (err) {
            self.disconnect();
            return;
          }

          if (self.info.remoteShell) {
            self.emit('openingShell', self.info.remoteShell);

            self.ssh2.shell(function (shellErr, stream) {
              if (shellErr) {
                self.emit('error', shellErr);
                self.disconnect();
                return;
              }

              stream.end(self.info.remoteShell + '\nexit\n');
            });
          }

          if (self.info.remoteCommand) {
            self.emit('executingCommand', self.info.remoteCommand);

            self.ssh2.exec(self.info.remoteCommand, function (remoteErr) {
              if (remoteErr) {
                self.emit('error', remoteErr);
                self.disconnect();
              }
            });
          }

          self.status = 'connected';

          self.sftp = sftp;
          self.sftp.on('end', function () {
            self.disconnect();
            self.emit('ended');
          });

          self.emit('connected');

          if (typeof completed === 'function') {
            completed.apply(self, []);
          }
        });
      });

      self.ssh2.on('end', function () {
        self.disconnect();
        self.emit('ended');
      });

      self.ssh2.on('close', function () {
        self.disconnect();
        self.emit('closed');
      });

      self.ssh2.on('error', function (err) {
        self.emit('error', err);
      });

      self.ssh2.on('debug', function (str) {
        if (typeof debug === 'function') {
          debug.apply(undefined, [str]);
        }
      });

      self.ssh2.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
        finish([self.info.verifyCode]);
      });

      try {
        self.ssh2.connect(connectInfo);
      } catch (err) {
        atom.notifications.addError('SFTP connection attempt failed', {
          detail: err,
          dismissable: true
        });
      }

      return self;
    }
  }, {
    key: 'disconnect',
    value: function disconnect(completed) {
      var self = this;

      self.status = 'disconnected';

      if (self.sftp) {
        self.sftp.end();
        self.sftp = null;
      }

      if (self.ssh2) {
        self.ssh2.end();
        self.ssh2 = null;
      }

      if (typeof completed === 'function') {
        completed.apply(undefined, []);
      }

      return self;
    }
  }, {
    key: 'abort',
    value: function abort(completed) {
      // TODO find a way to abort current operation

      if (typeof completed === 'function') {
        completed.apply(undefined, []);
      }

      return this;
    }
  }, {
    key: 'list',
    value: function list(path, recursive, completed) {
      var self = this;

      if (!self.isConnected()) {
        if (typeof completed === 'function') completed.apply(undefined, ['Not connected']);
        return;
      }

      var list = [];
      var digg = 0;

      var callCompleted = function callCompleted() {
        if (typeof completed === 'function') completed.apply(undefined, [null, list]);
      };

      var oneDirCompleted = function oneDirCompleted() {
        if (--digg === 0) callCompleted();
      };

      var listDir = function listDir(listPath) {
        digg++;

        if (digg > 500) {
          console.log('recursion depth over 500!');
        }

        self.sftp.readdir(listPath, function (err, li) {
          if (err) return callCompleted();
          var filesLeft = li.length;

          if (filesLeft === 0) return callCompleted();

          li.forEach(function (item) {
            // symlinks
            if (item.attrs.isSymbolicLink()) {
              (function () {
                // NOTE: we only follow one symlink down here!
                // symlink -> symlink -> file won't work!
                var fname = _path2['default'].join(listPath, item.filename).replace(/\\/g, '/');

                self.sftp.realpath(fname, function (realPatherr, target) {
                  if (realPatherr) {
                    atom.notifications.addError('Could not call realpath for symlink', {
                      detail: realPatherr,
                      dismissable: false
                    });

                    if (--filesLeft === 0) oneDirCompleted();

                    return;
                  }

                  self.sftp.stat(target, function (statErr, stats) {
                    if (statErr) {
                      atom.notifications.addError('Could not correctly resolve symlink', {
                        detail: fname + ' -> ' + target,
                        dismissable: false
                      });

                      if (--filesLeft === 0) oneDirCompleted();

                      return;
                    }

                    var entry = {
                      name: fname,
                      type: stats.isFile() ? 'f' : 'd',
                      size: stats.size,
                      group: stats.gid,
                      owner: stats.uid,
                      rights: (0, _helpers.statsToPermissions)(stats),
                      date: new Date()
                    };

                    entry.date.setTime(stats.mtime * 1000);
                    list.push(entry);

                    if (recursive && entry.type === 'd') listDir(entry.name);
                    if (--filesLeft === 0) oneDirCompleted();
                  });
                });

                // regular files & dirs
              })();
            } else {
                var entry = {
                  name: _path2['default'].join(listPath, item.filename).replace(/\\/g, '/'),
                  type: item.attrs.isFile() ? 'f' : 'd',
                  size: item.attrs.size,
                  group: item.attrs.gid,
                  owner: item.attrs.uid,
                  rights: (0, _helpers.statsToPermissions)(item.attrs),
                  date: new Date()
                };

                entry.date.setTime(item.attrs.mtime * 1000);
                list.push(entry);

                if (recursive && entry.type === 'd') listDir(entry.name);
                if (--filesLeft === 0) oneDirCompleted();
              }
          });

          return true;
        });
      };

      listDir(path);
    }
  }, {
    key: 'get',
    value: function get(path, recursive, completed, progress, symlinkPath) {
      var self = this;
      var local = self.client.toLocal(symlinkPath || path);

      if (!self.isConnected()) {
        if (typeof completed === 'function') completed.apply(undefined, ['Not connected']);
        return;
      }

      self.sftp.lstat(path, function (err, stats) {
        if (err) {
          if (typeof completed === 'function') completed.apply(undefined, [err]);
          return;
        }

        if (stats.isSymbolicLink()) {
          self.sftp.realpath(path, function (realPatherr, target) {
            if (realPatherr) {
              if (typeof completed === 'function') completed.apply(undefined, [realPatherr]);
              return;
            }

            self.get(target, recursive, completed, progress, path);
          });
        } else if (stats.isFile()) {
          // File
          _fsPlus2['default'].makeTreeSync(_path2['default'].dirname(local));

          self.sftp.fastGet(path, local, {
            step: function step(read, chunk, size) {
              if (typeof progress === 'function') {
                progress.apply(undefined, [read / size]);
              }
            }
          }, function (fastGetErr) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [fastGetErr]);
            }
          });
        } else {
          // Directory
          self.list(path, recursive, function (listErr, list) {
            list.unshift({ name: path, type: 'd' });

            list.forEach(function (item) {
              item.depth = item.name.replace(/^\/+/, '').replace(/\/+$/).split('/').length;
            });

            list.sort(function (a, b) {
              if (a.depth === b.depth) return 0;
              return a.depth > b.depth ? 1 : -1;
            });

            var error = null;
            var total = list.length;
            var i = -1;
            var e = function e() {
              if (typeof completed === 'function') {
                completed.apply(undefined, [error, list]);
              }
            };

            var n = function n() {
              ++i;
              if (typeof progress === 'function') {
                progress.apply(undefined, [i / total]);
              }

              var item = list.shift();

              if (typeof item === 'undefined' || item === null) {
                return e();
              }

              var toLocal = self.client.toLocal(item.name);

              if (item.type === 'd' || item.type === 'l') {
                // mkdirp(toLocal, function (err) {
                _fsPlus2['default'].makeTree(toLocal, function (treeErr) {
                  if (treeErr) {
                    error = treeErr;
                  }

                  return n();
                });
              } else {
                self.sftp.fastGet(item.name, toLocal, {
                  step: function step(read, chunk, size) {
                    if (typeof progress === 'function') {
                      progress.apply(undefined, [i / total + read / size / total]);
                    }
                  }
                }, function (fastGetErr) {
                  if (fastGetErr) {
                    error = fastGetErr;
                  }

                  return n();
                });
              }
              return true;
            };
            n();
          });
        }
      });
    }
  }, {
    key: 'getTo',
    value: function getTo(remotePath, targetPath, recursive, completed, progress, symlinkPath) {
      var self = this;
      var local = targetPath;

      if (!self.isConnected()) {
        if (typeof completed === 'function') completed.apply(undefined, ['Not connected']);
      }

      self.sftp.lstat(remotePath, function (err, stats) {
        if (err) {
          if (typeof completed === 'function') completed.apply(undefined, [err]);
          return;
        }

        if (stats.isSymbolicLink()) {
          self.sftp.realpath(remotePath, function (realPatherr, target) {
            if (realPatherr) {
              if (typeof completed === 'function') completed.apply(undefined, [realPatherr]);
              return;
            }

            self.get(target, recursive, completed, progress, remotePath);
          });
        } else if (stats.isFile()) {
          // File
          _fsPlus2['default'].makeTreeSync(_path2['default'].dirname(local));

          self.sftp.fastGet(remotePath, local, {
            step: function step(read, chunk, size) {
              if (typeof progress === 'function') {
                progress.apply(undefined, [read / size]);
              }
            }
          }, function (fastGetErr) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [fastGetErr]);
            }
          });
        } else {
          // Directory
          self.list(remotePath, recursive, function (listErr, list) {
            list.unshift({ name: remotePath, type: 'd' });

            list.forEach(function (item) {
              item.depth = item.name.replace(/^\/+/, '').replace(/\/+$/).split('/').length;
            });

            list.sort(function (a, b) {
              if (a.depth === b.depth) return 0;
              return a.depth > b.depth ? 1 : -1;
            });

            var error = null;
            var total = list.length;
            var i = -1;
            var e = function e() {
              if (typeof completed === 'function') {
                completed.apply(undefined, [error, list]);
              }
            };

            var n = function n() {
              ++i;
              if (typeof progress === 'function') {
                progress.apply(undefined, [i / total]);
              }

              var item = list.shift();

              if (typeof item === 'undefined' || item === null) {
                return e();
              }

              var toTarget = _path2['default'].dirname(targetPath.replace(self.client.getProjectPath(), ''));
              var toLocal = self.client.toLocal(item.name, toTarget);

              if (item.type === 'd' || item.type === 'l') {
                // mkdirp(toLocal, function (err) {
                _fsPlus2['default'].makeTree(toLocal, function (treeErr) {
                  if (treeErr) {
                    error = treeErr;
                  }

                  return n();
                });
              } else {
                self.sftp.fastGet(item.name, toLocal, {
                  step: function step(read, chunk, size) {
                    if (typeof progress === 'function') {
                      progress.apply(undefined, [i / total + read / size / total]);
                    }
                  }
                }, function (fastGetErr) {
                  if (fastGetErr) {
                    error = fastGetErr;
                  }

                  return n();
                });
              }
              return true;
            };
            n();
          });
        }
      });
    }
  }, {
    key: 'putDirect',
    value: function putDirect(file) {
      var _this = this;

      var self = this;
      var fileObject = Object.assign({
        localPath: null,
        remotePath: null,
        callback: null,
        progress: null,
        i: 0,
        total: 0
      }, file);

      var stats = function stats(err, attrs) {
        var options = {};

        if (_this.customFilePermissions) {
          options.mode = parseInt(self.customFilePermissions, 8);
        } else if (err) {
          // using the default 0644
          options.mode = 420;
        } else {
          // using the original permissions from the remote
          options.mode = attrs.mode;
        }

        var readStream = _fsPlus2['default'].createReadStream(fileObject.localPath);
        var writeStream = self.sftp.createWriteStream(fileObject.remotePath, options);
        var fileSize = _fsPlus2['default'].statSync(fileObject.localPath).size; // used for setting progress bar

        var totalRead = 0; // used for setting progress bar

        function applyProgress() {
          if (typeof progress !== 'function') return;
          if (fileObject.total != null && fileObject.i != null) {
            fileObject.progress.apply(fileObject, [fileObject.i / fileObject.total + totalRead / fileSize / fileObject.total]);
          } else {
            fileObject.progress.apply(fileObject, [totalRead / fileSize]);
          }
        }

        writeStream.on('finish', function () {
          applyProgress(); // completes the progress bar

          return fileObject.e();
        }).on('error', function (writeErr) {
          var hasProp = Object.prototype.hasOwnProperty.call(fileObject, 'err');

          if (!hasProp && (writeErr.message === 'No such file' || writeErr.message === 'NO_SUCH_FILE')) {
            self.mkdir(_path2['default'].dirname(fileObject.remotePath).replace(/\\/g, '/'), true, function (dirErr) {
              if (dirErr) {
                var error = writeErr.message || dirErr;

                (0, _notifications.isGenericUploadError)(error);

                return dirErr;
              }

              self.putDirect(Object.assign({}, fileObject, { dirErr: dirErr }));

              return true;
            });
          } else if (err && Object.prototype.hasOwnProperty.call(err, 'message')) {
            (0, _notifications.isGenericUploadError)(err.message);
          } else {
            console.error(writeErr); // Useful for debugging
            (0, _notifications.isGenericUploadError)(writeErr);
          }
        });

        readStream.on('data', function (chunk) {
          totalRead += chunk.length;

          if (totalRead === fileSize) return; // let writeStream.on("finish") complete the progress bar

          applyProgress();
        });

        readStream.pipe(writeStream);
      };

      self.sftp.stat(fileObject.remotePath, stats);
    }
  }, {
    key: 'putTo',
    value: function putTo(sourcePath, targetPath, completed, progress) {
      var _this2 = this;

      if (this.isConnected()) {
        if (_fsPlus2['default'].isFileSync(sourcePath)) {
          var e = function e(err) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [err || null, [{ name: sourcePath, type: 'f' }]]);
            }
          };

          this.putDirect({
            localPath: sourcePath,
            remotePath: targetPath,
            progress: progress,
            e: e
          });
        } else {
          (0, _helpers.traverseTree)(sourcePath, function (list) {
            _this2.mkdir(targetPath, true, function () {
              var i = -1;
              var total = list.length;
              var e = function e(error) {
                if (typeof completed === 'function') {
                  completed.apply(undefined, [error, list]);
                }
              };
              var n = function n(error) {
                if (++i >= list.length) return e(error);

                var item = list[i];
                var toRemote = _this2.client.toRemote(item.name);

                if (item.type === 'd' || item.type === 'l') {
                  _this2.sftp.mkdir(toRemote, {}, function (travDirerr) {
                    if (travDirerr) {
                      error = travDirerr;
                    }
                    return n();
                  });
                } else {
                  _this2.putDirect({
                    localPath: item.name,
                    remotePath: toRemote,
                    progress: progress,
                    i: i,
                    total: total,
                    e: function e(putErr) {
                      if (putErr) error = putErr;

                      return n(error);
                    }
                  });
                }

                return true;
              };
              return n();
            });
          });
        }
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return this;
    }
  }, {
    key: 'put',
    value: function put(path, completed, progress) {
      var self = this;
      var remote = self.client.toRemote(path);

      if (self.isConnected()) {
        // File
        if (_fsPlus2['default'].isFileSync(path)) {
          var e = function e(err) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [err || null, [{ name: path, type: 'f' }]]);
            }
          };

          self.putDirect({
            localPath: path,
            remotePath: remote,
            progress: progress,
            e: e
          });
        } else {
          // Folder
          (0, _helpers.traverseTree)(path, function (list) {
            self.mkdir(remote, true, function () {
              var i = -1;
              var total = list.length;
              var e = function e(error) {
                if (typeof completed === 'function') {
                  completed.apply(undefined, [error, list]);
                }
              };
              var n = function n(error) {
                if (++i >= list.length) return e(error);

                var item = list[i];
                var toRemote = self.client.toRemote(item.name);

                if (item.type === 'd' || item.type === 'l') {
                  self.sftp.mkdir(toRemote, {}, function (travDirerr) {
                    if (travDirerr) {
                      error = travDirerr;
                    }
                    return n();
                  });
                } else {
                  self.putDirect({
                    localPath: item.name,
                    remotePath: toRemote,
                    progress: progress,
                    i: i,
                    total: total,
                    e: function e(putErr) {
                      if (putErr) error = putErr;

                      return n(error);
                    }
                  });
                }

                return true;
              };
              return n();
            });
          });
        }
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return self;
    }
  }, {
    key: 'mkdir',
    value: function mkdir(path, recursive, completed) {
      var self = this;
      var remotes = path.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
      var dirs = ['/' + remotes.slice(0, remotes.length).join('/')];

      if (self.isConnected()) {
        (function () {
          if (recursive) {
            for (var a = remotes.length - 1; a > 0; --a) {
              dirs.unshift('/' + remotes.slice(0, a).join('/'));
            }
          }

          var n = function n() {
            var dir = dirs.shift();
            var last = dirs.length === 0;

            self.sftp.mkdir(dir, {}, function (err) {
              if (last) {
                if (typeof completed === 'function') {
                  completed.apply(undefined, [err || null]);
                }
              } else {
                return n();
              }

              return true;
            });
          };
          n();
        })();
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return self;
    }
  }, {
    key: 'mkfile',
    value: function mkfile(path, completed) {
      var self = this;
      var local = self.client.toLocal(path);
      var empty = new Buffer('', 'utf8');

      if (self.isConnected()) {
        self.sftp.open(path, 'w', {}, function (err, handle) {
          if (err) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [err]);
            }
            return;
          }

          self.sftp.write(handle, empty, 0, 0, 0, function (writeErr) {
            if (writeErr) {
              if (typeof completed === 'function') {
                completed.apply(undefined, [writeErr]);
              }
              return;
            }

            // mkdirp(Path.dirname(local), function (err1) {
            _fsPlus2['default'].makeTree(_path2['default'].dirname(local), function (err1) {
              _fsPlus2['default'].writeFile(local, empty, function (err2) {
                if (typeof completed === 'function') {
                  completed.apply(undefined, [err1 || err2]);
                }
              });
            });
          });
        });
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return self;
    }
  }, {
    key: 'rename',
    value: function rename(source, dest, completed) {
      var self = this;

      if (self.isConnected()) {
        self.sftp.rename(source, dest, function (err) {
          if (err) {
            if (typeof completed === 'function') {
              completed.apply(undefined, [err]);
            }
          } else {
            _fsPlus2['default'].rename(self.client.toLocal(source), self.client.toLocal(dest), function (localErr) {
              if (typeof completed === 'function') {
                completed.apply(undefined, [localErr]);
              }
            });
          }
        });
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return self;
    }
  }, {
    key: 'delete',
    value: function _delete(path, completed) {
      var self = this;

      if (self.isConnected()) {
        self.sftp.stat(path, function (err, stats) {
          if (err) {
            if (typeof completed === 'function') completed.apply(undefined, [err]);
            return;
          }

          if (stats.isSymbolicLink()) {
            self.sftp.realpath(path, function (realPathErr, target) {
              if (realPathErr) {
                if (typeof completed === 'function') completed.apply(undefined, [realPathErr]);

                return;
              }

              self['delete'](target, completed);
            });
          } else if (stats.isFile()) {
            // File
            self.sftp.unlink(path, function (unlinkErr) {
              if (typeof completed === 'function') {
                completed.apply(undefined, [unlinkErr, [{ name: path, type: 'f' }]]);
              }
            });
          } else {
            // Directory
            self.list(path, true, function (listErr, list) {
              list.forEach(function (item) {
                item.depth = item.name.replace(/^\/+/, '').replace(/\/+$/).split('/').length;
              });
              list.sort(function (a, b) {
                if (a.depth === b.depth) {
                  return 0;
                }
                return a.depth > b.depth ? -1 : 1;
              });

              var done = 0;

              var e = function e() {
                self.sftp.rmdir(path, function (rmdirErr) {
                  if (typeof completed === 'function') {
                    completed.apply(undefined, [rmdirErr, list]);
                  }
                });
              };

              list.forEach(function (item) {
                ++done;
                var fn = item.type === 'd' || item.type === 'l' ? 'rmdir' : 'unlink';
                self.sftp[fn](item.name, function () {
                  if (--done === 0) ;

                  return e();
                });
              });

              if (list.length === 0) ;

              e();
            });
          }
        });
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }

      return self;
    }
  }, {
    key: 'chmod',
    value: function chmod(path, mode) {
      var completed = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

      var self = this;

      if (self.isConnected()) {
        self.sftp.chmod(path, parseInt(mode, 8), completed);
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }
    }
  }, {
    key: 'chown',
    value: function chown(path, uid, gid) {
      var completed = arguments.length <= 3 || arguments[3] === undefined ? function () {} : arguments[3];

      var self = this;

      if (self.isConnected()) {
        self.sftp.chown(path, uid, gid, completed);
      } else if (typeof completed === 'function') {
        completed.apply(undefined, ['Not connected']);
      }
    }
  }]);

  return ConnectorSFTP;
})(_connector2['default']);

exports['default'] = ConnectorSFTP;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9jb25uZWN0b3JzL3NmdHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O29CQUNOLE1BQU07Ozs7eUJBQ0QsY0FBYzs7Ozs2QkFDQyxrQkFBa0I7O3VCQUNOLFlBQVk7O0FBUDdELFdBQVcsQ0FBQzs7SUFTTixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsR0FDSTswQkFEakIsYUFBYTs7c0NBQ0YsSUFBSTtBQUFKLFVBQUk7OztBQUNqQiwrQkFGRSxhQUFhLDhDQUVOLElBQUksRUFBRTs7QUFFZixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQztHQUM5Qjs7ZUFQRyxhQUFhOztXQVNOLHVCQUFHO0FBQ1osVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixhQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssY0FBYyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEQ7OztXQUVNLGlCQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7QUFDdkIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDdkIsVUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDOztBQUV2RCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUM5QixVQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFD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Q0FBQztLQUNiOzs7V0FFSSxlQUFDLElBQUksRUFBRSxJQUFJLEVBQXdCO1VBQXRCLFNBQVMseURBQUcsWUFBTSxFQUFFOztBQUNwQyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO09BQ3JELE1BQU0sSUFBSSxPQUFPLFNBQVMsS0FBSyxVQUFVLEVBQUU7QUFDMUMsaUJBQVMsa0JBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO09BQ2pDO0tBQ0Y7OztXQUVJLGVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQXdCO1VBQXRCLFNBQVMseURBQUcsWUFBTSxFQUFFOztBQUN4QyxVQUFNLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWxCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO09BQzVDLE1BQU0sSUFBSSxPQUFPLFNBQVMsS0FBSyxVQUFVLEVBQUU7QUFDMUMsaUJBQVMsa0JBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO09BQ2pDO0tBQ0Y7OztTQW4wQkcsYUFBYTs7O3FCQXMwQkosYUFBYSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvY29ubmVjdG9ycy9zZnRwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBGUyBmcm9tICdmcy1wbHVzJztcbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNTSDIgZnJvbSAnc3NoMic7XG5pbXBvcnQgQ29ubmVjdG9yIGZyb20gJy4uL2Nvbm5lY3Rvcic7XG5pbXBvcnQgeyBpc0dlbmVyaWNVcGxvYWRFcnJvciB9IGZyb20gJy4uL25vdGlmaWNhdGlvbnMnO1xuaW1wb3J0IHsgdHJhdmVyc2VUcmVlLCBzdGF0c1RvUGVybWlzc2lvbnMgfSBmcm9tICcuLi9oZWxwZXJzJztcblxuY2xhc3MgQ29ubmVjdG9yU0ZUUCBleHRlbmRzIENvbm5lY3RvciB7XG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuc3NoMiA9IG51bGw7XG4gICAgdGhpcy5zZnRwID0gbnVsbDtcbiAgICB0aGlzLnN0YXR1cyA9ICdkaXNjb25uZWN0ZWQnO1xuICB9XG5cbiAgaXNDb25uZWN0ZWQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gc2VsZi5zdGF0dXMgIT09ICdkaXNjb25uZWN0ZWQnICYmIHNlbGYuc2Z0cDtcbiAgfVxuXG4gIGNvbm5lY3QoaW5mbywgY29tcGxldGVkKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmluZm8gPSBpbmZvO1xuICAgIHNlbGYuaW5mby5kZWJ1ZyA9IHRydWU7XG4gICAgc2VsZi5jdXN0b21GaWxlUGVybWlzc2lvbnMgPSBzZWxmLmluZm8uZmlsZVBlcm1pc3Npb25zO1xuXG4gICAgY29uc3QgZGVidWcgPSBzZWxmLmluZm8uZGVidWc7XG4gICAgY29uc3QgY29ubmVjdEluZm8gPSBPYmplY3QuYXNzaWduKHt9LCBzZWxmLmluZm8pO1xuXG4gICAgZGVsZXRlIGNvbm5lY3RJbmZvLmZpbGVQZXJtaXNzaW9ucztcblxuICAgIHNlbGYuc3RhdHVzID0gJ2Nvbm5lY3RpbmcnO1xuXG4gICAgc2VsZi5zc2gyID0gbmV3IFNTSDIoKTtcblxuICAgIHNlbGYuc3NoMi5vbignYmFubmVyJywgKG1zZykgPT4ge1xuICAgICAgc2VsZi5lbWl0KCdncmVldGluZycsIG1zZyk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnNzaDIub24oJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgc2VsZi5zc2gyLnNmdHAoKGVyciwgc2Z0cCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgc2VsZi5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYuaW5mby5yZW1vdGVTaGVsbCkge1xuICAgICAgICAgIHNlbGYuZW1pdCgnb3BlbmluZ1NoZWxsJywgc2VsZi5pbmZvLnJlbW90ZVNoZWxsKTtcblxuICAgICAgICAgIHNlbGYuc3NoMi5zaGVsbCgoc2hlbGxFcnIsIHN0cmVhbSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNoZWxsRXJyKSB7XG4gICAgICAgICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBzaGVsbEVycik7XG4gICAgICAgICAgICAgIHNlbGYuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN0cmVhbS5lbmQoYCR7c2VsZi5pbmZvLnJlbW90ZVNoZWxsfVxcbmV4aXRcXG5gKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLmluZm8ucmVtb3RlQ29tbWFuZCkge1xuICAgICAgICAgIHNlbGYuZW1pdCgnZXhlY3V0aW5nQ29tbWFuZCcsIHNlbGYuaW5mby5yZW1vdGVDb21tYW5kKTtcblxuICAgICAgICAgIHNlbGYuc3NoMi5leGVjKHNlbGYuaW5mby5yZW1vdGVDb21tYW5kLCAocmVtb3RlRXJyKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVtb3RlRXJyKSB7XG4gICAgICAgICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCByZW1vdGVFcnIpO1xuICAgICAgICAgICAgICBzZWxmLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc3RhdHVzID0gJ2Nvbm5lY3RlZCc7XG5cbiAgICAgICAgc2VsZi5zZnRwID0gc2Z0cDtcbiAgICAgICAgc2VsZi5zZnRwLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgICAgc2VsZi5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgc2VsZi5lbWl0KCdlbmRlZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLmVtaXQoJ2Nvbm5lY3RlZCcpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29tcGxldGVkLmFwcGx5KHNlbGYsIFtdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzZWxmLnNzaDIub24oJ2VuZCcsICgpID0+IHtcbiAgICAgIHNlbGYuZGlzY29ubmVjdCgpO1xuICAgICAgc2VsZi5lbWl0KCdlbmRlZCcpO1xuICAgIH0pO1xuXG4gICAgc2VsZi5zc2gyLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIHNlbGYuZGlzY29ubmVjdCgpO1xuICAgICAgc2VsZi5lbWl0KCdjbG9zZWQnKTtcbiAgICB9KTtcblxuICAgIHNlbGYuc3NoMi5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICBzZWxmLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9KTtcblxuICAgIHNlbGYuc3NoMi5vbignZGVidWcnLCAoc3RyKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGRlYnVnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRlYnVnKC4uLltzdHJdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNlbGYuc3NoMi5vbigna2V5Ym9hcmQtaW50ZXJhY3RpdmUnLCAobmFtZSwgaW5zdHJ1Y3Rpb25zLCBpbnN0cnVjdGlvbnNMYW5nLCBwcm9tcHRzLCBmaW5pc2gpID0+IHtcbiAgICAgIGZpbmlzaChbc2VsZi5pbmZvLnZlcmlmeUNvZGVdKTtcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICBzZWxmLnNzaDIuY29ubmVjdChjb25uZWN0SW5mbyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1NGVFAgY29ubmVjdGlvbiBhdHRlbXB0IGZhaWxlZCcsIHtcbiAgICAgICAgZGV0YWlsOiBlcnIsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBkaXNjb25uZWN0KGNvbXBsZXRlZCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5zdGF0dXMgPSAnZGlzY29ubmVjdGVkJztcblxuICAgIGlmIChzZWxmLnNmdHApIHtcbiAgICAgIHNlbGYuc2Z0cC5lbmQoKTtcbiAgICAgIHNlbGYuc2Z0cCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc3NoMikge1xuICAgICAgc2VsZi5zc2gyLmVuZCgpO1xuICAgICAgc2VsZi5zc2gyID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcGxldGVkKC4uLltdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGFib3J0KGNvbXBsZXRlZCkge1xuICAgIC8vIFRPRE8gZmluZCBhIHdheSB0byBhYm9ydCBjdXJyZW50IG9wZXJhdGlvblxuXG4gICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0KHBhdGgsIHJlY3Vyc2l2ZSwgY29tcGxldGVkKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXNlbGYuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IFtdO1xuICAgIGxldCBkaWdnID0gMDtcblxuICAgIGNvbnN0IGNhbGxDb21wbGV0ZWQgPSAoKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgY29tcGxldGVkKC4uLltudWxsLCBsaXN0XSk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9uZURpckNvbXBsZXRlZCA9ICgpID0+IHtcbiAgICAgIGlmICgtLWRpZ2cgPT09IDApIGNhbGxDb21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbGlzdERpciA9IChsaXN0UGF0aCkgPT4ge1xuICAgICAgZGlnZysrO1xuXG4gICAgICBpZiAoZGlnZyA+IDUwMCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVjdXJzaW9uIGRlcHRoIG92ZXIgNTAwIScpO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnNmdHAucmVhZGRpcihsaXN0UGF0aCwgKGVyciwgbGkpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxDb21wbGV0ZWQoKTtcbiAgICAgICAgbGV0IGZpbGVzTGVmdCA9IGxpLmxlbmd0aDtcblxuICAgICAgICBpZiAoZmlsZXNMZWZ0ID09PSAwKSByZXR1cm4gY2FsbENvbXBsZXRlZCgpO1xuXG4gICAgICAgIGxpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAvLyBzeW1saW5rc1xuICAgICAgICAgIGlmIChpdGVtLmF0dHJzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IHdlIG9ubHkgZm9sbG93IG9uZSBzeW1saW5rIGRvd24gaGVyZSFcbiAgICAgICAgICAgIC8vIHN5bWxpbmsgLT4gc3ltbGluayAtPiBmaWxlIHdvbid0IHdvcmshXG4gICAgICAgICAgICBjb25zdCBmbmFtZSA9IFBhdGguam9pbihsaXN0UGF0aCwgaXRlbS5maWxlbmFtZSkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgICAgICAgICBzZWxmLnNmdHAucmVhbHBhdGgoZm5hbWUsIChyZWFsUGF0aGVyciwgdGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZWFsUGF0aGVycikge1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQ291bGQgbm90IGNhbGwgcmVhbHBhdGggZm9yIHN5bWxpbmsnLCB7XG4gICAgICAgICAgICAgICAgICBkZXRhaWw6IHJlYWxQYXRoZXJyLFxuICAgICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKC0tZmlsZXNMZWZ0ID09PSAwKSBvbmVEaXJDb21wbGV0ZWQoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHNlbGYuc2Z0cC5zdGF0KHRhcmdldCwgKHN0YXRFcnIsIHN0YXRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRFcnIpIHtcbiAgICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQ291bGQgbm90IGNvcnJlY3RseSByZXNvbHZlIHN5bWxpbmsnLCB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbDogYCR7Zm5hbWV9IC0+ICR7dGFyZ2V0fWAsXG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICBpZiAoLS1maWxlc0xlZnQgPT09IDApIG9uZURpckNvbXBsZXRlZCgpO1xuXG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBmbmFtZSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IHN0YXRzLmlzRmlsZSgpID8gJ2YnIDogJ2QnLFxuICAgICAgICAgICAgICAgICAgc2l6ZTogc3RhdHMuc2l6ZSxcbiAgICAgICAgICAgICAgICAgIGdyb3VwOiBzdGF0cy5naWQsXG4gICAgICAgICAgICAgICAgICBvd25lcjogc3RhdHMudWlkLFxuICAgICAgICAgICAgICAgICAgcmlnaHRzOiBzdGF0c1RvUGVybWlzc2lvbnMoc3RhdHMpLFxuICAgICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZW50cnkuZGF0ZS5zZXRUaW1lKHN0YXRzLm10aW1lICogMTAwMCk7XG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVudHJ5KTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWN1cnNpdmUgJiYgZW50cnkudHlwZSA9PT0gJ2QnKSBsaXN0RGlyKGVudHJ5Lm5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICgtLWZpbGVzTGVmdCA9PT0gMCkgb25lRGlyQ29tcGxldGVkKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIHJlZ3VsYXIgZmlsZXMgJiBkaXJzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0ge1xuICAgICAgICAgICAgICBuYW1lOiBQYXRoLmpvaW4obGlzdFBhdGgsIGl0ZW0uZmlsZW5hbWUpLnJlcGxhY2UoL1xcXFwvZywgJy8nKSxcbiAgICAgICAgICAgICAgdHlwZTogaXRlbS5hdHRycy5pc0ZpbGUoKSA/ICdmJyA6ICdkJyxcbiAgICAgICAgICAgICAgc2l6ZTogaXRlbS5hdHRycy5zaXplLFxuICAgICAgICAgICAgICBncm91cDogaXRlbS5hdHRycy5naWQsXG4gICAgICAgICAgICAgIG93bmVyOiBpdGVtLmF0dHJzLnVpZCxcbiAgICAgICAgICAgICAgcmlnaHRzOiBzdGF0c1RvUGVybWlzc2lvbnMoaXRlbS5hdHRycyksXG4gICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlbnRyeS5kYXRlLnNldFRpbWUoaXRlbS5hdHRycy5tdGltZSAqIDEwMDApO1xuICAgICAgICAgICAgbGlzdC5wdXNoKGVudHJ5KTtcblxuICAgICAgICAgICAgaWYgKHJlY3Vyc2l2ZSAmJiBlbnRyeS50eXBlID09PSAnZCcpIGxpc3REaXIoZW50cnkubmFtZSk7XG4gICAgICAgICAgICBpZiAoLS1maWxlc0xlZnQgPT09IDApIG9uZURpckNvbXBsZXRlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGlzdERpcihwYXRoKTtcbiAgfVxuXG4gIGdldChwYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MsIHN5bWxpbmtQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgbG9jYWwgPSBzZWxmLmNsaWVudC50b0xvY2FsKHN5bWxpbmtQYXRoIHx8IHBhdGgpO1xuXG4gICAgaWYgKCFzZWxmLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSBjb21wbGV0ZWQoLi4uWydOb3QgY29ubmVjdGVkJ10pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGYuc2Z0cC5sc3RhdChwYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgY29tcGxldGVkKC4uLltlcnJdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICBzZWxmLnNmdHAucmVhbHBhdGgocGF0aCwgKHJlYWxQYXRoZXJyLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICBpZiAocmVhbFBhdGhlcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSBjb21wbGV0ZWQoLi4uW3JlYWxQYXRoZXJyXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZi5nZXQodGFyZ2V0LCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MsIHBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgICAgLy8gRmlsZVxuICAgICAgICBGUy5tYWtlVHJlZVN5bmMoUGF0aC5kaXJuYW1lKGxvY2FsKSk7XG5cbiAgICAgICAgc2VsZi5zZnRwLmZhc3RHZXQocGF0aCwgbG9jYWwsIHtcbiAgICAgICAgICBzdGVwKHJlYWQsIGNodW5rLCBzaXplKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7IHByb2dyZXNzKC4uLltyZWFkIC8gc2l6ZV0pOyB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgKGZhc3RHZXRFcnIpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgeyBjb21wbGV0ZWQoLi4uW2Zhc3RHZXRFcnJdKTsgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERpcmVjdG9yeVxuICAgICAgICBzZWxmLmxpc3QocGF0aCwgcmVjdXJzaXZlLCAobGlzdEVyciwgbGlzdCkgPT4ge1xuICAgICAgICAgIGxpc3QudW5zaGlmdCh7IG5hbWU6IHBhdGgsIHR5cGU6ICdkJyB9KTtcblxuICAgICAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaXRlbS5kZXB0aCA9IGl0ZW0ubmFtZS5yZXBsYWNlKC9eXFwvKy8sICcnKS5yZXBsYWNlKC9cXC8rJC8pLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbGlzdC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5kZXB0aCA9PT0gYi5kZXB0aCkgcmV0dXJuIDA7XG4gICAgICAgICAgICByZXR1cm4gYS5kZXB0aCA+IGIuZGVwdGggPyAxIDogLTE7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgICAgICAgIGNvbnN0IHRvdGFsID0gbGlzdC5sZW5ndGg7XG4gICAgICAgICAgbGV0IGkgPSAtMTtcbiAgICAgICAgICBjb25zdCBlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHsgY29tcGxldGVkKC4uLltlcnJvciwgbGlzdF0pOyB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG4gPSAoKSA9PiB7XG4gICAgICAgICAgICArK2k7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7IHByb2dyZXNzKC4uLltpIC8gdG90YWxdKTsgfVxuXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gbGlzdC5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuIGUoKTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b0xvY2FsID0gc2VsZi5jbGllbnQudG9Mb2NhbChpdGVtLm5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcpIHtcbiAgICAgICAgICAgICAgLy8gbWtkaXJwKHRvTG9jYWwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgRlMubWFrZVRyZWUodG9Mb2NhbCwgKHRyZWVFcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHJlZUVycikgeyBlcnJvciA9IHRyZWVFcnI7IH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5zZnRwLmZhc3RHZXQoaXRlbS5uYW1lLCB0b0xvY2FsLCB7XG4gICAgICAgICAgICAgICAgc3RlcChyZWFkLCBjaHVuaywgc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyguLi5bKGkgLyB0b3RhbCkgKyAocmVhZCAvIHNpemUgLyB0b3RhbCldKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LCAoZmFzdEdldEVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmYXN0R2V0RXJyKSB7IGVycm9yID0gZmFzdEdldEVycjsgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIG4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRUbyhyZW1vdGVQYXRoLCB0YXJnZXRQYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MsIHN5bWxpbmtQYXRoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgbG9jYWwgPSB0YXJnZXRQYXRoO1xuXG4gICAgaWYgKCFzZWxmLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSBjb21wbGV0ZWQoLi4uWydOb3QgY29ubmVjdGVkJ10pO1xuICAgIH1cblxuICAgIHNlbGYuc2Z0cC5sc3RhdChyZW1vdGVQYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgY29tcGxldGVkKC4uLltlcnJdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdHMuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgICBzZWxmLnNmdHAucmVhbHBhdGgocmVtb3RlUGF0aCwgKHJlYWxQYXRoZXJyLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICBpZiAocmVhbFBhdGhlcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSBjb21wbGV0ZWQoLi4uW3JlYWxQYXRoZXJyXSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZi5nZXQodGFyZ2V0LCByZWN1cnNpdmUsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MsIHJlbW90ZVBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHMuaXNGaWxlKCkpIHtcbiAgICAgICAgLy8gRmlsZVxuICAgICAgICBGUy5tYWtlVHJlZVN5bmMoUGF0aC5kaXJuYW1lKGxvY2FsKSk7XG5cbiAgICAgICAgc2VsZi5zZnRwLmZhc3RHZXQocmVtb3RlUGF0aCwgbG9jYWwsIHtcbiAgICAgICAgICBzdGVwKHJlYWQsIGNodW5rLCBzaXplKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7IHByb2dyZXNzKC4uLltyZWFkIC8gc2l6ZV0pOyB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSwgKGZhc3RHZXRFcnIpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgeyBjb21wbGV0ZWQoLi4uW2Zhc3RHZXRFcnJdKTsgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERpcmVjdG9yeVxuICAgICAgICBzZWxmLmxpc3QocmVtb3RlUGF0aCwgcmVjdXJzaXZlLCAobGlzdEVyciwgbGlzdCkgPT4ge1xuICAgICAgICAgIGxpc3QudW5zaGlmdCh7IG5hbWU6IHJlbW90ZVBhdGgsIHR5cGU6ICdkJyB9KTtcblxuICAgICAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgaXRlbS5kZXB0aCA9IGl0ZW0ubmFtZS5yZXBsYWNlKC9eXFwvKy8sICcnKS5yZXBsYWNlKC9cXC8rJC8pLnNwbGl0KCcvJykubGVuZ3RoO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbGlzdC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICBpZiAoYS5kZXB0aCA9PT0gYi5kZXB0aCkgcmV0dXJuIDA7XG4gICAgICAgICAgICByZXR1cm4gYS5kZXB0aCA+IGIuZGVwdGggPyAxIDogLTE7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgICAgICAgIGNvbnN0IHRvdGFsID0gbGlzdC5sZW5ndGg7XG4gICAgICAgICAgbGV0IGkgPSAtMTtcbiAgICAgICAgICBjb25zdCBlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHsgY29tcGxldGVkKC4uLltlcnJvciwgbGlzdF0pOyB9XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IG4gPSAoKSA9PiB7XG4gICAgICAgICAgICArK2k7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7IHByb2dyZXNzKC4uLltpIC8gdG90YWxdKTsgfVxuXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gbGlzdC5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnIHx8IGl0ZW0gPT09IG51bGwpIHsgcmV0dXJuIGUoKTsgfVxuXG4gICAgICAgICAgICBjb25zdCB0b1RhcmdldCA9IFBhdGguZGlybmFtZSh0YXJnZXRQYXRoLnJlcGxhY2Uoc2VsZi5jbGllbnQuZ2V0UHJvamVjdFBhdGgoKSwgJycpKTtcbiAgICAgICAgICAgIGNvbnN0IHRvTG9jYWwgPSBzZWxmLmNsaWVudC50b0xvY2FsKGl0ZW0ubmFtZSwgdG9UYXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcpIHtcbiAgICAgICAgICAgICAgLy8gbWtkaXJwKHRvTG9jYWwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgRlMubWFrZVRyZWUodG9Mb2NhbCwgKHRyZWVFcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHJlZUVycikgeyBlcnJvciA9IHRyZWVFcnI7IH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5zZnRwLmZhc3RHZXQoaXRlbS5uYW1lLCB0b0xvY2FsLCB7XG4gICAgICAgICAgICAgICAgc3RlcChyZWFkLCBjaHVuaywgc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyguLi5bKGkgLyB0b3RhbCkgKyAocmVhZCAvIHNpemUgLyB0b3RhbCldKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LCAoZmFzdEdldEVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmYXN0R2V0RXJyKSB7IGVycm9yID0gZmFzdEdldEVycjsgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIG4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdXREaXJlY3QoZmlsZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGZpbGVPYmplY3QgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGxvY2FsUGF0aDogbnVsbCxcbiAgICAgIHJlbW90ZVBhdGg6IG51bGwsXG4gICAgICBjYWxsYmFjazogbnVsbCxcbiAgICAgIHByb2dyZXNzOiBudWxsLFxuICAgICAgaTogMCxcbiAgICAgIHRvdGFsOiAwLFxuICAgIH0sIGZpbGUpO1xuXG4gICAgY29uc3Qgc3RhdHMgPSAoZXJyLCBhdHRycykgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgICBpZiAodGhpcy5jdXN0b21GaWxlUGVybWlzc2lvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5tb2RlID0gcGFyc2VJbnQoc2VsZi5jdXN0b21GaWxlUGVybWlzc2lvbnMsIDgpO1xuICAgICAgfSBlbHNlIGlmIChlcnIpIHtcbiAgICAgICAgLy8gdXNpbmcgdGhlIGRlZmF1bHQgMDY0NFxuICAgICAgICBvcHRpb25zLm1vZGUgPSAwbzA2NDQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2luZyB0aGUgb3JpZ2luYWwgcGVybWlzc2lvbnMgZnJvbSB0aGUgcmVtb3RlXG4gICAgICAgIG9wdGlvbnMubW9kZSA9IGF0dHJzLm1vZGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlYWRTdHJlYW0gPSBGUy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVPYmplY3QubG9jYWxQYXRoKTtcbiAgICAgIGNvbnN0IHdyaXRlU3RyZWFtID0gc2VsZi5zZnRwLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVPYmplY3QucmVtb3RlUGF0aCwgb3B0aW9ucyk7XG4gICAgICBjb25zdCBmaWxlU2l6ZSA9IEZTLnN0YXRTeW5jKGZpbGVPYmplY3QubG9jYWxQYXRoKS5zaXplOyAvLyB1c2VkIGZvciBzZXR0aW5nIHByb2dyZXNzIGJhclxuXG4gICAgICBsZXQgdG90YWxSZWFkID0gMDsgLy8gdXNlZCBmb3Igc2V0dGluZyBwcm9ncmVzcyBiYXJcblxuICAgICAgZnVuY3Rpb24gYXBwbHlQcm9ncmVzcygpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9ncmVzcyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICAgICAgICBpZiAoZmlsZU9iamVjdC50b3RhbCAhPSBudWxsICYmIGZpbGVPYmplY3QuaSAhPSBudWxsKSB7XG4gICAgICAgICAgZmlsZU9iamVjdC5wcm9ncmVzcyguLi5bKGZpbGVPYmplY3QuaSAvIGZpbGVPYmplY3QudG90YWwpICsgKHRvdGFsUmVhZCAvIGZpbGVTaXplIC8gZmlsZU9iamVjdC50b3RhbCldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaWxlT2JqZWN0LnByb2dyZXNzKC4uLlt0b3RhbFJlYWQgLyBmaWxlU2l6ZV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHdyaXRlU3RyZWFtLm9uKCdmaW5pc2gnLCAoKSA9PiB7XG4gICAgICAgIGFwcGx5UHJvZ3Jlc3MoKTsgLy8gY29tcGxldGVzIHRoZSBwcm9ncmVzcyBiYXJcblxuICAgICAgICByZXR1cm4gZmlsZU9iamVjdC5lKCk7XG4gICAgICB9KS5vbignZXJyb3InLCAod3JpdGVFcnIpID0+IHtcbiAgICAgICAgY29uc3QgaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChmaWxlT2JqZWN0LCAnZXJyJyk7XG5cbiAgICAgICAgaWYgKCFoYXNQcm9wICYmICh3cml0ZUVyci5tZXNzYWdlID09PSAnTm8gc3VjaCBmaWxlJyB8fCB3cml0ZUVyci5tZXNzYWdlID09PSAnTk9fU1VDSF9GSUxFJykpIHtcbiAgICAgICAgICBzZWxmLm1rZGlyKFBhdGguZGlybmFtZShmaWxlT2JqZWN0LnJlbW90ZVBhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKSwgdHJ1ZSwgKGRpckVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGRpckVycikge1xuICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IHdyaXRlRXJyLm1lc3NhZ2UgfHwgZGlyRXJyO1xuXG4gICAgICAgICAgICAgIGlzR2VuZXJpY1VwbG9hZEVycm9yKGVycm9yKTtcblxuICAgICAgICAgICAgICByZXR1cm4gZGlyRXJyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnB1dERpcmVjdChPYmplY3QuYXNzaWduKHt9LCBmaWxlT2JqZWN0LCB7IGRpckVyciB9KSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXJyLCAnbWVzc2FnZScpKSB7XG4gICAgICAgICAgaXNHZW5lcmljVXBsb2FkRXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3Iod3JpdGVFcnIpOyAvLyBVc2VmdWwgZm9yIGRlYnVnZ2luZ1xuICAgICAgICAgIGlzR2VuZXJpY1VwbG9hZEVycm9yKHdyaXRlRXJyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlYWRTdHJlYW0ub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICAgICAgdG90YWxSZWFkICs9IGNodW5rLmxlbmd0aDtcblxuICAgICAgICBpZiAodG90YWxSZWFkID09PSBmaWxlU2l6ZSkgcmV0dXJuOyAvLyBsZXQgd3JpdGVTdHJlYW0ub24oXCJmaW5pc2hcIikgY29tcGxldGUgdGhlIHByb2dyZXNzIGJhclxuXG4gICAgICAgIGFwcGx5UHJvZ3Jlc3MoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZWFkU3RyZWFtLnBpcGUod3JpdGVTdHJlYW0pO1xuICAgIH07XG5cbiAgICBzZWxmLnNmdHAuc3RhdChmaWxlT2JqZWN0LnJlbW90ZVBhdGgsIHN0YXRzKTtcbiAgfVxuXG4gIHB1dFRvKHNvdXJjZVBhdGgsIHRhcmdldFBhdGgsIGNvbXBsZXRlZCwgcHJvZ3Jlc3MpIHtcbiAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICBpZiAoRlMuaXNGaWxlU3luYyhzb3VyY2VQYXRoKSkge1xuICAgICAgICBjb25zdCBlID0gKGVycikgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb21wbGV0ZWQoLi4uW2VyciB8fCBudWxsLCBbeyBuYW1lOiBzb3VyY2VQYXRoLCB0eXBlOiAnZicgfV1dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wdXREaXJlY3Qoe1xuICAgICAgICAgIGxvY2FsUGF0aDogc291cmNlUGF0aCxcbiAgICAgICAgICByZW1vdGVQYXRoOiB0YXJnZXRQYXRoLFxuICAgICAgICAgIHByb2dyZXNzLFxuICAgICAgICAgIGUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhdmVyc2VUcmVlKHNvdXJjZVBhdGgsIChsaXN0KSA9PiB7XG4gICAgICAgICAgdGhpcy5ta2Rpcih0YXJnZXRQYXRoLCB0cnVlLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IC0xO1xuICAgICAgICAgICAgY29uc3QgdG90YWwgPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGUgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHsgY29tcGxldGVkKC4uLltlcnJvciwgbGlzdF0pOyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgbiA9IChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoKytpID49IGxpc3QubGVuZ3RoKSByZXR1cm4gZShlcnJvcik7XG5cbiAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGxpc3RbaV07XG4gICAgICAgICAgICAgIGNvbnN0IHRvUmVtb3RlID0gdGhpcy5jbGllbnQudG9SZW1vdGUoaXRlbS5uYW1lKTtcblxuICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNmdHAubWtkaXIodG9SZW1vdGUsIHt9LCAodHJhdkRpcmVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHRyYXZEaXJlcnIpIHsgZXJyb3IgPSB0cmF2RGlyZXJyOyB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucHV0RGlyZWN0KHtcbiAgICAgICAgICAgICAgICAgIGxvY2FsUGF0aDogaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgICAgcmVtb3RlUGF0aDogdG9SZW1vdGUsXG4gICAgICAgICAgICAgICAgICBwcm9ncmVzcyxcbiAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICB0b3RhbCxcbiAgICAgICAgICAgICAgICAgIGUocHV0RXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwdXRFcnIpIGVycm9yID0gcHV0RXJyO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdXQocGF0aCwgY29tcGxldGVkLCBwcm9ncmVzcykge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHJlbW90ZSA9IHNlbGYuY2xpZW50LnRvUmVtb3RlKHBhdGgpO1xuXG4gICAgaWYgKHNlbGYuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgLy8gRmlsZVxuICAgICAgaWYgKEZTLmlzRmlsZVN5bmMocGF0aCkpIHtcbiAgICAgICAgY29uc3QgZSA9IChlcnIpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29tcGxldGVkKC4uLltlcnIgfHwgbnVsbCwgW3sgbmFtZTogcGF0aCwgdHlwZTogJ2YnIH1dXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYucHV0RGlyZWN0KHtcbiAgICAgICAgICBsb2NhbFBhdGg6IHBhdGgsXG4gICAgICAgICAgcmVtb3RlUGF0aDogcmVtb3RlLFxuICAgICAgICAgIHByb2dyZXNzLFxuICAgICAgICAgIGUsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHsgLy8gRm9sZGVyXG4gICAgICAgIHRyYXZlcnNlVHJlZShwYXRoLCAobGlzdCkgPT4ge1xuICAgICAgICAgIHNlbGYubWtkaXIocmVtb3RlLCB0cnVlLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaSA9IC0xO1xuICAgICAgICAgICAgY29uc3QgdG90YWwgPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IGUgPSAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHsgY29tcGxldGVkKC4uLltlcnJvciwgbGlzdF0pOyB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgbiA9IChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoKytpID49IGxpc3QubGVuZ3RoKSByZXR1cm4gZShlcnJvcik7XG5cbiAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGxpc3RbaV07XG4gICAgICAgICAgICAgIGNvbnN0IHRvUmVtb3RlID0gc2VsZi5jbGllbnQudG9SZW1vdGUoaXRlbS5uYW1lKTtcblxuICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNmdHAubWtkaXIodG9SZW1vdGUsIHt9LCAodHJhdkRpcmVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHRyYXZEaXJlcnIpIHsgZXJyb3IgPSB0cmF2RGlyZXJyOyB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYucHV0RGlyZWN0KHtcbiAgICAgICAgICAgICAgICAgIGxvY2FsUGF0aDogaXRlbS5uYW1lLFxuICAgICAgICAgICAgICAgICAgcmVtb3RlUGF0aDogdG9SZW1vdGUsXG4gICAgICAgICAgICAgICAgICBwcm9ncmVzcyxcbiAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICB0b3RhbCxcbiAgICAgICAgICAgICAgICAgIGUocHV0RXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwdXRFcnIpIGVycm9yID0gcHV0RXJyO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBta2RpcihwYXRoLCByZWN1cnNpdmUsIGNvbXBsZXRlZCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHJlbW90ZXMgPSBwYXRoLnJlcGxhY2UoL15cXC8rLywgJycpLnJlcGxhY2UoL1xcLyskLywgJycpLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgZGlycyA9IFtgLyR7cmVtb3Rlcy5zbGljZSgwLCByZW1vdGVzLmxlbmd0aCkuam9pbignLycpfWBdO1xuXG4gICAgaWYgKHNlbGYuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgaWYgKHJlY3Vyc2l2ZSkge1xuICAgICAgICBmb3IgKGxldCBhID0gcmVtb3Rlcy5sZW5ndGggLSAxOyBhID4gMDsgLS1hKSB7XG4gICAgICAgICAgZGlycy51bnNoaWZ0KGAvJHtyZW1vdGVzLnNsaWNlKDAsIGEpLmpvaW4oJy8nKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBkaXIgPSBkaXJzLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGxhc3QgPSBkaXJzLmxlbmd0aCA9PT0gMDtcblxuICAgICAgICBzZWxmLnNmdHAubWtkaXIoZGlyLCB7fSwgKGVycikgPT4ge1xuICAgICAgICAgIGlmIChsYXN0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICBjb21wbGV0ZWQoLi4uW2VyciB8fCBudWxsXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG4oKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBta2ZpbGUocGF0aCwgY29tcGxldGVkKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgbG9jYWwgPSBzZWxmLmNsaWVudC50b0xvY2FsKHBhdGgpO1xuICAgIGNvbnN0IGVtcHR5ID0gbmV3IEJ1ZmZlcignJywgJ3V0ZjgnKTtcblxuICAgIGlmIChzZWxmLmlzQ29ubmVjdGVkKCkpIHtcbiAgICAgIHNlbGYuc2Z0cC5vcGVuKHBhdGgsICd3Jywge30sIChlcnIsIGhhbmRsZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHsgY29tcGxldGVkKC4uLltlcnJdKTsgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuc2Z0cC53cml0ZShoYW5kbGUsIGVtcHR5LCAwLCAwLCAwLCAod3JpdGVFcnIpID0+IHtcbiAgICAgICAgICBpZiAod3JpdGVFcnIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7IGNvbXBsZXRlZCguLi5bd3JpdGVFcnJdKTsgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG1rZGlycChQYXRoLmRpcm5hbWUobG9jYWwpLCBmdW5jdGlvbiAoZXJyMSkge1xuICAgICAgICAgIEZTLm1ha2VUcmVlKFBhdGguZGlybmFtZShsb2NhbCksIChlcnIxKSA9PiB7XG4gICAgICAgICAgICBGUy53cml0ZUZpbGUobG9jYWwsIGVtcHR5LCAoZXJyMikgPT4ge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZCguLi5bZXJyMSB8fCBlcnIyXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcGxldGVkKC4uLlsnTm90IGNvbm5lY3RlZCddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIHJlbmFtZShzb3VyY2UsIGRlc3QsIGNvbXBsZXRlZCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgc2VsZi5zZnRwLnJlbmFtZShzb3VyY2UsIGRlc3QsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7IGNvbXBsZXRlZCguLi5bZXJyXSk7IH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBGUy5yZW5hbWUoc2VsZi5jbGllbnQudG9Mb2NhbChzb3VyY2UpLCBzZWxmLmNsaWVudC50b0xvY2FsKGRlc3QpLCAobG9jYWxFcnIpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7IGNvbXBsZXRlZCguLi5bbG9jYWxFcnJdKTsgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBsZXRlZCguLi5bJ05vdCBjb25uZWN0ZWQnXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBkZWxldGUocGF0aCwgY29tcGxldGVkKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICBzZWxmLnNmdHAuc3RhdChwYXRoLCAoZXJyLCBzdGF0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIGNvbXBsZXRlZCguLi5bZXJyXSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRzLmlzU3ltYm9saWNMaW5rKCkpIHtcbiAgICAgICAgICBzZWxmLnNmdHAucmVhbHBhdGgocGF0aCwgKHJlYWxQYXRoRXJyLCB0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZWFsUGF0aEVycikge1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykgY29tcGxldGVkKC4uLltyZWFsUGF0aEVycl0pO1xuXG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5kZWxldGUodGFyZ2V0LCBjb21wbGV0ZWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgICAgLy8gRmlsZVxuICAgICAgICAgIHNlbGYuc2Z0cC51bmxpbmsocGF0aCwgKHVubGlua0VycikgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb21wbGV0ZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgY29tcGxldGVkKC4uLlt1bmxpbmtFcnIsIFt7IG5hbWU6IHBhdGgsIHR5cGU6ICdmJyB9XV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERpcmVjdG9yeVxuICAgICAgICAgIHNlbGYubGlzdChwYXRoLCB0cnVlLCAobGlzdEVyciwgbGlzdCkgPT4ge1xuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7IGl0ZW0uZGVwdGggPSBpdGVtLm5hbWUucmVwbGFjZSgvXlxcLysvLCAnJykucmVwbGFjZSgvXFwvKyQvKS5zcGxpdCgnLycpLmxlbmd0aDsgfSk7XG4gICAgICAgICAgICBsaXN0LnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGEuZGVwdGggPT09IGIuZGVwdGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgICAgICAgcmV0dXJuIGEuZGVwdGggPiBiLmRlcHRoID8gLTEgOiAxO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBkb25lID0gMDtcblxuICAgICAgICAgICAgY29uc3QgZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgc2VsZi5zZnRwLnJtZGlyKHBhdGgsIChybWRpckVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICBjb21wbGV0ZWQoLi4uW3JtZGlyRXJyLCBsaXN0XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICArK2RvbmU7XG4gICAgICAgICAgICAgIGNvbnN0IGZuID0gaXRlbS50eXBlID09PSAnZCcgfHwgaXRlbS50eXBlID09PSAnbCcgPyAncm1kaXInIDogJ3VubGluayc7XG4gICAgICAgICAgICAgIHNlbGYuc2Z0cFtmbl0oaXRlbS5uYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKC0tZG9uZSA9PT0gMCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZSgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDApO1xuXG4gICAgICAgICAgICBlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcGxldGVkKC4uLlsnTm90IGNvbm5lY3RlZCddKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGNobW9kKHBhdGgsIG1vZGUsIGNvbXBsZXRlZCA9ICgpID0+IHt9KSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICBzZWxmLnNmdHAuY2htb2QocGF0aCwgcGFyc2VJbnQobW9kZSwgOCksIGNvbXBsZXRlZCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29tcGxldGVkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb21wbGV0ZWQoLi4uWydOb3QgY29ubmVjdGVkJ10pO1xuICAgIH1cbiAgfVxuXG4gIGNob3duKHBhdGgsIHVpZCwgZ2lkLCBjb21wbGV0ZWQgPSAoKSA9PiB7fSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgc2VsZi5zZnRwLmNob3duKHBhdGgsIHVpZCwgZ2lkLCBjb21wbGV0ZWQpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbXBsZXRlZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29tcGxldGVkKC4uLlsnTm90IGNvbm5lY3RlZCddKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29ubmVjdG9yU0ZUUDtcbiJdfQ==