(function(_, $, Backbone) {

  var ReleaseItem = Backbone.Model.extend({});

  var Releases = Backbone.Collection.extend({
    url: 'https://api.github.com/repos/twbs/bootstrap/releases',
    model: ReleaseItem
  })

  var BodyView = Backbone.View.extend({
    initialize: function (options) {
      this.bodyText = options.bodyText
    },
    render: function () {
      var bodyLines = _.escape(this.bodyText).split('\n');

      this.$el.append(
        bodyLines.map( function(line) {
          return _.template('<span><%= line %></span><br>')({line: line})
        })
      );

      return this;
    }
  })

  var ReleaseView = Backbone.View.extend({
    tagName: 'div',
    className: 'row',
    template: _.template( $('#release-view-tmpl').html() ),
    render: function () {
      this.$el.html( this.template(this.model.attributes) );

      new BodyView({
        el: this.$('li:last'),
        bodyText: this.model.attributes.body
      }).render();

      return this;
    }
  })

  var ReleaseViewList = Backbone.View.extend({
    el: '#app',
    initialize: function () {
      this.collection.on('add', this.addItem, this);
    },
    addItem: function (releaseItem) {
      var releaseView = new ReleaseView({model: releaseItem});
      this.$el.append( releaseView.render().el );
    },
    addAll: function () {
      this.collection.forEach(function (releaseItem) {
        this.addItem(releaseItem);
      })
    },
    render: function () {
      this.addAll();
    }
  })

  var releases = new Releases();
  var releaseViewList = new ReleaseViewList({collection: releases});

  releases.fetch();

})(_, jQuery, Backbone);
