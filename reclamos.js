
Router.route('/reclamos', {
  template: 'reclamos',
});

// ============================================================================
if (Meteor.isServer) {

}; // endif (Meteor.isServer)

// ============================================================================
if (Meteor.isClient) {

  Template.reclamos.viewmodel(
    // viewstate properties
    {
      gridConfig: {
        publication: 'gridReclamos',
        sort:{nro:1},
        filter:{tipo:"O"},
      },

      gridRowset: [],
      gridState: {},

      autorun: function () {
        var gridBaseline = {
          page:1,
          filter:{},
          sort:{}
        } ;
        this.gridState(_.extend(gridBaseline, this.gridConfig())) ;

        _.debounce(this.gridLoad, 1).bind(this)();  // break reactivity
      },

      gridLoad: function (gs) {
        gs = gs || this.gridState() ;
        this.gridState(_.clone(gs)) ;

        var query_filter = gs.filter ;
        var query_options = {sort:gs.sort} ;

        var self = this ;
        Meteor.subscribe(gs.publication, gs.page, query_filter, query_options, function(){
          var result = Reclamos.find(
            {_page:gs.page}, {sort :gs.order}
          ).fetch() ;
          self.gridRowset(result) ;
        }) ;
      },

      evt_nextPage: function(event) {
        var gs = this.gridState() ;
        gs.page = gs.page + 1 ;
        this.gridLoad(gs);
      },
      evt_prevPage: function(event) {
        var gs = this.gridState() ;
        gs.page = gs.page==1 ? 1 : gs.page - 1 ;
        this.gridLoad(gs);
      },
    },
    [ "gridRowset" ]  // exported helpers
  );

// ============================================================================

} // endif (Meteor.isClient)
