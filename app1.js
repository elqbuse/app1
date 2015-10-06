Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer) {
  Meteor.startup(function(){
    if (Tickets.find().count() === 0) {
      _.each(_.range(1000,2000), function(t){
        Tickets.insert({_id: ""+t, title: "Ticket #" + t});
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

  var kkkk = null ;

  Template.tickets.onCreated(function(){
    Session.set('orden', -1) ;
  });

  Template.tickets.helpers({
    allTicketsCursor: function () {
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      console.log('local query...') ;
      return Tickets.find({},{sort:{_id:Session.get('orden')}, limit:10}) ;
    },
    allTicketsArray: function () {
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      if(kkkk === null) {
        console.log('local query...') ;
        kkkk = Tickets.find().fetch() ;
      }
      console.log('array!') ;
      kkkk = _.sortBy(kkkk, function(t){
        return Session.get('orden') * t._id ;
      });
      console.log('sorted.') ;
      return _.first(kkkk, 10) ;
      return kkkk ;
    },
    htmlTicketsList: function(){
      var clob = "" ;
      _.each(Tickets.find({}, {sort:{_id:Session.get('orden')}, limit:1000}).fetch(), function(t){
        clob = clob + "<li>:" + t.title + "</li>";
      });
      return "<ul>"+clob+"</ul>" ;
    }
  });

  Template.tickets.events({
    'click .orden': function(event, template) {
      Session.set('orden', (-1) * Session.get('orden')) ;
    }
  });
}
