Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atomTernjsHelper = require('../atom-ternjs-helper');

'use babel';

var index = 0;
var checkpoints = [];

function set(data) {

  checkpoints.length = 0;

  var editor = atom.workspace.getActiveTextEditor();
  var buffer = editor.getBuffer();
  var cursor = editor.getLastCursor();

  if (!cursor) {

    return false;
  }

  var marker = buffer.markPosition(cursor.getBufferPosition(), {});

  add(editor, marker);

  return true;
}

function append(editor, buffer, position) {

  var marker = buffer.markPosition(position, {});

  add(editor, marker);
}

function add(editor, marker) {

  index = checkpoints.push({

    marker: marker,
    editor: editor

  }) - 1;
}

function goTo(value) {

  var checkpoint = checkpoints[index + value];

  if (!checkpoint) {

    return;
  }

  index += value;

  (0, _atomTernjsHelper.openFileAndGoToPosition)(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
}

function reset() {

  index = 0;
  checkpoints = [];
}

exports['default'] = {

  set: set,
  append: append,
  goTo: goTo,
  reset: reset
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvc2VydmljZXMvbmF2aWdhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O2dDQUlPLHVCQUF1Qjs7QUFKOUIsV0FBVyxDQUFDOztBQU1aLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNkLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsU0FBUyxHQUFHLENBQUMsSUFBSSxFQUFFOztBQUVqQixhQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3BELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNsQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXRDLE1BQUksQ0FBQyxNQUFNLEVBQUU7O0FBRVgsV0FBTyxLQUFLLENBQUM7R0FDZDs7QUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVuRSxLQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVwQixTQUFPLElBQUksQ0FBQztDQUNiOztBQUVELFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFOztBQUV4QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFakQsS0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztDQUNyQjs7QUFFRCxTQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFOztBQUUzQixPQUFLLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQzs7QUFFdkIsVUFBTSxFQUFFLE1BQU07QUFDZCxVQUFNLEVBQUUsTUFBTTs7R0FFZixDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ1I7O0FBRUQsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFOztBQUVuQixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxNQUFJLENBQUMsVUFBVSxFQUFFOztBQUVmLFdBQU87R0FDUjs7QUFFRCxPQUFLLElBQUksS0FBSyxDQUFDOztBQUVmLGlEQUF3QixVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Q0FDekY7O0FBRUQsU0FBUyxLQUFLLEdBQUc7O0FBRWYsT0FBSyxHQUFHLENBQUMsQ0FBQztBQUNWLGFBQVcsR0FBRyxFQUFFLENBQUM7Q0FDbEI7O3FCQUVjOztBQUViLEtBQUcsRUFBSCxHQUFHO0FBQ0gsUUFBTSxFQUFOLE1BQU07QUFDTixNQUFJLEVBQUosSUFBSTtBQUNKLE9BQUssRUFBTCxLQUFLO0NBQ04iLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7XG4gIG9wZW5GaWxlQW5kR29Ub1Bvc2l0aW9uXG59IGZyb20gJy4uL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmxldCBpbmRleCA9IDA7XG5sZXQgY2hlY2twb2ludHMgPSBbXTtcblxuZnVuY3Rpb24gc2V0KGRhdGEpIHtcblxuICBjaGVja3BvaW50cy5sZW5ndGggPSAwO1xuXG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gIGlmICghY3Vyc29yKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBtYXJrZXIgPSBidWZmZXIubWFya1Bvc2l0aW9uKGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCB7fSk7XG5cbiAgYWRkKGVkaXRvciwgbWFya2VyKTtcblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKGVkaXRvciwgYnVmZmVyLCBwb3NpdGlvbikge1xuXG4gIGNvbnN0IG1hcmtlciA9IGJ1ZmZlci5tYXJrUG9zaXRpb24ocG9zaXRpb24sIHt9KTtcblxuICBhZGQoZWRpdG9yLCBtYXJrZXIpO1xufVxuXG5mdW5jdGlvbiBhZGQoZWRpdG9yLCBtYXJrZXIpIHtcblxuICBpbmRleCA9IGNoZWNrcG9pbnRzLnB1c2goe1xuXG4gICAgbWFya2VyOiBtYXJrZXIsXG4gICAgZWRpdG9yOiBlZGl0b3JcblxuICB9KSAtIDE7XG59XG5cbmZ1bmN0aW9uIGdvVG8odmFsdWUpIHtcblxuICBjb25zdCBjaGVja3BvaW50ID0gY2hlY2twb2ludHNbaW5kZXggKyB2YWx1ZV07XG5cbiAgaWYgKCFjaGVja3BvaW50KSB7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBpbmRleCArPSB2YWx1ZTtcblxuICBvcGVuRmlsZUFuZEdvVG9Qb3NpdGlvbihjaGVja3BvaW50Lm1hcmtlci5nZXRSYW5nZSgpLnN0YXJ0LCBjaGVja3BvaW50LmVkaXRvci5nZXRVUkkoKSk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0KCkge1xuXG4gIGluZGV4ID0gMDtcbiAgY2hlY2twb2ludHMgPSBbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHNldCxcbiAgYXBwZW5kLFxuICBnb1RvLFxuICByZXNldFxufTtcbiJdfQ==