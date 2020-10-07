Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _indieDelegate = require('./indie-delegate');

var _indieDelegate2 = _interopRequireDefault(_indieDelegate);

var _validate = require('./validate');

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.emitter = new _atom.Emitter();
    this.delegates = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public method

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(config, version) {
      var _this = this;

      if (!(0, _validate.indie)(config)) {
        throw new Error('Error registering Indie Linter');
      }
      var indieLinter = new _indieDelegate2['default'](config, version);
      this.delegates.add(indieLinter);
      indieLinter.onDidDestroy(function () {
        _this.delegates['delete'](indieLinter);
      });
      indieLinter.onDidUpdate(function (messages) {
        _this.emitter.emit('did-update', { linter: indieLinter, messages: messages });
      });
      this.emitter.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.delegates);
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.delegates.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.delegates) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07OzZCQUd6QixrQkFBa0I7Ozs7d0JBQ0wsWUFBWTs7SUFHN0MsYUFBYTtBQUtOLFdBTFAsYUFBYSxHQUtIOzBCQUxWLGFBQWE7O0FBTWYsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7Ozs7ZUFYRyxhQUFhOztXQWFULGtCQUFDLE1BQWEsRUFBRSxPQUFVLEVBQWlCOzs7QUFDakQsVUFBSSxDQUFDLHFCQUFjLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtPQUNsRDtBQUNELFVBQU0sV0FBVyxHQUFHLCtCQUFrQixNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDL0IsaUJBQVcsQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM3QixjQUFLLFNBQVMsVUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ25DLENBQUMsQ0FBQTtBQUNGLGlCQUFXLENBQUMsV0FBVyxDQUFDLFVBQUEsUUFBUSxFQUFJO0FBQ2xDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO09BQ25FLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTs7QUFFekMsYUFBTyxXQUFXLENBQUE7S0FDbkI7OztXQUNXLHdCQUF5QjtBQUNuQyxhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQ2xDOzs7V0FDTSxpQkFBQyxRQUFrQixFQUFjO0FBQ3RDLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDVSxxQkFBQyxRQUFrQixFQUFjO0FBQzFDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDTSxtQkFBRztBQUNSLFdBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQyxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDaEI7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0E1Q0csYUFBYTs7O3FCQStDSixhQUFhIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgSW5kaWVEZWxlZ2F0ZSBmcm9tICcuL2luZGllLWRlbGVnYXRlJ1xuaW1wb3J0IHsgaW5kaWUgYXMgdmFsaWRhdGVJbmRpZSB9IGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgdHlwZSB7IEluZGllIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgSW5kaWVSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgZGVsZWdhdGVzOiBTZXQ8SW5kaWVEZWxlZ2F0ZT5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmRlbGVnYXRlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIC8vIFB1YmxpYyBtZXRob2RcbiAgcmVnaXN0ZXIoY29uZmlnOiBJbmRpZSwgdmVyc2lvbjogMik6IEluZGllRGVsZWdhdGUge1xuICAgIGlmICghdmFsaWRhdGVJbmRpZShjb25maWcpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHJlZ2lzdGVyaW5nIEluZGllIExpbnRlcicpXG4gICAgfVxuICAgIGNvbnN0IGluZGllTGludGVyID0gbmV3IEluZGllRGVsZWdhdGUoY29uZmlnLCB2ZXJzaW9uKVxuICAgIHRoaXMuZGVsZWdhdGVzLmFkZChpbmRpZUxpbnRlcilcbiAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kZWxlZ2F0ZXMuZGVsZXRlKGluZGllTGludGVyKVxuICAgIH0pXG4gICAgaW5kaWVMaW50ZXIub25EaWRVcGRhdGUobWVzc2FnZXMgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB7IGxpbnRlcjogaW5kaWVMaW50ZXIsIG1lc3NhZ2VzIH0pXG4gICAgfSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGluZGllTGludGVyKVxuXG4gICAgcmV0dXJuIGluZGllTGludGVyXG4gIH1cbiAgZ2V0UHJvdmlkZXJzKCk6IEFycmF5PEluZGllRGVsZWdhdGU+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRlbGVnYXRlcylcbiAgfVxuICBvYnNlcnZlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZGVsZWdhdGVzLmZvckVhY2goY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5kZWxlZ2F0ZXMpIHtcbiAgICAgIGVudHJ5LmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5kaWVSZWdpc3RyeVxuIl19