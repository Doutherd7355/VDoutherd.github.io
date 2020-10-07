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

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var PackageConfig = (function () {
  function PackageConfig() {
    _classCallCheck(this, PackageConfig);

    this.disposables = [];
    this.defaultConfig = _config2['default'];
    this.options = this.getInitalOptions();
  }

  _createClass(PackageConfig, [{
    key: 'init',
    value: function init() {

      this.options = this.getInitalOptions();
      this.registerListeners();
    }
  }, {
    key: 'getInitalOptions',
    value: function getInitalOptions() {

      return {

        excludeLowerPriority: this.get('excludeLowerPriorityProviders'),
        inlineFnCompletion: this.get('inlineFnCompletion'),
        inlineFnCompletionDocumentation: this.get('inlineFnCompletionDocumentation'),
        useSnippets: this.get('useSnippets'),
        snippetsFirst: this.get('snippetsFirst'),
        useSnippetsAndFunction: this.get('useSnippetsAndFunction'),
        sort: this.get('sort'),
        guess: this.get('guess'),
        urls: this.get('urls'),
        origins: this.get('origins'),
        caseInsensitive: this.get('caseInsensitive'),
        documentation: this.get('documentation'),
        ternServerGetFileAsync: this.get('ternServerGetFileAsync'),
        ternServerDependencyBudget: this.get('ternServerDependencyBudget')
      };
    }
  }, {
    key: 'get',
    value: function get(option) {

      var value = atom.config.get('atom-ternjs.' + option);

      if (value === undefined) {

        return this.defaultConfig[option]['default'];
      }

      return value;
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var _this = this;

      this.disposables.push(atom.config.observe('atom-ternjs.excludeLowerPriorityProviders', function (value) {

        _this.options.excludeLowerPriority = value;

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].excludeLowerPriority = value;
        }
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.snippetsFirst', function (value) {

        if (_atomTernjsProvider2['default']) {

          _atomTernjsProvider2['default'].suggestionPriority = value ? null : 2;
        }

        _this.options.snippetsFirst = value;
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletion', function (value) {

        _this.options.inlineFnCompletion = value;
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
      }));

      this.disposables.push(atom.config.observe('atom-ternjs.ternServerGetFileAsync', function (value) {
        return _this.options.ternServerGetFileAsync = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.ternServerDependencyBudget', function (value) {
        return _this.options.ternServerDependencyBudget = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.inlineFnCompletionDocumentation', function (value) {
        return _this.options.inlineFnCompletionDocumentation = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippets', function (value) {
        return _this.options.useSnippets = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.useSnippetsAndFunction', function (value) {
        return _this.options.useSnippetsAndFunction = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.sort', function (value) {
        return _this.options.sort = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.guess', function (value) {
        return _this.options.guess = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.urls', function (value) {
        return _this.options.urls = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.origins', function (value) {
        return _this.options.origins = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.caseInsensitive', function (value) {
        return _this.options.caseInsensitive = value;
      }));
      this.disposables.push(atom.config.observe('atom-ternjs.documentation', function (value) {
        return _this.options.documentation = value;
      }));
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
    }
  }]);

  return PackageConfig;
})();

exports['default'] = new PackageConfig();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFeUIsVUFBVTs7OztrQ0FDZCx3QkFBd0I7Ozs7Z0NBQ3pCLHNCQUFzQjs7OztnQ0FDakIsc0JBQXNCOztBQUwvQyxXQUFXLENBQUM7O0lBT04sYUFBYTtBQUVOLFdBRlAsYUFBYSxHQUVIOzBCQUZWLGFBQWE7O0FBSWYsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLGFBQWEsc0JBQWUsQ0FBQztBQUNsQyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQ3hDOztlQVBHLGFBQWE7O1dBU2IsZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUN2QyxVQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUMxQjs7O1dBRWUsNEJBQUc7O0FBRWpCLGFBQU87O0FBRUwsNEJBQW9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztBQUMvRCwwQkFBa0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDO0FBQ2xELHVDQUErQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUM7QUFDNUUsbUJBQVcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztBQUNwQyxxQkFBYSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0FBQ3hDLDhCQUFzQixFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7QUFDMUQsWUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQ3RCLGFBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFD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QUksTUFBSyxPQUFPLENBQUMsYUFBYSxHQUFHLEtBQUs7T0FBQSxDQUFDLENBQUMsQ0FBQztLQUN0SDs7O1dBRU0sbUJBQUc7O0FBRVIsd0NBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0tBQ3ZCOzs7U0E3RkcsYUFBYTs7O3FCQWdHSixJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBkZWZhdWxDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IHtkaXNwb3NlQWxsfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmNsYXNzIFBhY2thZ2VDb25maWcge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IGRlZmF1bENvbmZpZztcbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmdldEluaXRhbE9wdGlvbnMoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmdldEluaXRhbE9wdGlvbnMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG4gIH1cblxuICBnZXRJbml0YWxPcHRpb25zKCkge1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IHRoaXMuZ2V0KCdleGNsdWRlTG93ZXJQcmlvcml0eVByb3ZpZGVycycpLFxuICAgICAgaW5saW5lRm5Db21wbGV0aW9uOiB0aGlzLmdldCgnaW5saW5lRm5Db21wbGV0aW9uJyksXG4gICAgICBpbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uOiB0aGlzLmdldCgnaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbicpLFxuICAgICAgdXNlU25pcHBldHM6IHRoaXMuZ2V0KCd1c2VTbmlwcGV0cycpLFxuICAgICAgc25pcHBldHNGaXJzdDogdGhpcy5nZXQoJ3NuaXBwZXRzRmlyc3QnKSxcbiAgICAgIHVzZVNuaXBwZXRzQW5kRnVuY3Rpb246IHRoaXMuZ2V0KCd1c2VTbmlwcGV0c0FuZEZ1bmN0aW9uJyksXG4gICAgICBzb3J0OiB0aGlzLmdldCgnc29ydCcpLFxuICAgICAgZ3Vlc3M6IHRoaXMuZ2V0KCdndWVzcycpLFxuICAgICAgdXJsczogdGhpcy5nZXQoJ3VybHMnKSxcbiAgICAgIG9yaWdpbnM6IHRoaXMuZ2V0KCdvcmlnaW5zJyksXG4gICAgICBjYXNlSW5zZW5zaXRpdmU6IHRoaXMuZ2V0KCdjYXNlSW5zZW5zaXRpdmUnKSxcbiAgICAgIGRvY3VtZW50YXRpb246IHRoaXMuZ2V0KCdkb2N1bWVudGF0aW9uJyksXG4gICAgICB0ZXJuU2VydmVyR2V0RmlsZUFzeW5jOiB0aGlzLmdldCgndGVyblNlcnZlckdldEZpbGVBc3luYycpLFxuICAgICAgdGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQ6IHRoaXMuZ2V0KCd0ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldCcpXG4gICAgfTtcbiAgfVxuXG4gIGdldChvcHRpb24pIHtcblxuICAgIGNvbnN0IHZhbHVlID0gYXRvbS5jb25maWcuZ2V0KGBhdG9tLXRlcm5qcy4ke29wdGlvbn1gKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRDb25maWdbb3B0aW9uXS5kZWZhdWx0O1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzJywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHZhbHVlO1xuXG4gICAgICBpZiAocHJvdmlkZXIpIHtcblxuICAgICAgICBwcm92aWRlci5leGNsdWRlTG93ZXJQcmlvcml0eSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5zbmlwcGV0c0ZpcnN0JywgKHZhbHVlKSA9PiB7XG5cbiAgICAgIGlmIChwcm92aWRlcikge1xuXG4gICAgICAgIHByb3ZpZGVyLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IHZhbHVlID8gbnVsbCA6IDI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5zbmlwcGV0c0ZpcnN0ID0gdmFsdWU7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmlubGluZUZuQ29tcGxldGlvbicsICh2YWx1ZSkgPT4ge1xuXG4gICAgICB0aGlzLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uID0gdmFsdWU7XG4gICAgICBlbWl0dGVyLmVtaXQoJ3R5cGUtZGVzdHJveS1vdmVybGF5Jyk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmMnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMudGVyblNlcnZlckdldEZpbGVBc3luYyA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0JywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0ID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMuaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbicsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uID0gdmFsdWUpKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb25maWcub2JzZXJ2ZSgnYXRvbS10ZXJuanMudXNlU25pcHBldHMnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMudXNlU25pcHBldHMgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb24gPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5zb3J0JywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLnNvcnQgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5ndWVzcycsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5ndWVzcyA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLnVybHMnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMudXJscyA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLm9yaWdpbnMnLCB2YWx1ZSA9PiB0aGlzLm9wdGlvbnMub3JpZ2lucyA9IHZhbHVlKSk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29uZmlnLm9ic2VydmUoJ2F0b20tdGVybmpzLmNhc2VJbnNlbnNpdGl2ZScsIHZhbHVlID0+IHRoaXMub3B0aW9ucy5jYXNlSW5zZW5zaXRpdmUgPSB2YWx1ZSkpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdG9tLXRlcm5qcy5kb2N1bWVudGF0aW9uJywgdmFsdWUgPT4gdGhpcy5vcHRpb25zLmRvY3VtZW50YXRpb24gPSB2YWx1ZSkpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQYWNrYWdlQ29uZmlnKCk7XG4iXX0=