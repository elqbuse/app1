
Router.route('/personas/:page', {
  template: 'personas',
  waitOn: function () {
    // alert ("Page = "+this.params.page) ;
    return Meteor.subscribe('allPersonas') ;
  },
});

// ============================================================================

if (Meteor.isClient) {

// ============================================================================

  Template.personas.viewmodel(
    // viewstate properties
    {
      autorun:  function () { this.loadPage(1*Router.current().params.page) ; },
      rs_gridPersonas: [],
      page: 0,
      loadPage: function(page) {
        var self=this ;
        console.log("Calling....  page="+page) ;
        Meteor.call('pagedPersonas', page, function(error, result){
          console.log("Returned " + result.length + " documents.");
          self.page(page) ;
          self.rs_gridPersonas(result) ;
        }) ;
      },
      evt_nextPage: function(event) {
        // this.loadPage(this.page()+1) ;
        Router.go("/personas/"+(this.page()+1)) ;
      },
      evt_prevPage: function(event) {
        Router.go("/personas/"+(this.page()-1)) ;
      },
      xxxrs_gridPersonas: function () {
        return Personas.find({},{
                  skip    : 10*(this.page()-1),
                  limit   : 10,
                  sort    : {last:1, first:1}, 
                  reactive: false}).fetch() ;
      },
    },
    [ "rs_gridPersonas" ]  // exported helpers
  );


  Template.personas_row.viewmodel({
  //    evt_personaSelect: function(event) {
  //      Router.go("/persona/"+this._id()) ;
  //    }
  });

  
// ============================================================================

} // endif (Meteor.isClient)
