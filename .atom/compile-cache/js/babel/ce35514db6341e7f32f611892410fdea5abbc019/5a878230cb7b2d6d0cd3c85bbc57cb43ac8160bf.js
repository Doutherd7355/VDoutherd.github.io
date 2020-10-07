Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable func-names */

var _atomSpacePenViews = require('atom-space-pen-views');

var _atomMessagePanel = require('atom-message-panel');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _ansiToHtml = require('ansi-to-html');

var _ansiToHtml2 = _interopRequireDefault(_ansiToHtml);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _headerView = require('./header-view');

var _headerView2 = _interopRequireDefault(_headerView);

var _linkPaths = require('./link-paths');

var _linkPaths2 = _interopRequireDefault(_linkPaths);

// Runs a portion of a script through an interpreter and displays it line by line
'use babel';
var ScriptView = (function (_MessagePanelView) {
  _inherits(ScriptView, _MessagePanelView);

  function ScriptView() {
    _classCallCheck(this, ScriptView);

    var headerView = new _headerView2['default']();
    _get(Object.getPrototypeOf(ScriptView.prototype), 'constructor', this).call(this, { title: headerView, rawTitle: true, closeMethod: 'destroy' });

    this.scrollTimeout = null;
    this.ansiFilter = new _ansiToHtml2['default']();
    this.headerView = headerView;

    this.showInTab = this.showInTab.bind(this);
    this.setHeaderAndShowExecutionTime = this.setHeaderAndShowExecutionTime.bind(this);
    this.addClass('script-view');
    this.addShowInTabIcon();

    _linkPaths2['default'].listen(this.body);
  }

  _createClass(ScriptView, [{
    key: 'addShowInTabIcon',
    value: function addShowInTabIcon() {
      var icon = (0, _atomSpacePenViews.$$)(function () {
        this.div({
          'class': 'heading-show-in-tab inline-block icon-file-text',
          style: 'cursor: pointer;',
          outlet: 'btnShowInTab',
          title: 'Show output in new tab'
        });
      });

      icon.click(this.showInTab);
      icon.insertBefore(this.btnAutoScroll);
    }
  }, {
    key: 'showInTab',
    value: function showInTab() {
      // concat output
      var output = '';
      for (var message of this.messages) {
        output += message.text();
      }

      // represent command context
      var context = '';
      if (this.commandContext) {
        context = '[Command: ' + this.commandContext.getRepresentation() + ']\n';
      }

      // open new tab and set content to output
      atom.workspace.open().then(function (editor) {
        return editor.setText((0, _stripAnsi2['default'])(context + output));
      });
    }
  }, {
    key: 'setHeaderAndShowExecutionTime',
    value: function setHeaderAndShowExecutionTime(returnCode, executionTime) {
      if (executionTime) {
        this.display('stdout', '[Finished in ' + executionTime.toString() + 's]');
      } else {
        this.display('stdout');
      }

      if (returnCode === 0) {
        this.setHeaderStatus('stop');
      } else {
        this.setHeaderStatus('err');
      }
    }
  }, {
    key: 'resetView',
    value: function resetView() {
      var title = arguments.length <= 0 || arguments[0] === undefined ? 'Loading...' : arguments[0];

      // Display window and load message

      this.attach();

      this.setHeaderTitle(title);
      this.setHeaderStatus('start');

      // Get script view ready
      this.clear();
    }
  }, {
    key: 'removePanel',
    value: function removePanel() {
      this.stop();
      this.detach();
      // the 'close' method from MessagePanelView actually destroys the panel
      Object.getPrototypeOf(ScriptView.prototype).close.apply(this);
    }

    // This is triggered when hitting the 'close' button on the panel
    // We are not actually closing the panel here since we want to trigger
    // 'script:close-view' which will eventually remove the panel via 'removePanel'
  }, {
    key: 'close',
    value: function close() {
      var workspaceView = atom.views.getView(atom.workspace);
      atom.commands.dispatch(workspaceView, 'script:close-view');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.display('stdout', '^C');
      this.setHeaderStatus('kill');
    }
  }, {
    key: 'createGitHubIssueLink',
    value: function createGitHubIssueLink(argType, lang) {
      var title = 'Add ' + argType + ' support for ' + lang;
      var body = '##### Platform: `' + process.platform + '`\n---\n';
      var encodedURI = encodeURI('https://github.com/rgbkrk/atom-script/issues/new?title=' + title + '&body=' + body);
      // NOTE: Replace "#" after regular encoding so we don't double escape it.
      encodedURI = encodedURI.replace(/#/g, '%23');

      var err = (0, _atomSpacePenViews.$$)(function () {
        var _this = this;

        this.p({ 'class': 'block' }, argType + ' runner not available for ' + lang + '.');
        this.p({ 'class': 'block' }, function () {
          _this.text('If it should exist, add an ');
          _this.a({ href: encodedURI }, 'issue on GitHub');
          _this.text(', or send your own pull request.');
        });
      });
      this.handleError(err);
    }
  }, {
    key: 'showUnableToRunError',
    value: function showUnableToRunError(command) {
      this.add((0, _atomSpacePenViews.$$)(function () {
        this.h1('Unable to run');
        this.pre(_underscore2['default'].escape(command));
        this.h2('Did you start Atom from the command line?');
        this.pre('  atom .');
        this.h2('Is it in your PATH?');
        this.pre('PATH: ' + _underscore2['default'].escape(process.env.PATH));
      }));
    }
  }, {
    key: 'showNoLanguageSpecified',
    value: function showNoLanguageSpecified() {
      var err = (0, _atomSpacePenViews.$$)(function () {
        this.p('You must select a language in the lower right, or save the file with an appropriate extension.');
      });
      this.handleError(err);
    }
  }, {
    key: 'showLanguageNotSupported',
    value: function showLanguageNotSupported(lang) {
      var err = (0, _atomSpacePenViews.$$)(function () {
        var _this2 = this;

        this.p({ 'class': 'block' }, 'Command not configured for ' + lang + '!');
        this.p({ 'class': 'block' }, function () {
          _this2.text('Add an ');
          _this2.a({ href: 'https://github.com/rgbkrk/atom-script/issues/new?title=Add%20support%20for%20' + lang }, 'issue on GitHub');
          _this2.text(' or send your own Pull Request.');
        });
      });
      this.handleError(err);
    }
  }, {
    key: 'handleError',
    value: function handleError(err) {
      // Display error and kill process
      this.setHeaderTitle('Error');
      this.setHeaderStatus('err');
      this.add(err);
      this.stop();
    }
  }, {
    key: 'setHeaderStatus',
    value: function setHeaderStatus(status) {
      this.headerView.setStatus(status);
    }
  }, {
    key: 'setHeaderTitle',
    value: function setHeaderTitle(title) {
      this.headerView.title.text(title);
    }
  }, {
    key: 'display',
    value: function display(css, line) {
      if (atom.config.get('script.escapeConsoleOutput')) {
        line = _underscore2['default'].escape(line);
      }

      line = this.ansiFilter.toHtml(line);
      line = (0, _linkPaths2['default'])(line);

      var _body$0 = this.body[0];
      var clientHeight = _body$0.clientHeight;
      var scrollTop = _body$0.scrollTop;
      var scrollHeight = _body$0.scrollHeight;

      // indicates that the panel is scrolled to the bottom, thus we know that
      // we are not interfering with the user's manual scrolling
      var atEnd = scrollTop >= scrollHeight - clientHeight;

      this.add((0, _atomSpacePenViews.$$)(function () {
        var _this3 = this;

        this.pre({ 'class': 'line ' + css }, function () {
          return _this3.raw(line);
        });
      }));

      if (atom.config.get('script.scrollWithOutput') && atEnd) {
        // Scroll down in a polling loop 'cause
        // we don't know when the reflow will finish.
        // See: http://stackoverflow.com/q/5017923/407845
        this.checkScrollAgain(5)();
      }
    }
  }, {
    key: 'checkScrollAgain',
    value: function checkScrollAgain(times) {
      var _this4 = this;

      return function () {
        _this4.body.scrollToBottom();

        clearTimeout(_this4.scrollTimeout);
        if (times > 1) {
          _this4.scrollTimeout = setTimeout(_this4.checkScrollAgain(times - 1), 50);
        }
      };
    }
  }, {
    key: 'copyResults',
    value: function copyResults() {
      if (this.results) {
        atom.clipboard.write((0, _stripAnsi2['default'])(this.results));
      }
    }
  }]);

  return ScriptView;
})(_atomMessagePanel.MessagePanelView);

exports['default'] = ScriptView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBR21CLHNCQUFzQjs7Z0NBQ1Isb0JBQW9COzswQkFDdkMsWUFBWTs7OzswQkFDSCxjQUFjOzs7O3lCQUNmLFlBQVk7Ozs7MEJBRVgsZUFBZTs7Ozt5QkFDaEIsY0FBYzs7Ozs7QUFWcEMsV0FBVyxDQUFDO0lBYVMsVUFBVTtZQUFWLFVBQVU7O0FBQ2xCLFdBRFEsVUFBVSxHQUNmOzBCQURLLFVBQVU7O0FBRTNCLFFBQU0sVUFBVSxHQUFHLDZCQUFnQixDQUFDO0FBQ3BDLCtCQUhpQixVQUFVLDZDQUdyQixFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUU7O0FBRXJFLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxVQUFVLEdBQUcsNkJBQWdCLENBQUM7QUFDbkMsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7O0FBRTdCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDM0MsUUFBSSxDQUFDLDZCQUE2QixHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkYsUUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM3QixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7QUFFeEIsMkJBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM3Qjs7ZUFma0IsVUFBVTs7V0FpQmIsNEJBQUc7QUFDakIsVUFBTSxJQUFJLEdBQUcsMkJBQUcsWUFBWTtBQUMxQixZQUFJLENBQUMsR0FBRyxDQUFDO0FBQ1AsbUJB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QU8sRUFBRTtBQUNoQixZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyw0QkFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztPQUMvQztLQUNGOzs7U0F0TWtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGZ1bmMtbmFtZXMgKi9cbmltcG9ydCB7ICQkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IHsgTWVzc2FnZVBhbmVsVmlldyB9IGZyb20gJ2F0b20tbWVzc2FnZS1wYW5lbCc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBBbnNpRmlsdGVyIGZyb20gJ2Fuc2ktdG8taHRtbCc7XG5pbXBvcnQgc3RyaXBBbnNpIGZyb20gJ3N0cmlwLWFuc2knO1xuXG5pbXBvcnQgSGVhZGVyVmlldyBmcm9tICcuL2hlYWRlci12aWV3JztcbmltcG9ydCBsaW5rUGF0aHMgZnJvbSAnLi9saW5rLXBhdGhzJztcblxuLy8gUnVucyBhIHBvcnRpb24gb2YgYSBzY3JpcHQgdGhyb3VnaCBhbiBpbnRlcnByZXRlciBhbmQgZGlzcGxheXMgaXQgbGluZSBieSBsaW5lXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JpcHRWaWV3IGV4dGVuZHMgTWVzc2FnZVBhbmVsVmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IGhlYWRlclZpZXcgPSBuZXcgSGVhZGVyVmlldygpO1xuICAgIHN1cGVyKHsgdGl0bGU6IGhlYWRlclZpZXcsIHJhd1RpdGxlOiB0cnVlLCBjbG9zZU1ldGhvZDogJ2Rlc3Ryb3knIH0pO1xuXG4gICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLmFuc2lGaWx0ZXIgPSBuZXcgQW5zaUZpbHRlcigpO1xuICAgIHRoaXMuaGVhZGVyVmlldyA9IGhlYWRlclZpZXc7XG5cbiAgICB0aGlzLnNob3dJblRhYiA9IHRoaXMuc2hvd0luVGFiLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zZXRIZWFkZXJBbmRTaG93RXhlY3V0aW9uVGltZSA9IHRoaXMuc2V0SGVhZGVyQW5kU2hvd0V4ZWN1dGlvblRpbWUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmFkZENsYXNzKCdzY3JpcHQtdmlldycpO1xuICAgIHRoaXMuYWRkU2hvd0luVGFiSWNvbigpO1xuXG4gICAgbGlua1BhdGhzLmxpc3Rlbih0aGlzLmJvZHkpO1xuICB9XG5cbiAgYWRkU2hvd0luVGFiSWNvbigpIHtcbiAgICBjb25zdCBpY29uID0gJCQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5kaXYoe1xuICAgICAgICBjbGFzczogJ2hlYWRpbmctc2hvdy1pbi10YWIgaW5saW5lLWJsb2NrIGljb24tZmlsZS10ZXh0JyxcbiAgICAgICAgc3R5bGU6ICdjdXJzb3I6IHBvaW50ZXI7JyxcbiAgICAgICAgb3V0bGV0OiAnYnRuU2hvd0luVGFiJyxcbiAgICAgICAgdGl0bGU6ICdTaG93IG91dHB1dCBpbiBuZXcgdGFiJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWNvbi5jbGljayh0aGlzLnNob3dJblRhYik7XG4gICAgaWNvbi5pbnNlcnRCZWZvcmUodGhpcy5idG5BdXRvU2Nyb2xsKTtcbiAgfVxuXG4gIHNob3dJblRhYigpIHtcbiAgICAvLyBjb25jYXQgb3V0cHV0XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiB0aGlzLm1lc3NhZ2VzKSB7IG91dHB1dCArPSBtZXNzYWdlLnRleHQoKTsgfVxuXG4gICAgLy8gcmVwcmVzZW50IGNvbW1hbmQgY29udGV4dFxuICAgIGxldCBjb250ZXh0ID0gJyc7XG4gICAgaWYgKHRoaXMuY29tbWFuZENvbnRleHQpIHtcbiAgICAgIGNvbnRleHQgPSBgW0NvbW1hbmQ6ICR7dGhpcy5jb21tYW5kQ29udGV4dC5nZXRSZXByZXNlbnRhdGlvbigpfV1cXG5gO1xuICAgIH1cblxuICAgIC8vIG9wZW4gbmV3IHRhYiBhbmQgc2V0IGNvbnRlbnQgdG8gb3V0cHV0XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpLnRoZW4oZWRpdG9yID0+IGVkaXRvci5zZXRUZXh0KHN0cmlwQW5zaShjb250ZXh0ICsgb3V0cHV0KSkpO1xuICB9XG5cbiAgc2V0SGVhZGVyQW5kU2hvd0V4ZWN1dGlvblRpbWUocmV0dXJuQ29kZSwgZXhlY3V0aW9uVGltZSkge1xuICAgIGlmIChleGVjdXRpb25UaW1lKSB7XG4gICAgICB0aGlzLmRpc3BsYXkoJ3N0ZG91dCcsIGBbRmluaXNoZWQgaW4gJHtleGVjdXRpb25UaW1lLnRvU3RyaW5nKCl9c11gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5KCdzdGRvdXQnKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuQ29kZSA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRIZWFkZXJTdGF0dXMoJ3N0b3AnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRIZWFkZXJTdGF0dXMoJ2VycicpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0Vmlldyh0aXRsZSA9ICdMb2FkaW5nLi4uJykge1xuICAgIC8vIERpc3BsYXkgd2luZG93IGFuZCBsb2FkIG1lc3NhZ2VcblxuICAgIHRoaXMuYXR0YWNoKCk7XG5cbiAgICB0aGlzLnNldEhlYWRlclRpdGxlKHRpdGxlKTtcbiAgICB0aGlzLnNldEhlYWRlclN0YXR1cygnc3RhcnQnKTtcblxuICAgIC8vIEdldCBzY3JpcHQgdmlldyByZWFkeVxuICAgIHRoaXMuY2xlYXIoKTtcbiAgfVxuXG4gIHJlbW92ZVBhbmVsKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgLy8gdGhlICdjbG9zZScgbWV0aG9kIGZyb20gTWVzc2FnZVBhbmVsVmlldyBhY3R1YWxseSBkZXN0cm95cyB0aGUgcGFuZWxcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoU2NyaXB0Vmlldy5wcm90b3R5cGUpLmNsb3NlLmFwcGx5KHRoaXMpO1xuICB9XG5cbiAgLy8gVGhpcyBpcyB0cmlnZ2VyZWQgd2hlbiBoaXR0aW5nIHRoZSAnY2xvc2UnIGJ1dHRvbiBvbiB0aGUgcGFuZWxcbiAgLy8gV2UgYXJlIG5vdCBhY3R1YWxseSBjbG9zaW5nIHRoZSBwYW5lbCBoZXJlIHNpbmNlIHdlIHdhbnQgdG8gdHJpZ2dlclxuICAvLyAnc2NyaXB0OmNsb3NlLXZpZXcnIHdoaWNoIHdpbGwgZXZlbnR1YWxseSByZW1vdmUgdGhlIHBhbmVsIHZpYSAncmVtb3ZlUGFuZWwnXG4gIGNsb3NlKCkge1xuICAgIGNvbnN0IHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlVmlldywgJ3NjcmlwdDpjbG9zZS12aWV3Jyk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZGlzcGxheSgnc3Rkb3V0JywgJ15DJyk7XG4gICAgdGhpcy5zZXRIZWFkZXJTdGF0dXMoJ2tpbGwnKTtcbiAgfVxuXG4gIGNyZWF0ZUdpdEh1Yklzc3VlTGluayhhcmdUeXBlLCBsYW5nKSB7XG4gICAgY29uc3QgdGl0bGUgPSBgQWRkICR7YXJnVHlwZX0gc3VwcG9ydCBmb3IgJHtsYW5nfWA7XG4gICAgY29uc3QgYm9keSA9IGAjIyMjIyBQbGF0Zm9ybTogXFxgJHtwcm9jZXNzLnBsYXRmb3JtfVxcYFxcbi0tLVxcbmA7XG4gICAgbGV0IGVuY29kZWRVUkkgPSBlbmNvZGVVUkkoYGh0dHBzOi8vZ2l0aHViLmNvbS9yZ2JrcmsvYXRvbS1zY3JpcHQvaXNzdWVzL25ldz90aXRsZT0ke3RpdGxlfSZib2R5PSR7Ym9keX1gKTtcbiAgICAvLyBOT1RFOiBSZXBsYWNlIFwiI1wiIGFmdGVyIHJlZ3VsYXIgZW5jb2Rpbmcgc28gd2UgZG9uJ3QgZG91YmxlIGVzY2FwZSBpdC5cbiAgICBlbmNvZGVkVVJJID0gZW5jb2RlZFVSSS5yZXBsYWNlKC8jL2csICclMjMnKTtcblxuICAgIGNvbnN0IGVyciA9ICQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucCh7IGNsYXNzOiAnYmxvY2snIH0sIGAke2FyZ1R5cGV9IHJ1bm5lciBub3QgYXZhaWxhYmxlIGZvciAke2xhbmd9LmApO1xuICAgICAgdGhpcy5wKHsgY2xhc3M6ICdibG9jaycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnRleHQoJ0lmIGl0IHNob3VsZCBleGlzdCwgYWRkIGFuICcpO1xuICAgICAgICB0aGlzLmEoeyBocmVmOiBlbmNvZGVkVVJJIH0sICdpc3N1ZSBvbiBHaXRIdWInKTtcbiAgICAgICAgdGhpcy50ZXh0KCcsIG9yIHNlbmQgeW91ciBvd24gcHVsbCByZXF1ZXN0LicpO1xuICAgICAgfSxcbiAgICAgICk7XG4gICAgfSk7XG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpO1xuICB9XG5cbiAgc2hvd1VuYWJsZVRvUnVuRXJyb3IoY29tbWFuZCkge1xuICAgIHRoaXMuYWRkKCQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaDEoJ1VuYWJsZSB0byBydW4nKTtcbiAgICAgIHRoaXMucHJlKF8uZXNjYXBlKGNvbW1hbmQpKTtcbiAgICAgIHRoaXMuaDIoJ0RpZCB5b3Ugc3RhcnQgQXRvbSBmcm9tIHRoZSBjb21tYW5kIGxpbmU/Jyk7XG4gICAgICB0aGlzLnByZSgnICBhdG9tIC4nKTtcbiAgICAgIHRoaXMuaDIoJ0lzIGl0IGluIHlvdXIgUEFUSD8nKTtcbiAgICAgIHRoaXMucHJlKGBQQVRIOiAke18uZXNjYXBlKHByb2Nlc3MuZW52LlBBVEgpfWApO1xuICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBzaG93Tm9MYW5ndWFnZVNwZWNpZmllZCgpIHtcbiAgICBjb25zdCBlcnIgPSAkJChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnAoJ1lvdSBtdXN0IHNlbGVjdCBhIGxhbmd1YWdlIGluIHRoZSBsb3dlciByaWdodCwgb3Igc2F2ZSB0aGUgZmlsZSB3aXRoIGFuIGFwcHJvcHJpYXRlIGV4dGVuc2lvbi4nLFxuICAgICk7XG4gICAgfSk7XG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpO1xuICB9XG5cbiAgc2hvd0xhbmd1YWdlTm90U3VwcG9ydGVkKGxhbmcpIHtcbiAgICBjb25zdCBlcnIgPSAkJChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnAoeyBjbGFzczogJ2Jsb2NrJyB9LCBgQ29tbWFuZCBub3QgY29uZmlndXJlZCBmb3IgJHtsYW5nfSFgKTtcbiAgICAgIHRoaXMucCh7IGNsYXNzOiAnYmxvY2snIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy50ZXh0KCdBZGQgYW4gJyk7XG4gICAgICAgIHRoaXMuYSh7IGhyZWY6IGBodHRwczovL2dpdGh1Yi5jb20vcmdia3JrL2F0b20tc2NyaXB0L2lzc3Vlcy9uZXc/dGl0bGU9QWRkJTIwc3VwcG9ydCUyMGZvciUyMCR7bGFuZ31gIH0sICdpc3N1ZSBvbiBHaXRIdWInKTtcbiAgICAgICAgdGhpcy50ZXh0KCcgb3Igc2VuZCB5b3VyIG93biBQdWxsIFJlcXVlc3QuJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycik7XG4gIH1cblxuICBoYW5kbGVFcnJvcihlcnIpIHtcbiAgICAvLyBEaXNwbGF5IGVycm9yIGFuZCBraWxsIHByb2Nlc3NcbiAgICB0aGlzLnNldEhlYWRlclRpdGxlKCdFcnJvcicpO1xuICAgIHRoaXMuc2V0SGVhZGVyU3RhdHVzKCdlcnInKTtcbiAgICB0aGlzLmFkZChlcnIpO1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG5cbiAgc2V0SGVhZGVyU3RhdHVzKHN0YXR1cykge1xuICAgIHRoaXMuaGVhZGVyVmlldy5zZXRTdGF0dXMoc3RhdHVzKTtcbiAgfVxuXG4gIHNldEhlYWRlclRpdGxlKHRpdGxlKSB7XG4gICAgdGhpcy5oZWFkZXJWaWV3LnRpdGxlLnRleHQodGl0bGUpO1xuICB9XG5cbiAgZGlzcGxheShjc3MsIGxpbmUpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdzY3JpcHQuZXNjYXBlQ29uc29sZU91dHB1dCcpKSB7XG4gICAgICBsaW5lID0gXy5lc2NhcGUobGluZSk7XG4gICAgfVxuXG4gICAgbGluZSA9IHRoaXMuYW5zaUZpbHRlci50b0h0bWwobGluZSk7XG4gICAgbGluZSA9IGxpbmtQYXRocyhsaW5lKTtcblxuICAgIGNvbnN0IHsgY2xpZW50SGVpZ2h0LCBzY3JvbGxUb3AsIHNjcm9sbEhlaWdodCB9ID0gdGhpcy5ib2R5WzBdO1xuICAgIC8vIGluZGljYXRlcyB0aGF0IHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgYm90dG9tLCB0aHVzIHdlIGtub3cgdGhhdFxuICAgIC8vIHdlIGFyZSBub3QgaW50ZXJmZXJpbmcgd2l0aCB0aGUgdXNlcidzIG1hbnVhbCBzY3JvbGxpbmdcbiAgICBjb25zdCBhdEVuZCA9IHNjcm9sbFRvcCA+PSAoc2Nyb2xsSGVpZ2h0IC0gY2xpZW50SGVpZ2h0KTtcblxuICAgIHRoaXMuYWRkKCQkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucHJlKHsgY2xhc3M6IGBsaW5lICR7Y3NzfWAgfSwgKCkgPT4gdGhpcy5yYXcobGluZSkpO1xuICAgIH0pKTtcblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3NjcmlwdC5zY3JvbGxXaXRoT3V0cHV0JykgJiYgYXRFbmQpIHtcbiAgICAgIC8vIFNjcm9sbCBkb3duIGluIGEgcG9sbGluZyBsb29wICdjYXVzZVxuICAgICAgLy8gd2UgZG9uJ3Qga25vdyB3aGVuIHRoZSByZWZsb3cgd2lsbCBmaW5pc2guXG4gICAgICAvLyBTZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xLzUwMTc5MjMvNDA3ODQ1XG4gICAgICB0aGlzLmNoZWNrU2Nyb2xsQWdhaW4oNSkoKTtcbiAgICB9XG4gIH1cbiAgY2hlY2tTY3JvbGxBZ2Fpbih0aW1lcykge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmJvZHkuc2Nyb2xsVG9Cb3R0b20oKTtcblxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2Nyb2xsVGltZW91dCk7XG4gICAgICBpZiAodGltZXMgPiAxKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5jaGVja1Njcm9sbEFnYWluKHRpbWVzIC0gMSksIDUwKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY29weVJlc3VsdHMoKSB7XG4gICAgaWYgKHRoaXMucmVzdWx0cykge1xuICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoc3RyaXBBbnNpKHRoaXMucmVzdWx0cykpO1xuICAgIH1cbiAgfVxufVxuIl19