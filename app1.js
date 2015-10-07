Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer) {

  Meteor.startup(function(){
    // devel DB dummy content
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
});

Router.route('/', function() {
  this.redirect('/tickets');
}) ;

Router.route('/tickets') ;

Router.route('/ticket/:id', {
  template:'ticket'
}) ;


if (Meteor.isClient) {

  var qqqq = Meteor.subscribe('allTickets') ;

  Template.tickets.onCreated(function(){
    Session.setDefault('orden', -1) ;
  });

  Template.tickets.helpers({
    allTicketsCursor: function () {
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      console.log('local query...') ;
      return Tickets.find({},{sort:{title:Session.get('orden')}, limit:10}) ;
    }
  });

  Template.tickets.events({
    'click .js-orden': function(event, template) {
      Session.set('orden', (-1) * Session.get('orden')) ;
    },
    'click .js-ticket': function(event, template) {
      Router.go('/ticket/'+event.currentTarget.id) ;
    }
  });

  Template.ticket.helpers({
    currentTicket: function () {
      // reutilizamos la suscripción "allTickets"
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      var currentId= Router.current().getParams().id;
      return Tickets.findOne({_id:currentId}) ;
    }
  });

  Template.ticket.events({
    'keyup input[type=text]' : function(event, template){
      alert(event.currentTarget.value);
    }
  })

}
