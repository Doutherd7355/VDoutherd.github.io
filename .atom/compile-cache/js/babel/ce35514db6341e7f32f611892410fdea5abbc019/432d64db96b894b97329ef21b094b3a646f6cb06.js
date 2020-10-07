function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* global emit */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var _workerHelpers = require('./worker-helpers');

var Helpers = _interopRequireWildcard(_workerHelpers);

var _isConfigAtHomeRoot = require('./is-config-at-home-root');

var _isConfigAtHomeRoot2 = _interopRequireDefault(_isConfigAtHomeRoot);

'use babel';

process.title = 'linter-eslint helper';

var rulesMetadata = new Map();
var shouldSendRules = false;

function lintJob(_ref) {
  var cliEngineOptions = _ref.cliEngineOptions;
  var contents = _ref.contents;
  var eslint = _ref.eslint;
  var filePath = _ref.filePath;

  var cliEngine = new eslint.CLIEngine(cliEngineOptions);
  var report = cliEngine.executeOnText(contents, filePath);
  var rules = Helpers.getRules(cliEngine);
  shouldSendRules = Helpers.didRulesChange(rulesMetadata, rules);
  if (shouldSendRules) {
    // Rebuild rulesMetadata
    rulesMetadata.clear();
    rules.forEach(function (properties, rule) {
      return rulesMetadata.set(rule, properties);
    });
  }
  return report;
}

function fixJob(_ref2) {
  var cliEngineOptions = _ref2.cliEngineOptions;
  var contents = _ref2.contents;
  var eslint = _ref2.eslint;
  var filePath = _ref2.filePath;

  var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });

  eslint.CLIEngine.outputFixes(report);

  if (!report.results.length || !report.results[0].messages.length) {
    return 'Linter-ESLint: Fix complete.';
  }
  return 'Linter-ESLint: Fix attempt complete, but linting errors remain.';
}

module.exports = _asyncToGenerator(function* () {
  process.on('message', function (jobConfig) {
    // We catch all worker errors so that we can create a separate error emitter
    // for each emitKey, rather than adding multiple listeners for `task:error`
    var contents = jobConfig.contents;
    var type = jobConfig.type;
    var config = jobConfig.config;
    var filePath = jobConfig.filePath;
    var projectPath = jobConfig.projectPath;
    var rules = jobConfig.rules;
    var emitKey = jobConfig.emitKey;

    try {
      if (config.advanced.disableFSCache) {
        _atomLinter.FindCache.clear();
      }

      var fileDir = _path2['default'].dirname(filePath);
      var eslint = Helpers.getESLintInstance(fileDir, config, projectPath);
      var configPath = Helpers.getConfigPath(fileDir);
      var noProjectConfig = configPath === null || (0, _isConfigAtHomeRoot2['default'])(configPath);
      if (noProjectConfig && config.disabling.disableWhenNoEslintConfig) {
        emit(emitKey, { messages: [] });
        return;
      }

      var relativeFilePath = Helpers.getRelativePath(fileDir, filePath, config, projectPath);

      var cliEngineOptions = Helpers.getCLIEngineOptions(type, config, rules, relativeFilePath, fileDir, configPath);

      var response = undefined;
      if (type === 'lint') {
        var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
        response = {
          messages: report.results.length ? report.results[0].messages : []
        };
        if (shouldSendRules) {
          // You can't emit Maps, convert to Array of Arrays to send back.
          response.updatedRules = Array.from(rulesMetadata);
        }
      } else if (type === 'fix') {
        response = fixJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
      } else if (type === 'debug') {
        var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
        response = Helpers.findESLintDirectory(modulesDir, config, projectPath);
      }
      emit(emitKey, response);
    } catch (workerErr) {
      emit('workerError:' + emitKey, { msg: workerErr.message, stack: workerErr.stack });
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy93b3JrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBSWlCLE1BQU07Ozs7MEJBQ2UsYUFBYTs7NkJBQzFCLGtCQUFrQjs7SUFBL0IsT0FBTzs7a0NBQ1ksMEJBQTBCOzs7O0FBUHpELFdBQVcsQ0FBQTs7QUFTWCxPQUFPLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFBOztBQUV0QyxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQy9CLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQTs7QUFFM0IsU0FBUyxPQUFPLENBQUMsSUFBZ0QsRUFBRTtNQUFoRCxnQkFBZ0IsR0FBbEIsSUFBZ0QsQ0FBOUMsZ0JBQWdCO01BQUUsUUFBUSxHQUE1QixJQUFnRCxDQUE1QixRQUFRO01BQUUsTUFBTSxHQUFwQyxJQUFnRCxDQUFsQixNQUFNO01BQUUsUUFBUSxHQUE5QyxJQUFnRCxDQUFWLFFBQVE7O0FBQzdELE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ3hELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzFELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDekMsaUJBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM5RCxNQUFJLGVBQWUsRUFBRTs7QUFFbkIsaUJBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixTQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFFLElBQUk7YUFBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7S0FBQSxDQUFDLENBQUE7R0FDekU7QUFDRCxTQUFPLE1BQU0sQ0FBQTtDQUNkOztBQUVELFNBQVMsTUFBTSxDQUFDLEtBQWdELEVBQUU7TUFBaEQsZ0JBQWdCLEdBQWxCLEtBQWdELENBQTlDLGdCQUFnQjtNQUFFLFFBQVEsR0FBNUIsS0FBZ0QsQ0FBNUIsUUFBUTtNQUFFLE1BQU0sR0FBcEMsS0FBZ0QsQ0FBbEIsTUFBTTtNQUFFLFFBQVEsR0FBOUMsS0FBZ0QsQ0FBVixRQUFROztBQUM1RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxnQkFBZ0IsRUFBaEIsZ0JBQWdCLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBOztBQUV4RSxRQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFcEMsTUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ2hFLFdBQU8sOEJBQThCLENBQUE7R0FDdEM7QUFDRCxTQUFPLGlFQUFpRSxDQUFBO0NBQ3pFOztBQUVELE1BQU0sQ0FBQyxPQUFPLHFCQUFHLGFBQVk7QUFDM0IsU0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxTQUFTLEVBQUs7OztRQUlqQyxRQUFRLEdBQ04sU0FBUyxDQURYLFFBQVE7UUFBRSxJQUFJLEdBQ1osU0FBUyxDQURELElBQUk7UUFBRSxNQUFNLEdBQ3BCLFNBQVMsQ0FESyxNQUFNO1FBQUUsUUFBUSxHQUM5QixTQUFTLENBRGEsUUFBUTtRQUFFLFdBQVcsR0FDM0MsU0FBUyxDQUR1QixXQUFXO1FBQUUsS0FBSyxHQUNsRCxTQUFTLENBRG9DLEtBQUs7UUFBRSxPQUFPLEdBQzNELFNBQVMsQ0FEMkMsT0FBTzs7QUFFL0QsUUFBSTtBQUNGLFVBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7QUFDbEMsOEJBQVUsS0FBSyxFQUFFLENBQUE7T0FDbEI7O0FBRUQsVUFBTSxPQUFPLEdBQUcsa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3RDLFVBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ3RFLFVBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDakQsVUFBTSxlQUFlLEdBQUksVUFBVSxLQUFLLElBQUksSUFBSSxxQ0FBbUIsVUFBVSxDQUFDLEFBQUMsQ0FBQTtBQUMvRSxVQUFJLGVBQWUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixFQUFFO0FBQ2pFLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMvQixlQUFNO09BQ1A7O0FBRUQsVUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBOztBQUV4RixVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FDN0IsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBOztBQUVsRixVQUFJLFFBQVEsWUFBQSxDQUFBO0FBQ1osVUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQ25CLFlBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDeEUsZ0JBQVEsR0FBRztBQUNULGtCQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRTtTQUNsRSxDQUFBO0FBQ0QsWUFBSSxlQUFlLEVBQUU7O0FBRW5CLGtCQUFRLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7U0FDbEQ7T0FDRixNQUFNLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUN6QixnQkFBUSxHQUFHLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7T0FDcEUsTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7QUFDM0IsWUFBTSxVQUFVLEdBQUcsa0JBQUssT0FBTyxDQUFDLDRCQUFXLE9BQU8sRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2pGLGdCQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7T0FDeEU7QUFDRCxVQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hCLENBQUMsT0FBTyxTQUFTLEVBQUU7QUFDbEIsVUFBSSxrQkFBZ0IsT0FBTyxFQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0tBQ25GO0dBQ0YsQ0FBQyxDQUFBO0NBQ0gsQ0FBQSxDQUFBIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy93b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vKiBnbG9iYWwgZW1pdCAqL1xuXG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgRmluZENhY2hlLCBmaW5kQ2FjaGVkIH0gZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vd29ya2VyLWhlbHBlcnMnXG5pbXBvcnQgaXNDb25maWdBdEhvbWVSb290IGZyb20gJy4vaXMtY29uZmlnLWF0LWhvbWUtcm9vdCdcblxucHJvY2Vzcy50aXRsZSA9ICdsaW50ZXItZXNsaW50IGhlbHBlcidcblxuY29uc3QgcnVsZXNNZXRhZGF0YSA9IG5ldyBNYXAoKVxubGV0IHNob3VsZFNlbmRSdWxlcyA9IGZhbHNlXG5cbmZ1bmN0aW9uIGxpbnRKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KSB7XG4gIGNvbnN0IGNsaUVuZ2luZSA9IG5ldyBlc2xpbnQuQ0xJRW5naW5lKGNsaUVuZ2luZU9wdGlvbnMpXG4gIGNvbnN0IHJlcG9ydCA9IGNsaUVuZ2luZS5leGVjdXRlT25UZXh0KGNvbnRlbnRzLCBmaWxlUGF0aClcbiAgY29uc3QgcnVsZXMgPSBIZWxwZXJzLmdldFJ1bGVzKGNsaUVuZ2luZSlcbiAgc2hvdWxkU2VuZFJ1bGVzID0gSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlc01ldGFkYXRhLCBydWxlcylcbiAgaWYgKHNob3VsZFNlbmRSdWxlcykge1xuICAgIC8vIFJlYnVpbGQgcnVsZXNNZXRhZGF0YVxuICAgIHJ1bGVzTWV0YWRhdGEuY2xlYXIoKVxuICAgIHJ1bGVzLmZvckVhY2goKHByb3BlcnRpZXMsIHJ1bGUpID0+IHJ1bGVzTWV0YWRhdGEuc2V0KHJ1bGUsIHByb3BlcnRpZXMpKVxuICB9XG4gIHJldHVybiByZXBvcnRcbn1cblxuZnVuY3Rpb24gZml4Sm9iKHsgY2xpRW5naW5lT3B0aW9ucywgY29udGVudHMsIGVzbGludCwgZmlsZVBhdGggfSkge1xuICBjb25zdCByZXBvcnQgPSBsaW50Sm9iKHsgY2xpRW5naW5lT3B0aW9ucywgY29udGVudHMsIGVzbGludCwgZmlsZVBhdGggfSlcblxuICBlc2xpbnQuQ0xJRW5naW5lLm91dHB1dEZpeGVzKHJlcG9ydClcblxuICBpZiAoIXJlcG9ydC5yZXN1bHRzLmxlbmd0aCB8fCAhcmVwb3J0LnJlc3VsdHNbMF0ubWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICdMaW50ZXItRVNMaW50OiBGaXggY29tcGxldGUuJ1xuICB9XG4gIHJldHVybiAnTGludGVyLUVTTGludDogRml4IGF0dGVtcHQgY29tcGxldGUsIGJ1dCBsaW50aW5nIGVycm9ycyByZW1haW4uJ1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jICgpID0+IHtcbiAgcHJvY2Vzcy5vbignbWVzc2FnZScsIChqb2JDb25maWcpID0+IHtcbiAgICAvLyBXZSBjYXRjaCBhbGwgd29ya2VyIGVycm9ycyBzbyB0aGF0IHdlIGNhbiBjcmVhdGUgYSBzZXBhcmF0ZSBlcnJvciBlbWl0dGVyXG4gICAgLy8gZm9yIGVhY2ggZW1pdEtleSwgcmF0aGVyIHRoYW4gYWRkaW5nIG11bHRpcGxlIGxpc3RlbmVycyBmb3IgYHRhc2s6ZXJyb3JgXG4gICAgY29uc3Qge1xuICAgICAgY29udGVudHMsIHR5cGUsIGNvbmZpZywgZmlsZVBhdGgsIHByb2plY3RQYXRoLCBydWxlcywgZW1pdEtleVxuICAgIH0gPSBqb2JDb25maWdcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZy5hZHZhbmNlZC5kaXNhYmxlRlNDYWNoZSkge1xuICAgICAgICBGaW5kQ2FjaGUuY2xlYXIoKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlRGlyID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShmaWxlRGlyLCBjb25maWcsIHByb2plY3RQYXRoKVxuICAgICAgY29uc3QgY29uZmlnUGF0aCA9IEhlbHBlcnMuZ2V0Q29uZmlnUGF0aChmaWxlRGlyKVxuICAgICAgY29uc3Qgbm9Qcm9qZWN0Q29uZmlnID0gKGNvbmZpZ1BhdGggPT09IG51bGwgfHwgaXNDb25maWdBdEhvbWVSb290KGNvbmZpZ1BhdGgpKVxuICAgICAgaWYgKG5vUHJvamVjdENvbmZpZyAmJiBjb25maWcuZGlzYWJsaW5nLmRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcpIHtcbiAgICAgICAgZW1pdChlbWl0S2V5LCB7IG1lc3NhZ2VzOiBbXSB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVsYXRpdmVGaWxlUGF0aCA9IEhlbHBlcnMuZ2V0UmVsYXRpdmVQYXRoKGZpbGVEaXIsIGZpbGVQYXRoLCBjb25maWcsIHByb2plY3RQYXRoKVxuXG4gICAgICBjb25zdCBjbGlFbmdpbmVPcHRpb25zID0gSGVscGVyc1xuICAgICAgICAuZ2V0Q0xJRW5naW5lT3B0aW9ucyh0eXBlLCBjb25maWcsIHJ1bGVzLCByZWxhdGl2ZUZpbGVQYXRoLCBmaWxlRGlyLCBjb25maWdQYXRoKVxuXG4gICAgICBsZXQgcmVzcG9uc2VcbiAgICAgIGlmICh0eXBlID09PSAnbGludCcpIHtcbiAgICAgICAgY29uc3QgcmVwb3J0ID0gbGludEpvYih7IGNsaUVuZ2luZU9wdGlvbnMsIGNvbnRlbnRzLCBlc2xpbnQsIGZpbGVQYXRoIH0pXG4gICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgIG1lc3NhZ2VzOiByZXBvcnQucmVzdWx0cy5sZW5ndGggPyByZXBvcnQucmVzdWx0c1swXS5tZXNzYWdlcyA6IFtdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNob3VsZFNlbmRSdWxlcykge1xuICAgICAgICAgIC8vIFlvdSBjYW4ndCBlbWl0IE1hcHMsIGNvbnZlcnQgdG8gQXJyYXkgb2YgQXJyYXlzIHRvIHNlbmQgYmFjay5cbiAgICAgICAgICByZXNwb25zZS51cGRhdGVkUnVsZXMgPSBBcnJheS5mcm9tKHJ1bGVzTWV0YWRhdGEpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2ZpeCcpIHtcbiAgICAgICAgcmVzcG9uc2UgPSBmaXhKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZGVidWcnKSB7XG4gICAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmRpcm5hbWUoZmluZENhY2hlZChmaWxlRGlyLCAnbm9kZV9tb2R1bGVzL2VzbGludCcpIHx8ICcnKVxuICAgICAgICByZXNwb25zZSA9IEhlbHBlcnMuZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcsIHByb2plY3RQYXRoKVxuICAgICAgfVxuICAgICAgZW1pdChlbWl0S2V5LCByZXNwb25zZSlcbiAgICB9IGNhdGNoICh3b3JrZXJFcnIpIHtcbiAgICAgIGVtaXQoYHdvcmtlckVycm9yOiR7ZW1pdEtleX1gLCB7IG1zZzogd29ya2VyRXJyLm1lc3NhZ2UsIHN0YWNrOiB3b3JrZXJFcnIuc3RhY2sgfSlcbiAgICB9XG4gIH0pXG59XG4iXX0=