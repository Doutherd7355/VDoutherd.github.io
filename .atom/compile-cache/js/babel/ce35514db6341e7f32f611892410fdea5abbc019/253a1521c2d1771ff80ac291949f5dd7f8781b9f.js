Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var manifest = undefined;

function formatItem(item) {
  var itemName = undefined;
  if (item && typeof item === 'object' && typeof item.name === 'string') {
    itemName = item.name;
  } else if (typeof item === 'string') {
    itemName = item;
  } else {
    throw new Error('Unknown object passed to formatItem()');
  }
  return '  - ' + itemName;
}
function sortByName(item1, item2) {
  return item1.name.localeCompare(item2.name);
}

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter:enable-linter': function linterEnableLinter() {
        return _this.enableLinter();
      },
      'linter:disable-linter': function linterDisableLinter() {
        return _this.disableLinter();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter:lint': function linterLint() {
        return _this.lint();
      },
      'linter:debug': function linterDebug() {
        return _this.debug();
      },
      'linter:toggle-active-editor': function linterToggleActiveEditor() {
        return _this.toggleActiveEditor();
      }
    }));
  }

  _createClass(Commands, [{
    key: 'lint',
    value: function lint() {
      this.emitter.emit('should-lint');
    }
  }, {
    key: 'debug',
    value: function debug() {
      this.emitter.emit('should-debug');
    }
  }, {
    key: 'enableLinter',
    value: function enableLinter() {
      this.emitter.emit('should-toggle-linter', 'enable');
    }
  }, {
    key: 'disableLinter',
    value: function disableLinter() {
      this.emitter.emit('should-toggle-linter', 'disable');
    }
  }, {
    key: 'toggleActiveEditor',
    value: function toggleActiveEditor() {
      this.emitter.emit('should-toggle-active-editor');
    }
  }, {
    key: 'showDebug',
    value: function showDebug(standardLinters, indieLinters, uiProviders) {
      if (!manifest) {
        manifest = require('../package.json');
      }

      var textEditor = atom.workspace.getActiveTextEditor();
      var textEditorScopes = Helpers.getEditorCursorScopes(textEditor);
      var sortedLinters = standardLinters.slice().sort(sortByName);
      var sortedIndieLinters = indieLinters.slice().sort(sortByName);
      var sortedUIProviders = uiProviders.slice().sort(sortByName);

      var indieLinterNames = sortedIndieLinters.map(formatItem).join('\n');
      var standardLinterNames = sortedLinters.map(formatItem).join('\n');
      var matchingStandardLinters = sortedLinters.filter(function (linter) {
        return Helpers.shouldTriggerLinter(linter, false, textEditorScopes);
      }).map(formatItem).join('\n');
      var humanizedScopes = textEditorScopes.map(formatItem).join('\n');
      var uiProviderNames = sortedUIProviders.map(formatItem).join('\n');

      var ignoreGlob = atom.config.get('linter.ignoreGlob');
      var ignoreVCSIgnoredPaths = atom.config.get('core.excludeVcsIgnoredPaths');
      var disabledLinters = atom.config.get('linter.disabledProviders').map(formatItem).join('\n');
      var filePathIgnored = Helpers.isPathIgnored(textEditor.getPath(), ignoreGlob, ignoreVCSIgnoredPaths);

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + manifest.version, 'Opened file is ignored: ' + (filePathIgnored ? 'Yes' : 'No'), 'Matching Linter Providers: \n' + matchingStandardLinters, 'Disabled Linter Providers: \n' + disabledLinters, 'Standard Linter Providers: \n' + standardLinterNames, 'Indie Linter Providers: \n' + indieLinterNames, 'UI Providers: \n' + uiProviderNames, 'Ignore Glob: ' + ignoreGlob, 'VCS Ignored Paths are excluded: ' + ignoreVCSIgnoredPaths, 'Current File Scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onShouldDebug',
    value: function onShouldDebug(callback) {
      return this.emitter.on('should-debug', callback);
    }
  }, {
    key: 'onShouldToggleActiveEditor',
    value: function onShouldToggleActiveEditor(callback) {
      return this.emitter.on('should-toggle-active-editor', callback);
    }
  }, {
    key: 'onShouldToggleLinter',
    value: function onShouldToggleLinter(callback) {
      return this.emitter.on('should-toggle-linter', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2NvbW1hbmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07O3VCQUcxQixXQUFXOztJQUF4QixPQUFPOztBQUluQixJQUFJLFFBQVEsWUFBQSxDQUFBOztBQUVaLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtBQUN4QixNQUFJLFFBQVEsWUFBQSxDQUFBO0FBQ1osTUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDckUsWUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7R0FDckIsTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtBQUNuQyxZQUFRLEdBQUcsSUFBSSxDQUFBO0dBQ2hCLE1BQU07QUFDTCxVQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7R0FDekQ7QUFDRCxrQkFBYyxRQUFRLENBQUU7Q0FDekI7QUFDRCxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ2hDLFNBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQzVDOztJQUVvQixRQUFRO0FBSWhCLFdBSlEsUUFBUSxHQUliOzs7MEJBSkssUUFBUTs7QUFLekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEMsNEJBQXNCLEVBQUU7ZUFB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SSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDekQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBbEdrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlciwgVUkgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgSW5kaWVEZWxlZ2F0ZSBmcm9tICcuL2luZGllLWRlbGVnYXRlJ1xuXG5sZXQgbWFuaWZlc3RcblxuZnVuY3Rpb24gZm9ybWF0SXRlbShpdGVtKSB7XG4gIGxldCBpdGVtTmFtZVxuICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGl0ZW0ubmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpdGVtTmFtZSA9IGl0ZW0ubmFtZVxuICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgIGl0ZW1OYW1lID0gaXRlbVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBvYmplY3QgcGFzc2VkIHRvIGZvcm1hdEl0ZW0oKScpXG4gIH1cbiAgcmV0dXJuIGAgIC0gJHtpdGVtTmFtZX1gXG59XG5mdW5jdGlvbiBzb3J0QnlOYW1lKGl0ZW0xLCBpdGVtMikge1xuICByZXR1cm4gaXRlbTEubmFtZS5sb2NhbGVDb21wYXJlKGl0ZW0yLm5hbWUpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRzIHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdsaW50ZXI6ZW5hYmxlLWxpbnRlcic6ICgpID0+IHRoaXMuZW5hYmxlTGludGVyKCksXG4gICAgICAgICdsaW50ZXI6ZGlzYWJsZS1saW50ZXInOiAoKSA9PiB0aGlzLmRpc2FibGVMaW50ZXIoKSxcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLCB7XG4gICAgICAgICdsaW50ZXI6bGludCc6ICgpID0+IHRoaXMubGludCgpLFxuICAgICAgICAnbGludGVyOmRlYnVnJzogKCkgPT4gdGhpcy5kZWJ1ZygpLFxuICAgICAgICAnbGludGVyOnRvZ2dsZS1hY3RpdmUtZWRpdG9yJzogKCkgPT4gdGhpcy50b2dnbGVBY3RpdmVFZGl0b3IoKSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBsaW50KCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcpXG4gIH1cbiAgZGVidWcoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1kZWJ1ZycpXG4gIH1cbiAgZW5hYmxlTGludGVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdG9nZ2xlLWxpbnRlcicsICdlbmFibGUnKVxuICB9XG4gIGRpc2FibGVMaW50ZXIoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC10b2dnbGUtbGludGVyJywgJ2Rpc2FibGUnKVxuICB9XG4gIHRvZ2dsZUFjdGl2ZUVkaXRvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXRvZ2dsZS1hY3RpdmUtZWRpdG9yJylcbiAgfVxuICBzaG93RGVidWcoc3RhbmRhcmRMaW50ZXJzOiBBcnJheTxMaW50ZXI+LCBpbmRpZUxpbnRlcnM6IEFycmF5PEluZGllRGVsZWdhdGU+LCB1aVByb3ZpZGVyczogQXJyYXk8VUk+KSB7XG4gICAgaWYgKCFtYW5pZmVzdCkge1xuICAgICAgbWFuaWZlc3QgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKVxuICAgIH1cblxuICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCB0ZXh0RWRpdG9yU2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXModGV4dEVkaXRvcilcbiAgICBjb25zdCBzb3J0ZWRMaW50ZXJzID0gc3RhbmRhcmRMaW50ZXJzLnNsaWNlKCkuc29ydChzb3J0QnlOYW1lKVxuICAgIGNvbnN0IHNvcnRlZEluZGllTGludGVycyA9IGluZGllTGludGVycy5zbGljZSgpLnNvcnQoc29ydEJ5TmFtZSlcbiAgICBjb25zdCBzb3J0ZWRVSVByb3ZpZGVycyA9IHVpUHJvdmlkZXJzLnNsaWNlKCkuc29ydChzb3J0QnlOYW1lKVxuXG4gICAgY29uc3QgaW5kaWVMaW50ZXJOYW1lcyA9IHNvcnRlZEluZGllTGludGVycy5tYXAoZm9ybWF0SXRlbSkuam9pbignXFxuJylcbiAgICBjb25zdCBzdGFuZGFyZExpbnRlck5hbWVzID0gc29ydGVkTGludGVycy5tYXAoZm9ybWF0SXRlbSkuam9pbignXFxuJylcbiAgICBjb25zdCBtYXRjaGluZ1N0YW5kYXJkTGludGVycyA9IHNvcnRlZExpbnRlcnNcbiAgICAgIC5maWx0ZXIobGludGVyID0+IEhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIGZhbHNlLCB0ZXh0RWRpdG9yU2NvcGVzKSlcbiAgICAgIC5tYXAoZm9ybWF0SXRlbSlcbiAgICAgIC5qb2luKCdcXG4nKVxuICAgIGNvbnN0IGh1bWFuaXplZFNjb3BlcyA9IHRleHRFZGl0b3JTY29wZXMubWFwKGZvcm1hdEl0ZW0pLmpvaW4oJ1xcbicpXG4gICAgY29uc3QgdWlQcm92aWRlck5hbWVzID0gc29ydGVkVUlQcm92aWRlcnMubWFwKGZvcm1hdEl0ZW0pLmpvaW4oJ1xcbicpXG5cbiAgICBjb25zdCBpZ25vcmVHbG9iID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuaWdub3JlR2xvYicpXG4gICAgY29uc3QgaWdub3JlVkNTSWdub3JlZFBhdGhzID0gYXRvbS5jb25maWcuZ2V0KCdjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMnKVxuICAgIGNvbnN0IGRpc2FibGVkTGludGVycyA9IGF0b20uY29uZmlnXG4gICAgICAuZ2V0KCdsaW50ZXIuZGlzYWJsZWRQcm92aWRlcnMnKVxuICAgICAgLm1hcChmb3JtYXRJdGVtKVxuICAgICAgLmpvaW4oJ1xcbicpXG4gICAgY29uc3QgZmlsZVBhdGhJZ25vcmVkID0gSGVscGVycy5pc1BhdGhJZ25vcmVkKHRleHRFZGl0b3IuZ2V0UGF0aCgpLCBpZ25vcmVHbG9iLCBpZ25vcmVWQ1NJZ25vcmVkUGF0aHMpXG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTGludGVyIERlYnVnIEluZm8nLCB7XG4gICAgICBkZXRhaWw6IFtcbiAgICAgICAgYFBsYXRmb3JtOiAke3Byb2Nlc3MucGxhdGZvcm19YCxcbiAgICAgICAgYEF0b20gVmVyc2lvbjogJHthdG9tLmdldFZlcnNpb24oKX1gLFxuICAgICAgICBgTGludGVyIFZlcnNpb246ICR7bWFuaWZlc3QudmVyc2lvbn1gLFxuICAgICAgICBgT3BlbmVkIGZpbGUgaXMgaWdub3JlZDogJHtmaWxlUGF0aElnbm9yZWQgPyAnWWVzJyA6ICdObyd9YCxcbiAgICAgICAgYE1hdGNoaW5nIExpbnRlciBQcm92aWRlcnM6IFxcbiR7bWF0Y2hpbmdTdGFuZGFyZExpbnRlcnN9YCxcbiAgICAgICAgYERpc2FibGVkIExpbnRlciBQcm92aWRlcnM6IFxcbiR7ZGlzYWJsZWRMaW50ZXJzfWAsXG4gICAgICAgIGBTdGFuZGFyZCBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke3N0YW5kYXJkTGludGVyTmFtZXN9YCxcbiAgICAgICAgYEluZGllIExpbnRlciBQcm92aWRlcnM6IFxcbiR7aW5kaWVMaW50ZXJOYW1lc31gLFxuICAgICAgICBgVUkgUHJvdmlkZXJzOiBcXG4ke3VpUHJvdmlkZXJOYW1lc31gLFxuICAgICAgICBgSWdub3JlIEdsb2I6ICR7aWdub3JlR2xvYn1gLFxuICAgICAgICBgVkNTIElnbm9yZWQgUGF0aHMgYXJlIGV4Y2x1ZGVkOiAke2lnbm9yZVZDU0lnbm9yZWRQYXRoc31gLFxuICAgICAgICBgQ3VycmVudCBGaWxlIFNjb3BlczogXFxuJHtodW1hbml6ZWRTY29wZXN9YCxcbiAgICAgIF0uam9pbignXFxuJyksXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIG9uU2hvdWxkTGludChjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtbGludCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkRGVidWcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWRlYnVnJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRUb2dnbGVBY3RpdmVFZGl0b3IoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXRvZ2dsZS1hY3RpdmUtZWRpdG9yJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRUb2dnbGVMaW50ZXIoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXRvZ2dsZS1saW50ZXInLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19