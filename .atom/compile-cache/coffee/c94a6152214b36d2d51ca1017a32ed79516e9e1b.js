(function() {
  var LineMessageView, MessagePanelView, PlainMessageView, config, content, cssLint, editor, loophole, messages, ref, result;

  ref = require('atom-message-panel'), MessagePanelView = ref.MessagePanelView, PlainMessageView = ref.PlainMessageView, LineMessageView = ref.LineMessageView;

  config = require("./config");

  cssLint = require("csslint").CSSLint;

  loophole = require("loophole").allowUnsafeEval;

  messages = new MessagePanelView({
    title: "<span class=\"icon-bug\"></span> CSSLint report",
    rawTitle: true,
    closeMethod: "destroy"
  });

  editor = null;

  content = null;

  result = null;

  module.exports = function() {
    var i, len, msg, ref1;
    editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }
    if (editor.getGrammar().name !== "CSS") {
      return;
    }
    content = editor.getText();
    result = loophole(function() {
      return cssLint.verify(content, config());
    });
    messages.clear();
    messages.attach();
    if (atom.config.get("csslint.useFoldModeAsDefault") && messages.summary.css("display") === "none") {
      messages.toggle();
    }
    if (result.messages.length === 0) {
      atom.config.observe("csslint.hideOnNoErrors", function(value) {
        if (value === true) {
          return messages.close();
        } else {
          return messages.add(new PlainMessageView({
            message: "No errors were found!",
            className: "text-success"
          }));
        }
      });
    } else {
      ref1 = result.messages;
      for (i = 0, len = ref1.length; i < len; i++) {
        msg = ref1[i];
        messages.add(new LineMessageView({
          message: msg.message,
          line: msg.line,
          character: msg.col,
          preview: msg.evidence ? msg.evidence.trim() : void 0,
          className: "text-" + msg.type
        }));
      }
    }
    return atom.workspace.onDidChangeActivePaneItem(function() {
      return messages.close();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2Nzc2xpbnQvbGliL2xpbnRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQXdELE9BQUEsQ0FBUSxvQkFBUixDQUF4RCxFQUFDLHVDQUFELEVBQW1CLHVDQUFuQixFQUFxQzs7RUFDckMsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUFrQixDQUFDOztFQUM3QixRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FBbUIsQ0FBQzs7RUFDL0IsUUFBQSxHQUFXLElBQUksZ0JBQUosQ0FDVDtJQUFBLEtBQUEsRUFBTyxpREFBUDtJQUNBLFFBQUEsRUFBVSxJQURWO0lBRUEsV0FBQSxFQUFhLFNBRmI7R0FEUzs7RUFJWCxNQUFBLEdBQVM7O0VBQ1QsT0FBQSxHQUFVOztFQUNWLE1BQUEsR0FBUzs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFFVCxJQUFBLENBQWMsTUFBZDtBQUFBLGFBQUE7O0lBQ0EsSUFBYyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsSUFBcEIsS0FBNEIsS0FBMUM7QUFBQSxhQUFBOztJQUVBLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBO0lBQ1YsTUFBQSxHQUFTLFFBQUEsQ0FBUyxTQUFBO2FBQUcsT0FBTyxDQUFDLE1BQVIsQ0FBZSxPQUFmLEVBQXdCLE1BQUEsQ0FBQSxDQUF4QjtJQUFILENBQVQ7SUFFVCxRQUFRLENBQUMsS0FBVCxDQUFBO0lBQ0EsUUFBUSxDQUFDLE1BQVQsQ0FBQTtJQUNBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQUFBLElBQW9ELFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsQ0FBQSxLQUFtQyxNQUExRjtNQUNFLFFBQVEsQ0FBQyxNQUFULENBQUEsRUFERjs7SUFHQSxJQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7TUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0JBQXBCLEVBQThDLFNBQUMsS0FBRDtRQUM1QyxJQUFHLEtBQUEsS0FBUyxJQUFaO2lCQUNFLFFBQVEsQ0FBQyxLQUFULENBQUEsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBUSxDQUFDLEdBQVQsQ0FBYSxJQUFJLGdCQUFKLENBQ1g7WUFBQSxPQUFBLEVBQVMsdUJBQVQ7WUFDQSxTQUFBLEVBQVcsY0FEWDtXQURXLENBQWIsRUFIRjs7TUFENEMsQ0FBOUMsRUFERjtLQUFBLE1BQUE7QUFTRTtBQUFBLFdBQUEsc0NBQUE7O1FBQ0UsUUFBUSxDQUFDLEdBQVQsQ0FBYSxJQUFJLGVBQUosQ0FDWDtVQUFBLE9BQUEsRUFBUyxHQUFHLENBQUMsT0FBYjtVQUNBLElBQUEsRUFBTSxHQUFHLENBQUMsSUFEVjtVQUVBLFNBQUEsRUFBVyxHQUFHLENBQUMsR0FGZjtVQUdBLE9BQUEsRUFBZ0MsR0FBRyxDQUFDLFFBQTNCLEdBQUEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFiLENBQUEsQ0FBQSxHQUFBLE1BSFQ7VUFJQSxTQUFBLEVBQVcsT0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUp2QjtTQURXLENBQWI7QUFERixPQVRGOztXQWlCQSxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLFNBQUE7YUFDdkMsUUFBUSxDQUFDLEtBQVQsQ0FBQTtJQUR1QyxDQUF6QztFQS9CZTtBQVpqQiIsInNvdXJjZXNDb250ZW50IjpbIntNZXNzYWdlUGFuZWxWaWV3LCBQbGFpbk1lc3NhZ2VWaWV3LCBMaW5lTWVzc2FnZVZpZXd9ID0gcmVxdWlyZSAnYXRvbS1tZXNzYWdlLXBhbmVsJ1xuY29uZmlnID0gcmVxdWlyZShcIi4vY29uZmlnXCIpXG5jc3NMaW50ID0gcmVxdWlyZShcImNzc2xpbnRcIikuQ1NTTGludFxubG9vcGhvbGUgPSByZXF1aXJlKFwibG9vcGhvbGVcIikuYWxsb3dVbnNhZmVFdmFsXG5tZXNzYWdlcyA9IG5ldyBNZXNzYWdlUGFuZWxWaWV3XG4gIHRpdGxlOiBcIjxzcGFuIGNsYXNzPVxcXCJpY29uLWJ1Z1xcXCI+PC9zcGFuPiBDU1NMaW50IHJlcG9ydFwiXG4gIHJhd1RpdGxlOiB0cnVlXG4gIGNsb3NlTWV0aG9kOiBcImRlc3Ryb3lcIlxuZWRpdG9yID0gbnVsbFxuY29udGVudCA9IG51bGxcbnJlc3VsdCA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICByZXR1cm4gdW5sZXNzIGVkaXRvclxuICByZXR1cm4gdW5sZXNzIGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSBpcyBcIkNTU1wiXG5cbiAgY29udGVudCA9IGVkaXRvci5nZXRUZXh0KClcbiAgcmVzdWx0ID0gbG9vcGhvbGUgLT4gY3NzTGludC52ZXJpZnkgY29udGVudCwgY29uZmlnKClcblxuICBtZXNzYWdlcy5jbGVhcigpXG4gIG1lc3NhZ2VzLmF0dGFjaCgpXG4gIGlmIGF0b20uY29uZmlnLmdldChcImNzc2xpbnQudXNlRm9sZE1vZGVBc0RlZmF1bHRcIikgYW5kIG1lc3NhZ2VzLnN1bW1hcnkuY3NzKFwiZGlzcGxheVwiKSBpcyBcIm5vbmVcIlxuICAgIG1lc3NhZ2VzLnRvZ2dsZSgpXG5cbiAgaWYgcmVzdWx0Lm1lc3NhZ2VzLmxlbmd0aCBpcyAwXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBcImNzc2xpbnQuaGlkZU9uTm9FcnJvcnNcIiwgKHZhbHVlKSAtPlxuICAgICAgaWYgdmFsdWUgaXMgdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5jbG9zZSgpXG4gICAgICBlbHNlXG4gICAgICAgIG1lc3NhZ2VzLmFkZCBuZXcgUGxhaW5NZXNzYWdlVmlld1xuICAgICAgICAgIG1lc3NhZ2U6IFwiTm8gZXJyb3JzIHdlcmUgZm91bmQhXCJcbiAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1zdWNjZXNzXCJcbiAgZWxzZVxuICAgIGZvciBtc2cgaW4gcmVzdWx0Lm1lc3NhZ2VzXG4gICAgICBtZXNzYWdlcy5hZGQgbmV3IExpbmVNZXNzYWdlVmlld1xuICAgICAgICBtZXNzYWdlOiBtc2cubWVzc2FnZVxuICAgICAgICBsaW5lOiBtc2cubGluZVxuICAgICAgICBjaGFyYWN0ZXI6IG1zZy5jb2xcbiAgICAgICAgcHJldmlldzogbXNnLmV2aWRlbmNlLnRyaW0oKSBpZiBtc2cuZXZpZGVuY2VcbiAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtI3ttc2cudHlwZX1cIlxuXG4gIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gLT5cbiAgICBtZXNzYWdlcy5jbG9zZSgpXG4iXX0=
