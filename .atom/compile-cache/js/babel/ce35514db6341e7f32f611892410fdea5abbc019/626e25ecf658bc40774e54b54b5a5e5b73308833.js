'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  complete_strings: {
    doc: 'When enabled, this plugin will gather (short) strings in your code, and completing when inside a string will try to complete to previously seen strings. Takes a single option, maxLength, which controls the maximum length of string values to gather, and defaults to 15.',
    definition: {
      maxLength: {
        doc: '',
        type: 'number'
      }
    }
  },
  doc_comment: {
    doc: 'This plugin, which is enabled by default in the bin/tern server, parses comments before function declarations, variable declarations, and object properties. It will look for JSDoc-style type declarations, and try to parse them and add them to the inferred types, and it will treat the first sentence of comment text as the docstring for the defined variable or property.',
    definition: {
      fullDocs: {
        doc: 'Can be set to true to return the full comment text instead of the first sentence.',
        type: 'boolean'
      },
      strong: {
        doc: 'When enabled, types specified in comments take precedence over inferred types.',
        type: 'boolean'
      }
    }
  },
  node: {
    doc: 'The node.js plugin, called \"node\", provides variables that are part of the node environment, such as process and __dirname, and loads the commonjs and node_resolve plugins to allow node-style module loading. It defines types for the built-in modules that node.js provides (\"fs\", \"http\", etc).',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  node_resolve: {
    doc: 'This plugin defines the node.js module resolution strategy—things like defaulting to index.js when requiring a directory and searching node_modules directories. It depends on the modules plugin. Note that this plugin only does something meaningful when the Tern server is running on node.js itself.',
    definition: {}
  },
  modules: {
    doc: 'This is a supporting plugin to act as a dependency for other module-loading and module-resolving plugins.',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  es_modules: {
    doc: 'This plugin (es_modules) builds on top of the modules plugin to support ECMAScript 6’s import and export based module inclusion.',
    definition: {}
  },
  angular: {
    doc: 'Adds the angular object to the top-level environment, and tries to wire up some of the bizarre dependency management scheme from this library, so that dependency injections get the right types. Enabled with the name \"angular\".',
    definition: {}
  },
  requirejs: {
    doc: 'This plugin (\"requirejs\") teaches the server to understand RequireJS-style dependency management. It defines the global functions define and requirejs, and will do its best to resolve dependencies and give them their proper types.',
    defintions: {
      baseURL: {
        doc: 'The base path to prefix to dependency filenames.',
        type: 'string'
      },
      paths: {
        doc: 'An object mapping filename prefixes to specific paths. For example {\"acorn\": \"lib/acorn/\"}.',
        type: 'string'
      },
      override: {
        doc: 'An object that can be used to override some dependency names to refer to predetermined types. The value associated with a name can be a string starting with the character =, in which case the part after the = will be interpreted as a global variable (or dot-separated path) that contains the proper type. If it is a string not starting with =, it is interpreted as the path to the file that contains the code for the module. If it is an object, it is interpreted as JSON type definition.',
        type: 'string'
      }
    }
  },
  commonjs: {
    doc: 'This plugin implements CommonJS-style (require(\"foo\")) modules. It will wrap files in a file-local scope, and bind require, module, and exports in this scope. Does not implement a module resolution strategy (see for example the node_resolve plugin). Depends on the modules plugin.',
    definition: {}
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9jb25maWcvdGVybi1wbHVnaW5zLWRlZmludGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLGtCQUFnQixFQUFFO0FBQ2hCLE9BQUcsRUFBRSw4UUFBOFE7QUFDblIsY0FBVSxFQUFFO0FBQ1YsZUFBUyxFQUFFO0FBQ1QsV0FBRyxFQUFFLEVBQUU7QUFDUCxZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7R0FDRjtBQUNELGFBQVcsRUFBRTtBQUNYLE9BQUcsRUFBRSxvWEFBb1g7QUFDelgsY0FBVSxFQUFFO0FBQ1YsY0FBUSxFQUFFO0FBQ1IsV0FBRyxFQUFFLG1GQUFtRjtBQUN4RixZQUFJLEVBQUUsU0FBUztPQUNoQjtBQUNELFlBQU0sRUFBRTtBQUNOLFdBQUcsRUFBRSxnRkFBZ0Y7QUFDckYsWUFBSSxFQUFFLFNBQVM7T0FDaEI7S0FDRjtHQUNGO0FBQ0QsTUFBSSxFQUFFO0FBQ0osT0FBRyxFQUFFLDRTQUE0UztBQUNqVCxjQUFVLEVBQUU7QUFDVixjQUFRLEVBQUU7QUFDUixXQUFHLEVBQUUsK0pBQStKO0FBQ3BLLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxVQUFJLEVBQUU7QUFDSixXQUFHLEVBQUUsNklBQTZJO0FBQ2xKLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxXQUFHLEVBQUUsK1VBQStVO0FBQ3BWLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGO0FBQ0QsY0FBWSxFQUFFO0FBQ1osT0FBRyxFQUFFLDRTQUE0UztBQUNqVCxjQUFVLEVBQUUsRUFBRTtHQUNmO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsT0FBRyxFQUFFLDJHQUEyRztBQUNoSCxjQUFVLEVBQUU7QUFDVixjQUFRLEVBQUU7QUFDUixXQUFHLEVBQUUsK0pBQStKO0FBQ3BLLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxVQUFJLEVBQUU7QUFDSixXQUFHLEVBQUUsNklBQTZJO0FBQ2xKLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxhQUFPLEVBQUU7QUFDUCxXQUFHLEVBQUUsK1VBQStVO0FBQ3BWLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGO0FBQ0QsWUFBVSxFQUFFO0FBQ1YsT0FBRyxFQUFFLGtJQUFrSTtBQUN2SSxjQUFVLEVBQUUsRUFBRTtHQUNmO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsT0FBRyxFQUFFLHNPQUFzTztBQUMzTyxjQUFVLEVBQUUsRUFBRTtHQUNmO0FBQ0QsV0FBUyxFQUFFO0FBQ1QsT0FBRyxFQUFFLDBPQUEwTztBQUMvTyxjQUFVLEVBQUU7QUFDVixhQUFPLEVBQUU7QUFDUCxXQUFHLEVBQUUsa0RBQWtEO0FBQ3ZELFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxXQUFLLEVBQUU7QUFDTCxXQUFHLEVBQUUsaUdBQWlHO0FBQ3RHLFlBQUksRUFBRSxRQUFRO09BQ2Y7QUFDRCxjQUFRLEVBQUU7QUFDUixXQUFHLEVBQUUseWVBQXllO0FBQzllLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtHQUNGO0FBQ0QsVUFBUSxFQUFFO0FBQ1IsT0FBRyxFQUFFLDRSQUE0UjtBQUNqUyxjQUFVLEVBQUUsRUFBRTtHQUNmO0NBQ0YiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2NvbmZpZy90ZXJuLXBsdWdpbnMtZGVmaW50aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXBsZXRlX3N0cmluZ3M6IHtcbiAgICBkb2M6ICdXaGVuIGVuYWJsZWQsIHRoaXMgcGx1Z2luIHdpbGwgZ2F0aGVyIChzaG9ydCkgc3RyaW5ncyBpbiB5b3VyIGNvZGUsIGFuZCBjb21wbGV0aW5nIHdoZW4gaW5zaWRlIGEgc3RyaW5nIHdpbGwgdHJ5IHRvIGNvbXBsZXRlIHRvIHByZXZpb3VzbHkgc2VlbiBzdHJpbmdzLiBUYWtlcyBhIHNpbmdsZSBvcHRpb24sIG1heExlbmd0aCwgd2hpY2ggY29udHJvbHMgdGhlIG1heGltdW0gbGVuZ3RoIG9mIHN0cmluZyB2YWx1ZXMgdG8gZ2F0aGVyLCBhbmQgZGVmYXVsdHMgdG8gMTUuJyxcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICBtYXhMZW5ndGg6IHtcbiAgICAgICAgZG9jOiAnJyxcbiAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRvY19jb21tZW50OiB7XG4gICAgZG9jOiAnVGhpcyBwbHVnaW4sIHdoaWNoIGlzIGVuYWJsZWQgYnkgZGVmYXVsdCBpbiB0aGUgYmluL3Rlcm4gc2VydmVyLCBwYXJzZXMgY29tbWVudHMgYmVmb3JlIGZ1bmN0aW9uIGRlY2xhcmF0aW9ucywgdmFyaWFibGUgZGVjbGFyYXRpb25zLCBhbmQgb2JqZWN0IHByb3BlcnRpZXMuIEl0IHdpbGwgbG9vayBmb3IgSlNEb2Mtc3R5bGUgdHlwZSBkZWNsYXJhdGlvbnMsIGFuZCB0cnkgdG8gcGFyc2UgdGhlbSBhbmQgYWRkIHRoZW0gdG8gdGhlIGluZmVycmVkIHR5cGVzLCBhbmQgaXQgd2lsbCB0cmVhdCB0aGUgZmlyc3Qgc2VudGVuY2Ugb2YgY29tbWVudCB0ZXh0IGFzIHRoZSBkb2NzdHJpbmcgZm9yIHRoZSBkZWZpbmVkIHZhcmlhYmxlIG9yIHByb3BlcnR5LicsXG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgZnVsbERvY3M6IHtcbiAgICAgICAgZG9jOiAnQ2FuIGJlIHNldCB0byB0cnVlIHRvIHJldHVybiB0aGUgZnVsbCBjb21tZW50IHRleHQgaW5zdGVhZCBvZiB0aGUgZmlyc3Qgc2VudGVuY2UuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB9LFxuICAgICAgc3Ryb25nOiB7XG4gICAgICAgIGRvYzogJ1doZW4gZW5hYmxlZCwgdHlwZXMgc3BlY2lmaWVkIGluIGNvbW1lbnRzIHRha2UgcHJlY2VkZW5jZSBvdmVyIGluZmVycmVkIHR5cGVzLicsXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgbm9kZToge1xuICAgIGRvYzogJ1RoZSBub2RlLmpzIHBsdWdpbiwgY2FsbGVkIFxcXCJub2RlXFxcIiwgcHJvdmlkZXMgdmFyaWFibGVzIHRoYXQgYXJlIHBhcnQgb2YgdGhlIG5vZGUgZW52aXJvbm1lbnQsIHN1Y2ggYXMgcHJvY2VzcyBhbmQgX19kaXJuYW1lLCBhbmQgbG9hZHMgdGhlIGNvbW1vbmpzIGFuZCBub2RlX3Jlc29sdmUgcGx1Z2lucyB0byBhbGxvdyBub2RlLXN0eWxlIG1vZHVsZSBsb2FkaW5nLiBJdCBkZWZpbmVzIHR5cGVzIGZvciB0aGUgYnVpbHQtaW4gbW9kdWxlcyB0aGF0IG5vZGUuanMgcHJvdmlkZXMgKFxcXCJmc1xcXCIsIFxcXCJodHRwXFxcIiwgZXRjKS4nLFxuICAgIGRlZmluaXRpb246IHtcbiAgICAgIGRvbnRMb2FkOiB7XG4gICAgICAgIGRvYzogJ0NhbiBiZSBzZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIGR5bmFtaWMgbG9hZGluZyBvZiByZXF1aXJlZCBtb2R1bGVzIGVudGlyZWx5LCBvciB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkaXNhYmxlIGxvYWRpbmcgb2YgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZXhwcmVzc2lvbi4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvYWQ6IHtcbiAgICAgICAgZG9jOiAnSWYgZG9udExvYWQgaXNu4oCZdCBnaXZlbiwgdGhpcyBzZXR0aW5nIGlzIGNoZWNrZWQuIElmIGl0IGlzIGEgcmVndWxhciBleHByZXNzaW9uLCB0aGUgcGx1Z2luIHdpbGwgb25seSBsb2FkIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGV4cHJlc3Npb24uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGRvYzogJ0NhbiBiZSB1c2VkIHRvIGFzc2lnbiBKU09OIHR5cGUgZGVmaW5pdGlvbnMgdG8gY2VydGFpbiBtb2R1bGVzLCBzbyB0aGF0IHRob3NlIGFyZSBsb2FkZWQgaW5zdGVhZCBvZiB0aGUgc291cmNlIGNvZGUgaXRzZWxmLiBJZiBnaXZlbiwgc2hvdWxkIGJlIGFuIG9iamVjdCBtYXBwaW5nIG1vZHVsZSBuYW1lcyB0byBlaXRoZXIgSlNPTiBvYmplY3RzIGRlZmluaW5nIHRoZSB0eXBlcyBpbiB0aGUgbW9kdWxlLCBvciBhIHN0cmluZyByZWZlcnJpbmcgdG8gYSBmaWxlIG5hbWUgKHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSkgdGhhdCBjb250YWlucyB0aGUgSlNPTiBkYXRhLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBub2RlX3Jlc29sdmU6IHtcbiAgICBkb2M6ICdUaGlzIHBsdWdpbiBkZWZpbmVzIHRoZSBub2RlLmpzIG1vZHVsZSByZXNvbHV0aW9uIHN0cmF0ZWd54oCUdGhpbmdzIGxpa2UgZGVmYXVsdGluZyB0byBpbmRleC5qcyB3aGVuIHJlcXVpcmluZyBhIGRpcmVjdG9yeSBhbmQgc2VhcmNoaW5nIG5vZGVfbW9kdWxlcyBkaXJlY3Rvcmllcy4gSXQgZGVwZW5kcyBvbiB0aGUgbW9kdWxlcyBwbHVnaW4uIE5vdGUgdGhhdCB0aGlzIHBsdWdpbiBvbmx5IGRvZXMgc29tZXRoaW5nIG1lYW5pbmdmdWwgd2hlbiB0aGUgVGVybiBzZXJ2ZXIgaXMgcnVubmluZyBvbiBub2RlLmpzIGl0c2VsZi4nLFxuICAgIGRlZmluaXRpb246IHt9XG4gIH0sXG4gIG1vZHVsZXM6IHtcbiAgICBkb2M6ICdUaGlzIGlzIGEgc3VwcG9ydGluZyBwbHVnaW4gdG8gYWN0IGFzIGEgZGVwZW5kZW5jeSBmb3Igb3RoZXIgbW9kdWxlLWxvYWRpbmcgYW5kIG1vZHVsZS1yZXNvbHZpbmcgcGx1Z2lucy4nLFxuICAgIGRlZmluaXRpb246IHtcbiAgICAgIGRvbnRMb2FkOiB7XG4gICAgICAgIGRvYzogJ0NhbiBiZSBzZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIGR5bmFtaWMgbG9hZGluZyBvZiByZXF1aXJlZCBtb2R1bGVzIGVudGlyZWx5LCBvciB0byBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBkaXNhYmxlIGxvYWRpbmcgb2YgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZXhwcmVzc2lvbi4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIGxvYWQ6IHtcbiAgICAgICAgZG9jOiAnSWYgZG9udExvYWQgaXNu4oCZdCBnaXZlbiwgdGhpcyBzZXR0aW5nIGlzIGNoZWNrZWQuIElmIGl0IGlzIGEgcmVndWxhciBleHByZXNzaW9uLCB0aGUgcGx1Z2luIHdpbGwgb25seSBsb2FkIGZpbGVzIHRoYXQgbWF0Y2ggdGhlIGV4cHJlc3Npb24uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGRvYzogJ0NhbiBiZSB1c2VkIHRvIGFzc2lnbiBKU09OIHR5cGUgZGVmaW5pdGlvbnMgdG8gY2VydGFpbiBtb2R1bGVzLCBzbyB0aGF0IHRob3NlIGFyZSBsb2FkZWQgaW5zdGVhZCBvZiB0aGUgc291cmNlIGNvZGUgaXRzZWxmLiBJZiBnaXZlbiwgc2hvdWxkIGJlIGFuIG9iamVjdCBtYXBwaW5nIG1vZHVsZSBuYW1lcyB0byBlaXRoZXIgSlNPTiBvYmplY3RzIGRlZmluaW5nIHRoZSB0eXBlcyBpbiB0aGUgbW9kdWxlLCBvciBhIHN0cmluZyByZWZlcnJpbmcgdG8gYSBmaWxlIG5hbWUgKHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSkgdGhhdCBjb250YWlucyB0aGUgSlNPTiBkYXRhLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBlc19tb2R1bGVzOiB7XG4gICAgZG9jOiAnVGhpcyBwbHVnaW4gKGVzX21vZHVsZXMpIGJ1aWxkcyBvbiB0b3Agb2YgdGhlIG1vZHVsZXMgcGx1Z2luIHRvIHN1cHBvcnQgRUNNQVNjcmlwdCA24oCZcyBpbXBvcnQgYW5kIGV4cG9ydCBiYXNlZCBtb2R1bGUgaW5jbHVzaW9uLicsXG4gICAgZGVmaW5pdGlvbjoge31cbiAgfSxcbiAgYW5ndWxhcjoge1xuICAgIGRvYzogJ0FkZHMgdGhlIGFuZ3VsYXIgb2JqZWN0IHRvIHRoZSB0b3AtbGV2ZWwgZW52aXJvbm1lbnQsIGFuZCB0cmllcyB0byB3aXJlIHVwIHNvbWUgb2YgdGhlIGJpemFycmUgZGVwZW5kZW5jeSBtYW5hZ2VtZW50IHNjaGVtZSBmcm9tIHRoaXMgbGlicmFyeSwgc28gdGhhdCBkZXBlbmRlbmN5IGluamVjdGlvbnMgZ2V0IHRoZSByaWdodCB0eXBlcy4gRW5hYmxlZCB3aXRoIHRoZSBuYW1lIFxcXCJhbmd1bGFyXFxcIi4nLFxuICAgIGRlZmluaXRpb246IHt9XG4gIH0sXG4gIHJlcXVpcmVqczoge1xuICAgIGRvYzogJ1RoaXMgcGx1Z2luIChcXFwicmVxdWlyZWpzXFxcIikgdGVhY2hlcyB0aGUgc2VydmVyIHRvIHVuZGVyc3RhbmQgUmVxdWlyZUpTLXN0eWxlIGRlcGVuZGVuY3kgbWFuYWdlbWVudC4gSXQgZGVmaW5lcyB0aGUgZ2xvYmFsIGZ1bmN0aW9ucyBkZWZpbmUgYW5kIHJlcXVpcmVqcywgYW5kIHdpbGwgZG8gaXRzIGJlc3QgdG8gcmVzb2x2ZSBkZXBlbmRlbmNpZXMgYW5kIGdpdmUgdGhlbSB0aGVpciBwcm9wZXIgdHlwZXMuJyxcbiAgICBkZWZpbnRpb25zOiB7XG4gICAgICBiYXNlVVJMOiB7XG4gICAgICAgIGRvYzogJ1RoZSBiYXNlIHBhdGggdG8gcHJlZml4IHRvIGRlcGVuZGVuY3kgZmlsZW5hbWVzLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgcGF0aHM6IHtcbiAgICAgICAgZG9jOiAnQW4gb2JqZWN0IG1hcHBpbmcgZmlsZW5hbWUgcHJlZml4ZXMgdG8gc3BlY2lmaWMgcGF0aHMuIEZvciBleGFtcGxlIHtcXFwiYWNvcm5cXFwiOiBcXFwibGliL2Fjb3JuL1xcXCJ9LicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgb3ZlcnJpZGU6IHtcbiAgICAgICAgZG9jOiAnQW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgc29tZSBkZXBlbmRlbmN5IG5hbWVzIHRvIHJlZmVyIHRvIHByZWRldGVybWluZWQgdHlwZXMuIFRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBuYW1lIGNhbiBiZSBhIHN0cmluZyBzdGFydGluZyB3aXRoIHRoZSBjaGFyYWN0ZXIgPSwgaW4gd2hpY2ggY2FzZSB0aGUgcGFydCBhZnRlciB0aGUgPSB3aWxsIGJlIGludGVycHJldGVkIGFzIGEgZ2xvYmFsIHZhcmlhYmxlIChvciBkb3Qtc2VwYXJhdGVkIHBhdGgpIHRoYXQgY29udGFpbnMgdGhlIHByb3BlciB0eXBlLiBJZiBpdCBpcyBhIHN0cmluZyBub3Qgc3RhcnRpbmcgd2l0aCA9LCBpdCBpcyBpbnRlcnByZXRlZCBhcyB0aGUgcGF0aCB0byB0aGUgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBjb2RlIGZvciB0aGUgbW9kdWxlLiBJZiBpdCBpcyBhbiBvYmplY3QsIGl0IGlzIGludGVycHJldGVkIGFzIEpTT04gdHlwZSBkZWZpbml0aW9uLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBjb21tb25qczoge1xuICAgIGRvYzogJ1RoaXMgcGx1Z2luIGltcGxlbWVudHMgQ29tbW9uSlMtc3R5bGUgKHJlcXVpcmUoXFxcImZvb1xcXCIpKSBtb2R1bGVzLiBJdCB3aWxsIHdyYXAgZmlsZXMgaW4gYSBmaWxlLWxvY2FsIHNjb3BlLCBhbmQgYmluZCByZXF1aXJlLCBtb2R1bGUsIGFuZCBleHBvcnRzIGluIHRoaXMgc2NvcGUuIERvZXMgbm90IGltcGxlbWVudCBhIG1vZHVsZSByZXNvbHV0aW9uIHN0cmF0ZWd5IChzZWUgZm9yIGV4YW1wbGUgdGhlIG5vZGVfcmVzb2x2ZSBwbHVnaW4pLiBEZXBlbmRzIG9uIHRoZSBtb2R1bGVzIHBsdWdpbi4nLFxuICAgIGRlZmluaXRpb246IHt9XG4gIH1cbn07XG4iXX0=