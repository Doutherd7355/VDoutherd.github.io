'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var isEEXIST = function isEEXIST(path, forceBtn, cancelBtn) {
  var dismissable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  atom.notifications.addWarning('Remote FTP: Already exists file in localhost', {
    detail: 'Delete or rename file before downloading folder ' + path,
    dismissable: dismissable,
    buttons: [{
      text: 'Delete file',
      className: 'btn btn-error',
      onDidClick: function onDidClick() {
        forceBtn(this);
      }
    }, {
      text: 'Cancel',
      className: 'btn btn-float-right',
      onDidClick: function onDidClick() {
        if (typeof cancelBtn === 'function') {
          cancelBtn(this);
        } else {
          this.removeNotification();
        }
      }
    }]
  });
};

exports.isEEXIST = isEEXIST;
var isEISDIR = function isEISDIR(path, forceBtn, cancelBtn) {
  var dismissable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  atom.notifications.addWarning('Remote FTP: Already exists folder in localhost', {
    detail: 'Delete or rename folder before downloading file ' + path,
    dismissable: dismissable,
    buttons: [{
      text: 'Delete folder',
      className: 'btn btn-error',
      onDidClick: function onDidClick() {
        forceBtn(this);
      }
    }, {
      text: 'Cancel',
      className: 'btn btn-float-right',
      onDidClick: function onDidClick() {
        if (typeof cancelBtn === 'function') {
          cancelBtn(this);
        } else {
          this.removeNotification();
        }
      }
    }]
  });
};

exports.isEISDIR = isEISDIR;
var isAlreadyExits = function isAlreadyExits(path) {
  var type = arguments.length <= 1 || arguments[1] === undefined ? 'folder' : arguments[1];
  var dismissable = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  atom.notifications.addWarning('Remote FTP: The ' + type + ' already exists.', {
    detail: path + ' has already on the server!',
    dismissable: dismissable
  });
};

exports.isAlreadyExits = isAlreadyExits;
var isPermissionDenied = function isPermissionDenied(path) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addWarning('Remote FTP: Permission denied', {
    detail: path + ' : Permission denied',
    dismissable: dismissable
  });
};

exports.isPermissionDenied = isPermissionDenied;
var isNoChangeGroup = function isNoChangeGroup(response) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addWarning('Remote FTP: Group privileges was not changed.', {
    detail: response.message,
    dismissable: dismissable
  });
};

exports.isNoChangeGroup = isNoChangeGroup;
var isNoChangeOwner = function isNoChangeOwner(response) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addWarning('Remote FTP: Owner privileges was not changed.', {
    detail: response.message,
    dismissable: dismissable
  });
};

exports.isNoChangeOwner = isNoChangeOwner;
var isNoChangeOwnerAndGroup = function isNoChangeOwnerAndGroup(response) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addWarning('Remote FTP: Owner and Group privileges was not changed.', {
    detail: response.message,
    dismissable: dismissable
  });
};

exports.isNoChangeOwnerAndGroup = isNoChangeOwnerAndGroup;
var isNotImplemented = function isNotImplemented(detail) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addInfo('Remote FTP: Not implemented.', {
    detail: detail,
    dismissable: dismissable
  });
};

exports.isNotImplemented = isNotImplemented;
var isGenericUploadError = function isGenericUploadError(detail) {
  var dismissable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  atom.notifications.addError('Remote FTP: Upload Error.', {
    detail: detail,
    dismissable: dismissable
  });
};
exports.isGenericUploadError = isGenericUploadError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2RvdXRoZXJkdi8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9ub3RpZmljYXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7QUFFTCxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBeUI7TUFBdkIsV0FBVyx5REFBRyxJQUFJOztBQUNwRSxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyw4Q0FBOEMsRUFBRTtBQUM1RSxVQUFNLHVEQUFxRCxJQUFJLEFBQUU7QUFDakUsZUFBVyxFQUFYLFdBQVc7QUFDWCxXQUFPLEVBQUUsQ0FDUDtBQUNFLFVBQUksRUFBRSxhQUFhO0FBQ25CLGVBQVMsRUFBRSxlQUFlO0FBQzFCLGdCQUFVLEVBQUEsc0JBQUc7QUFDWCxnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hCO0tBQ0YsRUFDRDtBQUNFLFVBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFLHFCQUFxQjtBQUNoQyxnQkFBVSxFQUFBLHNCQUFHO0FBQ1gsWUFBSSxPQUFPLFNBQVMsS0FBSyxVQUFVLEVBQUU7QUFDbkMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQixNQUFNO0FBQ0wsY0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDM0I7T0FDRjtLQUNGLENBQ0Y7R0FDRixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFFSyxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBeUI7TUFBdkIsV0FBVyx5REFBRyxJQUFJOztBQUNwRSxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxnREFBZ0QsRUFBRTtBQUM5RSxVQUFNLHVEQUFxRCxJQUFJLEFBQUU7QUFDakUsZUFBVyxFQUFYLFdBQVc7QUFDWCxXQUFPLEVBQUUsQ0FDUDtBQUNFLFVBQUksRUFBRSxlQUFlO0FBQ3JCLGVBQVMsRUFBRSxlQUFlO0FBQzFCLGdCQUFVLEVBQUEsc0JBQUc7QUFDWCxnQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2hCO0tBQ0YsRUFDRDtBQUNFLFVBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFLHFCQUFxQjtBQUNoQyxnQkFBVSxFQUFBLHNCQUFHO0FBQ1gsWUFBSSxPQUFPLFNBQVMsS0FBSyxVQUFVLEVBQUU7QUFDbkMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQixNQUFNO0FBQ0wsY0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7U0FDM0I7T0FDRjtLQUNGLENBQ0Y7R0FDRixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFFSyxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQUksSUFBSSxFQUEyQztNQUF6QyxJQUFJLHlEQUFHLFFBQVE7TUFBRSxXQUFXLHlEQUFHLEtBQUs7O0FBQ3ZFLE1BQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxzQkFBb0IsSUFBSSx1QkFBb0I7QUFDdkUsVUFBTSxFQUFLLElBQUksZ0NBQTZCO0FBQzVDLGVBQVcsRUFBWCxXQUFXO0dBQ1osQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7O0FBRUssSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxJQUFJLEVBQTBCO01BQXhCLFdBQVcseURBQUcsS0FBSzs7QUFDMUQsTUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsK0JBQStCLEVBQUU7QUFDN0QsVUFBTSxFQUFLLElBQUkseUJBQXNCO0FBQ3JDLGVBQVcsRUFBWCxXQUFXO0dBQ1osQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7O0FBRUssSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLFFBQVEsRUFBMEI7TUFBeEIsV0FBVyx5REFBRyxLQUFLOztBQUMzRCxNQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQywrQ0FBK0MsRUFBRTtBQUM3RSxVQUFNLEVBQUUsUUFBUSxDQUFDLE9BQU87QUFDeEIsZUFBVyxFQUFYLFdBQVc7R0FDWixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFFSyxJQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksUUFBUSxFQUEwQjtNQUF4QixXQUFXLHlEQUFHLEtBQUs7O0FBQzNELE1BQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLCtDQUErQyxFQUFFO0FBQzdFLFVBQU0sRUFBRSxRQUFRLENBQUMsT0FBTztBQUN4QixlQUFXLEVBQVgsV0FBVztHQUNaLENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUVLLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQXVCLENBQUksUUFBUSxFQUEwQjtNQUF4QixXQUFXLHlEQUFHLEtBQUs7O0FBQ25FLE1BQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLHlEQUF5RCxFQUFFO0FBQ3ZGLFVBQU0sRUFBRSxRQUFRLENBQUMsT0FBTztBQUN4QixlQUFXLEVBQVgsV0FBVztHQUNaLENBQUMsQ0FBQztDQUNKLENBQUM7OztBQUVLLElBQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksTUFBTSxFQUEwQjtNQUF4QixXQUFXLHlEQUFHLEtBQUs7O0FBQzFELE1BQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFO0FBQ3pELFVBQU0sRUFBTixNQUFNO0FBQ04sZUFBVyxFQUFYLFdBQVc7R0FDWixDQUFDLENBQUM7Q0FDSixDQUFDOzs7QUFFSyxJQUFNLG9CQUFvQixHQUFHLFNBQXZCLG9CQUFvQixDQUFJLE1BQU0sRUFBMEI7TUFBeEIsV0FBVyx5REFBRyxLQUFLOztBQUM5RCxNQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtBQUN2RCxVQUFNLEVBQU4sTUFBTTtBQUNOLGVBQVcsRUFBWCxXQUFXO0dBQ1osQ0FBQyxDQUFDO0NBQ0osQ0FBQyIsImZpbGUiOiIvaG9tZS9kb3V0aGVyZHYvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvbm90aWZpY2F0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgY29uc3QgaXNFRVhJU1QgPSAocGF0aCwgZm9yY2VCdG4sIGNhbmNlbEJ0biwgZGlzbWlzc2FibGUgPSB0cnVlKSA9PiB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdSZW1vdGUgRlRQOiBBbHJlYWR5IGV4aXN0cyBmaWxlIGluIGxvY2FsaG9zdCcsIHtcbiAgICBkZXRhaWw6IGBEZWxldGUgb3IgcmVuYW1lIGZpbGUgYmVmb3JlIGRvd25sb2FkaW5nIGZvbGRlciAke3BhdGh9YCxcbiAgICBkaXNtaXNzYWJsZSxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdEZWxldGUgZmlsZScsXG4gICAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZXJyb3InLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIGZvcmNlQnRuKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ0NhbmNlbCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZmxvYXQtcmlnaHQnLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FuY2VsQnRuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYW5jZWxCdG4odGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm90aWZpY2F0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0VJU0RJUiA9IChwYXRoLCBmb3JjZUJ0biwgY2FuY2VsQnRuLCBkaXNtaXNzYWJsZSA9IHRydWUpID0+IHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1JlbW90ZSBGVFA6IEFscmVhZHkgZXhpc3RzIGZvbGRlciBpbiBsb2NhbGhvc3QnLCB7XG4gICAgZGV0YWlsOiBgRGVsZXRlIG9yIHJlbmFtZSBmb2xkZXIgYmVmb3JlIGRvd25sb2FkaW5nIGZpbGUgJHtwYXRofWAsXG4gICAgZGlzbWlzc2FibGUsXG4gICAgYnV0dG9uczogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnRGVsZXRlIGZvbGRlcicsXG4gICAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZXJyb3InLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIGZvcmNlQnRuKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ0NhbmNlbCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2J0biBidG4tZmxvYXQtcmlnaHQnLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2FuY2VsQnRuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYW5jZWxCdG4odGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm90aWZpY2F0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc0FscmVhZHlFeGl0cyA9IChwYXRoLCB0eXBlID0gJ2ZvbGRlcicsIGRpc21pc3NhYmxlID0gZmFsc2UpID0+IHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoYFJlbW90ZSBGVFA6IFRoZSAke3R5cGV9IGFscmVhZHkgZXhpc3RzLmAsIHtcbiAgICBkZXRhaWw6IGAke3BhdGh9IGhhcyBhbHJlYWR5IG9uIHRoZSBzZXJ2ZXIhYCxcbiAgICBkaXNtaXNzYWJsZSxcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNQZXJtaXNzaW9uRGVuaWVkID0gKHBhdGgsIGRpc21pc3NhYmxlID0gZmFsc2UpID0+IHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoJ1JlbW90ZSBGVFA6IFBlcm1pc3Npb24gZGVuaWVkJywge1xuICAgIGRldGFpbDogYCR7cGF0aH0gOiBQZXJtaXNzaW9uIGRlbmllZGAsXG4gICAgZGlzbWlzc2FibGUsXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTm9DaGFuZ2VHcm91cCA9IChyZXNwb25zZSwgZGlzbWlzc2FibGUgPSBmYWxzZSkgPT4ge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnUmVtb3RlIEZUUDogR3JvdXAgcHJpdmlsZWdlcyB3YXMgbm90IGNoYW5nZWQuJywge1xuICAgIGRldGFpbDogcmVzcG9uc2UubWVzc2FnZSxcbiAgICBkaXNtaXNzYWJsZSxcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNOb0NoYW5nZU93bmVyID0gKHJlc3BvbnNlLCBkaXNtaXNzYWJsZSA9IGZhbHNlKSA9PiB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdSZW1vdGUgRlRQOiBPd25lciBwcml2aWxlZ2VzIHdhcyBub3QgY2hhbmdlZC4nLCB7XG4gICAgZGV0YWlsOiByZXNwb25zZS5tZXNzYWdlLFxuICAgIGRpc21pc3NhYmxlLFxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBpc05vQ2hhbmdlT3duZXJBbmRHcm91cCA9IChyZXNwb25zZSwgZGlzbWlzc2FibGUgPSBmYWxzZSkgPT4ge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnUmVtb3RlIEZUUDogT3duZXIgYW5kIEdyb3VwIHByaXZpbGVnZXMgd2FzIG5vdCBjaGFuZ2VkLicsIHtcbiAgICBkZXRhaWw6IHJlc3BvbnNlLm1lc3NhZ2UsXG4gICAgZGlzbWlzc2FibGUsXG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGlzTm90SW1wbGVtZW50ZWQgPSAoZGV0YWlsLCBkaXNtaXNzYWJsZSA9IGZhbHNlKSA9PiB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdSZW1vdGUgRlRQOiBOb3QgaW1wbGVtZW50ZWQuJywge1xuICAgIGRldGFpbCxcbiAgICBkaXNtaXNzYWJsZSxcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNHZW5lcmljVXBsb2FkRXJyb3IgPSAoZGV0YWlsLCBkaXNtaXNzYWJsZSA9IGZhbHNlKSA9PiB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUmVtb3RlIEZUUDogVXBsb2FkIEVycm9yLicsIHtcbiAgICBkZXRhaWwsXG4gICAgZGlzbWlzc2FibGUsXG4gIH0pO1xufTtcbiJdfQ==