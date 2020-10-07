Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var _helpers = require('./helpers');

var IndieDelegate = (function () {
  function IndieDelegate(indie, version) {
    _classCallCheck(this, IndieDelegate);

    this.indie = indie;
    this.scope = 'project';
    this.version = version;
    this.emitter = new _atom.Emitter();
    this.messages = new Map();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieDelegate, [{
    key: 'getMessages',
    value: function getMessages() {
      return Array.from(this.messages.values()).reduce(function (toReturn, entry) {
        return toReturn.concat(entry);
      }, []);
    }
  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      if (!this.subscriptions.disposed) {
        this.emitter.emit('did-update', []);
        this.messages.clear();
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(filePath) {
      var messages = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      // v2 Support from here on
      if (typeof filePath !== 'string' || !Array.isArray(messages)) {
        throw new Error('Invalid Parameters to setMessages()');
      }
      if (this.subscriptions.disposed || !Validate.messages(this.name, messages)) {
        return;
      }
      messages.forEach(function (message) {
        if (message.location.file !== filePath) {
          console.debug('[Linter-UI-Default] Expected File', filePath, 'Message', message);
          throw new Error('message.location.file does not match the given filePath');
        }
      });

      (0, _helpers.normalizeMessages)(this.name, messages);
      this.messages.set(filePath, messages);
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'setAllMessages',
    value: function setAllMessages(messages) {
      if (this.subscriptions.disposed) {
        return;
      }

      if (atom.inDevMode() || !Array.isArray(messages)) {
        if (!Validate.messages(this.name, messages)) return;
      }
      (0, _helpers.normalizeMessages)(this.name, messages);

      this.messages.clear();
      for (var i = 0, _length = messages.length; i < _length; ++i) {
        var message = messages[i];
        var filePath = message.location.file;
        var fileMessages = this.messages.get(filePath);
        if (!fileMessages) {
          this.messages.set(filePath, fileMessages = []);
        }
        fileMessages.push(message);
      }
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.messages.clear();
    }
  }, {
    key: 'name',
    get: function get() {
      return this.indie.name;
    }
  }]);

  return IndieDelegate;
})();

exports['default'] = IndieDelegate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLWRlbGVnYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07O3dCQUd6QixZQUFZOztJQUExQixRQUFROzt1QkFDYyxXQUFXOztJQUd4QixhQUFhO0FBUXJCLFdBUlEsYUFBYSxDQVFwQixLQUFZLEVBQUUsT0FBVSxFQUFFOzBCQVJuQixhQUFhOztBQVM5QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtBQUN0QixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFqQmtCLGFBQWE7O1dBcUJyQix1QkFBbUI7QUFDNUIsYUFBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBUyxRQUFRLEVBQUUsS0FBSyxFQUFFO0FBQ3pFLGVBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5QixFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ1A7OztXQUNZLHlCQUFTO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUNoQyxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDbkMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUs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QUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ3RCOzs7U0FqRU8sZUFBVztBQUNqQixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO0tBQ3ZCOzs7U0FwQmtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLWRlbGVnYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHsgbm9ybWFsaXplTWVzc2FnZXMgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IEluZGllLCBNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWVEZWxlZ2F0ZSB7XG4gIGluZGllOiBJbmRpZVxuICBzY29wZTogJ3Byb2plY3QnXG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgdmVyc2lvbjogMlxuICBtZXNzYWdlczogTWFwPD9zdHJpbmcsIEFycmF5PE1lc3NhZ2U+PlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3RydWN0b3IoaW5kaWU6IEluZGllLCB2ZXJzaW9uOiAyKSB7XG4gICAgdGhpcy5pbmRpZSA9IGluZGllXG4gICAgdGhpcy5zY29wZSA9ICdwcm9qZWN0J1xuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW5kaWUubmFtZVxuICB9XG4gIGdldE1lc3NhZ2VzKCk6IEFycmF5PE1lc3NhZ2U+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm1lc3NhZ2VzLnZhbHVlcygpKS5yZWR1Y2UoZnVuY3Rpb24odG9SZXR1cm4sIGVudHJ5KSB7XG4gICAgICByZXR1cm4gdG9SZXR1cm4uY29uY2F0KGVudHJ5KVxuICAgIH0sIFtdKVxuICB9XG4gIGNsZWFyTWVzc2FnZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgW10pXG4gICAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB9XG4gIH1cbiAgc2V0TWVzc2FnZXMoZmlsZVBhdGg6IHN0cmluZyB8IEFycmF5PE9iamVjdD4sIG1lc3NhZ2VzOiA/QXJyYXk8T2JqZWN0PiA9IG51bGwpOiB2b2lkIHtcbiAgICAvLyB2MiBTdXBwb3J0IGZyb20gaGVyZSBvblxuICAgIGlmICh0eXBlb2YgZmlsZVBhdGggIT09ICdzdHJpbmcnIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFBhcmFtZXRlcnMgdG8gc2V0TWVzc2FnZXMoKScpXG4gICAgfVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZWQgfHwgIVZhbGlkYXRlLm1lc3NhZ2VzKHRoaXMubmFtZSwgbWVzc2FnZXMpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS5sb2NhdGlvbi5maWxlICE9PSBmaWxlUGF0aCkge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdbTGludGVyLVVJLURlZmF1bHRdIEV4cGVjdGVkIEZpbGUnLCBmaWxlUGF0aCwgJ01lc3NhZ2UnLCBtZXNzYWdlKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21lc3NhZ2UubG9jYXRpb24uZmlsZSBkb2VzIG5vdCBtYXRjaCB0aGUgZ2l2ZW4gZmlsZVBhdGgnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBub3JtYWxpemVNZXNzYWdlcyh0aGlzLm5hbWUsIG1lc3NhZ2VzKVxuICAgIHRoaXMubWVzc2FnZXMuc2V0KGZpbGVQYXRoLCBtZXNzYWdlcylcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScsIHRoaXMuZ2V0TWVzc2FnZXMoKSlcbiAgfVxuICBzZXRBbGxNZXNzYWdlcyhtZXNzYWdlczogQXJyYXk8T2JqZWN0Pik6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChhdG9tLmluRGV2TW9kZSgpIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgaWYgKCFWYWxpZGF0ZS5tZXNzYWdlcyh0aGlzLm5hbWUsIG1lc3NhZ2VzKSkgcmV0dXJuXG4gICAgfVxuICAgIG5vcm1hbGl6ZU1lc3NhZ2VzKHRoaXMubmFtZSwgbWVzc2FnZXMpXG5cbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IG1lc3NhZ2VzOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2U6IE1lc3NhZ2UgPSBtZXNzYWdlc1tpXVxuICAgICAgY29uc3QgZmlsZVBhdGggPSBtZXNzYWdlLmxvY2F0aW9uLmZpbGVcbiAgICAgIGxldCBmaWxlTWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzLmdldChmaWxlUGF0aClcbiAgICAgIGlmICghZmlsZU1lc3NhZ2VzKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMuc2V0KGZpbGVQYXRoLCAoZmlsZU1lc3NhZ2VzID0gW10pKVxuICAgICAgfVxuICAgICAgZmlsZU1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB0aGlzLmdldE1lc3NhZ2VzKCkpXG4gIH1cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gIH1cbn1cbiJdfQ==