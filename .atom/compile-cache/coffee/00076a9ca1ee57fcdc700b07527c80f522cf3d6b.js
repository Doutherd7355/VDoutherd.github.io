(function() {
  var GrammarUtils, OperatingSystem, arch, base, command, os, path, ref, ref1, ref2, ref3, windows;

  path = require('path');

  ref = GrammarUtils = require('../grammar-utils'), OperatingSystem = ref.OperatingSystem, command = ref.command;

  os = OperatingSystem.platform();

  arch = OperatingSystem.architecture();

  windows = OperatingSystem.isWindows();

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: 'oscript',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-encoding=utf-8', filepath];
        }
      }
    },
    Ansible: {
      'File Based': {
        command: 'ansible-playbook',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Clojure: {
      'Selection Based': {
        command: 'lein',
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'lein',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['exec', filepath];
        }
      }
    },
    Crystal: {
      'Selection Based': {
        command: 'crystal',
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'crystal',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    D: {
      'Selection Based': {
        command: 'rdmd',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.D.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'rdmd',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Elixir: {
      'Selection Based': {
        command: 'elixir',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'elixir',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-r', filepath];
        }
      }
    },
    Erlang: {
      'Selection Based': {
        command: 'erl',
        args: function(context) {
          return ['-noshell', '-eval', (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F*': {
      'File Based': {
        command: 'fstar',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    'F#': {
      'File Based': {
        command: windows ? 'fsi' : 'fsharpi',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--exec', filepath];
        }
      }
    },
    Forth: {
      'File Based': {
        command: 'gforth',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Gherkin: {
      'File Based': {
        command: 'cucumber',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['--color', filepath];
        }
      },
      'Line Number Based': {
        command: 'cucumber',
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    Go: {
      'File Based': {
        command: 'go',
        workingDirectory: (ref1 = atom.workspace.getActivePaneItem()) != null ? (ref2 = ref1.buffer) != null ? (ref3 = ref2.file) != null ? typeof ref3.getParent === "function" ? typeof (base = ref3.getParent()).getPath === "function" ? base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0,
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          if (filepath.match(/_test.go/)) {
            return ['test', ''];
          } else {
            return ['run', filepath];
          }
        }
      }
    },
    Groovy: {
      'Selection Based': {
        command: 'groovy',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'groovy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Hy: {
      'Selection Based': {
        command: 'hy',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.hy');
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'hy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Idris: {
      'File Based': {
        command: 'idris',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath, '-o', path.basename(filepath, path.extname(filepath))];
        }
      }
    },
    InnoSetup: {
      'File Based': {
        command: 'ISCC.exe',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['/Q', filepath];
        }
      }
    },
    ioLanguage: {
      'Selection Based': {
        command: 'io',
        args: function(context) {
          return [context.getCode()];
        }
      },
      'File Based': {
        command: 'io',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-e', filepath];
        }
      }
    },
    Jolie: {
      'File Based': {
        command: 'jolie',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Julia: {
      'Selection Based': {
        command: 'julia',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'julia',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    LAMMPS: os === 'darwin' || os === 'linux' ? {
      'File Based': {
        command: 'lammps',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-log', 'none', '-in', filepath];
        }
      }
    } : void 0,
    LilyPond: {
      'File Based': {
        command: 'lilypond',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    LiveScript: {
      'Selection Based': {
        command: 'lsc',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'lsc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Makefile: {
      'Selection Based': {
        command: 'bash',
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      'File Based': {
        command: 'make',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    },
    MATLAB: {
      'Selection Based': {
        command: 'matlab',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.MATLAB.createTempFileWithCode(code);
          return ['-nodesktop', '-nosplash', '-r', "try, run('" + tmpFile + "'); while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      },
      'File Based': {
        command: 'matlab',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-nodesktop', '-nosplash', '-r', "try run('" + filepath + "'); while ~isempty(get(0,'Children')); pause(0.5); end; catch ME; disp(ME.message); exit(1); end; exit(0);"];
        }
      }
    },
    'MIPS Assembler': {
      'File Based': {
        command: 'spim',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-f', filepath];
        }
      }
    },
    NCL: {
      'Selection Based': {
        command: 'ncl',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode() + '\n\nexit';
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'ncl',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Nim: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, dir, file, filepath;
          filepath = arg.filepath;
          file = GrammarUtils.Nim.findNimProjectFile(filepath);
          dir = GrammarUtils.Nim.projectDir(filepath);
          commands = "cd '" + dir + "' && nim c --hints:off --parallelBuild:1 -r '" + file + "' 2>&1";
          return GrammarUtils.formatArgs(commands);
        }
      }
    },
    NSIS: {
      'Selection Based': {
        command: 'makensis',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'makensis',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Octave: {
      'Selection Based': {
        command: 'octave',
        args: function(context) {
          var dir;
          dir = path.dirname(context.filepath);
          return ['-p', path.dirname(context.filepath), '--eval', context.getCode()];
        }
      },
      'File Based': {
        command: 'octave',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-p', path.dirname(filepath), filepath];
        }
      }
    },
    Oz: {
      'Selection Based': {
        command: 'ozc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-c', tmpFile];
        }
      },
      'File Based': {
        command: 'ozc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-c', filepath];
        }
      }
    },
    Pascal: {
      'Selection Based': {
        command: 'fpc',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'fpc',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Povray: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, filepath;
          filepath = arg.filepath;
          commands = windows ? 'pvengine /EXIT /RENDER ' : 'povray ';
          return GrammarUtils.formatArgs(commands + filepath);
        }
      }
    },
    Prolog: {
      'File Based': {
        command: command,
        args: function(arg) {
          var commands, dir, filepath;
          filepath = arg.filepath;
          dir = path.dirname(filepath);
          commands = "cd '" + dir + "'; swipl -f '" + filepath + "' -t main --quiet";
          return GrammarUtils.formatArgs(commands);
        }
      }
    },
    PureScript: {
      'File Based': {
        command: command,
        args: function(arg) {
          var dir, filepath;
          filepath = arg.filepath;
          dir = path.dirname(filepath);
          return GrammarUtils.formatArgs("cd '" + dir + "' && pulp run");
        }
      }
    },
    R: {
      'Selection Based': {
        command: 'Rscript',
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.R.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      'File Based': {
        command: 'Rscript',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Racket: {
      'Selection Based': {
        command: 'racket',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'racket',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    "Ren'Py": {
      'File Based': {
        command: 'renpy',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath.substr(0, filepath.lastIndexOf('/game'))];
        }
      }
    },
    'Robot Framework': {
      'File Based': {
        command: 'robot',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Rust: {
      'File Based': {
        command: command,
        args: function(arg) {
          var filename, filepath;
          filepath = arg.filepath, filename = arg.filename;
          if (windows) {
            return ["/c rustc " + filepath + " && " + filename.slice(0, -3) + ".exe"];
          } else {
            return ['-c', "rustc '" + filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
          }
        }
      }
    },
    Scala: {
      'Selection Based': {
        command: 'scala',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'scala',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return [filepath];
        }
      }
    },
    Stata: {
      'Selection Based': {
        command: 'stata',
        args: function(context) {
          return ['do', context.getCode()];
        }
      },
      'File Based': {
        command: 'stata',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['do', filepath];
        }
      }
    },
    Turing: {
      'File Based': {
        command: 'turing',
        args: function(arg) {
          var filepath;
          filepath = arg.filepath;
          return ['-run', filepath];
        }
      }
    },
    "x86 and x86_64 Assembly": {
      'File Based': {
        command: 'bash',
        args: function(arg) {
          var args, filepath;
          filepath = arg.filepath;
          args = (function() {
            switch (arch) {
              case 'x32':
                return "nasm -f elf '" + filepath + "' -o /tmp/asm.out.o && ld -m elf_i386 /tmp/asm.out.o -o /tmp/asm.out && /tmp/asm.out";
              case 'x64':
                return "nasm -f elf64 '" + filepath + "' -o /tmp/asm.out.o && ld /tmp/asm.out.o -o /tmp/asm.out && /tmp/asm.out";
            }
          })();
          return ['-c', args];
        }
      },
      'Selection Based': {
        command: 'bash',
        args: function(context) {
          var args, code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code, '.asm');
          args = (function() {
            switch (arch) {
              case 'x32':
                return "nasm -f elf '" + tmpFile + "' -o /tmp/asm.out.o && ld -m elf_i386 /tmp/asm.out.o -o /tmp/asm.out && /tmp/asm.out";
              case 'x64':
                return "nasm -f elf64 '" + tmpFile + "' -o /tmp/asm.out.o && ld /tmp/asm.out.o -o /tmp/asm.out && /tmp/asm.out";
            }
          })();
          return ['-c', args];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBNkIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUE1QyxFQUFDLHFDQUFELEVBQWtCOztFQUVsQixFQUFBLEdBQUssZUFBZSxDQUFDLFFBQWhCLENBQUE7O0VBQ0wsSUFBQSxHQUFPLGVBQWUsQ0FBQyxZQUFoQixDQUFBOztFQUNQLE9BQUEsR0FBVSxlQUFlLENBQUMsU0FBaEIsQ0FBQTs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsVUFBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsT0FBQSxFQUFTLFNBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsaUJBQUQsRUFBb0IsUUFBcEI7UUFBaEIsQ0FETjtPQURGO0tBREY7SUFLQSxPQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsa0JBQVQ7UUFDQSxJQUFBLEVBQU0sU0FBQyxHQUFEO0FBQWdCLGNBQUE7VUFBZCxXQUFEO2lCQUFlLENBQUMsUUFBRDtRQUFoQixDQUROO09BREY7S0FORjtJQVVBLE9BQUEsRUFDRTtNQUFBLGlCQUFBLEVBQ0U7UUFBQSxPQUFBLEVBQVMsTUFBVDtRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQ7aUJBQWEsQ0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBZjtRQUFiLENBRE47T0FERjtNQUdBLFlBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsR0FBRDtBQUFnQixjQUFBO1VBQWQsV0FBRDtpQkFBZSxD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QixHQUEyQjtBQUp4Qjs7QUFLUCxpQkFBTyxDQUFDLElBQUQsRUFBTyxJQUFQO1FBTkgsQ0FETjtPQURGO01BVUEsaUJBQUEsRUFDRTtRQUFBLE9BQUEsRUFBUyxNQUFUO1FBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxJQUFBLEdBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQTtVQUNQLE9BQUEsR0FBVSxZQUFZLENBQUMsc0JBQWIsQ0FBb0MsSUFBcEMsRUFBMEMsTUFBMUM7VUFDVixJQUFBO0FBQU8sb0JBQU8sSUFBUDtBQUFBLG1CQUNBLEtBREE7dUJBRUgsZUFBQSxHQUFnQixPQUFoQixHQUF3QjtBQUZyQixtQkFHQSxLQUhBO3VCQUlILGlCQUFBLEdBQWtCLE9BQWxCLEdBQTBCO0FBSnZCOztBQUtQLGlCQUFPLENBQUMsSUFBRCxFQUFPLElBQVA7UUFSSCxDQUROO09BWEY7S0FoVUY7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyIjIE1hcHMgQXRvbSBHcmFtbWFyIG5hbWVzIHRvIHRoZSBjb21tYW5kIHVzZWQgYnkgdGhhdCBsYW5ndWFnZVxuIyBBcyB3ZWxsIGFzIGFueSBzcGVjaWFsIHNldHVwIGZvciBhcmd1bWVudHMuXG5cbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue09wZXJhdGluZ1N5c3RlbSwgY29tbWFuZH0gPSBHcmFtbWFyVXRpbHMgPSByZXF1aXJlICcuLi9ncmFtbWFyLXV0aWxzJ1xuXG5vcyA9IE9wZXJhdGluZ1N5c3RlbS5wbGF0Zm9ybSgpXG5hcmNoID0gT3BlcmF0aW5nU3lzdGVtLmFyY2hpdGVjdHVyZSgpXG53aW5kb3dzID0gT3BlcmF0aW5nU3lzdGVtLmlzV2luZG93cygpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgJzFDIChCU0wpJzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3NjcmlwdCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1lbmNvZGluZz11dGYtOCcsIGZpbGVwYXRoXVxuXG4gIEFuc2libGU6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2Fuc2libGUtcGxheWJvb2snXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIENsb2p1cmU6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbGVpbidcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJ2V4ZWMnLCAnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbGVpbidcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJ2V4ZWMnLCBmaWxlcGF0aF1cblxuICBDcnlzdGFsOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2NyeXN0YWwnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWydldmFsJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2NyeXN0YWwnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIEQ6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAncmRtZCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5ELmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyZG1kJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBFbGl4aXI6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZWxpeGlyJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZWxpeGlyJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLXInLCBmaWxlcGF0aF1cblxuICBFcmxhbmc6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZXJsJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLW5vc2hlbGwnLCAnLWV2YWwnLCBcIiN7Y29udGV4dC5nZXRDb2RlKCl9LCBpbml0OnN0b3AoKS5cIl1cblxuICAnRionOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdmc3RhcidcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgJ0YjJzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiBpZiB3aW5kb3dzIHRoZW4gJ2ZzaScgZWxzZSAnZnNoYXJwaSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy0tZXhlYycsIGZpbGVwYXRoXVxuXG4gIEZvcnRoOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdnZm9ydGgnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIEdoZXJraW46XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2N1Y3VtYmVyJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLS1jb2xvcicsIGZpbGVwYXRoXVxuICAgICdMaW5lIE51bWJlciBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnY3VjdW1iZXInXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctLWNvbG9yJywgY29udGV4dC5maWxlQ29sb25MaW5lKCldXG5cbiAgR286XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2dvJ1xuICAgICAgd29ya2luZ0RpcmVjdG9yeTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKT8uYnVmZmVyPy5maWxlPy5nZXRQYXJlbnQ/KCkuZ2V0UGF0aD8oKVxuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICAgIGlmIGZpbGVwYXRoLm1hdGNoKC9fdGVzdC5nby8pIHRoZW4gWyd0ZXN0JywgJyddXG4gICAgICAgIGVsc2UgWydydW4nLCBmaWxlcGF0aF1cblxuICBHcm9vdnk6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZ3Jvb3Z5J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFsnLWUnLCBjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZ3Jvb3Z5J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBIeTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdoeSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUsICcuaHknKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2h5J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBJZHJpczpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnaWRyaXMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoLCAnLW8nLCBwYXRoLmJhc2VuYW1lKGZpbGVwYXRoLCBwYXRoLmV4dG5hbWUoZmlsZXBhdGgpKV1cblxuICBJbm5vU2V0dXA6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ0lTQ0MuZXhlJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnL1EnLCBmaWxlcGF0aF1cblxuICBpb0xhbmd1YWdlOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2lvJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+IFtjb250ZXh0LmdldENvZGUoKV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnaW8nXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctZScsIGZpbGVwYXRoXVxuXG4gIEpvbGllOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdqb2xpZSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgSnVsaWE6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnanVsaWEnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdqdWxpYSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgTEFNTVBTOlxuICAgIGlmIG9zIGluIFsnZGFyd2luJywgJ2xpbnV4J11cbiAgICAgICdGaWxlIEJhc2VkJzpcbiAgICAgICAgY29tbWFuZDogJ2xhbW1wcydcbiAgICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWxvZycsICdub25lJywgJy1pbicsIGZpbGVwYXRoXVxuXG4gIExpbHlQb25kOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdsaWx5cG9uZCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgTGl2ZVNjcmlwdDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdsc2MnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdsc2MnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIE1ha2VmaWxlOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctYycsIGNvbnRleHQuZ2V0Q29kZSgpXVxuXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ21ha2UnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctZicsIGZpbGVwYXRoXVxuXG4gIE1BVExBQjpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdtYXRsYWInXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuTUFUTEFCLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFsnLW5vZGVza3RvcCcsICctbm9zcGxhc2gnLCAnLXInLCBcInRyeSwgcnVuKCcje3RtcEZpbGV9Jyk7IHdoaWxlIH5pc2VtcHR5KGdldCgwLCdDaGlsZHJlbicpKTsgcGF1c2UoMC41KTsgZW5kOyBjYXRjaCBNRTsgZGlzcChNRS5tZXNzYWdlKTsgZXhpdCgxKTsgZW5kOyBleGl0KDApO1wiXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdtYXRsYWInXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctbm9kZXNrdG9wJywgJy1ub3NwbGFzaCcsICctcicsIFwidHJ5IHJ1bignI3tmaWxlcGF0aH0nKTsgd2hpbGUgfmlzZW1wdHkoZ2V0KDAsJ0NoaWxkcmVuJykpOyBwYXVzZSgwLjUpOyBlbmQ7IGNhdGNoIE1FOyBkaXNwKE1FLm1lc3NhZ2UpOyBleGl0KDEpOyBlbmQ7IGV4aXQoMCk7XCJdXG5cbiAgJ01JUFMgQXNzZW1ibGVyJzpcbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnc3BpbSdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1mJywgZmlsZXBhdGhdXG5cbiAgTkNMOlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ25jbCdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKCkgKyAnXFxuXFxuZXhpdCdcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIHJldHVybiBbdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbmNsJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBOaW06XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgICAgZmlsZSA9IEdyYW1tYXJVdGlscy5OaW0uZmluZE5pbVByb2plY3RGaWxlKGZpbGVwYXRoKVxuICAgICAgICBkaXIgPSBHcmFtbWFyVXRpbHMuTmltLnByb2plY3REaXIoZmlsZXBhdGgpXG4gICAgICAgIGNvbW1hbmRzID0gXCJjZCAnI3tkaXJ9JyAmJiBuaW0gYyAtLWhpbnRzOm9mZiAtLXBhcmFsbGVsQnVpbGQ6MSAtciAnI3tmaWxlfScgMj4mMVwiXG4gICAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjb21tYW5kcylcbiAgICB9XG4gIE5TSVM6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnbWFrZW5zaXMnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT5cbiAgICAgICAgY29kZSA9IGNvbnRleHQuZ2V0Q29kZSgpXG4gICAgICAgIHRtcEZpbGUgPSBHcmFtbWFyVXRpbHMuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ21ha2Vuc2lzJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBPY3RhdmU6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb2N0YXZlJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGRpciA9IHBhdGguZGlybmFtZShjb250ZXh0LmZpbGVwYXRoKVxuICAgICAgICByZXR1cm4gWyctcCcsIHBhdGguZGlybmFtZShjb250ZXh0LmZpbGVwYXRoKSwgJy0tZXZhbCcsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdvY3RhdmUnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gWyctcCcsIHBhdGguZGlybmFtZShmaWxlcGF0aCksIGZpbGVwYXRoXVxuXG4gIE96OlxuICAgICdTZWxlY3Rpb24gQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ296YydcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPlxuICAgICAgICBjb2RlID0gY29udGV4dC5nZXRDb2RlKClcbiAgICAgICAgdG1wRmlsZSA9IEdyYW1tYXJVdGlscy5jcmVhdGVUZW1wRmlsZVdpdGhDb2RlKGNvZGUpXG4gICAgICAgIHJldHVybiBbJy1jJywgdG1wRmlsZV1cbiAgICAnRmlsZSBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnb3pjJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnLWMnLCBmaWxlcGF0aF1cblxuICBQYXNjYWw6XG4gICAgJ1NlbGVjdGlvbiBCYXNlZCc6XG4gICAgICBjb21tYW5kOiAnZnBjJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSlcbiAgICAgICAgcmV0dXJuIFt0bXBGaWxlXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdmcGMnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFBvdnJheTpcbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPlxuICAgICAgICBjb21tYW5kcyA9IGlmIHdpbmRvd3MgdGhlbiAncHZlbmdpbmUgL0VYSVQgL1JFTkRFUiAnIGVsc2UgJ3BvdnJheSAnXG4gICAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjb21tYW5kcytmaWxlcGF0aClcbiAgICB9XG5cbiAgUHJvbG9nOlxuICAgICdGaWxlIEJhc2VkJzoge1xuICAgICAgY29tbWFuZFxuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+XG4gICAgICAgIGRpciA9IHBhdGguZGlybmFtZShmaWxlcGF0aClcbiAgICAgICAgY29tbWFuZHMgPSBcImNkICcje2Rpcn0nOyBzd2lwbCAtZiAnI3tmaWxlcGF0aH0nIC10IG1haW4gLS1xdWlldFwiXG4gICAgICAgIHJldHVybiBHcmFtbWFyVXRpbHMuZm9ybWF0QXJncyhjb21tYW5kcylcbiAgICB9XG4gIFB1cmVTY3JpcHQ6XG4gICAgJ0ZpbGUgQmFzZWQnOiB7XG4gICAgICBjb21tYW5kXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgICAgZGlyID0gcGF0aC5kaXJuYW1lKGZpbGVwYXRoKVxuICAgICAgICByZXR1cm4gR3JhbW1hclV0aWxzLmZvcm1hdEFyZ3MoXCJjZCAnI3tkaXJ9JyAmJiBwdWxwIHJ1blwiKVxuICAgIH1cbiAgUjpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdSc2NyaXB0J1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLlIuY3JlYXRlVGVtcEZpbGVXaXRoQ29kZShjb2RlKVxuICAgICAgICByZXR1cm4gW3RtcEZpbGVdXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ1JzY3JpcHQnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFJhY2tldDpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyYWNrZXQnXG4gICAgICBhcmdzOiAoY29udGV4dCkgLT4gWyctZScsIGNvbnRleHQuZ2V0Q29kZSgpXVxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyYWNrZXQnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT4gW2ZpbGVwYXRoXVxuXG4gIFwiUmVuJ1B5XCI6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3JlbnB5J1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aC5zdWJzdHIoMCwgZmlsZXBhdGgubGFzdEluZGV4T2YoJy9nYW1lJykpXVxuXG4gICdSb2JvdCBGcmFtZXdvcmsnOlxuICAgICdGaWxlIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdyb2JvdCdcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbZmlsZXBhdGhdXG5cbiAgUnVzdDpcbiAgICAnRmlsZSBCYXNlZCc6IHtcbiAgICAgIGNvbW1hbmRcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGgsIGZpbGVuYW1lfSkgLT5cbiAgICAgICAgaWYgd2luZG93c1xuICAgICAgICAgIHJldHVybiBbXCIvYyBydXN0YyAje2ZpbGVwYXRofSAmJiAje2ZpbGVuYW1lWy4uLTRdfS5leGVcIl1cbiAgICAgICAgZWxzZSBbJy1jJywgXCJydXN0YyAnI3tmaWxlcGF0aH0nIC1vIC90bXAvcnMub3V0ICYmIC90bXAvcnMub3V0XCJdXG4gICAgfVxuICBTY2FsYTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdzY2FsYSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJy1lJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3NjYWxhJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFtmaWxlcGF0aF1cblxuICBTdGF0YTpcbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdzdGF0YSdcbiAgICAgIGFyZ3M6IChjb250ZXh0KSAtPiBbJ2RvJywgY29udGV4dC5nZXRDb2RlKCldXG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3N0YXRhJ1xuICAgICAgYXJnczogKHtmaWxlcGF0aH0pIC0+IFsnZG8nLCBmaWxlcGF0aF1cblxuICBUdXJpbmc6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ3R1cmluZydcbiAgICAgIGFyZ3M6ICh7ZmlsZXBhdGh9KSAtPiBbJy1ydW4nLCBmaWxlcGF0aF1cblxuICBcIng4NiBhbmQgeDg2XzY0IEFzc2VtYmx5XCI6XG4gICAgJ0ZpbGUgQmFzZWQnOlxuICAgICAgY29tbWFuZDogJ2Jhc2gnXG4gICAgICBhcmdzOiAoe2ZpbGVwYXRofSkgLT5cbiAgICAgICAgYXJncyA9IHN3aXRjaCBhcmNoXG4gICAgICAgICAgd2hlbiAneDMyJ1xuICAgICAgICAgICAgXCJuYXNtIC1mIGVsZiAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYXNtLm91dC5vICYmIGxkIC1tIGVsZl9pMzg2IC90bXAvYXNtLm91dC5vIC1vIC90bXAvYXNtLm91dCAmJiAvdG1wL2FzbS5vdXRcIlxuICAgICAgICAgIHdoZW4gJ3g2NCdcbiAgICAgICAgICAgIFwibmFzbSAtZiBlbGY2NCAnI3tmaWxlcGF0aH0nIC1vIC90bXAvYXNtLm91dC5vICYmIGxkIC90bXAvYXNtLm91dC5vIC1vIC90bXAvYXNtLm91dCAmJiAvdG1wL2FzbS5vdXRcIlxuICAgICAgICByZXR1cm4gWyctYycsIGFyZ3NdXG5cbiAgICAnU2VsZWN0aW9uIEJhc2VkJzpcbiAgICAgIGNvbW1hbmQ6ICdiYXNoJ1xuICAgICAgYXJnczogKGNvbnRleHQpIC0+XG4gICAgICAgIGNvZGUgPSBjb250ZXh0LmdldENvZGUoKVxuICAgICAgICB0bXBGaWxlID0gR3JhbW1hclV0aWxzLmNyZWF0ZVRlbXBGaWxlV2l0aENvZGUoY29kZSwgJy5hc20nKVxuICAgICAgICBhcmdzID0gc3dpdGNoIGFyY2hcbiAgICAgICAgICB3aGVuICd4MzInXG4gICAgICAgICAgICBcIm5hc20gLWYgZWxmICcje3RtcEZpbGV9JyAtbyAvdG1wL2FzbS5vdXQubyAmJiBsZCAtbSBlbGZfaTM4NiAvdG1wL2FzbS5vdXQubyAtbyAvdG1wL2FzbS5vdXQgJiYgL3RtcC9hc20ub3V0XCJcbiAgICAgICAgICB3aGVuICd4NjQnXG4gICAgICAgICAgICBcIm5hc20gLWYgZWxmNjQgJyN7dG1wRmlsZX0nIC1vIC90bXAvYXNtLm91dC5vICYmIGxkIC90bXAvYXNtLm91dC5vIC1vIC90bXAvYXNtLm91dCAmJiAvdG1wL2FzbS5vdXRcIlxuICAgICAgICByZXR1cm4gWyctYycsIGFyZ3NdXG4iXX0=
