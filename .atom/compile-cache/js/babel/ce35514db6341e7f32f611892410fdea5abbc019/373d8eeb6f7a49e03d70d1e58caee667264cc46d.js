Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('../atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('../atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

var _configTernConfig = require('../../config/tern-config');

'use babel';

var title = 'atom-ternjs project config';

var ConfigModel = (function () {
  function ConfigModel() {
    _classCallCheck(this, ConfigModel);

    /**
     * project configuration (.tern-project)
     * @type {Object}
     */
    this.projectConfig = {};
    /**
     * temporary project configuration
     * @type {Object}
     */
    this.config = {};
    /**
     * collection of all editors in config view
     * @type {Array}
     */
    this.editors = [];
  }

  _createClass(ConfigModel, [{
    key: 'getURI',
    value: function getURI() {

      return this.uRI;
    }
  }, {
    key: 'getProjectDir',
    value: function getProjectDir() {

      return this.projectDir;
    }
  }, {
    key: 'setProjectDir',
    value: function setProjectDir(dir) {

      this.projectDir = dir;
    }
  }, {
    key: 'setURI',
    value: function setURI(uRI) {

      this.uRI = uRI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {

      return title;
    }
  }, {
    key: 'addLib',
    value: function addLib(lib) {

      if (!this.config.libs.includes(lib)) {

        this.config.libs.push(lib);
      }
    }
  }, {
    key: 'removeLib',
    value: function removeLib(lib) {
      var _this = this;

      var libs = this.config.libs.slice();

      libs.forEach(function (_lib, i) {

        if (_lib === lib) {

          _this.config.libs.splice(i, 1);
        }
      });
    }
  }, {
    key: 'getEcmaVersion',
    value: function getEcmaVersion() {

      return this.config.ecmaVersions;
    }
  }, {
    key: 'setEcmaVersion',
    value: function setEcmaVersion(value) {

      this.config.ecmaVersion = value;
    }
  }, {
    key: 'addPlugin',
    value: function addPlugin(key) {

      if (!this.config.plugins[key]) {

        // if there was a previous config for this pluging
        if (this.projectConfig.plugins && this.projectConfig.plugins[key]) {

          this.config.plugins[key] = this.projectConfig.plugins[key];

          return;
        }

        this.config.plugins[key] = _configTernConfig.availablePlugins[key];
      }
    }
  }, {
    key: 'removePlugin',
    value: function removePlugin(key) {

      this.config.plugins[key] && delete this.config.plugins[key];
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      if (!projectDir) {

        atom.notifications.addError('No Project found.');

        return false;
      }

      var projectConfig = (0, _atomTernjsHelper.readFile)(projectDir + '/.tern-project');

      if (!projectConfig) {

        this.config = (0, _underscorePlus.deepClone)(_configTernConfig.defaultProjectConfig);

        return true;
      }

      try {

        this.projectConfig = JSON.parse(projectConfig);
      } catch (error) {

        atom.notifications.addError(error);

        return false;
      }

      this.config = (0, _underscorePlus.deepClone)(this.projectConfig);

      if (!this.config.libs) {

        this.config.libs = [];
      }

      if (!this.config.plugins) {

        this.config.plugins = {};
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {
      var _this2 = this;

      if (!editor) {

        return;
      }

      var editors = this.editors.slice();

      editors.forEach(function (_editor, i) {

        if (_editor.ref === editor) {

          var buffer = _editor.ref.getModel().getBuffer();
          buffer.destroy();

          _this2.editors.splice(i, 1);
        }
      });
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {
      var _this3 = this;

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      this.editors.forEach(function (editor) {

        var buffer = editor.ref.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text !== '') {

          _this3.config[editor.identifier].push(text);
        }
      });

      var json = JSON.stringify(this.config, null, 2);
      var activePane = atom.workspace.getActivePane();

      (0, _atomTernjsHelper.updateTernFile)(json);

      activePane && activePane.destroy();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.editors.forEach(function (editor) {

        var buffer = editor.ref.getModel().getBuffer();
        buffer.destroy();
      });

      this.editors = [];
    }
  }]);

  return ConfigModel;
})();

exports['default'] = ConfigModel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvbW9kZWxzL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUVvQix3QkFBd0I7Ozs7Z0NBS3JDLHVCQUF1Qjs7OEJBSXZCLGlCQUFpQjs7Z0NBS2pCLDBCQUEwQjs7QUFoQmpDLFdBQVcsQ0FBQzs7QUFrQlosSUFBTSxLQUFLLEdBQUcsNEJBQTRCLENBQUM7O0lBRXRCLFdBQVc7QUFFbkIsV0FGUSxXQUFXLEdBRWhCOzBCQUZLLFdBQVc7Ozs7OztBQVE1QixRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Ozs7O0FBS2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COztlQW5Ca0IsV0FBVzs7V0FxQnhCLGtCQUFHOztBQUVQLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNqQjs7O1dBRVkseUJBQUc7O0FBRWQsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0tBQ3hCOzs7V0FFWSx1QkFBQyxHQUFHLEVBQUU7O0FBRWpCLFVBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0tBQ3ZCOzs7V0FFSyxnQkFBQyxHQUFHLEVBQUU7O0FBRVYsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7S0FDaEI7OztXQUVPLG9CQUFHOztBQUVULGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztXQUVLLGdCQUFDLEdBQUcsRUFBRTs7QUFFVixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFOztBQUVuQyxZQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDNUI7S0FDRjs7O1dBRVEsbUJBQUMsR0FBRyxFQUFFOzs7QUFFYixVQUFNLElBQUks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RVIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7O0FBRS9CLFlBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakQsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2xCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNuQjs7O1NBdE1rQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL21vZGVscy9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5cbmltcG9ydCB7XG4gIHVwZGF0ZVRlcm5GaWxlLFxuICByZWFkRmlsZVxufSBmcm9tICcuLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5pbXBvcnQge1xuICBkZWVwQ2xvbmVcbn0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuaW1wb3J0IHtcbiAgZGVmYXVsdFByb2plY3RDb25maWcsXG4gIGF2YWlsYWJsZVBsdWdpbnNcbn0gZnJvbSAnLi4vLi4vY29uZmlnL3Rlcm4tY29uZmlnJztcblxuY29uc3QgdGl0bGUgPSAnYXRvbS10ZXJuanMgcHJvamVjdCBjb25maWcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWdNb2RlbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAvKipcbiAgICAgKiBwcm9qZWN0IGNvbmZpZ3VyYXRpb24gKC50ZXJuLXByb2plY3QpXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnByb2plY3RDb25maWcgPSB7fTtcbiAgICAvKipcbiAgICAgKiB0ZW1wb3JhcnkgcHJvamVjdCBjb25maWd1cmF0aW9uXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIC8qKlxuICAgICAqIGNvbGxlY3Rpb24gb2YgYWxsIGVkaXRvcnMgaW4gY29uZmlnIHZpZXdcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cblxuICBnZXRVUkkoKSB7XG5cbiAgICByZXR1cm4gdGhpcy51Ukk7XG4gIH1cblxuICBnZXRQcm9qZWN0RGlyKCkge1xuXG4gICAgcmV0dXJuIHRoaXMucHJvamVjdERpcjtcbiAgfVxuXG4gIHNldFByb2plY3REaXIoZGlyKSB7XG5cbiAgICB0aGlzLnByb2plY3REaXIgPSBkaXI7XG4gIH1cblxuICBzZXRVUkkodVJJKSB7XG5cbiAgICB0aGlzLnVSSSA9IHVSSTtcbiAgfVxuXG4gIGdldFRpdGxlKCkge1xuXG4gICAgcmV0dXJuIHRpdGxlO1xuICB9XG5cbiAgYWRkTGliKGxpYikge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5saWJzLmluY2x1ZGVzKGxpYikpIHtcblxuICAgICAgdGhpcy5jb25maWcubGlicy5wdXNoKGxpYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTGliKGxpYikge1xuXG4gICAgY29uc3QgbGlicyA9IHRoaXMuY29uZmlnLmxpYnMuc2xpY2UoKTtcblxuICAgIGxpYnMuZm9yRWFjaCgoX2xpYiwgaSkgPT4ge1xuXG4gICAgICBpZiAoX2xpYiA9PT0gbGliKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWcubGlicy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRFY21hVmVyc2lvbigpIHtcblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbnM7XG4gIH1cblxuICBzZXRFY21hVmVyc2lvbih2YWx1ZSkge1xuXG4gICAgdGhpcy5jb25maWcuZWNtYVZlcnNpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIGFkZFBsdWdpbihrZXkpIHtcblxuICAgIGlmICghdGhpcy5jb25maWcucGx1Z2luc1trZXldKSB7XG5cbiAgICAgIC8vIGlmIHRoZXJlIHdhcyBhIHByZXZpb3VzIGNvbmZpZyBmb3IgdGhpcyBwbHVnaW5nXG4gICAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnLnBsdWdpbnMgJiYgdGhpcy5wcm9qZWN0Q29uZmlnLnBsdWdpbnNba2V5XSkge1xuXG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XSA9IHRoaXMucHJvamVjdENvbmZpZy5wbHVnaW5zW2tleV07XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW2tleV0gPSBhdmFpbGFibGVQbHVnaW5zW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlUGx1Z2luKGtleSkge1xuXG4gICAgdGhpcy5jb25maWcucGx1Z2luc1trZXldICYmIGRlbGV0ZSB0aGlzLmNvbmZpZy5wbHVnaW5zW2tleV07XG4gIH1cblxuICBnYXRoZXJEYXRhKCkge1xuXG4gICAgY29uc3QgcHJvamVjdERpciA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICBpZiAoIXByb2plY3REaXIpIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdObyBQcm9qZWN0IGZvdW5kLicpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdENvbmZpZyA9IHJlYWRGaWxlKGAke3Byb2plY3REaXJ9Ly50ZXJuLXByb2plY3RgKTtcblxuICAgIGlmICghcHJvamVjdENvbmZpZykge1xuXG4gICAgICB0aGlzLmNvbmZpZyA9IGRlZXBDbG9uZShkZWZhdWx0UHJvamVjdENvbmZpZyk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIHRoaXMucHJvamVjdENvbmZpZyA9IEpTT04ucGFyc2UocHJvamVjdENvbmZpZyk7XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZXJyb3IpO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcgPSBkZWVwQ2xvbmUodGhpcy5wcm9qZWN0Q29uZmlnKTtcblxuICAgIGlmICghdGhpcy5jb25maWcubGlicykge1xuXG4gICAgICB0aGlzLmNvbmZpZy5saWJzID0gW107XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnMgPSB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3JzID0gdGhpcy5lZGl0b3JzLnNsaWNlKCk7XG5cbiAgICBlZGl0b3JzLmZvckVhY2goKF9lZGl0b3IsIGkpID0+IHtcblxuICAgICAgaWYgKF9lZGl0b3IucmVmID09PSBlZGl0b3IpIHtcblxuICAgICAgICBjb25zdCBidWZmZXIgPSBfZWRpdG9yLnJlZi5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpO1xuICAgICAgICBidWZmZXIuZGVzdHJveSgpO1xuXG4gICAgICAgIHRoaXMuZWRpdG9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVDb25maWcoKSB7XG5cbiAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSA9IFtdO1xuICAgIHRoaXMuY29uZmlnLmRvbnRMb2FkID0gW107XG5cbiAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG5cbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5yZWYuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKTtcbiAgICAgIGNvbnN0IHRleHQgPSBidWZmZXIuZ2V0VGV4dCgpLnRyaW0oKTtcblxuICAgICAgaWYgKHRleHQgIT09ICcnKSB7XG5cbiAgICAgICAgdGhpcy5jb25maWdbZWRpdG9yLmlkZW50aWZpZXJdLnB1c2godGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodGhpcy5jb25maWcsIG51bGwsIDIpO1xuICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG5cbiAgICB1cGRhdGVUZXJuRmlsZShqc29uKTtcblxuICAgIGFjdGl2ZVBhbmUgJiYgYWN0aXZlUGFuZS5kZXN0cm95KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgdGhpcy5lZGl0b3JzLmZvckVhY2goKGVkaXRvcikgPT4ge1xuXG4gICAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IucmVmLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cbn1cbiJdfQ==