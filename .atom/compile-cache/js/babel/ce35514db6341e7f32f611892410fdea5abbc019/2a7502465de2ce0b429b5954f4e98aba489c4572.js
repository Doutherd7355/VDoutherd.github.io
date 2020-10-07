'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AtomJsCodeToSvgFlowchartView = (function () {
  function AtomJsCodeToSvgFlowchartView(serializedState) {
    _classCallCheck(this, AtomJsCodeToSvgFlowchartView);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-js-code-to-svg-to-preview');

    // Create message element
    var message = document.createElement('div');
    message.textContent = 'The AtomJsCodeToSvgFlowchart package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated

  _createClass(AtomJsCodeToSvgFlowchartView, [{
    key: 'serialize',
    value: function serialize() {}

    // Tear down any state and detach
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return AtomJsCodeToSvgFlowchartView;
})();

exports['default'] = AtomJsCodeToSvgFlowchartView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLWpzLWNvZGUtdG8tc3ZnLXRvLXByZXZpZXcvbGliL2F0b20tanMtY29kZS10by1zdmctdG8tcHJldmlldy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztJQUVTLDRCQUE0QjtBQUVwQyxXQUZRLDRCQUE0QixDQUVuQyxlQUFlLEVBQUU7MEJBRlYsNEJBQTRCOzs7QUFJN0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOzs7QUFHN0QsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxXQUFPLENBQUMsV0FBVyxHQUFHLDZEQUE2RCxDQUFDO0FBQ3BGLFdBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ25DOzs7O2VBWmtCLDRCQUE0Qjs7V0FldEMscUJBQUcsRUFBRTs7Ozs7V0FHUCxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdkI7OztXQUVTLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCOzs7U0F4QmtCLDRCQUE0Qjs7O3FCQUE1Qiw0QkFBNEIiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tanMtY29kZS10by1zdmctdG8tcHJldmlldy9saWIvYXRvbS1qcy1jb2RlLXRvLXN2Zy10by1wcmV2aWV3LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXRvbUpzQ29kZVRvU3ZnRmxvd2NoYXJ0VmlldyB7XG5cbiAgY29uc3RydWN0b3Ioc2VyaWFsaXplZFN0YXRlKSB7XG4gICAgLy8gQ3JlYXRlIHJvb3QgZWxlbWVudFxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWpzLWNvZGUtdG8tc3ZnLXRvLXByZXZpZXcnKTtcblxuICAgIC8vIENyZWF0ZSBtZXNzYWdlIGVsZW1lbnRcbiAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICdUaGUgQXRvbUpzQ29kZVRvU3ZnRmxvd2NoYXJ0IHBhY2thZ2UgaXMgQWxpdmUhIEl0XFwncyBBTElWRSEnO1xuICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHJldHJpZXZlZCB3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkXG4gIHNlcmlhbGl6ZSgpIHt9XG5cbiAgLy8gVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICB9XG5cbiAgZ2V0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9XG5cbn1cbiJdfQ==