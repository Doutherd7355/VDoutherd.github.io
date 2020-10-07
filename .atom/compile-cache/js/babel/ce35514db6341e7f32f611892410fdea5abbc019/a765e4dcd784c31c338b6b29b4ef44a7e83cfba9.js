Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _atom = require('atom');

var _electron = require('electron');

var _json5 = require('json5');

var _json52 = _interopRequireDefault(_json5);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

'use babel';

var packagePath = atom.packages.resolvePackagePath('atom-live-server');
var liveServer = _path2['default'].join(packagePath, '/node_modules/live-server/live-server.js');

var serverProcess = undefined;
var disposeMenu = undefined;
var noBrowser = undefined;
var console = global.console;

function addStartMenu() {
  disposeMenu = atom.menu.add([{
    label: 'Packages',
    submenu: [{
      label: 'atom-live-server',
      submenu: [{
        label: 'Start server',
        command: 'atom-live-server:startServer'
      }]
    }]
  }]);
}

function usingDefaultConsole() {
  return console == global.console;
}

function safeStatus(status) {
  if (!usingDefaultConsole()) console.setStatus(status);
}

exports['default'] = {
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-live-server:start-3000': function atomLiveServerStart3000() {
        return _this.startServer(3000);
      },
      'atom-live-server:start-4000': function atomLiveServerStart4000() {
        return _this.startServer(4000);
      },
      'atom-live-server:start-5000': function atomLiveServerStart5000() {
        return _this.startServer(5000);
      },
      'atom-live-server:start-8000': function atomLiveServerStart8000() {
        return _this.startServer(8000);
      },
      'atom-live-server:start-9000': function atomLiveServerStart9000() {
        return _this.startServer(9000);
      },
      'atom-live-server:startServer': function atomLiveServerStartServer() {
        return _this.startServer();
      },
      'atom-live-server:stopServer': function atomLiveServerStopServer() {
        return _this.stopServer();
      }
    }));

    addStartMenu();
  },

  deactivate: function deactivate() {
    this.stopServer();
    console.dispose();
    this.subscriptions.dispose();
  },

  consumeConsole: function consumeConsole(createConsole) {
    var mod = this;
    console = createConsole({
      id: 'atom-live-server',
      name: 'Live Server',
      start: function start() {
        mod.startServer();
      },
      stop: function stop() {
        mod.stopServer();
      }
    });
    return new _atom.Disposable(function () {
      console = null;
    });
  },

  startServer: function startServer() {
    var _this2 = this;

    var port = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];

    if (serverProcess) {
      return;
    }

    safeStatus('starting');

    var targetPath = atom.project.getPaths()[0];

    if (!targetPath) {
      atom.notifications.addWarning('[Live Server] You haven\'t opened a Project, you must open one.');
      return;
    }

    noBrowser = false;
    var args = [];
    var stdout = function stdout(output) {
      var strippedOutput = (0, _stripAnsi2['default'])(output);

      if (strippedOutput.indexOf('Serving ') === 0) {
        var serverUrl = strippedOutput.split(' at ')[1];
        var _port = _url2['default'].parse(serverUrl).port;
        var disposeStartMenu = disposeMenu;
        disposeMenu = atom.menu.add([{
          label: 'Packages',
          submenu: [{
            label: 'atom-live-server',
            submenu: [{
              label: strippedOutput.replace('Serving ', 'Stop ').replace(/\r?\n|\r/g, ''),
              command: 'atom-live-server:stopServer'
            }]
          }]
        }]);

        disposeStartMenu.dispose();
        safeStatus('running');

        if (noBrowser) {
          atom.notifications.addSuccess('[Live Server] Live server started at ' + serverUrl + '.');
        }
      }

      if (usingDefaultConsole()) {
        console.log('[Live Server] ' + strippedOutput);
      } else {
        console.append({ text: '[Live Server] ' + output, level: 'log', format: 'ansi' });
      }
    };

    var exit = function exit(code) {
      console.info('[Live Server] Exited with code ' + code);
      _this2.stopServer();
    };

    _fs2['default'].open(_path2['default'].join(targetPath, '.atom-live-server.json'), 'r', function (err, fd) {
      if (!err) {
        (function () {
          var userConfig = _json52['default'].parse(_fs2['default'].readFileSync(fd, 'utf8'));

          Object.keys(userConfig).forEach(function (key) {
            if (key === 'no-browser') {
              if (userConfig[key] === true) {
                args.push('--' + key);
                noBrowser = true;
              }
            } else if (key === 'root') {
              args.unshift('' + userConfig[key]);
            } else {
              args.push('--' + key + '=' + userConfig[key]);
            }
          });
        })();
      }

      if (!args.length) {
        args.push('--port=' + port);
      }

      serverProcess = new _atom.BufferedNodeProcess({
        command: liveServer,
        args: args,
        stdout: stdout,
        exit: exit,
        options: {
          cwd: targetPath
        }
      });

      console.info('[Live Server] live-server ' + args.join(' '));
    });
  },

  stopServer: function stopServer() {
    try {
      serverProcess.kill();
    } catch (e) {
      console.error(e);
    }

    serverProcess = null;
    var disposeStopMenu = disposeMenu;
    addStartMenu();
    disposeStopMenu && disposeStopMenu.dispose();
    atom.notifications.addSuccess('[Live Server] Live server is stopped.');
    console.info('[Live Server] Live server is stopped.');
    safeStatus('stopped');
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLWxpdmUtc2VydmVyL2xpYi9hdG9tLWxpdmUtc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFaUIsTUFBTTs7OztrQkFDUixJQUFJOzs7O21CQUNILEtBQUs7Ozs7b0JBQ2dELE1BQU07O3dCQUNwRCxVQUFVOztxQkFDZixPQUFPOzs7O3lCQUNILFlBQVk7Ozs7QUFSbEMsV0FBVyxDQUFDOztBQVVaLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUN6RSxJQUFNLFVBQVUsR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLDBDQUEwQyxDQUFDLENBQUM7O0FBRXRGLElBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsSUFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixJQUFJLFNBQVMsWUFBQSxDQUFDO0FBQ2QsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsU0FBUyxZQUFZLEdBQUc7QUFDdEIsYUFBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUN6QixDQUFDO0FBQ0MsU0FBSyxFQUFFLFVBQVU7QUFDakIsV0FBTyxFQUFHLENBQUM7QUFDVCxXQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLGFBQU8sRUFBRyxDQUFDO0FBQ1QsYUFBSyxFQUFFLGNBQWM7QUFDckIsZUFBTyxnQ0FBZ0M7T0FDeEMsQ0FBQztLQUNILENBQUM7R0FDSCxDQUFDLENBQ0gsQ0FBQztDQUNIOztBQUVELFNBQVMsbUJBQW1CLEdBQUc7QUFDN0IsU0FBTyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztDQUNsQzs7QUFFRCxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsTUFBRyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMs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QUFNLGVBQWUsR0FBRyxXQUFXLENBQUM7QUFDcEMsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsbUJBQWUsSUFBSSxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUN2RSxXQUFPLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUE7QUFDckQsY0FBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3ZCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tbGl2ZS1zZXJ2ZXIvbGliL2F0b20tbGl2ZS1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuaW1wb3J0IHsgQnVmZmVyZWROb2RlUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgcmVtb3RlIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IEpTT041IGZyb20gJ2pzb241JztcbmltcG9ydCBzdHJpcEFuc2kgZnJvbSAnc3RyaXAtYW5zaSc7XG5cbmNvbnN0IHBhY2thZ2VQYXRoID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2F0b20tbGl2ZS1zZXJ2ZXInKTtcbmNvbnN0IGxpdmVTZXJ2ZXIgPSBwYXRoLmpvaW4ocGFja2FnZVBhdGgsICcvbm9kZV9tb2R1bGVzL2xpdmUtc2VydmVyL2xpdmUtc2VydmVyLmpzJyk7XG5cbmxldCBzZXJ2ZXJQcm9jZXNzO1xubGV0IGRpc3Bvc2VNZW51O1xubGV0IG5vQnJvd3NlcjtcbmxldCBjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGU7XG5cbmZ1bmN0aW9uIGFkZFN0YXJ0TWVudSgpIHtcbiAgZGlzcG9zZU1lbnUgPSBhdG9tLm1lbnUuYWRkKFxuICAgIFt7XG4gICAgICBsYWJlbDogJ1BhY2thZ2VzJyxcbiAgICAgIHN1Ym1lbnUgOiBbe1xuICAgICAgICBsYWJlbDogJ2F0b20tbGl2ZS1zZXJ2ZXInLFxuICAgICAgICBzdWJtZW51IDogW3tcbiAgICAgICAgICBsYWJlbDogJ1N0YXJ0IHNlcnZlcicsXG4gICAgICAgICAgY29tbWFuZDogYGF0b20tbGl2ZS1zZXJ2ZXI6c3RhcnRTZXJ2ZXJgXG4gICAgICAgIH1dXG4gICAgICB9XVxuICAgIH1dXG4gICk7XG59XG5cbmZ1bmN0aW9uIHVzaW5nRGVmYXVsdENvbnNvbGUoKSB7XG4gIHJldHVybiBjb25zb2xlID09IGdsb2JhbC5jb25zb2xlO1xufVxuXG5mdW5jdGlvbiBzYWZlU3RhdHVzKHN0YXR1cykge1xuICBpZighdXNpbmdEZWZhdWx0Q29uc29sZSgpKSBjb25zb2xlLnNldFN0YXR1cyhzdGF0dXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG5cbiAgYWN0aXZhdGUoc3RhdGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnYXRvbS1saXZlLXNlcnZlcjpzdGFydC0zMDAwJzogKCkgPT4gdGhpcy5zdGFydFNlcnZlcigzMDAwKSxcbiAgICAgICdhdG9tLWxpdmUtc2VydmVyOnN0YXJ0LTQwMDAnOiAoKSA9PiB0aGlzLnN0YXJ0U2VydmVyKDQwMDApLFxuICAgICAgJ2F0b20tbGl2ZS1zZXJ2ZXI6c3RhcnQtNTAwMCc6ICgpID0+IHRoaXMuc3RhcnRTZXJ2ZXIoNTAwMCksXG4gICAgICAnYXRvbS1saXZlLXNlcnZlcjpzdGFydC04MDAwJzogKCkgPT4gdGhpcy5zdGFydFNlcnZlcig4MDAwKSxcbiAgICAgICdhdG9tLWxpdmUtc2VydmVyOnN0YXJ0LTkwMDAnOiAoKSA9PiB0aGlzLnN0YXJ0U2VydmVyKDkwMDApLFxuICAgICAgJ2F0b20tbGl2ZS1zZXJ2ZXI6c3RhcnRTZXJ2ZXInOiAoKSA9PiB0aGlzLnN0YXJ0U2VydmVyKCksXG4gICAgICAnYXRvbS1saXZlLXNlcnZlcjpzdG9wU2VydmVyJzogKCkgPT4gdGhpcy5zdG9wU2VydmVyKClcbiAgICB9KSk7XG5cbiAgICBhZGRTdGFydE1lbnUoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3RvcFNlcnZlcigpO1xuICAgIGNvbnNvbGUuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgY29uc3VtZUNvbnNvbGUoY3JlYXRlQ29uc29sZSkge1xuICAgIGxldCBtb2QgPSB0aGlzO1xuICAgIGNvbnNvbGUgPSBjcmVhdGVDb25zb2xlKHtcbiAgICAgIGlkOiAnYXRvbS1saXZlLXNlcnZlcicsXG4gICAgICBuYW1lOiAnTGl2ZSBTZXJ2ZXInLFxuICAgICAgc3RhcnQoKSB7IG1vZC5zdGFydFNlcnZlcigpOyB9LFxuICAgICAgc3RvcCgpIHsgbW9kLnN0b3BTZXJ2ZXIoKTsgfVxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7IGNvbnNvbGUgPSBudWxsOyB9KTtcbiAgfSxcblxuICBzdGFydFNlcnZlcihwb3J0ID0gMzAwMCkge1xuICAgIGlmIChzZXJ2ZXJQcm9jZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2FmZVN0YXR1cygnc3RhcnRpbmcnKTtcblxuICAgIGNvbnN0IHRhcmdldFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcblxuICAgIGlmICghdGFyZ2V0UGF0aCkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1tMaXZlIFNlcnZlcl0gWW91IGhhdmVuXFwndCBvcGVuZWQgYSBQcm9qZWN0LCB5b3UgbXVzdCBvcGVuIG9uZS4nKVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5vQnJvd3NlciA9IGZhbHNlO1xuICAgIGNvbnN0IGFyZ3MgPSBbXTtcbiAgICBjb25zdCBzdGRvdXQgPSBvdXRwdXQgPT4ge1xuICAgICAgY29uc3Qgc3RyaXBwZWRPdXRwdXQgPSBzdHJpcEFuc2kob3V0cHV0KTtcblxuICAgICAgaWYgKHN0cmlwcGVkT3V0cHV0LmluZGV4T2YoJ1NlcnZpbmcgJykgPT09IDApIHtcbiAgICAgICAgY29uc3Qgc2VydmVyVXJsID0gc3RyaXBwZWRPdXRwdXQuc3BsaXQoJyBhdCAnKVsxXTtcbiAgICAgICAgY29uc3QgcG9ydCA9IHVybC5wYXJzZShzZXJ2ZXJVcmwpLnBvcnQ7XG4gICAgICAgIGNvbnN0IGRpc3Bvc2VTdGFydE1lbnUgPSBkaXNwb3NlTWVudTtcbiAgICAgICAgZGlzcG9zZU1lbnUgPSBhdG9tLm1lbnUuYWRkKFxuICAgICAgICAgIFt7XG4gICAgICAgICAgICBsYWJlbDogJ1BhY2thZ2VzJyxcbiAgICAgICAgICAgIHN1Ym1lbnUgOiBbe1xuICAgICAgICAgICAgICBsYWJlbDogJ2F0b20tbGl2ZS1zZXJ2ZXInLFxuICAgICAgICAgICAgICBzdWJtZW51IDogW3tcbiAgICAgICAgICAgICAgICBsYWJlbDogc3RyaXBwZWRPdXRwdXQucmVwbGFjZSgnU2VydmluZyAnLCAnU3RvcCAnKS5yZXBsYWNlKC9cXHI/XFxufFxcci9nLCAnJyksXG4gICAgICAgICAgICAgICAgY29tbWFuZDogYGF0b20tbGl2ZS1zZXJ2ZXI6c3RvcFNlcnZlcmBcbiAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH1dXG4gICAgICAgICAgfV1cbiAgICAgICAgKTtcblxuICAgICAgICBkaXNwb3NlU3RhcnRNZW51LmRpc3Bvc2UoKTtcbiAgICAgICAgc2FmZVN0YXR1cygncnVubmluZycpO1xuXG4gICAgICAgIGlmIChub0Jyb3dzZXIpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgW0xpdmUgU2VydmVyXSBMaXZlIHNlcnZlciBzdGFydGVkIGF0ICR7c2VydmVyVXJsfS5gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodXNpbmdEZWZhdWx0Q29uc29sZSgpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBbTGl2ZSBTZXJ2ZXJdICR7c3RyaXBwZWRPdXRwdXR9YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmFwcGVuZCh7dGV4dDogYFtMaXZlIFNlcnZlcl0gJHtvdXRwdXR9YCwgbGV2ZWw6ICdsb2cnLCBmb3JtYXQ6ICdhbnNpJ30pO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIGNvbnN0IGV4aXQgPSBjb2RlID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbyhgW0xpdmUgU2VydmVyXSBFeGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKTtcbiAgICAgIHRoaXMuc3RvcFNlcnZlcigpO1xuICAgIH1cblxuICAgIGZzLm9wZW4ocGF0aC5qb2luKHRhcmdldFBhdGgsICcuYXRvbS1saXZlLXNlcnZlci5qc29uJyksICdyJywgKGVyciwgZmQpID0+IHtcbiAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIGNvbnN0IHVzZXJDb25maWcgPSBKU09ONS5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmQsICd1dGY4JykpO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHVzZXJDb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnbm8tYnJvd3NlcicpIHtcbiAgICAgICAgICAgIGlmICh1c2VyQ29uZmlnW2tleV0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgYXJncy5wdXNoKGAtLSR7a2V5fWApO1xuICAgICAgICAgICAgICBub0Jyb3dzZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdyb290Jykge1xuICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoYCR7dXNlckNvbmZpZ1trZXldfWApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGFyZ3MucHVzaChgLS0ke2tleX09JHt1c2VyQ29uZmlnW2tleV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgICBhcmdzLnB1c2goYC0tcG9ydD0ke3BvcnR9YCk7XG4gICAgICB9XG5cbiAgICAgIHNlcnZlclByb2Nlc3MgPSBuZXcgQnVmZmVyZWROb2RlUHJvY2Vzcyh7XG4gICAgICAgIGNvbW1hbmQ6IGxpdmVTZXJ2ZXIsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIHN0ZG91dCxcbiAgICAgICAgZXhpdCxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGN3ZDogdGFyZ2V0UGF0aFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5pbmZvKGBbTGl2ZSBTZXJ2ZXJdIGxpdmUtc2VydmVyICR7YXJncy5qb2luKCcgJyl9YCk7XG4gICAgfSk7XG4gIH0sXG5cbiAgc3RvcFNlcnZlcigpIHtcbiAgICB0cnkge1xuICAgICAgc2VydmVyUHJvY2Vzcy5raWxsKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG5cbiAgICBzZXJ2ZXJQcm9jZXNzID0gbnVsbDtcbiAgICBjb25zdCBkaXNwb3NlU3RvcE1lbnUgPSBkaXNwb3NlTWVudTtcbiAgICBhZGRTdGFydE1lbnUoKTtcbiAgICBkaXNwb3NlU3RvcE1lbnUgJiYgZGlzcG9zZVN0b3BNZW51LmRpc3Bvc2UoKTtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnW0xpdmUgU2VydmVyXSBMaXZlIHNlcnZlciBpcyBzdG9wcGVkLicpO1xuICAgIGNvbnNvbGUuaW5mbygnW0xpdmUgU2VydmVyXSBMaXZlIHNlcnZlciBpcyBzdG9wcGVkLicpXG4gICAgc2FmZVN0YXR1cygnc3RvcHBlZCcpO1xuICB9XG59O1xuIl19