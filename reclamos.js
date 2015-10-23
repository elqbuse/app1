
Router.route('/reclamos', {
  template: 'reclamos',
});

// ============================================================================
if (Meteor.isServer) {

  Meteor.publish('gridReclamos', MyGrid.publication({
    collection : Reclamos,
    pagesize   : 25,
    filter     : {},
    options    : {fields:{nro:1, tipo:1}, sort: {nro:-1}},
  }));

} // endif (Meteor.isServer)
// ============================================================================

if (Meteor.isClient) {

  Template.reclamos.viewmodel(
    MyGrid.viewmodel({
      publication: 'gridReclamos',
      sort:{nro:1},
      filter:{tipo:"O"},
    }),
  );

} // endif (Meteor.isClient)
// ============================================================================

