
Router.route('/reclamos', {
  action:  function() { Router.go("/reclamos/1"); }
});

Router.route('/reclamos/:page', {
  template: 'reclamos',
});

// ============================================================================

if (Meteor.isClient) {

// ============================================================================

  Template.reclamos.viewmodel(
    // viewstate properties
    {
      autorun: function () { 
        console.log("autorun() - START") ;
        // avoid using self.xxx() as getter !!! (reactive)
        this.gridPage(Math.max(1, Router.current().params.page)) ;
        this.gridOrder({nro:-1}) ;
        this.gridLoad() ;
        console.log("autorun() - end") ;
      },
      
      gridLoad: function () {
        console.log("gridLoad() - start") ;
        
        var self=this ;
        
        Meteor.subscribe('gridReclamos', this.gridPage(), function(){
          console.log("gridLoad() - sub.ready") ;
          var result = Reclamos.find(
            {_page:self.gridPage()},
            {sort :self.gridOrder()}
          ).fetch() ;
          self.rs_gridReclamos(result) ;
          console.log("gridLoad() - rs.loaded") ;
        }) ;
        console.log("gridLoad() - end") ;
      },
      
      gridPage: 0,
      gridOrder: {},
      rs_gridReclamos: [],
      
      evt_nextPage: function(event) {
        //Router.go("/reclamos/"+(this.gridPage()+1)) ;
        console.log("evt_nextPage() - gridPage++") ;
        this.gridPage(this.gridPage()+1);
      },
      evt_prevPage: function(event) {
        //Router.go("/reclamos/"+(this.gridPage()-1)) ;
        console.log("evt_prevPage() - gridPage--") ;
        this.gridPage(this.gridPage()-1);
      },
    },
    [ "rs_gridReclamos" ]  // exported helpers
  );

// ============================================================================

} // endif (Meteor.isClient)
