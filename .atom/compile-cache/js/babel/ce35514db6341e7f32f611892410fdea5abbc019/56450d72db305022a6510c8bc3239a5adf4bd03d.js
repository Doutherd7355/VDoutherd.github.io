Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var StatusBarViewInner = (function (_View) {
  _inherits(StatusBarViewInner, _View);

  function StatusBarViewInner() {
    _classCallCheck(this, StatusBarViewInner);

    _get(Object.getPrototypeOf(StatusBarViewInner.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(StatusBarViewInner, [{
    key: 'initialize',
    value: function initialize() {
      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
    }
  }, {
    key: 'attached',
    value: function attached() {
      var autosave = atom.project.remoteftpMain.storage.data.options.autosave;

      this.autoSave.prop('checked', autosave);
      this.events();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.remove();
    }

    /**
     * Events
     */
  }, {
    key: 'events',
    value: function events() {
      var _this = this;

      this.autoSave.on('click', function (e) {
        _this.emitter.emit('change-auto-save', _this.autoSave.prop('checked'), e);
      });

      this.settings.on('click', function () {
        _this.emitter.emit('open-settings');
      });
    }
  }, {
    key: 'onDidChangeAutoSave',
    value: function onDidChangeAutoSave(callback) {
      this.subscriptions.add(this.emitter.on('change-auto-save', callback));
    }
  }, {
    key: 'onDidOpenSettings',
    value: function onDidOpenSettings(callback) {
      this.subscriptions.add(this.emitter.on('open-settings', callback));
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this2 = this;

      return this.div({
        'class': 'ftp-statusbar-view-inner'
      }, function () {
        _this2.div({
          'class': 'StatusBarHeader'
        }, function () {
          _this2.div({}, function () {
            _this2.span({}, function () {
              _this2.text('Remote');
            });
          });

          _this2.span({
            'class': 'icon-gear',
            outlet: 'settings'
          });
        });

        _this2.div({
          'class': 'StatusBarInner'
        }, function () {
          _this2.div({
            'class': 'inline-block-tight'
          }, function () {
            _this2.label({
              'class': 'input-label'
            }, function () {
              _this2.input({
                'class': 'input-toggle',
                type: 'checkbox',
                outlet: 'autoSave'
              });

              _this2.text(' Auto-save');
            });
          });
        });
      });
    }
  }]);

  return StatusBarViewInner;
})(_atomSpacePenViews.View);

exports['default'] = StatusBarViewInner;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9zdGF0dXMtYmFyLWlubmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7aUNBQzlCLHNCQUFzQjs7QUFIM0MsV0FBVyxDQUFDOztJQUtTLGtCQUFrQjtZQUFsQixrQkFBa0I7O1dBQWxCLGtCQUFrQjswQkFBbEIsa0JBQWtCOzsrQkFBbEIsa0JBQWtCOzs7ZUFBbEIsa0JBQWtCOztXQTBDM0Isc0JBQUc7QUFDWCxVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztLQUM5Qjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0FBRTFFLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7Ozs7O1dBS0ssa0JBQUc7OztBQUNQLFVBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBSztBQUMvQixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsTUFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3pFLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBTTtBQUM5QixjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDcEMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVrQiw2QkFBQyxRQUFRLEVBQUU7QUFDNUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxDQUM5QyxDQUFDO0tBQ0g7OztXQUVnQiwyQkFBQyxRQUFRLEVBQUU7QUFDMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FDM0MsQ0FBQztLQUNIOzs7V0FqRmEsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNkLGlCQUFPLDBCQUEwQjtPQUNsQyxFQUFFLFlBQU07QUFDUCxlQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLGlCQUFpQjtTQUN6QixFQUFFLFlBQU07QUFDUCxpQkFBSyxHQUFHLENBQUMsRUFBRSxFQUFFLFlBQU07QUFDakIsbUJBQUssSUFBSSxDQUFDLEVBQUUsRUFBRSxZQUFNO0FBQ2xCLHFCQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNyQixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7O0FBRUgsaUJBQUssSUFBSSxDQUFDO0FBQ1IscUJBQU8sV0FBVztBQUNsQixrQkFBTSxFQUFFLFVBQVU7V0FDbkIsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDOztBQUVILGVBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sZ0JBQWdCO1NBQ3hCLEVBQUUsWUFBTTtBQUNQLGlCQUFLLEdBQUcsQ0FBQztBQUNQLHFCQUFPLG9CQUFvQjtXQUM1QixFQUFFLFlBQU07QUFDUCxtQkFBSyxLQUFLLENBQUM7QUFDVCx1QkFBTyxhQUFhO2FBQ3JCLEVBQUUsWUFBTTtBQUNQLHFCQUFLLEtBQUssQ0FBQztBQUNULHlCQUFPLGNBQWM7QUFDckIsb0JBQUksRUFBRSxVQUFVO0FBQ2hCLHNCQUFNLEVBQUUsVUFBVTtlQUNuQixDQUFDLENBQUM7O0FBRUgscUJBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3pCLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0F4Q2tCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL3ZpZXdzL3N0YXR1cy1iYXItaW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzQmFyVmlld0lubmVyIGV4dGVuZHMgVmlldyB7XG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRpdih7XG4gICAgICBjbGFzczogJ2Z0cC1zdGF0dXNiYXItdmlldy1pbm5lcicsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ1N0YXR1c0JhckhlYWRlcicsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHt9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zcGFuKHt9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRleHQoJ1JlbW90ZScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNwYW4oe1xuICAgICAgICAgIGNsYXNzOiAnaWNvbi1nZWFyJyxcbiAgICAgICAgICBvdXRsZXQ6ICdzZXR0aW5ncycsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdTdGF0dXNCYXJJbm5lcicsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ2lubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxhYmVsKHtcbiAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtbGFiZWwnLFxuICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQoe1xuICAgICAgICAgICAgICBjbGFzczogJ2lucHV0LXRvZ2dsZScsXG4gICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICAgIG91dGxldDogJ2F1dG9TYXZlJyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLnRleHQoJyBBdXRvLXNhdmUnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICB9XG5cbiAgYXR0YWNoZWQoKSB7XG4gICAgY29uc3QgYXV0b3NhdmUgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwTWFpbi5zdG9yYWdlLmRhdGEub3B0aW9ucy5hdXRvc2F2ZTtcblxuICAgIHRoaXMuYXV0b1NhdmUucHJvcCgnY2hlY2tlZCcsIGF1dG9zYXZlKTtcbiAgICB0aGlzLmV2ZW50cygpO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnRzXG4gICAqL1xuICBldmVudHMoKSB7XG4gICAgdGhpcy5hdXRvU2F2ZS5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2NoYW5nZS1hdXRvLXNhdmUnLCB0aGlzLmF1dG9TYXZlLnByb3AoJ2NoZWNrZWQnKSwgZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldHRpbmdzLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdvcGVuLXNldHRpbmdzJyk7XG4gICAgfSk7XG4gIH1cblxuICBvbkRpZENoYW5nZUF1dG9TYXZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignY2hhbmdlLWF1dG8tc2F2ZScsIGNhbGxiYWNrKSxcbiAgICApO1xuICB9XG5cbiAgb25EaWRPcGVuU2V0dGluZ3MoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdvcGVuLXNldHRpbmdzJywgY2FsbGJhY2spLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==