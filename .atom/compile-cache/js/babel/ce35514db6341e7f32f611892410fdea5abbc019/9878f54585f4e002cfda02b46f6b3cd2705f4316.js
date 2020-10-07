Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var SelectListView = undefined;

var ToggleProviders = (function () {
  function ToggleProviders(action, providers) {
    var _this = this;

    _classCallCheck(this, ToggleProviders);

    this.action = action;
    this.emitter = new _atom.Emitter();
    this.providers = providers;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
  }

  _createClass(ToggleProviders, [{
    key: 'getItems',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (this.action === 'disable') {
        return this.providers.filter(function (name) {
          return !_this2.disabledProviders.includes(name);
        });
      }
      return this.disabledProviders;
    })
  }, {
    key: 'process',
    value: _asyncToGenerator(function* (name) {
      if (this.action === 'disable') {
        this.disabledProviders.push(name);
        this.emitter.emit('did-disable', name);
      } else {
        var index = this.disabledProviders.indexOf(name);
        if (index !== -1) {
          this.disabledProviders.splice(index, 1);
        }
      }
      atom.config.set('linter.disabledProviders', this.disabledProviders);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      if (!SelectListView) {
        SelectListView = require('atom-select-list');
      }
      var selectListView = new SelectListView({
        items: yield this.getItems(),
        emptyMessage: 'No matches found',
        elementForItem: function elementForItem(item) {
          var li = document.createElement('li');
          li.textContent = item;
          return li;
        },
        didConfirmSelection: function didConfirmSelection(item) {
          _this3.process(item)['catch'](function (e) {
            return console.error('[Linter] Unable to process toggle:', e);
          }).then(function () {
            return _this3.dispose();
          });
        },
        didCancelSelection: function didCancelSelection() {
          _this3.dispose();
        },
        didConfirmEmptySelection: function didConfirmEmptySelection() {
          _this3.dispose();
        }
      });
      var panel = atom.workspace.addModalPanel({ item: selectListView });

      selectListView.focus();
      this.subscriptions.add(new _atom.Disposable(function () {
        panel.destroy();
      }));
    })
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'onDidDisable',
    value: function onDidDisable(callback) {
      return this.emitter.on('did-disable', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return ToggleProviders;
})();

exports['default'] = ToggleProviders;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXlELE1BQU07O0FBRS9ELElBQUksY0FBYyxZQUFBLENBQUE7O0lBR1osZUFBZTtBQU9SLFdBUFAsZUFBZSxDQU9QLE1BQW9CLEVBQUUsU0FBd0IsRUFBRTs7OzBCQVB4RCxlQUFlOztBQVFqQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxVQUFBLGlCQUFpQixFQUFJO0FBQ25FLFlBQUssaUJBQWlCLEdBQUcsaUJBQWlCLENBQUE7S0FDM0MsQ0FBQyxDQUNILENBQUE7R0FDRjs7ZUFuQkcsZUFBZTs7NkJBb0JMLGFBQTJCOzs7QUFDdkMsVUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUM3QixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtpQkFBSSxDQUFDLE9BQUssaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztTQUFBLENBQUMsQ0FBQTtPQUM3RTtBQUNELGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO0tBQzlCOzs7NkJBQ1ksV0FBQyxJQUFZLEVBQWlCO0FBQ3pDLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFDN0IsWUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDdkMsTUFBTTtBQUNMLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbEQsWUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsY0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDeEM7T0FDRjtBQUNELFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0tBQ3BFOzs7NkJBQ1MsYUFBRzs7O0FBQ1gsVUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixzQkFBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO09BQzdDO0FBQ0QsVUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUM7QUFDeEMsYUFBSyxFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QixvQkFBWSxFQUFFLGtCQUFrQjtBQUNoQyxzQkFBYyxFQUFFLHdCQUFBLElBQUksRUFBSTtBQUN0QixjQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZDLFlBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO0FBQ0QsMkJBQW1CLEVBQUUsNkJBQUEsSUFBSSxFQUFJO0FBQzNCLGlCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FDVixDQUFDLFVBQUEsQ0FBQzttQkFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FDbEUsSUFBSSxDQUFDO21CQUFNLE9BQUssT0FBTyxFQUFFO1dBQUEsQ0FBQyxDQUFBO1NBQzlCO0FBQ0QsMEJBQWtCLEVBQUUsOEJBQU07QUFDeEIsaUJBQUssT0FBTyxFQUFFLENBQUE7U0FDZjtBQUNELGdDQUF3QixFQUFFLG9DQUFNO0FBQzlCLGlCQUFLLE9BQU8sRUFBRSxDQUFBO1NBQ2Y7T0FDRixDQUFDLENBQUE7QUFDRixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBOztBQUVwRSxvQkFBYyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixxQkFBZSxZQUFXO0FBQ3hCLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNoQixDQUFDLENBQ0gsQ0FBQTtLQUNGOzs7V0FDVyxzQkFBQyxRQUFtQixFQUFjO0FBQzVDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDVyxzQkFBQyxRQUErQixFQUFjO0FBQ3hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQWhGRyxlQUFlOzs7cUJBbUZOLGVBQWUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdG9nZ2xlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxubGV0IFNlbGVjdExpc3RWaWV3XG50eXBlIFRvZ2dsZUFjdGlvbiA9ICdlbmFibGUnIHwgJ2Rpc2FibGUnXG5cbmNsYXNzIFRvZ2dsZVByb3ZpZGVycyB7XG4gIGFjdGlvbjogVG9nZ2xlQWN0aW9uXG4gIGVtaXR0ZXI6IEVtaXR0ZXJcbiAgcHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZGlzYWJsZWRQcm92aWRlcnM6IEFycmF5PHN0cmluZz5cblxuICBjb25zdHJ1Y3RvcihhY3Rpb246IFRvZ2dsZUFjdGlvbiwgcHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgdGhpcy5hY3Rpb24gPSBhY3Rpb25cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5wcm92aWRlcnMgPSBwcm92aWRlcnNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJywgZGlzYWJsZWRQcm92aWRlcnMgPT4ge1xuICAgICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzID0gZGlzYWJsZWRQcm92aWRlcnNcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBhc3luYyBnZXRJdGVtcygpOiBQcm9taXNlPEFycmF5PHN0cmluZz4+IHtcbiAgICBpZiAodGhpcy5hY3Rpb24gPT09ICdkaXNhYmxlJykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmZpbHRlcihuYW1lID0+ICF0aGlzLmRpc2FibGVkUHJvdmlkZXJzLmluY2x1ZGVzKG5hbWUpKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZFByb3ZpZGVyc1xuICB9XG4gIGFzeW5jIHByb2Nlc3MobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuYWN0aW9uID09PSAnZGlzYWJsZScpIHtcbiAgICAgIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMucHVzaChuYW1lKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kaXNhYmxlJywgbmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmRpc2FibGVkUHJvdmlkZXJzLmluZGV4T2YobmFtZSlcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZFByb3ZpZGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICB9XG4gICAgfVxuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJywgdGhpcy5kaXNhYmxlZFByb3ZpZGVycylcbiAgfVxuICBhc3luYyBzaG93KCkge1xuICAgIGlmICghU2VsZWN0TGlzdFZpZXcpIHtcbiAgICAgIFNlbGVjdExpc3RWaWV3ID0gcmVxdWlyZSgnYXRvbS1zZWxlY3QtbGlzdCcpXG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zOiBhd2FpdCB0aGlzLmdldEl0ZW1zKCksXG4gICAgICBlbXB0eU1lc3NhZ2U6ICdObyBtYXRjaGVzIGZvdW5kJyxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiBpdGVtID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gaXRlbVxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiBpdGVtID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzKGl0ZW0pXG4gICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5lcnJvcignW0xpbnRlcl0gVW5hYmxlIHRvIHByb2Nlc3MgdG9nZ2xlOicsIGUpKVxuICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuZGlzcG9zZSgpKVxuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1FbXB0eVNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICAgfSxcbiAgICB9KVxuICAgIGNvbnN0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHNlbGVjdExpc3RWaWV3IH0pXG5cbiAgICBzZWxlY3RMaXN0Vmlldy5mb2N1cygpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICBwYW5lbC5kZXN0cm95KClcbiAgICAgIH0pLFxuICAgIClcbiAgfVxuICBvbkRpZERpc3Bvc2UoY2FsbGJhY2s6ICgpID0+IGFueSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kaXNwb3NlJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWREaXNhYmxlKGNhbGxiYWNrOiAobmFtZTogc3RyaW5nKSA9PiBhbnkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGlzYWJsZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kaXNwb3NlJylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9nZ2xlUHJvdmlkZXJzXG4iXX0=