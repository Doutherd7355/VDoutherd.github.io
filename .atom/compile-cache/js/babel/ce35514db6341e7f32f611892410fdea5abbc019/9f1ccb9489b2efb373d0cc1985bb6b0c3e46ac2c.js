Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _configTernConfigDocs = require('../../config/tern-config-docs');

var _configTernConfigDocs2 = _interopRequireDefault(_configTernConfigDocs);

var _configTernPluginsDefintionsJs = require('../../config/tern-plugins-defintions.js');

var _configTernPluginsDefintionsJs2 = _interopRequireDefault(_configTernPluginsDefintionsJs);

var _configTernConfig = require('../../config/tern-config');

'use babel';

var templateContainer = '\n\n  <div>\n    <h1 class="title"></h1>\n    <div class="content"></div>\n    <button class="btn btn-default">Save &amp; Restart Server</button>\n  </div>\n';

var createView = function createView(model) {

  return new ConfigView(model).init();
};

exports.createView = createView;

var ConfigView = (function () {
  function ConfigView(model) {
    _classCallCheck(this, ConfigView);

    this.setModel(model);
    model.gatherData();
  }

  _createClass(ConfigView, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var projectDir = this.model.getProjectDir();

      this.el = document.createElement('div');
      this.el.classList.add('atom-ternjs-config');
      this.el.innerHTML = templateContainer;

      var elContent = this.el.querySelector('.content');
      var elTitle = this.el.querySelector('.title');
      elTitle.innerHTML = projectDir;

      var buttonSave = this.el.querySelector('button');

      buttonSave.addEventListener('click', function (e) {

        _this.model.updateConfig();
      });

      var sectionEcmaVersion = this.renderSection('ecmaVersion');
      var ecmaVersions = this.renderRadio();
      ecmaVersions.forEach(function (ecmaVersion) {
        return sectionEcmaVersion.appendChild(ecmaVersion);
      });
      elContent.appendChild(sectionEcmaVersion);

      var sectionLibs = this.renderSection('libs');
      var libs = this.renderlibs();
      libs.forEach(function (lib) {
        return sectionLibs.appendChild(lib);
      });
      elContent.appendChild(sectionLibs);

      elContent.appendChild(this.renderEditors('loadEagerly', this.model.config.loadEagerly));
      elContent.appendChild(this.renderEditors('dontLoad', this.model.config.dontLoad));

      var sectionPlugins = this.renderSection('plugins');
      var plugins = this.renderPlugins();
      plugins.forEach(function (plugin) {
        return sectionPlugins.appendChild(plugin);
      });
      elContent.appendChild(sectionPlugins);

      return this.el;
    }
  }, {
    key: 'renderSection',
    value: function renderSection(title) {

      var section = document.createElement('section');
      section.classList.add(title);

      var header = document.createElement('h2');
      header.innerHTML = title;

      section.appendChild(header);

      var docs = _configTernConfigDocs2['default'][title].doc;

      if (docs) {

        var doc = document.createElement('p');
        doc.innerHTML = docs;

        section.appendChild(doc);
      }

      return section;
    }
  }, {
    key: 'renderRadio',
    value: function renderRadio() {
      var _this2 = this;

      return _configTernConfig.ecmaVersions.map(function (ecmaVersion) {

        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');

        var label = document.createElement('span');
        label.innerHTML = 'ecmaVersion ' + ecmaVersion;

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.value = ecmaVersion;
        radio.checked = parseInt(_this2.model.config.ecmaVersion) === ecmaVersion;

        radio.addEventListener('change', function (e) {

          _this2.model.setEcmaVersion(e.target.value);
        }, false);

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);

        return inputWrapper;
      });
    }
  }, {
    key: 'renderEditors',
    value: function renderEditors(identifier) {
      var _this3 = this;

      var paths = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var section = this.renderSection(identifier);

      paths.forEach(function (path) {

        section.appendChild(_this3.createInputWrapper(path, identifier));
      });

      section.appendChild(this.createInputWrapper(null, identifier));

      return section;
    }
  }, {
    key: 'renderPlugins',
    value: function renderPlugins() {
      var _this4 = this;

      var plugins = Object.keys(this.model.config.plugins);
      var availablePluginsKeys = Object.keys(_configTernConfig.availablePlugins);
      var unknownPlugins = plugins.filter(function (plugin) {

        return !_configTernConfig.availablePlugins[plugin] ? true : false;
      });

      return availablePluginsKeys.map(function (plugin) {
        return _this4.renderPlugin(plugin);
      }).concat(unknownPlugins.map(function (plugin) {
        return _this4.renderPlugin(plugin);
      }));
    }
  }, {
    key: 'renderPlugin',
    value: function renderPlugin(plugin) {

      var wrapper = document.createElement('p');

      wrapper.appendChild(this.buildBoolean(plugin, 'plugin', this.model.config.plugins[plugin]));

      var doc = document.createElement('span');
      doc.innerHTML = _configTernPluginsDefintionsJs2['default'][plugin] && _configTernPluginsDefintionsJs2['default'][plugin].doc;

      wrapper.appendChild(doc);

      return wrapper;
    }
  }, {
    key: 'renderlibs',
    value: function renderlibs() {
      var _this5 = this;

      return _configTernConfig.availableLibs.map(function (lib) {

        return _this5.buildBoolean(lib, 'lib', _this5.model.config.libs.includes(lib));
      });
    }
  }, {
    key: 'buildBoolean',
    value: function buildBoolean(key, type, checked) {
      var _this6 = this;

      var inputWrapper = document.createElement('div');
      var label = document.createElement('span');
      var checkbox = document.createElement('input');

      inputWrapper.classList.add('input-wrapper');
      label.innerHTML = key;
      checkbox.type = 'checkbox';
      checkbox.value = key;
      checkbox.checked = checked;

      checkbox.addEventListener('change', function (e) {

        switch (type) {

          case 'lib':
            {

              e.target.checked ? _this6.model.addLib(key) : _this6.model.removeLib(key);
            }break;

          case 'plugin':
            {

              e.target.checked ? _this6.model.addPlugin(key) : _this6.model.removePlugin(key);
            }
        }
      }, false);

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(checkbox);

      return inputWrapper;
    }
  }, {
    key: 'createInputWrapper',
    value: function createInputWrapper(path, identifier) {

      var inputWrapper = document.createElement('div');
      var editor = this.createTextEditor(path, identifier);

      inputWrapper.classList.add('input-wrapper');
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(identifier));
      inputWrapper.appendChild(this.createSub(editor));

      return inputWrapper;
    }
  }, {
    key: 'createSub',
    value: function createSub(editor) {
      var _this7 = this;

      var sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');

      sub.addEventListener('click', function (e) {

        _this7.model.removeEditor(editor);
        var inputWrapper = e.target.closest('.input-wrapper');
        inputWrapper.parentNode.removeChild(inputWrapper);
      }, false);

      return sub;
    }
  }, {
    key: 'createAdd',
    value: function createAdd(identifier) {
      var _this8 = this;

      var add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', function (e) {

        e.target.closest('section').appendChild(_this8.createInputWrapper(null, identifier));
      }, false);

      return add;
    }
  }, {
    key: 'createTextEditor',
    value: function createTextEditor(path, identifier) {

      var editor = document.createElement('atom-text-editor');
      editor.setAttribute('mini', true);

      if (path) {

        editor.getModel().getBuffer().setText(path);
      }

      this.model.editors.push({

        identifier: identifier,
        ref: editor
      });

      return editor;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.el.remove();
    }
  }]);

  return ConfigView;
})();

exports['default'] = ConfigView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvdmlld3MvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0NBRTJCLCtCQUErQjs7Ozs2Q0FDNUIseUNBQXlDOzs7O2dDQU1oRSwwQkFBMEI7O0FBVGpDLFdBQVcsQ0FBQzs7QUFXWixJQUFNLGlCQUFpQixrS0FPdEIsQ0FBQzs7QUFFSyxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUs7O0FBRW5DLFNBQU8sSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Q0FDckMsQ0FBQzs7OztJQUVtQixVQUFVO0FBRWxCLFdBRlEsVUFBVSxDQUVqQixLQUFLLEVBQUU7MEJBRkEsVUFBVTs7QUFJM0IsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQixTQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDcEI7O2VBTmtCLFVBQVU7O1dBUXpCLGdCQUFHOzs7QUFFTCxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDOztBQUU5QyxVQUFJLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7O0FBRXRDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELGFBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDOztBQUUvQixV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S0FBSyxDQUFDLENBQUM7O0FBRVYsYUFBTyxHQUFHLENBQUM7S0FDWjs7O1dBRWUsMEJBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTs7QUFFakMsVUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFELFlBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVsQyxVQUFJLElBQUksRUFBRTs7QUFFUixjQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzdDOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzs7QUFFdEIsa0JBQVUsRUFBVixVQUFVO0FBQ1YsV0FBRyxFQUFFLE1BQU07T0FDWixDQUFDLENBQUM7O0FBRUgsYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRU8sb0JBQUc7O0FBRVQsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0tBQ25COzs7V0FFTyxrQkFBQyxLQUFLLEVBQUU7O0FBRWQsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDbEI7OztTQXJSa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi92aWV3cy9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHRlcm5Db25maWdEb2NzIGZyb20gJy4uLy4uL2NvbmZpZy90ZXJuLWNvbmZpZy1kb2NzJztcbmltcG9ydCBwbHVnaW5EZWZpbml0aW9ucyBmcm9tICcuLi8uLi9jb25maWcvdGVybi1wbHVnaW5zLWRlZmludGlvbnMuanMnO1xuXG5pbXBvcnQge1xuICBlY21hVmVyc2lvbnMsXG4gIGF2YWlsYWJsZUxpYnMsXG4gIGF2YWlsYWJsZVBsdWdpbnNcbn0gZnJvbSAnLi4vLi4vY29uZmlnL3Rlcm4tY29uZmlnJztcblxuY29uc3QgdGVtcGxhdGVDb250YWluZXIgPSBgXG5cbiAgPGRpdj5cbiAgICA8aDEgY2xhc3M9XCJ0aXRsZVwiPjwvaDE+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+U2F2ZSAmYW1wOyBSZXN0YXJ0IFNlcnZlcjwvYnV0dG9uPlxuICA8L2Rpdj5cbmA7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVWaWV3ID0gKG1vZGVsKSA9PiB7XG5cbiAgcmV0dXJuIG5ldyBDb25maWdWaWV3KG1vZGVsKS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWdWaWV3IHtcblxuICBjb25zdHJ1Y3Rvcihtb2RlbCkge1xuXG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbCk7XG4gICAgbW9kZWwuZ2F0aGVyRGF0YSgpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIGNvbnN0IHByb2plY3REaXIgPSB0aGlzLm1vZGVsLmdldFByb2plY3REaXIoKTtcblxuICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWNvbmZpZycpO1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVDb250YWluZXI7XG5cbiAgICBjb25zdCBlbENvbnRlbnQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG4gICAgY29uc3QgZWxUaXRsZSA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG4gICAgZWxUaXRsZS5pbm5lckhUTUwgPSBwcm9qZWN0RGlyO1xuXG4gICAgY29uc3QgYnV0dG9uU2F2ZSA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG5cbiAgICBidXR0b25TYXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgdGhpcy5tb2RlbC51cGRhdGVDb25maWcoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlY3Rpb25FY21hVmVyc2lvbiA9IHRoaXMucmVuZGVyU2VjdGlvbignZWNtYVZlcnNpb24nKTtcbiAgICBjb25zdCBlY21hVmVyc2lvbnMgPSB0aGlzLnJlbmRlclJhZGlvKCk7XG4gICAgZWNtYVZlcnNpb25zLmZvckVhY2goZWNtYVZlcnNpb24gPT4gc2VjdGlvbkVjbWFWZXJzaW9uLmFwcGVuZENoaWxkKGVjbWFWZXJzaW9uKSk7XG4gICAgZWxDb250ZW50LmFwcGVuZENoaWxkKHNlY3Rpb25FY21hVmVyc2lvbik7XG5cbiAgICBjb25zdCBzZWN0aW9uTGlicyA9IHRoaXMucmVuZGVyU2VjdGlvbignbGlicycpO1xuICAgIGNvbnN0IGxpYnMgPSB0aGlzLnJlbmRlcmxpYnMoKTtcbiAgICBsaWJzLmZvckVhY2gobGliID0+IHNlY3Rpb25MaWJzLmFwcGVuZENoaWxkKGxpYikpO1xuICAgIGVsQ29udGVudC5hcHBlbmRDaGlsZChzZWN0aW9uTGlicyk7XG5cbiAgICBlbENvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJFZGl0b3JzKCdsb2FkRWFnZXJseScsIHRoaXMubW9kZWwuY29uZmlnLmxvYWRFYWdlcmx5KSk7XG4gICAgZWxDb250ZW50LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyRWRpdG9ycygnZG9udExvYWQnLCB0aGlzLm1vZGVsLmNvbmZpZy5kb250TG9hZCkpO1xuXG4gICAgY29uc3Qgc2VjdGlvblBsdWdpbnMgPSB0aGlzLnJlbmRlclNlY3Rpb24oJ3BsdWdpbnMnKTtcbiAgICBjb25zdCBwbHVnaW5zID0gdGhpcy5yZW5kZXJQbHVnaW5zKCk7XG4gICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiBzZWN0aW9uUGx1Z2lucy5hcHBlbmRDaGlsZChwbHVnaW4pKTtcbiAgICBlbENvbnRlbnQuYXBwZW5kQ2hpbGQoc2VjdGlvblBsdWdpbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWw7XG4gIH1cblxuICByZW5kZXJTZWN0aW9uKHRpdGxlKSB7XG5cbiAgICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VjdGlvbicpO1xuICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZCh0aXRsZSk7XG5cbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIGhlYWRlci5pbm5lckhUTUwgPSB0aXRsZTtcblxuICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblxuICAgIGNvbnN0IGRvY3MgPSB0ZXJuQ29uZmlnRG9jc1t0aXRsZV0uZG9jO1xuXG4gICAgaWYgKGRvY3MpIHtcblxuICAgICAgY29uc3QgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgZG9jLmlubmVySFRNTCA9IGRvY3M7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoZG9jKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIHJlbmRlclJhZGlvKCkge1xuXG4gICAgcmV0dXJuIGVjbWFWZXJzaW9ucy5tYXAoKGVjbWFWZXJzaW9uKSA9PiB7XG5cbiAgICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcblxuICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSBgZWNtYVZlcnNpb24gJHtlY21hVmVyc2lvbn1gO1xuXG4gICAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICByYWRpby50eXBlID0gJ3JhZGlvJztcbiAgICAgIHJhZGlvLm5hbWUgPSAnZWNtYVZlcnNpb25zJztcbiAgICAgIHJhZGlvLnZhbHVlID0gZWNtYVZlcnNpb247XG4gICAgICByYWRpby5jaGVja2VkID0gcGFyc2VJbnQodGhpcy5tb2RlbC5jb25maWcuZWNtYVZlcnNpb24pID09PSBlY21hVmVyc2lvbjtcblxuICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblxuICAgICAgICB0aGlzLm1vZGVsLnNldEVjbWFWZXJzaW9uKGUudGFyZ2V0LnZhbHVlKTtcblxuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKHJhZGlvKTtcblxuICAgICAgcmV0dXJuIGlucHV0V3JhcHBlcjtcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlckVkaXRvcnMoaWRlbnRpZmllciwgcGF0aHMgPSBbXSkge1xuXG4gICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMucmVuZGVyU2VjdGlvbihpZGVudGlmaWVyKTtcblxuICAgIHBhdGhzLmZvckVhY2goKHBhdGgpID0+IHtcblxuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihwYXRoLCBpZGVudGlmaWVyKSk7XG4gICAgfSk7XG5cbiAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5wdXRXcmFwcGVyKG51bGwsIGlkZW50aWZpZXIpKTtcblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgcmVuZGVyUGx1Z2lucygpIHtcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBPYmplY3Qua2V5cyh0aGlzLm1vZGVsLmNvbmZpZy5wbHVnaW5zKTtcbiAgICBjb25zdCBhdmFpbGFibGVQbHVnaW5zS2V5cyA9IE9iamVjdC5rZXlzKGF2YWlsYWJsZVBsdWdpbnMpO1xuICAgIGNvbnN0IHVua25vd25QbHVnaW5zID0gcGx1Z2lucy5maWx0ZXIoKHBsdWdpbikgPT4ge1xuXG4gICAgICByZXR1cm4gIWF2YWlsYWJsZVBsdWdpbnNbcGx1Z2luXSA/IHRydWUgOiBmYWxzZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBhdmFpbGFibGVQbHVnaW5zS2V5cy5tYXAocGx1Z2luID0+IHRoaXMucmVuZGVyUGx1Z2luKHBsdWdpbikpXG4gICAgLmNvbmNhdCh1bmtub3duUGx1Z2lucy5tYXAocGx1Z2luID0+IHRoaXMucmVuZGVyUGx1Z2luKHBsdWdpbikpKTtcbiAgfVxuXG4gIHJlbmRlclBsdWdpbihwbHVnaW4pIHtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKFxuICAgICAgdGhpcy5idWlsZEJvb2xlYW4oXG4gICAgICAgIHBsdWdpbixcbiAgICAgICAgJ3BsdWdpbicsXG4gICAgICAgIHRoaXMubW9kZWwuY29uZmlnLnBsdWdpbnNbcGx1Z2luXVxuICAgICAgKVxuICAgICk7XG5cbiAgICBjb25zdCBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgZG9jLmlubmVySFRNTCA9IHBsdWdpbkRlZmluaXRpb25zW3BsdWdpbl0gJiYgcGx1Z2luRGVmaW5pdGlvbnNbcGx1Z2luXS5kb2M7XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRvYyk7XG5cbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfVxuXG4gIHJlbmRlcmxpYnMoKSB7XG5cbiAgICByZXR1cm4gYXZhaWxhYmxlTGlicy5tYXAoKGxpYikgPT4ge1xuXG4gICAgICByZXR1cm4gdGhpcy5idWlsZEJvb2xlYW4oXG4gICAgICAgICAgbGliLFxuICAgICAgICAgICdsaWInLFxuICAgICAgICAgIHRoaXMubW9kZWwuY29uZmlnLmxpYnMuaW5jbHVkZXMobGliKVxuICAgICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgYnVpbGRCb29sZWFuKGtleSwgdHlwZSwgY2hlY2tlZCkge1xuXG4gICAgY29uc3QgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXG4gICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcbiAgICBsYWJlbC5pbm5lckhUTUwgPSBrZXk7XG4gICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgY2hlY2tib3gudmFsdWUgPSBrZXk7XG4gICAgY2hlY2tib3guY2hlY2tlZCA9IGNoZWNrZWQ7XG5cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcblxuICAgICAgICBjYXNlICdsaWInOiB7XG5cbiAgICAgICAgICBlLnRhcmdldC5jaGVja2VkID8gdGhpcy5tb2RlbC5hZGRMaWIoa2V5KSA6IHRoaXMubW9kZWwucmVtb3ZlTGliKGtleSk7XG5cbiAgICAgICAgfSBicmVhaztcblxuICAgICAgICBjYXNlICdwbHVnaW4nOiB7XG5cbiAgICAgICAgICBlLnRhcmdldC5jaGVja2VkID8gdGhpcy5tb2RlbC5hZGRQbHVnaW4oa2V5KSA6IHRoaXMubW9kZWwucmVtb3ZlUGx1Z2luKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0sIGZhbHNlKTtcblxuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcblxuICAgIHJldHVybiBpbnB1dFdyYXBwZXI7XG4gIH1cblxuICBjcmVhdGVJbnB1dFdyYXBwZXIocGF0aCwgaWRlbnRpZmllcikge1xuXG4gICAgY29uc3QgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgZWRpdG9yID0gdGhpcy5jcmVhdGVUZXh0RWRpdG9yKHBhdGgsIGlkZW50aWZpZXIpO1xuXG4gICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQoZWRpdG9yKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBZGQoaWRlbnRpZmllcikpO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVN1YihlZGl0b3IpKTtcblxuICAgIHJldHVybiBpbnB1dFdyYXBwZXI7XG4gIH1cblxuICBjcmVhdGVTdWIoZWRpdG9yKSB7XG5cbiAgICBjb25zdCBzdWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ3N1YicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLXJlbW92ZWQnKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaWNvbicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdpY29uLWRpZmYtcmVtb3ZlZCcpO1xuXG4gICAgc3ViLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgdGhpcy5tb2RlbC5yZW1vdmVFZGl0b3IoZWRpdG9yKTtcbiAgICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5pbnB1dC13cmFwcGVyJyk7XG4gICAgICBpbnB1dFdyYXBwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbnB1dFdyYXBwZXIpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHN1YjtcbiAgfVxuXG4gIGNyZWF0ZUFkZChpZGVudGlmaWVyKSB7XG5cbiAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2FkZCcpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLWFkZGVkJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2ljb24nKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnaWNvbi1kaWZmLWFkZGVkJyk7XG4gICAgYWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgZS50YXJnZXQuY2xvc2VzdCgnc2VjdGlvbicpLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5wdXRXcmFwcGVyKG51bGwsIGlkZW50aWZpZXIpKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBhZGQ7XG4gIH1cblxuICBjcmVhdGVUZXh0RWRpdG9yKHBhdGgsIGlkZW50aWZpZXIpIHtcblxuICAgIGNvbnN0IGVkaXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tdGV4dC1lZGl0b3InKTtcbiAgICBlZGl0b3Iuc2V0QXR0cmlidXRlKCdtaW5pJywgdHJ1ZSk7XG5cbiAgICBpZiAocGF0aCkge1xuXG4gICAgICBlZGl0b3IuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5zZXRUZXh0KHBhdGgpO1xuICAgIH1cblxuICAgIHRoaXMubW9kZWwuZWRpdG9ycy5wdXNoKHtcblxuICAgICAgaWRlbnRpZmllcixcbiAgICAgIHJlZjogZWRpdG9yXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZWRpdG9yO1xuICB9XG5cbiAgZ2V0TW9kZWwoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5tb2RlbDtcbiAgfVxuXG4gIHNldE1vZGVsKG1vZGVsKSB7XG5cbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgdGhpcy5lbC5yZW1vdmUoKTtcbiAgfVxufVxuIl19