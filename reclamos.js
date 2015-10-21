
Router.route('/reclamos', {
  action:  function() {
    Router.go("/reclamos/1");
  },
});

Router.route('/reclamos/:page', {
  template: 'reclamos',
  waitOn: function () {
    return Meteor.subscribe('gridReclamos', Math.max(1, this.params.page)) ;
  },
});

// ============================================================================

if (Meteor.isClient) {

// ============================================================================

  Template.reclamos.viewmodel(
    // viewstate properties
    {
      autorun:  function () { this.loadPage(1*Router.current().params.page) ; },
      rs_gridReclamos: [],
      page: 0,
      loadPage: function(page) {
        var self=this ;
        console.log("Calling....  page="+page) ;
        var result = Reclamos.find({_page:page},{
                  sort    : {last:1, first:1},
                 }).fetch() ;
        console.log("Returned " + result.length + " documents.");
        self.page(page) ;
        self.rs_gridReclamos(result) ;
      },
      evt_nextPage: function(event) {
        // this.loadPage(this.page()+1) ;
        Router.go("/reclamos/"+(this.page()+1)) ;
      },
      evt_prevPage: function(event) {
        Router.go("/reclamos/"+(this.page()-1)) ;
      },
    },
    [ "rs_gridReclamos" ]  // exported helpers
  );

// ============================================================================

} // endif (Meteor.isClient)