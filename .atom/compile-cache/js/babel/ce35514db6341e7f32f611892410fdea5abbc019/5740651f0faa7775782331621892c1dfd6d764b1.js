'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var version = 0x003;

var RemoteStorage = (function () {
  function RemoteStorage(state) {
    _classCallCheck(this, RemoteStorage);

    this.data = state && state.version === version ? state : RemoteStorage.createBlankCache();
  }

  _createClass(RemoteStorage, [{
    key: 'version',
    get: function get() {
      return this.data.version;
    }
  }], [{
    key: 'createBlankCache',
    value: function createBlankCache() {
      return {
        options: {
          autosave: true,
          treeViewSide: 'left',
          treeViewShow: false
        },
        version: version
      };
    }
  }]);

  return RemoteStorage;
})();

exports['default'] = RemoteStorage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9yZW1vdGUtc3RvcmFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUM7O0lBRUQsYUFBYTtBQUNyQixXQURRLGFBQWEsQ0FDcEIsS0FBSyxFQUFFOzBCQURBLGFBQWE7O0FBRTlCLFFBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssT0FBTyxHQUFHLEtBQUssR0FBRyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUMzRjs7ZUFIa0IsYUFBYTs7U0FnQnJCLGVBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQzFCOzs7V0Fic0IsNEJBQUc7QUFDeEIsYUFBTztBQUNMLGVBQU8sRUFBRTtBQUNQLGtCQUFRLEVBQUUsSUFBSTtBQUNkLHNCQUFZLEVBQUUsTUFBTTtBQUNwQixzQkFBWSxFQUFFLEtBQUs7U0FDcEI7QUFDRCxlQUFPLEVBQVAsT0FBTztPQUNSLENBQUM7S0FDSDs7O1NBZGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9yZW1vdGUtc3RvcmFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCB2ZXJzaW9uID0gMHgwMDM7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZVN0b3JhZ2Uge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xuICAgIHRoaXMuZGF0YSA9IHN0YXRlICYmIHN0YXRlLnZlcnNpb24gPT09IHZlcnNpb24gPyBzdGF0ZSA6IFJlbW90ZVN0b3JhZ2UuY3JlYXRlQmxhbmtDYWNoZSgpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUJsYW5rQ2FjaGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYXV0b3NhdmU6IHRydWUsXG4gICAgICAgIHRyZWVWaWV3U2lkZTogJ2xlZnQnLFxuICAgICAgICB0cmVlVmlld1Nob3c6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHZlcnNpb24sXG4gICAgfTtcbiAgfVxuXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEudmVyc2lvbjtcbiAgfVxufVxuIl19