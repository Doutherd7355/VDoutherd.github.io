'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var defaultProjectConfig = {

  ecmaVersion: 8,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  }
};

exports.defaultProjectConfig = defaultProjectConfig;
var defaultServerConfig = {

  ecmaVersion: 8,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  },
  dependencyBudget: 20000,
  ecmaScript: true
};

exports.defaultServerConfig = defaultServerConfig;
var ecmaVersions = [5, 6, 7, 8];

exports.ecmaVersions = ecmaVersions;
var availableLibs = ['browser', 'chai', 'jquery', 'react', 'underscore'];

exports.availableLibs = availableLibs;
var availablePlugins = {

  complete_strings: {

    maxLength: 15
  },
  doc_comment: {

    fullDocs: true,
    strong: false
  },
  node: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  node_resolve: {},
  modules: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  es_modules: {},
  angular: {},
  requirejs: {

    baseURL: '',
    paths: '',
    override: ''
  },
  commonjs: {}
};
exports.availablePlugins = availablePlugins;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9jb25maWcvdGVybi1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztBQUVMLElBQU0sb0JBQW9CLEdBQUc7O0FBRWxDLGFBQVcsRUFBRSxDQUFDO0FBQ2QsTUFBSSxFQUFFLEVBQUU7QUFDUixhQUFXLEVBQUUsRUFBRTtBQUNmLFVBQVEsRUFBRSxDQUNSLGlCQUFpQixDQUNsQjtBQUNELFNBQU8sRUFBRTs7QUFFUCxlQUFXLEVBQUUsSUFBSTtHQUNsQjtDQUNGLENBQUM7OztBQUVLLElBQU0sbUJBQW1CLEdBQUc7O0FBRWpDLGFBQVcsRUFBRSxDQUFDO0FBQ2QsTUFBSSxFQUFFLEVBQUU7QUFDUixhQUFXLEVBQUUsRUFBRTtBQUNmLFVBQVEsRUFBRSxDQUNSLGlCQUFpQixDQUNsQjtBQUNELFNBQU8sRUFBRTs7QUFFUCxlQUFXLEVBQUUsSUFBSTtHQUNsQjtBQUNELGtCQUFnQixFQUFFLEtBQUs7QUFDdkIsWUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQzs7O0FBRUssSUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRWxDLElBQU0sYUFBYSxHQUFHLENBRTNCLFNBQVMsRUFDVCxNQUFNLEVBQ04sUUFBUSxFQUNSLE9BQU8sRUFDUCxZQUFZLENBQ2IsQ0FBQzs7O0FBRUssSUFBTSxnQkFBZ0IsR0FBRzs7QUFFOUIsa0JBQWdCLEVBQUU7O0FBRWhCLGFBQVMsRUFBRSxFQUFFO0dBQ2Q7QUFDRCxhQUFXLEVBQUU7O0FBRVgsWUFBUSxFQUFFLElBQUk7QUFDZCxVQUFNLEVBQUUsS0FBSztHQUNkO0FBQ0QsTUFBSSxFQUFFOztBQUVKLFlBQVEsRUFBRSxFQUFFO0FBQ1osUUFBSSxFQUFFLEVBQUU7QUFDUixXQUFPLEVBQUUsRUFBRTtHQUNaO0FBQ0QsY0FBWSxFQUFFLEVBQUU7QUFDaEIsU0FBTyxFQUFFOztBQUVQLFlBQVEsRUFBRSxFQUFFO0FBQ1osUUFBSSxFQUFFLEVBQUU7QUFDUixXQUFPLEVBQUUsRUFBRTtHQUNaO0FBQ0QsWUFBVSxFQUFFLEVBQUU7QUFDZCxTQUFPLEVBQUUsRUFBRTtBQUNYLFdBQVMsRUFBRTs7QUFFVCxXQUFPLEVBQUUsRUFBRTtBQUNYLFNBQUssRUFBRSxFQUFFO0FBQ1QsWUFBUSxFQUFFLEVBQUU7R0FDYjtBQUNELFVBQVEsRUFBRSxFQUFFO0NBQ2IsQ0FBQyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0UHJvamVjdENvbmZpZyA9IHtcblxuICBlY21hVmVyc2lvbjogOCxcbiAgbGliczogW10sXG4gIGxvYWRFYWdlcmx5OiBbXSxcbiAgZG9udExvYWQ6IFtcbiAgICAnbm9kZV9tb2R1bGVzLyoqJ1xuICBdLFxuICBwbHVnaW5zOiB7XG5cbiAgICBkb2NfY29tbWVudDogdHJ1ZVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFNlcnZlckNvbmZpZyA9IHtcblxuICBlY21hVmVyc2lvbjogOCxcbiAgbGliczogW10sXG4gIGxvYWRFYWdlcmx5OiBbXSxcbiAgZG9udExvYWQ6IFtcbiAgICAnbm9kZV9tb2R1bGVzLyoqJ1xuICBdLFxuICBwbHVnaW5zOiB7XG5cbiAgICBkb2NfY29tbWVudDogdHJ1ZVxuICB9LFxuICBkZXBlbmRlbmN5QnVkZ2V0OiAyMDAwMCxcbiAgZWNtYVNjcmlwdDogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IGVjbWFWZXJzaW9ucyA9IFs1LCA2LCA3LCA4XTtcblxuZXhwb3J0IGNvbnN0IGF2YWlsYWJsZUxpYnMgPSBbXG5cbiAgJ2Jyb3dzZXInLFxuICAnY2hhaScsXG4gICdqcXVlcnknLFxuICAncmVhY3QnLFxuICAndW5kZXJzY29yZSdcbl07XG5cbmV4cG9ydCBjb25zdCBhdmFpbGFibGVQbHVnaW5zID0ge1xuXG4gIGNvbXBsZXRlX3N0cmluZ3M6IHtcblxuICAgIG1heExlbmd0aDogMTVcbiAgfSxcbiAgZG9jX2NvbW1lbnQ6IHtcblxuICAgIGZ1bGxEb2NzOiB0cnVlLFxuICAgIHN0cm9uZzogZmFsc2VcbiAgfSxcbiAgbm9kZToge1xuXG4gICAgZG9udExvYWQ6ICcnLFxuICAgIGxvYWQ6ICcnLFxuICAgIG1vZHVsZXM6ICcnXG4gIH0sXG4gIG5vZGVfcmVzb2x2ZToge30sXG4gIG1vZHVsZXM6IHtcblxuICAgIGRvbnRMb2FkOiAnJyxcbiAgICBsb2FkOiAnJyxcbiAgICBtb2R1bGVzOiAnJ1xuICB9LFxuICBlc19tb2R1bGVzOiB7fSxcbiAgYW5ndWxhcjoge30sXG4gIHJlcXVpcmVqczoge1xuXG4gICAgYmFzZVVSTDogJycsXG4gICAgcGF0aHM6ICcnLFxuICAgIG92ZXJyaWRlOiAnJ1xuICB9LFxuICBjb21tb25qczoge31cbn07XG4iXX0=