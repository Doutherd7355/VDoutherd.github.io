(function() {
  var linter;

  linter = require("./linter");

  module.exports = {
    config: {
      validateOnSave: {
        type: 'boolean',
        "default": true
      },
      validateOnChange: {
        type: 'boolean',
        "default": false
      },
      hideOnNoErrors: {
        type: 'boolean',
        "default": false
      },
      useFoldModeAsDefault: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      var editor, subscriptions;
      editor = atom.workspace.getActiveTextEditor();
      subscriptions = {
        onSave: null,
        onChange: null
      };
      atom.commands.add("atom-workspace", "csslint:lint", linter);
      atom.config.observe("csslint.validateOnSave", function(value) {
        if (value === true) {
          return atom.workspace.observeTextEditors(function(editor) {
            return subscriptions.onSave = editor.buffer.onDidSave(linter);
          });
        } else {
          return atom.workspace.observeTextEditors(function(editor) {
            var ref;
            return (ref = subscriptions.onSave) != null ? ref.dispose() : void 0;
          });
        }
      });
      return atom.config.observe("csslint.validateOnChange", function(value) {
        if (value === true) {
          return atom.workspace.observeTextEditors(function(editor) {
            return subscriptions.onChange = editor.buffer.onDidStopChanging(linter);
          });
        } else {
          return atom.workspace.observeTextEditors(function(editor) {
            var ref;
            return (ref = subscriptions.onChange) != null ? ref.dispose() : void 0;
          });
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2Nzc2xpbnQvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BREY7TUFHQSxnQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FKRjtNQU1BLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BUEY7TUFTQSxvQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FWRjtLQURGO0lBY0EsUUFBQSxFQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtNQUNULGFBQUEsR0FDRTtRQUFBLE1BQUEsRUFBUSxJQUFSO1FBQ0EsUUFBQSxFQUFVLElBRFY7O01BR0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxjQUFwQyxFQUFvRCxNQUFwRDtNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix3QkFBcEIsRUFBOEMsU0FBQyxLQUFEO1FBQzVDLElBQUcsS0FBQSxLQUFTLElBQVo7aUJBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQ7bUJBQ2hDLGFBQWEsQ0FBQyxNQUFkLEdBQXVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBZCxDQUF3QixNQUF4QjtVQURTLENBQWxDLEVBREY7U0FBQSxNQUFBO2lCQUlFLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO0FBQ2hDLGdCQUFBOzZEQUFvQixDQUFFLE9BQXRCLENBQUE7VUFEZ0MsQ0FBbEMsRUFKRjs7TUFENEMsQ0FBOUM7YUFRQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMEJBQXBCLEVBQWdELFNBQUMsS0FBRDtRQUM5QyxJQUFHLEtBQUEsS0FBUyxJQUFaO2lCQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO21CQUNoQyxhQUFhLENBQUMsUUFBZCxHQUF5QixNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFkLENBQWdDLE1BQWhDO1VBRE8sQ0FBbEMsRUFERjtTQUFBLE1BQUE7aUJBSUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQ7QUFDaEMsZ0JBQUE7K0RBQXNCLENBQUUsT0FBeEIsQ0FBQTtVQURnQyxDQUFsQyxFQUpGOztNQUQ4QyxDQUFoRDtJQWZRLENBZFY7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJsaW50ZXIgPSByZXF1aXJlIFwiLi9saW50ZXJcIlxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgdmFsaWRhdGVPblNhdmU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICB2YWxpZGF0ZU9uQ2hhbmdlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIGhpZGVPbk5vRXJyb3JzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIHVzZUZvbGRNb2RlQXNEZWZhdWx0OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHN1YnNjcmlwdGlvbnMgPVxuICAgICAgb25TYXZlOiBudWxsXG4gICAgICBvbkNoYW5nZTogbnVsbFxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImNzc2xpbnQ6bGludFwiLCBsaW50ZXJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiY3NzbGludC52YWxpZGF0ZU9uU2F2ZVwiLCAodmFsdWUpIC0+XG4gICAgICBpZiB2YWx1ZSBpcyB0cnVlXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMub25TYXZlID0gZWRpdG9yLmJ1ZmZlci5vbkRpZFNhdmUgbGludGVyXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSAtPlxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMub25TYXZlPy5kaXNwb3NlKClcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCJjc3NsaW50LnZhbGlkYXRlT25DaGFuZ2VcIiwgKHZhbHVlKSAtPlxuICAgICAgaWYgdmFsdWUgaXMgdHJ1ZVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICAgICAgICBzdWJzY3JpcHRpb25zLm9uQ2hhbmdlID0gZWRpdG9yLmJ1ZmZlci5vbkRpZFN0b3BDaGFuZ2luZyBsaW50ZXJcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gICAgICAgICAgc3Vic2NyaXB0aW9ucy5vbkNoYW5nZT8uZGlzcG9zZSgpXG4iXX0=
