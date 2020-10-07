var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var ReferenceView = (function (_TernView) {
  _inherits(ReferenceView, _TernView);

  function ReferenceView() {
    _classCallCheck(this, ReferenceView);

    _get(Object.getPrototypeOf(ReferenceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReferenceView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      var container = document.createElement('div');

      this.content = document.createElement('div');
      this.closeButton = document.createElement('button');

      this.classList.add('atom-ternjs-reference');
      this.closeButton.classList.add('btn', 'atom-ternjs-reference-close');
      this.closeButton.innerHTML = 'Close';

      container.appendChild(this.closeButton);
      container.appendChild(this.content);

      this.closeButton.addEventListener('click', function (e) {
        return _atomTernjsEvents2['default'].emit('reference-hide');
      });

      this.appendChild(container);
    }
  }, {
    key: 'clickHandle',
    value: function clickHandle(i) {

      this.getModel().goToReference(i);
    }
  }, {
    key: 'buildItems',
    value: function buildItems(data) {

      var headline = document.createElement('h2');
      var list = document.createElement('ul');
      var i = 0;

      this.content.innerHTML = '';
      headline.innerHTML = data.name + ' (' + data.type + ')';
      this.content.appendChild(headline);

      for (var item of data.refs) {

        var li = document.createElement('li');
        var lineText = (0, _atomTernjsHelper.replaceTags)(item.lineText);
        lineText = lineText.replace(data.name, '<strong>' + data.name + '</strong>');

        li.innerHTML = '\n        <h3>\n          <span>\n            <span class="darken">\n              (' + (item.position.row + 1) + ':' + item.position.column + '):\n            </span>\n            <span> ' + lineText + '</span>\n          </span>\n          <span class="darken"> (' + item.file + ')</span>\n          <div class="clear"></div>\n        </h3>\n      ';

        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);

        i++;
      }

      this.content.appendChild(list);
    }
  }]);

  return ReferenceView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-reference', {

  prototype: ReferenceView.prototype
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztnQ0FFMEIsc0JBQXNCOztnQ0FDNUIsc0JBQXNCOzs7OzhCQUNyQixvQkFBb0I7Ozs7QUFKekMsV0FBVyxDQUFDOztJQU1OLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FFRiwyQkFBRzs7QUFFaEIsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEQsVUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLDZCQUE2QixDQUFDLENBQUM7QUFDckUsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDOztBQUVyQyxlQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4QyxlQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDO2VBQUssOEJBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUVsRixVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzdCOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7O0FBRWIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQzs7O1dBRVMsb0JBQUMsSUFBSSxFQUFFOztBQUVmLFVBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsVUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRVYsVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzVCLGNBQVEsQ0FBQyxTQUFTLEdBQU0sSUFBSSxDQUFDLElBQUksVUFBSyxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUM7QUFDbkQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRW5DLFdBQUssSUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTs7QUFFNUIsWUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxZQUFJLFFBQVEsR0FBRyxtQ0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsZ0JBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWEsSUFBSSxDQUFDLElBQUksZUFBWSxDQUFDOztBQUV4RSxVQUFFLENBQUMsU0FBUyw2RkFJRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUEsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sb0RBRXpDLFFBQVEscUVBRU0sSUFBSSxDQUFDLElBQUkseUVBR3JDLENBQUM7O0FBRUYsVUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsWUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFckIsU0FBQyxFQUFFLENBQUM7T0FDTDs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQzs7O1NBOURHLGFBQWE7OztBQWlFbkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFOztBQUVqRSxXQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7Q0FDbkMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtyZXBsYWNlVGFnc30gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5cbmNsYXNzIFJlZmVyZW5jZVZpZXcgZXh0ZW5kcyBUZXJuVmlldyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlZmVyZW5jZScpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnYnRuJywgJ2F0b20tdGVybmpzLXJlZmVyZW5jZS1jbG9zZScpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gJ0Nsb3NlJztcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcblxuICAgIHRoaXMuY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpKTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuXG4gIGNsaWNrSGFuZGxlKGkpIHtcblxuICAgIHRoaXMuZ2V0TW9kZWwoKS5nb1RvUmVmZXJlbmNlKGkpO1xuICB9XG5cbiAgYnVpbGRJdGVtcyhkYXRhKSB7XG5cbiAgICBsZXQgaGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIGxldCBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICB0aGlzLmNvbnRlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgaGVhZGxpbmUuaW5uZXJIVE1MID0gYCR7ZGF0YS5uYW1lfSAoJHtkYXRhLnR5cGV9KWA7XG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGhlYWRsaW5lKTtcblxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBkYXRhLnJlZnMpIHtcblxuICAgICAgbGV0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGxldCBsaW5lVGV4dCA9IHJlcGxhY2VUYWdzKGl0ZW0ubGluZVRleHQpO1xuICAgICAgbGluZVRleHQgPSBsaW5lVGV4dC5yZXBsYWNlKGRhdGEubmFtZSwgYDxzdHJvbmc+JHtkYXRhLm5hbWV9PC9zdHJvbmc+YCk7XG5cbiAgICAgIGxpLmlubmVySFRNTCA9IGBcbiAgICAgICAgPGgzPlxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXJrZW5cIj5cbiAgICAgICAgICAgICAgKCR7aXRlbS5wb3NpdGlvbi5yb3cgKyAxfToke2l0ZW0ucG9zaXRpb24uY29sdW1ufSk6XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj4gJHtsaW5lVGV4dH08L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGFya2VuXCI+ICgke2l0ZW0uZmlsZX0pPC9zcGFuPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbGVhclwiPjwvZGl2PlxuICAgICAgICA8L2gzPlxuICAgICAgYDtcblxuICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrSGFuZGxlLmJpbmQodGhpcywgaSksIGZhbHNlKTtcbiAgICAgIGxpc3QuYXBwZW5kQ2hpbGQobGkpO1xuXG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKGxpc3QpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1yZWZlcmVuY2UnLCB7XG5cbiAgcHJvdG90eXBlOiBSZWZlcmVuY2VWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=