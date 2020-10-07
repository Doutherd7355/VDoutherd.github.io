'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var init = function init() {
  var contextMenu = {
    '.remote-ftp-view .entries.list-tree:not(.multi-select) .directory': {
      enabled: atom.config.get('remote-ftp.context.enableCopyFilename'),
      command: [{
        label: 'Copy name',
        command: 'remote-ftp:copy-name'
      }, {
        type: 'separator'
      }]
    },
    '.remote-ftp-view .entries.list-tree:not(.multi-select) .file': {
      enabled: atom.config.get('remote-ftp.context.enableCopyFilename'),
      command: [{
        label: 'Copy filename',
        command: 'remote-ftp:copy-name'
      }, {
        type: 'separator'
      }]
    }
  };
  return contextMenu;
};

exports['default'] = init;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9tZW51cy9jb250ZXh0TWVudS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O0FBRVosSUFBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLEdBQVM7QUFDakIsTUFBTSxXQUFXLEdBQUc7QUFDbEIsdUVBQW1FLEVBQUU7QUFDbkUsYUFBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDO0FBQ2pFLGFBQU8sRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLFdBQVc7QUFDbEIsZUFBTyxFQUFFLHNCQUFzQjtPQUNoQyxFQUFFO0FBQ0QsWUFBSSxFQUFFLFdBQVc7T0FDbEIsQ0FBQztLQUNIO0FBQ0Qsa0VBQThELEVBQUU7QUFDOUQsYUFBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxDQUFDO0FBQ2pFLGFBQU8sRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLGVBQWU7QUFDdEIsZUFBTyxFQUFFLHNCQUFzQjtPQUNoQyxFQUFFO0FBQ0QsWUFBSSxFQUFFLFdBQVc7T0FDbEIsQ0FBQztLQUNIO0dBQ0YsQ0FBQztBQUNGLFNBQU8sV0FBVyxDQUFDO0NBQ3BCLENBQUM7O3FCQUVhLElBQUkiLCJmaWxlIjoiL2hvbWUvZG91dGhlcmR2Ly5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL21lbnVzL2NvbnRleHRNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRleHRNZW51ID0ge1xuICAgICcucmVtb3RlLWZ0cC12aWV3IC5lbnRyaWVzLmxpc3QtdHJlZTpub3QoLm11bHRpLXNlbGVjdCkgLmRpcmVjdG9yeSc6IHtcbiAgICAgIGVuYWJsZWQ6IGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC5jb250ZXh0LmVuYWJsZUNvcHlGaWxlbmFtZScpLFxuICAgICAgY29tbWFuZDogW3tcbiAgICAgICAgbGFiZWw6ICdDb3B5IG5hbWUnLFxuICAgICAgICBjb21tYW5kOiAncmVtb3RlLWZ0cDpjb3B5LW5hbWUnLFxuICAgICAgfSwge1xuICAgICAgICB0eXBlOiAnc2VwYXJhdG9yJyxcbiAgICAgIH1dLFxuICAgIH0sXG4gICAgJy5yZW1vdGUtZnRwLXZpZXcgLmVudHJpZXMubGlzdC10cmVlOm5vdCgubXVsdGktc2VsZWN0KSAuZmlsZSc6IHtcbiAgICAgIGVuYWJsZWQ6IGF0b20uY29uZmlnLmdldCgncmVtb3RlLWZ0cC5jb250ZXh0LmVuYWJsZUNvcHlGaWxlbmFtZScpLFxuICAgICAgY29tbWFuZDogW3tcbiAgICAgICAgbGFiZWw6ICdDb3B5IGZpbGVuYW1lJyxcbiAgICAgICAgY29tbWFuZDogJ3JlbW90ZS1mdHA6Y29weS1uYW1lJyxcbiAgICAgIH0sIHtcbiAgICAgICAgdHlwZTogJ3NlcGFyYXRvcicsXG4gICAgICB9XSxcbiAgICB9LFxuICB9O1xuICByZXR1cm4gY29udGV4dE1lbnU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIl19