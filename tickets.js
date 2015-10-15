
Router.route('/tickets', {
  template: 'tickets',
  waitOn: function () {
    return Meteor.subscribe('allTickets') ;
  },
});

Router.route('/ticket/:_id', {
  template: 'ticket',
  waitOn: function () {
    return Meteor.subscribe('allTickets') ;   // UGLY, should optimize?
  }
});

// ============================================================================

if (Meteor.isClient) {

// ============================================================================

  Template.tickets.viewmodel(
    // viewstate properties
    {
      row_order: -1,
      evt_changeOrder: function(event) {
        this.row_order( -this.row_order() ) ;
      },
      rs_allTickets: function () {
        return Tickets.find({},{sort:{title:this.row_order()}, limit:10, reactive:false}).fetch() ;
      },
    },
    [ "rs_allTickets" ]  // exported helpers
  );

  Template.tickets_row.viewmodel({
      evt_ticketSelect: function(event) {
        Router.go("/ticket/"+this._id()) ;
      }
  });

// ============================================================================

  Template.ticket.viewmodel(
    // data context
    function () {
      return Tickets.findOne({_id: Router.current().params._id}) ;
    },
    // other viewstate properties
    {
      opt_ticketStatus: [{_id:"U", label:"Indefinido"},
                         {_id:"O", label:"Abierto"},
                         {_id:"C", label:"Cerrado"}
                        ],
      evt_Save: function(event) {
        Tickets.update(this._id(), {$set:{
          title:this.title(),
          status:this.status()
        }});
        Router.go("/tickets");
      },
    },
  );

// ============================================================================

} // endif (Meteor.isClient)
