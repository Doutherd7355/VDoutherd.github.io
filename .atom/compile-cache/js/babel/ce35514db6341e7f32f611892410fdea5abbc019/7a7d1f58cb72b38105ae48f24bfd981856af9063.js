Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSpacePenViews = require('atom-space-pen-views');

var _helpers = require('../helpers');

var _viewsDirectoryView = require('../views/directory-view');

var _viewsDirectoryView2 = _interopRequireDefault(_viewsDirectoryView);

var _viewsPermissionView = require('../views/permission-view');

var _viewsPermissionView2 = _interopRequireDefault(_viewsPermissionView);

var _dialogsAddDialog = require('../dialogs/add-dialog');

var _dialogsAddDialog2 = _interopRequireDefault(_dialogsAddDialog);

var _dialogsMoveDialog = require('../dialogs/move-dialog');

var _dialogsMoveDialog2 = _interopRequireDefault(_dialogsMoveDialog);

var _dialogsNavigateToDialog = require('../dialogs/navigate-to-dialog');

var _dialogsNavigateToDialog2 = _interopRequireDefault(_dialogsNavigateToDialog);

'use babel';

var init = function init() {
  var client = atom.project.remoteftp;
  var remoteftp = atom.project.remoteftpMain;

  var getRemotes = function getRemotes(errMessage) {
    var remotes = remoteftp.treeView.getSelected();

    if (!remotes || remotes.length === 0) {
      atom.notifications.addWarning('Remote FTP: ' + errMessage, {
        dismissable: false
      });
      return false;
    }

    return remotes;
  };

  var createConfig = function createConfig(obj) {
    if (!(0, _helpers.hasProject)()) return;

    var ftpConfigPath = client.getConfigPath();
    var fileExists = _fsPlus2['default'].existsSync(ftpConfigPath);
    var json = JSON.stringify(obj, null, 4);

    var writeFile = true;
    if (fileExists) {
      writeFile = atom.confirm({
        message: 'Do you want to overwrite .ftpconfig?',
        detailedMessage: 'You are overwriting ' + ftpConfigPath,
        buttons: {
          Yes: function Yes() {
            return true;
          },
          No: function No() {
            return false;
          }
        }
      });
    }

    if (writeFile) {
      _fsPlus2['default'].writeFile(ftpConfigPath, json, function (err) {
        if (!err) atom.workspace.open(ftpConfigPath);
      });
    }
  };

  var commands = {
    'remote-ftp:create-ftp-config': {
      enabled: true,
      command: function command() {
        createConfig({
          protocol: 'ftp',
          host: 'example.com',
          port: 21,
          user: 'user',
          pass: 'pass',
          promptForPass: false,
          remote: '/',
          local: '',
          secure: false,
          secureOptions: null,
          connTimeout: 10000,
          pasvTimeout: 10000,
          keepalive: 10000,
          watch: [],
          watchTimeout: 500
        });
      }
    },
    'remote-ftp:create-sftp-config': {
      enabled: true,
      command: function command() {
        createConfig({
          protocol: 'sftp',
          host: 'example.com',
          port: 22,
          user: 'user',
          pass: 'pass',
          promptForPass: false,
          remote: '/',
          local: '',
          agent: '',
          privatekey: '',
          passphrase: '',
          hosthash: '',
          ignorehost: true,
          connTimeout: 10000,
          keepalive: 10000,
          keyboardInteractive: false,
          keyboardInteractiveForPass: false,
          remoteCommand: '',
          remoteShell: '',
          watch: [],
          watchTimeout: 500
        });
      }
    },
    'remote-ftp:create-ignore-file': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var fileContents = ['.ftpconfig', '.ftpconfig.cson', '.ftpignore', 'id_rsa', '.DS_Store', '.git'];
        var ftpIgnorePath = client.getFilePath('./.ftpignore');

        _fsPlus2['default'].writeFile(ftpIgnorePath, fileContents.join('\n'), function (err) {
          if (!err) atom.workspace.open(ftpIgnorePath);
        });
      }
    },
    'remote-ftp:toggle': {
      enabled: true,
      command: function command() {
        remoteftp.treeView.toggle();
      }
    },
    'remote-ftp:connect': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        client.readConfig(function (e) {
          if (e) {
            atom.notifications.addError('Remote FTP: Could not read `.ftpconfig` file.', {
              detail: e,
              dismissable: false
            });

            return;
          }

          client.connect();
        });
      }
    },
    'remote-ftp:disconnect': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        client.disconnect();
      }
    },
    'remote-ftp:add-file': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');

        if (remotes === false) return;

        if (!(remotes[0] instanceof _viewsDirectoryView2['default'])) {
          atom.notifications.addError('Remote FTP: Cannot add a file to ' + remotes[0].item.remote, {
            dismissable: false
          });

          return;
        }

        var dialog = new _dialogsAddDialog2['default']('', true);

        dialog.on('new-path', function (e, name) {
          var remote = _path2['default'].join(remotes[0].item.remote, name).replace(/\\/g, '/');
          dialog.close();
          client.mkdir(remotes[0].item.remote, true, function () {
            client.mkfile(remote, function (err) {
              remotes[0].open();
              if (!err) atom.workspace.open(client.toLocal(remote));
            });
          });
        });

        dialog.attach();
      }
    },
    'remote-ftp:add-folder': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');

        if (remotes === false) return;

        if (!(remotes[0] instanceof _viewsDirectoryView2['default'])) {
          atom.notifications.addError('Remote FTP: Cannot add a folder to ' + remotes[0].item.remote, {
            dismissable: false
          });
          return;
        }

        var dialog = new _dialogsAddDialog2['default']('');

        dialog.on('new-path', function (e, name) {
          var remote = _path2['default'].join(remotes[0].item.remote, name).replace(/\\/g, '/');
          client.mkdir(remote, true, function () {
            dialog.close();
            remotes[0].open();
          });
        });

        dialog.attach();
      }
    },
    'remote-ftp:refresh-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');
        if (remotes === false) return;

        remotes.forEach(function (remote) {
          remote.open();
        });
      }
    },
    'remote-ftp:move-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');

        if (remotes === false) return;

        var dialog = new _dialogsMoveDialog2['default'](remotes[0].item.remote);

        dialog.on('path-changed', function (e, newremote) {
          client.rename(remotes[0].item.remote, newremote, function (err) {
            var errMessage = (0, _helpers.getObject)({
              obj: err,
              keys: ['message']
            });

            dialog.close();

            if (errMessage === 'file exists' || errMessage === 'File already exists') {
              atom.notifications.addError('Remote FTP: File / Folder already exists.', {
                dismissable: false
              });
              return;
            }

            var parentNew = remoteftp.treeView.resolve(_path2['default'].dirname(newremote));

            if (parentNew) parentNew.open();

            var parentOld = remoteftp.treeView.resolve(_path2['default'].dirname(remotes[0].item.remote));

            if (parentOld && parentOld !== parentNew) parentOld.open();

            remotes[0].destroy();
          });
        });

        dialog.attach();
      }
    },
    'remote-ftp:delete-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');
        if (remotes === false) return;

        atom.confirm({
          message: 'Are you sure you want to delete the selected item ?',
          detailedMessage: 'You are deleting:' + remotes.map(function (view) {
            return '\n  ' + view.item.remote;
          }),
          buttons: {
            'Move to Trash': function MoveToTrash() {
              remotes.forEach(function (view) {
                if (!view) return;

                var dir = _path2['default'].dirname(view.item.remote).replace(/\\/g, '/');
                var parent = remoteftp.treeView.resolve(dir);

                client['delete'](view.item.remote, function (err) {
                  if (!err && parent) {
                    parent.open();
                  }
                });
              });
            },
            Cancel: null
          }
        });
      }
    },
    'remote-ftp:download-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = getRemotes('You need to select a folder first');

        if (remotes === false) return;

        remotes.forEach(function (view) {
          if (!view) return;

          client.download(view.item.remote, true, function () {});
        });
      }
    },
    'remote-ftp:download-active': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;
        if (!client.isConnected()) return;
        if (client.ftpConfigPath !== client.getConfigPath()) return;

        var activeTextEditor = atom.workspace.getActiveTextEditor();

        if (typeof activeTextEditor === 'undefined') return;

        var currentPath = activeTextEditor.getPath();

        if (currentPath === client.getConfigPath()) return;
        if (client.watch.files.indexOf(currentPath) >= 0) return;

        var downloadItem = client.toRemote(currentPath);
        client.download(downloadItem, true, function () {});
      }
    },
    'remote-ftp:download-selected-local': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        if (client.root.local === '') {
          atom.notifications.addError('Remote FTP: You must define your local root folder in the projects .ftpconfig file.', {
            dismissable: false
          });

          return;
        }

        if (!client.isConnected()) {
          var _ret = (function () {
            var viewWorkspace = atom.views.getView(atom.workspace);

            atom.commands.dispatch(viewWorkspace, 'remote-ftp:connect');

            atom.project.remoteftp.onceConnected(function () {
              atom.commands.dispatch(viewWorkspace, 'remote-ftp:download-selected-local');
            });

            return {
              v: undefined
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }

        // TODO: correctly count files within a subdirectory
        var $treeSelected = (0, _atomSpacePenViews.$)('.tree-view .selected');
        var requestedTransfers = $treeSelected.length;

        var successfulTransfers = 0;
        var attemptedTransfers = 0;

        $treeSelected.each(function (key, elem) {
          var path = elem.getPath ? elem.getPath() : '';
          var localPath = path.replace(client.root.local, '');
          var remotePath = _path2['default'].posix.normalize((atom.project.remoteftp.root.remote + localPath).replace(/\\/g, '/'));

          client.download(remotePath, true, function () {
            if (atom.config.get('remote-ftp.notifications.enableTransfer')) {
              // TODO: check if any errors were thrown, indicating an unsuccessful transfer
              attemptedTransfers++;
              successfulTransfers++;
            }
          });
        });

        if (atom.config.get('remote-ftp.notifications.enableTransfer')) {
          (function () {
            var waitingForTransfers = setInterval(function () {
              if (attemptedTransfers === requestedTransfers) {
                // we're done waiting
                clearInterval(waitingForTransfers);

                if (successfulTransfers === requestedTransfers) {
                  // great, all uploads worked
                  atom.notifications.addSuccess('Remote FTP: All transfers succeeded (' + successfulTransfers + ' of ' + requestedTransfers + ').');
                } else {
                  // :( some uploads failed
                  atom.notifications.addError('Remote FTP: Some transfers failed<br />There were ' + successfulTransfers + ' successful out of an expected ' + requestedTransfers + '.');
                }
              }
            }, 200);
          })();
        }
      }
    },
    'remote-ftp:upload-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        if (!client.isConnected()) {
          var _ret3 = (function () {
            var viewWorkspace = atom.views.getView(atom.workspace);

            atom.commands.dispatch(viewWorkspace, 'remote-ftp:connect');

            atom.project.remoteftp.onceConnected(function () {
              atom.commands.dispatch(viewWorkspace, 'remote-ftp:upload-selected');
            });

            return {
              v: undefined
            };
          })();

          if (typeof _ret3 === 'object') return _ret3.v;
        }

        var locals = (0, _atomSpacePenViews.$)('.tree-view .selected').map(function MAP() {
          return this.getPath ? this.getPath() : '';
        }).get();

        var enableTransfer = atom.config.get('remote-ftp.notifications.enableTransfer');

        var successfulTransfers = undefined;
        var attemptedTransfers = undefined;

        if (enableTransfer) {
          successfulTransfers = 0;
          attemptedTransfers = 0;
        }

        locals.forEach(function (local) {
          if (!local) return;

          client.upload(local, function (err, list) {
            if (enableTransfer) {
              attemptedTransfers++;
            }
            if (err && !/File exists/.test(err)) {
              console.error(err);
              return;
            }

            if (enableTransfer) {
              successfulTransfers++;
            }

            var dirs = [];
            list.forEach(function (item) {
              var remote = client.toRemote(item.name);
              var dir = _path2['default'].dirname(remote);
              if (dirs.indexOf(dir) === -1) dirs.push(dir);
            });

            dirs.forEach(function (dir) {
              var view = remoteftp.treeView.resolve(dir);
              if (view) view.open();
            });
          });
        });

        if (atom.config.get('remote-ftp.notifications.enableTransfer')) {
          (function () {
            var waitingForTransfers = setInterval(function () {
              if (attemptedTransfers === locals.length) {
                // we're done waiting
                clearInterval(waitingForTransfers);

                if (successfulTransfers === locals.length) {
                  // great, all uploads worked
                  atom.notifications.addSuccess('Remote FTP: All transfers succeeded (' + successfulTransfers + ' of ' + locals.length + ').');
                } else {
                  // :( some uploads failed
                  atom.notifications.addError('Remote FTP: Some transfers failed<br />There were ' + successfulTransfers + ' successful out of an expected ' + locals.length + '.');
                }
              }
            }, 200);
          })();
        }
      }
    },
    'remote-ftp:upload-active': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var editor = atom.workspace.getActiveTextEditor();
        if (!editor) return;

        var local = editor.getPath();

        client.upload(local, function (err, list) {
          if (err) return;

          var dirs = [];
          list.forEach(function (item) {
            var remote = atom.project.remoteftp.toRemote(item.name);
            var dir = _path2['default'].dirname(remote);
            if (dirs.indexOf(dir) === -1) dirs.push(dir);
          });

          dirs.forEach(function (dir) {
            var view = remoteftp.treeView.resolve(dir);
            if (view) view.open();
          });
        });
      }
    },
    // Remote -> Local
    'remote-ftp:sync-with-remote': {
      enabled: true,
      command: function command() {
        var remotes = remoteftp.treeView.getSelected();
        var filteredRemotes = remotes.filter(_helpers.checkIgnoreRemote);

        filteredRemotes.forEach(function (view) {
          if (!view) return;

          // checking to see if we're working with a file
          if (view.item.constructor.name === 'File') {
            try {
              client.syncRemoteFileToLocal(view.item.remote);
            } catch (err) {
              // syncRemoteFileToLocal() is not setup to return any errors here,
              // as they are handled else where. TODO: perhaps look into a way to restructure
              // sequence to handle all errors in one location (here)
              atom.notifications.addError('Remote FTP: Error Syncing "' + _path2['default'].basename(view.item.remote) + '" to local.', {
                dismissable: true
              });
            } finally {
              // TODO: Verify transfer was completed successfully by checking files
              // and verifying sizes or hash of both files
              atom.notifications.addInfo('Remote FTP: Synced "' + _path2['default'].basename(view.item.remote) + '" to local.', {
                dismissable: false
              });
            }
          } else {
            // process sync for entire directory
            var isFile = false;
            try {
              client.syncRemoteDirectoryToLocal(view.item.remote, isFile);
            } catch (err) {
              // syncRemoteDirectoryToLocal() is not setup to return any errors here,
              // as they are handled else where. TODO: perhaps look into a way to restructure
              // sequence to handle all errors in one location (here)
              atom.notifications.addError('Remote FTP: Error in Syncing "' + _path2['default'].basename(view.item.remote) + '" to local.', {
                dismissable: true
              });
            } finally {
              // TODO: Verify transfer was completed successfully by checking files
              // and verifying sizes or hash of both files
              atom.notifications.addInfo('Remote FTP: Synced "' + _path2['default'].basename(view.item.remote) + '" to local.', {
                dismissable: false
              });
            }
          }
        });
      }
    },

    // Local -> Remote
    'remote-ftp:sync-with-local': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        if (!client.isConnected()) {
          var _ret5 = (function () {
            var viewWorkspace = atom.views.getView(atom.workspace);

            atom.commands.dispatch(viewWorkspace, 'remote-ftp:connect');

            atom.project.remoteftp.emitter.once('connected', function () {
              atom.commands.dispatch(viewWorkspace, 'remote-ftp:sync-with-local');
            });

            return {
              v: undefined
            };
          })();

          if (typeof _ret5 === 'object') return _ret5.v;
        }

        var locals = (0, _atomSpacePenViews.$)('.tree-view .selected').map(_helpers.checkPaths).get();
        var filteredRemotes = locals.filter(_helpers.checkIgnoreLocal);

        filteredRemotes.forEach(function (local) {
          if (!local) return;

          // checking to see if we're working with a file
          if (_fsPlus2['default'].isFileSync(local) === true) {
            try {
              client.syncLocalFileToRemote(local);
            } catch (err) {
              // syncLocalFileToRemote() is not setup to return any errors here,
              // as they are handled else where. TODO: perhaps look into a way to restructure
              // sequence to handle all errors in one location (here)
              atom.notifications.addError('Remote FTP: Error Syncing "' + _path2['default'].basename(local) + '" to remote.', {
                dismissable: true
              });
            } finally {
              // TODO: Verify transfer was completed successfully by checking remote
              // and verifying sizes or hash of both files
              atom.notifications.addInfo('Remote FTP: Synced "' + _path2['default'].basename(local) + '" to remote.', {
                dismissable: false
              });
            }
          } else {
            // process sync for entire directory
            try {
              client.syncLocalDirectoryToRemote(local, function () {
                // TODO: Verify transfer was completed successfully by checking remote
                // and verifying sizes or hash of both files
                atom.notifications.addInfo('Remote FTP: Synced "' + local + '" to remote.', {
                  dismissable: false
                });
              });
            } catch (err) {
              // syncLocalDirectoryToRemote() is not setup to return any errors here,
              // as they are handled else where. TODO: perhaps look into a way to restructure
              // sequence to handle all errors in one location (here)
              atom.notifications.addError('Remote FTP: Error Syncing "' + local + '" to remote.', {
                dismissable: true
              });
            }
          }
        });
      }
    },
    'remote-ftp:abort-current': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        client.abort();
      }
    },
    'remote-ftp:navigate-to': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var dialog = new _dialogsNavigateToDialog2['default']();

        dialog.on('navigate-to', function (e, path) {
          dialog.close();
          client.root.openPath(path);
        });

        dialog.attach();
      }
    },
    'remote-ftp:copy-name': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = remoteftp.treeView.getSelected();

        if (!remotes || remotes.length === 0) return;

        var name = '' + remotes.map(function (data) {
          return data.item.name;
        });

        atom.clipboard.write(name);
      }
    },

    'remote-ftp:permission-selected': {
      enabled: true,
      command: function command() {
        if (!(0, _helpers.hasProject)()) return;

        var remotes = remoteftp.treeView.getSelected();
        if (!remotes || remotes.length === 0) return;

        var isRoot = remotes[0].hasClass('project-root');
        if (isRoot) return;

        var original = remotes[0].item.original;

        var permission = new _viewsPermissionView2['default']({
          rights: original.rights,
          group: original.group,
          owner: original.owner
        }, remotes[0]);
      }
    }

  };

  return commands;
};

exports['default'] = init;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9tZW51cy9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O2lDQUNMLHNCQUFzQjs7dUJBT2pDLFlBQVk7O2tDQUVPLHlCQUF5Qjs7OzttQ0FDeEIsMEJBQTBCOzs7O2dDQUMvQix1QkFBdUI7Ozs7aUNBQ3RCLHdCQUF3Qjs7Ozt1Q0FDeEIsK0JBQStCOzs7O0FBakJ0RCxXQUFXLENBQUM7O0FBb0JaLElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOztBQUU3QyxNQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxVQUFVLEVBQUs7QUFDakMsUUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7QUFFakQsUUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNwQyxVQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsa0JBQWdCLFVBQVUsRUFBSTtBQUN6RCxtQkFBVyxFQUFFLEtBQUs7T0FDbkIsQ0FBQyxDQUFDO0FBQ0gsYUFBTyxLQUFLLENBQUM7S0FDZDs7QUFFRCxXQUFPLE9BQU8sQ0FBQztHQUNoQixDQUFDOztBQUVGLE1BQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEdBQUcsRUFBSztBQUM1QixRQUFJLENBQUMsMEJBQVksRUFBRSxPQUFPOztBQUUxQixRQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDN0MsUUFBTSxVQUFVLEdBQUcsb0JBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hE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Q0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTzs7QUFFN0MsWUFBTSxJQUFJLFFBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7aUJBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1NBQUEsQ0FBQyxBQUFFLENBQUM7O0FBRXRELFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzVCO0tBQ0Y7O0FBRUQsb0NBQWdDLEVBQUU7QUFDaEMsYUFBTyxFQUFFLElBQUk7QUFDYixhQUFPLEVBQUEsbUJBQUc7QUFDUixZQUFJLENBQUMsMEJBQVksRUFBRSxPQUFPOztBQUUxQixZQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ2pELFlBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTzs7QUFFN0MsWUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuRCxZQUFJLE1BQU0sRUFBRSxPQUFPOztBQUVuQixZQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUMsWUFBTSxVQUFVLEdBQUcscUNBQW1CO0FBQ3BDLGdCQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsZUFBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO0FBQ3JCLGVBQUssRUFBRSxRQUFRLENBQUMsS0FBSztTQUN0QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hCO0tBQ0Y7O0dBRUYsQ0FBQzs7QUFFRixTQUFPLFFBQVEsQ0FBQztDQUNqQixDQUFDOztxQkFFYSxJQUFJIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9tZW51cy9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRlMgZnJvbSAnZnMtcGx1cyc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7ICQgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQge1xuICBoYXNQcm9qZWN0LFxuICBnZXRPYmplY3QsXG4gIGNoZWNrSWdub3JlUmVtb3RlLFxuICBjaGVja0lnbm9yZUxvY2FsLFxuICBjaGVja1BhdGhzLFxufSBmcm9tICcuLi9oZWxwZXJzJztcblxuaW1wb3J0IERpcmVjdG9yeVZpZXcgZnJvbSAnLi4vdmlld3MvZGlyZWN0b3J5LXZpZXcnO1xuaW1wb3J0IFBlcm1pc3Npb25WaWV3IGZyb20gJy4uL3ZpZXdzL3Blcm1pc3Npb24tdmlldyc7XG5pbXBvcnQgQWRkRGlhbG9nIGZyb20gJy4uL2RpYWxvZ3MvYWRkLWRpYWxvZyc7XG5pbXBvcnQgTW92ZURpYWxvZyBmcm9tICcuLi9kaWFsb2dzL21vdmUtZGlhbG9nJztcbmltcG9ydCBOYXZpZ2F0ZVRvIGZyb20gJy4uL2RpYWxvZ3MvbmF2aWdhdGUtdG8tZGlhbG9nJztcblxuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICBjb25zdCBjbGllbnQgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwO1xuICBjb25zdCByZW1vdGVmdHAgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwTWFpbjtcblxuICBjb25zdCBnZXRSZW1vdGVzID0gKGVyck1lc3NhZ2UpID0+IHtcbiAgICBjb25zdCByZW1vdGVzID0gcmVtb3RlZnRwLnRyZWVWaWV3LmdldFNlbGVjdGVkKCk7XG5cbiAgICBpZiAoIXJlbW90ZXMgfHwgcmVtb3Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGBSZW1vdGUgRlRQOiAke2Vyck1lc3NhZ2V9YCwge1xuICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVtb3RlcztcbiAgfTtcblxuICBjb25zdCBjcmVhdGVDb25maWcgPSAob2JqKSA9PiB7XG4gICAgaWYgKCFoYXNQcm9qZWN0KCkpIHJldHVybjtcblxuICAgIGNvbnN0IGZ0cENvbmZpZ1BhdGggPSBjbGllbnQuZ2V0Q29uZmlnUGF0aCgpO1xuICAgIGNvbnN0IGZpbGVFeGlzdHMgPSBGUy5leGlzdHNTeW5jKGZ0cENvbmZpZ1BhdGgpO1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpO1xuXG4gICAgbGV0IHdyaXRlRmlsZSA9IHRydWU7XG4gICAgaWYgKGZpbGVFeGlzdHMpIHtcbiAgICAgIHdyaXRlRmlsZSA9IGF0b20uY29uZmlybSh7XG4gICAgICAgIG1lc3NhZ2U6ICdEbyB5b3Ugd2FudCB0byBvdmVyd3JpdGUgLmZ0cGNvbmZpZz8nLFxuICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IGBZb3UgYXJlIG92ZXJ3cml0aW5nICR7ZnRwQ29uZmlnUGF0aH1gLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgWWVzOiAoKSA9PiB0cnVlLFxuICAgICAgICAgIE5vOiAoKSA9PiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh3cml0ZUZpbGUpIHtcbiAgICAgIEZTLndyaXRlRmlsZShmdHBDb25maWdQYXRoLCBqc29uLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmICghZXJyKSBhdG9tLndvcmtzcGFjZS5vcGVuKGZ0cENvbmZpZ1BhdGgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNvbW1hbmRzID0ge1xuICAgICdyZW1vdGUtZnRwOmNyZWF0ZS1mdHAtY29uZmlnJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGNyZWF0ZUNvbmZpZyh7XG4gICAgICAgICAgcHJvdG9jb2w6ICdmdHAnLFxuICAgICAgICAgIGhvc3Q6ICdleGFtcGxlLmNvbScsXG4gICAgICAgICAgcG9ydDogMjEsXG4gICAgICAgICAgdXNlcjogJ3VzZXInLFxuICAgICAgICAgIHBhc3M6ICdwYXNzJyxcbiAgICAgICAgICBwcm9tcHRGb3JQYXNzOiBmYWxzZSxcbiAgICAgICAgICByZW1vdGU6ICcvJyxcbiAgICAgICAgICBsb2NhbDogJycsXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgICBzZWN1cmVPcHRpb25zOiBudWxsLFxuICAgICAgICAgIGNvbm5UaW1lb3V0OiAxMDAwMCxcbiAgICAgICAgICBwYXN2VGltZW91dDogMTAwMDAsXG4gICAgICAgICAga2VlcGFsaXZlOiAxMDAwMCxcbiAgICAgICAgICB3YXRjaDogW10sXG4gICAgICAgICAgd2F0Y2hUaW1lb3V0OiA1MDAsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmNyZWF0ZS1zZnRwLWNvbmZpZyc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBjcmVhdGVDb25maWcoe1xuICAgICAgICAgIHByb3RvY29sOiAnc2Z0cCcsXG4gICAgICAgICAgaG9zdDogJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBwb3J0OiAyMixcbiAgICAgICAgICB1c2VyOiAndXNlcicsXG4gICAgICAgICAgcGFzczogJ3Bhc3MnLFxuICAgICAgICAgIHByb21wdEZvclBhc3M6IGZhbHNlLFxuICAgICAgICAgIHJlbW90ZTogJy8nLFxuICAgICAgICAgIGxvY2FsOiAnJyxcbiAgICAgICAgICBhZ2VudDogJycsXG4gICAgICAgICAgcHJpdmF0ZWtleTogJycsXG4gICAgICAgICAgcGFzc3BocmFzZTogJycsXG4gICAgICAgICAgaG9zdGhhc2g6ICcnLFxuICAgICAgICAgIGlnbm9yZWhvc3Q6IHRydWUsXG4gICAgICAgICAgY29ublRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICAgIGtlZXBhbGl2ZTogMTAwMDAsXG4gICAgICAgICAga2V5Ym9hcmRJbnRlcmFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAga2V5Ym9hcmRJbnRlcmFjdGl2ZUZvclBhc3M6IGZhbHNlLFxuICAgICAgICAgIHJlbW90ZUNvbW1hbmQ6ICcnLFxuICAgICAgICAgIHJlbW90ZVNoZWxsOiAnJyxcbiAgICAgICAgICB3YXRjaDogW10sXG4gICAgICAgICAgd2F0Y2hUaW1lb3V0OiA1MDAsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmNyZWF0ZS1pZ25vcmUtZmlsZSc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50cyA9IFsnLmZ0cGNvbmZpZycsICcuZnRwY29uZmlnLmNzb24nLCAnLmZ0cGlnbm9yZScsICdpZF9yc2EnLCAnLkRTX1N0b3JlJywgJy5naXQnXTtcbiAgICAgICAgY29uc3QgZnRwSWdub3JlUGF0aCA9IGNsaWVudC5nZXRGaWxlUGF0aCgnLi8uZnRwaWdub3JlJyk7XG5cbiAgICAgICAgRlMud3JpdGVGaWxlKGZ0cElnbm9yZVBhdGgsIGZpbGVDb250ZW50cy5qb2luKCdcXG4nKSwgKGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyKSBhdG9tLndvcmtzcGFjZS5vcGVuKGZ0cElnbm9yZVBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICAncmVtb3RlLWZ0cDp0b2dnbGUnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgcmVtb3RlZnRwLnRyZWVWaWV3LnRvZ2dsZSgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmNvbm5lY3QnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgaWYgKCFoYXNQcm9qZWN0KCkpIHJldHVybjtcblxuICAgICAgICBjbGllbnQucmVhZENvbmZpZygoZSkgPT4ge1xuICAgICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1JlbW90ZSBGVFA6IENvdWxkIG5vdCByZWFkIGAuZnRwY29uZmlnYCBmaWxlLicsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBlLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNsaWVudC5jb25uZWN0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmRpc2Nvbm5lY3QnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgaWYgKCFoYXNQcm9qZWN0KCkpIHJldHVybjtcblxuICAgICAgICBjbGllbnQuZGlzY29ubmVjdCgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmFkZC1maWxlJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcmVtb3RlcyA9IGdldFJlbW90ZXMoJ1lvdSBuZWVkIHRvIHNlbGVjdCBhIGZvbGRlciBmaXJzdCcpO1xuXG4gICAgICAgIGlmIChyZW1vdGVzID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghKHJlbW90ZXNbMF0gaW5zdGFuY2VvZiBEaXJlY3RvcnlWaWV3KSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgUmVtb3RlIEZUUDogQ2Fubm90IGFkZCBhIGZpbGUgdG8gJHtyZW1vdGVzWzBdLml0ZW0ucmVtb3RlfWAsIHtcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBBZGREaWFsb2coJycsIHRydWUpO1xuXG4gICAgICAgIGRpYWxvZy5vbignbmV3LXBhdGgnLCAoZSwgbmFtZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlbW90ZSA9IFBhdGguam9pbihyZW1vdGVzWzBdLml0ZW0ucmVtb3RlLCBuYW1lKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgY2xpZW50Lm1rZGlyKHJlbW90ZXNbMF0uaXRlbS5yZW1vdGUsIHRydWUsICgpID0+IHtcbiAgICAgICAgICAgIGNsaWVudC5ta2ZpbGUocmVtb3RlLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHJlbW90ZXNbMF0ub3BlbigpO1xuICAgICAgICAgICAgICBpZiAoIWVycikgYXRvbS53b3Jrc3BhY2Uub3BlbihjbGllbnQudG9Mb2NhbChyZW1vdGUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6YWRkLWZvbGRlcic6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZXMgPSBnZXRSZW1vdGVzKCdZb3UgbmVlZCB0byBzZWxlY3QgYSBmb2xkZXIgZmlyc3QnKTtcblxuICAgICAgICBpZiAocmVtb3RlcyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBpZiAoIShyZW1vdGVzWzBdIGluc3RhbmNlb2YgRGlyZWN0b3J5VmlldykpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFJlbW90ZSBGVFA6IENhbm5vdCBhZGQgYSBmb2xkZXIgdG8gJHtyZW1vdGVzWzBdLml0ZW0ucmVtb3RlfWAsIHtcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaWFsb2cgPSBuZXcgQWRkRGlhbG9nKCcnKTtcblxuICAgICAgICBkaWFsb2cub24oJ25ldy1wYXRoJywgKGUsIG5hbWUpID0+IHtcbiAgICAgICAgICBjb25zdCByZW1vdGUgPSBQYXRoLmpvaW4ocmVtb3Rlc1swXS5pdGVtLnJlbW90ZSwgbmFtZSlcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgICAgY2xpZW50Lm1rZGlyKHJlbW90ZSwgdHJ1ZSwgKCkgPT4ge1xuICAgICAgICAgICAgZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgICByZW1vdGVzWzBdLm9wZW4oKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOnJlZnJlc2gtc2VsZWN0ZWQnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgaWYgKCFoYXNQcm9qZWN0KCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZW1vdGVzID0gZ2V0UmVtb3RlcygnWW91IG5lZWQgdG8gc2VsZWN0IGEgZm9sZGVyIGZpcnN0Jyk7XG4gICAgICAgIGlmIChyZW1vdGVzID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICAgIHJlbW90ZXMuZm9yRWFjaCgocmVtb3RlKSA9PiB7XG4gICAgICAgICAgcmVtb3RlLm9wZW4oKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6bW92ZS1zZWxlY3RlZCc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZXMgPSBnZXRSZW1vdGVzKCdZb3UgbmVlZCB0byBzZWxlY3QgYSBmb2xkZXIgZmlyc3QnKTtcblxuICAgICAgICBpZiAocmVtb3RlcyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBjb25zdCBkaWFsb2cgPSBuZXcgTW92ZURpYWxvZyhyZW1vdGVzWzBdLml0ZW0ucmVtb3RlKTtcblxuICAgICAgICBkaWFsb2cub24oJ3BhdGgtY2hhbmdlZCcsIChlLCBuZXdyZW1vdGUpID0+IHtcbiAgICAgICAgICBjbGllbnQucmVuYW1lKHJlbW90ZXNbMF0uaXRlbS5yZW1vdGUsIG5ld3JlbW90ZSwgKGVycikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyTWVzc2FnZSA9IGdldE9iamVjdCh7XG4gICAgICAgICAgICAgIG9iajogZXJyLFxuICAgICAgICAgICAgICBrZXlzOiBbJ21lc3NhZ2UnXSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcblxuICAgICAgICAgICAgaWYgKGVyck1lc3NhZ2UgPT09ICdmaWxlIGV4aXN0cycgfHwgZXJyTWVzc2FnZSA9PT0gJ0ZpbGUgYWxyZWFkeSBleGlzdHMnKSB7XG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogRmlsZSAvIEZvbGRlciBhbHJlYWR5IGV4aXN0cy4nLCB7XG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXJlbnROZXcgPSByZW1vdGVmdHAudHJlZVZpZXcucmVzb2x2ZShQYXRoLmRpcm5hbWUobmV3cmVtb3RlKSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnROZXcpIHBhcmVudE5ldy5vcGVuKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhcmVudE9sZCA9IHJlbW90ZWZ0cC50cmVlVmlldy5yZXNvbHZlKFBhdGguZGlybmFtZShyZW1vdGVzWzBdLml0ZW0ucmVtb3RlKSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRPbGQgJiYgcGFyZW50T2xkICE9PSBwYXJlbnROZXcpIHBhcmVudE9sZC5vcGVuKCk7XG5cbiAgICAgICAgICAgIHJlbW90ZXNbMF0uZGVzdHJveSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkaWFsb2cuYXR0YWNoKCk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6ZGVsZXRlLXNlbGVjdGVkJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgcmVtb3RlcyA9IGdldFJlbW90ZXMoJ1lvdSBuZWVkIHRvIHNlbGVjdCBhIGZvbGRlciBmaXJzdCcpO1xuICAgICAgICBpZiAocmVtb3RlcyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSBzZWxlY3RlZCBpdGVtID8nLFxuICAgICAgICAgIGRldGFpbGVkTWVzc2FnZTogYFlvdSBhcmUgZGVsZXRpbmc6JHtyZW1vdGVzLm1hcCh2aWV3ID0+IGBcXG4gICR7dmlldy5pdGVtLnJlbW90ZX1gKX1gLFxuICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICdNb3ZlIHRvIFRyYXNoJzogKCkgPT4ge1xuICAgICAgICAgICAgICByZW1vdGVzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZSh2aWV3Lml0ZW0ucmVtb3RlKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gcmVtb3RlZnRwLnRyZWVWaWV3LnJlc29sdmUoZGlyKTtcblxuICAgICAgICAgICAgICAgIGNsaWVudC5kZWxldGUodmlldy5pdGVtLnJlbW90ZSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKCFlcnIgJiYgcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIENhbmNlbDogbnVsbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICAncmVtb3RlLWZ0cDpkb3dubG9hZC1zZWxlY3RlZCc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZXMgPSBnZXRSZW1vdGVzKCdZb3UgbmVlZCB0byBzZWxlY3QgYSBmb2xkZXIgZmlyc3QnKTtcblxuICAgICAgICBpZiAocmVtb3RlcyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgICByZW1vdGVzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgICAgICAgIGNsaWVudC5kb3dubG9hZCh2aWV3Lml0ZW0ucmVtb3RlLCB0cnVlLCAoKSA9PiB7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6ZG93bmxvYWQtYWN0aXZlJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG4gICAgICAgIGlmICghY2xpZW50LmlzQ29ubmVjdGVkKCkpIHJldHVybjtcbiAgICAgICAgaWYgKGNsaWVudC5mdHBDb25maWdQYXRoICE9PSBjbGllbnQuZ2V0Q29uZmlnUGF0aCgpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgYWN0aXZlVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFjdGl2ZVRleHRFZGl0b3IgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBhY3RpdmVUZXh0RWRpdG9yLmdldFBhdGgoKTtcblxuICAgICAgICBpZiAoY3VycmVudFBhdGggPT09IGNsaWVudC5nZXRDb25maWdQYXRoKCkpIHJldHVybjtcbiAgICAgICAgaWYgKGNsaWVudC53YXRjaC5maWxlcy5pbmRleE9mKGN1cnJlbnRQYXRoKSA+PSAwKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZG93bmxvYWRJdGVtID0gY2xpZW50LnRvUmVtb3RlKGN1cnJlbnRQYXRoKTtcbiAgICAgICAgY2xpZW50LmRvd25sb2FkKGRvd25sb2FkSXRlbSwgdHJ1ZSwgKCkgPT4ge1xuXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmRvd25sb2FkLXNlbGVjdGVkLWxvY2FsJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKGNsaWVudC5yb290LmxvY2FsID09PSAnJykge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogWW91IG11c3QgZGVmaW5lIHlvdXIgbG9jYWwgcm9vdCBmb2xkZXIgaW4gdGhlIHByb2plY3RzIC5mdHBjb25maWcgZmlsZS4nLCB7XG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaWVudC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICAgICAgY29uc3Qgdmlld1dvcmtzcGFjZSA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG5cbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHZpZXdXb3Jrc3BhY2UsICdyZW1vdGUtZnRwOmNvbm5lY3QnKTtcblxuICAgICAgICAgIGF0b20ucHJvamVjdC5yZW1vdGVmdHAub25jZUNvbm5lY3RlZCgoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHZpZXdXb3Jrc3BhY2UsICdyZW1vdGUtZnRwOmRvd25sb2FkLXNlbGVjdGVkLWxvY2FsJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPOiBjb3JyZWN0bHkgY291bnQgZmlsZXMgd2l0aGluIGEgc3ViZGlyZWN0b3J5XG4gICAgICAgIGNvbnN0ICR0cmVlU2VsZWN0ZWQgPSAkKCcudHJlZS12aWV3IC5zZWxlY3RlZCcpO1xuICAgICAgICBjb25zdCByZXF1ZXN0ZWRUcmFuc2ZlcnMgPSAkdHJlZVNlbGVjdGVkLmxlbmd0aDtcblxuICAgICAgICBsZXQgc3VjY2Vzc2Z1bFRyYW5zZmVycyA9IDA7XG4gICAgICAgIGxldCBhdHRlbXB0ZWRUcmFuc2ZlcnMgPSAwO1xuXG4gICAgICAgICR0cmVlU2VsZWN0ZWQuZWFjaCgoa2V5LCBlbGVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGF0aCA9IGVsZW0uZ2V0UGF0aCA/IGVsZW0uZ2V0UGF0aCgpIDogJyc7XG4gICAgICAgICAgY29uc3QgbG9jYWxQYXRoID0gcGF0aC5yZXBsYWNlKGNsaWVudC5yb290LmxvY2FsLCAnJyk7XG4gICAgICAgICAgY29uc3QgcmVtb3RlUGF0aCA9IFBhdGgucG9zaXgubm9ybWFsaXplKChhdG9tLnByb2plY3QucmVtb3RlZnRwLnJvb3QucmVtb3RlICsgbG9jYWxQYXRoKS5yZXBsYWNlKC9cXFxcL2csICcvJykpO1xuXG4gICAgICAgICAgY2xpZW50LmRvd25sb2FkKHJlbW90ZVBhdGgsIHRydWUsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAubm90aWZpY2F0aW9ucy5lbmFibGVUcmFuc2ZlcicpKSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIGlmIGFueSBlcnJvcnMgd2VyZSB0aHJvd24sIGluZGljYXRpbmcgYW4gdW5zdWNjZXNzZnVsIHRyYW5zZmVyXG4gICAgICAgICAgICAgIGF0dGVtcHRlZFRyYW5zZmVycysrO1xuICAgICAgICAgICAgICBzdWNjZXNzZnVsVHJhbnNmZXJzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAubm90aWZpY2F0aW9ucy5lbmFibGVUcmFuc2ZlcicpKSB7XG4gICAgICAgICAgY29uc3Qgd2FpdGluZ0ZvclRyYW5zZmVycyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmIChhdHRlbXB0ZWRUcmFuc2ZlcnMgPT09IHJlcXVlc3RlZFRyYW5zZmVycykge1xuICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lIHdhaXRpbmdcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3YWl0aW5nRm9yVHJhbnNmZXJzKTtcblxuICAgICAgICAgICAgICBpZiAoc3VjY2Vzc2Z1bFRyYW5zZmVycyA9PT0gcmVxdWVzdGVkVHJhbnNmZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gZ3JlYXQsIGFsbCB1cGxvYWRzIHdvcmtlZFxuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKGBSZW1vdGUgRlRQOiBBbGwgdHJhbnNmZXJzIHN1Y2NlZWRlZCAoJHtzdWNjZXNzZnVsVHJhbnNmZXJzfSBvZiAke3JlcXVlc3RlZFRyYW5zZmVyc30pLmApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIDooIHNvbWUgdXBsb2FkcyBmYWlsZWRcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFJlbW90ZSBGVFA6IFNvbWUgdHJhbnNmZXJzIGZhaWxlZDxiciAvPlRoZXJlIHdlcmUgJHtzdWNjZXNzZnVsVHJhbnNmZXJzfSBzdWNjZXNzZnVsIG91dCBvZiBhbiBleHBlY3RlZCAke3JlcXVlc3RlZFRyYW5zZmVyc30uYCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6dXBsb2FkLXNlbGVjdGVkJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCFjbGllbnQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICAgIGNvbnN0IHZpZXdXb3Jrc3BhY2UgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh2aWV3V29ya3NwYWNlLCAncmVtb3RlLWZ0cDpjb25uZWN0Jyk7XG5cbiAgICAgICAgICBhdG9tLnByb2plY3QucmVtb3RlZnRwLm9uY2VDb25uZWN0ZWQoKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh2aWV3V29ya3NwYWNlLCAncmVtb3RlLWZ0cDp1cGxvYWQtc2VsZWN0ZWQnKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2FscyA9ICQoJy50cmVlLXZpZXcgLnNlbGVjdGVkJykubWFwKGZ1bmN0aW9uIE1BUCgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQYXRoID8gdGhpcy5nZXRQYXRoKCkgOiAnJztcbiAgICAgICAgfSkuZ2V0KCk7XG5cbiAgICAgICAgY29uc3QgZW5hYmxlVHJhbnNmZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAubm90aWZpY2F0aW9ucy5lbmFibGVUcmFuc2ZlcicpO1xuXG4gICAgICAgIGxldCBzdWNjZXNzZnVsVHJhbnNmZXJzO1xuICAgICAgICBsZXQgYXR0ZW1wdGVkVHJhbnNmZXJzO1xuXG4gICAgICAgIGlmIChlbmFibGVUcmFuc2Zlcikge1xuICAgICAgICAgIHN1Y2Nlc3NmdWxUcmFuc2ZlcnMgPSAwO1xuICAgICAgICAgIGF0dGVtcHRlZFRyYW5zZmVycyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbHMuZm9yRWFjaCgobG9jYWwpID0+IHtcbiAgICAgICAgICBpZiAoIWxvY2FsKSByZXR1cm47XG5cbiAgICAgICAgICBjbGllbnQudXBsb2FkKGxvY2FsLCAoZXJyLCBsaXN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoZW5hYmxlVHJhbnNmZXIpIHsgYXR0ZW1wdGVkVHJhbnNmZXJzKys7IH1cbiAgICAgICAgICAgIGlmIChlcnIgJiYgIS9GaWxlIGV4aXN0cy8udGVzdChlcnIpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW5hYmxlVHJhbnNmZXIpIHsgc3VjY2Vzc2Z1bFRyYW5zZmVycysrOyB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRpcnMgPSBbXTtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZW1vdGUgPSBjbGllbnQudG9SZW1vdGUoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgICAgY29uc3QgZGlyID0gUGF0aC5kaXJuYW1lKHJlbW90ZSk7XG4gICAgICAgICAgICAgIGlmIChkaXJzLmluZGV4T2YoZGlyKSA9PT0gLTEpIGRpcnMucHVzaChkaXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRpcnMuZm9yRWFjaCgoZGlyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSByZW1vdGVmdHAudHJlZVZpZXcucmVzb2x2ZShkaXIpO1xuICAgICAgICAgICAgICBpZiAodmlldykgdmlldy5vcGVuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC5ub3RpZmljYXRpb25zLmVuYWJsZVRyYW5zZmVyJykpIHtcbiAgICAgICAgICBjb25zdCB3YWl0aW5nRm9yVHJhbnNmZXJzID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0dGVtcHRlZFRyYW5zZmVycyA9PT0gbG9jYWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lIHdhaXRpbmdcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh3YWl0aW5nRm9yVHJhbnNmZXJzKTtcblxuICAgICAgICAgICAgICBpZiAoc3VjY2Vzc2Z1bFRyYW5zZmVycyA9PT0gbG9jYWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIGdyZWF0LCBhbGwgdXBsb2FkcyB3b3JrZWRcbiAgICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgUmVtb3RlIEZUUDogQWxsIHRyYW5zZmVycyBzdWNjZWVkZWQgKCR7c3VjY2Vzc2Z1bFRyYW5zZmVyc30gb2YgJHtsb2NhbHMubGVuZ3RofSkuYCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gOiggc29tZSB1cGxvYWRzIGZhaWxlZFxuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgUmVtb3RlIEZUUDogU29tZSB0cmFuc2ZlcnMgZmFpbGVkPGJyIC8+VGhlcmUgd2VyZSAke3N1Y2Nlc3NmdWxUcmFuc2ZlcnN9IHN1Y2Nlc3NmdWwgb3V0IG9mIGFuIGV4cGVjdGVkICR7bG9jYWxzLmxlbmd0aH0uYCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6dXBsb2FkLWFjdGl2ZSc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgaWYgKCFlZGl0b3IpIHJldHVybjtcblxuICAgICAgICBjb25zdCBsb2NhbCA9IGVkaXRvci5nZXRQYXRoKCk7XG5cbiAgICAgICAgY2xpZW50LnVwbG9hZChsb2NhbCwgKGVyciwgbGlzdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybjtcblxuICAgICAgICAgIGNvbnN0IGRpcnMgPSBbXTtcbiAgICAgICAgICBsaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW90ZSA9IGF0b20ucHJvamVjdC5yZW1vdGVmdHAudG9SZW1vdGUoaXRlbS5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGRpciA9IFBhdGguZGlybmFtZShyZW1vdGUpO1xuICAgICAgICAgICAgaWYgKGRpcnMuaW5kZXhPZihkaXIpID09PSAtMSkgZGlycy5wdXNoKGRpcik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkaXJzLmZvckVhY2goKGRpcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmlldyA9IHJlbW90ZWZ0cC50cmVlVmlldy5yZXNvbHZlKGRpcik7XG4gICAgICAgICAgICBpZiAodmlldykgdmlldy5vcGVuKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFJlbW90ZSAtPiBMb2NhbFxuICAgICdyZW1vdGUtZnRwOnN5bmMtd2l0aC1yZW1vdGUnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgY29uc3QgcmVtb3RlcyA9IHJlbW90ZWZ0cC50cmVlVmlldy5nZXRTZWxlY3RlZCgpO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZFJlbW90ZXMgPSByZW1vdGVzLmZpbHRlcihjaGVja0lnbm9yZVJlbW90ZSk7XG5cbiAgICAgICAgZmlsdGVyZWRSZW1vdGVzLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgICAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgICAgICAgIC8vIGNoZWNraW5nIHRvIHNlZSBpZiB3ZSdyZSB3b3JraW5nIHdpdGggYSBmaWxlXG4gICAgICAgICAgaWYgKHZpZXcuaXRlbS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnRmlsZScpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsaWVudC5zeW5jUmVtb3RlRmlsZVRvTG9jYWwodmlldy5pdGVtLnJlbW90ZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgLy8gc3luY1JlbW90ZUZpbGVUb0xvY2FsKCkgaXMgbm90IHNldHVwIHRvIHJldHVybiBhbnkgZXJyb3JzIGhlcmUsXG4gICAgICAgICAgICAgIC8vIGFzIHRoZXkgYXJlIGhhbmRsZWQgZWxzZSB3aGVyZS4gVE9ETzogcGVyaGFwcyBsb29rIGludG8gYSB3YXkgdG8gcmVzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgLy8gc2VxdWVuY2UgdG8gaGFuZGxlIGFsbCBlcnJvcnMgaW4gb25lIGxvY2F0aW9uIChoZXJlKVxuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFJlbW90ZSBGVFA6IEVycm9yIFN5bmNpbmcgXCIke1BhdGguYmFzZW5hbWUodmlldy5pdGVtLnJlbW90ZSl9XCIgdG8gbG9jYWwuYCwge1xuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIC8vIFRPRE86IFZlcmlmeSB0cmFuc2ZlciB3YXMgY29tcGxldGVkIHN1Y2Nlc3NmdWxseSBieSBjaGVja2luZyBmaWxlc1xuICAgICAgICAgICAgICAvLyBhbmQgdmVyaWZ5aW5nIHNpemVzIG9yIGhhc2ggb2YgYm90aCBmaWxlc1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgUmVtb3RlIEZUUDogU3luY2VkIFwiJHtQYXRoLmJhc2VuYW1lKHZpZXcuaXRlbS5yZW1vdGUpfVwiIHRvIGxvY2FsLmAsIHtcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7IC8vIHByb2Nlc3Mgc3luYyBmb3IgZW50aXJlIGRpcmVjdG9yeVxuICAgICAgICAgICAgY29uc3QgaXNGaWxlID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjbGllbnQuc3luY1JlbW90ZURpcmVjdG9yeVRvTG9jYWwodmlldy5pdGVtLnJlbW90ZSwgaXNGaWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAvLyBzeW5jUmVtb3RlRGlyZWN0b3J5VG9Mb2NhbCgpIGlzIG5vdCBzZXR1cCB0byByZXR1cm4gYW55IGVycm9ycyBoZXJlLFxuICAgICAgICAgICAgICAvLyBhcyB0aGV5IGFyZSBoYW5kbGVkIGVsc2Ugd2hlcmUuIFRPRE86IHBlcmhhcHMgbG9vayBpbnRvIGEgd2F5IHRvIHJlc3RydWN0dXJlXG4gICAgICAgICAgICAgIC8vIHNlcXVlbmNlIHRvIGhhbmRsZSBhbGwgZXJyb3JzIGluIG9uZSBsb2NhdGlvbiAoaGVyZSlcbiAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBSZW1vdGUgRlRQOiBFcnJvciBpbiBTeW5jaW5nIFwiJHtQYXRoLmJhc2VuYW1lKHZpZXcuaXRlbS5yZW1vdGUpfVwiIHRvIGxvY2FsLmAsIHtcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBWZXJpZnkgdHJhbnNmZXIgd2FzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkgYnkgY2hlY2tpbmcgZmlsZXNcbiAgICAgICAgICAgICAgLy8gYW5kIHZlcmlmeWluZyBzaXplcyBvciBoYXNoIG9mIGJvdGggZmlsZXNcbiAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oYFJlbW90ZSBGVFA6IFN5bmNlZCBcIiR7UGF0aC5iYXNlbmFtZSh2aWV3Lml0ZW0ucmVtb3RlKX1cIiB0byBsb2NhbC5gLCB7XG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuXG4gICAgLy8gTG9jYWwgLT4gUmVtb3RlXG4gICAgJ3JlbW90ZS1mdHA6c3luYy13aXRoLWxvY2FsJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCFjbGllbnQuaXNDb25uZWN0ZWQoKSkge1xuICAgICAgICAgIGNvbnN0IHZpZXdXb3Jrc3BhY2UgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh2aWV3V29ya3NwYWNlLCAncmVtb3RlLWZ0cDpjb25uZWN0Jyk7XG5cbiAgICAgICAgICBhdG9tLnByb2plY3QucmVtb3RlZnRwLmVtaXR0ZXIub25jZSgnY29ubmVjdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh2aWV3V29ya3NwYWNlLCAncmVtb3RlLWZ0cDpzeW5jLXdpdGgtbG9jYWwnKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxvY2FscyA9ICQoJy50cmVlLXZpZXcgLnNlbGVjdGVkJykubWFwKGNoZWNrUGF0aHMpLmdldCgpO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZFJlbW90ZXMgPSBsb2NhbHMuZmlsdGVyKGNoZWNrSWdub3JlTG9jYWwpO1xuXG4gICAgICAgIGZpbHRlcmVkUmVtb3Rlcy5mb3JFYWNoKChsb2NhbCkgPT4ge1xuICAgICAgICAgIGlmICghbG9jYWwpIHJldHVybjtcblxuICAgICAgICAgIC8vIGNoZWNraW5nIHRvIHNlZSBpZiB3ZSdyZSB3b3JraW5nIHdpdGggYSBmaWxlXG4gICAgICAgICAgaWYgKEZTLmlzRmlsZVN5bmMobG9jYWwpID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjbGllbnQuc3luY0xvY2FsRmlsZVRvUmVtb3RlKGxvY2FsKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAvLyBzeW5jTG9jYWxGaWxlVG9SZW1vdGUoKSBpcyBub3Qgc2V0dXAgdG8gcmV0dXJuIGFueSBlcnJvcnMgaGVyZSxcbiAgICAgICAgICAgICAgLy8gYXMgdGhleSBhcmUgaGFuZGxlZCBlbHNlIHdoZXJlLiBUT0RPOiBwZXJoYXBzIGxvb2sgaW50byBhIHdheSB0byByZXN0cnVjdHVyZVxuICAgICAgICAgICAgICAvLyBzZXF1ZW5jZSB0byBoYW5kbGUgYWxsIGVycm9ycyBpbiBvbmUgbG9jYXRpb24gKGhlcmUpXG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgUmVtb3RlIEZUUDogRXJyb3IgU3luY2luZyBcIiR7UGF0aC5iYXNlbmFtZShsb2NhbCl9XCIgdG8gcmVtb3RlLmAsIHtcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAvLyBUT0RPOiBWZXJpZnkgdHJhbnNmZXIgd2FzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHkgYnkgY2hlY2tpbmcgcmVtb3RlXG4gICAgICAgICAgICAgIC8vIGFuZCB2ZXJpZnlpbmcgc2l6ZXMgb3IgaGFzaCBvZiBib3RoIGZpbGVzXG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKGBSZW1vdGUgRlRQOiBTeW5jZWQgXCIke1BhdGguYmFzZW5hbWUobG9jYWwpfVwiIHRvIHJlbW90ZS5gLCB7XG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgeyAvLyBwcm9jZXNzIHN5bmMgZm9yIGVudGlyZSBkaXJlY3RvcnlcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsaWVudC5zeW5jTG9jYWxEaXJlY3RvcnlUb1JlbW90ZShsb2NhbCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IFZlcmlmeSB0cmFuc2ZlciB3YXMgY29tcGxldGVkIHN1Y2Nlc3NmdWxseSBieSBjaGVja2luZyByZW1vdGVcbiAgICAgICAgICAgICAgICAvLyBhbmQgdmVyaWZ5aW5nIHNpemVzIG9yIGhhc2ggb2YgYm90aCBmaWxlc1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKGBSZW1vdGUgRlRQOiBTeW5jZWQgXCIke2xvY2FsfVwiIHRvIHJlbW90ZS5gLCB7XG4gICAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgIC8vIHN5bmNMb2NhbERpcmVjdG9yeVRvUmVtb3RlKCkgaXMgbm90IHNldHVwIHRvIHJldHVybiBhbnkgZXJyb3JzIGhlcmUsXG4gICAgICAgICAgICAgIC8vIGFzIHRoZXkgYXJlIGhhbmRsZWQgZWxzZSB3aGVyZS4gVE9ETzogcGVyaGFwcyBsb29rIGludG8gYSB3YXkgdG8gcmVzdHJ1Y3R1cmVcbiAgICAgICAgICAgICAgLy8gc2VxdWVuY2UgdG8gaGFuZGxlIGFsbCBlcnJvcnMgaW4gb25lIGxvY2F0aW9uIChoZXJlKVxuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFJlbW90ZSBGVFA6IEVycm9yIFN5bmNpbmcgXCIke2xvY2FsfVwiIHRvIHJlbW90ZS5gLCB7XG4gICAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgJ3JlbW90ZS1mdHA6YWJvcnQtY3VycmVudCc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNsaWVudC5hYm9ydCgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOm5hdmlnYXRlLXRvJzoge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGNvbW1hbmQoKSB7XG4gICAgICAgIGlmICghaGFzUHJvamVjdCgpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZGlhbG9nID0gbmV3IE5hdmlnYXRlVG8oKTtcblxuICAgICAgICBkaWFsb2cub24oJ25hdmlnYXRlLXRvJywgKGUsIHBhdGgpID0+IHtcbiAgICAgICAgICBkaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICBjbGllbnQucm9vdC5vcGVuUGF0aChwYXRoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlhbG9nLmF0dGFjaCgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgICdyZW1vdGUtZnRwOmNvcHktbmFtZSc6IHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBjb21tYW5kKCkge1xuICAgICAgICBpZiAoIWhhc1Byb2plY3QoKSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHJlbW90ZXMgPSByZW1vdGVmdHAudHJlZVZpZXcuZ2V0U2VsZWN0ZWQoKTtcblxuICAgICAgICBpZiAoIXJlbW90ZXMgfHwgcmVtb3Rlcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICBjb25zdCBuYW1lID0gYCR7cmVtb3Rlcy5tYXAoZGF0YSA9PiBkYXRhLml0ZW0ubmFtZSl9YDtcblxuICAgICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShuYW1lKTtcbiAgICAgIH0sXG4gICAgfSxcblxuICAgICdyZW1vdGUtZnRwOnBlcm1pc3Npb24tc2VsZWN0ZWQnOiB7XG4gICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgY29tbWFuZCgpIHtcbiAgICAgICAgaWYgKCFoYXNQcm9qZWN0KCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZW1vdGVzID0gcmVtb3RlZnRwLnRyZWVWaWV3LmdldFNlbGVjdGVkKCk7XG4gICAgICAgIGlmICghcmVtb3RlcyB8fCByZW1vdGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGlzUm9vdCA9IHJlbW90ZXNbMF0uaGFzQ2xhc3MoJ3Byb2plY3Qtcm9vdCcpO1xuICAgICAgICBpZiAoaXNSb290KSByZXR1cm47XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSByZW1vdGVzWzBdLml0ZW0ub3JpZ2luYWw7XG5cbiAgICAgICAgY29uc3QgcGVybWlzc2lvbiA9IG5ldyBQZXJtaXNzaW9uVmlldyh7XG4gICAgICAgICAgcmlnaHRzOiBvcmlnaW5hbC5yaWdodHMsXG4gICAgICAgICAgZ3JvdXA6IG9yaWdpbmFsLmdyb3VwLFxuICAgICAgICAgIG93bmVyOiBvcmlnaW5hbC5vd25lcixcbiAgICAgICAgfSwgcmVtb3Rlc1swXSk7XG4gICAgICB9LFxuICAgIH0sXG5cbiAgfTtcblxuICByZXR1cm4gY29tbWFuZHM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIl19