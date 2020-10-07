Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsHelper2 = require('././atom-ternjs-helper');

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation() {
    _classCallCheck(this, Documentation);

    this.disposable = null;
    this.disposables = [];

    this.view = null;
    this.overlayDecoration = null;
    this.destroyDocumenationListener = this.destroyOverlay.bind(this);
  }

  _createClass(Documentation, [{
    key: 'init',
    value: function init() {

      this.view = new DocumentationView();
      this.view.initialize(this);

      atom.views.getView(atom.workspace).appendChild(this.view);

      _atomTernjsEvents2['default'].on('documentation-destroy-overlay', this.destroyDocumenationListener);
      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', this.request.bind(this)));
    }
  }, {
    key: 'request',
    value: function request() {
      var _this = this;

      this.destroyOverlay();
      var editor = atom.workspace.getActiveTextEditor();

      if (!editor || !_atomTernjsManager2['default'].client) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: (0, _atomTernjsHelper2.replaceTags)(data.doc),
            origin: data.origin,
            type: (0, _atomTernjsHelper2.formatType)(data),
            url: data.url || ''
          });

          _this.show();
        });
      })['catch'](_servicesDebug2['default'].handleCatch);
    }
  }, {
    key: 'show',
    value: function show() {

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var marker = editor.getLastCursor && editor.getLastCursor().getMarker();

      if (!marker) {

        return;
      }

      this.disposable = editor.onDidChangeCursorPosition(this.destroyDocumenationListener);

      this.overlayDecoration = editor.decorateMarker(marker, {

        type: 'overlay',
        item: this.view,
        'class': 'atom-ternjs-documentation',
        position: 'tale',
        invalidate: 'touch'
      });
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      this.disposable && this.disposable.dispose();

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('documentation-destroy-overlay', this.destroyDocumenationListener);

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }]);

  return Documentation;
})();

exports['default'] = new Documentation();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUlvQix1QkFBdUI7Ozs7Z0NBQ3ZCLHNCQUFzQjs7OztnQ0FDakIsc0JBQXNCOztpQ0FJeEMsd0JBQXdCOzs2QkFDYixrQkFBa0I7Ozs7QUFYcEMsV0FBVyxDQUFDOztBQUVaLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0lBV2hFLGFBQWE7QUFFTixXQUZQLGFBQWEsR0FFSDswQkFGVixhQUFhOztBQUlmLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFFBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNuRTs7ZUFWRyxhQUFhOztXQVliLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFMUQsb0NBQVEsRUFBRSxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzlFLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwSDs7O1dBRU0sbUJBQUc7OztBQUVSLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7O0FBRWxELFVBQ0UsQ0FBQyxNQUFNLElBQ1AsQ0FBQywrQkFBUSxNQUFNLEVBQ2Y7O0FBRUEsZUFBTztPQUNSOztBQUVELFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNwQyxVQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFMUMscUNBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRTNDLHVDQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7O0FBRTVFLGNBQUksRUFBRSxRQUFRLENBQUMsR0FBRztBQUNsQixZQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU07O1NBRXBCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRWhCLGNBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRVQsbUJBQU87V0FDUjs7QUFFRCxnQkFBSyxJQUFJLENBQUMsT0FBTyxDQUFDOztBQUVoQixlQUFHLEVBQUUsb0NBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUMxQixrQkFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLGdCQUFJLEVBQUUsbUNBQVcsSUFBSSxDQUFDO0FBQ3RCLGVBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUU7V0FDcEIsQ0FBQyxDQUFDOztBQUVILGdCQUFLLElBQUksRUFBRSxDQUFDO1NBQ2IsQ0FBQyxDQUFDO09BQ0osQ0FBQyxTQUNJLENBQUMsMkJBQU0sV0FBVyxDQUFDLENBQUM7S0FDM0I7OztXQUVHLGdCQUFHOztBQUVMLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFWCxlQUFPO09BQ1I7O0FBRUQsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRTFFLFVBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRVgsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztBQUVyRixVQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7O0FBRXJELFlBQUksRUFBRSxTQUFTO0FBQ2YsWUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsaUJBQU8sMkJBQTJCO0FBQ2xDLGdCQUFRLEVBQUUsTUFBTTtBQUNoQixrQkFBVSxFQUFFLE9BQU87T0FDcEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVhLDBCQUFHOztBQUVmLFVBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFN0MsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O0FBRTFCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNsQzs7QUFFRCxVQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0tBQy9COzs7V0FFTSxtQkFBRzs7QUFFUixvQ0FBUSxHQUFHLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRS9FLHdDQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV0QixVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRWIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztPQUNsQjtLQUNGOzs7U0F6SEcsYUFBYTs7O3FCQTRISixJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgRG9jdW1lbnRhdGlvblZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldycpO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IHtkaXNwb3NlQWxsfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQge1xuICByZXBsYWNlVGFncyxcbiAgZm9ybWF0VHlwZVxufSBmcm9tICcuLy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBkZWJ1ZyBmcm9tICcuL3NlcnZpY2VzL2RlYnVnJztcblxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGUgPSBudWxsO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uTGlzdGVuZXIgPSB0aGlzLmRlc3Ryb3lPdmVybGF5LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IERvY3VtZW50YXRpb25WaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG5cbiAgICBlbWl0dGVyLm9uKCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScsIHRoaXMuZGVzdHJveURvY3VtZW5hdGlvbkxpc3RlbmVyKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6ZG9jdW1lbnRhdGlvbicsIHRoaXMucmVxdWVzdC5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICByZXF1ZXN0KCkge1xuXG4gICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBpZiAoXG4gICAgICAhZWRpdG9yIHx8XG4gICAgICAhbWFuYWdlci5jbGllbnRcbiAgICApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgIGxldCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBtYW5hZ2VyLmNsaWVudC5kb2N1bWVudGF0aW9uKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7XG5cbiAgICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgICBjaDogcG9zaXRpb24uY29sdW1uXG5cbiAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXREYXRhKHtcblxuICAgICAgICAgIGRvYzogcmVwbGFjZVRhZ3MoZGF0YS5kb2MpLFxuICAgICAgICAgIG9yaWdpbjogZGF0YS5vcmlnaW4sXG4gICAgICAgICAgdHlwZTogZm9ybWF0VHlwZShkYXRhKSxcbiAgICAgICAgICB1cmw6IGRhdGEudXJsIHx8ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZGVidWcuaGFuZGxlQ2F0Y2gpO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvciAmJiBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldE1hcmtlcigpO1xuXG4gICAgaWYgKCFtYXJrZXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZSA9IGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKHRoaXMuZGVzdHJveURvY3VtZW5hdGlvbkxpc3RlbmVyKTtcblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG5cbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMudmlldyxcbiAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsXG4gICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveU92ZXJsYXkoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGUgJiYgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGVtaXR0ZXIub2ZmKCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScsIHRoaXMuZGVzdHJveURvY3VtZW5hdGlvbkxpc3RlbmVyKTtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuXG4gICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgaWYgKHRoaXMudmlldykge1xuXG4gICAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERvY3VtZW50YXRpb24oKTtcbiJdfQ==