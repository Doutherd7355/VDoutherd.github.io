Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.activeNotifications = new Set();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      if (!Validate.linter(linter)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = 2;
      this.linters.add(linter);
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        // Ignored by VCS, Glob, or simply not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (_this2.disabledProviders.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = Validate.messages(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            Helpers.normalizeMessages(linter.name, messages);
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });

            console.error('[Linter] Error running ' + linter.name, error);
            var notificationMessage = '[Linter] Error running ' + linter.name;
            if (Array.from(_this2.activeNotifications).some(function (item) {
              return item.getOptions().detail === notificationMessage;
            })) {
              // This message is still showing to the user!
              return;
            }

            var notification = atom.notifications.addError(notificationMessage, {
              detail: 'See Console for more info.',
              dismissable: true,
              buttons: [{
                text: 'Open Console',
                onDidClick: function onDidClick() {
                  atom.openDevTools();
                  notification.dismiss();
                }
              }, {
                text: 'Cancel',
                onDidClick: function onDidClick() {
                  notification.dismiss();
                }
              }]
            });
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.activeNotifications.forEach(function (notification) {
        return notification.dismiss();
      });
      this.activeNotifications.clear();
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFHNkMsTUFBTTs7dUJBRzFCLFdBQVc7O0lBQXhCLE9BQU87O3dCQUNPLFlBQVk7O0lBQTFCLFFBQVE7O0lBSWQsY0FBYztBQVdQLFdBWFAsY0FBYyxHQVdKOzs7MEJBWFYsY0FBYzs7QUFZaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUVwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBQSxZQUFZLEVBQUk7QUFDekQsWUFBSyxZQUFZLEdBQUcsWUFBWSxDQUFBO0tBQ2pDLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUEsU0FBUyxFQUFJO0FBQzlELFlBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQixDQUFDLENBQ0gsQ0FBQTtBQUNELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLFVBQVUsRUFBSTtBQUNyRCxZQUFLLFVBQVUsR0FBRyxVQUFVLENBQUE7S0FDN0IsQ0FBQyxDQUNILENBQUE7QUFDRCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENB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bWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby1kdXBsaWNhdGVzICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yLCBEaXNwb3NhYmxlLCBOb3RpZmljYXRpb24gfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyAkdmVyc2lvbiwgJGFjdGl2YXRlZCwgJHJlcXVlc3RMYXRlc3QsICRyZXF1ZXN0TGFzdFJlY2VpdmVkIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBMaW50ZXJSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgbGludGVyczogU2V0PExpbnRlcj5cbiAgbGludE9uQ2hhbmdlOiBib29sZWFuXG4gIGlnbm9yZVZDUzogYm9vbGVhblxuICBpZ25vcmVHbG9iOiBzdHJpbmdcbiAgbGludFByZXZpZXdUYWJzOiBib29sZWFuXG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZGlzYWJsZWRQcm92aWRlcnM6IEFycmF5PHN0cmluZz5cbiAgYWN0aXZlTm90aWZpY2F0aW9uczogU2V0PE5vdGlmaWNhdGlvbj5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucyA9IG5ldyBTZXQoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25DaGFuZ2UnLCBsaW50T25DaGFuZ2UgPT4ge1xuICAgICAgICB0aGlzLmxpbnRPbkNoYW5nZSA9IGxpbnRPbkNoYW5nZVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMnLCBpZ25vcmVWQ1MgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZVZDUyA9IGlnbm9yZVZDU1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaWdub3JlR2xvYicsIGlnbm9yZUdsb2IgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZUdsb2IgPSBpZ25vcmVHbG9iXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50UHJldmlld1RhYnMnLCBsaW50UHJldmlld1RhYnMgPT4ge1xuICAgICAgICB0aGlzLmxpbnRQcmV2aWV3VGFicyA9IGxpbnRQcmV2aWV3VGFic1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZGlzYWJsZWRQcm92aWRlcnMnLCBkaXNhYmxlZFByb3ZpZGVycyA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMgPSBkaXNhYmxlZFByb3ZpZGVyc1xuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGhhc0xpbnRlcihsaW50ZXI6IExpbnRlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmxpbnRlcnMuaGFzKGxpbnRlcilcbiAgfVxuICBhZGRMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIVZhbGlkYXRlLmxpbnRlcihsaW50ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGludGVyWyRhY3RpdmF0ZWRdID0gdHJ1ZVxuICAgIGlmICh0eXBlb2YgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpbnRlclskcmVxdWVzdExhdGVzdF0gPSAwXG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPSAwXG4gICAgfVxuICAgIGxpbnRlclskdmVyc2lvbl0gPSAyXG4gICAgdGhpcy5saW50ZXJzLmFkZChsaW50ZXIpXG4gIH1cbiAgZ2V0UHJvdmlkZXJzKCk6IEFycmF5PExpbnRlcj4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubGludGVycylcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMubGludGVycy5oYXMobGludGVyKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IGZhbHNlXG4gICAgdGhpcy5saW50ZXJzLmRlbGV0ZShsaW50ZXIpXG4gIH1cbiAgYXN5bmMgbGludCh7IG9uQ2hhbmdlLCBlZGl0b3IgfTogeyBvbkNoYW5nZTogYm9vbGVhbiwgZWRpdG9yOiBUZXh0RWRpdG9yIH0pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgIGlmIChcbiAgICAgIChvbkNoYW5nZSAmJiAhdGhpcy5saW50T25DaGFuZ2UpIHx8IC8vIExpbnQtb24tY2hhbmdlIG1pc21hdGNoXG4gICAgICAvLyBJZ25vcmVkIGJ5IFZDUywgR2xvYiwgb3Igc2ltcGx5IG5vdCBzYXZlZCBhbnl3aGVyZSB5ZXRcbiAgICAgIEhlbHBlcnMuaXNQYXRoSWdub3JlZChlZGl0b3IuZ2V0UGF0aCgpLCB0aGlzLmlnbm9yZUdsb2IsIHRoaXMuaWdub3JlVkNTKSB8fFxuICAgICAgKCF0aGlzLmxpbnRQcmV2aWV3VGFicyAmJiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0UGVuZGluZ0l0ZW0oKSA9PT0gZWRpdG9yKSAvLyBJZ25vcmUgUHJldmlldyB0YWJzXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSBIZWxwZXJzLmdldEVkaXRvckN1cnNvclNjb3BlcyhlZGl0b3IpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICBpZiAoIUhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIG9uQ2hhbmdlLCBzY29wZXMpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmNsdWRlcyhsaW50ZXIubmFtZSkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG51bWJlciA9ICsrbGludGVyWyRyZXF1ZXN0TGF0ZXN0XVxuICAgICAgY29uc3Qgc3RhdHVzQnVmZmVyID0gbGludGVyLnNjb3BlID09PSAnZmlsZScgPyBlZGl0b3IuZ2V0QnVmZmVyKCkgOiBudWxsXG4gICAgICBjb25zdCBzdGF0dXNGaWxlUGF0aCA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZmlsZVBhdGggOiBudWxsXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYmVnaW4tbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgcHJvbWlzZXMucHVzaChcbiAgICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlOiBUeXBlIHRvbyBjb21wbGV4LCBkdWhcbiAgICAgICAgICByZXNvbHZlKGxpbnRlci5saW50KGVkaXRvcikpXG4gICAgICAgIH0pLnRoZW4oXG4gICAgICAgICAgbWVzc2FnZXMgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICAgICAgaWYgKGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPj0gbnVtYmVyIHx8ICFsaW50ZXJbJGFjdGl2YXRlZF0gfHwgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gbnVtYmVyXG4gICAgICAgICAgICBpZiAoc3RhdHVzQnVmZmVyICYmICFzdGF0dXNCdWZmZXIuaXNBbGl2ZSgpKSB7XG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVzc2FnZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgLy8gTk9URTogRG8gTk9UIHVwZGF0ZSB0aGUgbWVzc2FnZXMgd2hlbiBwcm92aWRlcnMgcmV0dXJuIG51bGxcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWVcbiAgICAgICAgICAgIC8vIE5PVEU6IFdlIGFyZSBjYWxsaW5nIGl0IHdoZW4gcmVzdWx0cyBhcmUgbm90IGFuIGFycmF5IHRvIHNob3cgYSBuaWNlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgaWYgKGF0b20uaW5EZXZNb2RlKCkgfHwgIUFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgIHZhbGlkaXR5ID0gVmFsaWRhdGUubWVzc2FnZXMobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF2YWxpZGl0eSkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyOiBzdGF0dXNCdWZmZXIgfSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGVycm9yID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcblxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWAsIGVycm9yKVxuICAgICAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uTWVzc2FnZSA9IGBbTGludGVyXSBFcnJvciBydW5uaW5nICR7bGludGVyLm5hbWV9YFxuICAgICAgICAgICAgaWYgKEFycmF5LmZyb20odGhpcy5hY3RpdmVOb3RpZmljYXRpb25zKS5zb21lKGl0ZW0gPT4gaXRlbS5nZXRPcHRpb25zKCkuZGV0YWlsID09PSBub3RpZmljYXRpb25NZXNzYWdlKSkge1xuICAgICAgICAgICAgICAvLyBUaGlzIG1lc3NhZ2UgaXMgc3RpbGwgc2hvd2luZyB0byB0aGUgdXNlciFcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihub3RpZmljYXRpb25NZXNzYWdlLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogJ1NlZSBDb25zb2xlIGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0ZXh0OiAnT3BlbiBDb25zb2xlJyxcbiAgICAgICAgICAgICAgICAgIG9uRGlkQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYXRvbS5vcGVuRGV2VG9vbHMoKVxuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24uZGlzbWlzcygpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdGV4dDogJ0NhbmNlbCcsXG4gICAgICAgICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgKSxcbiAgICAgIClcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkQmVnaW5MaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1iZWdpbi1saW50aW5nJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRGaW5pc2hMaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1maW5pc2gtbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpXG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zLmNsZWFyKClcbiAgICB0aGlzLmxpbnRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMaW50ZXJSZWdpc3RyeVxuIl19