var app = angular.module('myApp', [ 'ngDialog' ]);

app.controller('rpiChat', [
    '$scope', 'ngDialog',
    function($scope, ngDialog) {
        var sock = new SockJS('http://127.0.0.1:1337/chat');

        $scope.messages = [];

        sock.onmessage = function(e) {
            var content = JSON.parse(e.data);

            $scope.$apply(function() {
                $scope.messages.push(content.username + ': ' + content.message);
            });
        };
        
        var username;
        var dialog = ngDialog.open({
            template: 'lightbox',
            controller: ['$scope', function (scope){
                    scope.selectUserName = function () {
                        username = scope.username;
                        dialog.close();
                    }
                }]
        });

        $scope.sendMessage = function () {
            if ($scope.message) {
                var msg = {
                    message: $scope.message,
                    username: username
                };

                sock.send(JSON.stringify(msg));

                $scope.message = "";
            }
        }
    }
]);
