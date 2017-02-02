var food=['chicken chili','mutton rezala','mishti'];

(function($){

    var FoodName = Backbone.Model.extend({});

    var FoodList = Backbone.Collection.extend({
        model:FoodName,
        url:"https://api.nutritionix.com/v1_1/search/chicken?results=0%3A20&cal_min=20&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories&appId=4e548a5e&appKey=3a3c83f63f27942106128af3fd8699d5",
        initialize:function(){
           //this.on("add",display);
        },
        parse:function(response){
            console.log(response);
            for (var i = 0; i < response.hits.length; i++) {
                var foodItem = new FoodName();
                foodItem.set({
                    name:response.hits[i].fields.item_name,
                    calorie:response.hits[i].fields.item_name
                });
                this.add(foodItem);
            }
            return this.models;
        },
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

    var FoodItemView = Backbone.View.extend({
        tagName:'div',
            template:_.template($('#food-template').html()),
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el:$('body'),

        initialize:function(){
            _.bindAll(this,'render');
            this.list = new FoodList();
            this.listenTo(this.list,'add',this.renderFoodItemView);
            this.list.fetch();

            this.render();
        },
        render:function(){
            var self = this;
            _(this.list.models).each(function(index){
                //self.appendFoodItem(FoodName);
                console.log(index.name);
            });
        },
        appendFoodItem:function(FoodName){
            var listView = new ListView({model:FoodName});
            this.$el.append(listView.render().el)
        },
        renderFoodItemView:function(FoodName){
            var foodItemView = new FoodItemView({model:FoodName});
            this.$el.append(foodItemView.render().el);
        }
    })
    var appView = new AppView();
})(jQuery);
