(function($) {

    var Food = Backbone.Model.extend({});

    var FoodList = Backbone.Collection.extend({
        model: Food,
        parse: function(response) {
            //console.log(response);
            for (var i = 0; i < response.hits.length; i++) {
                var foodItem = new Food();
                var item_name = response.hits[i].fields.item_name;
                var calories_present = response.hits[i].fields.nf_calories;
                foodItem.set({
                    name: item_name.substr(0, 60),
                    calorie: calories_present
                });
                this.add(foodItem);
            }
        }
    });

    var SavedFoodList = Backbone.Collection.extend({
        model: Food,
        localStorage: new Backbone.LocalStorage('selectedFoodList')
    })

    var SavedFoodItemView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-12',
        events: {
            'click #delete-food': 'deletefood'
        },
        template: _.template($('#saved-food-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        deletefood: function() {
            this.model.destroy();
        }
    })

    var FoodItemView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-12',
        template: _.template($('#food-template').html()),
        events: {
            'click #add-food': 'addFood'
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        addFood: function() {
            appView.savedFoodList.create({
                name: this.model.get('name'),
                calorie: this.model.get('calorie')
            });
        }
    });

    var AppView = Backbone.View.extend({
        el: $('body'),
        initialize: function() {
            document.getElementById("search-bar").addEventListener('keydown', this.prevent);
            this.list = new FoodList();
            this.savedFoodList = new SavedFoodList();
            this.listenTo(this.list, 'add', this.renderFoodItemView);
            this.listenTo(this.savedFoodList, 'add', this.displaySavedFoodItems);
            this.listenTo(this.savedFoodList, 'destroy', this.render);
            this.savedFoodList.fetch();
            this.totalCalorieCount();
        },
        events: {
            'click #search-btn': 'fetchData'
        },
        render: function() {
            var self = this;
            this.$('#saved-food-list').html("");
            _(this.savedFoodList.models).each(function(index) {
                self.reDisplaySavedFoodItems(index);
                self.totalCalorieCount();
            });
            if (this.savedFoodList.models.length === 0)
                this.totalCalorieCount();
        },
        renderFoodItemView: function(Food) {
            var foodItemView = new FoodItemView({
                model: Food
            });
            this.$('#search-results').append(foodItemView.render().el);
        },
        displaySavedFoodItems: function(Food) {
            var savedFoodItemView = new SavedFoodItemView({
                model: Food
            });
            this.$('#saved-food-list').append(savedFoodItemView.render().el);
            this.totalCalorieCount();
        },
        reDisplaySavedFoodItems: function(Food) {

            var savedFoodItemView = new SavedFoodItemView({
                model: Food
            });
            this.$('#saved-food-list').append(savedFoodItemView.render().el);
        },
        totalCalorieCount: function() {
            var totalCalorie = 0;
            _(this.savedFoodList.models).each(function(index) {
                totalCalorie = totalCalorie + index.attributes.calorie;
            });
            $('#total-calorie-count').text("Calorie Intake =" + totalCalorie);
        },
        fetchData: function() {
            var self = this;
            document.getElementById("search-results").innerHTML = "";
            var searchItem = document.getElementById("search-bar").value;
            var url = "https://api.nutritionix.com/v1_1/search/" + searchItem + "?results=0%3A20&cal_min=20&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id%2Cnf_calories&appId=4e548a5e&appKey=3a3c83f63f27942106128af3fd8699d5"
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    var response = JSON.parse(this.responseText);
                    self.list.reset();
                    self.list.parse(response);
                }
                if (this.status !== 200)
                    document.getElementById("search-results").innerHTML = "<h1 class='text-center'>Something's Not Right.Try Later</h1>";
            }
        },
        prevent: function(event) {
            if (event.which === 13)
                event.preventDefault();
        },
    });
    var appView = new AppView();

})(jQuery);