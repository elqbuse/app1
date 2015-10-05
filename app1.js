Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer) {
  Meteor.startup(function(){
    if (Tickets.find().count() === 0) {
      _.each(_.range(1000,2000), function(t){
        Tickets.insert({title: "Ticket #" + t});
      })
    }
  })

  Meteor.publish("allTickets", function () {
    return Tickets.find(); // insecure!
  });
}

if (Meteor.isClient) {
  Meteor.subscribe('allTickets') ;
}
/*
Router.route('/', function () {
  this.render('Home', {
    data: function () { return Items.findOne({_id: this.params._id}); }
  });
});
*/

/*
Router.configure({
  layoutTemplate: 'layout'
});
*/

Router.configure({
  layoutTemplate:   'ApplicationLayout',
  notFoundTemplate: '404'
  // layoutTemplate: 'layout'
});

// Router.route('/') ;        // allows "/" route - default <body>

// Router.route('/tickets') ; // auto-load: <template name="tickets">

Router.route('/', function() {
  this.redirect('/tickets');
}) ;

Router.route('/hello', function() {
  this.response.end('hello from the server!\n');
},{where:'server'}) ;

Router.route('/tickets') ;

Router.route('/thelist', {
  template:'tickets'
}) ;

Router.route('abc', {
  path     : '/mylist',
  template : 'tickets'
}) ;

if (Meteor.isClient) {
  Template.tickets.helpers({
    allTickets: function () {
      return Tickets.find({}, {sort:{title:1}}) ;
    }
  });
}
