Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.shouldTriggerLinter = shouldTriggerLinter;
exports.getEditorCursorScopes = getEditorCursorScopes;
exports.isPathIgnored = isPathIgnored;
exports.subscriptiveObserve = subscriptiveObserve;
exports.messageKey = messageKey;
exports.normalizeMessages = normalizeMessages;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUniq = require('lodash/uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var $version = '__$sb_linter_version';
exports.$version = $version;
var $activated = '__$sb_linter_activated';
exports.$activated = $activated;
var $requestLatest = '__$sb_linter_request_latest';
exports.$requestLatest = $requestLatest;
var $requestLastReceived = '__$sb_linter_request_last_received';

exports.$requestLastReceived = $requestLastReceived;

function shouldTriggerLinter(linter, wasTriggeredOnChange, scopes) {
  if (wasTriggeredOnChange && !linter.lintsOnChange) {
    return false;
  }
  return scopes.some(function (scope) {
    return linter.grammarScopes.includes(scope);
  });
}

function getEditorCursorScopes(textEditor) {
  return (0, _lodashUniq2['default'])(textEditor.getCursors().reduce(function (scopes, cursor) {
    return scopes.concat(cursor.getScopeDescriptor().getScopesArray());
  }, ['*']));
}

var minimatch = undefined;

function isPathIgnored(filePath, ignoredGlob, ignoredVCS) {
  if (!filePath) {
    return true;
  }

  if (ignoredVCS) {
    var repository = null;
    var projectPaths = atom.project.getPaths();
    for (var i = 0, _length2 = projectPaths.length; i < _length2; ++i) {
      var projectPath = projectPaths[i];
      if (filePath.indexOf(projectPath) === 0) {
        repository = atom.project.getRepositories()[i];
        break;
      }
    }
    if (repository && repository.isPathIgnored(filePath)) {
      return true;
    }
  }
  var normalizedFilePath = process.platform === 'win32' ? filePath.replace(/\\/g, '/') : filePath;
  if (!minimatch) {
    minimatch = require('minimatch');
  }
  return minimatch(normalizedFilePath, ignoredGlob);
}

function subscriptiveObserve(object, eventName, callback) {
  var subscription = null;
  var eventSubscription = object.observe(eventName, function (props) {
    if (subscription) {
      subscription.dispose();
    }
    subscription = callback.call(this, props);
  });

  return new _atom.Disposable(function () {
    eventSubscription.dispose();
    if (subscription) {
      subscription.dispose();
    }
  });
}

function messageKey(message) {
  var reference = message.reference;

  return ['$LINTER:' + message.linterName, '$LOCATION:' + message.location.file + '$' + message.location.position.start.row + '$' + message.location.position.start.column + '$' + message.location.position.end.row + '$' + message.location.position.end.column, reference ? '$REFERENCE:' + reference.file + '$' + (reference.position ? reference.position.row + '$' + reference.position.column : '') : '$REFERENCE:null', '$EXCERPT:' + message.excerpt, '$SEVERITY:' + message.severity, message.icon ? '$ICON:' + message.icon : '$ICON:null', message.url ? '$URL:' + message.url : '$URL:null', typeof message.description === 'string' ? '$DESCRIPTION:' + message.description : '$DESCRIPTION:null'].join('');
}

function normalizeMessages(linterName, messages) {
  for (var i = 0, _length3 = messages.length; i < _length3; ++i) {
    var message = messages[i];
    var reference = message.reference;

    if (Array.isArray(message.location.position)) {
      message.location.position = _atom.Range.fromObject(message.location.position);
    }
    if (reference && Array.isArray(reference.position)) {
      reference.position = _atom.Point.fromObject(reference.position);
    }
    if (message.solutions && message.solutions.length) {
      for (var j = 0, _length = message.solutions.length, solution = undefined; j < _length; j++) {
        solution = message.solutions[j];
        if (Array.isArray(solution.position)) {
          solution.position = _atom.Range.fromObject(solution.position);
        }
      }
    }
    message.version = 2;
    if (!message.linterName) {
      message.linterName = linterName;
    }
    message.key = messageKey(message);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzBCQUV3QixhQUFhOzs7O29CQUNJLE1BQU07O0FBSXhDLElBQU0sUUFBUSxHQUFHLHNCQUFzQixDQUFBOztBQUN2QyxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQTs7QUFDM0MsSUFBTSxjQUFjLEdBQUcsNkJBQTZCLENBQUE7O0FBQ3BELElBQU0sb0JBQW9CLEdBQUcsb0NBQW9DLENBQUE7Ozs7QUFFakUsU0FBUyxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsb0JBQTZCLEVBQUUsTUFBcUIsRUFBVztBQUNqSCxNQUFJLG9CQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtBQUNqRCxXQUFPLEtBQUssQ0FBQTtHQUNiO0FBQ0QsU0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ2pDLFdBQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDNUMsQ0FBQyxDQUFBO0NBQ0g7O0FBRU0sU0FBUyxxQkFBcUIsQ0FBQyxVQUFzQixFQUFpQjtBQUMzRSxTQUFPLDZCQUNMLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsTUFBTTtXQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7R0FBQSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDdkgsQ0FBQTtDQUNGOztBQUVELElBQUksU0FBUyxZQUFBLENBQUE7O0FBQ04sU0FBUyxhQUFhLENBQUMsUUFBaUIsRUFBRSxXQUFtQixFQUFFLFVBQW1CLEVBQVc7QUFDbEcsTUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLFdBQU8sSUFBSSxDQUFBO0dBQ1o7O0FBRUQsTUFBSSxVQUFV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QUFRLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDeEQ7T0FDRjtLQUNGO0FBQ0QsV0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUE7QUFDbkIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDdkIsYUFBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7S0FDaEM7QUFDRCxXQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNsQztDQUNGIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgYXJyYXlVbmlxdWUgZnJvbSAnbG9kYXNoL3VuaXEnXG5pbXBvcnQgeyBEaXNwb3NhYmxlLCBSYW5nZSwgUG9pbnQgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgTGludGVyLCBNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0ICR2ZXJzaW9uID0gJ19fJHNiX2xpbnRlcl92ZXJzaW9uJ1xuZXhwb3J0IGNvbnN0ICRhY3RpdmF0ZWQgPSAnX18kc2JfbGludGVyX2FjdGl2YXRlZCdcbmV4cG9ydCBjb25zdCAkcmVxdWVzdExhdGVzdCA9ICdfXyRzYl9saW50ZXJfcmVxdWVzdF9sYXRlc3QnXG5leHBvcnQgY29uc3QgJHJlcXVlc3RMYXN0UmVjZWl2ZWQgPSAnX18kc2JfbGludGVyX3JlcXVlc3RfbGFzdF9yZWNlaXZlZCdcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyOiBMaW50ZXIsIHdhc1RyaWdnZXJlZE9uQ2hhbmdlOiBib29sZWFuLCBzY29wZXM6IEFycmF5PHN0cmluZz4pOiBib29sZWFuIHtcbiAgaWYgKHdhc1RyaWdnZXJlZE9uQ2hhbmdlICYmICFsaW50ZXIubGludHNPbkNoYW5nZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBzY29wZXMuc29tZShmdW5jdGlvbihzY29wZSkge1xuICAgIHJldHVybiBsaW50ZXIuZ3JhbW1hclNjb3Blcy5pbmNsdWRlcyhzY29wZSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRvckN1cnNvclNjb3Blcyh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogQXJyYXk8c3RyaW5nPiB7XG4gIHJldHVybiBhcnJheVVuaXF1ZShcbiAgICB0ZXh0RWRpdG9yLmdldEN1cnNvcnMoKS5yZWR1Y2UoKHNjb3BlcywgY3Vyc29yKSA9PiBzY29wZXMuY29uY2F0KGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKS5nZXRTY29wZXNBcnJheSgpKSwgWycqJ10pLFxuICApXG59XG5cbmxldCBtaW5pbWF0Y2hcbmV4cG9ydCBmdW5jdGlvbiBpc1BhdGhJZ25vcmVkKGZpbGVQYXRoOiA/c3RyaW5nLCBpZ25vcmVkR2xvYjogc3RyaW5nLCBpZ25vcmVkVkNTOiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGlmICghZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaWYgKGlnbm9yZWRWQ1MpIHtcbiAgICBsZXQgcmVwb3NpdG9yeSA9IG51bGxcbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gcHJvamVjdFBhdGhzOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gcHJvamVjdFBhdGhzW2ldXG4gICAgICBpZiAoZmlsZVBhdGguaW5kZXhPZihwcm9qZWN0UGF0aCkgPT09IDApIHtcbiAgICAgICAgcmVwb3NpdG9yeSA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVtpXVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVwb3NpdG9yeSAmJiByZXBvc2l0b3J5LmlzUGF0aElnbm9yZWQoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICBjb25zdCBub3JtYWxpemVkRmlsZVBhdGggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gZmlsZVBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpIDogZmlsZVBhdGhcbiAgaWYgKCFtaW5pbWF0Y2gpIHtcbiAgICBtaW5pbWF0Y2ggPSByZXF1aXJlKCdtaW5pbWF0Y2gnKVxuICB9XG4gIHJldHVybiBtaW5pbWF0Y2gobm9ybWFsaXplZEZpbGVQYXRoLCBpZ25vcmVkR2xvYilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmlwdGl2ZU9ic2VydmUob2JqZWN0OiBPYmplY3QsIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgbGV0IHN1YnNjcmlwdGlvbiA9IG51bGxcbiAgY29uc3QgZXZlbnRTdWJzY3JpcHRpb24gPSBvYmplY3Qub2JzZXJ2ZShldmVudE5hbWUsIGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIH1cbiAgICBzdWJzY3JpcHRpb24gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHByb3BzKVxuICB9KVxuXG4gIHJldHVybiBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICBldmVudFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZUtleShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gIGNvbnN0IHsgcmVmZXJlbmNlIH0gPSBtZXNzYWdlXG4gIHJldHVybiBbXG4gICAgYCRMSU5URVI6JHttZXNzYWdlLmxpbnRlck5hbWV9YCxcbiAgICBgJExPQ0FUSU9OOiR7bWVzc2FnZS5sb2NhdGlvbi5maWxlfSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uc3RhcnQucm93fSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uc3RhcnQuY29sdW1ufSQke1xuICAgICAgbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbi5lbmQucm93XG4gICAgfSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uZW5kLmNvbHVtbn1gLFxuICAgIHJlZmVyZW5jZVxuICAgICAgPyBgJFJFRkVSRU5DRToke3JlZmVyZW5jZS5maWxlfSQke3JlZmVyZW5jZS5wb3NpdGlvbiA/IGAke3JlZmVyZW5jZS5wb3NpdGlvbi5yb3d9JCR7cmVmZXJlbmNlLnBvc2l0aW9uLmNvbHVtbn1gIDogJyd9YFxuICAgICAgOiAnJFJFRkVSRU5DRTpudWxsJyxcbiAgICBgJEVYQ0VSUFQ6JHttZXNzYWdlLmV4Y2VycHR9YCxcbiAgICBgJFNFVkVSSVRZOiR7bWVzc2FnZS5zZXZlcml0eX1gLFxuICAgIG1lc3NhZ2UuaWNvbiA/IGAkSUNPTjoke21lc3NhZ2UuaWNvbn1gIDogJyRJQ09OOm51bGwnLFxuICAgIG1lc3NhZ2UudXJsID8gYCRVUkw6JHttZXNzYWdlLnVybH1gIDogJyRVUkw6bnVsbCcsXG4gICAgdHlwZW9mIG1lc3NhZ2UuZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnID8gYCRERVNDUklQVElPTjoke21lc3NhZ2UuZGVzY3JpcHRpb259YCA6ICckREVTQ1JJUFRJT046bnVsbCcsXG4gIF0uam9pbignJylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZU1lc3NhZ2VzKGxpbnRlck5hbWU6IHN0cmluZywgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2U+KSB7XG4gIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gbWVzc2FnZXM7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlc1tpXVxuICAgIGNvbnN0IHsgcmVmZXJlbmNlIH0gPSBtZXNzYWdlXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbikpIHtcbiAgICAgIG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gPSBSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pXG4gICAgfVxuICAgIGlmIChyZWZlcmVuY2UgJiYgQXJyYXkuaXNBcnJheShyZWZlcmVuY2UucG9zaXRpb24pKSB7XG4gICAgICByZWZlcmVuY2UucG9zaXRpb24gPSBQb2ludC5mcm9tT2JqZWN0KHJlZmVyZW5jZS5wb3NpdGlvbilcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aCkge1xuICAgICAgZm9yIChsZXQgaiA9IDAsIF9sZW5ndGggPSBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgsIHNvbHV0aW9uOyBqIDwgX2xlbmd0aDsgaisrKSB7XG4gICAgICAgIHNvbHV0aW9uID0gbWVzc2FnZS5zb2x1dGlvbnNbal1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc29sdXRpb24ucG9zaXRpb24pKSB7XG4gICAgICAgICAgc29sdXRpb24ucG9zaXRpb24gPSBSYW5nZS5mcm9tT2JqZWN0KHNvbHV0aW9uLnBvc2l0aW9uKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIG1lc3NhZ2UudmVyc2lvbiA9IDJcbiAgICBpZiAoIW1lc3NhZ2UubGludGVyTmFtZSkge1xuICAgICAgbWVzc2FnZS5saW50ZXJOYW1lID0gbGludGVyTmFtZVxuICAgIH1cbiAgICBtZXNzYWdlLmtleSA9IG1lc3NhZ2VLZXkobWVzc2FnZSlcbiAgfVxufVxuIl19