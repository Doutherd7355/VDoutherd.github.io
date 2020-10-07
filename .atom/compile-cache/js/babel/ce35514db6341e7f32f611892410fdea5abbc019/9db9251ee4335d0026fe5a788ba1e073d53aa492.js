Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _eventKit = require('event-kit');

'use babel';

var File = (function () {
  function File(params) {
    var _this = this;

    _classCallCheck(this, File);

    this.emitter = new _eventKit.Emitter();

    this.parent = null;
    this.name = '';
    this.client = null;
    this.isSelected = false;
    this.status = 0;
    this.size = 0;
    this.date = null;
    this.type = null;
    this.original = null;

    Object.keys(params).forEach(function (n) {
      if (Object.prototype.hasOwnProperty.call(_this, n)) {
        _this[n] = params[n];
      }
    });

    var ext = _path2['default'].extname(this.name);

    if (_fsPlus2['default'].isReadmePath(this.name)) {
      this.type = 'readme';
    } else if (_fsPlus2['default'].isCompressedExtension(ext)) {
      this.type = 'compressed';
    } else if (_fsPlus2['default'].isImageExtension(ext)) {
      this.type = 'image';
    } else if (_fsPlus2['default'].isPdfExtension(ext)) {
      this.type = 'pdf';
    } else if (_fsPlus2['default'].isBinaryExtension(ext)) {
      this.type = 'binary';
    } else {
      this.type = 'text';
    }
  }

  _createClass(File, [{
    key: 'open',
    value: function open() {
      var _this2 = this;

      var client = this.root.client;

      client.download(this.remote, false, function (err) {
        if (err) {
          atom.notifications.addError('Remote FTP: ' + err, {
            dismissable: false
          });
          return;
        }
        atom.workspace.open(_this2.local);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.emitter.dispose();
    }
  }, {
    key: 'onChangeSelect',
    value: function onChangeSelect(callback) {
      return this.emitter.on('did-change-select', callback);
    }
  }, {
    key: 'local',
    get: function get() {
      if (this.parent) {
        var p = _path2['default'].normalize(_path2['default'].join(this.parent.local, this.name));

        if (_path2['default'].sep !== '/') p = p.replace(/\\/g, '/');

        return p;
      }

      throw new Error('File needs to be in a Directory');
    }
  }, {
    key: 'remote',
    get: function get() {
      if (this.parent) {
        var p = _path2['default'].normalize(_path2['default'].join(this.parent.remote, this.name));

        if (_path2['default'].sep !== '/') p = p.replace(/\\/g, '/');

        return p;
      }

      throw new Error('File needs to be in a Directory');
    }
  }, {
    key: 'root',
    get: function get() {
      if (this.parent) {
        return this.parent.root;
      }

      return this;
    }
  }, {
    key: 'setIsSelected',
    set: function set(value) {
      this.isSelected = value;
      this.emitter.emit('did-change-select', value);
    }
  }]);

  return File;
})();

exports['default'] = File;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9maWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7O3dCQUNDLFdBQVc7O0FBSm5DLFdBQVcsQ0FBQzs7SUFNTixJQUFJO0FBQ0csV0FEUCxJQUFJLENBQ0ksTUFBTSxFQUFFOzs7MEJBRGhCLElBQUk7O0FBRU4sUUFBSSxDQUFDLE9BQU8sR0FBRyx1QkFBYSxDQUFDOztBQUU3QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXJCLFVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ2pDLFVBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxRQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ2pELGNBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3JCO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQU0sR0FBRyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBDLFFBQUksb0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMs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LEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7OztTQTlGRyxJQUFJOzs7cUJBaUdLLElBQUkiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBFbWl0dGVyIH0gZnJvbSAnZXZlbnQta2l0JztcblxuY2xhc3MgRmlsZSB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy5uYW1lID0gJyc7XG4gICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgIHRoaXMuaXNTZWxlY3RlZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICB0aGlzLnNpemUgPSAwO1xuICAgIHRoaXMuZGF0ZSA9IG51bGw7XG4gICAgdGhpcy50eXBlID0gbnVsbDtcbiAgICB0aGlzLm9yaWdpbmFsID0gbnVsbDtcblxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaCgobikgPT4ge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBuKSkge1xuICAgICAgICB0aGlzW25dID0gcGFyYW1zW25dO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKHRoaXMubmFtZSk7XG5cbiAgICBpZiAoZnMuaXNSZWFkbWVQYXRoKHRoaXMubmFtZSkpIHtcbiAgICAgIHRoaXMudHlwZSA9ICdyZWFkbWUnO1xuICAgIH0gZWxzZSBpZiAoZnMuaXNDb21wcmVzc2VkRXh0ZW5zaW9uKGV4dCkpIHtcbiAgICAgIHRoaXMudHlwZSA9ICdjb21wcmVzc2VkJztcbiAgICB9IGVsc2UgaWYgKGZzLmlzSW1hZ2VFeHRlbnNpb24oZXh0KSkge1xuICAgICAgdGhpcy50eXBlID0gJ2ltYWdlJztcbiAgICB9IGVsc2UgaWYgKGZzLmlzUGRmRXh0ZW5zaW9uKGV4dCkpIHtcbiAgICAgIHRoaXMudHlwZSA9ICdwZGYnO1xuICAgIH0gZWxzZSBpZiAoZnMuaXNCaW5hcnlFeHRlbnNpb24oZXh0KSkge1xuICAgICAgdGhpcy50eXBlID0gJ2JpbmFyeSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHlwZSA9ICd0ZXh0JztcbiAgICB9XG4gIH1cblxuICBvcGVuKCkge1xuICAgIGNvbnN0IGNsaWVudCA9IHRoaXMucm9vdC5jbGllbnQ7XG5cbiAgICBjbGllbnQuZG93bmxvYWQodGhpcy5yZW1vdGUsIGZhbHNlLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgUmVtb3RlIEZUUDogJHtlcnJ9YCwge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5sb2NhbCk7XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cblxuICBvbkNoYW5nZVNlbGVjdChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utc2VsZWN0JywgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0IGxvY2FsKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgbGV0IHAgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4odGhpcy5wYXJlbnQubG9jYWwsIHRoaXMubmFtZSkpO1xuXG4gICAgICBpZiAocGF0aC5zZXAgIT09ICcvJykgcCA9IHAucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgbmVlZHMgdG8gYmUgaW4gYSBEaXJlY3RvcnknKTtcbiAgfVxuXG4gIGdldCByZW1vdGUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBsZXQgcCA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbih0aGlzLnBhcmVudC5yZW1vdGUsIHRoaXMubmFtZSkpO1xuXG4gICAgICBpZiAocGF0aC5zZXAgIT09ICcvJykgcCA9IHAucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgbmVlZHMgdG8gYmUgaW4gYSBEaXJlY3RvcnknKTtcbiAgfVxuXG4gIGdldCByb290KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnJvb3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQgc2V0SXNTZWxlY3RlZCh2YWx1ZSkge1xuICAgIHRoaXMuaXNTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLXNlbGVjdCcsIHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBGaWxlO1xuIl19