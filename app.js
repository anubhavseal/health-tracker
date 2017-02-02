var food=['chicken chili','mutton rezala','mishti'];

(function($){

    var FoodName = Backbone.Model.extend({});

    var FoodList = Backbone.Collection.extend({
        model:FoodName,
        initialize:function(){
            var self = this;
            _(food).each(function(index){
                var foodItem = new FoodName();
                foodItem.set({
                    name:index
                });
                console.log(foodItem.get('name'));
                self.add(foodItem);
            });
        }
    });

    var ListView = Backbone.View.extend({
        tagName:'li',
        events:{

        },
        render:function(){
            this.$el.html('<span>'+this.model.get('name')+'</span>');
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el:$('ul'),

        initialize:function(){
            _.bindAll(this,'render');
            this.list = new FoodList();
            console.log(this.list);
            this.render();
        },
        render:function(){
            var self = this;
            _(this.list.models).each(function(FoodName){
                self.appendFoodItem(FoodName);
            });
        },
        appendFoodItem:function(FoodName){
            var listView = new ListView({model:FoodName});
            this.$el.append(listView.render().el)
        }
    })
    var appView = new AppView();
})(jQuery);
