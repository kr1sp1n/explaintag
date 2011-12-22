var ET = Ember.Application.create();

ET.User = Ember.Object.extend({
  username: "stevie",
  isLoggedIn: true
});

ET.UserStatus = Ember.View.extend({
  templateName: 'UserStatus',
  
  username: ET.User.username,
  isLoggedIn: ET.User.isLoggedIn
});

ET.Home = Ember.View.extend({
  templateName: 'Home',
  
  username: "stevie",
  isLoggedIn: true
});

