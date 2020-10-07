var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var TypeView = (function (_TernView) {
  _inherits(TypeView, _TernView);

  function TypeView() {
    _classCallCheck(this, TypeView);

    _get(Object.getPrototypeOf(TypeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TypeView, [{
    key: 'initialize',
    value: function initialize(model) {

      _get(Object.getPrototypeOf(TypeView.prototype), 'initialize', this).call(this, model);

      this.addEventListener('click', model.destroyOverlay);
    }
  }, {
    key: 'setData',
    value: function setData(type, documentation) {

      this.innerHTML = documentation ? type + '<br /><br />' + documentation : '' + type;
    }
  }]);

  return TypeView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-type', {

  prototype: TypeView.prototype
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRXFCLG9CQUFvQjs7OztBQUZ6QyxXQUFXLENBQUM7O0lBSU4sUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROzsrQkFBUixRQUFROzs7ZUFBUixRQUFROztXQUVGLG9CQUFDLEtBQUssRUFBRTs7QUFFaEIsaUNBSkUsUUFBUSw0Q0FJTyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ3REOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFOztBQUUzQixVQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsR0FBTSxJQUFJLG9CQUFlLGFBQWEsUUFBUSxJQUFJLEFBQUUsQ0FBQztLQUNwRjs7O1NBWkcsUUFBUTs7O0FBZWQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFOztBQUU1RCxXQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7Q0FDOUIsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jbGFzcyBUeXBlVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBpbml0aWFsaXplKG1vZGVsKSB7XG5cbiAgICBzdXBlci5pbml0aWFsaXplKG1vZGVsKTtcblxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtb2RlbC5kZXN0cm95T3ZlcmxheSk7XG4gIH1cblxuICBzZXREYXRhKHR5cGUsIGRvY3VtZW50YXRpb24pIHtcblxuICAgIHRoaXMuaW5uZXJIVE1MID0gZG9jdW1lbnRhdGlvbiA/IGAke3R5cGV9PGJyIC8+PGJyIC8+JHtkb2N1bWVudGF0aW9ufWAgOiBgJHt0eXBlfWA7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLXR5cGUnLCB7XG5cbiAgcHJvdG90eXBlOiBUeXBlVmlldy5wcm90b3R5cGVcbn0pO1xuIl19