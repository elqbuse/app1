Tickets = new Mongo.Collection('tickets');

Personas = new Mongo.Collection('personas');

Reclamos = new Mongo.Collection('reclamos');

Tickets.allow({
  insert: function (userId, document) {
    return true;
  },
  update: function (userId, document) {
    return true;
  },
  remove: function (userId, document) {
    return false;
  }
});

// ============================================================================

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

  Meteor.publish("allPersonas", function () {
    return Personas.find(); // insecure!
  });

  function PagedPubFactory(config) {

    return function(page, filter, options) {     // TO-DO: merge per-call filter & options
      check(page, Number) ;
      (filter===undefined)  || check(filter, Object) ;
      (options===undefined) || check(options, Object) ;

      var meteor_collection = config.collection ;
      var mongo_collection  = meteor_collection._name ;
      var page_size         = config.pagesize ;
      var query_filter      = config.filter || {} ;
      var query_options     = config.options || {} ;

      query_options.limit   = page_size ;
      query_options.skip    = page_size*(page-1) ;

      var transform = function(doc) {
        doc._page = page ;
        return doc;
      }

      var self = this;

      var observer = meteor_collection.find(query_filter,query_options).observe({
        added: function (document) {
          self.added(mongo_collection, document._id, transform(document));
        },
        changed: function (newDocument, oldDocument) {
          self.changed(mongo_collection, newDocument._id, transform(newDocument));
        },
        removed: function (oldDocument) {
          self.removed(mongo_collection, oldDocument._id);
        }
      });

      self.onStop(function () {
        observer.stop();
      });

      self.ready();

    };
  }

  Meteor.publish("gridPersonas", PagedPubFactory({
    collection : Personas,
    pagesize   : 12,
    filter     : {$or:[{last:{$regex:/U/}},{first:{$regex:/U/}}]},
    options    : {fields:{last:1, first:1}, sort: {last:1, first:1}},
  }));

  Meteor.publish("gridReclamos", PagedPubFactory({
    collection : Reclamos,
    pagesize   : 12,
    filter     : {},
    options    : {fields:{nro:1, tipo:1}, sort: {nro:-1}},
  }));

/*
  Meteor.methods({
    pagedPersonas: function(page) {
        console.log("pagedPersonas("+page+") called from client.") ;
        var pp = Personas.find({},{
                  skip    : 30*(page-1),
                  limit   : 30,
                  sort    : {last:1, first:1},
               }).fetch() ;
        console.log("returning "+pp.length+" documents.") ;
        return pp ;
    }
  }) ;
*/

}

Router.configure({
  layoutTemplate:   'AppLayout',
  notFoundTemplate: 'AppPageNotFound',
  loadingTemplate:  'AppLoading'
});

Router.route('/', function() {
  this.redirect('/tickets');
}) ;


  /* ----------------------------------------- */
  /* EXAMPLES ONLY                             */
  /* ----------------------------------------- */

  /*
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
  */


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
