
//
// FUTURO MODULO
//
MyGrid = {} ;

MyGrid.pagedPubFactory = function (config) {

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
