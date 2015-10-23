
Router.route('/reclamos', {
  template: 'reclamos',
});

// ============================================================================
if (Meteor.isServer) {

  Meteor.publish('gridReclamos', MyGrid.publication({
    collection : Reclamos,
    pagesize   : 25,
    filter     : {},
    // options    : {fields:{nro:1, tipo:1, notas:1}, sort: {nro:-1}},
    options    : {fields:{nro:1, tipo:1, notas:1} /*, sort: {...}, ...*/},
  }));

} // endif (Meteor.isServer)
// ============================================================================

if (Meteor.isClient) {

  Template.reclamos.viewmodel(
    MyGrid.viewmodel({
      publication: 'gridReclamos',
      sort:{nro:-1},
      filter:{tipo:"O"},
    }),
    {
      evt_nextPage: function(event) {
        this.gridPage('next') ;
      },
      evt_prevPage: function(event) {
        this.gridPage('prev') ;
      },
      evt_prev10Page: function(event) {
        this.gridPage(this.gridPage()-10) ;
      },
      evt_next10Page: function(event) {
        this.gridPage(this.gridPage()+10) ;
      },
    }
  );

} // endif (Meteor.isClient)
// ============================================================================
