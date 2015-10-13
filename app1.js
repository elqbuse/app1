Tickets = new Mongo.Collection('tickets');

if (Meteor.isServer) {

  Meteor.startup(function(){
    // devel DB dummy content
    if (Tickets.find().count() === 0) {
      _.each(_.range(1000,2000), function(t){
        Tickets.insert({_id: ""+t, title: "Ticket #" + t, status:(t<1990?"C":"O")});
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
      Router.go('/formtest/'+event.currentTarget.id) ;
    }
  });

  Template.ticket.helpers({
    currentTicket: function () {
      // reutilizamos la suscripción "allTickets"
      if(!qqqq.ready()) { console.log('loading...') ; return [] ; }
      var currentId= Router.current().getParams().id;
      var t = Tickets.findOne({_id:currentId}) ;
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

  Template.formtest.viewmodel({
    // doc: {
    //   title: 'doc{title}',
    //   status: '',},
    // "doc.title": 'doc.title',
    // "doc.status": '',
    // ticketStatusOptions: function(){
    //   return ["C", "O", "U"] ;
    ticketStatusOptions: ["U", "O", "C"],
  });
  
  Router.route('/formtest/:_id', {
    // name: 'post.show',     // for lookups: Route[..] / deflt. template / Router.go(..)
    // path: '/post/:_id',    // legacy - use parameter above instead
    // controller: 'CustomController',  // for lookup  (deflt: anonymous)

    template: 'formtest',               // dflt:  route name
    // layoutTemplate: 'appLayout',     // dflt:  Route global -- see yieldRegions below
    // loadingTemplate: 'loading',      // dflt:  Route global -- see waitOn below

    // yieldRegions: {
    //   'MyAside': {to: 'aside'},
    //   'MyFooter': {to: 'footer'}
    // },

    // regular subscriptions
    // subscriptions: function() {
    //   this.subscribe('items');                           // regular, NO-wait
    //   this.subscribe('item', this.params._id).wait();    // waitlisted ( affects ready() )
    // },

    // automatic: only waitlisted subscriptions + "loading" hook
    //   return one handle, a function, or an array
    waitOn: function () {
      return [ 
        Meteor.subscribe('allTickets'),    // UGLY, should optimize
      ];
    },

    // data context for our _layout_
    data: function () {
      return Tickets.findOne({_id: this.params._id}) ;
    },

    // You can provide any of the hook options described below in the "Using Hooks" section.
    // onRun: function () {},
    // onRerun: function () {},
    // onBeforeAction: function () {},
    // onAfterAction: function () {},
    // onStop: function () {},

    // The same thing as providing a function as the second parameter.
    //   function OR string (controller name)
    //   optional -- deflt:  render its template, layout and regions
    // action: function () {
    //   this.render();       // render all templates and regions for this route
    // }
  });


  
  /*
  Template.XXXXX.onCreated(function(){
    // only once
    // USE: set default state, get resources
    // Template.instance()  -- current template instance
    // Template.instance().data -- read-only and non-reactive.
    // Template.instance().data -- read-only and non-reactive.
  });

  Template.XXXXX.onRendered(function(){
    // only once, first insertion on the DOM
    // USE: perform custom DOM manipulations / adjustments
    // Template.instance()  -- current template instance
  });

  Template.XXXXX.onDestroyed(function(){
    // only once - removal from the DOM, without re-insertion
    // USE: cleanup state, release resources
    // Template.instance()  -- current template instance
  });

  Template.XXXXX.events({
    //
    'EVENT ELEMENT_QUERY': function(event, template) {
      // event   ( documented at Event Maps.)
      // template == .....
      // this == data-context of target/trigger element
    },
  });

  Template.XXXXX.helpers({
    //
    'HELPER_NAME': function() {
      // this == data-context  (affected by #each and #with)
      // Template.instance()  -- current template instance
    },
  });

  */
  
  
  




} // endif (Meteor.isClient)

