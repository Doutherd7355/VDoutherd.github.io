Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _atomSpacePenViews = require('atom-space-pen-views');

var _statusBarInner = require('./status-bar-inner');

var _statusBarInner2 = _interopRequireDefault(_statusBarInner);

'use babel';

var StatusBarView = (function (_View) {
  _inherits(StatusBarView, _View);

  function StatusBarView() {
    _classCallCheck(this, StatusBarView);

    _get(Object.getPrototypeOf(StatusBarView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(StatusBarView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
      this.innerBar = new _statusBarInner2['default']();

      this.opt = {
        iconList: {
          CONNECTED: 'icon-server',
          NOT_CONNECTED: 'icon-alignment-unalign'
        }
      };

      this.status = {
        name: null,
        isConnected: false
      };

      this.ftp = atom.project.remoteftpMain;
      this.ftp.client.onDidChangeStatus(function (status) {
        _this.changeStatus(status);
      });
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.setToolTip();
      this.setEvents();
    }
  }, {
    key: 'detached',
    value: function detached() {
      this.dispose();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.remove();
    }
  }, {
    key: 'setEvents',
    value: function setEvents() {
      var _this2 = this;

      this.on('click', function () {
        (0, _atomSpacePenViews.$)('.tooltip[role="tooltip"]').addClass('statusbar-view-tooltip remote-ftp');
      });

      this.onDidChangeStatus(function () {
        _this2.setIconHandler();
      });

      this.innerBar.onDidChangeAutoSave(function (newValue) {
        _this2.ftp.storage.data.options.autosave = newValue;
      });

      this.innerBar.onDidOpenSettings(function () {
        atom.workspace.open('atom://config/packages/remote-ftp');
      });
    }
  }, {
    key: 'setIconHandler',
    value: function setIconHandler() {
      if (this.status.isConnected) {
        this.ftpStatusBarView.removeClass(this.opt.iconList.NOT_CONNECTED).addClass(this.opt.iconList.CONNECTED);
      } else {
        this.ftpStatusBarView.removeClass(this.opt.iconList.CONNECTED).addClass(this.opt.iconList.NOT_CONNECTED);
      }
    }
  }, {
    key: 'changeStatus',
    value: function changeStatus(status) {
      if (status === 'CONNECTED') {
        this.status.isConnected = true;
      } else {
        this.status.isConnected = false;
      }

      this.status.name = status;
      this.emitter.emit('change-status');
    }
  }, {
    key: 'setToolTip',
    value: function setToolTip() {
      this.subscriptions.add(atom.tooltips.add(this, {
        item: this.innerBar.element,
        'class': 'RemoteFtpPopoverTooltip',
        trigger: 'click',
        placement: 'top'
      }));
    }

    /**
     * Events
     */
  }, {
    key: 'onDidClickIcon',
    value: function onDidClickIcon(callback) {
      this.subscriptions.add(this.emitter.on('click-icon', callback));
    }
  }, {
    key: 'onDidChangeStatus',
    value: function onDidChangeStatus(callback) {
      this.subscriptions.add(this.emitter.on('change-status', callback));
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      return this.div({
        'class': 'ftp-statusbar-view inline-block'
      }, function () {
        _this3.span({
          'class': 'icon icon-alignment-unalign',
          outlet: 'ftpStatusBarView'
        });
      });
    }
  }]);

  return StatusBarView;
})(_atomSpacePenViews.View);

exports['default'] = StatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9zdGF0dXMtYmFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUU2QyxNQUFNOztpQ0FDM0Isc0JBQXNCOzs4QkFDZixvQkFBb0I7Ozs7QUFKbkQsV0FBVyxDQUFDOztJQU1OLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FZUCxzQkFBRzs7O0FBQ1gsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsVUFBSSxDQUFDLFFBQVEsR0FBRyxpQ0FBd0IsQ0FBQzs7QUFFekMsVUFBSSxDQUFDLEdBQUcsR0FBRztBQUNULGdCQUFRLEVBQUU7QUFDUixtQkFBUyxFQUFFLGFBQWE7QUFDeEIsdUJBQWEsRUFBRSx3QkFBd0I7U0FDeEM7T0FDRixDQUFDOztBQUVGLFVBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixZQUFJLEVBQUUsSUFBSTtBQUNWLG1CQUFXLEVBQUUsS0FBSztPQUNuQixDQUFDOztBQUVGLFVBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDdEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDNUMsY0FBSyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDM0IsQ0FBQyxDQUFDO0tBQ0o7OztXQUVPLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNsQjs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFB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YTs7O3FCQXFISixhQUFhIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9zdGF0dXMtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJztcbmltcG9ydCB7ICQsIFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5pbXBvcnQgU3RhdHVzQmFyVmlld0lubmVyIGZyb20gJy4vc3RhdHVzLWJhci1pbm5lcic7XG5cbmNsYXNzIFN0YXR1c0JhclZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGl2KHtcbiAgICAgIGNsYXNzOiAnZnRwLXN0YXR1c2Jhci12aWV3IGlubGluZS1ibG9jaycsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5zcGFuKHtcbiAgICAgICAgY2xhc3M6ICdpY29uIGljb24tYWxpZ25tZW50LXVuYWxpZ24nLFxuICAgICAgICBvdXRsZXQ6ICdmdHBTdGF0dXNCYXJWaWV3JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5pbm5lckJhciA9IG5ldyBTdGF0dXNCYXJWaWV3SW5uZXIoKTtcblxuICAgIHRoaXMub3B0ID0ge1xuICAgICAgaWNvbkxpc3Q6IHtcbiAgICAgICAgQ09OTkVDVEVEOiAnaWNvbi1zZXJ2ZXInLFxuICAgICAgICBOT1RfQ09OTkVDVEVEOiAnaWNvbi1hbGlnbm1lbnQtdW5hbGlnbicsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICB0aGlzLnN0YXR1cyA9IHtcbiAgICAgIG5hbWU6IG51bGwsXG4gICAgICBpc0Nvbm5lY3RlZDogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuZnRwID0gYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cE1haW47XG4gICAgdGhpcy5mdHAuY2xpZW50Lm9uRGlkQ2hhbmdlU3RhdHVzKChzdGF0dXMpID0+IHtcbiAgICAgIHRoaXMuY2hhbmdlU3RhdHVzKHN0YXR1cyk7XG4gICAgfSk7XG4gIH1cblxuICBhdHRhY2hlZCgpIHtcbiAgICB0aGlzLnNldFRvb2xUaXAoKTtcbiAgICB0aGlzLnNldEV2ZW50cygpO1xuICB9XG5cbiAgZGV0YWNoZWQoKSB7XG4gICAgdGhpcy5kaXNwb3NlKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5yZW1vdmUoKTtcbiAgfVxuXG4gIHNldEV2ZW50cygpIHtcbiAgICB0aGlzLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICQoJy50b29sdGlwW3JvbGU9XCJ0b29sdGlwXCJdJykuYWRkQ2xhc3MoJ3N0YXR1c2Jhci12aWV3LXRvb2x0aXAgcmVtb3RlLWZ0cCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbkRpZENoYW5nZVN0YXR1cygoKSA9PiB7XG4gICAgICB0aGlzLnNldEljb25IYW5kbGVyKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlubmVyQmFyLm9uRGlkQ2hhbmdlQXV0b1NhdmUoKG5ld1ZhbHVlKSA9PiB7XG4gICAgICB0aGlzLmZ0cC5zdG9yYWdlLmRhdGEub3B0aW9ucy5hdXRvc2F2ZSA9IG5ld1ZhbHVlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckJhci5vbkRpZE9wZW5TZXR0aW5ncygoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL3JlbW90ZS1mdHAnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldEljb25IYW5kbGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXR1cy5pc0Nvbm5lY3RlZCkge1xuICAgICAgdGhpcy5mdHBTdGF0dXNCYXJWaWV3XG4gICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm9wdC5pY29uTGlzdC5OT1RfQ09OTkVDVEVEKVxuICAgICAgICAuYWRkQ2xhc3ModGhpcy5vcHQuaWNvbkxpc3QuQ09OTkVDVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mdHBTdGF0dXNCYXJWaWV3XG4gICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm9wdC5pY29uTGlzdC5DT05ORUNURUQpXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLm9wdC5pY29uTGlzdC5OT1RfQ09OTkVDVEVEKTtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKHN0YXR1cyA9PT0gJ0NPTk5FQ1RFRCcpIHtcbiAgICAgIHRoaXMuc3RhdHVzLmlzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0dXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1cy5uYW1lID0gc3RhdHVzO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdjaGFuZ2Utc3RhdHVzJyk7XG4gIH1cblxuICBzZXRUb29sVGlwKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLCB7XG4gICAgICAgIGl0ZW06IHRoaXMuaW5uZXJCYXIuZWxlbWVudCxcbiAgICAgICAgY2xhc3M6ICdSZW1vdGVGdHBQb3BvdmVyVG9vbHRpcCcsXG4gICAgICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50c1xuICAgKi9cbiAgb25EaWRDbGlja0ljb24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdjbGljay1pY29uJywgY2FsbGJhY2spLFxuICAgICk7XG4gIH1cblxuICBvbkRpZENoYW5nZVN0YXR1cyhjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2NoYW5nZS1zdGF0dXMnLCBjYWxsYmFjayksXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdGF0dXNCYXJWaWV3O1xuIl19