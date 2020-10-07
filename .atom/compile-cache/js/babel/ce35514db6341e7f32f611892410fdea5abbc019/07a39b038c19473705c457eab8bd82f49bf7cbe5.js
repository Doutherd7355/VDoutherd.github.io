Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

// Public: GrammarUtils.OperatingSystem - a module which exposes different
// platform related helper functions.
'use babel';

exports['default'] = {
  isDarwin: function isDarwin() {
    return this.platform() === 'darwin';
  },

  isWindows: function isWindows() {
    return this.platform() === 'win32';
  },

  isLinux: function isLinux() {
    return this.platform() === 'linux';
  },

  platform: function platform() {
    return _os2['default'].platform();
  },

  architecture: function architecture() {
    return _os2['default'].arch();
  },

  release: function release() {
    return _os2['default'].release();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvb3BlcmF0aW5nLXN5c3RlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBRWUsSUFBSTs7Ozs7O0FBRm5CLFdBQVcsQ0FBQzs7cUJBTUc7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxRQUFRLENBQUM7R0FDckM7O0FBRUQsV0FBUyxFQUFBLHFCQUFHO0FBQ1YsV0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssT0FBTyxDQUFDO0dBQ3BDOztBQUVELFNBQU8sRUFBQSxtQkFBRztBQUNSLFdBQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLE9BQU8sQ0FBQztHQUNwQzs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLGdCQUFHLFFBQVEsRUFBRSxDQUFDO0dBQ3RCOztBQUVELGNBQVksRUFBQSx3QkFBRztBQUNiLFdBQU8sZ0JBQUcsSUFBSSxFQUFFLENBQUM7R0FDbEI7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsV0FBTyxnQkFBRyxPQUFPLEVBQUUsQ0FBQztHQUNyQjtDQUNGIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvb3BlcmF0aW5nLXN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuXG4vLyBQdWJsaWM6IEdyYW1tYXJVdGlscy5PcGVyYXRpbmdTeXN0ZW0gLSBhIG1vZHVsZSB3aGljaCBleHBvc2VzIGRpZmZlcmVudFxuLy8gcGxhdGZvcm0gcmVsYXRlZCBoZWxwZXIgZnVuY3Rpb25zLlxuZXhwb3J0IGRlZmF1bHQge1xuICBpc0RhcndpbigpIHtcbiAgICByZXR1cm4gdGhpcy5wbGF0Zm9ybSgpID09PSAnZGFyd2luJztcbiAgfSxcblxuICBpc1dpbmRvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJztcbiAgfSxcblxuICBpc0xpbnV4KCkge1xuICAgIHJldHVybiB0aGlzLnBsYXRmb3JtKCkgPT09ICdsaW51eCc7XG4gIH0sXG5cbiAgcGxhdGZvcm0oKSB7XG4gICAgcmV0dXJuIG9zLnBsYXRmb3JtKCk7XG4gIH0sXG5cbiAgYXJjaGl0ZWN0dXJlKCkge1xuICAgIHJldHVybiBvcy5hcmNoKCk7XG4gIH0sXG5cbiAgcmVsZWFzZSgpIHtcbiAgICByZXR1cm4gb3MucmVsZWFzZSgpO1xuICB9LFxufTtcbiJdfQ==