Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _helpers = require('../helpers');

'use babel';

var FileView = (function (_ScrollView) {
  _inherits(FileView, _ScrollView);

  function FileView() {
    _classCallCheck(this, FileView);

    _get(Object.getPrototypeOf(FileView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(FileView, [{
    key: 'initialize',
    value: function initialize(file) {
      _get(Object.getPrototypeOf(FileView.prototype), 'initialize', this).call(this, file);

      this.subscriptions = new _atom.CompositeDisposable();

      this.item = file;
      this.name.text(this.item.name);
      this.name.attr('data-name', this.item.name);
      this.name.attr('data-path', this.item.remote);

      if (atom.project.remoteftp.checkIgnore(this.item.remote)) {
        this.addClass('status-ignored');
      }

      var addIconToElement = (0, _helpers.getIconHandler)();

      if (addIconToElement) {
        var element = this.name[0] || this.name;
        var path = this.item && this.item.local;

        this.iconDisposable = addIconToElement(element, path);
      } else {
        switch (this.item.type) {
          case 'binary':
            this.name.addClass('icon-file-binary');
            break;
          case 'compressed':
            this.name.addClass('icon-file-zip');
            break;
          case 'image':
            this.name.addClass('icon-file-media');
            break;
          case 'pdf':
            this.name.addClass('icon-file-pdf');
            break;
          case 'readme':
            this.name.addClass('icon-book');
            break;
          case 'text':
            this.name.addClass('icon-file-text');
            break;
          default:
            break;
        }
      }

      this.triggers();
      this.events();
    }
  }, {
    key: 'triggers',
    value: function triggers() {
      var _this = this;

      this.item.onChangeSelect(function () {
        var lastSelected = atom.project.remoteftpMain.treeView.lastSelected;

        if (_this.item.isSelected) {
          lastSelected.push(_this);
          lastSelected = lastSelected.reverse().slice(0, 2).reverse();
        }
      });
    }
  }, {
    key: 'events',
    value: function events() {
      var _this2 = this;

      this.on('mousedown', function (e) {
        e.stopPropagation();

        var view = (0, _atomSpacePenViews.$)(_this2).view();
        var button = e.originalEvent ? e.originalEvent.button : 0;
        var selectKey = process.platform === 'darwin' ? 'metaKey' : 'ctrlKey'; // on mac the select key for multiple files is the meta key
        var $selected = (0, _atomSpacePenViews.$)('.remote-ftp-view .selected');

        if (!view) return;

        if ((button === 0 || button === 2) && !(button === 2 && $selected.length > 1)) {
          if (!e[selectKey]) {
            $selected.removeClass('selected');
            (0, _atomSpacePenViews.$)('.remote-ftp-view .entries.list-tree').removeClass('multi-select');
          } else {
            (0, _atomSpacePenViews.$)('.remote-ftp-view .entries.list-tree').addClass('multi-select');
          }
          view.toggleClass('selected');

          _this2.item.setIsSelected = view.hasClass('selected');
        }
      });

      this.on('dblclick', function (e) {
        e.stopPropagation();

        var view = (0, _atomSpacePenViews.$)(_this2).view();

        if (!view) {
          return;
        }

        view.open();
      });

      if (atom.config.get('remote-ftp.tree.enableDragAndDrop')) {
        this.setDraggable(true);
      }

      this.subscriptions.add(atom.config.onDidChange('remote-ftp.tree.enableDragAndDrop', function (values) {
        _this2.setDraggable(values.newValue);
      }));
    }
  }, {
    key: 'setDraggable',
    value: function setDraggable(bool) {
      this.attr('draggable', bool);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.item = null;

      if (this.iconDisposable) {
        this.iconDisposable.dispose();
        this.iconDisposable = null;
      }

      this.remove();
    }
  }, {
    key: 'open',
    value: function open() {
      this.item.open();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      return this.li({
        'class': 'file entry list-item',
        is: 'tree-view-file'
      }, function () {
        return _this3.span({
          'class': 'name icon',
          outlet: 'name'
        });
      });
    }
  }]);

  return FileView;
})(_atomSpacePenViews.ScrollView);

exports['default'] = FileView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9maWxlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUVvQyxNQUFNOztpQ0FDWixzQkFBc0I7O3VCQUNyQixZQUFZOztBQUozQyxXQUFXLENBQUM7O0lBTU4sUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQVdGLG9CQUFDLElBQUksRUFBRTtBQUNmLGlDQVpFLFFBQVEsNENBWU8sSUFBSSxFQUFFOztBQUV2QixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3hELFlBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxVQUFNLGdCQUFnQixHQUFHLDhCQUFnQixDQUFDOztBQUUxQyxVQUFJLGdCQUFnQixFQUFFO0FBQ3BCLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztBQUMxQyxZQUFNLElBQUks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QUFDO09BQzVCOztBQUVELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDbEI7OztXQXpJYSxtQkFBRzs7O0FBQ2YsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ2IsaUJBQU8sc0JBQXNCO0FBQzdCLFVBQUUsRUFBRSxnQkFBZ0I7T0FDckIsRUFBRTtlQUFNLE9BQUssSUFBSSxDQUFDO0FBQ2pCLG1CQUFPLFdBQVc7QUFDbEIsZ0JBQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUNMOzs7U0FURyxRQUFROzs7cUJBNklDLFFBQVEiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL3ZpZXdzL2ZpbGUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgeyAkLCBTY3JvbGxWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgZ2V0SWNvbkhhbmRsZXIgfSBmcm9tICcuLi9oZWxwZXJzJztcblxuY2xhc3MgRmlsZVZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMubGkoe1xuICAgICAgY2xhc3M6ICdmaWxlIGVudHJ5IGxpc3QtaXRlbScsXG4gICAgICBpczogJ3RyZWUtdmlldy1maWxlJyxcbiAgICB9LCAoKSA9PiB0aGlzLnNwYW4oe1xuICAgICAgY2xhc3M6ICduYW1lIGljb24nLFxuICAgICAgb3V0bGV0OiAnbmFtZScsXG4gICAgfSkpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShmaWxlKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShmaWxlKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLml0ZW0gPSBmaWxlO1xuICAgIHRoaXMubmFtZS50ZXh0KHRoaXMuaXRlbS5uYW1lKTtcbiAgICB0aGlzLm5hbWUuYXR0cignZGF0YS1uYW1lJywgdGhpcy5pdGVtLm5hbWUpO1xuICAgIHRoaXMubmFtZS5hdHRyKCdkYXRhLXBhdGgnLCB0aGlzLml0ZW0ucmVtb3RlKTtcblxuICAgIGlmIChhdG9tLnByb2plY3QucmVtb3RlZnRwLmNoZWNrSWdub3JlKHRoaXMuaXRlbS5yZW1vdGUpKSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdzdGF0dXMtaWdub3JlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZEljb25Ub0VsZW1lbnQgPSBnZXRJY29uSGFuZGxlcigpO1xuXG4gICAgaWYgKGFkZEljb25Ub0VsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLm5hbWVbMF0gfHwgdGhpcy5uYW1lO1xuICAgICAgY29uc3QgcGF0aCA9IHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0ubG9jYWw7XG5cbiAgICAgIHRoaXMuaWNvbkRpc3Bvc2FibGUgPSBhZGRJY29uVG9FbGVtZW50KGVsZW1lbnQsIHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuaXRlbS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgICAgdGhpcy5uYW1lLmFkZENsYXNzKCdpY29uLWZpbGUtYmluYXJ5Jyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvbXByZXNzZWQnOlxuICAgICAgICAgIHRoaXMubmFtZS5hZGRDbGFzcygnaWNvbi1maWxlLXppcCcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgdGhpcy5uYW1lLmFkZENsYXNzKCdpY29uLWZpbGUtbWVkaWEnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncGRmJzpcbiAgICAgICAgICB0aGlzLm5hbWUuYWRkQ2xhc3MoJ2ljb24tZmlsZS1wZGYnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVhZG1lJzpcbiAgICAgICAgICB0aGlzLm5hbWUuYWRkQ2xhc3MoJ2ljb24tYm9vaycpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICB0aGlzLm5hbWUuYWRkQ2xhc3MoJ2ljb24tZmlsZS10ZXh0Jyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VycygpO1xuICAgIHRoaXMuZXZlbnRzKCk7XG4gIH1cblxuICB0cmlnZ2VycygpIHtcbiAgICB0aGlzLml0ZW0ub25DaGFuZ2VTZWxlY3QoKCkgPT4ge1xuICAgICAgbGV0IGxhc3RTZWxlY3RlZCA9IGF0b20ucHJvamVjdC5yZW1vdGVmdHBNYWluLnRyZWVWaWV3Lmxhc3RTZWxlY3RlZDtcblxuICAgICAgaWYgKHRoaXMuaXRlbS5pc1NlbGVjdGVkKSB7XG4gICAgICAgIGxhc3RTZWxlY3RlZC5wdXNoKHRoaXMpO1xuICAgICAgICBsYXN0U2VsZWN0ZWQgPSBsYXN0U2VsZWN0ZWQucmV2ZXJzZSgpLnNsaWNlKDAsIDIpLnJldmVyc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV2ZW50cygpIHtcbiAgICB0aGlzLm9uKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY29uc3QgdmlldyA9ICQodGhpcykudmlldygpO1xuICAgICAgY29uc3QgYnV0dG9uID0gZS5vcmlnaW5hbEV2ZW50ID8gZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbiA6IDA7XG4gICAgICBjb25zdCBzZWxlY3RLZXkgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/ICdtZXRhS2V5JyA6ICdjdHJsS2V5JzsgLy8gb24gbWFjIHRoZSBzZWxlY3Qga2V5IGZvciBtdWx0aXBsZSBmaWxlcyBpcyB0aGUgbWV0YSBrZXlcbiAgICAgIGNvbnN0ICRzZWxlY3RlZCA9ICQoJy5yZW1vdGUtZnRwLXZpZXcgLnNlbGVjdGVkJyk7XG5cbiAgICAgIGlmICghdmlldykgcmV0dXJuO1xuXG4gICAgICBpZiAoKGJ1dHRvbiA9PT0gMCB8fCBidXR0b24gPT09IDIpICYmICEoYnV0dG9uID09PSAyICYmICRzZWxlY3RlZC5sZW5ndGggPiAxKSkge1xuICAgICAgICBpZiAoIWVbc2VsZWN0S2V5XSkge1xuICAgICAgICAgICRzZWxlY3RlZC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAkKCcucmVtb3RlLWZ0cC12aWV3IC5lbnRyaWVzLmxpc3QtdHJlZScpLnJlbW92ZUNsYXNzKCdtdWx0aS1zZWxlY3QnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCcucmVtb3RlLWZ0cC12aWV3IC5lbnRyaWVzLmxpc3QtdHJlZScpLmFkZENsYXNzKCdtdWx0aS1zZWxlY3QnKTtcbiAgICAgICAgfVxuICAgICAgICB2aWV3LnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXG4gICAgICAgIHRoaXMuaXRlbS5zZXRJc1NlbGVjdGVkID0gdmlldy5oYXNDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2RibGNsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IHZpZXcgPSAkKHRoaXMpLnZpZXcoKTtcblxuICAgICAgaWYgKCF2aWV3KSB7IHJldHVybjsgfVxuXG4gICAgICB2aWV3Lm9wZW4oKTtcbiAgICB9KTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3JlbW90ZS1mdHAudHJlZS5lbmFibGVEcmFnQW5kRHJvcCcpKSB7XG4gICAgICB0aGlzLnNldERyYWdnYWJsZSh0cnVlKTtcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3JlbW90ZS1mdHAudHJlZS5lbmFibGVEcmFnQW5kRHJvcCcsICh2YWx1ZXMpID0+IHtcbiAgICAgICAgdGhpcy5zZXREcmFnZ2FibGUodmFsdWVzLm5ld1ZhbHVlKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBzZXREcmFnZ2FibGUoYm9vbCkge1xuICAgIHRoaXMuYXR0cignZHJhZ2dhYmxlJywgYm9vbCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuaXRlbSA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5pY29uRGlzcG9zYWJsZSkge1xuICAgICAgdGhpcy5pY29uRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmljb25EaXNwb3NhYmxlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLml0ZW0ub3BlbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVWaWV3O1xuIl19