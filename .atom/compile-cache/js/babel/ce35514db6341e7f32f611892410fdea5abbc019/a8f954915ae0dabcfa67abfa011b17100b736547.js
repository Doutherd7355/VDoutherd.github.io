Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var UIRegistry = (function () {
  function UIRegistry() {
    _classCallCheck(this, UIRegistry);

    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(UIRegistry, [{
    key: 'add',
    value: function add(ui) {
      if (!this.providers.has(ui) && (0, _validate.ui)(ui)) {
        this.subscriptions.add(ui);
        this.providers.add(ui);
      }
    }
  }, {
    key: 'delete',
    value: function _delete(provider) {
      if (this.providers.has(provider)) {
        provider.dispose();
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.providers);
    }
  }, {
    key: 'render',
    value: function render(messages) {
      this.providers.forEach(function (provider) {
        provider.render(messages);
      });
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didBeginLinting(linter, filePath);
      });
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
      this.subscriptions.dispose();
    }
  }]);

  return UIRegistry;
})();

exports['default'] = UIRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVvQyxNQUFNOzt3QkFDVCxZQUFZOztJQUd2QyxVQUFVO0FBSUgsV0FKUCxVQUFVLEdBSUE7MEJBSlYsVUFBVTs7QUFLWixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtHQUMvQzs7ZUFQRyxVQUFVOztXQVFYLGFBQUMsRUFBTSxFQUFFO0FBQ1YsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGtCQUFXLEVBQUUsQ0FBQyxFQUFFO0FBQzdDLFlBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ3ZCO0tBQ0Y7OztXQUNLLGlCQUFDLFFBQVksRUFBRTtBQUNuQixVQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2hDLGdCQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbEIsWUFBSSxDQUFDLFNBQVMsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7OztXQUNXLHdCQUFjO0FBQ3hCLGFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7S0FDbEM7OztXQUNLLGdCQUFDLFFBQXVCLEVBQUU7QUFDOUIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDeEMsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDMUIsQ0FBQyxDQUFBO0tBQ0g7OztXQUNjLHlCQUFDLE1BQWMsRUFBNEI7VUFBMUIsUUFBaUIseURBQUcsSUFBSTs7QUFDdEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDeEMsZ0JBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO09BQzNDLENBQUMsQ0FBQTtLQUNIOzs7V0FDZSwwQkFBQyxNQUFjLEVBQTRCO1VBQTFCLFFBQWlCLHlEQUFHLElBQUk7O0FBQ3ZELFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLGdCQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO09BQzVDLENBQUMsQ0FBQTtLQUNIOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBekNHLFVBQVU7OztxQkE0Q0QsVUFBVSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgdWkgYXMgdmFsaWRhdGVVSSB9IGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlciwgVUksIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBVSVJlZ2lzdHJ5IHtcbiAgcHJvdmlkZXJzOiBTZXQ8VUk+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgfVxuICBhZGQodWk6IFVJKSB7XG4gICAgaWYgKCF0aGlzLnByb3ZpZGVycy5oYXModWkpICYmIHZhbGlkYXRlVUkodWkpKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHVpKVxuICAgICAgdGhpcy5wcm92aWRlcnMuYWRkKHVpKVxuICAgIH1cbiAgfVxuICBkZWxldGUocHJvdmlkZXI6IFVJKSB7XG4gICAgaWYgKHRoaXMucHJvdmlkZXJzLmhhcyhwcm92aWRlcikpIHtcbiAgICAgIHByb3ZpZGVyLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKVxuICAgIH1cbiAgfVxuICBnZXRQcm92aWRlcnMoKTogQXJyYXk8VUk+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByb3ZpZGVycylcbiAgfVxuICByZW5kZXIobWVzc2FnZXM6IE1lc3NhZ2VzUGF0Y2gpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBwcm92aWRlci5yZW5kZXIobWVzc2FnZXMpXG4gICAgfSlcbiAgfVxuICBkaWRCZWdpbkxpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHByb3ZpZGVyLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcgPSBudWxsKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgcHJvdmlkZXIuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFVJUmVnaXN0cnlcbiJdfQ==