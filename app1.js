// Tickets = new Mongo.Collection('tickets');

/*
Router.route('/', function () {
  this.render('Home', {
    data: function () { return Items.findOne({_id: this.params._id}); }
  });
});
*/

/*
Router.configure({
  layoutTemplate: 'layout'
});
*/

Router.configure({
  layoutTemplate:   'ApplicationLayout',
  notFoundTemplate: '404'
  // layoutTemplate: 'layout'
});

// Router.route('/') ;        // allows "/" route - default <body>

// Router.route('/tickets') ; // auto-load: <template name="tickets">

Router.route('/', function() {
  this.redirect('/tickets');
}) ;

Router.route('/hello', function() {
  this.response.end('hello from the server!\n');
},{where:'server'}) ;

Router.route('/tickets', function() {
  this.render('Tickets');
}) ;


/*
Router.route('/tickets', function () {
  this.render('tickets');
});
*/
