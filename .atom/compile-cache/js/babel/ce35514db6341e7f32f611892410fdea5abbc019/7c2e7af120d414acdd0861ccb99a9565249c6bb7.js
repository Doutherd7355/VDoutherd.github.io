Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

// Internal variables
var instance = undefined;

exports['default'] = {
  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();

    instance = new _main2['default']();
    this.subscriptions.add(instance);

    this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter', true);
      }
    }));
  },
  consumeLinter: function consumeLinter(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      instance.addLinter(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeUI: function consumeUI(ui) {
    var uis = [].concat(ui);
    for (var entry of uis) {
      instance.addUI(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of uis) {
        instance.deleteUI(entry);
      }
    });
  },
  provideIndie: function provideIndie() {
    return function (indie) {
      return instance.addIndie(indie);
    };
  },
  deactivate: function deactivate() {
    this.subscriptions.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFZ0QsTUFBTTs7b0JBRW5DLFFBQVE7Ozs7O0FBSTNCLElBQUksUUFBUSxZQUFBLENBQUE7O3FCQUVHO0FBQ2IsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsWUFBUSxHQUFHLHVCQUFZLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRWhDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLFlBQVc7QUFDcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtBQUN0QixlQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3JEO0tBQ0YsQ0FBQyxDQUNILENBQUE7R0FDRjtBQUNELGVBQWEsRUFBQSx1QkFBQyxNQUFzQixFQUFjO0FBQ2hELFFBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakMsU0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMxQjtBQUNELFdBQU8scUJBQWUsWUFBTTtBQUMxQixXQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixnQkFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM3QjtLQUNGLENBQUMsQ0FBQTtHQUNIO0FBQ0QsV0FBUyxFQUFBLG1CQUFDLEVBQU0sRUFBYztBQUM1QixRQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pCLFNBQUssSUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQ3ZCLGNBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEI7QUFDRCxXQUFPLHFCQUFlLFlBQU07QUFDMUIsV0FBSyxJQUFNLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDdkIsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDekI7S0FDRixDQUFDLENBQUE7R0FDSDtBQUNELGNBQVksRUFBQSx3QkFBVztBQUNyQixXQUFPLFVBQUEsS0FBSzthQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0tBQUEsQ0FBQTtHQUN6QztBQUNELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDN0I7Q0FDRiIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgTGludGVyIGZyb20gJy4vbWFpbidcbmltcG9ydCB0eXBlIHsgVUksIExpbnRlciBhcyBMaW50ZXJQcm92aWRlciB9IGZyb20gJy4vdHlwZXMnXG5cbi8vIEludGVybmFsIHZhcmlhYmxlc1xubGV0IGluc3RhbmNlXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgaW5zdGFuY2UgPSBuZXcgTGludGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGluc3RhbmNlKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyhmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyJywgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICB9LFxuICBjb25zdW1lTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCBsaW50ZXJzID0gW10uY29uY2F0KGxpbnRlcilcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgIGluc3RhbmNlLmFkZExpbnRlcihlbnRyeSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVMaW50ZXIoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZVVJKHVpOiBVSSk6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IHVpcyA9IFtdLmNvbmNhdCh1aSlcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgaW5zdGFuY2UuYWRkVUkoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVVSShlbnRyeSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBwcm92aWRlSW5kaWUoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gaW5kaWUgPT4gaW5zdGFuY2UuYWRkSW5kaWUoaW5kaWUpXG4gIH0sXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9LFxufVxuIl19