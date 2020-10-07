Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _eventKit = require('event-kit');

var _atomSpacePenViews = require('atom-space-pen-views');

var _helpers = require('../helpers');

var _directoryView = require('./directory-view');

var _directoryView2 = _interopRequireDefault(_directoryView);

'use babel';

var TreeView = (function (_ScrollView) {
  _inherits(TreeView, _ScrollView);

  function TreeView() {
    _classCallCheck(this, TreeView);

    _get(Object.getPrototypeOf(TreeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TreeView, [{
    key: 'initialize',
    value: function initialize(storage) {
      var _this = this;

      _get(Object.getPrototypeOf(TreeView.prototype), 'initialize', this).call(this, storage);

      this.subscriptions = new _eventKit.CompositeDisposable();
      this.storage = storage;

      // Supported for old API
      this.getSelected = _helpers.getSelectedTree;
      this.resolve = _helpers.resolveTree;

      var html = '\n    <div class="remote-ftp-offline-inner">\n    <div class="remote-ftp-picto"><span class="icon icon-shield"></span></div>\n    <ul>\n      <li><a role="connect" class="btn btn-default icon">Connect</a><br /></li>\n      <li><a role="configure" class="btn btn-default icon">Edit Configuration</a><br /></li>\n      <li><a role="configure_ignored" class="btn btn-default icon">Edit Ignore Configuration</a><br /></li>\n      <li><a role="toggle" class="btn btn-default icon">Close Panel</a></li>\n    </ul>\n    </div>';

      this.offline.html(html);

      if (atom.project.remoteftp.isConnected()) {
        this.showOnline();
      } else {
        this.showOffline();
      }

      this.root = new _directoryView2['default'](atom.project.remoteftp.root);
      this.root.expand();
      this.list.append(this.root);
      this.lastSelected = [];

      // Events
      this.subscriptions.add(atom.config.onDidChange('remote-ftp.tree.enableDragAndDrop', function (value) {
        if (value.newValue) {
          _this.createDragAndDrops();
        } else {
          _this.disposeDragAndDrops();
        }
      }));

      atom.project.remoteftp.onDidDebug(function (msg) {
        _this.debug.prepend('<li>' + msg + '</li>');
        var children = _this.debug.children();

        if (children.length > 20) {
          children.last().remove();
        }
      });

      atom.project.remoteftp.onDidQueueChanged(function () {
        _this.progress.empty();

        var queues = [];
        if (atom.project.remoteftp.current) {
          queues.push(atom.project.remoteftp.current);
        }

        atom.project.remoteftp.queue.forEach(function (queueElem) {
          queues.push(queueElem);
        });

        if (queues.length === 0) {
          _this.progress.hide();
        } else {
          _this.progress.show();

          queues.forEach(function (queue) {
            var $li = (0, _atomSpacePenViews.$)('<li><progress class="inline-block" /><div class="name">' + queue[0] + '</div><div class="eta">-</div></li>');
            var $progress = $li.children('progress');
            var $eta = $li.children('.eta');
            var progress = queue[2];

            _this.progress.append($li);

            progress.on('progress', function (percent) {
              if (percent === -1) {
                $progress.removeAttr('max').removeAttr('value');
                $eta.text('-');
              } else {
                $progress.attr('max', 100).attr('value', parseInt(percent * 100, 10));
                var eta = progress.getEta();

                $eta.text((0, _helpers.elapsedTime)(eta));
              }
            });

            progress.once('done', function () {
              progress.removeAllListeners('progress');
            });
          });
        }
      });

      this.offline.on('click', '[role="connect"]', function () {
        atom.project.remoteftp.readConfig(function () {
          atom.project.remoteftp.connect();
        });
      });

      this.offline.on('click', '[role="configure"]', function () {
        atom.workspace.open(atom.project.remoteftp.getConfigPath());
      });

      this.offline.on('click', '[role="configure_ignored"]', function () {
        atom.workspace.open(atom.project.getDirectories()[0].resolve('.ftpignore'));
      });

      this.offline.on('click', '[role="toggle"]', function () {
        _this.toggle();
      });

      this.info.on('click', function (e) {
        _this.toggleInfo(e);
      });

      this.list.on('keydown', function (e) {
        _this.remoteKeyboardNavigation(e);
      });

      this.root.entries.on('click', 'li.entry', function (e) {
        e.stopPropagation();
        e.preventDefault();

        var elem = e.target;
        var $this = (0, _atomSpacePenViews.$)(elem);

        if (!$this.hasClass('entry list-item')) {
          if (!$this.hasClass('name') && !$this.hasClass('header')) {
            return true;
          }
          elem = $this.parent()[0];
        }

        _this.remoteMultiSelect(e, elem);
        return true;
      });

      atom.project.remoteftp.onDidConnected(function () {
        _this.showOnline();
      });

      atom.project.remoteftp.onDidDisconnected(function () {
        _this.showOffline();
      });

      this.getTitle = function () {
        return 'Remote';
      };

      if (this.storage.data.options.treeViewShow) {
        this.attach();
      }
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return this.storage.data;
    }
  }, {
    key: 'toggleInfo',
    value: function toggleInfo() {
      this.queue.toggleClass('active');

      if (this.queue.hasClass('active')) {
        this.info.removeClass('icon-unfold').addClass('icon-fold');
      } else {
        this.info.removeClass('icon-fold').addClass('icon-unfold');
      }
    }
  }, {
    key: 'getDockElems',
    value: function getDockElems() {
      var currentSide = this.storage.data.options.treeViewSide.toLowerCase();
      var currentDock = atom.workspace.paneContainers[currentSide];

      if (typeof currentDock !== 'object') return false;

      var activePane = currentDock.getPanes()[0];

      return {
        currentSide: currentSide,
        currentDock: currentDock,
        activePane: activePane
      };
    }
  }, {
    key: 'onDidCloseItem',
    value: function onDidCloseItem() {
      this.detach();
    }
  }, {
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      var dockElems = this.getDockElems();

      if (!dockElems.activePane) return;

      this.panel = dockElems.activePane.addItem(this);

      if (!dockElems.currentDock.isVisible() && this.storage.data.options.treeViewShow) {
        dockElems.currentDock.toggle();
      }

      atom.workspace.onDidDestroyPaneItem(function (_ref) {
        var item = _ref.item;

        if (item === _this2.panel) {
          _this2.onDidCloseItem(_this2.panel);
        }
      });
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.storage.data.options.treeViewShow = true;
    }
  }, {
    key: 'detach',
    value: function detach() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _get(Object.getPrototypeOf(TreeView.prototype), 'detach', this).apply(this, args);

      if (this.panel) {
        if (typeof this.panel.destroy === 'function') {
          this.panel.destroy();
        } else if (typeof atom.workspace.paneForItem === 'function') {
          if (typeof atom.workspace.paneForItem(this.panel) !== 'undefined') {
            atom.workspace.paneForItem(this.panel).destroyItem(this.panel, true);
          }
        }

        this.panel = null;
      }

      this.storage.data.options.treeViewShow = false;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'createDragAndDrops',
    value: function createDragAndDrops() {
      this.root.getViews().forEach(function (view) {
        if (typeof view.dragEventsDestroy === 'function') {
          view.dragEventsActivate();
        }
      });
    }
  }, {
    key: 'disposeDragAndDrops',
    value: function disposeDragAndDrops() {
      this.root.getViews().forEach(function (view) {
        if (typeof view.dragEventsDestroy === 'function') {
          view.dragEventsDestroy();
        }
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (typeof this.panel !== 'undefined' && this.panel !== null) {
        this.detach();
      } else {
        this.attach();
      }
    }
  }, {
    key: 'showOffline',
    value: function showOffline() {
      this.list.hide();
      this.queue.hide();
      this.offline.css('display', 'flex');
    }
  }, {
    key: 'showOnline',
    value: function showOnline() {
      this.list.show();
      this.queue.show();
      this.offline.hide();

      if (!atom.project.remoteftp.connector.ftp) {
        this.info.hide();
      }
    }
  }, {
    key: 'remoteMultiSelect',
    value: function remoteMultiSelect(e, current) {
      var treeView = atom.project.remoteftpMain.treeView;
      var lastSelected = treeView.lastSelected[treeView.lastSelected.length - 1][0];

      var keyCode = e.keyCode || e.which;
      if (keyCode !== 1 || !e.shiftKey) {
        this.list.removeClass('multi-select');
        return true;
      }

      if (lastSelected === current) return true;

      var entries = this.list.find('li.entry:not(.project-root)');

      this.list.addClass('multi-select');

      var lastIndex = entries.index(lastSelected);
      var currIndex = entries.index(current);

      if (lastIndex === -1 || currIndex === -1) return true;

      var entryMin = Math.min(lastIndex, currIndex);
      var entryMax = Math.max(lastIndex, currIndex);

      for (var i = entryMin; i <= entryMax; i++) {
        (0, _atomSpacePenViews.$)(entries[i]).addClass('selected');
      }

      return true;
    }
  }, {
    key: 'remoteKeyboardNavigation',
    value: function remoteKeyboardNavigation(e) {
      var arrows = { left: 37, up: 38, right: 39, down: 40 };
      var keyCode = e.keyCode || e.which;

      if (Object.values(arrows).indexOf(keyCode) > -1 && e.shiftKey) {
        this.list.addClass('multi-select');
      } else {
        this.list.removeClass('multi-select');
      }

      switch (keyCode) {
        case arrows.up:
          this.remoteKeyboardNavigationUp();
          break;
        case arrows.down:
          this.remoteKeyboardNavigationDown();
          break;
        case arrows.left:
          this.remoteKeyboardNavigationLeft();
          break;
        case arrows.right:
          this.remoteKeyboardNavigationRight();
          break;
        default:
          return;
      }

      e.preventDefault();
      e.stopPropagation();

      this.remoteKeyboardNavigationMovePage();
    }
  }, {
    key: 'remoteKeyboardNavigationUp',
    value: function remoteKeyboardNavigationUp() {
      var current = this.list.find('.selected');
      var isMulti = this.list.hasClass('multi-select');

      var next = current.prev('.entry:visible');

      if (next.length >= 1) {
        while (next.is('.expanded') && next.find('.entries .entry:visible').length) {
          next = next.find('.entries .entry:visible');
        }
      } else {
        next = current.closest('.entries').closest('.entry:visible');
      }

      if (next.length >= 1) {
        if (!isMulti) current.removeClass('selected');

        next.last().addClass('selected');
      }
    }
  }, {
    key: 'remoteKeyboardNavigationDown',
    value: function remoteKeyboardNavigationDown() {
      var current = this.list.find('.selected');
      var isMulti = this.list.hasClass('multi-select');

      var next = current.find('.entries .entry:visible');
      var tmp = null;

      if (!next.length) {
        tmp = current;

        do {
          next = tmp.next('.entry:visible');

          if (!next.length) {
            tmp = tmp.closest('.entries').closest('.entry:visible');
          }
        } while (!next.length && !tmp.is('.project-root'));
      }

      if (next.length >= 1) {
        if (!isMulti) current.removeClass('selected');

        next.first().addClass('selected');
      }
    }
  }, {
    key: 'remoteKeyboardNavigationLeft',
    value: function remoteKeyboardNavigationLeft() {
      var current = this.list.find('.selected');

      var next = null;

      if (!current.is('.directory')) {
        next = current.closest('.directory');
        next.view().collapse();

        current.removeClass('selected');
        next.first().addClass('selected');
      } else {
        current.view().collapse();
      }
    }
  }, {
    key: 'remoteKeyboardNavigationRight',
    value: function remoteKeyboardNavigationRight() {
      var current = this.list.find('.selected');

      if (current.is('.directory')) {
        var view = current.view();

        view.open();
        view.expand();
      }
    }
  }, {
    key: 'remoteKeyboardNavigationMovePage',
    value: function remoteKeyboardNavigationMovePage() {
      var current = this.list.find('.selected');

      if (current.length) {
        var scrollerTop = this.scrollTop();
        var selectedTop = current.position().top;

        if (selectedTop < scrollerTop - 10) {
          this.pageUp();
        } else if (selectedTop > scrollerTop + (this.height() - 10)) {
          this.pageDown();
        }
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      return this.div({
        'class': 'remote-ftp-view tool-panel'
      }, function () {
        _this3.ol({
          'class': 'ftptree-view full-menu list-tree has-collapsable-children focusable-panel',
          tabindex: -1,
          outlet: 'list'
        });

        _this3.div({
          'class': 'queue tool-panel panel-bottom',
          tabindex: -1,
          outlet: 'queue'
        }, function () {
          _this3.ul({
            'class': 'progress tool-panel panel-top',
            tabindex: -1,
            outlet: 'progress'
          });

          _this3.ul({
            'class': 'list',
            tabindex: -1,
            outlet: 'debug'
          });

          _this3.span({
            'class': 'remote-ftp-info icon icon-unfold',
            tabindex: -1,
            outlet: 'info'
          });
        });

        _this3.div({
          'class': 'offline',
          tabindex: -1,
          outlet: 'offline'
        });
      });
    }
  }]);

  return TreeView;
})(_atomSpacePenViews.ScrollView);

exports['default'] = TreeView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy90cmVlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7d0JBRW9DLFdBQVc7O2lDQUNqQixzQkFBc0I7O3VCQUs3QyxZQUFZOzs2QkFDTyxrQkFBa0I7Ozs7QUFUNUMsV0FBVyxDQUFDOztJQVdOLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0EyQ0Ysb0JBQUMsT0FBTyxFQUFFOzs7QUFDbEIsaUNBNUNFLFFBQVEsNENBNENPLE9BQU8sRUFBRTs7QUFFMUIsVUFBSSxDQUFDLGFBQWEsR0FBRyxtQ0FBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7O0FBR3ZCLFVBQUksQ0FBQyxXQUFXLDJCQUFrQixDQUFDO0FBQ25DLFVBQUksQ0FBQyxPQUFPLHVCQUFjLENBQUM7O0FBRTNCLFVBQU0sSUFBSSw0Z0JBU0gsQ0FBQzs7QUFFUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEIsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDbkIsTUFBTTtBQUNMLFlBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztPQUNwQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxHQUFHLCtCQUFrQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQzs7O0FBR3ZCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxtQ0FBbUMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUN0RSxZQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDbEIsZ0JBQUssa0JBQWtCLEVBQUUsQ0FBQztTQUMzQixNQUFNO0FBQ0wsZ0JBQUssbUJBQW1CLEVBQUUsQ0FBQztTQUM1QjtPQUNGLENBQUMsQ0FDSCxDQUFDOztBQUVGLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN6QyxjQUFLLEtBQUssQ0FBQyxPQUFPLFVBQVEsR0FBRyxXQUFRLENBQUM7QUFDdEMsWUFBTSxRQUFRLEdBQUcsTUFBSyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXZDLFlBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7QUFDeEIsa0JBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUMxQjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFNO0FBQzdDLGNBQUssUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUV0QixZQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsWUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7QUFDbEMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDN0M7O0FBRUQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVMsRUFBSztBQUNsRCxnQkFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4QixDQUFDLENBQUM7O0FBRUgsWUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN2QixnQkFBSyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdEIsTUFBTTtBQUNMLGdCQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFckIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsZ0JBQU0sR0FBRyxHQUFHLHNGQUE0RCxLQUFLLENBQUMsQ0FBQyxDQUFDLHlDQUFzQyxDQUFDO0FBQ3ZILGdCQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLGdCQUFNLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLGdCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFCLGtCQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFCLG9CQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFDLE9BQU8sRUFBSztBQUNuQyxrQkFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDbEIseUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELG9CQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQ2hCLE1BQU07QUFDTCx5QkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLG9CQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRTlCLG9CQUFJLENBQUMsSUFBSSxDQUFDLDBCQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7ZUFDN0I7YUFDRixDQUFDLENBQUM7O0FBRUgsb0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQU07QUFDMUIsc0JBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN6QyxDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSjtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsWUFBTTtBQUNqRCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUN0QyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFlBQU07QUFDbkQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztPQUM3RCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLFlBQU07QUFDM0QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztPQUM3RSxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFlBQU07QUFDaEQsY0FBSyxNQUFNLEVBQUUsQ0FBQztPQUNmLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFBRSxjQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUFFLENBQUMsQ0FBQzs7QUFFdEQsVUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQUUsY0FBSyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUFFLENBQUMsQ0FBQzs7QUFFdEUsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDL0MsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQ3BCLFNBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFbkIsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNwQixZQUFNLEtBQUssR0FBRywwQkFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFdEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtBQUN0QyxjQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDeEQsbUJBQU8sSUFBSSxDQUFDO1dBQ2I7QUFDRCxjQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCOztBQUVELGNBQUssaUJBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2hDLGVBQU8sSUFBSSxDQUFDO09BQ2IsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQzFDLGNBQUssVUFBVSxFQUFFLENBQUM7T0FDbkIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFlBQU07QUFDN0MsY0FBSyxXQUFXLEVBQUUsQ0FBQztPQUNwQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFFBQVEsR0FBRztlQUFNLFFBQVE7T0FBQSxDQUFDOztBQUUvQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7QUFDMUMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRjs7O1dBRVEscUJBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0tBQzFCOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVqQyxVQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLFlBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUM1RCxNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO09BQzVEO0tBQ0Y7OztXQUVXLHdCQUFHO0FBQ2IsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN6RSxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUUsT0FBTyxLQUFLLENBQUM7O0FBRWxELFVBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFN0MsYUFBTztBQUNMLG1CQUFXLEVBQVgsV0FBVztBQUNYLG1CQUFXLEVBQVgsV0FBVztBQUNYLGtCQUFVLEVBQVYsVUFBVTtPQUNYLENBQUM7S0FDSDs7O1dBRWEsMEJBQUc7QUFDZixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRUssa0JBQUc7OztBQUNQLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTzs7QUFFbEMsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtBQUNoRixpQkFBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNoQzs7QUFFRCxVQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFVBQUMsSUFBUSxFQUFLO1lBQVgsSUFBSSxHQUFOLElBQVEsQ0FBTixJQUFJOztBQUN6QyxZQUFJLElBQUksS0FBSyxPQUFLLEtBQUssRUFBRTtBQUN2QixpQkFBSyxjQUFjLENBQUMsT0FBSyxLQUFLLENBQUMsQ0FBQztTQUNqQztPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxvQkFBRztBQUNULFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQy9DOzs7V0FFSyxrQkFBVTt3Q0FBTixJQUFJO0FBQUosWUFBSTs7O0FBQ1osaUNBNVBFLFFBQVEseUNBNFBNLElBQUksRUFBRTs7QUFFdEIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtBQUM1QyxjQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3RCLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUMzRCxjQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLFdBQVcsRUFBRTtBQUNqRSxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQ3RFO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDbkI7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDaEQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRWlCLDhCQUFHO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3JDLFlBQUksT0FBTyxJQUFJLENBQUMsaUJBQWlCLEtBQUssVUFBVSxFQUFFO0FBQ2hELGNBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzNCO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVrQiwrQkFBRztBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNyQyxZQUFJLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixLQUFLLFVBQVUsRUFBRTtBQUNoRCxjQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksRUFBRTtBQUM1RCxZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZixNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQ2Y7S0FDRjs7O1dBRVUsdUJBQUc7QUFDWixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3JDOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVwQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN6QyxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2xCO0tBQ0Y7OztXQUVnQiwyQkFBQyxDQUFDLEVBQUUsT0FBTyxFQUFFO0FBQzVCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztBQUNyRCxVQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVoRixVQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckMsVUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUNoQyxZQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0QyxlQUFPLElBQUksQ0FBQztPQUNiOztBQUVELFVBQUksWUFBWSxLQUFLLE9BQU8sRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFMUMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7QUFFOUQsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5DLFVBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDOUMsVUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFekMsVUFBSSxTQUFTLEtBQUssQ0FBQyxDQUFDLElBQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDOztBQUV0RCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNoRCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFaEQsV0FBSyxJQUFJLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxrQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDcEM7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRXVCLGtDQUFDLENBQUMsRUFBRTtBQUMxQixVQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUN6RCxVQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7O0FBRXJDLFVBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztPQUNwQyxNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDdkM7O0FBRUQsY0FBUSxPQUFPO0FBQ2IsYUFBSyxNQUFNLENBQUMsRUFBRTtBQUNaLGNBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO0FBQ2xDLGdCQUFNO0FBQUEsQUFDUixhQUFLLE1BQU0sQ0FBQyxJQUFJO0FBQ2QsY0FBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7QUFDcEMsZ0JBQU07QUFBQSxBQUNSLGFBQUssTUFBTSxDQUFDLElBQUk7QUFDZCxjQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztBQUNwQyxnQkFBTTtBQUFBLEFBQ1IsYUFBSyxNQUFNLENBQUMsS0FBSztBQUNmLGNBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO0FBQ3JDLGdCQUFNO0FBQUEsQUFDUjtBQUNFLGlCQUFPO0FBQUEsT0FDVjs7QUFFRCxPQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsT0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixVQUFJLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQztLQUN6Qzs7O1dBRXlCLHNDQUFHO0FBQzNCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUVuRCxVQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTFDLFVBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDcEIsZUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUUsY0FBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM3QztPQUNGLE1BQU07QUFDTCxZQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztPQUM5RDs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFOUMsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUNsQztLQUNGOzs7V0FFMkIsd0NBQUc7QUFDN0IsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRW5ELFVBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuRCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7O0FBRWYsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsV0FBRyxHQUFHLE9BQU8sQ0FBQzs7QUFFZCxXQUFHO0FBQ0QsY0FBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFbEMsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEIsZUFBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7V0FDekQ7U0FDRixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUU7T0FDcEQ7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNwQixZQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTlDLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDbkM7S0FDRjs7O1dBRTJCLHdDQUFHO0FBQzdCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU1QyxVQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFO0FBQzdCLFlBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JDLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFdkIsZUFBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoQyxZQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ25DLE1BQU07QUFDTCxlQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7T0FDM0I7S0FDRjs7O1dBRTRCLHlDQUFHO0FBQzlCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU1QyxVQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDNUIsWUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUU1QixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZjtLQUNGOzs7V0FFK0IsNENBQUc7QUFDakMsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTVDLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixZQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckMsWUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQzs7QUFFM0MsWUFBSSxXQUFXLEdBQUcsV0FBVyxHQUFHLEVBQUUsRUFBRTtBQUNsQyxjQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZixNQUFNLElBQUksV0FBVyxHQUFHLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsRUFBRTtBQUMzRCxjQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7T0FDRjtLQUNGOzs7V0EvY2EsbUJBQUc7OztBQUNmLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUNkLGlCQUFPLDRCQUE0QjtPQUNwQyxFQUFFLFlBQU07QUFDUCxlQUFLLEVBQUUsQ0FBQztBQUNOLG1CQUFPLDJFQUEyRTtBQUNsRixrQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGdCQUFNLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQzs7QUFFSCxlQUFLLEdBQUcsQ0FBQztBQUNQLG1CQUFPLCtCQUErQjtBQUN0QyxrQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGdCQUFNLEVBQUUsT0FBTztTQUNoQixFQUFFLFlBQU07QUFDUCxpQkFBSyxFQUFFLENBQUM7QUFDTixxQkFBTywrQkFBK0I7QUFDdEMsb0JBQVEsRUFBRSxDQUFDLENBQUM7QUFDWixrQkFBTSxFQUFFLFVBQVU7V0FDbkIsQ0FBQyxDQUFDOztBQUVILGlCQUFLLEVBQUUsQ0FBQztBQUNOLHFCQUFPLE1BQU07QUFDYixvQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGtCQUFNLEVBQUUsT0FBTztXQUNoQixDQUFDLENBQUM7O0FBRUgsaUJBQUssSUFBSSxDQUFDO0FBQ1IscUJBQU8sa0NBQWtDO0FBQ3pDLG9CQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ1osa0JBQU0sRUFBRSxNQUFNO1dBQ2YsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDOztBQUVILGVBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sU0FBUztBQUNoQixrQkFBUSxFQUFFLENBQUMsQ0FBQztBQUNaLGdCQUFNLEVBQUUsU0FBUztTQUNsQixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBekNHLFFBQVE7OztxQkFtZEMsUUFBUSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvdmlld3MvdHJlZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdldmVudC1raXQnO1xuaW1wb3J0IHsgJCwgU2Nyb2xsVmlldyB9IGZyb20gJ2F0b20tc3BhY2UtcGVuLXZpZXdzJztcbmltcG9ydCB7XG4gIGVsYXBzZWRUaW1lLFxuICByZXNvbHZlVHJlZSxcbiAgZ2V0U2VsZWN0ZWRUcmVlLFxufSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBEaXJlY3RvcnlWaWV3IGZyb20gJy4vZGlyZWN0b3J5LXZpZXcnO1xuXG5jbGFzcyBUcmVlVmlldyBleHRlbmRzIFNjcm9sbFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXYoe1xuICAgICAgY2xhc3M6ICdyZW1vdGUtZnRwLXZpZXcgdG9vbC1wYW5lbCcsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5vbCh7XG4gICAgICAgIGNsYXNzOiAnZnRwdHJlZS12aWV3IGZ1bGwtbWVudSBsaXN0LXRyZWUgaGFzLWNvbGxhcHNhYmxlLWNoaWxkcmVuIGZvY3VzYWJsZS1wYW5lbCcsXG4gICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgICAgb3V0bGV0OiAnbGlzdCcsXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ3F1ZXVlIHRvb2wtcGFuZWwgcGFuZWwtYm90dG9tJyxcbiAgICAgICAgdGFiaW5kZXg6IC0xLFxuICAgICAgICBvdXRsZXQ6ICdxdWV1ZScsXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMudWwoe1xuICAgICAgICAgIGNsYXNzOiAncHJvZ3Jlc3MgdG9vbC1wYW5lbCBwYW5lbC10b3AnLFxuICAgICAgICAgIHRhYmluZGV4OiAtMSxcbiAgICAgICAgICBvdXRsZXQ6ICdwcm9ncmVzcycsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudWwoe1xuICAgICAgICAgIGNsYXNzOiAnbGlzdCcsXG4gICAgICAgICAgdGFiaW5kZXg6IC0xLFxuICAgICAgICAgIG91dGxldDogJ2RlYnVnJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zcGFuKHtcbiAgICAgICAgICBjbGFzczogJ3JlbW90ZS1mdHAtaW5mbyBpY29uIGljb24tdW5mb2xkJyxcbiAgICAgICAgICB0YWJpbmRleDogLTEsXG4gICAgICAgICAgb3V0bGV0OiAnaW5mbycsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGl2KHtcbiAgICAgICAgY2xhc3M6ICdvZmZsaW5lJyxcbiAgICAgICAgdGFiaW5kZXg6IC0xLFxuICAgICAgICBvdXRsZXQ6ICdvZmZsaW5lJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShzdG9yYWdlKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZShzdG9yYWdlKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdG9yYWdlID0gc3RvcmFnZTtcblxuICAgIC8vIFN1cHBvcnRlZCBmb3Igb2xkIEFQSVxuICAgIHRoaXMuZ2V0U2VsZWN0ZWQgPSBnZXRTZWxlY3RlZFRyZWU7XG4gICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZVRyZWU7XG5cbiAgICBjb25zdCBodG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJyZW1vdGUtZnRwLW9mZmxpbmUtaW5uZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwicmVtb3RlLWZ0cC1waWN0b1wiPjxzcGFuIGNsYXNzPVwiaWNvbiBpY29uLXNoaWVsZFwiPjwvc3Bhbj48L2Rpdj5cbiAgICA8dWw+XG4gICAgICA8bGk+PGEgcm9sZT1cImNvbm5lY3RcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBpY29uXCI+Q29ubmVjdDwvYT48YnIgLz48L2xpPlxuICAgICAgPGxpPjxhIHJvbGU9XCJjb25maWd1cmVcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBpY29uXCI+RWRpdCBDb25maWd1cmF0aW9uPC9hPjxiciAvPjwvbGk+XG4gICAgICA8bGk+PGEgcm9sZT1cImNvbmZpZ3VyZV9pZ25vcmVkXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgaWNvblwiPkVkaXQgSWdub3JlIENvbmZpZ3VyYXRpb248L2E+PGJyIC8+PC9saT5cbiAgICAgIDxsaT48YSByb2xlPVwidG9nZ2xlXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgaWNvblwiPkNsb3NlIFBhbmVsPC9hPjwvbGk+XG4gICAgPC91bD5cbiAgICA8L2Rpdj5gO1xuXG4gICAgdGhpcy5vZmZsaW5lLmh0bWwoaHRtbCk7XG5cbiAgICBpZiAoYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5pc0Nvbm5lY3RlZCgpKSB7XG4gICAgICB0aGlzLnNob3dPbmxpbmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93T2ZmbGluZSgpO1xuICAgIH1cblxuICAgIHRoaXMucm9vdCA9IG5ldyBEaXJlY3RvcnlWaWV3KGF0b20ucHJvamVjdC5yZW1vdGVmdHAucm9vdCk7XG4gICAgdGhpcy5yb290LmV4cGFuZCgpO1xuICAgIHRoaXMubGlzdC5hcHBlbmQodGhpcy5yb290KTtcbiAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IFtdO1xuXG4gICAgLy8gRXZlbnRzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdyZW1vdGUtZnRwLnRyZWUuZW5hYmxlRHJhZ0FuZERyb3AnLCAodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlLm5ld1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVEcmFnQW5kRHJvcHMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpc3Bvc2VEcmFnQW5kRHJvcHMoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGF0b20ucHJvamVjdC5yZW1vdGVmdHAub25EaWREZWJ1ZygobXNnKSA9PiB7XG4gICAgICB0aGlzLmRlYnVnLnByZXBlbmQoYDxsaT4ke21zZ308L2xpPmApO1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmRlYnVnLmNoaWxkcmVuKCk7XG5cbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAyMCkge1xuICAgICAgICBjaGlsZHJlbi5sYXN0KCkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhdG9tLnByb2plY3QucmVtb3RlZnRwLm9uRGlkUXVldWVDaGFuZ2VkKCgpID0+IHtcbiAgICAgIHRoaXMucHJvZ3Jlc3MuZW1wdHkoKTtcblxuICAgICAgY29uc3QgcXVldWVzID0gW107XG4gICAgICBpZiAoYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5jdXJyZW50KSB7XG4gICAgICAgIHF1ZXVlcy5wdXNoKGF0b20ucHJvamVjdC5yZW1vdGVmdHAuY3VycmVudCk7XG4gICAgICB9XG5cbiAgICAgIGF0b20ucHJvamVjdC5yZW1vdGVmdHAucXVldWUuZm9yRWFjaCgocXVldWVFbGVtKSA9PiB7XG4gICAgICAgIHF1ZXVlcy5wdXNoKHF1ZXVlRWxlbSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHF1ZXVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcy5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb2dyZXNzLnNob3coKTtcblxuICAgICAgICBxdWV1ZXMuZm9yRWFjaCgocXVldWUpID0+IHtcbiAgICAgICAgICBjb25zdCAkbGkgPSAkKGA8bGk+PHByb2dyZXNzIGNsYXNzPVwiaW5saW5lLWJsb2NrXCIgLz48ZGl2IGNsYXNzPVwibmFtZVwiPiR7cXVldWVbMF19PC9kaXY+PGRpdiBjbGFzcz1cImV0YVwiPi08L2Rpdj48L2xpPmApO1xuICAgICAgICAgIGNvbnN0ICRwcm9ncmVzcyA9ICRsaS5jaGlsZHJlbigncHJvZ3Jlc3MnKTtcbiAgICAgICAgICBjb25zdCAkZXRhID0gJGxpLmNoaWxkcmVuKCcuZXRhJyk7XG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBxdWV1ZVsyXTtcblxuICAgICAgICAgIHRoaXMucHJvZ3Jlc3MuYXBwZW5kKCRsaSk7XG5cbiAgICAgICAgICBwcm9ncmVzcy5vbigncHJvZ3Jlc3MnLCAocGVyY2VudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBlcmNlbnQgPT09IC0xKSB7XG4gICAgICAgICAgICAgICRwcm9ncmVzcy5yZW1vdmVBdHRyKCdtYXgnKS5yZW1vdmVBdHRyKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAkZXRhLnRleHQoJy0nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICRwcm9ncmVzcy5hdHRyKCdtYXgnLCAxMDApLmF0dHIoJ3ZhbHVlJywgcGFyc2VJbnQocGVyY2VudCAqIDEwMCwgMTApKTtcbiAgICAgICAgICAgICAgY29uc3QgZXRhID0gcHJvZ3Jlc3MuZ2V0RXRhKCk7XG5cbiAgICAgICAgICAgICAgJGV0YS50ZXh0KGVsYXBzZWRUaW1lKGV0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcHJvZ3Jlc3Mub25jZSgnZG9uZScsICgpID0+IHtcbiAgICAgICAgICAgIHByb2dyZXNzLnJlbW92ZUFsbExpc3RlbmVycygncHJvZ3Jlc3MnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmUub24oJ2NsaWNrJywgJ1tyb2xlPVwiY29ubmVjdFwiXScsICgpID0+IHtcbiAgICAgIGF0b20ucHJvamVjdC5yZW1vdGVmdHAucmVhZENvbmZpZygoKSA9PiB7XG4gICAgICAgIGF0b20ucHJvamVjdC5yZW1vdGVmdHAuY29ubmVjdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmUub24oJ2NsaWNrJywgJ1tyb2xlPVwiY29uZmlndXJlXCJdJywgKCkgPT4ge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihhdG9tLnByb2plY3QucmVtb3RlZnRwLmdldENvbmZpZ1BhdGgoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmUub24oJ2NsaWNrJywgJ1tyb2xlPVwiY29uZmlndXJlX2lnbm9yZWRcIl0nLCAoKSA9PiB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJy5mdHBpZ25vcmUnKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmUub24oJ2NsaWNrJywgJ1tyb2xlPVwidG9nZ2xlXCJdJywgKCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW5mby5vbignY2xpY2snLCAoZSkgPT4geyB0aGlzLnRvZ2dsZUluZm8oZSk7IH0pO1xuXG4gICAgdGhpcy5saXN0Lm9uKCdrZXlkb3duJywgKGUpID0+IHsgdGhpcy5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb24oZSk7IH0pO1xuXG4gICAgdGhpcy5yb290LmVudHJpZXMub24oJ2NsaWNrJywgJ2xpLmVudHJ5JywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCBlbGVtID0gZS50YXJnZXQ7XG4gICAgICBjb25zdCAkdGhpcyA9ICQoZWxlbSk7XG5cbiAgICAgIGlmICghJHRoaXMuaGFzQ2xhc3MoJ2VudHJ5IGxpc3QtaXRlbScpKSB7XG4gICAgICAgIGlmICghJHRoaXMuaGFzQ2xhc3MoJ25hbWUnKSAmJiAhJHRoaXMuaGFzQ2xhc3MoJ2hlYWRlcicpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbSA9ICR0aGlzLnBhcmVudCgpWzBdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW90ZU11bHRpU2VsZWN0KGUsIGVsZW0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBhdG9tLnByb2plY3QucmVtb3RlZnRwLm9uRGlkQ29ubmVjdGVkKCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd09ubGluZSgpO1xuICAgIH0pO1xuXG4gICAgYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cC5vbkRpZERpc2Nvbm5lY3RlZCgoKSA9PiB7XG4gICAgICB0aGlzLnNob3dPZmZsaW5lKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmdldFRpdGxlID0gKCkgPT4gJ1JlbW90ZSc7XG5cbiAgICBpZiAodGhpcy5zdG9yYWdlLmRhdGEub3B0aW9ucy50cmVlVmlld1Nob3cpIHtcbiAgICAgIHRoaXMuYXR0YWNoKCk7XG4gICAgfVxuICB9XG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuZGF0YTtcbiAgfVxuXG4gIHRvZ2dsZUluZm8oKSB7XG4gICAgdGhpcy5xdWV1ZS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICBpZiAodGhpcy5xdWV1ZS5oYXNDbGFzcygnYWN0aXZlJykpIHtcbiAgICAgIHRoaXMuaW5mby5yZW1vdmVDbGFzcygnaWNvbi11bmZvbGQnKS5hZGRDbGFzcygnaWNvbi1mb2xkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5mby5yZW1vdmVDbGFzcygnaWNvbi1mb2xkJykuYWRkQ2xhc3MoJ2ljb24tdW5mb2xkJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0RG9ja0VsZW1zKCkge1xuICAgIGNvbnN0IGN1cnJlbnRTaWRlID0gdGhpcy5zdG9yYWdlLmRhdGEub3B0aW9ucy50cmVlVmlld1NpZGUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBjdXJyZW50RG9jayA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJzW2N1cnJlbnRTaWRlXTtcblxuICAgIGlmICh0eXBlb2YgY3VycmVudERvY2sgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhY3RpdmVQYW5lID0gY3VycmVudERvY2suZ2V0UGFuZXMoKVswXTtcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50U2lkZSxcbiAgICAgIGN1cnJlbnREb2NrLFxuICAgICAgYWN0aXZlUGFuZSxcbiAgICB9O1xuICB9XG5cbiAgb25EaWRDbG9zZUl0ZW0oKSB7XG4gICAgdGhpcy5kZXRhY2goKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICBjb25zdCBkb2NrRWxlbXMgPSB0aGlzLmdldERvY2tFbGVtcygpO1xuXG4gICAgaWYgKCFkb2NrRWxlbXMuYWN0aXZlUGFuZSkgcmV0dXJuO1xuXG4gICAgdGhpcy5wYW5lbCA9IGRvY2tFbGVtcy5hY3RpdmVQYW5lLmFkZEl0ZW0odGhpcyk7XG5cbiAgICBpZiAoIWRvY2tFbGVtcy5jdXJyZW50RG9jay5pc1Zpc2libGUoKSAmJiB0aGlzLnN0b3JhZ2UuZGF0YS5vcHRpb25zLnRyZWVWaWV3U2hvdykge1xuICAgICAgZG9ja0VsZW1zLmN1cnJlbnREb2NrLnRvZ2dsZSgpO1xuICAgIH1cblxuICAgIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtKCh7IGl0ZW0gfSkgPT4ge1xuICAgICAgaWYgKGl0ZW0gPT09IHRoaXMucGFuZWwpIHtcbiAgICAgICAgdGhpcy5vbkRpZENsb3NlSXRlbSh0aGlzLnBhbmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGF0dGFjaGVkKCkge1xuICAgIHRoaXMuc3RvcmFnZS5kYXRhLm9wdGlvbnMudHJlZVZpZXdTaG93ID0gdHJ1ZTtcbiAgfVxuXG4gIGRldGFjaCguLi5hcmdzKSB7XG4gICAgc3VwZXIuZGV0YWNoKC4uLmFyZ3MpO1xuXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbC5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzLnBhbmVsKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzLnBhbmVsKS5kZXN0cm95SXRlbSh0aGlzLnBhbmVsLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3JhZ2UuZGF0YS5vcHRpb25zLnRyZWVWaWV3U2hvdyA9IGZhbHNlO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgY3JlYXRlRHJhZ0FuZERyb3BzKCkge1xuICAgIHRoaXMucm9vdC5nZXRWaWV3cygpLmZvckVhY2goKHZpZXcpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygdmlldy5kcmFnRXZlbnRzRGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2aWV3LmRyYWdFdmVudHNBY3RpdmF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGlzcG9zZURyYWdBbmREcm9wcygpIHtcbiAgICB0aGlzLnJvb3QuZ2V0Vmlld3MoKS5mb3JFYWNoKCh2aWV3KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHZpZXcuZHJhZ0V2ZW50c0Rlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmlldy5kcmFnRXZlbnRzRGVzdHJveSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5wYW5lbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5wYW5lbCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hdHRhY2goKTtcbiAgICB9XG4gIH1cblxuICBzaG93T2ZmbGluZSgpIHtcbiAgICB0aGlzLmxpc3QuaGlkZSgpO1xuICAgIHRoaXMucXVldWUuaGlkZSgpO1xuICAgIHRoaXMub2ZmbGluZS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpO1xuICB9XG5cbiAgc2hvd09ubGluZSgpIHtcbiAgICB0aGlzLmxpc3Quc2hvdygpO1xuICAgIHRoaXMucXVldWUuc2hvdygpO1xuICAgIHRoaXMub2ZmbGluZS5oaWRlKCk7XG5cbiAgICBpZiAoIWF0b20ucHJvamVjdC5yZW1vdGVmdHAuY29ubmVjdG9yLmZ0cCkge1xuICAgICAgdGhpcy5pbmZvLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdGVNdWx0aVNlbGVjdChlLCBjdXJyZW50KSB7XG4gICAgY29uc3QgdHJlZVZpZXcgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwTWFpbi50cmVlVmlldztcbiAgICBjb25zdCBsYXN0U2VsZWN0ZWQgPSB0cmVlVmlldy5sYXN0U2VsZWN0ZWRbdHJlZVZpZXcubGFzdFNlbGVjdGVkLmxlbmd0aCAtIDFdWzBdO1xuXG4gICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgIGlmIChrZXlDb2RlICE9PSAxIHx8ICFlLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmxpc3QucmVtb3ZlQ2xhc3MoJ211bHRpLXNlbGVjdCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGxhc3RTZWxlY3RlZCA9PT0gY3VycmVudCkgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCBlbnRyaWVzID0gdGhpcy5saXN0LmZpbmQoJ2xpLmVudHJ5Om5vdCgucHJvamVjdC1yb290KScpO1xuXG4gICAgdGhpcy5saXN0LmFkZENsYXNzKCdtdWx0aS1zZWxlY3QnKTtcblxuICAgIGNvbnN0IGxhc3RJbmRleCA9IGVudHJpZXMuaW5kZXgobGFzdFNlbGVjdGVkKTtcbiAgICBjb25zdCBjdXJySW5kZXggPSBlbnRyaWVzLmluZGV4KGN1cnJlbnQpO1xuXG4gICAgaWYgKGxhc3RJbmRleCA9PT0gLTEgfHwgY3VyckluZGV4ID09PSAtMSkgcmV0dXJuIHRydWU7XG5cbiAgICBjb25zdCBlbnRyeU1pbiA9IE1hdGgubWluKGxhc3RJbmRleCwgY3VyckluZGV4KTtcbiAgICBjb25zdCBlbnRyeU1heCA9IE1hdGgubWF4KGxhc3RJbmRleCwgY3VyckluZGV4KTtcblxuICAgIGZvciAobGV0IGkgPSBlbnRyeU1pbjsgaSA8PSBlbnRyeU1heDsgaSsrKSB7XG4gICAgICAkKGVudHJpZXNbaV0pLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uKGUpIHtcbiAgICBjb25zdCBhcnJvd3MgPSB7IGxlZnQ6IDM3LCB1cDogMzgsIHJpZ2h0OiAzOSwgZG93bjogNDAgfTtcbiAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2g7XG5cbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhhcnJvd3MpLmluZGV4T2Yoa2V5Q29kZSkgPiAtMSAmJiBlLnNoaWZ0S2V5KSB7XG4gICAgICB0aGlzLmxpc3QuYWRkQ2xhc3MoJ211bHRpLXNlbGVjdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3QucmVtb3ZlQ2xhc3MoJ211bHRpLXNlbGVjdCcpO1xuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgY2FzZSBhcnJvd3MudXA6XG4gICAgICAgIHRoaXMucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uVXAoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGFycm93cy5kb3duOlxuICAgICAgICB0aGlzLnJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbkRvd24oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGFycm93cy5sZWZ0OlxuICAgICAgICB0aGlzLnJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbkxlZnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGFycm93cy5yaWdodDpcbiAgICAgICAgdGhpcy5yZW1vdGVLZXlib2FyZE5hdmlnYXRpb25SaWdodCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMucmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uTW92ZVBhZ2UoKTtcbiAgfVxuXG4gIHJlbW90ZUtleWJvYXJkTmF2aWdhdGlvblVwKCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG4gICAgY29uc3QgaXNNdWx0aSA9IHRoaXMubGlzdC5oYXNDbGFzcygnbXVsdGktc2VsZWN0Jyk7XG5cbiAgICBsZXQgbmV4dCA9IGN1cnJlbnQucHJldignLmVudHJ5OnZpc2libGUnKTtcblxuICAgIGlmIChuZXh0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICB3aGlsZSAobmV4dC5pcygnLmV4cGFuZGVkJykgJiYgbmV4dC5maW5kKCcuZW50cmllcyAuZW50cnk6dmlzaWJsZScpLmxlbmd0aCkge1xuICAgICAgICBuZXh0ID0gbmV4dC5maW5kKCcuZW50cmllcyAuZW50cnk6dmlzaWJsZScpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0ID0gY3VycmVudC5jbG9zZXN0KCcuZW50cmllcycpLmNsb3Nlc3QoJy5lbnRyeTp2aXNpYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKG5leHQubGVuZ3RoID49IDEpIHtcbiAgICAgIGlmICghaXNNdWx0aSkgY3VycmVudC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblxuICAgICAgbmV4dC5sYXN0KCkuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3RlS2V5Ym9hcmROYXZpZ2F0aW9uRG93bigpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuICAgIGNvbnN0IGlzTXVsdGkgPSB0aGlzLmxpc3QuaGFzQ2xhc3MoJ211bHRpLXNlbGVjdCcpO1xuXG4gICAgbGV0IG5leHQgPSBjdXJyZW50LmZpbmQoJy5lbnRyaWVzIC5lbnRyeTp2aXNpYmxlJyk7XG4gICAgbGV0IHRtcCA9IG51bGw7XG5cbiAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4gICAgICB0bXAgPSBjdXJyZW50O1xuXG4gICAgICBkbyB7XG4gICAgICAgIG5leHQgPSB0bXAubmV4dCgnLmVudHJ5OnZpc2libGUnKTtcblxuICAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgdG1wID0gdG1wLmNsb3Nlc3QoJy5lbnRyaWVzJykuY2xvc2VzdCgnLmVudHJ5OnZpc2libGUnKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoIW5leHQubGVuZ3RoICYmICF0bXAuaXMoJy5wcm9qZWN0LXJvb3QnKSk7XG4gICAgfVxuXG4gICAgaWYgKG5leHQubGVuZ3RoID49IDEpIHtcbiAgICAgIGlmICghaXNNdWx0aSkgY3VycmVudC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblxuICAgICAgbmV4dC5maXJzdCgpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW90ZUtleWJvYXJkTmF2aWdhdGlvbkxlZnQoKSB7XG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMubGlzdC5maW5kKCcuc2VsZWN0ZWQnKTtcblxuICAgIGxldCBuZXh0ID0gbnVsbDtcblxuICAgIGlmICghY3VycmVudC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBuZXh0ID0gY3VycmVudC5jbG9zZXN0KCcuZGlyZWN0b3J5Jyk7XG4gICAgICBuZXh0LnZpZXcoKS5jb2xsYXBzZSgpO1xuXG4gICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgbmV4dC5maXJzdCgpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50LnZpZXcoKS5jb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW90ZUtleWJvYXJkTmF2aWdhdGlvblJpZ2h0KCkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmxpc3QuZmluZCgnLnNlbGVjdGVkJyk7XG5cbiAgICBpZiAoY3VycmVudC5pcygnLmRpcmVjdG9yeScpKSB7XG4gICAgICBjb25zdCB2aWV3ID0gY3VycmVudC52aWV3KCk7XG5cbiAgICAgIHZpZXcub3BlbigpO1xuICAgICAgdmlldy5leHBhbmQoKTtcbiAgICB9XG4gIH1cblxuICByZW1vdGVLZXlib2FyZE5hdmlnYXRpb25Nb3ZlUGFnZSgpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5saXN0LmZpbmQoJy5zZWxlY3RlZCcpO1xuXG4gICAgaWYgKGN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBzY3JvbGxlclRvcCA9IHRoaXMuc2Nyb2xsVG9wKCk7XG4gICAgICBjb25zdCBzZWxlY3RlZFRvcCA9IGN1cnJlbnQucG9zaXRpb24oKS50b3A7XG5cbiAgICAgIGlmIChzZWxlY3RlZFRvcCA8IHNjcm9sbGVyVG9wIC0gMTApIHtcbiAgICAgICAgdGhpcy5wYWdlVXAoKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUb3AgPiBzY3JvbGxlclRvcCArICh0aGlzLmhlaWdodCgpIC0gMTApKSB7XG4gICAgICAgIHRoaXMucGFnZURvd24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHJlZVZpZXc7XG4iXX0=