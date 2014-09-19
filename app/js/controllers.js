'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', 'Charge',
  function($scope, $routeParams, Phone, Charge) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }

      $scope.handler = StripeCheckout.configure({
          key: 'pk_test_aS5cIJIigvjRZFyW02Hqcw2X',
          image: 'https://pbs.twimg.com/profile_images/2149314222/square_400x400.png',
          token: function(token) {
              // Use the token to create the charge with a server-side script.
              // You can access the token ID with `token.id`
              var charge = {
                  stripeToken: token.id,
                  description: $scope.phone.name
              }
              Charge.create(charge, function(response) {
                  $scope.last4 = response.last4
                  $scope.amount = response.amount
                  $('#myModal').modal('show')
              }, function (err) {
                  console.log(err.data)
                  $scope.paymentFailure = err.data
              })
          }
      });

      $scope.openCheckout = function() {
          $scope.handler.open({
              name: 'Angular Fake Phone Store',
              description: $scope.phone.name,
              amount: 19900
          })
      }

  }]);
