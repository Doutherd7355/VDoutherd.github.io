(function() {
  var fs, os, path;

  path = require("path");

  fs = require("fs");

  os = require("os");

  module.exports = function() {
    var config, defaultConfigPath, err, projectConfigPath;
    defaultConfigPath = path.normalize(path.join(os.homedir(), ".csslintrc"));
    projectConfigPath = path.normalize(path.join(atom.project.getPaths()[0], ".csslintrc"));
    config = null;
    try {
      config = JSON.parse(fs.readFileSync(defaultConfigPath, "utf-8"));
    } catch (error) {
      err = error;
      if (defaultConfigPath && err.code !== "ENOENT") {
        console.log("Error reading config file \"" + defaultConfigPath + "\": " + err);
      }
    }
    try {
      config = JSON.parse(fs.readFileSync(projectConfigPath, "utf-8"));
    } catch (error) {
      err = error;
      if (projectConfigPath && err.code !== "ENOENT") {
        console.log("Error reading config file \"" + projectConfigPath + "\": " + err);
      }
    }
    return config;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2Nzc2xpbnQvbGliL2NvbmZpZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FBVixFQUF3QixZQUF4QixDQUFmO0lBQ3BCLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBbEMsRUFBc0MsWUFBdEMsQ0FBZjtJQUNwQixNQUFBLEdBQVM7QUFFVDtNQUNFLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLGlCQUFoQixFQUFtQyxPQUFuQyxDQUFYLEVBRFg7S0FBQSxhQUFBO01BRU07TUFDSixJQUFrRixpQkFBQSxJQUFzQixHQUFHLENBQUMsSUFBSixLQUFjLFFBQXRIO1FBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw4QkFBQSxHQUFpQyxpQkFBakMsR0FBcUQsTUFBckQsR0FBOEQsR0FBMUUsRUFBQTtPQUhGOztBQUlBO01BQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsaUJBQWhCLEVBQW1DLE9BQW5DLENBQVgsRUFEWDtLQUFBLGFBQUE7TUFFTTtNQUNKLElBQWtGLGlCQUFBLElBQXNCLEdBQUcsQ0FBQyxJQUFKLEtBQWMsUUFBdEg7UUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhCQUFBLEdBQWlDLGlCQUFqQyxHQUFxRCxNQUFyRCxHQUE4RCxHQUExRSxFQUFBO09BSEY7O0FBS0EsV0FBTztFQWRRO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxub3MgPSByZXF1aXJlKFwib3NcIilcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICBkZWZhdWx0Q29uZmlnUGF0aCA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihvcy5ob21lZGlyKCksIFwiLmNzc2xpbnRyY1wiKSlcbiAgcHJvamVjdENvbmZpZ1BhdGggPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sIFwiLmNzc2xpbnRyY1wiKSlcbiAgY29uZmlnID0gbnVsbFxuXG4gIHRyeVxuICAgIGNvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGRlZmF1bHRDb25maWdQYXRoLCBcInV0Zi04XCIpKVxuICBjYXRjaCBlcnJcbiAgICBjb25zb2xlLmxvZyBcIkVycm9yIHJlYWRpbmcgY29uZmlnIGZpbGUgXFxcIlwiICsgZGVmYXVsdENvbmZpZ1BhdGggKyBcIlxcXCI6IFwiICsgZXJyICBpZiBkZWZhdWx0Q29uZmlnUGF0aCBhbmQgZXJyLmNvZGUgaXNudCBcIkVOT0VOVFwiXG4gIHRyeVxuICAgIGNvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHByb2plY3RDb25maWdQYXRoLCBcInV0Zi04XCIpKVxuICBjYXRjaCBlcnJcbiAgICBjb25zb2xlLmxvZyBcIkVycm9yIHJlYWRpbmcgY29uZmlnIGZpbGUgXFxcIlwiICsgcHJvamVjdENvbmZpZ1BhdGggKyBcIlxcXCI6IFwiICsgZXJyICBpZiBwcm9qZWN0Q29uZmlnUGF0aCBhbmQgZXJyLmNvZGUgaXNudCBcIkVOT0VOVFwiXG5cbiAgcmV0dXJuIGNvbmZpZ1xuIl19
