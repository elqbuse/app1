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

Router.configure({
  layoutTemplate:   'ApplicationLayout',
  notFoundTemplate: '404'
  // layoutTemplate: 'layout'
});

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

  var qqqq = Meteor.subscribe('allTickets') ;

  Template.tickets.onCreated(function(){
    Session.set('orden', -1) ;
  });
  
  Template.tickets.helpers({
    allTickets: function () {
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      console.log('local query!') ; 
      return Tickets.find({}, {sort:{title:Session.get('orden')}, limit:10}) ;
    }
  });
  
  Template.tickets.events({
    'click .orden': function(event, template) {
      Session.set('orden', (-1) * Session.get('orden')) ;
    }
  });
}
