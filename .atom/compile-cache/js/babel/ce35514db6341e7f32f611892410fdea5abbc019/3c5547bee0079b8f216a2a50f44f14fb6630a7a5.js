var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var RenameView = (function (_TernView) {
  _inherits(RenameView, _TernView);

  function RenameView() {
    _classCallCheck(this, RenameView);

    _get(Object.getPrototypeOf(RenameView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RenameView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      this.classList.add('atom-ternjs-rename');

      var container = document.createElement('div');
      var wrapper = document.createElement('div');

      var title = document.createElement('h1');
      title.innerHTML = 'Rename';

      var sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';

      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', this.rename.bind(this));

      var buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'rename';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('btn-default');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', this.rename.bind(this));

      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);

      this.appendChild(container);
    }
  }, {
    key: 'rename',
    value: function rename() {

      var text = this.nameEditor.getModel().getBuffer().getText();

      if (!text) {

        return;
      }

      this.model.updateAllAndRename(text);
    }
  }]);

  return RenameView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-rename', {

  prototype: RenameView.prototype
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFcUIsb0JBQW9COzs7O0FBRnpDLFdBQVcsQ0FBQzs7SUFJTixVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBRUMsMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRXpDLFVBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFOUMsVUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxXQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQzs7QUFFM0IsVUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxTQUFHLENBQUMsU0FBUyxHQUFHLHdEQUF3RCxDQUFDOztBQUV6RSxVQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFekUsVUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRCxrQkFBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDbEMsa0JBQVksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDO0FBQzNCLGtCQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGtCQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsYUFBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixhQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxhQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLGVBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDN0I7OztXQUVLLGtCQUFHOztBQUVQLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRTlELFVBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRVQsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckM7OztTQTlDRyxVQUFVOzs7QUFpRGhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRTs7QUFFOUQsV0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO0NBQ2hDLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jbGFzcyBSZW5hbWVWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVuYW1lJyk7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlLmlubmVySFRNTCA9ICdSZW5hbWUnO1xuXG4gICAgbGV0IHN1YiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgc3ViLmlubmVySFRNTCA9ICdSZW5hbWUgYSB2YXJpYWJsZSBpbiBhIHNjb3BlLWF3YXJlIHdheS4gKGV4cGVyaW1lbnRhbCknO1xuXG4gICAgdGhpcy5uYW1lRWRpdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvcicpO1xuICAgIHRoaXMubmFtZUVkaXRvci5zZXRBdHRyaWJ1dGUoJ21pbmknLCB0cnVlKTtcbiAgICB0aGlzLm5hbWVFZGl0b3IuYWRkRXZlbnRMaXN0ZW5lcignY29yZTpjb25maXJtJywgdGhpcy5yZW5hbWUuYmluZCh0aGlzKSk7XG5cbiAgICBsZXQgYnV0dG9uUmVuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uUmVuYW1lLmlubmVySFRNTCA9ICdSZW5hbWUnO1xuICAgIGJ1dHRvblJlbmFtZS5pZCA9ICdyZW5hbWUnO1xuICAgIGJ1dHRvblJlbmFtZS5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b25SZW5hbWUuY2xhc3NMaXN0LmFkZCgnYnRuLWRlZmF1bHQnKTtcbiAgICBidXR0b25SZW5hbWUuY2xhc3NMaXN0LmFkZCgnbXQnKTtcbiAgICBidXR0b25SZW5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnJlbmFtZS5iaW5kKHRoaXMpKTtcblxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ViKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubmFtZUVkaXRvcik7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChidXR0b25SZW5hbWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbmFtZSgpIHtcblxuICAgIGNvbnN0IHRleHQgPSB0aGlzLm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5nZXRUZXh0KCk7XG5cbiAgICBpZiAoIXRleHQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubW9kZWwudXBkYXRlQWxsQW5kUmVuYW1lKHRleHQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1yZW5hbWUnLCB7XG5cbiAgcHJvdG90eXBlOiBSZW5hbWVWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=