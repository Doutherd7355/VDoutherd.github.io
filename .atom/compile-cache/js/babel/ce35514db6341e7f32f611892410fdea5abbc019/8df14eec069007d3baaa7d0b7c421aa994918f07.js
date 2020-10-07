Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashUniq = require('lodash/uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var _uiRegistry = require('./ui-registry');

var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

var _indieRegistry = require('./indie-registry');

var _indieRegistry2 = _interopRequireDefault(_indieRegistry);

var _messageRegistry = require('./message-registry');

var _messageRegistry2 = _interopRequireDefault(_messageRegistry);

var _linterRegistry = require('./linter-registry');

var _linterRegistry2 = _interopRequireDefault(_linterRegistry);

var _editorRegistry = require('./editor-registry');

var _editorRegistry2 = _interopRequireDefault(_editorRegistry);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _toggleView = require('./toggle-view');

var _toggleView2 = _interopRequireDefault(_toggleView);

var Linter = (function () {
  function Linter() {
    var _this = this;

    _classCallCheck(this, Linter);

    this.idleCallbacks = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.commands = new _commands2['default']();
    this.subscriptions.add(this.commands);

    this.commands.onShouldLint(function () {
      _this.registryEditorsInit();
      var editorLinter = _this.registryEditors.get(atom.workspace.getActiveTextEditor());
      if (editorLinter) {
        editorLinter.lint();
      }
    });
    this.commands.onShouldToggleActiveEditor(function () {
      var textEditor = atom.workspace.getActiveTextEditor();
      _this.registryEditorsInit();
      var editor = _this.registryEditors.get(textEditor);
      if (editor) {
        editor.dispose();
      } else if (textEditor) {
        _this.registryEditors.createFromTextEditor(textEditor);
      }
    });
    this.commands.onShouldDebug(_asyncToGenerator(function* () {
      _this.registryUIInit();
      _this.registryIndieInit();
      _this.registryLintersInit();
      _this.commands.showDebug(_this.registryLinters.getProviders(), _this.registryIndie.getProviders(), _this.registryUI.getProviders());
    }));
    this.commands.onShouldToggleLinter(function (action) {
      _this.registryLintersInit();
      var toggleView = new _toggleView2['default'](action, (0, _lodashUniq2['default'])(_this.registryLinters.getProviders().map(function (linter) {
        return linter.name;
      })));
      toggleView.onDidDispose(function () {
        _this.subscriptions.remove(toggleView);
      });
      toggleView.onDidDisable(function (name) {
        var linter = _this.registryLinters.getProviders().find(function (entry) {
          return entry.name === name;
        });
        if (linter) {
          _this.registryMessagesInit();
          _this.registryMessages.deleteByLinter(linter);
        }
      });
      toggleView.show();
      _this.subscriptions.add(toggleView);
    });

    var projectPathChangeCallbackID = window.requestIdleCallback((function projectPathChange() {
      var _this2 = this;

      this.idleCallbacks['delete'](projectPathChangeCallbackID);
      // NOTE: Atom triggers this on boot so wait a while
      this.subscriptions.add(atom.project.onDidChangePaths(function () {
        _this2.commands.lint();
      }));
    }).bind(this));
    this.idleCallbacks.add(projectPathChangeCallbackID);

    var registryEditorsInitCallbackID = window.requestIdleCallback((function registryEditorsIdleInit() {
      this.idleCallbacks['delete'](registryEditorsInitCallbackID);
      // This will be called on the fly if needed, but needs to run on it's
      // own at some point or linting on open or on change will never trigger
      this.registryEditorsInit();
    }).bind(this));
    this.idleCallbacks.add(registryEditorsInitCallbackID);
  }

  _createClass(Linter, [{
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
    }
  }, {
    key: 'registryEditorsInit',
    value: function registryEditorsInit() {
      var _this3 = this;

      if (this.registryEditors) {
        return;
      }
      this.registryEditors = new _editorRegistry2['default']();
      this.subscriptions.add(this.registryEditors);
      this.registryEditors.observe(function (editorLinter) {
        editorLinter.onShouldLint(function (onChange) {
          _this3.registryLintersInit();
          _this3.registryLinters.lint({ onChange: onChange, editor: editorLinter.getEditor() });
        });
        editorLinter.onDidDestroy(function () {
          _this3.registryMessagesInit();

          if (!_this3.registryEditors.hasSibling(editorLinter)) {
            _this3.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
          }
        });
      });
      this.registryEditors.activate();
    }
  }, {
    key: 'registryLintersInit',
    value: function registryLintersInit() {
      var _this4 = this;

      if (this.registryLinters) {
        return;
      }
      this.registryLinters = new _linterRegistry2['default']();
      this.subscriptions.add(this.registryLinters);
      this.registryLinters.onDidUpdateMessages(function (_ref) {
        var linter = _ref.linter;
        var messages = _ref.messages;
        var buffer = _ref.buffer;

        _this4.registryMessagesInit();
        _this4.registryMessages.set({ linter: linter, messages: messages, buffer: buffer });
      });
      this.registryLinters.onDidBeginLinting(function (_ref2) {
        var linter = _ref2.linter;
        var filePath = _ref2.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didBeginLinting(linter, filePath);
      });
      this.registryLinters.onDidFinishLinting(function (_ref3) {
        var linter = _ref3.linter;
        var filePath = _ref3.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'registryIndieInit',
    value: function registryIndieInit() {
      var _this5 = this;

      if (this.registryIndie) {
        return;
      }
      this.registryIndie = new _indieRegistry2['default']();
      this.subscriptions.add(this.registryIndie);
      this.registryIndie.observe(function (indieLinter) {
        indieLinter.onDidDestroy(function () {
          _this5.registryMessagesInit();
          _this5.registryMessages.deleteByLinter(indieLinter);
        });
      });
      this.registryIndie.onDidUpdate(function (_ref4) {
        var linter = _ref4.linter;
        var messages = _ref4.messages;

        _this5.registryMessagesInit();
        _this5.registryMessages.set({ linter: linter, messages: messages, buffer: null });
      });
    }
  }, {
    key: 'registryMessagesInit',
    value: function registryMessagesInit() {
      var _this6 = this;

      if (this.registryMessages) {
        return;
      }
      this.registryMessages = new _messageRegistry2['default']();
      this.subscriptions.add(this.registryMessages);
      this.registryMessages.onDidUpdateMessages(function (difference) {
        _this6.registryUIInit();
        _this6.registryUI.render(difference);
      });
    }
  }, {
    key: 'registryUIInit',
    value: function registryUIInit() {
      if (this.registryUI) {
        return;
      }
      this.registryUI = new _uiRegistry2['default']();
      this.subscriptions.add(this.registryUI);
    }

    // API methods for providing/consuming services
    // UI
  }, {
    key: 'addUI',
    value: function addUI(ui) {
      this.registryUIInit();
      this.registryUI.add(ui);
      this.registryMessagesInit();
      var messages = this.registryMessages.messages;

      if (messages.length) {
        ui.render({ added: messages, messages: messages, removed: [] });
      }
    }
  }, {
    key: 'deleteUI',
    value: function deleteUI(ui) {
      this.registryUIInit();
      this.registryUI['delete'](ui);
    }

    // Standard Linter
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      this.registryLintersInit();
      this.registryLinters.addLinter(linter);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      this.registryLintersInit();
      this.registryLinters.deleteLinter(linter);
      this.registryMessagesInit();
      this.registryMessages.deleteByLinter(linter);
    }

    // Indie Linter
  }, {
    key: 'addIndie',
    value: function addIndie(indie) {
      this.registryIndieInit();
      return this.registryIndie.register(indie, 2);
    }
  }]);

  return Linter;
})();

exports['default'] = Linter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzBCQUV3QixhQUFhOzs7O29CQUNELE1BQU07OzBCQUVuQixlQUFlOzs7OzZCQUNaLGtCQUFrQjs7OzsrQkFDaEIsb0JBQW9COzs7OzhCQUNyQixtQkFBbUI7Ozs7OEJBQ2xCLG1CQUFtQjs7Ozt3QkFDMUIsWUFBWTs7OzswQkFDVixlQUFlOzs7O0lBR2hDLE1BQU07QUFVQyxXQVZQLE1BQU0sR0FVSTs7OzBCQVZWLE1BQU07O0FBV1IsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFFBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDL0IsWUFBSyxtQkFBbUIsRUFBRSxDQUFBO0FBQzFCLFVBQU0sWUFBWSxHQUFHLE1BQUssZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtBQUNuRixVQUFJLFlBQVksRUFBRTtBQUNoQixvQkFBWSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ3BCO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxZQUFNO0FBQzdDLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUN2RCxZQUFLLG1CQUFtQixFQUFFLENBQUE7QUFDMUIsVUFBTSxNQUFNLEdBQUcsTUFBSyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FB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QUFBO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQzdDOzs7U0FwTUcsTUFBTTs7O3FCQXVNRyxNQUFNIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgYXJyYXlVbmlxdWUgZnJvbSAnbG9kYXNoL3VuaXEnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IFVJUmVnaXN0cnkgZnJvbSAnLi91aS1yZWdpc3RyeSdcbmltcG9ydCBJbmRpZVJlZ2lzdHJ5IGZyb20gJy4vaW5kaWUtcmVnaXN0cnknXG5pbXBvcnQgTWVzc2FnZVJlZ2lzdHJ5IGZyb20gJy4vbWVzc2FnZS1yZWdpc3RyeSdcbmltcG9ydCBMaW50ZXJSZWdpc3RyeSBmcm9tICcuL2xpbnRlci1yZWdpc3RyeSdcbmltcG9ydCBFZGl0b3JzUmVnaXN0cnkgZnJvbSAnLi9lZGl0b3ItcmVnaXN0cnknXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBUb2dnbGVWaWV3IGZyb20gJy4vdG9nZ2xlLXZpZXcnXG5pbXBvcnQgdHlwZSB7IFVJLCBMaW50ZXIgYXMgTGludGVyUHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBMaW50ZXIge1xuICBjb21tYW5kczogQ29tbWFuZHNcbiAgcmVnaXN0cnlVSTogVUlSZWdpc3RyeVxuICByZWdpc3RyeUluZGllOiBJbmRpZVJlZ2lzdHJ5XG4gIHJlZ2lzdHJ5RWRpdG9yczogRWRpdG9yc1JlZ2lzdHJ5XG4gIHJlZ2lzdHJ5TGludGVyczogTGludGVyUmVnaXN0cnlcbiAgcmVnaXN0cnlNZXNzYWdlczogTWVzc2FnZVJlZ2lzdHJ5XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgaWRsZUNhbGxiYWNrczogU2V0PG51bWJlcj5cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG5cbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkTGludCgoKSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9yc0luaXQoKVxuICAgICAgY29uc3QgZWRpdG9yTGludGVyID0gdGhpcy5yZWdpc3RyeUVkaXRvcnMuZ2V0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmxpbnQoKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZFRvZ2dsZUFjdGl2ZUVkaXRvcigoKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9yc0luaXQoKVxuICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5yZWdpc3RyeUVkaXRvcnMuZ2V0KHRleHRFZGl0b3IpXG4gICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgIGVkaXRvci5kaXNwb3NlKClcbiAgICAgIH0gZWxzZSBpZiAodGV4dEVkaXRvcikge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5jcmVhdGVGcm9tVGV4dEVkaXRvcih0ZXh0RWRpdG9yKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZERlYnVnKGFzeW5jICgpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeUluZGllSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgICAgdGhpcy5jb21tYW5kcy5zaG93RGVidWcoXG4gICAgICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldFByb3ZpZGVycygpLFxuICAgICAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUuZ2V0UHJvdmlkZXJzKCksXG4gICAgICAgIHRoaXMucmVnaXN0cnlVSS5nZXRQcm92aWRlcnMoKSxcbiAgICAgIClcbiAgICB9KVxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRUb2dnbGVMaW50ZXIoYWN0aW9uID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzSW5pdCgpXG4gICAgICBjb25zdCB0b2dnbGVWaWV3ID0gbmV3IFRvZ2dsZVZpZXcoYWN0aW9uLCBhcnJheVVuaXF1ZSh0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRQcm92aWRlcnMoKS5tYXAobGludGVyID0+IGxpbnRlci5uYW1lKSkpXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUodG9nZ2xlVmlldylcbiAgICAgIH0pXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzYWJsZShuYW1lID0+IHtcbiAgICAgICAgY29uc3QgbGludGVyID0gdGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0UHJvdmlkZXJzKCkuZmluZChlbnRyeSA9PiBlbnRyeS5uYW1lID09PSBuYW1lKVxuICAgICAgICBpZiAobGludGVyKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGxpbnRlcilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvZ2dsZVZpZXcuc2hvdygpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRvZ2dsZVZpZXcpXG4gICAgfSlcblxuICAgIGNvbnN0IHByb2plY3RQYXRoQ2hhbmdlQ2FsbGJhY2tJRCA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKFxuICAgICAgZnVuY3Rpb24gcHJvamVjdFBhdGhDaGFuZ2UoKSB7XG4gICAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUocHJvamVjdFBhdGhDaGFuZ2VDYWxsYmFja0lEKVxuICAgICAgICAvLyBOT1RFOiBBdG9tIHRyaWdnZXJzIHRoaXMgb24gYm9vdCBzbyB3YWl0IGEgd2hpbGVcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRzLmxpbnQoKVxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgKVxuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQocHJvamVjdFBhdGhDaGFuZ2VDYWxsYmFja0lEKVxuXG4gICAgY29uc3QgcmVnaXN0cnlFZGl0b3JzSW5pdENhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhcbiAgICAgIGZ1bmN0aW9uIHJlZ2lzdHJ5RWRpdG9yc0lkbGVJbml0KCkge1xuICAgICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKHJlZ2lzdHJ5RWRpdG9yc0luaXRDYWxsYmFja0lEKVxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgY2FsbGVkIG9uIHRoZSBmbHkgaWYgbmVlZGVkLCBidXQgbmVlZHMgdG8gcnVuIG9uIGl0J3NcbiAgICAgICAgLy8gb3duIGF0IHNvbWUgcG9pbnQgb3IgbGludGluZyBvbiBvcGVuIG9yIG9uIGNoYW5nZSB3aWxsIG5ldmVyIHRyaWdnZXJcbiAgICAgICAgdGhpcy5yZWdpc3RyeUVkaXRvcnNJbml0KClcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICApXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIHJlZ2lzdHJ5RWRpdG9yc0luaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlFZGl0b3JzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMgPSBuZXcgRWRpdG9yc1JlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlFZGl0b3JzKVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLm9ic2VydmUoZWRpdG9yTGludGVyID0+IHtcbiAgICAgIGVkaXRvckxpbnRlci5vblNob3VsZExpbnQob25DaGFuZ2UgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgICAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5saW50KHsgb25DaGFuZ2UsIGVkaXRvcjogZWRpdG9yTGludGVyLmdldEVkaXRvcigpIH0pXG4gICAgICB9KVxuICAgICAgZWRpdG9yTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuXG4gICAgICAgIGlmICghdGhpcy5yZWdpc3RyeUVkaXRvcnMuaGFzU2libGluZyhlZGl0b3JMaW50ZXIpKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5QnVmZmVyKGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKS5nZXRCdWZmZXIoKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLmFjdGl2YXRlKClcbiAgfVxuICByZWdpc3RyeUxpbnRlcnNJbml0KCkge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5TGludGVycykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzID0gbmV3IExpbnRlclJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlMaW50ZXJzKVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLm9uRGlkVXBkYXRlTWVzc2FnZXMoKHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLnNldCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlciB9KVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRCZWdpbkxpbnRpbmcoKHsgbGludGVyLCBmaWxlUGF0aCB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5kaWRCZWdpbkxpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLm9uRGlkRmluaXNoTGludGluZygoeyBsaW50ZXIsIGZpbGVQYXRoIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeVVJLmRpZEZpbmlzaExpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICB9KVxuICB9XG4gIHJlZ2lzdHJ5SW5kaWVJbml0KCkge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5SW5kaWUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5SW5kaWUpXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9ic2VydmUoaW5kaWVMaW50ZXIgPT4ge1xuICAgICAgaW5kaWVMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUxpbnRlcihpbmRpZUxpbnRlcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUub25EaWRVcGRhdGUoKHsgbGludGVyLCBtZXNzYWdlcyB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5zZXQoeyBsaW50ZXIsIG1lc3NhZ2VzLCBidWZmZXI6IG51bGwgfSlcbiAgICB9KVxuICB9XG4gIHJlZ2lzdHJ5TWVzc2FnZXNJbml0KCkge1xuICAgIGlmICh0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMgPSBuZXcgTWVzc2FnZVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlNZXNzYWdlcylcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMub25EaWRVcGRhdGVNZXNzYWdlcyhkaWZmZXJlbmNlID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeVVJLnJlbmRlcihkaWZmZXJlbmNlKVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0cnlVSUluaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlVSSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVnaXN0cnlVSSA9IG5ldyBVSVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlVSSlcbiAgfVxuXG4gIC8vIEFQSSBtZXRob2RzIGZvciBwcm92aWRpbmcvY29uc3VtaW5nIHNlcnZpY2VzXG4gIC8vIFVJXG4gIGFkZFVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgIHRoaXMucmVnaXN0cnlVSS5hZGQodWkpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgY29uc3QgeyBtZXNzYWdlcyB9ID0gdGhpcy5yZWdpc3RyeU1lc3NhZ2VzXG4gICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgdWkucmVuZGVyKHsgYWRkZWQ6IG1lc3NhZ2VzLCBtZXNzYWdlcywgcmVtb3ZlZDogW10gfSlcbiAgICB9XG4gIH1cbiAgZGVsZXRlVUkodWk6IFVJKSB7XG4gICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgdGhpcy5yZWdpc3RyeVVJLmRlbGV0ZSh1aSlcbiAgfVxuICAvLyBTdGFuZGFyZCBMaW50ZXJcbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmFkZExpbnRlcihsaW50ZXIpXG4gIH1cbiAgZGVsZXRlTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmRlbGV0ZUxpbnRlcihsaW50ZXIpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGxpbnRlcilcbiAgfVxuICAvLyBJbmRpZSBMaW50ZXJcbiAgYWRkSW5kaWUoaW5kaWU6IE9iamVjdCkge1xuICAgIHRoaXMucmVnaXN0cnlJbmRpZUluaXQoKVxuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJ5SW5kaWUucmVnaXN0ZXIoaW5kaWUsIDIpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGludGVyXG4iXX0=