Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashDebounce = require('lodash/debounce');

var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);

var _helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    _classCallCheck(this, MessageRegistry);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.messagesMap = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.debouncedUpdate = (0, _lodashDebounce2['default'])(this.update, 100, { leading: true });

    this.subscriptions.add(this.emitter);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var messages = _ref.messages;
      var linter = _ref.linter;
      var buffer = _ref.buffer;
      return (function () {
        var found = null;
        for (var entry of this.messagesMap) {
          if (entry.buffer === buffer && entry.linter === linter) {
            found = entry;
            break;
          }
        }

        if (found) {
          found.messages = messages;
          found.changed = true;
        } else {
          this.messagesMap.add({ messages: messages, linter: linter, buffer: buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
      }).apply(this, arguments);
    }
  }, {
    key: 'update',
    value: function update() {
      var result = { added: [], removed: [], messages: [] };

      for (var entry of this.messagesMap) {
        if (entry.deleted) {
          result.removed = result.removed.concat(entry.oldMessages);
          this.messagesMap['delete'](entry);
          continue;
        }
        if (!entry.changed) {
          result.messages = result.messages.concat(entry.oldMessages);
          continue;
        }
        entry.changed = false;
        if (!entry.oldMessages.length) {
          // All messages are new, no need to diff
          // NOTE: No need to add .key here because normalizeMessages already does that
          result.added = result.added.concat(entry.messages);
          result.messages = result.messages.concat(entry.messages);
          entry.oldMessages = entry.messages;
          continue;
        }
        if (!entry.messages.length) {
          // All messages are old, no need to diff
          result.removed = result.removed.concat(entry.oldMessages);
          entry.oldMessages = [];
          continue;
        }

        var newKeys = new Set();
        var oldKeys = new Set();
        var _oldMessages = entry.oldMessages;

        var foundNew = false;
        entry.oldMessages = [];

        for (var i = 0, _length = _oldMessages.length; i < _length; ++i) {
          var message = _oldMessages[i];
          message.key = (0, _helpers.messageKey)(message);
          oldKeys.add(message.key);
        }

        for (var i = 0, _length2 = entry.messages.length; i < _length2; ++i) {
          var message = entry.messages[i];
          if (newKeys.has(message.key)) {
            continue;
          }
          newKeys.add(message.key);
          if (!oldKeys.has(message.key)) {
            foundNew = true;
            result.added.push(message);
            result.messages.push(message);
            entry.oldMessages.push(message);
          }
        }

        if (!foundNew && entry.messages.length === _oldMessages.length) {
          // Messages are unchanged
          result.messages = result.messages.concat(_oldMessages);
          entry.oldMessages = _oldMessages;
          continue;
        }

        for (var i = 0, _length3 = _oldMessages.length; i < _length3; ++i) {
          var message = _oldMessages[i];
          if (newKeys.has(message.key)) {
            entry.oldMessages.push(message);
            result.messages.push(message);
          } else {
            result.removed.push(message);
          }
        }
      }

      if (result.added.length || result.removed.length) {
        this.messages = result.messages;
        this.emitter.emit('did-update-messages', result);
      }
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteByBuffer',
    value: function deleteByBuffer(buffer) {
      for (var entry of this.messagesMap) {
        if (entry.buffer === buffer) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'deleteByLinter',
    value: function deleteByLinter(linter) {
      for (var entry of this.messagesMap) {
        if (entry.linter === linter) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return MessageRegistry;
})();

exports['default'] = MessageRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7OEJBQzlCLGlCQUFpQjs7Ozt1QkFFWCxXQUFXOztJQVloQyxlQUFlO0FBT1IsV0FQUCxlQUFlLEdBT0w7MEJBUFYsZUFBZTs7QUFRakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxlQUFlLEdBQUcsaUNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTs7QUFFcEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQWZHLGVBQWU7O1dBZ0JoQixhQUFDLElBQThGO1VBQTVGLFFBQVEsR0FBVixJQUE4RixDQUE1RixRQUFRO1VBQUUsTUFBTSxHQUFsQixJQUE4RixDQUFsRixNQUFNO1VBQUUsTUFBTSxHQUExQixJQUE4RixDQUExRSxNQUFNOzBCQUFzRTtBQUNsRyxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDaEIsYUFBSyxJQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BDLGNBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7QUFDdEQsaUJBQUssR0FBRyxLQUFLLENBQUE7QUFDYixrQkFBSztXQUNOO1NBQ0Y7O0FBRUQsWUFBSSxLQUFLLEVBQUU7QUFDVCxlQUFLLENBQUMsUUFB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dGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlLCBUZXh0QnVmZmVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IG1lc3NhZ2VLZXkgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VzUGF0Y2gsIE1lc3NhZ2UsIExpbnRlciB9IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgTGludGVyJE1lc3NhZ2UkTWFwID0ge1xuICBidWZmZXI6ID9UZXh0QnVmZmVyLFxuICBsaW50ZXI6IExpbnRlcixcbiAgY2hhbmdlZDogYm9vbGVhbixcbiAgZGVsZXRlZDogYm9vbGVhbixcbiAgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+LFxuICBvbGRNZXNzYWdlczogQXJyYXk8TWVzc2FnZT4sXG59XG5cbmNsYXNzIE1lc3NhZ2VSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+XG4gIG1lc3NhZ2VzTWFwOiBTZXQ8TGludGVyJE1lc3NhZ2UkTWFwPlxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGRlYm91bmNlZFVwZGF0ZTogKCkgPT4gdm9pZFxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLm1lc3NhZ2VzTWFwID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZGVib3VuY2VkVXBkYXRlID0gZGVib3VuY2UodGhpcy51cGRhdGUsIDEwMCwgeyBsZWFkaW5nOiB0cnVlIH0pXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBzZXQoeyBtZXNzYWdlcywgbGludGVyLCBidWZmZXIgfTogeyBtZXNzYWdlczogQXJyYXk8TWVzc2FnZT4sIGxpbnRlcjogTGludGVyLCBidWZmZXI6IFRleHRCdWZmZXIgfSkge1xuICAgIGxldCBmb3VuZCA9IG51bGxcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5idWZmZXIgPT09IGJ1ZmZlciAmJiBlbnRyeS5saW50ZXIgPT09IGxpbnRlcikge1xuICAgICAgICBmb3VuZCA9IGVudHJ5XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBmb3VuZC5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgICBmb3VuZC5jaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzTWFwLmFkZCh7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlciwgb2xkTWVzc2FnZXM6IFtdLCBjaGFuZ2VkOiB0cnVlLCBkZWxldGVkOiBmYWxzZSB9KVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgdXBkYXRlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgYWRkZWQ6IFtdLCByZW1vdmVkOiBbXSwgbWVzc2FnZXM6IFtdIH1cblxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5tZXNzYWdlc01hcCkge1xuICAgICAgaWYgKGVudHJ5LmRlbGV0ZWQpIHtcbiAgICAgICAgcmVzdWx0LnJlbW92ZWQgPSByZXN1bHQucmVtb3ZlZC5jb25jYXQoZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIHRoaXMubWVzc2FnZXNNYXAuZGVsZXRlKGVudHJ5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKCFlbnRyeS5jaGFuZ2VkKSB7XG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcy5jb25jYXQoZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBlbnRyeS5jaGFuZ2VkID0gZmFsc2VcbiAgICAgIGlmICghZW50cnkub2xkTWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEFsbCBtZXNzYWdlcyBhcmUgbmV3LCBubyBuZWVkIHRvIGRpZmZcbiAgICAgICAgLy8gTk9URTogTm8gbmVlZCB0byBhZGQgLmtleSBoZXJlIGJlY2F1c2Ugbm9ybWFsaXplTWVzc2FnZXMgYWxyZWFkeSBkb2VzIHRoYXRcbiAgICAgICAgcmVzdWx0LmFkZGVkID0gcmVzdWx0LmFkZGVkLmNvbmNhdChlbnRyeS5tZXNzYWdlcylcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzLmNvbmNhdChlbnRyeS5tZXNzYWdlcylcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBlbnRyeS5tZXNzYWdlc1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKCFlbnRyeS5tZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQWxsIG1lc3NhZ2VzIGFyZSBvbGQsIG5vIG5lZWQgdG8gZGlmZlxuICAgICAgICByZXN1bHQucmVtb3ZlZCA9IHJlc3VsdC5yZW1vdmVkLmNvbmNhdChlbnRyeS5vbGRNZXNzYWdlcylcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBbXVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdLZXlzID0gbmV3IFNldCgpXG4gICAgICBjb25zdCBvbGRLZXlzID0gbmV3IFNldCgpXG4gICAgICBjb25zdCB7IG9sZE1lc3NhZ2VzIH0gPSBlbnRyeVxuICAgICAgbGV0IGZvdW5kTmV3ID0gZmFsc2VcbiAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzID0gW11cblxuICAgICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBvbGRNZXNzYWdlczsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvbGRNZXNzYWdlc1tpXVxuICAgICAgICBtZXNzYWdlLmtleSA9IG1lc3NhZ2VLZXkobWVzc2FnZSlcbiAgICAgICAgb2xkS2V5cy5hZGQobWVzc2FnZS5rZXkpXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gZW50cnkubWVzc2FnZXM7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZW50cnkubWVzc2FnZXNbaV1cbiAgICAgICAgaWYgKG5ld0tleXMuaGFzKG1lc3NhZ2Uua2V5KSkge1xuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgICAgbmV3S2V5cy5hZGQobWVzc2FnZS5rZXkpXG4gICAgICAgIGlmICghb2xkS2V5cy5oYXMobWVzc2FnZS5rZXkpKSB7XG4gICAgICAgICAgZm91bmROZXcgPSB0cnVlXG4gICAgICAgICAgcmVzdWx0LmFkZGVkLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kTmV3ICYmIGVudHJ5Lm1lc3NhZ2VzLmxlbmd0aCA9PT0gb2xkTWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIE1lc3NhZ2VzIGFyZSB1bmNoYW5nZWRcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzLmNvbmNhdChvbGRNZXNzYWdlcylcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBvbGRNZXNzYWdlc1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IG9sZE1lc3NhZ2VzOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG9sZE1lc3NhZ2VzW2ldXG4gICAgICAgIGlmIChuZXdLZXlzLmhhcyhtZXNzYWdlLmtleSkpIHtcbiAgICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQucmVtb3ZlZC5wdXNoKG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0LmFkZGVkLmxlbmd0aCB8fCByZXN1bHQucmVtb3ZlZC5sZW5ndGgpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXNcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgcmVzdWx0KVxuICAgIH1cbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrOiAoZGlmZmVyZW5jZTogTWVzc2FnZXNQYXRjaCkgPT4gdm9pZCk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBkZWxldGVCeUJ1ZmZlcihidWZmZXI6IFRleHRCdWZmZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5idWZmZXIgPT09IGJ1ZmZlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGVsZXRlQnlMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5saW50ZXIgPT09IGxpbnRlcikge1xuICAgICAgICBlbnRyeS5kZWxldGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=