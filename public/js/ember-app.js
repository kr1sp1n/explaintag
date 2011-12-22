var App = Em.Application.create();

App.Start = Em.View.extend({
  mouseDown: function() {
    window.alert("hello world!");
  }
});
