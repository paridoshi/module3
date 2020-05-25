
(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems',FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller:FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

 function FoundItemsDirectiveController() {
  var list = this;

  list.removeItem = function (itemIndex) {
   
     list.items.splice(itemIndex,1);
      };
   
}




NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;  
  menu.returnObj={};
  menu.narrowBtn= function(){

	if(!menu.searchItem){
		menu.foundItems=[];
		return;
		}
	var temp=MenuSearchService.getMatchedMenuItems(menu.returnObj,menu.searchItem,function(){

	menu.foundItems= menu.returnObj.foundItems;
	console.log(menu.foundItems);
	});
};

};




MenuSearchService.$inject = ['$http','$filter'];
function MenuSearchService($http,$filter) {
  var self = this;

  self.getMenu = function () {
	//service.getMenu = function () {
    var response = $http({
      method: "GET",
      url: ("https://davids-restaurant.herokuapp.com/menu_items.json"),
    });

    return response;
  };

	self.getMatchedMenuItems = function(returnObj,searchItem,callback){
		var promise = self.getMenu();
		promise.then(function (response) {
			console.log(response.data);
			var foundItems=[];
			//returnObj.foundItems=$filter('filter')(response.data.menu_items, searchItem);
			//console.log(foundItems);


			response.data.menu_items.filter(function (item) {
          			if (searchItem.length > 0 && item.description.toLowerCase().indexOf(searchItem) > 0) {
            			foundItems.push(item);
         			 }

        		});
			returnObj.foundItems=foundItems;
			callback();
			})
				.catch( function(error) {
					returnObj.foundItems=[];
					console.log(error);
					callback();
				})

  			};
 	
 	
		};

})();
