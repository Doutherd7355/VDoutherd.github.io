Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _contextMenu = require('./contextMenu');

var _contextMenu2 = _interopRequireDefault(_contextMenu);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

'use babel';

exports['default'] = function () {
  var add = function add(_ref) {
    var location = _ref.location;
    var obj = _ref.obj;
    var _ref$target = _ref.target;
    var target = _ref$target === undefined ? false : _ref$target;

    var enabledCommands = Object.keys(obj).reduce(function (ret, key) {
      // key == command user types in or is called with context menu
      var _obj$key = obj[key];
      var enabled = _obj$key.enabled;
      var command = _obj$key.command;

      var object = Object.assign({}, ret);

      if (enabled === true) {
        object[key] = command;
      }

      return object;
    }, {});

    if (target === false) {
      atom[location].add(enabledCommands);
    } else {
      atom[location].add(target, enabledCommands);
    }
  };

  add({
    location: 'contextMenu',
    obj: (0, _contextMenu2['default'])()
  });

  add({
    location: 'commands',
    obj: (0, _commands2['default'])(),
    target: 'atom-workspace'
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9tZW51cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzsyQkFFd0IsZUFBZTs7Ozt3QkFDbEIsWUFBWTs7OztBQUhqQyxXQUFXLENBQUM7O3FCQUtHLFlBQU07QUFDbkIsTUFBTSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksSUFBaUMsRUFBSztRQUFwQyxRQUFRLEdBQVYsSUFBaUMsQ0FBL0IsUUFBUTtRQUFFLEdBQUcsR0FBZixJQUFpQyxDQUFyQixHQUFHO3NCQUFmLElBQWlDLENBQWhCLE1BQU07UUFBTixNQUFNLCtCQUFHLEtBQUs7O0FBQzFDLFFBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBSzs7cUJBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUM7VUFBN0IsT0FBTyxZQUFQLE9BQU87VUFBRSxPQUFPLFlBQVAsT0FBTzs7QUFDeEIsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXRDLFVBQUksT0FBTyxLQUFLLElBQUksRUFBRTtBQUNwQixjQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO09BQ3ZCOztBQUVELGFBQU8sTUFBTSxDQUFDO0tBQ2YsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFUCxRQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFDcEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNyQyxNQUFNO0FBQ0wsVUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDN0M7R0FDRixDQUFDOztBQUVGLEtBQUcsQ0FBQztBQUNGLFlBQVEsRUFBRSxhQUFhO0FBQ3ZCLE9BQUcsRUFBRSwrQkFBYTtHQUNuQixDQUFDLENBQUM7O0FBRUgsS0FBRyxDQUFDO0FBQ0YsWUFBUSxFQUFFLFVBQVU7QUFDcEIsT0FBRyxFQUFFLDRCQUFVO0FBQ2YsVUFBTSxFQUFFLGdCQUFnQjtHQUN6QixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvbWVudXMvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgY29udGV4dE1lbnUgZnJvbSAnLi9jb250ZXh0TWVudSc7XG5pbXBvcnQgY29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcbiAgY29uc3QgYWRkID0gKHsgbG9jYXRpb24sIG9iaiwgdGFyZ2V0ID0gZmFsc2UgfSkgPT4ge1xuICAgIGNvbnN0IGVuYWJsZWRDb21tYW5kcyA9IE9iamVjdC5rZXlzKG9iaikucmVkdWNlKChyZXQsIGtleSkgPT4geyAvLyBrZXkgPT0gY29tbWFuZCB1c2VyIHR5cGVzIGluIG9yIGlzIGNhbGxlZCB3aXRoIGNvbnRleHQgbWVudVxuICAgICAgY29uc3QgeyBlbmFibGVkLCBjb21tYW5kIH0gPSBvYmpba2V5XTtcbiAgICAgIGNvbnN0IG9iamVjdCA9IE9iamVjdC5hc3NpZ24oe30sIHJldCk7XG5cbiAgICAgIGlmIChlbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gY29tbWFuZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9LCB7fSk7XG5cbiAgICBpZiAodGFyZ2V0ID09PSBmYWxzZSkge1xuICAgICAgYXRvbVtsb2NhdGlvbl0uYWRkKGVuYWJsZWRDb21tYW5kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b21bbG9jYXRpb25dLmFkZCh0YXJnZXQsIGVuYWJsZWRDb21tYW5kcyk7XG4gICAgfVxuICB9O1xuXG4gIGFkZCh7XG4gICAgbG9jYXRpb246ICdjb250ZXh0TWVudScsXG4gICAgb2JqOiBjb250ZXh0TWVudSgpLFxuICB9KTtcblxuICBhZGQoe1xuICAgIGxvY2F0aW9uOiAnY29tbWFuZHMnLFxuICAgIG9iajogY29tbWFuZHMoKSxcbiAgICB0YXJnZXQ6ICdhdG9tLXdvcmtzcGFjZScsXG4gIH0pO1xufTtcbiJdfQ==