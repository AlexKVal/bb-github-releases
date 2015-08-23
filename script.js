(function(_, $, Backbone) {

  var ReleaseItem = Backbone.Model.extend({});

  var Releases = Backbone.Collection.extend({
    url: 'https://api.github.com/repos/twbs/bootstrap/releases',
    model: ReleaseItem
  })

  var BodyView = Backbone.View.extend({
    tagName: 'li',
    className: "list-group-item list-group-item-warning",
    template: _.template('<p><%= line %></p>'),
    render: function () {
      var bodyLines = _.escape(this.model.attributes.body).split('\n');

      this.$el.append(
        bodyLines.map( function(line) {
          return _.template('<p><%= line %></p>')({line: line})
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

      var bodyView = new BodyView({model: this.model});
      this.$('ul').append( bodyView.render().el );

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
