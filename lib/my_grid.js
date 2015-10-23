
//
// FUTURO MODULO
//
MyGrid = {} ;

MyGrid.viewmodel = function (gridConfig) {
  return {

    gridRows: [],
    gridState: {},

    autorun: function () {
      // configure defaults
      var gridBaseline = {
        page:1,
        filter:{},
        sort:{}
      } ;
      this.gridState(_.extend(gridBaseline, gridConfig)) ;
      this.gridRows([]) ;

      // reactivity-free bootstrap
      var self = this ;
      setTimeout(function(){self.gridLoad();}, 0) ;
    },

    gridLoad: function (gs) {
      console.log("gridLoad START") ;

      gs = gs || this.gridState() ;
      this.gridState(_.clone(gs)) ;

      var query_filter = gs.filter ;
      var query_options = {sort:gs.sort} ;

      var self = this ;
      Meteor.subscribe(gs.publication, gs.page, query_filter, query_options, 
      function() {
        console.log("gridLoad query") ;
        var result = Reclamos.find(
          {_page:gs.page}, {sort :gs.order}
        ).fetch() ;
        console.log("gridLoad fetch done") ;
        console.log(self) ;
        console.log(result) ;
        self.gridRows(result) ;
      }) ;
      console.log("gridLoad end") ;
    },

    gridPage: function(page){
      var gs = this.gridState() ;

      if (page===undefined) return gs.page ;

      if (page=='next') gs.page = gs.page + 1 ;
      else if (page=='prev') gs.page = gs.page==1 ? 1 : gs.page - 1 ;
      else if (page=='first') gs.page = 1 ;
      else gs.page = Math.max(1,1*page) ;

      this.gridLoad(gs) ;
    },

    blaze_helpers :{
      gridRows: function () { return Template.instance().viewmodel.gridRows() ; },
      gridPage: function () { return Template.instance().viewmodel.gridPage() ; },
    },
  }
}

MyGrid.publication = function (config) {

  return function(page, filter, options) {
    check(page, Number) ;
    (filter===undefined)  || check(filter, Object) ;
    (options===undefined) || check(options, Object) ;

    var meteor_collection = config.collection ;
    var mongo_collection  = meteor_collection._name ;
    var page_size         = config.pagesize ;
    var query_filter      = filter || config.filter || {} ;   // TO-DO: securely merge
    var query_options     = _.extend(config.options||{}, options) ;

    query_options.limit   = page_size ;
    query_options.skip    = page_size*(page-1) ;

    console.log("query_filter:") ;
    console.log(query_filter) ;
    console.log("query_options:") ;
    console.log(query_options) ;

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
