Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _modelsConfig = require('./models/config');

var _modelsConfig2 = _interopRequireDefault(_modelsConfig);

var _viewsConfig = require('./views/config');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];
  }

  _createClass(Config, [{
    key: 'init',
    value: function init() {

      this.disposables.push(atom.views.addViewProvider(_modelsConfig2['default'], _viewsConfig.createView), atom.workspace.addOpener(this.opener.bind(this)), atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.requestPane.bind(this)));
    }
  }, {
    key: 'opener',
    value: function opener(uri) {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      var _url$parse = _url2['default'].parse(uri);

      var protocol = _url$parse.protocol;
      var host = _url$parse.host;

      if (protocol !== 'atom-ternjs:' || host !== 'config') {

        return undefined;
      }

      var model = new _modelsConfig2['default']();

      model.setProjectDir(projectDir);
      model.setURI(uri);

      return model;
    }
  }, {
    key: 'requestPane',
    value: function requestPane() {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      if (!projectDir) {

        atom.notifications.addError('There is no active server. Open at least one JavaScript file in the current project to start the tern server. After the server has started you will be able to configure the project.', {

          dismissable: true
        });

        return;
      }

      var uri = 'atom-ternjs:' + '//config/' + projectDir;
      var previousPane = atom.workspace.paneForURI(uri);

      if (previousPane) {

        previousPane.activate();

        return;
      }

      atom.workspace.open('atom-ternjs:' + '//config/' + projectDir, {

        searchAllPanes: true,
        split: 'right'

      }).then(function (model) {

        // console.log(model);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7bUJBRWdCLEtBQUs7Ozs7NEJBRUcsaUJBQWlCOzs7OzJCQUNoQixnQkFBZ0I7O2dDQUlsQyxzQkFBc0I7O2lDQUVULHVCQUF1Qjs7OztBQVgzQyxXQUFXLENBQUM7O0lBYU4sTUFBTTtBQUVDLFdBRlAsTUFBTSxHQUVJOzBCQUZWLE1BQU07O0FBSVIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7R0FDdkI7O2VBTEcsTUFBTTs7V0FPTixnQkFBRzs7QUFFTCxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FFbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLG9EQUF5QixFQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMzRixDQUFDO0tBQ0g7OztXQUVLLGdCQUFDLEdBQUcsRUFBRTs7QUFFVixVQUFNLFVBQVUsR0FBRywrQkFBUSxNQUFNLElBQUksK0JBQVEsTUFBTSxDQUFDLFVBQVUsQ0FBQzs7dUJBQ3RDLGlCQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7O1VBQWhDLFFBQVEsY0FBUixRQUFRO1VBQUUsSUFBSSxjQUFKLElBQUk7O0FBRXJCLFVBQ0UsUUFBUSxLQUFLLGNBQWMsSUFDM0IsSUFBSSxLQUFLLFFBQVEsRUFDakI7O0FBRUEsZUFBTyxTQUFTLENBQUM7T0FDbEI7O0FBRUQsVUFBTSxLQUFLLEdBQUcsK0JBQWlCLENBQUM7O0FBRWhDLFdBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEMsV0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbEIsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1dBRVUsdUJBQUc7O0FBRVosVUFBTSxVQUFVLEdBQUcsK0JBQVEsTUFBTSxJQUFJLCtCQUFRLE1BQU0sQ0FBQyxVQUFVLENBQUM7O0FBRS9ELFVBQUksQ0FBQyxVQUFVLEVBQUU7O0FBRWYsWUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsdUxBQXVMLEVBQUU7O0FBRW5OLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7O0FBRUgsZUFBTztPQUNSOztBQUVELFVBQU0sR0FBRyxHQUFHLGNBQWMsR0FBRyxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBQ3RELFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLFlBQVksRUFBRTs7QUFFaEIsb0JBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFeEIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxXQUFXLEdBQUcsVUFBVSxFQUFFOztBQUU3RCxzQkFBYyxFQUFFLElBQUk7QUFDcEIsYUFBSyxFQUFFLE9BQU87O09BRWYsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQUssRUFBSzs7O09BR2xCLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxtQkFBRzs7QUFFUix3Q0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7S0FDdkI7OztTQTdFRyxNQUFNOzs7cUJBZ0ZHLElBQUksTUFBTSxFQUFFIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuaW1wb3J0IENvbmZpZ01vZGVsIGZyb20gJy4vbW9kZWxzL2NvbmZpZyc7XG5pbXBvcnQge2NyZWF0ZVZpZXd9IGZyb20gJy4vdmlld3MvY29uZmlnJztcblxuaW1wb3J0IHtcbiAgZGlzcG9zZUFsbFxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5cbmNsYXNzIENvbmZpZyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKFxuXG4gICAgICBhdG9tLnZpZXdzLmFkZFZpZXdQcm92aWRlcihDb25maWdNb2RlbCwgY3JlYXRlVmlldyksXG4gICAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIodGhpcy5vcGVuZXIuYmluZCh0aGlzKSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10ZXJuanM6b3BlbkNvbmZpZycsIHRoaXMucmVxdWVzdFBhbmUuYmluZCh0aGlzKSlcbiAgICApO1xuICB9XG5cbiAgb3BlbmVyKHVyaSkge1xuXG4gICAgY29uc3QgcHJvamVjdERpciA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG4gICAgY29uc3Qge3Byb3RvY29sLCBob3N0fSA9IHVybC5wYXJzZSh1cmkpO1xuXG4gICAgaWYgKFxuICAgICAgcHJvdG9jb2wgIT09ICdhdG9tLXRlcm5qczonIHx8XG4gICAgICBob3N0ICE9PSAnY29uZmlnJ1xuICAgICkge1xuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsID0gbmV3IENvbmZpZ01vZGVsKCk7XG5cbiAgICBtb2RlbC5zZXRQcm9qZWN0RGlyKHByb2plY3REaXIpO1xuICAgIG1vZGVsLnNldFVSSSh1cmkpO1xuXG4gICAgcmV0dXJuIG1vZGVsO1xuICB9XG5cbiAgcmVxdWVzdFBhbmUoKSB7XG5cbiAgICBjb25zdCBwcm9qZWN0RGlyID0gbWFuYWdlci5zZXJ2ZXIgJiYgbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcblxuICAgIGlmICghcHJvamVjdERpcikge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1RoZXJlIGlzIG5vIGFjdGl2ZSBzZXJ2ZXIuIE9wZW4gYXQgbGVhc3Qgb25lIEphdmFTY3JpcHQgZmlsZSBpbiB0aGUgY3VycmVudCBwcm9qZWN0IHRvIHN0YXJ0IHRoZSB0ZXJuIHNlcnZlci4gQWZ0ZXIgdGhlIHNlcnZlciBoYXMgc3RhcnRlZCB5b3Ugd2lsbCBiZSBhYmxlIHRvIGNvbmZpZ3VyZSB0aGUgcHJvamVjdC4nLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJpID0gJ2F0b20tdGVybmpzOicgKyAnLy9jb25maWcvJyArIHByb2plY3REaXI7XG4gICAgY29uc3QgcHJldmlvdXNQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSSh1cmkpO1xuXG4gICAgaWYgKHByZXZpb3VzUGFuZSkge1xuXG4gICAgICBwcmV2aW91c1BhbmUuYWN0aXZhdGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b20tdGVybmpzOicgKyAnLy9jb25maWcvJyArIHByb2plY3REaXIsIHtcblxuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICBzcGxpdDogJ3JpZ2h0J1xuXG4gICAgfSkudGhlbigobW9kZWwpID0+IHtcblxuICAgICAgLy8gY29uc29sZS5sb2cobW9kZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBDb25maWcoKTtcbiJdfQ==