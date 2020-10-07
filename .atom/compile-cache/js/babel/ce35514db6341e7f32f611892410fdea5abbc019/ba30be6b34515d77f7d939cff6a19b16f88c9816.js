Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var TypeView = require('./atom-ternjs-type-view');
var TOLERANCE = 20;

var Type = (function () {
  function Type() {
    _classCallCheck(this, Type);

    this.view = null;
    this.overlayDecoration = null;

    this.currentRange = null;
    this.currentViewData = null;

    this.destroyOverlayListener = this.destroyOverlay.bind(this);
  }

  _createClass(Type, [{
    key: 'init',
    value: function init() {

      this.view = new TypeView();
      this.view.initialize(this);

      atom.views.getView(atom.workspace).appendChild(this.view);

      _atomTernjsEvents2['default'].on('type-destroy-overlay', this.destroyOverlayListener);
    }
  }, {
    key: 'setPosition',
    value: function setPosition() {

      if (this.overlayDecoration) {

        return;
      }

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var marker = editor.getLastCursor().getMarker();

      if (!marker) {

        return;
      }

      this.overlayDecoration = editor.decorateMarker(marker, {

        type: 'overlay',
        item: this.view,
        'class': 'atom-ternjs-type',
        position: 'tale',
        invalidate: 'touch'
      });
    }
  }, {
    key: 'queryType',
    value: function queryType(editor, e) {
      var _this = this;

      var rowStart = 0;
      var rangeBefore = false;
      var tmp = false;
      var may = 0;
      var may2 = 0;
      var skipCounter = 0;
      var skipCounter2 = 0;
      var paramPosition = 0;
      var position = e.newBufferPosition;
      var buffer = editor.getBuffer();

      if (position.row - TOLERANCE < 0) {

        rowStart = 0;
      } else {

        rowStart = position.row - TOLERANCE;
      }

      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, new _atom.Range([rowStart, 0], [position.row, position.column]), function (obj) {

        var scopeDescriptor = editor.scopeDescriptorForBufferPosition([obj.range.start.row, obj.range.start.column]);

        if (scopeDescriptor.scopes.includes('string.quoted') || scopeDescriptor.scopes.includes('string.regexp')) {

          return;
        }

        if (obj.matchText === '}') {

          may++;
          return;
        }

        if (obj.matchText === ']') {

          if (!tmp) {

            skipCounter2++;
          }

          may2++;
          return;
        }

        if (obj.matchText === '{') {

          if (!may) {

            rangeBefore = false;
            obj.stop();

            return;
          }

          may--;
          return;
        }

        if (obj.matchText === '[') {

          if (skipCounter2) {

            skipCounter2--;
          }

          if (!may2) {

            rangeBefore = false;
            obj.stop();
            return;
          }

          may2--;
          return;
        }

        if (obj.matchText === ')' && !tmp) {

          skipCounter++;
          return;
        }

        if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {

          paramPosition++;
          return;
        }

        if (obj.matchText === ',') {

          return;
        }

        if (obj.matchText === '(' && skipCounter) {

          skipCounter--;
          return;
        }

        if (skipCounter || skipCounter2) {

          return;
        }

        if (obj.matchText === '(' && !tmp) {

          rangeBefore = obj.range;
          obj.stop();

          return;
        }

        tmp = obj.matchText;
      });

      if (!rangeBefore) {

        this.currentViewData = null;
        this.currentRange = null;
        this.destroyOverlay();

        return;
      }

      if (rangeBefore.isEqual(this.currentRange)) {

        this.currentViewData && this.setViewData(this.currentViewData, paramPosition);

        return;
      }

      this.currentRange = rangeBefore;
      this.currentViewData = null;
      this.destroyOverlay();

      _atomTernjsManager2['default'].client.update(editor).then(function () {

        _atomTernjsManager2['default'].client.type(editor, rangeBefore.start).then(function (data) {

          if (!data || !data.type.startsWith('fn') || !data.exprName) {

            return;
          }

          _this.currentViewData = data;

          _this.setViewData(data, paramPosition);
        })['catch'](function (error) {

          // most likely the type wasn't found. ignore it.
        });
      });
    }
  }, {
    key: 'setViewData',
    value: function setViewData(data, paramPosition) {

      var viewData = (0, _underscorePlus.deepClone)(data);
      var type = (0, _atomTernjsHelper.prepareType)(viewData);
      var params = (0, _atomTernjsHelper.extractParams)(type);
      (0, _atomTernjsHelper.formatType)(viewData);

      if (params && params[paramPosition]) {

        viewData.type = viewData.type.replace(params[paramPosition], '<span class="text-info">' + params[paramPosition] + '</span>');
      }

      if (viewData.doc && _atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        viewData.doc = viewData.doc && viewData.doc.replace(/(?:\r\n|\r|\n)/g, '<br />');
        viewData.doc = (0, _atomTernjsHelper.prepareInlineDocs)(viewData.doc);

        this.view.setData(viewData.type, viewData.doc);
      } else {

        this.view.setData(viewData.type);
      }

      this.setPosition();
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('destroy-type-overlay', this.destroyOverlayListener);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }]);

  return Type;
})();

exports['default'] = new Type();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUtvQix1QkFBdUI7Ozs7dUNBQ2pCLDhCQUE4Qjs7OztnQ0FDcEMsc0JBQXNCOzs7O29CQUN0QixNQUFNOztnQ0FNbkIsc0JBQXNCOzs4QkFFTCxpQkFBaUI7O0FBaEJ6QyxXQUFXLENBQUM7O0FBRVosSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDOztJQWVmLElBQUk7QUFFRyxXQUZQLElBQUksR0FFTTswQkFGVixJQUFJOztBQUlOLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDOztBQUU1QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUQ7O2VBWEcsSUFBSTs7V0FhSixnQkFBRzs7QUFFTCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDM0IsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUxRCxvQ0FBUSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FDakU7OztXQUVVLHVCQUFHOztBQUVaLFVBQUksSUFBSSxD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QUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO09BQ2xCO0tBQ0Y7OztTQS9RRyxJQUFJOzs7cUJBa1JLLElBQUksSUFBSSxFQUFFIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBUeXBlVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtdHlwZS12aWV3Jyk7XG5jb25zdCBUT0xFUkFOQ0UgPSAyMDtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge1xuICBwcmVwYXJlVHlwZSxcbiAgcHJlcGFyZUlubGluZURvY3MsXG4gIGV4dHJhY3RQYXJhbXMsXG4gIGZvcm1hdFR5cGVcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5pbXBvcnQge2RlZXBDbG9uZX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuY2xhc3MgVHlwZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBudWxsO1xuXG4gICAgdGhpcy5jdXJyZW50UmFuZ2UgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudFZpZXdEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXlMaXN0ZW5lciA9IHRoaXMuZGVzdHJveU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgVHlwZVZpZXcoKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcblxuICAgIGVtaXR0ZXIub24oJ3R5cGUtZGVzdHJveS1vdmVybGF5JywgdGhpcy5kZXN0cm95T3ZlcmxheUxpc3RlbmVyKTtcbiAgfVxuXG4gIHNldFBvc2l0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheURlY29yYXRpb24pIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldE1hcmtlcigpO1xuXG4gICAgaWYgKCFtYXJrZXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG5cbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMudmlldyxcbiAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtdHlwZScsXG4gICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIH0pO1xuICB9XG5cbiAgcXVlcnlUeXBlKGVkaXRvciwgZSkge1xuXG4gICAgbGV0IHJvd1N0YXJ0ID0gMDtcbiAgICBsZXQgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICBsZXQgdG1wID0gZmFsc2U7XG4gICAgbGV0IG1heSA9IDA7XG4gICAgbGV0IG1heTIgPSAwO1xuICAgIGxldCBza2lwQ291bnRlciA9IDA7XG4gICAgbGV0IHNraXBDb3VudGVyMiA9IDA7XG4gICAgbGV0IHBhcmFtUG9zaXRpb24gPSAwO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZS5uZXdCdWZmZXJQb3NpdGlvbjtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG5cbiAgICBpZiAocG9zaXRpb24ucm93IC0gVE9MRVJBTkNFIDwgMCkge1xuXG4gICAgICByb3dTdGFydCA9IDA7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByb3dTdGFydCA9IHBvc2l0aW9uLnJvdyAtIFRPTEVSQU5DRTtcbiAgICB9XG5cbiAgICBidWZmZXIuYmFja3dhcmRzU2NhbkluUmFuZ2UoL1xcXXxcXFt8XFwofFxcKXxcXCx8XFx7fFxcfS9nLCBuZXcgUmFuZ2UoW3Jvd1N0YXJ0LCAwXSwgW3Bvc2l0aW9uLnJvdywgcG9zaXRpb24uY29sdW1uXSksIChvYmopID0+IHtcblxuICAgICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFtvYmoucmFuZ2Uuc3RhcnQucm93LCBvYmoucmFuZ2Uuc3RhcnQuY29sdW1uXSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgc2NvcGVEZXNjcmlwdG9yLnNjb3Blcy5pbmNsdWRlcygnc3RyaW5nLnF1b3RlZCcpIHx8XG4gICAgICAgIHNjb3BlRGVzY3JpcHRvci5zY29wZXMuaW5jbHVkZXMoJ3N0cmluZy5yZWdleHAnKVxuICAgICAgKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ30nKSB7XG5cbiAgICAgICAgbWF5Kys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICddJykge1xuXG4gICAgICAgIGlmICghdG1wKSB7XG5cbiAgICAgICAgICBza2lwQ291bnRlcjIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG1heTIrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ3snKSB7XG5cbiAgICAgICAgaWYgKCFtYXkpIHtcblxuICAgICAgICAgIHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgICAgICAgb2JqLnN0b3AoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1heS0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnWycpIHtcblxuICAgICAgICBpZiAoc2tpcENvdW50ZXIyKSB7XG5cbiAgICAgICAgICBza2lwQ291bnRlcjItLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWF5Mikge1xuXG4gICAgICAgICAgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouc3RvcCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1heTItLTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJyknICYmICF0bXApIHtcblxuICAgICAgICBza2lwQ291bnRlcisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnLCcgJiYgIXNraXBDb3VudGVyICYmICFza2lwQ291bnRlcjIgJiYgIW1heSAmJiAhbWF5Mikge1xuXG4gICAgICAgIHBhcmFtUG9zaXRpb24rKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJywnKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJygnICYmIHNraXBDb3VudGVyKSB7XG5cbiAgICAgICAgc2tpcENvdW50ZXItLTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2tpcENvdW50ZXIgfHwgc2tpcENvdW50ZXIyKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJygnICYmICF0bXApIHtcblxuICAgICAgICByYW5nZUJlZm9yZSA9IG9iai5yYW5nZTtcbiAgICAgICAgb2JqLnN0b3AoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRtcCA9IG9iai5tYXRjaFRleHQ7XG4gICAgfSk7XG5cbiAgICBpZiAoIXJhbmdlQmVmb3JlKSB7XG5cbiAgICAgIHRoaXMuY3VycmVudFZpZXdEYXRhID0gbnVsbDtcbiAgICAgIHRoaXMuY3VycmVudFJhbmdlID0gbnVsbDtcbiAgICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChyYW5nZUJlZm9yZS5pc0VxdWFsKHRoaXMuY3VycmVudFJhbmdlKSkge1xuXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSAmJiB0aGlzLnNldFZpZXdEYXRhKHRoaXMuY3VycmVudFZpZXdEYXRhLCBwYXJhbVBvc2l0aW9uKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFJhbmdlID0gcmFuZ2VCZWZvcmU7XG4gICAgdGhpcy5jdXJyZW50Vmlld0RhdGEgPSBudWxsO1xuICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKCkgPT4ge1xuXG4gICAgICBtYW5hZ2VyLmNsaWVudC50eXBlKGVkaXRvciwgcmFuZ2VCZWZvcmUuc3RhcnQpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgIWRhdGEgfHxcbiAgICAgICAgICAhZGF0YS50eXBlLnN0YXJ0c1dpdGgoJ2ZuJykgfHxcbiAgICAgICAgICAhZGF0YS5leHByTmFtZVxuICAgICAgICApIHtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFZpZXdEYXRhID0gZGF0YTtcblxuICAgICAgICB0aGlzLnNldFZpZXdEYXRhKGRhdGEsIHBhcmFtUG9zaXRpb24pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcblxuICAgICAgICAvLyBtb3N0IGxpa2VseSB0aGUgdHlwZSB3YXNuJ3QgZm91bmQuIGlnbm9yZSBpdC5cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0Vmlld0RhdGEoZGF0YSwgcGFyYW1Qb3NpdGlvbikge1xuXG4gICAgY29uc3Qgdmlld0RhdGEgPSBkZWVwQ2xvbmUoZGF0YSk7XG4gICAgY29uc3QgdHlwZSA9IHByZXBhcmVUeXBlKHZpZXdEYXRhKTtcbiAgICBjb25zdCBwYXJhbXMgPSBleHRyYWN0UGFyYW1zKHR5cGUpO1xuICAgIGZvcm1hdFR5cGUodmlld0RhdGEpO1xuXG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1Qb3NpdGlvbl0pIHtcblxuICAgICAgdmlld0RhdGEudHlwZSA9IHZpZXdEYXRhLnR5cGUucmVwbGFjZShwYXJhbXNbcGFyYW1Qb3NpdGlvbl0sIGA8c3BhbiBjbGFzcz1cInRleHQtaW5mb1wiPiR7cGFyYW1zW3BhcmFtUG9zaXRpb25dfTwvc3Bhbj5gKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB2aWV3RGF0YS5kb2MgJiZcbiAgICAgIHBhY2thZ2VDb25maWcub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb25Eb2N1bWVudGF0aW9uXG4gICAgKSB7XG5cbiAgICAgIHZpZXdEYXRhLmRvYyA9IHZpZXdEYXRhLmRvYyAmJiB2aWV3RGF0YS5kb2MucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICc8YnIgLz4nKTtcbiAgICAgIHZpZXdEYXRhLmRvYyA9IHByZXBhcmVJbmxpbmVEb2NzKHZpZXdEYXRhLmRvYyk7XG5cbiAgICAgIHRoaXMudmlldy5zZXREYXRhKHZpZXdEYXRhLnR5cGUsIHZpZXdEYXRhLmRvYyk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLnZpZXcuc2V0RGF0YSh2aWV3RGF0YS50eXBlKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBkZXN0cm95T3ZlcmxheSgpIHtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGVtaXR0ZXIub2ZmKCdkZXN0cm95LXR5cGUtb3ZlcmxheScsIHRoaXMuZGVzdHJveU92ZXJsYXlMaXN0ZW5lcik7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG5cbiAgICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgVHlwZSgpO1xuIl19