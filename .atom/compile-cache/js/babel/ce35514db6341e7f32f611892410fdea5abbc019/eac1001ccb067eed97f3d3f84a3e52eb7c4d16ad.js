Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHyperclickProvider = require('./atom-ternjs-hyperclick-provider');

var _atomTernjsHyperclickProvider2 = _interopRequireDefault(_atomTernjsHyperclickProvider);

var _atom = require('atom');

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {

        if (!atom.inSpecMode()) {

          require('atom-package-deps').install('atom-ternjs', true);
        }
      }));

      _atomTernjsManager2['default'].activate();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
      this.subscriptions.dispose();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }, {
    key: 'provideHyperclick',
    value: function provideHyperclick() {

      return _atomTernjsHyperclickProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFeUIsVUFBVTs7OztrQ0FDZCx3QkFBd0I7Ozs7aUNBQ3pCLHVCQUF1Qjs7Ozs0Q0FDcEIsbUNBQW1DOzs7O29CQUN0QixNQUFNOztBQU4xQyxXQUFXLENBQUM7O0lBUU4sVUFBVTtBQUVILFdBRlAsVUFBVSxHQUVBOzBCQUZWLFVBQVU7O0FBSVosUUFBSSxDQUFDLE1BQU0sc0JBQWUsQ0FBQztHQUM1Qjs7ZUFMRyxVQUFVOztXQU9OLG9CQUFHOztBQUVULFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLFlBQVc7O0FBRXBELFlBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7O0FBRXRCLGlCQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNEO09BQ0YsQ0FBQyxDQUNILENBQUM7O0FBRUYscUNBQVEsUUFBUSxFQUFFLENBQUM7S0FDcEI7OztXQUVTLHNCQUFHOztBQUVYLHFDQUFRLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7OztXQUVNLG1CQUFHOztBQUVSLDZDQUFnQjtLQUNqQjs7O1dBRWdCLDZCQUFHOztBQUVsQix1REFBa0I7S0FDbkI7OztTQXRDRyxVQUFVOzs7cUJBeUNELElBQUksVUFBVSxFQUFFIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGRlZmF1bENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgcHJvdmlkZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1wcm92aWRlcic7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IGh5cGVyY2xpY2sgZnJvbSAnLi9hdG9tLXRlcm5qcy1oeXBlcmNsaWNrLXByb3ZpZGVyJztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuY2xhc3MgQXRvbVRlcm5qcyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGRlZmF1bENvbmZpZztcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVJbml0aWFsUGFja2FnZXMoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuXG4gICAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdhdG9tLXRlcm5qcycsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICBtYW5hZ2VyLmFjdGl2YXRlKCk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuXG4gICAgbWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHByb3ZpZGUoKSB7XG5cbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH1cblxuICBwcm92aWRlSHlwZXJjbGljaygpIHtcblxuICAgIHJldHVybiBoeXBlcmNsaWNrO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tVGVybmpzKCk7XG4iXX0=