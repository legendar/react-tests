var ng = require('angular'),
    Chance  = require('chance');

var chance = new Chance(),
    lastId = -1;

ng.module('tableApp', [])
  .controller('TableListController', TableListController);

function TableListController() {
  this.userList = randomList(10000)
  this.orderField = 'id'

  console.log('wtf')

  this.resort = (fieldName)=> {
    this.orderField = fieldName
    //console.log('sort by', fieldName)
    //console.log(this.userList)
  }
}

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
