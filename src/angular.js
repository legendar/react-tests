var ng = require('angular'),
    Chance  = require('chance');

ng.module('tableApp', [])
  .controller('TableListController', TableListController);

function TableListController($scope) {
  $scope.userList = randomList(2000)
  $scope.orderField = 'id'
  $scope.resort = (fieldName)=> $scope.orderField = fieldName
  $scope.removeItem = (item)=> {
    var index = $scope.userList.indexOf(item)
    if(index > -1)
      $scope.userList.splice(index, 1);
  }
}

var chance = new Chance(),
    lastId = -1;

function randomItem() {
  return {
    id: ++lastId,
    name: chance.first(),
    lastName: chance.last(),
    phone: chance.phone()
  }
}

function randomList(length = 100) {
  return Array.apply(null, {length}).map(randomItem)
}

angular.bootstrap(document, ['tableApp']);
