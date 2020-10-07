Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getNodePrefixPath = getNodePrefixPath;
exports.findESLintDirectory = findESLintDirectory;
exports.getESLintFromDirectory = getESLintFromDirectory;
exports.refreshModulesPath = refreshModulesPath;
exports.getESLintInstance = getESLintInstance;
exports.getConfigPath = getConfigPath;
exports.getRelativePath = getRelativePath;
exports.getCLIEngineOptions = getCLIEngineOptions;
exports.getRules = getRules;
exports.didRulesChange = didRulesChange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _resolveEnv = require('resolve-env');

var _resolveEnv2 = _interopRequireDefault(_resolveEnv);

var _atomLinter = require('atom-linter');

var _consistentPath = require('consistent-path');

var _consistentPath2 = _interopRequireDefault(_consistentPath);

'use babel';

var Cache = {
  ESLINT_LOCAL_PATH: _path2['default'].normalize(_path2['default'].join(__dirname, '..', 'node_modules', 'eslint')),
  NODE_PREFIX_PATH: null,
  LAST_MODULES_PATH: null
};

/**
 * Takes a path and translates `~` to the user's home directory, and replaces
 * all environment variables with their value.
 * @param  {string} path The path to remove "strangeness" from
 * @return {string}      The cleaned path
 */
var cleanPath = function cleanPath(path) {
  return path ? (0, _resolveEnv2['default'])(_fsPlus2['default'].normalize(path)) : '';
};

function getNodePrefixPath() {
  if (Cache.NODE_PREFIX_PATH === null) {
    var npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
      Cache.NODE_PREFIX_PATH = _child_process2['default'].spawnSync(npmCommand, ['get', 'prefix'], {
        env: Object.assign(Object.assign({}, process.env), { PATH: (0, _consistentPath2['default'])() })
      }).output[1].toString().trim();
    } catch (e) {
      var errMsg = 'Unable to execute `npm get prefix`. Please make sure ' + 'Atom is getting $PATH correctly.';
      throw new Error(errMsg);
    }
  }
  return Cache.NODE_PREFIX_PATH;
}

function isDirectory(dirPath) {
  var isDir = undefined;
  try {
    isDir = _fsPlus2['default'].statSync(dirPath).isDirectory();
  } catch (e) {
    isDir = false;
  }
  return isDir;
}

function findESLintDirectory(modulesDir, config, projectPath) {
  var eslintDir = null;
  var locationType = null;
  if (config.global.useGlobalEslint) {
    locationType = 'global';
    var configGlobal = cleanPath(config.global.globalNodePath);
    var prefixPath = configGlobal || getNodePrefixPath();
    // NPM on Windows and Yarn on all platforms
    eslintDir = _path2['default'].join(prefixPath, 'node_modules', 'eslint');
    if (!isDirectory(eslintDir)) {
      // NPM on platforms other than Windows
      eslintDir = _path2['default'].join(prefixPath, 'lib', 'node_modules', 'eslint');
    }
  } else if (!config.advanced.localNodeModules) {
    locationType = 'local project';
    eslintDir = _path2['default'].join(modulesDir || '', 'eslint');
  } else if (_path2['default'].isAbsolute(cleanPath(config.advanced.localNodeModules))) {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(cleanPath(config.advanced.localNodeModules), 'eslint');
  } else {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(projectPath || '', cleanPath(config.advanced.localNodeModules), 'eslint');
  }

  if (isDirectory(eslintDir)) {
    return {
      path: eslintDir,
      type: locationType
    };
  }

  if (config.global.useGlobalEslint) {
    throw new Error('ESLint not found, please ensure the global Node path is set correctly.');
  }

  return {
    path: Cache.ESLINT_LOCAL_PATH,
    type: 'bundled fallback'
  };
}

function getESLintFromDirectory(modulesDir, config, projectPath) {
  var _findESLintDirectory = findESLintDirectory(modulesDir, config, projectPath);

  var ESLintDirectory = _findESLintDirectory.path;

  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(ESLintDirectory);
  } catch (e) {
    if (config.global.useGlobalEslint && e.code === 'MODULE_NOT_FOUND') {
      throw new Error('ESLint not found, try restarting Atom to clear caches.');
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(Cache.ESLINT_LOCAL_PATH);
  }
}

function refreshModulesPath(modulesDir) {
  if (Cache.LAST_MODULES_PATH !== modulesDir) {
    Cache.LAST_MODULES_PATH = modulesDir;
    process.env.NODE_PATH = modulesDir || '';
    // eslint-disable-next-line no-underscore-dangle
    require('module').Module._initPaths();
  }
}

function getESLintInstance(fileDir, config, projectPath) {
  var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
  refreshModulesPath(modulesDir);
  return getESLintFromDirectory(modulesDir, config, projectPath);
}

function getConfigPath(_x) {
  var _again = true;

  _function: while (_again) {
    var fileDir = _x;
    _again = false;

    var configFile = (0, _atomLinter.findCached)(fileDir, ['.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json', '.eslintrc', 'package.json']);
    if (configFile) {
      if (_path2['default'].basename(configFile) === 'package.json') {
        // eslint-disable-next-line import/no-dynamic-require
        if (require(configFile).eslintConfig) {
          return configFile;
        }
        // If we are here, we found a package.json without an eslint config
        // in a dir without any other eslint config files
        // (because 'package.json' is last in the call to findCached)
        // So, keep looking from the parent directory
        _x = _path2['default'].resolve(_path2['default'].dirname(configFile), '..');
        _again = true;
        configFile = undefined;
        continue _function;
      }
      return configFile;
    }
    return null;
  }
}

function getRelativePath(fileDir, filePath, config, projectPath) {
  var ignoreFile = config.advanced.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');

  // If we can find an .eslintignore file, we can set cwd there
  // (because they are expected to be at the project root)
  if (ignoreFile) {
    var ignoreDir = _path2['default'].dirname(ignoreFile);
    process.chdir(ignoreDir);
    return _path2['default'].relative(ignoreDir, filePath);
  }
  // Otherwise, we'll set the cwd to the atom project root as long as that exists
  if (projectPath) {
    process.chdir(projectPath);
    return _path2['default'].relative(projectPath, filePath);
  }
  // If all else fails, use the file location itself
  process.chdir(fileDir);
  return _path2['default'].basename(filePath);
}

function getCLIEngineOptions(type, config, rules, filePath, fileDir, givenConfigPath) {
  var cliEngineConfig = {
    rules: rules,
    ignore: !config.advanced.disableEslintIgnore,
    fix: type === 'fix'
  };

  var ignoreFile = config.advanced.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');
  if (ignoreFile) {
    cliEngineConfig.ignorePath = ignoreFile;
  }

  cliEngineConfig.rulePaths = config.advanced.eslintRulesDirs.map(function (path) {
    var rulesDir = cleanPath(path);
    if (!_path2['default'].isAbsolute(rulesDir)) {
      return (0, _atomLinter.findCached)(fileDir, rulesDir);
    }
    return rulesDir;
  }).filter(function (path) {
    return path;
  });

  if (givenConfigPath === null && config.global.eslintrcPath) {
    // If we didn't find a configuration use the fallback from the settings
    cliEngineConfig.configFile = cleanPath(config.global.eslintrcPath);
  }

  return cliEngineConfig;
}

/**
 * Gets the list of rules used for a lint job
 * @param  {Object} cliEngine The CLIEngine instance used for the lint job
 * @return {Map}              A Map of the rules used, rule names as keys, rule
 *                            properties as the contents.
 */

function getRules(cliEngine) {
  // Pull the list of rules used directly from the CLIEngine
  // Added in https://github.com/eslint/eslint/pull/9782
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'getRules')) {
    return cliEngine.getRules();
  }

  // Attempt to use the internal (undocumented) `linter` instance attached to
  // the CLIEngine to get the loaded rules (including plugin rules).
  // Added in ESLint v4
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'linter')) {
    return cliEngine.linter.getRules();
  }

  // Older versions of ESLint don't (easily) support getting a list of rules
  return new Map();
}

/**
 * Given an exiting rule list and a new rule list, determines whether there
 * have been changes.
 * NOTE: This only accounts for presence of the rules, changes to their metadata
 * are not taken into account.
 * @param  {Map} newRules     A Map of the new rules
 * @param  {Map} currentRules A Map of the current rules
 * @return {boolean}             Whether or not there were changes
 */

function didRulesChange(currentRules, newRules) {
  return !(currentRules.size === newRules.size && Array.from(currentRules.keys()).every(function (ruleId) {
    return newRules.has(ruleId);
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy93b3JrZXItaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3NCQUNSLFNBQVM7Ozs7NkJBQ0MsZUFBZTs7OzswQkFDakIsYUFBYTs7OzswQkFDVCxhQUFhOzs4QkFDcEIsaUJBQWlCOzs7O0FBUHJDLFdBQVcsQ0FBQTs7QUFTWCxJQUFNLEtBQUssR0FBRztBQUNaLG1CQUFpQixFQUFFLGtCQUFLLFNBQVMsQ0FBQyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdkYsa0JBQWdCLEVBQUUsSUFBSTtBQUN0QixtQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUE7Ozs7Ozs7O0FBUUQsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUcsSUFBSTtTQUFLLElBQUksR0FBRyw2QkFBVyxvQkFBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO0NBQUMsQ0FBQTs7QUFFL0QsU0FBUyxpQkFBaUIsR0FBRztBQUNsQyxNQUFJLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7QUFDbkMsUUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQTtBQUNuRSxRQUFJO0FBQ0YsV0FBSyxDQUFDLGdCQUFnQixHQUFHLDJCQUFhLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDN0UsV0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGtDQUFTLEVBQUUsQ0FBQztPQUN4RSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO0tBQy9CLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixVQUFNLE1BQU0sR0FBRyx1REFBdUQsR0FDbEUsa0NBQWtDLENBQUE7QUFDdEMsWUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUN4QjtHQUNGO0FBQ0QsU0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUE7Q0FDOUI7O0FBRUQsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFO0FBQzVCLE1BQUksS0FBSyxZQUFBLENBQUE7QUFDVCxNQUFJO0FBQ0YsU0FBSyxHQUFHLG9CQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtHQUMzQyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ1YsU0FBSyxHQUFHLEtBQUssQ0FBQTtHQUNkO0FBQ0QsU0FBTyxLQUFLLENBQUE7Q0FDYjs7QUFFTSxTQUFTLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0FBQ25FLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNwQixNQUFJLFlBQVksR0FBRyxJQUFJLENBQUE7QUFDdkIsTUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUNqQyxnQkFBWSxHQUFHLFFBQVEsQ0FBQTtBQUN2QixRQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1RCxRQUFNLFVBQVUsR0FBRyxZQUFZLElBQUksaUJBQWlCLEVBQUUsQ0FBQTs7QUFFdEQsYUFBUyxHQUFHLGtCQUFLLElBQUksQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQzNELFFBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7O0FBRTNCLGVBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDbkU7R0FDRixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0FBQzVDLGdCQUFZLEdBQUcsZUFBZSxDQUFBO0FBQzlCLGFBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtHQUNsRCxNQUFNLElBQUksa0JBQUssVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRTtBQUN2RSxnQkFBWSxHQUFHLG9CQUFvQixDQUFBO0FBQ25DLGFBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtHQUM3RSxNQUFNO0FBQ0wsZ0JBQVksR0FBRyxvQkFBb0IsQ0FBQTtBQUNuQyxhQUFTLEdBQUcsa0JBQUssSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtHQUNoRzs7QUFFRCxNQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMxQixXQUFPO0FBQ0wsVUFBSSxFQUFFLFNBQVM7QUFDZixVQUFJLEVBQUUsWUFBWTtLQUNuQixDQUFBO0dBQ0Y7O0FBRUQsTUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtBQUNqQyxVQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUE7R0FDMUY7O0FBRUQsU0FBTztBQUNMLFFBQUksRUFBRSxLQUFLLENBQUMsaUJBQWlCO0FBQzdCLFFBQUksRUFBRSxrQkFBa0I7R0FDekIsQ0FBQTtDQUNGOztBQUVNLFNBQVMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7NkJBQ3BDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDOztNQUF4RSxlQUFlLHdCQUFyQixJQUFJOztBQUNaLE1BQUk7O0FBRUYsV0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7R0FDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFFBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxrQkFBa0IsRUFBRTtBQUNsRSxZQUFNLElBQUksS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUE7S0FDMUU7O0FBRUQsV0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7R0FDeEM7Q0FDRjs7QUFFTSxTQUFTLGtCQUFrQixDQUFDLFVBQVUsRUFBRTtBQUM3QyxNQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxVQUFVLEVBQUU7QUFDMUMsU0FBSyxDQUFDLGlCQUFpQixHQUFHLFVBQVUsQ0FBQTtBQUNwQyxXQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUksRUFBRSxDQUFBOztBQUV4QyxXQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFBO0dBQ3RDO0NBQ0Y7O0FBRU0sU0FBUyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtBQUM5RCxNQUFNLFVBQVUsR0FBRyxrQkFBSyxPQUFPLENBQUMsNEJBQVcsT0FBTyxFQUFFLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDakYsb0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDOUIsU0FBTyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0NBQy9EOztBQUVNLFNBQVMsYUFBYTs7OzRCQUFVO1FBQVQsT0FBTzs7O0FBQ25DLFFBQU0sVUFBVSxHQUFHLDRCQUFXLE9BQU8sRUFBRSxDQUNyQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBRSxjQUFjLENBQ2pHLENBQUMsQ0FBQTtBQUNGLFFBQUksVUFBVSxFQUFFO0FBQ2QsVUFBSSxrQkFBSyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssY0FBYyxFQUFFOztBQUVoRCxZQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDcEMsaUJBQU8sVUFBVSxDQUFBO1NBQ2xCOzs7OzthQUtvQixrQkFBSyxPQUFPLENBQUMsa0JBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQzs7QUFiL0Qsa0JBQVU7O09BY2I7QUFDRCxhQUFPLFVBQVUsQ0FBQTtLQUNsQjtBQUNELFdBQU8sSUFBSSxDQUFBO0dBQ1o7Q0FBQTs7QUFFTSxTQUFTLGVBQWUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7QUFDdEUsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsNEJBQVcsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFBOzs7O0FBSXBHLE1BQUksVUFBVSxFQUFFO0FBQ2QsUUFBTSxTQUFTLEdBQUcsa0JBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzFDLFdBQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDeEIsV0FBTyxrQkFBSyxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0dBQzFDOztBQUVELE1BQUksV0FBVyxFQUFFO0FBQ2YsV0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUMxQixXQUFPLGtCQUFLLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDNUM7O0FBRUQsU0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN0QixTQUFPLGtCQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUMvQjs7QUFFTSxTQUFTLG1CQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFO0FBQzNGLE1BQU0sZUFBZSxHQUFHO0FBQ3RCLFNBQUssRUFBTCxLQUFLO0FBQ0wsVUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUI7QUFDNUMsT0FBRyxFQUFFLElBQUksS0FBSyxLQUFLO0dBQ3BCLENBQUE7O0FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsNEJBQVcsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3BHLE1BQUksVUFBVSxFQUFFO0FBQ2QsbUJBQWUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0dBQ3hDOztBQUVELGlCQUFlLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBSztBQUN4RSxRQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDaEMsUUFBSSxDQUFDLGtCQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUM5QixhQUFPLDRCQUFXLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNyQztBQUNELFdBQU8sUUFBUSxDQUFBO0dBQ2hCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO1dBQUksSUFBSTtHQUFBLENBQUMsQ0FBQTs7QUFFdkIsTUFBSSxlQUFlLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFOztBQUUxRCxtQkFBZSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQTtHQUNuRTs7QUFFRCxTQUFPLGVBQWUsQ0FBQTtDQUN2Qjs7Ozs7Ozs7O0FBUU0sU0FBUyxRQUFRLENBQUMsU0FBUyxFQUFFOzs7QUFHbEMsTUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFO0FBQy9ELFdBQU8sU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFBO0dBQzVCOzs7OztBQUtELE1BQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTtBQUM3RCxXQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7R0FDbkM7OztBQUdELFNBQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQTtDQUNqQjs7Ozs7Ozs7Ozs7O0FBV00sU0FBUyxjQUFjLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRTtBQUNyRCxTQUFPLEVBQUUsWUFBWSxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxJQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLE1BQU07V0FBSSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztHQUFBLENBQUMsQ0FBQSxBQUFDLENBQUE7Q0FDNUUiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci1oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcy1wbHVzJ1xuaW1wb3J0IENoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHJlc29sdmVFbnYgZnJvbSAncmVzb2x2ZS1lbnYnXG5pbXBvcnQgeyBmaW5kQ2FjaGVkIH0gZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgZ2V0UGF0aCBmcm9tICdjb25zaXN0ZW50LXBhdGgnXG5cbmNvbnN0IENhY2hlID0ge1xuICBFU0xJTlRfTE9DQUxfUEFUSDogUGF0aC5ub3JtYWxpemUoUGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKSksXG4gIE5PREVfUFJFRklYX1BBVEg6IG51bGwsXG4gIExBU1RfTU9EVUxFU19QQVRIOiBudWxsXG59XG5cbi8qKlxuICogVGFrZXMgYSBwYXRoIGFuZCB0cmFuc2xhdGVzIGB+YCB0byB0aGUgdXNlcidzIGhvbWUgZGlyZWN0b3J5LCBhbmQgcmVwbGFjZXNcbiAqIGFsbCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2l0aCB0aGVpciB2YWx1ZS5cbiAqIEBwYXJhbSAge3N0cmluZ30gcGF0aCBUaGUgcGF0aCB0byByZW1vdmUgXCJzdHJhbmdlbmVzc1wiIGZyb21cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICBUaGUgY2xlYW5lZCBwYXRoXG4gKi9cbmNvbnN0IGNsZWFuUGF0aCA9IHBhdGggPT4gKHBhdGggPyByZXNvbHZlRW52KGZzLm5vcm1hbGl6ZShwYXRoKSkgOiAnJylcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVQcmVmaXhQYXRoKCkge1xuICBpZiAoQ2FjaGUuTk9ERV9QUkVGSVhfUEFUSCA9PT0gbnVsbCkge1xuICAgIGNvbnN0IG5wbUNvbW1hbmQgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ25wbS5jbWQnIDogJ25wbSdcbiAgICB0cnkge1xuICAgICAgQ2FjaGUuTk9ERV9QUkVGSVhfUEFUSCA9IENoaWxkUHJvY2Vzcy5zcGF3blN5bmMobnBtQ29tbWFuZCwgWydnZXQnLCAncHJlZml4J10sIHtcbiAgICAgICAgZW52OiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIHByb2Nlc3MuZW52KSwgeyBQQVRIOiBnZXRQYXRoKCkgfSlcbiAgICAgIH0pLm91dHB1dFsxXS50b1N0cmluZygpLnRyaW0oKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IGVyck1zZyA9ICdVbmFibGUgdG8gZXhlY3V0ZSBgbnBtIGdldCBwcmVmaXhgLiBQbGVhc2UgbWFrZSBzdXJlICdcbiAgICAgICAgKyAnQXRvbSBpcyBnZXR0aW5nICRQQVRIIGNvcnJlY3RseS4nXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKVxuICAgIH1cbiAgfVxuICByZXR1cm4gQ2FjaGUuTk9ERV9QUkVGSVhfUEFUSFxufVxuXG5mdW5jdGlvbiBpc0RpcmVjdG9yeShkaXJQYXRoKSB7XG4gIGxldCBpc0RpclxuICB0cnkge1xuICAgIGlzRGlyID0gZnMuc3RhdFN5bmMoZGlyUGF0aCkuaXNEaXJlY3RvcnkoKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXNEaXIgPSBmYWxzZVxuICB9XG4gIHJldHVybiBpc0RpclxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGxldCBlc2xpbnREaXIgPSBudWxsXG4gIGxldCBsb2NhdGlvblR5cGUgPSBudWxsXG4gIGlmIChjb25maWcuZ2xvYmFsLnVzZUdsb2JhbEVzbGludCkge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdnbG9iYWwnXG4gICAgY29uc3QgY29uZmlnR2xvYmFsID0gY2xlYW5QYXRoKGNvbmZpZy5nbG9iYWwuZ2xvYmFsTm9kZVBhdGgpXG4gICAgY29uc3QgcHJlZml4UGF0aCA9IGNvbmZpZ0dsb2JhbCB8fCBnZXROb2RlUHJlZml4UGF0aCgpXG4gICAgLy8gTlBNIG9uIFdpbmRvd3MgYW5kIFlhcm4gb24gYWxsIHBsYXRmb3Jtc1xuICAgIGVzbGludERpciA9IFBhdGguam9pbihwcmVmaXhQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgaWYgKCFpc0RpcmVjdG9yeShlc2xpbnREaXIpKSB7XG4gICAgICAvLyBOUE0gb24gcGxhdGZvcm1zIG90aGVyIHRoYW4gV2luZG93c1xuICAgICAgZXNsaW50RGlyID0gUGF0aC5qb2luKHByZWZpeFBhdGgsICdsaWInLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgfVxuICB9IGVsc2UgaWYgKCFjb25maWcuYWR2YW5jZWQubG9jYWxOb2RlTW9kdWxlcykge1xuICAgIGxvY2F0aW9uVHlwZSA9ICdsb2NhbCBwcm9qZWN0J1xuICAgIGVzbGludERpciA9IFBhdGguam9pbihtb2R1bGVzRGlyIHx8ICcnLCAnZXNsaW50JylcbiAgfSBlbHNlIGlmIChQYXRoLmlzQWJzb2x1dGUoY2xlYW5QYXRoKGNvbmZpZy5hZHZhbmNlZC5sb2NhbE5vZGVNb2R1bGVzKSkpIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnYWR2YW5jZWQgc3BlY2lmaWVkJ1xuICAgIGVzbGludERpciA9IFBhdGguam9pbihjbGVhblBhdGgoY29uZmlnLmFkdmFuY2VkLmxvY2FsTm9kZU1vZHVsZXMpLCAnZXNsaW50JylcbiAgfSBlbHNlIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnYWR2YW5jZWQgc3BlY2lmaWVkJ1xuICAgIGVzbGludERpciA9IFBhdGguam9pbihwcm9qZWN0UGF0aCB8fCAnJywgY2xlYW5QYXRoKGNvbmZpZy5hZHZhbmNlZC5sb2NhbE5vZGVNb2R1bGVzKSwgJ2VzbGludCcpXG4gIH1cblxuICBpZiAoaXNEaXJlY3RvcnkoZXNsaW50RGlyKSkge1xuICAgIHJldHVybiB7XG4gICAgICBwYXRoOiBlc2xpbnREaXIsXG4gICAgICB0eXBlOiBsb2NhdGlvblR5cGUsXG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZy5nbG9iYWwudXNlR2xvYmFsRXNsaW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFU0xpbnQgbm90IGZvdW5kLCBwbGVhc2UgZW5zdXJlIHRoZSBnbG9iYWwgTm9kZSBwYXRoIGlzIHNldCBjb3JyZWN0bHkuJylcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0aDogQ2FjaGUuRVNMSU5UX0xPQ0FMX1BBVEgsXG4gICAgdHlwZTogJ2J1bmRsZWQgZmFsbGJhY2snLFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFU0xpbnRGcm9tRGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZywgcHJvamVjdFBhdGgpIHtcbiAgY29uc3QgeyBwYXRoOiBFU0xpbnREaXJlY3RvcnkgfSA9IGZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbiAgdHJ5IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgIHJldHVybiByZXF1aXJlKEVTTGludERpcmVjdG9yeSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjb25maWcuZ2xvYmFsLnVzZUdsb2JhbEVzbGludCAmJiBlLmNvZGUgPT09ICdNT0RVTEVfTk9UX0ZPVU5EJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFU0xpbnQgbm90IGZvdW5kLCB0cnkgcmVzdGFydGluZyBBdG9tIHRvIGNsZWFyIGNhY2hlcy4nKVxuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgIHJldHVybiByZXF1aXJlKENhY2hlLkVTTElOVF9MT0NBTF9QQVRIKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWZyZXNoTW9kdWxlc1BhdGgobW9kdWxlc0Rpcikge1xuICBpZiAoQ2FjaGUuTEFTVF9NT0RVTEVTX1BBVEggIT09IG1vZHVsZXNEaXIpIHtcbiAgICBDYWNoZS5MQVNUX01PRFVMRVNfUEFUSCA9IG1vZHVsZXNEaXJcbiAgICBwcm9jZXNzLmVudi5OT0RFX1BBVEggPSBtb2R1bGVzRGlyIHx8ICcnXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlXG4gICAgcmVxdWlyZSgnbW9kdWxlJykuTW9kdWxlLl9pbml0UGF0aHMoKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFU0xpbnRJbnN0YW5jZShmaWxlRGlyLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmRpcm5hbWUoZmluZENhY2hlZChmaWxlRGlyLCAnbm9kZV9tb2R1bGVzL2VzbGludCcpIHx8ICcnKVxuICByZWZyZXNoTW9kdWxlc1BhdGgobW9kdWxlc0RpcilcbiAgcmV0dXJuIGdldEVTTGludEZyb21EaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZ1BhdGgoZmlsZURpcikge1xuICBjb25zdCBjb25maWdGaWxlID0gZmluZENhY2hlZChmaWxlRGlyLCBbXG4gICAgJy5lc2xpbnRyYy5qcycsICcuZXNsaW50cmMueWFtbCcsICcuZXNsaW50cmMueW1sJywgJy5lc2xpbnRyYy5qc29uJywgJy5lc2xpbnRyYycsICdwYWNrYWdlLmpzb24nXG4gIF0pXG4gIGlmIChjb25maWdGaWxlKSB7XG4gICAgaWYgKFBhdGguYmFzZW5hbWUoY29uZmlnRmlsZSkgPT09ICdwYWNrYWdlLmpzb24nKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgICAgaWYgKHJlcXVpcmUoY29uZmlnRmlsZSkuZXNsaW50Q29uZmlnKSB7XG4gICAgICAgIHJldHVybiBjb25maWdGaWxlXG4gICAgICB9XG4gICAgICAvLyBJZiB3ZSBhcmUgaGVyZSwgd2UgZm91bmQgYSBwYWNrYWdlLmpzb24gd2l0aG91dCBhbiBlc2xpbnQgY29uZmlnXG4gICAgICAvLyBpbiBhIGRpciB3aXRob3V0IGFueSBvdGhlciBlc2xpbnQgY29uZmlnIGZpbGVzXG4gICAgICAvLyAoYmVjYXVzZSAncGFja2FnZS5qc29uJyBpcyBsYXN0IGluIHRoZSBjYWxsIHRvIGZpbmRDYWNoZWQpXG4gICAgICAvLyBTbywga2VlcCBsb29raW5nIGZyb20gdGhlIHBhcmVudCBkaXJlY3RvcnlcbiAgICAgIHJldHVybiBnZXRDb25maWdQYXRoKFBhdGgucmVzb2x2ZShQYXRoLmRpcm5hbWUoY29uZmlnRmlsZSksICcuLicpKVxuICAgIH1cbiAgICByZXR1cm4gY29uZmlnRmlsZVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWxhdGl2ZVBhdGgoZmlsZURpciwgZmlsZVBhdGgsIGNvbmZpZywgcHJvamVjdFBhdGgpIHtcbiAgY29uc3QgaWdub3JlRmlsZSA9IGNvbmZpZy5hZHZhbmNlZC5kaXNhYmxlRXNsaW50SWdub3JlID8gbnVsbCA6IGZpbmRDYWNoZWQoZmlsZURpciwgJy5lc2xpbnRpZ25vcmUnKVxuXG4gIC8vIElmIHdlIGNhbiBmaW5kIGFuIC5lc2xpbnRpZ25vcmUgZmlsZSwgd2UgY2FuIHNldCBjd2QgdGhlcmVcbiAgLy8gKGJlY2F1c2UgdGhleSBhcmUgZXhwZWN0ZWQgdG8gYmUgYXQgdGhlIHByb2plY3Qgcm9vdClcbiAgaWYgKGlnbm9yZUZpbGUpIHtcbiAgICBjb25zdCBpZ25vcmVEaXIgPSBQYXRoLmRpcm5hbWUoaWdub3JlRmlsZSlcbiAgICBwcm9jZXNzLmNoZGlyKGlnbm9yZURpcilcbiAgICByZXR1cm4gUGF0aC5yZWxhdGl2ZShpZ25vcmVEaXIsIGZpbGVQYXRoKVxuICB9XG4gIC8vIE90aGVyd2lzZSwgd2UnbGwgc2V0IHRoZSBjd2QgdG8gdGhlIGF0b20gcHJvamVjdCByb290IGFzIGxvbmcgYXMgdGhhdCBleGlzdHNcbiAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgcHJvY2Vzcy5jaGRpcihwcm9qZWN0UGF0aClcbiAgICByZXR1cm4gUGF0aC5yZWxhdGl2ZShwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG4gIH1cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSB0aGUgZmlsZSBsb2NhdGlvbiBpdHNlbGZcbiAgcHJvY2Vzcy5jaGRpcihmaWxlRGlyKVxuICByZXR1cm4gUGF0aC5iYXNlbmFtZShmaWxlUGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENMSUVuZ2luZU9wdGlvbnModHlwZSwgY29uZmlnLCBydWxlcywgZmlsZVBhdGgsIGZpbGVEaXIsIGdpdmVuQ29uZmlnUGF0aCkge1xuICBjb25zdCBjbGlFbmdpbmVDb25maWcgPSB7XG4gICAgcnVsZXMsXG4gICAgaWdub3JlOiAhY29uZmlnLmFkdmFuY2VkLmRpc2FibGVFc2xpbnRJZ25vcmUsXG4gICAgZml4OiB0eXBlID09PSAnZml4J1xuICB9XG5cbiAgY29uc3QgaWdub3JlRmlsZSA9IGNvbmZpZy5hZHZhbmNlZC5kaXNhYmxlRXNsaW50SWdub3JlID8gbnVsbCA6IGZpbmRDYWNoZWQoZmlsZURpciwgJy5lc2xpbnRpZ25vcmUnKVxuICBpZiAoaWdub3JlRmlsZSkge1xuICAgIGNsaUVuZ2luZUNvbmZpZy5pZ25vcmVQYXRoID0gaWdub3JlRmlsZVxuICB9XG5cbiAgY2xpRW5naW5lQ29uZmlnLnJ1bGVQYXRocyA9IGNvbmZpZy5hZHZhbmNlZC5lc2xpbnRSdWxlc0RpcnMubWFwKChwYXRoKSA9PiB7XG4gICAgY29uc3QgcnVsZXNEaXIgPSBjbGVhblBhdGgocGF0aClcbiAgICBpZiAoIVBhdGguaXNBYnNvbHV0ZShydWxlc0RpcikpIHtcbiAgICAgIHJldHVybiBmaW5kQ2FjaGVkKGZpbGVEaXIsIHJ1bGVzRGlyKVxuICAgIH1cbiAgICByZXR1cm4gcnVsZXNEaXJcbiAgfSkuZmlsdGVyKHBhdGggPT4gcGF0aClcblxuICBpZiAoZ2l2ZW5Db25maWdQYXRoID09PSBudWxsICYmIGNvbmZpZy5nbG9iYWwuZXNsaW50cmNQYXRoKSB7XG4gICAgLy8gSWYgd2UgZGlkbid0IGZpbmQgYSBjb25maWd1cmF0aW9uIHVzZSB0aGUgZmFsbGJhY2sgZnJvbSB0aGUgc2V0dGluZ3NcbiAgICBjbGlFbmdpbmVDb25maWcuY29uZmlnRmlsZSA9IGNsZWFuUGF0aChjb25maWcuZ2xvYmFsLmVzbGludHJjUGF0aClcbiAgfVxuXG4gIHJldHVybiBjbGlFbmdpbmVDb25maWdcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IG9mIHJ1bGVzIHVzZWQgZm9yIGEgbGludCBqb2JcbiAqIEBwYXJhbSAge09iamVjdH0gY2xpRW5naW5lIFRoZSBDTElFbmdpbmUgaW5zdGFuY2UgdXNlZCBmb3IgdGhlIGxpbnQgam9iXG4gKiBAcmV0dXJuIHtNYXB9ICAgICAgICAgICAgICBBIE1hcCBvZiB0aGUgcnVsZXMgdXNlZCwgcnVsZSBuYW1lcyBhcyBrZXlzLCBydWxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzIGFzIHRoZSBjb250ZW50cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJ1bGVzKGNsaUVuZ2luZSkge1xuICAvLyBQdWxsIHRoZSBsaXN0IG9mIHJ1bGVzIHVzZWQgZGlyZWN0bHkgZnJvbSB0aGUgQ0xJRW5naW5lXG4gIC8vIEFkZGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L3B1bGwvOTc4MlxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNsaUVuZ2luZSwgJ2dldFJ1bGVzJykpIHtcbiAgICByZXR1cm4gY2xpRW5naW5lLmdldFJ1bGVzKClcbiAgfVxuXG4gIC8vIEF0dGVtcHQgdG8gdXNlIHRoZSBpbnRlcm5hbCAodW5kb2N1bWVudGVkKSBgbGludGVyYCBpbnN0YW5jZSBhdHRhY2hlZCB0b1xuICAvLyB0aGUgQ0xJRW5naW5lIHRvIGdldCB0aGUgbG9hZGVkIHJ1bGVzIChpbmNsdWRpbmcgcGx1Z2luIHJ1bGVzKS5cbiAgLy8gQWRkZWQgaW4gRVNMaW50IHY0XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2xpRW5naW5lLCAnbGludGVyJykpIHtcbiAgICByZXR1cm4gY2xpRW5naW5lLmxpbnRlci5nZXRSdWxlcygpXG4gIH1cblxuICAvLyBPbGRlciB2ZXJzaW9ucyBvZiBFU0xpbnQgZG9uJ3QgKGVhc2lseSkgc3VwcG9ydCBnZXR0aW5nIGEgbGlzdCBvZiBydWxlc1xuICByZXR1cm4gbmV3IE1hcCgpXG59XG5cbi8qKlxuICogR2l2ZW4gYW4gZXhpdGluZyBydWxlIGxpc3QgYW5kIGEgbmV3IHJ1bGUgbGlzdCwgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZXJlXG4gKiBoYXZlIGJlZW4gY2hhbmdlcy5cbiAqIE5PVEU6IFRoaXMgb25seSBhY2NvdW50cyBmb3IgcHJlc2VuY2Ugb2YgdGhlIHJ1bGVzLCBjaGFuZ2VzIHRvIHRoZWlyIG1ldGFkYXRhXG4gKiBhcmUgbm90IHRha2VuIGludG8gYWNjb3VudC5cbiAqIEBwYXJhbSAge01hcH0gbmV3UnVsZXMgICAgIEEgTWFwIG9mIHRoZSBuZXcgcnVsZXNcbiAqIEBwYXJhbSAge01hcH0gY3VycmVudFJ1bGVzIEEgTWFwIG9mIHRoZSBjdXJyZW50IHJ1bGVzXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGVyZSB3ZXJlIGNoYW5nZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpZFJ1bGVzQ2hhbmdlKGN1cnJlbnRSdWxlcywgbmV3UnVsZXMpIHtcbiAgcmV0dXJuICEoY3VycmVudFJ1bGVzLnNpemUgPT09IG5ld1J1bGVzLnNpemVcbiAgICAmJiBBcnJheS5mcm9tKGN1cnJlbnRSdWxlcy5rZXlzKCkpLmV2ZXJ5KHJ1bGVJZCA9PiBuZXdSdWxlcy5oYXMocnVsZUlkKSkpXG59XG4iXX0=