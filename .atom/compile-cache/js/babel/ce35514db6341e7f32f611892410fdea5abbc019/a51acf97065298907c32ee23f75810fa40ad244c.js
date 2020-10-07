Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomSpacePenViews = require('atom-space-pen-views');

var _helpers = require('../helpers');

var _fileView = require('./file-view');

var _fileView2 = _interopRequireDefault(_fileView);

'use babel';

var DirectoryView = (function (_View) {
  _inherits(DirectoryView, _View);

  function DirectoryView() {
    _classCallCheck(this, DirectoryView);

    _get(Object.getPrototypeOf(DirectoryView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DirectoryView, [{
    key: 'initialize',
    value: function initialize(directory) {
      // super.initialize(directory);

      this.moveTarget = null;
      this.emitter = new _atom.Emitter();
      this.subscriptions = new _atom.CompositeDisposable();
      this.subsDrags = new _atom.CompositeDisposable();

      this.item = directory;
      this.name.text(this.item.name);
      this.name.attr('data-name', this.item.name);
      this.name.attr('data-path', this.item.remote);

      if (atom.project.remoteftp.checkIgnore(this.item.remote)) {
        this.addClass('status-ignored');
      }

      var addIconToElement = (0, _helpers.getIconHandler)();
      if (addIconToElement) {
        var element = this.name[0] || this.name;
        var pathIco = this.item && this.item.local;

        if (typeof pathIco === 'undefined') return;

        this.iconDisposable = addIconToElement(element, pathIco, { isDirectory: true });
      } else {
        this.name.addClass(this.item.type && this.item.type === 'l' ? 'icon-file-symlink-directory' : 'icon-file-directory');
      }

      if (this.item.isExpanded || this.item.isRoot) {
        this.expand();
      }

      if (this.item.isRoot) {
        this.addClass('project-root');
        // this.removeAttr('draggable');
        this.header.addClass('project-root-header');
        this.name.addClass('icon-server').removeClass('icon-file-directory');
      }

      // Trigger repaint
      this.triggers();

      this.repaint();

      // Events
      this.events();

      if (atom.config.get('remote-ftp.tree.enableDragAndDrop')) {
        this.dragEventsActivate();
      }
    }
  }, {
    key: 'triggers',
    value: function triggers() {
      var _this = this;

      this.subscriptions.add(this.item.onChangeSelect(function () {
        var lastSelected = atom.project.remoteftpMain.treeView.lastSelected;

        if (_this.item.isSelected) {
          lastSelected.push(_this);
          lastSelected = lastSelected.reverse().slice(0, 2).reverse();
        }
      }));

      this.subscriptions.add(this.item.onChangeItems(function () {
        _this.repaint();
      }));

      this.subscriptions.add(this.item.onChangeExpanded(function () {
        _this.setClasses();
      }));

      this.subscriptions.add(this.item.onDestroyed(function () {
        _this.destroy();
      }));
    }
  }, {
    key: 'onDidMouseDown',
    value: function onDidMouseDown(callback) {
      this.subscriptions.add(this.emitter.on('mousedown', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidDbClick',
    value: function onDidDbClick(callback) {
      this.subscriptions.add(this.emitter.on('dblclick', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidChangeEnableDragAndDrop',
    value: function onDidChangeEnableDragAndDrop(callback) {
      this.subsDrags.add(this.emitter.on('enableDragAndDrop', function () {
        callback();
      }));
    }
  }, {
    key: 'onDidDrop',
    value: function onDidDrop(callback) {
      this.subsDrags.add(this.emitter.on('drop', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidDragStart',
    value: function onDidDragStart(callback) {
      this.subsDrags.add(this.emitter.on('dragstart', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidDragOver',
    value: function onDidDragOver(callback) {
      this.subsDrags.add(this.emitter.on('dragover', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidDragEnter',
    value: function onDidDragEnter(callback) {
      this.subsDrags.add(this.emitter.on('dragenter', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'onDidDragLeave',
    value: function onDidDragLeave(callback) {
      this.subsDrags.add(this.emitter.on('dragleave', function (e) {
        callback(e);
      }));
    }
  }, {
    key: 'events',
    value: function events() {
      var _this2 = this;

      this.on('dblclick', function (e) {
        return _this2.emitter.emit('dblclick', e);
      });
      this.on('mousedown', function (e) {
        return _this2.emitter.emit('mousedown', e);
      });

      this.onDidMouseDown(function (e) {
        var self = e.currentTarget;
        e.stopPropagation();

        var view = (0, _atomSpacePenViews.$)(self).view();
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

          if (e.shiftKey) return;

          if (button === 0 && !e[selectKey]) {
            if (view.item.status === 0) {
              view.open();
              view.toggle();
            }

            view.toggle();
          }
        }
      });

      this.onDidDbClick(function (e) {
        var self = e.currentTarget;
        e.stopPropagation();

        var view = (0, _atomSpacePenViews.$)(self).view();

        if (!view) return;

        view.open();
      });
    }
  }, {
    key: 'dragEventsActivate',
    value: function dragEventsActivate() {
      var _this3 = this;

      this.on('drop', function (e) {
        return _this3.emitter.emit('drop', e);
      });
      this.on('dragstart', function (e) {
        return _this3.emitter.emit('dragstart', e);
      });
      this.on('dragover', function (e) {
        return _this3.emitter.emit('dragover', e);
      });
      this.on('dragenter', function (e) {
        return _this3.emitter.emit('dragenter', e);
      });
      this.on('dragleave', function (e) {
        return _this3.emitter.emit('dragleave', e);
      });

      this.onDidDrop(function (e) {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.classList.remove('selected');

        if (!(0, _helpers.checkTarget)(e)) return;
        if (_this3.moveTarget === e.currentTarget) return;

        var dataTransfer = e.originalEvent.dataTransfer;

        if (dataTransfer.getData('pathInfos').length !== 0) {
          DirectoryView.actionRemoteMove(e, dataTransfer);
        } else if (dataTransfer.getData('localPaths').length !== 0) {
          DirectoryView.actionToRemote(e, dataTransfer);
        }

        _this3.moveTarget = null;
      });

      this.onDidDragStart(function (e) {
        _this3.moveTarget = e.currentTarget;

        var target = (0, _atomSpacePenViews.$)(e.target).find('.name');
        var dataTransfer = e.originalEvent.dataTransfer;
        var pathInfos = {
          fullPath: target.data('path'),
          name: target.data('name')
        };

        dataTransfer.setData('pathInfos', JSON.stringify(pathInfos));
        dataTransfer.effectAllowed = 'move';
      });

      this.onDidDragOver(function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      this.onDidDragEnter(function (e) {
        var self = e.currentTarget;
        e.stopPropagation();

        if (!(0, _helpers.checkTarget)(e)) return;

        self.classList.add('selected');
      });

      this.onDidDragLeave(function (e) {
        e.stopPropagation();

        e.currentTarget.classList.remove('selected');
      });
    }
  }, {
    key: 'dragEventsDestroy',
    value: function dragEventsDestroy() {
      this.subsDrags.dispose();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.subsDrags.dispose();
      this.emitter.dispose();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.item = null;

      if (this.iconDisposable) {
        this.iconDisposable.dispose();
        this.iconDisposable = null;
      }

      this.dispose();
      this.remove();
    }
  }, {
    key: 'getViews',
    value: function getViews() {
      return this.entries.children().map(function (err, item) {
        return (0, _atomSpacePenViews.$)(item).view();
      }).get();
    }
  }, {
    key: 'getItemViews',
    value: function getItemViews(itemViews) {
      var views = this.getViews() || itemViews;
      var entries = {
        folders: [],
        files: []
      };

      if (this.item) {
        this.item.folders.forEach(function (item) {
          for (var a = 0, b = views.length; a < b; ++a) {
            if (views[a] && views[a] instanceof DirectoryView && views[a].item === item) {
              entries.folders.push(views[a]);
              return;
            }
          }
          entries.folders.push(new DirectoryView(item));
        });

        this.item.files.forEach(function (item) {
          for (var a = 0, b = views.length; a < b; ++a) {
            if (views[a] && views[a] instanceof _fileView2['default'] && views[a].item === item) {
              entries.files.push(views[a]);
              return;
            }
          }
          entries.files.push(new _fileView2['default'](item));
        });
      }

      return entries;
    }
  }, {
    key: 'repaint',
    value: function repaint() {
      var _this4 = this;

      var views = this.getViews();

      this.entries.children().detach();

      var entries = this.getItemViews();

      // TODO Destroy left over...
      views = entries.folders.concat(entries.files);

      views.sort(function (a, b) {
        if (a.constructor !== b.constructor) {
          return a instanceof DirectoryView ? -1 : 1;
        }
        if (a.item.name === b.item.name) {
          return 0;
        }

        return a.item.name.toLowerCase().localeCompare(b.item.name.toLowerCase());
      });

      views.forEach(function (view) {
        _this4.entries.append(view);
      });
    }
  }, {
    key: 'setClasses',
    value: function setClasses() {
      if (this.item.isExpanded) {
        this.addClass('expanded').removeClass('collapsed');
      } else {
        this.addClass('collapsed').removeClass('expanded');
      }
    }
  }, {
    key: 'expand',
    value: function expand(recursive) {
      this.item.setIsExpanded = true;

      if (recursive) {
        this.entries.children().each(function (e, item) {
          var view = (0, _atomSpacePenViews.$)(item).view();
          if (view && view instanceof DirectoryView) {
            view.expand(true);
          }
        });
      }
    }
  }, {
    key: 'collapse',
    value: function collapse(recursive) {
      this.item.setIsExpanded = false;

      if (recursive) {
        this.entries.children().each(function (e, item) {
          var view = (0, _atomSpacePenViews.$)(item).view();
          if (view && view instanceof DirectoryView) {
            view.collapse(true);
          }
        });
      }
    }
  }, {
    key: 'toggle',
    value: function toggle(recursive) {
      if (this.item.isExpanded) {
        this.collapse(recursive);
      } else {
        this.expand(recursive);
      }
    }
  }, {
    key: 'open',
    value: function open() {
      this.item.open();
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      this.item.open();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this5 = this;

      return this.li({
        'class': 'directory entry list-nested-item collapsed',
        is: 'tree-view-directory',
        draggable: true
      }, function () {
        _this5.div({
          'class': 'header list-item',
          outlet: 'header',
          is: 'tree-view-directory'
        }, function () {
          return _this5.span({
            'class': 'name icon',
            outlet: 'name'
          });
        });
        _this5.ol({
          'class': 'entries list-tree',
          outlet: 'entries'
        });
      });
    }
  }, {
    key: 'actionRemoteMove',
    value: function actionRemoteMove(e, dataTransfer) {
      var ftp = atom.project.remoteftpMain;
      var pathInfos = JSON.parse(dataTransfer.getData('pathInfos'));
      var newPathInfo = DirectoryView.queryDataPath(e.currentTarget);
      var destPath = _path2['default'].posix.join(newPathInfo, pathInfos.name);

      if (pathInfos.fullPath === '/' || pathInfos.fullPath === destPath) return;

      ftp.client.rename(pathInfos.fullPath, destPath, function (err) {
        if (err) console.error(err);
      });
    }
  }, {
    key: 'actionToRemote',
    value: function actionToRemote(e, dataTransfer) {
      var newPathInfo = DirectoryView.queryDataPath(e.currentTarget);
      var localPaths = JSON.parse(dataTransfer.getData('localPaths'));
      var destPath = _path2['default'].posix.join(newPathInfo, localPaths.name);

      atom.project.remoteftpMain.client.uploadTo(localPaths.fullPath, destPath, function (err) {
        if (err) console.error(err);
      });
    }
  }, {
    key: 'queryDataPath',
    value: function queryDataPath(target) {
      return target.querySelector('span[data-path]').getAttribute('data-path');
    }
  }]);

  return DirectoryView;
})(_atomSpacePenViews.View);

exports['default'] = DirectoryView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9kaXJlY3Rvcnktdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFNkMsTUFBTTs7b0JBQ2xDLE1BQU07Ozs7aUNBQ0Msc0JBQXNCOzt1QkFDRixZQUFZOzt3QkFDbkMsYUFBYTs7OztBQU5sQyxXQUFXLENBQUM7O0lBUU4sYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOztXQXNCUCxvQkFBQyxTQUFTLEVBQUU7OztBQUdwQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixVQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxHQUFHLCtCQUF5QixDQUFDOztBQUUzQyxVQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3hELFlBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztPQUNqQzs7QUFFRCxVQUFNLGdCQUFnQixHQUFHLDhCQUFnQixDQUFDO0FBQzFDLFVBQUksZ0JBQWdCLEVBQUU7QUFDcEIsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzFDLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7O0FBRTdDLFlBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLE9BQU87O0FBRTNDLFlBQUksQ0FBQyxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO09BQ2pGLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEdBQUcsNkJBQTZCLEdBQUcscUJBQXFCLENBQUMsQ0FBQztPQUN0SDs7QUFFRCxVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO09BQUU7O0FBRWhFLFVBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM1QyxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN0RTs7O0FBR0QsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7OztBQUdmLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLEVBQUU7QUFDeEQsWUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7T0FDM0I7S0FDRjs7O1dBRU8sb0JBQUc7OztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQzdCLFlBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7O0FBRXBFLFlBQUksTUFBSyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hCLHNCQUFZLENBQUMsSUFBSSxPQUFNLENBQUM7QUFDeEIsc0JBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM3RDtPQUNGLENBQUMsQ0FDSCxDQUFDOztBQUVGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFNO0FBQzVCLGNBQUssT0FBTyxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUNILENBQUM7O0FBRUYsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUMvQixjQUFLLFVBQVUsRUFBRSxDQUFDO09BQ25CLENBQUMsQ0FDSCxDQUFDOztBQUVGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzFCLGNBQUssT0FBTyxFQUFFLENBQUM7T0FDaEIsQ0FBQyxDQUNILENBQUM7S0FDSDs7O1dBRWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDbEMsZ0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiLENBQUMsQ0FDSCxDQUFDO0tBQ0g7OztXQUVXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2pDLGdCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDYixDQUFDLENBQ0gsQ0FBQztLQUNIOzs7V0FFMkIsc0NBQUMsUUFBUSxFQUFFO0FBQ3JDLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxZQUFNO0FBQ3pDLGdCQUFRLEVBQUUsQ0FBQztPQUNaLENBQUMsQ0FDSCxDQUFDO0tBQ0g7OztXQUVRLG1CQUFDLFFBQVEsRUFBRTtBQUNsQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQzdCLGdCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDYixDQUFDLENBQ0gsQ0FBQztLQUNIOzs7V0FFYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNsQyxnQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2IsQ0FBQyxDQUNILENBQUM7S0FDSDs7O1dBRVksdUJBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDakMsZ0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiLENBQUMsQ0FDSCxDQUFDO0tBQ0g7OztXQUVhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxFQUFLO0FBQ2xDLGdCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDYixDQUFDLENBQ0gsQ0FBQztLQUNIOzs7V0FFYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsRUFBSztBQUNsQyxnQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2IsQ0FBQyxDQUNILENBQUM7S0FDSDs7O1dBRUssa0JBQUc7OztBQUNQLFVBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQUEsQ0FBQztlQUFJLE9BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQzNELFVBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUEsQ0FBQztlQUFJLE9BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUU3RCxVQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3pCLFlBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDN0IsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixZQUFNLElBQUksR0FBRywwQkFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM1QixZQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1RCxZQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3hFLFlBQU0sU0FBUyxHQUFHLDBCQUFFLDRCQUE0QixDQUFDLENBQUM7O0FBRWxELFlBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsWUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQSxJQUFLLEVBQUUsTUFBTSxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDN0UsY0FBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUNqQixxQkFBUyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsQyxzQ0FBRSxxQ0FBcUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztXQUN0RSxNQUFNO0FBQ0wsc0NBQUUscUNBQXFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7V0FDbkU7QUFDRCxjQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU3QixpQkFBSyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXBELGNBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxPQUFPOztBQUV2QixjQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDakMsZ0JBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzFCLGtCQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixrQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Y7O0FBRUQsZ0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztXQUNmO1NBQ0Y7T0FDRixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFDLENBQUMsRUFBSztBQUN2QixZQUFNLElBQUksR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQzdCLFNBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFcEIsWUFBTSxJQUFJLEdBQUcsMEJBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTVCLFlBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTzs7QUFFbEIsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2IsQ0FBQyxDQUFDO0tBQ0o7OztXQTZCaUIsOEJBQUc7OztBQUNuQixVQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFBLENBQUM7ZUFBSSxPQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNuRCxVQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFBLENBQUM7ZUFBSSxPQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFBLENBQUM7ZUFBSSxPQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUMzRCxVQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFBLENBQUM7ZUFBSSxPQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFBLENBQUM7ZUFBSSxPQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFN0QsVUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUMsRUFBSztBQUNwQixTQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixTQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTdDLFlBQUksQ0FBQywwQkFBWSxDQUFDLENBQUMsRUFBRSxPQUFPO0FBQzVCLFlBQUksT0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLGFBQWEsRUFBRSxPQUFPOztBQUVoRCxZQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQzs7QUFFbEQsWUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbEQsdUJBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDakQsTUFBTSxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMxRCx1QkFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDL0M7O0FBRUQsZUFBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3pCLGVBQUssVUFBVSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7O0FBRWxDLFlBQU0sTUFBTSxHQUFHLDBCQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDekMsWUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7QUFDbEQsWUFBTSxTQUFTLEdBQUc7QUFDaEIsa0JBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3QixjQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDMUIsQ0FBQzs7QUFFRixvQkFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQzdELG9CQUFZLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztPQUNyQyxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFDLENBQUMsRUFBSztBQUN4QixTQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO09BQ3JCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsY0FBYyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQ3pCLFlBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDN0IsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixZQUFJLENBQUMsMEJBQVksQ0FBQyxDQUFDLEVBQUUsT0FBTzs7QUFFNUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDaEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxjQUFjLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDekIsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixTQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDOUMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN6QixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixZQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztPQUM1Qjs7QUFFRCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O1dBRU8sb0JBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7ZUFBSywwQkFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7T0FBQSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDekU7OztXQUVXLHNCQUFDLFNBQVMsRUFBRTtBQUN0QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksU0FBUyxDQUFDO0FBQzNDLFVBQU0sT0FBTyxHQUFHO0FBQ2QsZUFBTyxFQUFFLEVBQUU7QUFDWCxhQUFLLEVBQUUsRUFBRTtPQUNWLENBQUM7O0FBRUYsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ2IsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2xDLGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDNUMsZ0JBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxhQUFhLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7QUFDM0UscUJBQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLHFCQUFPO2FBQ1I7V0FDRjtBQUNELGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQy9DLENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDaEMsZUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUM1QyxnQkFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxpQ0FBb0IsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtBQUN0RSxxQkFBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IscUJBQU87YUFDUjtXQUNGO0FBQ0QsaUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLDBCQUFhLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDeEMsQ0FBQyxDQUFDO09BQ0o7O0FBRUQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVNLG1CQUFHOzs7QUFDUixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWpDLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7O0FBR3BDLFdBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTlDLFdBQUssQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ25CLFlBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxZQUFZLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtBQUNwRixZQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsaUJBQU8sQ0FBQyxDQUFDO1NBQUU7O0FBRTlDLGVBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7T0FDM0UsQ0FBQyxDQUFDOztBQUVILFdBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdEIsZUFBSyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCLENBQUMsQ0FBQztLQUNKOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDeEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDcEQsTUFBTTtBQUNMLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ3BEO0tBQ0Y7OztXQUVLLGdCQUFDLFNBQVMsRUFBRTtBQUNoQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRS9CLFVBQUksU0FBUyxFQUFFO0FBQ2IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFLO0FBQ3hDLGNBQU0sSUFBSSxHQUFHLDBCQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLGNBQUksSUFBSSxJQUFJLElBQUksWUFBWSxhQUFhLEVBQUU7QUFBRSxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUFFO1NBQ2xFLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVPLGtCQUFDLFNBQVMsRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRWhDLFVBQUksU0FBUyxFQUFFO0FBQ2IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFLO0FBQ3hDLGNBQU0sSUFBSSxHQUFHLDBCQUFFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzVCLGNBQUksSUFBSSxJQUFJLElBQUksWUFBWSxhQUFhLEVBQUU7QUFBRSxnQkFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUFFO1NBQ3BFLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVLLGdCQUFDLFNBQVMsRUFBRTtBQUNoQixVQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDMUIsTUFBTTtBQUNMLFlBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDeEI7S0FDRjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2xCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDbEI7OztXQS9hYSxtQkFBRzs7O0FBQ2YsYUFBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ2IsaUJBQU8sNENBQTRDO0FBQ25ELFVBQUUsRUFBRSxxQkFBcUI7QUFDekIsaUJBQVMsRUFBRSxJQUFJO09BQ2hCLEVBQUUsWUFBTTtBQUNQLGVBQUssR0FBRyxDQUFDO0FBQ1AsbUJBQU8sa0JBQWtCO0FBQ3pCLGdCQUFNLEVBQUUsUUFBUTtBQUNoQixZQUFFLEVBQUUscUJBQXFCO1NBQzFCLEVBQUU7aUJBQU0sT0FBSyxJQUFJLENBQUM7QUFDakIscUJBQU8sV0FBVztBQUNsQixrQkFBTSxFQUFFLE1BQU07V0FDZixDQUFDO1NBQUEsQ0FBQyxDQUFDO0FBQ0osZUFBSyxFQUFFLENBQUM7QUFDTixtQkFBTyxtQkFBbUI7QUFDMUIsZ0JBQU0sRUFBRSxTQUFTO1NBQ2xCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0F1TXNCLDBCQUFDLENBQUMsRUFBRSxZQUFZLEVBQUU7QUFDdkMsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDdkMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDaEUsVUFBTSxXQUFXLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakUsVUFBTSxRQUFRLEdBQUcsa0JBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5RCxVQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFLE9BQU87O0FBRTFFLFNBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ3ZELFlBQUksR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDN0IsQ0FBQyxDQUFDO0tBQ0o7OztXQUVvQix3QkFBQyxDQUFDLEVBQUUsWUFBWSxFQUFFO0FBQ3JDLFVBQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2pFLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLFVBQU0sUUFBUSxHQUFHLGtCQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFL0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUNqRixZQUFJLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUNKOzs7V0FFbUIsdUJBQUMsTUFBTSxFQUFFO0FBQzNCLGFBQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMxRTs7O1NBcFBHLGFBQWE7OztxQkFtYkosYUFBYSIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvdmlld3MvZGlyZWN0b3J5LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyAkLCBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgZ2V0SWNvbkhhbmRsZXIsIGNoZWNrVGFyZ2V0IH0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQgRmlsZVZpZXcgZnJvbSAnLi9maWxlLXZpZXcnO1xuXG5jbGFzcyBEaXJlY3RvcnlWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLmxpKHtcbiAgICAgIGNsYXNzOiAnZGlyZWN0b3J5IGVudHJ5IGxpc3QtbmVzdGVkLWl0ZW0gY29sbGFwc2VkJyxcbiAgICAgIGlzOiAndHJlZS12aWV3LWRpcmVjdG9yeScsXG4gICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2hlYWRlciBsaXN0LWl0ZW0nLFxuICAgICAgICBvdXRsZXQ6ICdoZWFkZXInLFxuICAgICAgICBpczogJ3RyZWUtdmlldy1kaXJlY3RvcnknLFxuICAgICAgfSwgKCkgPT4gdGhpcy5zcGFuKHtcbiAgICAgICAgY2xhc3M6ICduYW1lIGljb24nLFxuICAgICAgICBvdXRsZXQ6ICduYW1lJyxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXMub2woe1xuICAgICAgICBjbGFzczogJ2VudHJpZXMgbGlzdC10cmVlJyxcbiAgICAgICAgb3V0bGV0OiAnZW50cmllcycsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoZGlyZWN0b3J5KSB7XG4gICAgLy8gc3VwZXIuaW5pdGlhbGl6ZShkaXJlY3RvcnkpO1xuXG4gICAgdGhpcy5tb3ZlVGFyZ2V0ID0gbnVsbDtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzRHJhZ3MgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5pdGVtID0gZGlyZWN0b3J5O1xuICAgIHRoaXMubmFtZS50ZXh0KHRoaXMuaXRlbS5uYW1lKTtcbiAgICB0aGlzLm5hbWUuYXR0cignZGF0YS1uYW1lJywgdGhpcy5pdGVtLm5hbWUpO1xuICAgIHRoaXMubmFtZS5hdHRyKCdkYXRhLXBhdGgnLCB0aGlzLml0ZW0ucmVtb3RlKTtcblxuICAgIGlmIChhdG9tLnByb2plY3QucmVtb3RlZnRwLmNoZWNrSWdub3JlKHRoaXMuaXRlbS5yZW1vdGUpKSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdzdGF0dXMtaWdub3JlZCcpO1xuICAgIH1cblxuICAgIGNvbnN0IGFkZEljb25Ub0VsZW1lbnQgPSBnZXRJY29uSGFuZGxlcigpO1xuICAgIGlmIChhZGRJY29uVG9FbGVtZW50KSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5uYW1lWzBdIHx8IHRoaXMubmFtZTtcbiAgICAgIGNvbnN0IHBhdGhJY28gPSB0aGlzLml0ZW0gJiYgdGhpcy5pdGVtLmxvY2FsO1xuXG4gICAgICBpZiAodHlwZW9mIHBhdGhJY28gPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgICAgIHRoaXMuaWNvbkRpc3Bvc2FibGUgPSBhZGRJY29uVG9FbGVtZW50KGVsZW1lbnQsIHBhdGhJY28sIHsgaXNEaXJlY3Rvcnk6IHRydWUgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmFtZS5hZGRDbGFzcyh0aGlzLml0ZW0udHlwZSAmJiB0aGlzLml0ZW0udHlwZSA9PT0gJ2wnID8gJ2ljb24tZmlsZS1zeW1saW5rLWRpcmVjdG9yeScgOiAnaWNvbi1maWxlLWRpcmVjdG9yeScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLml0ZW0uaXNFeHBhbmRlZCB8fCB0aGlzLml0ZW0uaXNSb290KSB7IHRoaXMuZXhwYW5kKCk7IH1cblxuICAgIGlmICh0aGlzLml0ZW0uaXNSb290KSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdwcm9qZWN0LXJvb3QnKTtcbiAgICAgIC8vIHRoaXMucmVtb3ZlQXR0cignZHJhZ2dhYmxlJyk7XG4gICAgICB0aGlzLmhlYWRlci5hZGRDbGFzcygncHJvamVjdC1yb290LWhlYWRlcicpO1xuICAgICAgdGhpcy5uYW1lLmFkZENsYXNzKCdpY29uLXNlcnZlcicpLnJlbW92ZUNsYXNzKCdpY29uLWZpbGUtZGlyZWN0b3J5Jyk7XG4gICAgfVxuXG4gICAgLy8gVHJpZ2dlciByZXBhaW50XG4gICAgdGhpcy50cmlnZ2VycygpO1xuXG4gICAgdGhpcy5yZXBhaW50KCk7XG5cbiAgICAvLyBFdmVudHNcbiAgICB0aGlzLmV2ZW50cygpO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC50cmVlLmVuYWJsZURyYWdBbmREcm9wJykpIHtcbiAgICAgIHRoaXMuZHJhZ0V2ZW50c0FjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgdHJpZ2dlcnMoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuaXRlbS5vbkNoYW5nZVNlbGVjdCgoKSA9PiB7XG4gICAgICAgIGxldCBsYXN0U2VsZWN0ZWQgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwTWFpbi50cmVlVmlldy5sYXN0U2VsZWN0ZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMuaXRlbS5pc1NlbGVjdGVkKSB7XG4gICAgICAgICAgbGFzdFNlbGVjdGVkLnB1c2godGhpcyk7XG4gICAgICAgICAgbGFzdFNlbGVjdGVkID0gbGFzdFNlbGVjdGVkLnJldmVyc2UoKS5zbGljZSgwLCAyKS5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5pdGVtLm9uQ2hhbmdlSXRlbXMoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5pdGVtLm9uQ2hhbmdlRXhwYW5kZWQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldENsYXNzZXMoKTtcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5pdGVtLm9uRGVzdHJveWVkKCgpID0+IHtcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgb25EaWRNb3VzZURvd24oY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBvbkRpZERiQ2xpY2soY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkYmxjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlRW5hYmxlRHJhZ0FuZERyb3AoY2FsbGJhY2spIHtcbiAgICB0aGlzLnN1YnNEcmFncy5hZGQoXG4gICAgICB0aGlzLmVtaXR0ZXIub24oJ2VuYWJsZURyYWdBbmREcm9wJywgKCkgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkRHJvcChjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic0RyYWdzLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignZHJvcCcsIChlKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkRHJhZ1N0YXJ0KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzRHJhZ3MuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkcmFnc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBvbkRpZERyYWdPdmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzRHJhZ3MuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIG9uRGlkRHJhZ0VudGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zdWJzRHJhZ3MuYWRkKFxuICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkcmFnZW50ZXInLCAoZSkgPT4ge1xuICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBvbkRpZERyYWdMZWF2ZShjYWxsYmFjaykge1xuICAgIHRoaXMuc3Vic0RyYWdzLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignZHJhZ2xlYXZlJywgKGUpID0+IHtcbiAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgZXZlbnRzKCkge1xuICAgIHRoaXMub24oJ2RibGNsaWNrJywgZSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGJsY2xpY2snLCBlKSk7XG4gICAgdGhpcy5vbignbW91c2Vkb3duJywgZSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnbW91c2Vkb3duJywgZSkpO1xuXG4gICAgdGhpcy5vbkRpZE1vdXNlRG93bigoZSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZiA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGNvbnN0IHZpZXcgPSAkKHNlbGYpLnZpZXcoKTtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IGUub3JpZ2luYWxFdmVudCA/IGUub3JpZ2luYWxFdmVudC5idXR0b24gOiAwO1xuICAgICAgY29uc3Qgc2VsZWN0S2V5ID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyAnbWV0YUtleScgOiAnY3RybEtleSc7IC8vIG9uIG1hYyB0aGUgc2VsZWN0IGtleSBmb3IgbXVsdGlwbGUgZmlsZXMgaXMgdGhlIG1ldGEga2V5XG4gICAgICBjb25zdCAkc2VsZWN0ZWQgPSAkKCcucmVtb3RlLWZ0cC12aWV3IC5zZWxlY3RlZCcpO1xuXG4gICAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgICAgaWYgKChidXR0b24gPT09IDAgfHwgYnV0dG9uID09PSAyKSAmJiAhKGJ1dHRvbiA9PT0gMiAmJiAkc2VsZWN0ZWQubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgaWYgKCFlW3NlbGVjdEtleV0pIHtcbiAgICAgICAgICAkc2VsZWN0ZWQucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgJCgnLnJlbW90ZS1mdHAtdmlldyAuZW50cmllcy5saXN0LXRyZWUnKS5yZW1vdmVDbGFzcygnbXVsdGktc2VsZWN0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCgnLnJlbW90ZS1mdHAtdmlldyAuZW50cmllcy5saXN0LXRyZWUnKS5hZGRDbGFzcygnbXVsdGktc2VsZWN0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdmlldy50b2dnbGVDbGFzcygnc2VsZWN0ZWQnKTtcblxuICAgICAgICB0aGlzLml0ZW0uc2V0SXNTZWxlY3RlZCA9IHZpZXcuaGFzQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHJldHVybjtcblxuICAgICAgICBpZiAoYnV0dG9uID09PSAwICYmICFlW3NlbGVjdEtleV0pIHtcbiAgICAgICAgICBpZiAodmlldy5pdGVtLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgdmlldy5vcGVuKCk7XG4gICAgICAgICAgICB2aWV3LnRvZ2dsZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZpZXcudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMub25EaWREYkNsaWNrKChlKSA9PiB7XG4gICAgICBjb25zdCBzZWxmID0gZS5jdXJyZW50VGFyZ2V0O1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgY29uc3QgdmlldyA9ICQoc2VsZikudmlldygpO1xuXG4gICAgICBpZiAoIXZpZXcpIHJldHVybjtcblxuICAgICAgdmlldy5vcGVuKCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgYWN0aW9uUmVtb3RlTW92ZShlLCBkYXRhVHJhbnNmZXIpIHtcbiAgICBjb25zdCBmdHAgPSBhdG9tLnByb2plY3QucmVtb3RlZnRwTWFpbjtcbiAgICBjb25zdCBwYXRoSW5mb3MgPSBKU09OLnBhcnNlKGRhdGFUcmFuc2Zlci5nZXREYXRhKCdwYXRoSW5mb3MnKSk7XG4gICAgY29uc3QgbmV3UGF0aEluZm8gPSBEaXJlY3RvcnlWaWV3LnF1ZXJ5RGF0YVBhdGgoZS5jdXJyZW50VGFyZ2V0KTtcbiAgICBjb25zdCBkZXN0UGF0aCA9IHBhdGgucG9zaXguam9pbihuZXdQYXRoSW5mbywgcGF0aEluZm9zLm5hbWUpO1xuXG4gICAgaWYgKHBhdGhJbmZvcy5mdWxsUGF0aCA9PT0gJy8nIHx8IHBhdGhJbmZvcy5mdWxsUGF0aCA9PT0gZGVzdFBhdGgpIHJldHVybjtcblxuICAgIGZ0cC5jbGllbnQucmVuYW1lKHBhdGhJbmZvcy5mdWxsUGF0aCwgZGVzdFBhdGgsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBhY3Rpb25Ub1JlbW90ZShlLCBkYXRhVHJhbnNmZXIpIHtcbiAgICBjb25zdCBuZXdQYXRoSW5mbyA9IERpcmVjdG9yeVZpZXcucXVlcnlEYXRhUGF0aChlLmN1cnJlbnRUYXJnZXQpO1xuICAgIGNvbnN0IGxvY2FsUGF0aHMgPSBKU09OLnBhcnNlKGRhdGFUcmFuc2Zlci5nZXREYXRhKCdsb2NhbFBhdGhzJykpO1xuICAgIGNvbnN0IGRlc3RQYXRoID0gcGF0aC5wb3NpeC5qb2luKG5ld1BhdGhJbmZvLCBsb2NhbFBhdGhzLm5hbWUpO1xuXG4gICAgYXRvbS5wcm9qZWN0LnJlbW90ZWZ0cE1haW4uY2xpZW50LnVwbG9hZFRvKGxvY2FsUGF0aHMuZnVsbFBhdGgsIGRlc3RQYXRoLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcXVlcnlEYXRhUGF0aCh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ3NwYW5bZGF0YS1wYXRoXScpLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XG4gIH1cblxuICBkcmFnRXZlbnRzQWN0aXZhdGUoKSB7XG4gICAgdGhpcy5vbignZHJvcCcsIGUgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2Ryb3AnLCBlKSk7XG4gICAgdGhpcy5vbignZHJhZ3N0YXJ0JywgZSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZHJhZ3N0YXJ0JywgZSkpO1xuICAgIHRoaXMub24oJ2RyYWdvdmVyJywgZSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZHJhZ292ZXInLCBlKSk7XG4gICAgdGhpcy5vbignZHJhZ2VudGVyJywgZSA9PiB0aGlzLmVtaXR0ZXIuZW1pdCgnZHJhZ2VudGVyJywgZSkpO1xuICAgIHRoaXMub24oJ2RyYWdsZWF2ZScsIGUgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RyYWdsZWF2ZScsIGUpKTtcblxuICAgIHRoaXMub25EaWREcm9wKChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBlLmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcblxuICAgICAgaWYgKCFjaGVja1RhcmdldChlKSkgcmV0dXJuO1xuICAgICAgaWYgKHRoaXMubW92ZVRhcmdldCA9PT0gZS5jdXJyZW50VGFyZ2V0KSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRhdGFUcmFuc2ZlciA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXI7XG5cbiAgICAgIGlmIChkYXRhVHJhbnNmZXIuZ2V0RGF0YSgncGF0aEluZm9zJykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIERpcmVjdG9yeVZpZXcuYWN0aW9uUmVtb3RlTW92ZShlLCBkYXRhVHJhbnNmZXIpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhVHJhbnNmZXIuZ2V0RGF0YSgnbG9jYWxQYXRocycpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBEaXJlY3RvcnlWaWV3LmFjdGlvblRvUmVtb3RlKGUsIGRhdGFUcmFuc2Zlcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92ZVRhcmdldCA9IG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uRGlkRHJhZ1N0YXJ0KChlKSA9PiB7XG4gICAgICB0aGlzLm1vdmVUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICAgIGNvbnN0IHRhcmdldCA9ICQoZS50YXJnZXQpLmZpbmQoJy5uYW1lJyk7XG4gICAgICBjb25zdCBkYXRhVHJhbnNmZXIgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyO1xuICAgICAgY29uc3QgcGF0aEluZm9zID0ge1xuICAgICAgICBmdWxsUGF0aDogdGFyZ2V0LmRhdGEoJ3BhdGgnKSxcbiAgICAgICAgbmFtZTogdGFyZ2V0LmRhdGEoJ25hbWUnKSxcbiAgICAgIH07XG5cbiAgICAgIGRhdGFUcmFuc2Zlci5zZXREYXRhKCdwYXRoSW5mb3MnLCBKU09OLnN0cmluZ2lmeShwYXRoSW5mb3MpKTtcbiAgICAgIGRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbkRpZERyYWdPdmVyKChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbkRpZERyYWdFbnRlcigoZSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZiA9IGUuY3VycmVudFRhcmdldDtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmICghY2hlY2tUYXJnZXQoZSkpIHJldHVybjtcblxuICAgICAgc2VsZi5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbkRpZERyYWdMZWF2ZSgoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgZS5jdXJyZW50VGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICBkcmFnRXZlbnRzRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNEcmFncy5kaXNwb3NlKCk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJzRHJhZ3MuZGlzcG9zZSgpO1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuaXRlbSA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5pY29uRGlzcG9zYWJsZSkge1xuICAgICAgdGhpcy5pY29uRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmljb25EaXNwb3NhYmxlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnJlbW92ZSgpO1xuICB9XG5cbiAgZ2V0Vmlld3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50cmllcy5jaGlsZHJlbigpLm1hcCgoZXJyLCBpdGVtKSA9PiAkKGl0ZW0pLnZpZXcoKSkuZ2V0KCk7XG4gIH1cblxuICBnZXRJdGVtVmlld3MoaXRlbVZpZXdzKSB7XG4gICAgY29uc3Qgdmlld3MgPSB0aGlzLmdldFZpZXdzKCkgfHwgaXRlbVZpZXdzO1xuICAgIGNvbnN0IGVudHJpZXMgPSB7XG4gICAgICBmb2xkZXJzOiBbXSxcbiAgICAgIGZpbGVzOiBbXSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuaXRlbSkge1xuICAgICAgdGhpcy5pdGVtLmZvbGRlcnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBmb3IgKGxldCBhID0gMCwgYiA9IHZpZXdzLmxlbmd0aDsgYSA8IGI7ICsrYSkge1xuICAgICAgICAgIGlmICh2aWV3c1thXSAmJiB2aWV3c1thXSBpbnN0YW5jZW9mIERpcmVjdG9yeVZpZXcgJiYgdmlld3NbYV0uaXRlbSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgZW50cmllcy5mb2xkZXJzLnB1c2godmlld3NbYV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbnRyaWVzLmZvbGRlcnMucHVzaChuZXcgRGlyZWN0b3J5VmlldyhpdGVtKSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pdGVtLmZpbGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgZm9yIChsZXQgYSA9IDAsIGIgPSB2aWV3cy5sZW5ndGg7IGEgPCBiOyArK2EpIHtcbiAgICAgICAgICBpZiAodmlld3NbYV0gJiYgdmlld3NbYV0gaW5zdGFuY2VvZiBGaWxlVmlldyAmJiB2aWV3c1thXS5pdGVtID09PSBpdGVtKSB7XG4gICAgICAgICAgICBlbnRyaWVzLmZpbGVzLnB1c2godmlld3NbYV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbnRyaWVzLmZpbGVzLnB1c2gobmV3IEZpbGVWaWV3KGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbnRyaWVzO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICBsZXQgdmlld3MgPSB0aGlzLmdldFZpZXdzKCk7XG5cbiAgICB0aGlzLmVudHJpZXMuY2hpbGRyZW4oKS5kZXRhY2goKTtcblxuICAgIGNvbnN0IGVudHJpZXMgPSB0aGlzLmdldEl0ZW1WaWV3cygpO1xuXG4gICAgLy8gVE9ETyBEZXN0cm95IGxlZnQgb3Zlci4uLlxuICAgIHZpZXdzID0gZW50cmllcy5mb2xkZXJzLmNvbmNhdChlbnRyaWVzLmZpbGVzKTtcblxuICAgIHZpZXdzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmNvbnN0cnVjdG9yICE9PSBiLmNvbnN0cnVjdG9yKSB7IHJldHVybiBhIGluc3RhbmNlb2YgRGlyZWN0b3J5VmlldyA/IC0xIDogMTsgfVxuICAgICAgaWYgKGEuaXRlbS5uYW1lID09PSBiLml0ZW0ubmFtZSkgeyByZXR1cm4gMDsgfVxuXG4gICAgICByZXR1cm4gYS5pdGVtLm5hbWUudG9Mb3dlckNhc2UoKS5sb2NhbGVDb21wYXJlKGIuaXRlbS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgIH0pO1xuXG4gICAgdmlld3MuZm9yRWFjaCgodmlldykgPT4ge1xuICAgICAgdGhpcy5lbnRyaWVzLmFwcGVuZCh2aWV3KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldENsYXNzZXMoKSB7XG4gICAgaWYgKHRoaXMuaXRlbS5pc0V4cGFuZGVkKSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdleHBhbmRlZCcpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRDbGFzcygnY29sbGFwc2VkJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kKHJlY3Vyc2l2ZSkge1xuICAgIHRoaXMuaXRlbS5zZXRJc0V4cGFuZGVkID0gdHJ1ZTtcblxuICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgIHRoaXMuZW50cmllcy5jaGlsZHJlbigpLmVhY2goKGUsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgdmlldyA9ICQoaXRlbSkudmlldygpO1xuICAgICAgICBpZiAodmlldyAmJiB2aWV3IGluc3RhbmNlb2YgRGlyZWN0b3J5VmlldykgeyB2aWV3LmV4cGFuZCh0cnVlKTsgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29sbGFwc2UocmVjdXJzaXZlKSB7XG4gICAgdGhpcy5pdGVtLnNldElzRXhwYW5kZWQgPSBmYWxzZTtcblxuICAgIGlmIChyZWN1cnNpdmUpIHtcbiAgICAgIHRoaXMuZW50cmllcy5jaGlsZHJlbigpLmVhY2goKGUsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgdmlldyA9ICQoaXRlbSkudmlldygpO1xuICAgICAgICBpZiAodmlldyAmJiB2aWV3IGluc3RhbmNlb2YgRGlyZWN0b3J5VmlldykgeyB2aWV3LmNvbGxhcHNlKHRydWUpOyB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGUocmVjdXJzaXZlKSB7XG4gICAgaWYgKHRoaXMuaXRlbS5pc0V4cGFuZGVkKSB7XG4gICAgICB0aGlzLmNvbGxhcHNlKHJlY3Vyc2l2ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhwYW5kKHJlY3Vyc2l2ZSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbigpIHtcbiAgICB0aGlzLml0ZW0ub3BlbigpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLml0ZW0ub3BlbigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpcmVjdG9yeVZpZXc7XG4iXX0=