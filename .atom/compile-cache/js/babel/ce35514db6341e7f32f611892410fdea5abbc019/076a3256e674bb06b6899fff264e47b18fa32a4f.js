Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

var _atom = require('atom');

var _notifications = require('../notifications');

'use babel';

var PermissionView = (function (_View) {
  _inherits(PermissionView, _View);

  function PermissionView() {
    _classCallCheck(this, PermissionView);

    _get(Object.getPrototypeOf(PermissionView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PermissionView, [{
    key: 'initialize',
    value: function initialize(params, remotes) {
      var _this = this;

      this.ftp = atom.project.remoteftpMain;
      this.item = remotes.item;
      this.right = { r: 4, w: 2, x: 1 };

      this.disposables = new _atom.CompositeDisposable();
      this.disposables.add(atom.commands.add('atom-workspace', {
        'core:confirm': function coreConfirm() {
          _this.confirm();
        },
        'core:cancel': function coreCancel(event) {
          _this.cancel();
          event.stopPropagation();
        }
      }));

      Object.keys(params.rights).forEach(function (right) {
        var perms = params.rights[right].split('');
        var $perm = (0, _atomSpacePenViews.$)(_this).find('.permission-' + right);

        for (var i = 0; i < perms.length; i++) {
          $perm.find('input[data-perm="' + perms[i] + '"]').attr('checked', true);
        }
      });

      this.chownGroup.getModel().setPlaceholderText(params.group);
      this.chownOwner.getModel().setPlaceholderText(params.owner);

      this.disposables.add(atom.tooltips.add(this.chownGroup, {
        title: 'Only number can be entered. (Valid GID)',
        placement: 'bottom'
      }), atom.tooltips.add(this.chownOwner, {
        title: 'Only number can be entered. (Valid UID)',
        placement: 'bottom'
      }));

      this.checkPermissions();
      this.show();

      (0, _atomSpacePenViews.$)(this).find('.permissions-wrapper input').on('change', function () {
        _this.checkPermissions();
      });
    }
  }, {
    key: 'checkPermissions',
    value: function checkPermissions() {
      var _this2 = this;

      this.chmod = Object.defineProperties({
        user: 0,
        group: 0,
        other: 0
      }, {
        toString: {
          get: function get() {
            return '' + this.user + this.group + this.other;
          },
          configurable: true,
          enumerable: true
        }
      });

      var chmods = {
        user: this.permissionUser,
        group: this.permissionGroup,
        other: this.permissionOther
      };

      Object.keys(chmods).forEach(function (cKey) {
        var cItem = chmods[cKey];
        var $inputs = (0, _atomSpacePenViews.$)(cItem).find('input');
        var list = {};

        for (var x = 0; x < $inputs.length; x++) {
          var $this = (0, _atomSpacePenViews.$)($inputs[x]);

          list[$this.attr('data-perm')] = $this.prop('checked');
        }

        Object.keys(list).filter(function (key) {
          return list[key];
        }).forEach(function (key) {
          _this2.chmod[cKey] += _this2.right[key];
        });
      });

      this.chmodInput.setText(this.chmod.toString);
    }
  }, {
    key: 'checkOwners',
    value: function checkOwners() {
      var _this3 = this;

      var groupText = this.chownGroup.getText();
      var ownerText = this.chownOwner.getText();

      if (groupText === '' && ownerText === '') return;

      var group = groupText || this.chownGroup.getModel().getPlaceholderText();
      var owner = ownerText || this.chownOwner.getModel().getPlaceholderText();

      if (atom.project.remoteftp.info.protocol === 'sftp') {
        if (groupText !== '' || ownerText !== '') {
          this.ftp.client.chown(this.item.remote, owner - 0, group - 0, function (response) {
            if (response && /Permission denied/g) {
              (0, _notifications.isPermissionDenied)(_this3.item.remote);
            } else if (response) {
              (0, _notifications.isNoChangeOwnerAndGroup)(response);
            }
          });
        }
      } else {
        if (groupText !== '') {
          this.ftp.client.chgrp(this.item.remote, group, function (response) {
            if (response) {
              (0, _notifications.isNoChangeGroup)(response);
            }
          });
        }

        if (ownerText !== '') {
          this.ftp.client.chown(this.item.remote, owner, function (response) {
            if (response) {
              (0, _notifications.isNoChangeOwner)(response);
            }
          });
        }
      }
    }
  }, {
    key: 'confirm',
    value: function confirm() {
      var _this4 = this;

      this.hide();

      this.checkOwners();

      this.ftp.client.chmod(this.item.remote, this.chmodInput.getText(), function (response) {
        if (response && /Permission denied/g) {
          (0, _notifications.isPermissionDenied)(_this4.item.remote);
        } else if (response) {
          console.error(response);
        }
      });
      this.item.parent.open(); // Refresh

      this.checkPermissions();
      this.destroy();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.hide();
      this.destroy();
    }
  }, {
    key: 'show',
    value: function show() {
      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.show();
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel) {
        this.panel.hide();
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.disposables.dispose();
      this.remove();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this5 = this;

      return this.div({
        'class': 'permission-view remote-ftp'
      }, function () {
        _this5.div({
          'class': 'permissions-wrapper'
        }, function () {
          // Owner
          _this5.div({
            'class': 'permission-user block',
            outlet: 'permissionUser'
          }, function () {
            _this5.h5('Owner Permissions');

            // Read
            _this5.label('Read', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-user-read',
                'data-perm': 'r'
              });
            });

            // Write
            _this5.label('Write', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-user-write',
                'data-perm': 'w'
              });
            });

            // Execute
            _this5.label('Execute', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-user-execute',
                'data-perm': 'x'
              });
            });
          });

          // Group
          _this5.div({
            'class': 'permission-group block',
            outlet: 'permissionGroup'
          }, function () {
            _this5.h5('Group Permissions');

            // Read
            _this5.label('Read', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-group-read',
                'data-perm': 'r'
              });
            });

            // Write
            _this5.label('Write', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-group-write',
                'data-perm': 'w'
              });
            });

            // Execute
            _this5.label('Execute', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-group-execute',
                'data-perm': 'x'
              });
            });
          });

          // Public
          _this5.div({
            'class': 'permission-other block',
            outlet: 'permissionOther'
          }, function () {
            _this5.h5('Public (other) Permissions');

            // Read
            _this5.label('Read', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-other-read',
                'data-perm': 'r'
              });
            });

            // Write
            _this5.label('Write', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-other-write',
                'data-perm': 'w'
              });
            });

            // Execute
            _this5.label('Execute', {
              'class': 'input-label inline-block'
            }, function () {
              _this5.input({
                'class': 'input-checkbox',
                type: 'checkbox',
                id: 'permission-other-execute',
                'data-perm': 'x'
              });
            });
          });

          _this5.div({
            'class': 'permission-chown block'
          }, function () {
            _this5.label('Group: ', {
              'class': 'input-label inline-block'
            });

            _this5.subview('chownGroup', new _atomSpacePenViews.TextEditorView({
              mini: true,
              placeholderText: null
            }));

            _this5.label('Owner: ', {
              'class': 'input-label inline-block'
            });

            _this5.subview('chownOwner', new _atomSpacePenViews.TextEditorView({
              mini: true,
              placeholderText: null
            }));
          });
        });

        _this5.div({
          'class': 'permissions-wrapper-block'
        }, function () {
          _this5.div({
            'class': 'permissions-chmod block'
          }, function () {
            _this5.label('Chmod');
            _this5.subview('chmodInput', new _atomSpacePenViews.TextEditorView({
              mini: true,
              placeholderText: 600
            }));
          });
        });

        _this5.div({
          'class': 'block clearfix',
          outlet: 'buttonBlock'
        }, function () {
          _this5.button({
            'class': 'inline-block btn pull-right icon icon-x inline-block-tight',
            outlet: 'cancelButton',
            click: 'cancel'
          }, 'Cancel');
          _this5.button({
            'class': 'inline-block btn btn-primary pull-right icon icon-sync inline-block-tight',
            outlet: 'saveButton',
            click: 'confirm'
          }, 'Save');
        });
      });
    }
  }]);

  return PermissionView;
})(_atomSpacePenViews.View);

exports['default'] = PermissionView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9wZXJtaXNzaW9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2lDQUV3QyxzQkFBc0I7O29CQUMxQixNQUFNOzs2QkFDb0Qsa0JBQWtCOztBQUpoSCxXQUFXLENBQUM7O0lBTU4sY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOztXQW1NUixvQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7QUFDMUIsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUN0QyxVQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDekIsVUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7O0FBRWxDLFVBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsc0JBQWMsRUFBRSx1QkFBTTtBQUNwQixnQkFBSyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtBQUNELHFCQUFhLEVBQUUsb0JBQUMsS0FBSyxFQUFLO0FBQ3hCLGdCQUFLLE1BQU0sRUFBRSxDQUFDO0FBQ2QsZUFBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3pCO09BQ0YsQ0FBQyxDQUFDLENBQUM7O0FBRUosWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzVDLFlBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FB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QUcsQ0FBQztBQUNQLG1CQUFPLGdCQUFnQjtBQUN2QixnQkFBTSxFQUFFLGFBQWE7U0FDdEIsRUFBRSxZQUFNO0FBQ1AsaUJBQUssTUFBTSxDQUFDO0FBQ1YscUJBQU8sNERBQTREO0FBQ25FLGtCQUFNLEVBQUUsY0FBYztBQUN0QixpQkFBSyxFQUFFLFFBQVE7V0FDaEIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNiLGlCQUFLLE1BQU0sQ0FBQztBQUNWLHFCQUFPLDJFQUEyRTtBQUNsRixrQkFBTSxFQUFFLFlBQVk7QUFDcEIsaUJBQUssRUFBRSxTQUFTO1dBQ2pCLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDWixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBak1HLGNBQWM7OztxQkFvV0wsY0FBYyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvdmlld3MvcGVybWlzc2lvbi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7ICQsIFZpZXcsIFRleHRFZGl0b3JWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgaXNOb0NoYW5nZUdyb3VwLCBpc05vQ2hhbmdlT3duZXIsIGlzTm9DaGFuZ2VPd25lckFuZEdyb3VwLCBpc1Blcm1pc3Npb25EZW5pZWQgfSBmcm9tICcuLi9ub3RpZmljYXRpb25zJztcblxuY2xhc3MgUGVybWlzc2lvblZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHtcbiAgICAgIGNsYXNzOiAncGVybWlzc2lvbi12aWV3IHJlbW90ZS1mdHAnLFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdwZXJtaXNzaW9ucy13cmFwcGVyJyxcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgLy8gT3duZXJcbiAgICAgICAgdGhpcy5kaXYoe1xuICAgICAgICAgIGNsYXNzOiAncGVybWlzc2lvbi11c2VyIGJsb2NrJyxcbiAgICAgICAgICBvdXRsZXQ6ICdwZXJtaXNzaW9uVXNlcicsXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICB0aGlzLmg1KCdPd25lciBQZXJtaXNzaW9ucycpO1xuXG4gICAgICAgICAgLy8gUmVhZFxuICAgICAgICAgIHRoaXMubGFiZWwoJ1JlYWQnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnB1dCh7XG4gICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICBpZDogJ3Blcm1pc3Npb24tdXNlci1yZWFkJyxcbiAgICAgICAgICAgICAgJ2RhdGEtcGVybSc6ICdyJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gV3JpdGVcbiAgICAgICAgICB0aGlzLmxhYmVsKCdXcml0ZScsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtbGFiZWwgaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlucHV0KHtcbiAgICAgICAgICAgICAgY2xhc3M6ICdpbnB1dC1jaGVja2JveCcsXG4gICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICAgIGlkOiAncGVybWlzc2lvbi11c2VyLXdyaXRlJyxcbiAgICAgICAgICAgICAgJ2RhdGEtcGVybSc6ICd3JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gRXhlY3V0ZVxuICAgICAgICAgIHRoaXMubGFiZWwoJ0V4ZWN1dGUnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnB1dCh7XG4gICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICBpZDogJ3Blcm1pc3Npb24tdXNlci1leGVjdXRlJyxcbiAgICAgICAgICAgICAgJ2RhdGEtcGVybSc6ICd4JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBHcm91cFxuICAgICAgICB0aGlzLmRpdih7XG4gICAgICAgICAgY2xhc3M6ICdwZXJtaXNzaW9uLWdyb3VwIGJsb2NrJyxcbiAgICAgICAgICBvdXRsZXQ6ICdwZXJtaXNzaW9uR3JvdXAnLFxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5oNSgnR3JvdXAgUGVybWlzc2lvbnMnKTtcblxuICAgICAgICAgIC8vIFJlYWRcbiAgICAgICAgICB0aGlzLmxhYmVsKCdSZWFkJywge1xuICAgICAgICAgICAgY2xhc3M6ICdpbnB1dC1sYWJlbCBpbmxpbmUtYmxvY2snLFxuICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQoe1xuICAgICAgICAgICAgICBjbGFzczogJ2lucHV0LWNoZWNrYm94JyxcbiAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICAgICAgaWQ6ICdwZXJtaXNzaW9uLWdyb3VwLXJlYWQnLFxuICAgICAgICAgICAgICAnZGF0YS1wZXJtJzogJ3InLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBXcml0ZVxuICAgICAgICAgIHRoaXMubGFiZWwoJ1dyaXRlJywge1xuICAgICAgICAgICAgY2xhc3M6ICdpbnB1dC1sYWJlbCBpbmxpbmUtYmxvY2snLFxuICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQoe1xuICAgICAgICAgICAgICBjbGFzczogJ2lucHV0LWNoZWNrYm94JyxcbiAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcbiAgICAgICAgICAgICAgaWQ6ICdwZXJtaXNzaW9uLWdyb3VwLXdyaXRlJyxcbiAgICAgICAgICAgICAgJ2RhdGEtcGVybSc6ICd3JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gRXhlY3V0ZVxuICAgICAgICAgIHRoaXMubGFiZWwoJ0V4ZWN1dGUnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnB1dCh7XG4gICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICBpZDogJ3Blcm1pc3Npb24tZ3JvdXAtZXhlY3V0ZScsXG4gICAgICAgICAgICAgICdkYXRhLXBlcm0nOiAneCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUHVibGljXG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3Blcm1pc3Npb24tb3RoZXIgYmxvY2snLFxuICAgICAgICAgIG91dGxldDogJ3Blcm1pc3Npb25PdGhlcicsXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICB0aGlzLmg1KCdQdWJsaWMgKG90aGVyKSBQZXJtaXNzaW9ucycpO1xuXG4gICAgICAgICAgLy8gUmVhZFxuICAgICAgICAgIHRoaXMubGFiZWwoJ1JlYWQnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnB1dCh7XG4gICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICBpZDogJ3Blcm1pc3Npb24tb3RoZXItcmVhZCcsXG4gICAgICAgICAgICAgICdkYXRhLXBlcm0nOiAncicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIFdyaXRlXG4gICAgICAgICAgdGhpcy5sYWJlbCgnV3JpdGUnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnB1dCh7XG4gICAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLFxuICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICBpZDogJ3Blcm1pc3Npb24tb3RoZXItd3JpdGUnLFxuICAgICAgICAgICAgICAnZGF0YS1wZXJtJzogJ3cnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBFeGVjdXRlXG4gICAgICAgICAgdGhpcy5sYWJlbCgnRXhlY3V0ZScsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnaW5wdXQtbGFiZWwgaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlucHV0KHtcbiAgICAgICAgICAgICAgY2xhc3M6ICdpbnB1dC1jaGVja2JveCcsXG4gICAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgICAgICAgIGlkOiAncGVybWlzc2lvbi1vdGhlci1leGVjdXRlJyxcbiAgICAgICAgICAgICAgJ2RhdGEtcGVybSc6ICd4JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRpdih7XG4gICAgICAgICAgY2xhc3M6ICdwZXJtaXNzaW9uLWNob3duIGJsb2NrJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoJ0dyb3VwOiAnLCB7XG4gICAgICAgICAgICBjbGFzczogJ2lucHV0LWxhYmVsIGlubGluZS1ibG9jaycsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnN1YnZpZXcoJ2Nob3duR3JvdXAnLCBuZXcgVGV4dEVkaXRvclZpZXcoe1xuICAgICAgICAgICAgbWluaTogdHJ1ZSxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dDogbnVsbCxcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICB0aGlzLmxhYmVsKCdPd25lcjogJywge1xuICAgICAgICAgICAgY2xhc3M6ICdpbnB1dC1sYWJlbCBpbmxpbmUtYmxvY2snLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5zdWJ2aWV3KCdjaG93bk93bmVyJywgbmV3IFRleHRFZGl0b3JWaWV3KHtcbiAgICAgICAgICAgIG1pbmk6IHRydWUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6IG51bGwsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmRpdih7XG4gICAgICAgIGNsYXNzOiAncGVybWlzc2lvbnMtd3JhcHBlci1ibG9jaycsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgICBjbGFzczogJ3Blcm1pc3Npb25zLWNobW9kIGJsb2NrJyxcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGFiZWwoJ0NobW9kJyk7XG4gICAgICAgICAgdGhpcy5zdWJ2aWV3KCdjaG1vZElucHV0JywgbmV3IFRleHRFZGl0b3JWaWV3KHtcbiAgICAgICAgICAgIG1pbmk6IHRydWUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ6IDYwMCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdibG9jayBjbGVhcmZpeCcsXG4gICAgICAgIG91dGxldDogJ2J1dHRvbkJsb2NrJyxcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5idXR0b24oe1xuICAgICAgICAgIGNsYXNzOiAnaW5saW5lLWJsb2NrIGJ0biBwdWxsLXJpZ2h0IGljb24gaWNvbi14IGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgb3V0bGV0OiAnY2FuY2VsQnV0dG9uJyxcbiAgICAgICAgICBjbGljazogJ2NhbmNlbCcsXG4gICAgICAgIH0sICdDYW5jZWwnKTtcbiAgICAgICAgdGhpcy5idXR0b24oe1xuICAgICAgICAgIGNsYXNzOiAnaW5saW5lLWJsb2NrIGJ0biBidG4tcHJpbWFyeSBwdWxsLXJpZ2h0IGljb24gaWNvbi1zeW5jIGlubGluZS1ibG9jay10aWdodCcsXG4gICAgICAgICAgb3V0bGV0OiAnc2F2ZUJ1dHRvbicsXG4gICAgICAgICAgY2xpY2s6ICdjb25maXJtJyxcbiAgICAgICAgfSwgJ1NhdmUnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShwYXJhbXMsIHJlbW90ZXMpIHtcbiAgICB0aGlzLmZ0cCA9IGF0b20ucHJvamVjdC5yZW1vdGVmdHBNYWluO1xuICAgIHRoaXMuaXRlbSA9IHJlbW90ZXMuaXRlbTtcbiAgICB0aGlzLnJpZ2h0ID0geyByOiA0LCB3OiAyLCB4OiAxIH07XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnY29yZTpjb25maXJtJzogKCkgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpcm0oKTtcbiAgICAgIH0sXG4gICAgICAnY29yZTpjYW5jZWwnOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIE9iamVjdC5rZXlzKHBhcmFtcy5yaWdodHMpLmZvckVhY2goKHJpZ2h0KSA9PiB7XG4gICAgICBjb25zdCBwZXJtcyA9IHBhcmFtcy5yaWdodHNbcmlnaHRdLnNwbGl0KCcnKTtcbiAgICAgIGNvbnN0ICRwZXJtID0gJCh0aGlzKS5maW5kKGAucGVybWlzc2lvbi0ke3JpZ2h0fWApO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlcm1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICRwZXJtLmZpbmQoYGlucHV0W2RhdGEtcGVybT1cIiR7cGVybXNbaV19XCJdYCkuYXR0cignY2hlY2tlZCcsIHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jaG93bkdyb3VwLmdldE1vZGVsKCkuc2V0UGxhY2Vob2xkZXJUZXh0KHBhcmFtcy5ncm91cCk7XG4gICAgdGhpcy5jaG93bk93bmVyLmdldE1vZGVsKCkuc2V0UGxhY2Vob2xkZXJUZXh0KHBhcmFtcy5vd25lcik7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20udG9vbHRpcHMuYWRkKHRoaXMuY2hvd25Hcm91cCwge1xuICAgICAgICB0aXRsZTogJ09ubHkgbnVtYmVyIGNhbiBiZSBlbnRlcmVkLiAoVmFsaWQgR0lEKScsXG4gICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXG4gICAgICB9KSxcblxuICAgICAgYXRvbS50b29sdGlwcy5hZGQodGhpcy5jaG93bk93bmVyLCB7XG4gICAgICAgIHRpdGxlOiAnT25seSBudW1iZXIgY2FuIGJlIGVudGVyZWQuIChWYWxpZCBVSUQpJyxcbiAgICAgICAgcGxhY2VtZW50OiAnYm90dG9tJyxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLmNoZWNrUGVybWlzc2lvbnMoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgICQodGhpcykuZmluZCgnLnBlcm1pc3Npb25zLXdyYXBwZXIgaW5wdXQnKS5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdGhpcy5jaGVja1Blcm1pc3Npb25zKCk7XG4gICAgfSk7XG4gIH1cblxuICBjaGVja1Blcm1pc3Npb25zKCkge1xuICAgIHRoaXMuY2htb2QgPSB7XG4gICAgICB1c2VyOiAwLFxuICAgICAgZ3JvdXA6IDAsXG4gICAgICBvdGhlcjogMCxcbiAgICAgIGdldCB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMudXNlcn0ke3RoaXMuZ3JvdXB9JHt0aGlzLm90aGVyfWA7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBjaG1vZHMgPSB7XG4gICAgICB1c2VyOiB0aGlzLnBlcm1pc3Npb25Vc2VyLFxuICAgICAgZ3JvdXA6IHRoaXMucGVybWlzc2lvbkdyb3VwLFxuICAgICAgb3RoZXI6IHRoaXMucGVybWlzc2lvbk90aGVyLFxuICAgIH07XG5cbiAgICBPYmplY3Qua2V5cyhjaG1vZHMpLmZvckVhY2goKGNLZXkpID0+IHtcbiAgICAgIGNvbnN0IGNJdGVtID0gY2htb2RzW2NLZXldO1xuICAgICAgY29uc3QgJGlucHV0cyA9ICQoY0l0ZW0pLmZpbmQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBsaXN0ID0ge307XG5cbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgJGlucHV0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQoJGlucHV0c1t4XSk7XG5cbiAgICAgICAgbGlzdFskdGhpcy5hdHRyKCdkYXRhLXBlcm0nKV0gPSAkdGhpcy5wcm9wKCdjaGVja2VkJyk7XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5rZXlzKGxpc3QpLmZpbHRlcihrZXkgPT4gbGlzdFtrZXldKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy5jaG1vZFtjS2V5XSArPSB0aGlzLnJpZ2h0W2tleV07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2htb2RJbnB1dC5zZXRUZXh0KHRoaXMuY2htb2QudG9TdHJpbmcpO1xuICB9XG5cbiAgY2hlY2tPd25lcnMoKSB7XG4gICAgY29uc3QgZ3JvdXBUZXh0ID0gdGhpcy5jaG93bkdyb3VwLmdldFRleHQoKTtcbiAgICBjb25zdCBvd25lclRleHQgPSB0aGlzLmNob3duT3duZXIuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKGdyb3VwVGV4dCA9PT0gJycgJiYgb3duZXJUZXh0ID09PSAnJykgcmV0dXJuO1xuXG4gICAgY29uc3QgZ3JvdXAgPSBncm91cFRleHQgfHwgdGhpcy5jaG93bkdyb3VwLmdldE1vZGVsKCkuZ2V0UGxhY2Vob2xkZXJUZXh0KCk7XG4gICAgY29uc3Qgb3duZXIgPSBvd25lclRleHQgfHwgdGhpcy5jaG93bk93bmVyLmdldE1vZGVsKCkuZ2V0UGxhY2Vob2xkZXJUZXh0KCk7XG5cbiAgICBpZiAoYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5pbmZvLnByb3RvY29sID09PSAnc2Z0cCcpIHtcbiAgICAgIGlmIChncm91cFRleHQgIT09ICcnIHx8IG93bmVyVGV4dCAhPT0gJycpIHtcbiAgICAgICAgdGhpcy5mdHAuY2xpZW50LmNob3duKHRoaXMuaXRlbS5yZW1vdGUsIG93bmVyIC0gMCwgZ3JvdXAgLSAwLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UgJiYgL1Blcm1pc3Npb24gZGVuaWVkL2cpIHtcbiAgICAgICAgICAgIGlzUGVybWlzc2lvbkRlbmllZCh0aGlzLml0ZW0ucmVtb3RlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpc05vQ2hhbmdlT3duZXJBbmRHcm91cChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGdyb3VwVGV4dCAhPT0gJycpIHtcbiAgICAgICAgdGhpcy5mdHAuY2xpZW50LmNoZ3JwKHRoaXMuaXRlbS5yZW1vdGUsIGdyb3VwLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlzTm9DaGFuZ2VHcm91cChyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG93bmVyVGV4dCAhPT0gJycpIHtcbiAgICAgICAgdGhpcy5mdHAuY2xpZW50LmNob3duKHRoaXMuaXRlbS5yZW1vdGUsIG93bmVyLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlzTm9DaGFuZ2VPd25lcihyZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25maXJtKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuXG4gICAgdGhpcy5jaGVja093bmVycygpO1xuXG4gICAgdGhpcy5mdHAuY2xpZW50LmNobW9kKHRoaXMuaXRlbS5yZW1vdGUsIHRoaXMuY2htb2RJbnB1dC5nZXRUZXh0KCksIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlICYmIC9QZXJtaXNzaW9uIGRlbmllZC9nKSB7XG4gICAgICAgIGlzUGVybWlzc2lvbkRlbmllZCh0aGlzLml0ZW0ucmVtb3RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5pdGVtLnBhcmVudC5vcGVuKCk7IC8vIFJlZnJlc2hcblxuICAgIHRoaXMuY2hlY2tQZXJtaXNzaW9ucygpO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpO1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGVybWlzc2lvblZpZXc7XG4iXX0=