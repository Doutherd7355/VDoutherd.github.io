var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var DocumentationView = (function (_TernView) {
  _inherits(DocumentationView, _TernView);

  function DocumentationView() {
    _classCallCheck(this, DocumentationView);

    _get(Object.getPrototypeOf(DocumentationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocumentationView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.getModel();
      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');

      this.container.onmousewheel = function (e) {

        e.stopPropagation();
      };

      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      this.container.innerHTML = '\n\n      <h3>' + data.type + '</h3>\n      <p>' + data.doc + '</p>\n      <a href="' + data.url + '">' + data.url + '</p>\n    ';
    }
  }]);

  return DocumentationView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-documentation', {

  prototype: DocumentationView.prototype
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRXFCLG9CQUFvQjs7OztBQUZ6QyxXQUFXLENBQUM7O0lBSU4saUJBQWlCO1lBQWpCLGlCQUFpQjs7V0FBakIsaUJBQWlCOzBCQUFqQixpQkFBaUI7OytCQUFqQixpQkFBaUI7OztlQUFqQixpQkFBaUI7O1dBRU4sMkJBQUc7OztBQUVoQixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNOztBQUVuQyxjQUFLLFFBQVEsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BRWxDLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsVUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxVQUFDLENBQUMsRUFBSzs7QUFFbkMsU0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO09BQ3JCLENBQUM7O0FBRUYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDbEM7OztXQUVNLGlCQUFDLElBQUksRUFBRTs7QUFFWixVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsc0JBRWhCLElBQUksQ0FBQyxJQUFJLHdCQUNWLElBQUksQ0FBQyxHQUFHLDZCQUNGLElBQUksQ0FBQyxHQUFHLFVBQUssSUFBSSxDQUFDLEdBQUcsZUFDakMsQ0FBQztLQUNIOzs7U0E3QkcsaUJBQWlCOzs7QUFnQ3ZCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRTs7QUFFckUsV0FBUyxFQUFFLGlCQUFpQixDQUFDLFNBQVM7Q0FDdkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jbGFzcyBEb2N1bWVudGF0aW9uVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICB0aGlzLmdldE1vZGVsKCk7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuICAgICAgdGhpcy5nZXRNb2RlbCgpLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgdGhpcy5jb250YWluZXIub25tb3VzZXdoZWVsID0gKGUpID0+IHtcblxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gIH1cblxuICBzZXREYXRhKGRhdGEpIHtcblxuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGBcblxuICAgICAgPGgzPiR7ZGF0YS50eXBlfTwvaDM+XG4gICAgICA8cD4ke2RhdGEuZG9jfTwvcD5cbiAgICAgIDxhIGhyZWY9XCIke2RhdGEudXJsfVwiPiR7ZGF0YS51cmx9PC9wPlxuICAgIGA7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nLCB7XG5cbiAgcHJvdG90eXBlOiBEb2N1bWVudGF0aW9uVmlldy5wcm90b3R5cGVcbn0pO1xuIl19