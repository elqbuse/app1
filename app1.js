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
      var t = Tickets.findOne({_id:currentId}) ;
      t.status="C";  // HACK
      return t ;
    },
    statusOptions: function () {
      return {"U":"Undef'd", "O":"Open & active", "C":"<"+'"'+"Closed"+'"'+">"};
    }
  });

  Template.ticket.events({
    'click .js-submit' : function(event, template){
      var data = {} ;
      var form = $(event.target).closest('form') ;
      // alert(template.$('input[name=_id]');
      alert(form.attr('class')) ;
      form.find('input,select,textarea').each(function(){
        ctl = $(this) ;
        alert(ctl.attr('name'));
        data[ctl.attr('name')] = ctl.val() ;
      });
      alert(JSON.stringify(data));
    },
    'keyup input[type=text]' : function(event, template){
      alert(event.currentTarget.value);
    }
  })

  
  Template.registerHelper('selectValue', function(v) {
    console.log(this+"=="+v) ;
    s = (""+this)==v ;
    console.log(s) ;
    if (s) return {selected:'selected', value:v, label:"o="+v, title:v} ;
    return {value:v, label:"o="+v, title:v} ;
  });

  Template.registerHelper('HTML_OPTIONS', function(options_map, selected) {
  //
  // TODO: 1. Support label-less (value only) for input>datalist components
  //       2. Support multiple selection
  
    var markup = "" ;
    _.each(_.keys(options_map), function(value){
      markup = markup
             + '<option value="' 
             +   _.escape(value) 
             +   (selected && selected==value ? '" selected>' : '">')
             +   _.escape(options_map[value])
             + '</option>' ;
    });
    return Spacebars.SafeString(markup) ;
  });

}
