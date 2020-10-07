Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

'use babel';

var Progress = (function (_EventEmitter) {
  _inherits(Progress, _EventEmitter);

  function Progress() {
    _classCallCheck(this, Progress);

    _get(Object.getPrototypeOf(Progress.prototype), 'constructor', this).call(this);

    this.progress = -1;
    this.start = 0;
  }

  _createClass(Progress, [{
    key: 'setProgress',
    value: function setProgress(res) {
      var progress = parseFloat(res) || -1;

      if (this.progress === -1 && progress > -1) {
        this.start = Date.now();
      }

      this.progress = progress;

      this.emit('progress', this.progress);

      if (this.progress === 1) this.emit('done');
    }
  }, {
    key: 'isDone',
    value: function isDone() {
      return this.progress >= 1;
    }
  }, {
    key: 'getEta',
    value: function getEta() {
      if (this.progress === -1) return Infinity;

      var elapse = Date.now() - this.start;
      var remaining = elapse * 1 / this.progress;

      return remaining - elapse;
    }
  }]);

  return Progress;
})(_events.EventEmitter);

exports['default'] = Progress;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9wcm9ncmVzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBRTZCLFFBQVE7O0FBRnJDLFdBQVcsQ0FBQzs7SUFJUyxRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLEdBQ2I7MEJBREssUUFBUTs7QUFFekIsK0JBRmlCLFFBQVEsNkNBRWpCOztBQUVSLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7R0FDaEI7O2VBTmtCLFFBQVE7O1dBUWhCLHFCQUFDLEdBQUcsRUFBRTtBQUNmLFVBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsVUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUN6QyxZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUM7OztXQUVLLGtCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztLQUFFOzs7V0FFakMsa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLEVBQUUsT0FBTyxRQUFRLENBQUM7O0FBRTFDLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3ZDLFVBQU0sU0FBUyxHQUFHLEFBQUMsTUFBTSxHQUFHLENBQUMsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDOztBQUUvQyxhQUFPLFNBQVMsR0FBRyxNQUFNLENBQUM7S0FDM0I7OztTQS9Ca0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL3Byb2dyZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyZXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3MgPSAtMTtcbiAgICB0aGlzLnN0YXJ0ID0gMDtcbiAgfVxuXG4gIHNldFByb2dyZXNzKHJlcykge1xuICAgIGNvbnN0IHByb2dyZXNzID0gcGFyc2VGbG9hdChyZXMpIHx8IC0xO1xuXG4gICAgaWYgKHRoaXMucHJvZ3Jlc3MgPT09IC0xICYmIHByb2dyZXNzID4gLTEpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcblxuICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCB0aGlzLnByb2dyZXNzKTtcblxuICAgIGlmICh0aGlzLnByb2dyZXNzID09PSAxKSB0aGlzLmVtaXQoJ2RvbmUnKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHsgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPj0gMTsgfVxuXG4gIGdldEV0YSgpIHtcbiAgICBpZiAodGhpcy5wcm9ncmVzcyA9PT0gLTEpIHJldHVybiBJbmZpbml0eTtcblxuICAgIGNvbnN0IGVsYXBzZSA9IERhdGUubm93KCkgLSB0aGlzLnN0YXJ0O1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IChlbGFwc2UgKiAxKSAvIHRoaXMucHJvZ3Jlc3M7XG5cbiAgICByZXR1cm4gcmVtYWluaW5nIC0gZWxhcHNlO1xuICB9XG59XG4iXX0=