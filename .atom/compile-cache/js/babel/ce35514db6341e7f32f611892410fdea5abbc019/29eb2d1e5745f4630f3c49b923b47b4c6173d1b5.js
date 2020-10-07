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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _servicesDebug = require('./services/debug');

var _servicesDebug2 = _interopRequireDefault(_servicesDebug);

'use babel';

var ReferenceView = require('./atom-ternjs-reference-view');

var Reference = (function () {
  function Reference() {
    _classCallCheck(this, Reference);

    this.disposables = [];
    this.references = [];

    this.referenceView = null;
    this.referencePanel = null;

    this.hideHandler = this.hide.bind(this);
    this.findReferenceListener = this.findReference.bind(this);
  }

  _createClass(Reference, [{
    key: 'init',
    value: function init() {

      this.referenceView = new ReferenceView();
      this.referenceView.initialize(this);

      this.referencePanel = atom.workspace.addBottomPanel({

        item: this.referenceView,
        priority: 0,
        visible: false
      });

      atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');

      _atomTernjsEvents2['default'].on('reference-hide', this.hideHandler);

      this.registerCommands();
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', this.findReferenceListener));
    }
  }, {
    key: 'goToReference',
    value: function goToReference(idx) {

      var ref = this.references.refs[idx];

      if (_servicesNavigation2['default'].set(ref)) {

        (0, _atomTernjsHelper.openFileAndGoTo)(ref.start, ref.file);
      }
    }
  }, {
    key: 'findReference',
    value: function findReference() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();

      if (!_atomTernjsManager2['default'].client || !editor || !cursor) {

        return;
      }

      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {
        _atomTernjsManager2['default'].client.refs(atom.project.relativizePath(editor.getURI())[1], { line: position.row, ch: position.column }).then(function (data) {

          if (!data) {

            atom.notifications.addInfo('No references found.', { dismissable: false });

            return;
          }

          _this.references = data;

          for (var reference of data.refs) {

            reference.file = reference.file.replace(/^.\//, '');
            reference.file = _path2['default'].resolve(atom.project.relativizePath(_atomTernjsManager2['default'].server.projectDir)[0], reference.file);
          }

          data.refs = (0, _underscorePlus.uniq)(data.refs, function (item) {

            return JSON.stringify(item);
          });

          data = _this.gatherMeta(data);
          _this.referenceView.buildItems(data);
          _this.referencePanel.show();
        })['catch'](_servicesDebug2['default'].handleCatchWithNotification);
      })['catch'](_servicesDebug2['default'].handleCatch);
    }
  }, {
    key: 'gatherMeta',
    value: function gatherMeta(data) {

      for (var item of data.refs) {

        var content = _fs2['default'].readFileSync(item.file, 'utf8');
        var buffer = new _atom.TextBuffer({ text: content });

        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);

        buffer.destroy();
      }

      return data;
    }
  }, {
    key: 'hide',
    value: function hide() {

      this.referencePanel && this.referencePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      this.referencePanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('reference-hide', this.hideHandler);

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
      this.references = [];

      this.referenceView && this.referenceView.destroy();
      this.referenceView = null;

      this.referencePanel && this.referencePanel.destroy();
      this.referencePanel = null;
    }
  }]);

  return Reference;
})();

exports['default'] = new Reference();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBSW9CLHVCQUF1Qjs7OztnQ0FDdkIsc0JBQXNCOzs7O2tCQUMzQixJQUFJOzs7OzhCQUNBLGlCQUFpQjs7b0JBQ25CLE1BQU07Ozs7b0JBQ0UsTUFBTTs7Z0NBS3hCLHNCQUFzQjs7a0NBQ04sdUJBQXVCOzs7OzZCQUM1QixrQkFBa0I7Ozs7QUFoQnBDLFdBQVcsQ0FBQzs7QUFFWixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7SUFnQnhELFNBQVM7QUFFRixXQUZQLFNBQVMsR0FFQzswQkFGVixTQUFTOztBQUlYLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUQ7O2VBWkcsU0FBUzs7V0FjVCxnQkFBRzs7QUFFTCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFDekMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7O0FBRWxELFlBQUksRUFBRSxJQUFJLENBQUMsYUFBYTtBQUN4QixnQkFBUSxFQUFF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SSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25ELFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDOztBQUUxQixVQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckQsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7S0FDNUI7OztTQXpJRyxTQUFTOzs7cUJBNElBLElBQUksU0FBUyxFQUFFIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IFJlZmVyZW5jZVZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlZmVyZW5jZS12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHt1bmlxfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtcbiAgZGlzcG9zZUFsbCxcbiAgb3BlbkZpbGVBbmRHb1RvLFxuICBmb2N1c0VkaXRvclxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgbmF2aWdhdGlvbiBmcm9tICcuL3NlcnZpY2VzL25hdmlnYXRpb24nO1xuaW1wb3J0IGRlYnVnIGZyb20gJy4vc2VydmljZXMvZGVidWcnO1xuXG5jbGFzcyBSZWZlcmVuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMucmVmZXJlbmNlcyA9IFtdO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ID0gbnVsbDtcbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gbnVsbDtcblxuICAgIHRoaXMuaGlkZUhhbmRsZXIgPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmZpbmRSZWZlcmVuY2VMaXN0ZW5lciA9IHRoaXMuZmluZFJlZmVyZW5jZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIHRoaXMucmVmZXJlbmNlVmlldyA9IG5ldyBSZWZlcmVuY2VWaWV3KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuXG4gICAgICBpdGVtOiB0aGlzLnJlZmVyZW5jZVZpZXcsXG4gICAgICBwcmlvcml0eTogMCxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5yZWZlcmVuY2VQYW5lbCkuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlLXBhbmVsJywgJ3BhbmVsLWJvdHRvbScpO1xuXG4gICAgZW1pdHRlci5vbigncmVmZXJlbmNlLWhpZGUnLCB0aGlzLmhpZGVIYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpyZWZlcmVuY2VzJywgdGhpcy5maW5kUmVmZXJlbmNlTGlzdGVuZXIpKTtcbiAgfVxuXG4gIGdvVG9SZWZlcmVuY2UoaWR4KSB7XG5cbiAgICBjb25zdCByZWYgPSB0aGlzLnJlZmVyZW5jZXMucmVmc1tpZHhdO1xuXG4gICAgaWYgKG5hdmlnYXRpb24uc2V0KHJlZikpIHtcblxuICAgICAgb3BlbkZpbGVBbmRHb1RvKHJlZi5zdGFydCwgcmVmLmZpbGUpO1xuICAgIH1cbiAgfVxuXG4gIGZpbmRSZWZlcmVuY2UoKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgIGlmIChcbiAgICAgICFtYW5hZ2VyLmNsaWVudCB8fFxuICAgICAgIWVkaXRvciB8fFxuICAgICAgIWN1cnNvclxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgIG1hbmFnZXIuY2xpZW50LnJlZnMoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtsaW5lOiBwb3NpdGlvbi5yb3csIGNoOiBwb3NpdGlvbi5jb2x1bW59KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTm8gcmVmZXJlbmNlcyBmb3VuZC4nLCB7IGRpc21pc3NhYmxlOiBmYWxzZSB9KTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVmZXJlbmNlcyA9IGRhdGE7XG5cbiAgICAgICAgZm9yIChsZXQgcmVmZXJlbmNlIG9mIGRhdGEucmVmcykge1xuXG4gICAgICAgICAgcmVmZXJlbmNlLmZpbGUgPSByZWZlcmVuY2UuZmlsZS5yZXBsYWNlKC9eLlxcLy8sICcnKTtcbiAgICAgICAgICByZWZlcmVuY2UuZmlsZSA9IHBhdGgucmVzb2x2ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgobWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcilbMF0sIHJlZmVyZW5jZS5maWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEucmVmcyA9IHVuaXEoZGF0YS5yZWZzLCAoaXRlbSkgPT4ge1xuXG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkYXRhID0gdGhpcy5nYXRoZXJNZXRhKGRhdGEpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZVZpZXcuYnVpbGRJdGVtcyhkYXRhKTtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2VQYW5lbC5zaG93KCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGRlYnVnLmhhbmRsZUNhdGNoV2l0aE5vdGlmaWNhdGlvbik7XG4gICAgfSlcbiAgICAuY2F0Y2goZGVidWcuaGFuZGxlQ2F0Y2gpO1xuICB9XG5cbiAgZ2F0aGVyTWV0YShkYXRhKSB7XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGRhdGEucmVmcykge1xuXG4gICAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGl0ZW0uZmlsZSwgJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKHsgdGV4dDogY29udGVudCB9KTtcblxuICAgICAgaXRlbS5wb3NpdGlvbiA9IGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KGl0ZW0uc3RhcnQpO1xuICAgICAgaXRlbS5saW5lVGV4dCA9IGJ1ZmZlci5saW5lRm9yUm93KGl0ZW0ucG9zaXRpb24ucm93KTtcblxuICAgICAgYnVmZmVyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsICYmIHRoaXMucmVmZXJlbmNlUGFuZWwuaGlkZSgpO1xuXG4gICAgZm9jdXNFZGl0b3IoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLnNob3coKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBlbWl0dGVyLm9mZigncmVmZXJlbmNlLWhpZGUnLCB0aGlzLmhpZGVIYW5kbGVyKTtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMucmVmZXJlbmNlcyA9IFtdO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ICYmIHRoaXMucmVmZXJlbmNlVmlldy5kZXN0cm95KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ID0gbnVsbDtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgJiYgdGhpcy5yZWZlcmVuY2VQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlZmVyZW5jZSgpO1xuIl19