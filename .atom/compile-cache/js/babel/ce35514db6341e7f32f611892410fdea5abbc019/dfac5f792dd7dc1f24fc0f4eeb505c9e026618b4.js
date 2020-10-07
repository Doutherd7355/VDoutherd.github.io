Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atomJsCodeToSvgToPreviewView = require("./atom-js-code-to-svg-to-preview-view");

var _atomJsCodeToSvgToPreviewView2 = _interopRequireDefault(_atomJsCodeToSvgToPreviewView);

var _atom = require("atom");

var _js2flowchart = require("js2flowchart");

var js2flowchart = _interopRequireWildcard(_js2flowchart);

"use babel";

exports["default"] = {

  activate: function activate(state) {
    var _this = this;

    require("atom-package-deps").install("atom-js-code-to-svg-to-preview").then(function () {
      console.log('All dependencies installed, good to go');
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add("atom-workspace", {
      "atom-js-code-to-svg-to-preview:toggle": function atomJsCodeToSvgToPreviewToggle() {
        return _this.toggle();
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  toggle: function toggle() {
    var editor = undefined;
    if (editor = atom.workspace.getActiveTextEditor()) {
      (function () {
        var selection = editor.getSelectedText();

        var svg = js2flowchart.convertCodeToSvg(selection);

        atom.workspace.open("selection.svg", { split: "right" }).then(function (editor) {
          editor.insertText(svg);
          atom.commands.dispatch(atom.workspace.getActivePane().element, "svg-preview:toggle");
        })["catch"](function (err) {
          return console.log(err);
        });
      })();
    }
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLWpzLWNvZGUtdG8tc3ZnLXRvLXByZXZpZXcvbGliL2F0b20tanMtY29kZS10by1zdmctdG8tcHJldmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs0Q0FFeUMsdUNBQXVDOzs7O29CQUM1QyxNQUFNOzs0QkFDWixjQUFjOztJQUFoQyxZQUFZOztBQUp4QixXQUFXLENBQUM7O3FCQU1HOztBQUViLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUNuRSxJQUFJLENBQUMsWUFBTTtBQUNWLGFBQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQTtLQUN0RCxDQUFDLENBQUE7OztBQUdKLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7OztBQUcvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDbEMsNkNBQXVDLEVBQUU7ZUFBTSxNQUFLLE1BQU0sRUFBRTtPQUFBO0tBQzdELENBQUMsQ0FDSCxDQUFDO0dBRUg7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM5Qjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsUUFBSyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxFQUFHOztBQUNuRCxZQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXpDLFlBQUksR0FBRyxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQ3BELElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUNkLGdCQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RCLGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsT0FBTyxFQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDckYsQ0FBQyxTQUNJLENBQUMsVUFBQSxHQUFHO2lCQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1NBQUEsQ0FBQyxDQUFBOztLQUNoQztHQUNGO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tanMtY29kZS10by1zdmctdG8tcHJldmlldy9saWIvYXRvbS1qcy1jb2RlLXRvLXN2Zy10by1wcmV2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuaW1wb3J0IEF0b21Kc0NvZGVUb1N2Z0Zsb3djaGFydFZpZXcgZnJvbSBcIi4vYXRvbS1qcy1jb2RlLXRvLXN2Zy10by1wcmV2aWV3LXZpZXdcIjtcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0ICogYXMganMyZmxvd2NoYXJ0IGZyb20gXCJqczJmbG93Y2hhcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJhdG9tLWpzLWNvZGUtdG8tc3ZnLXRvLXByZXZpZXdcIilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0FsbCBkZXBlbmRlbmNpZXMgaW5zdGFsbGVkLCBnb29kIHRvIGdvJylcbiAgICAgIH0pXG5cbiAgICAvLyBFdmVudHMgc3Vic2NyaWJlZCB0byBpbiBhdG9tJ3Mgc3lzdGVtIGNhbiBiZSBlYXNpbHkgY2xlYW5lZCB1cCB3aXRoIGEgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAvLyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCB7XG4gICAgICAgIFwiYXRvbS1qcy1jb2RlLXRvLXN2Zy10by1wcmV2aWV3OnRvZ2dsZVwiOiAoKSA9PiB0aGlzLnRvZ2dsZSgpXG4gICAgICB9KVxuICAgICk7XG5cbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgdG9nZ2xlKCkge1xuICAgIGxldCBlZGl0b3I7XG4gICAgaWYgKChlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpKSB7XG4gICAgICBsZXQgc2VsZWN0aW9uID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpO1xuXG4gICAgICBsZXQgc3ZnID0ganMyZmxvd2NoYXJ0LmNvbnZlcnRDb2RlVG9Tdmcoc2VsZWN0aW9uKTtcblxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcInNlbGVjdGlvbi5zdmdcIix7c3BsaXQ6IFwicmlnaHRcIn0pXG4gICAgICAudGhlbihlZGl0b3IgPT4ge1xuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dChzdmcpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmVsZW1lbnQsXCJzdmctcHJldmlldzp0b2dnbGVcIik7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuICAgIH1cbiAgfVxufTtcbiJdfQ==