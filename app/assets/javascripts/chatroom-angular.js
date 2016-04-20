angular.module("App",    [ //'MessageBus',
                           'App.services'
                           //,'ui.bootstrap'
    ])
    .config(function($httpProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'AngularXMLHttpRequest';  //REF:  https://cagedata.com/blog/2014/08/05/angular-with-rails-fixing-xhr.html
    })
    .run(function ($rootScope) {

    });

//--------- MODULO APP.SERVICES ------------------------------------------------------------

angular.module('App.services', [  ])
    .factory('Chatroom',
        function ($http) {
            var baseURL = 'http://your-production-url.com';

            baseURL = 'http://localhost:3000';


            var currentUser;

            var Chatroom = {
                // post to enter endpoint
                enter: function(opts, cback) {
                    opts = opts || {};
                    if (!(opts.newname)) throw('missing option: newname');

                    try {
                        $http.post(baseURL + '/enter',
                                {   username: opts.newname
                                },
                                {   timeout: 10000,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'HTTP_X_USERNAME': opts.newname
                                    }
                                }
                        ).then(onSuccess, onError).catch(onCatch);
                    } catch (e) {
                        console.log('Chatroom: Enter: Try Catch: ' + JSON.stringify(e));
                        if (cback) cback({error: true});
                    }
                    //----- local functions
                    function onSuccess(response) {
                        response.error = response.error || null;
                        currentUser = response.data.username;
                        if (cback) cback(response);
                    }
                    function onError(error) {
                        if (cback) cback({error: true, message: error });
                        console.log('Chatroom: Enter: Error: ', error);
                    }
                    function onCatch(error) {
                        console.log('Chatroom: Enter:  HTTP Catch: ' + JSON.stringify(error));
                        if (cback) cback({error: true, message: JSON.stringify(error) });
                    }
                },
                // post to leave endpoint
                leave: function(username) {
                    try {
                        $http.post(baseURL + '/leave',
                                {   username: username
                                },
                                {   timeout: 10000,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'HTTP_X_USERNAME': username
                                    }
                                }
                        ).then(onSuccess, onError).catch(onCatch);
                    } catch (e) {
                        console.log('Chatroom: Leave: Try Catch: ' + JSON.stringify(e));
                        if (cback) cback({error: true});
                    }
                    //----- local functions
                    function onSuccess(response) {
                        response.error = response.error || null;
                        currentUser = null;
                        if (cback) cback(response);
                    }
                    function onError(error) {
                        console.log('Chatroom: Leave: Error: ', error);
                        if (cback) cback({error: true, message: 'Error leaving Chatroom'});
                    }
                    function onCatch(error) {
                        console.log('Chatroom: Leave:  HTTP Catch: ' + JSON.stringify(error));
                        if (cback) cback({error: true});
                    }
                },
                //listen on presence channel
                onPresence: function(cback) {
                    window.MessageBus.subscribe("/presence", function (data) {

                        if (cback) cback(data);

                    });
                },
                //post to message endpoint
                message: function(msg, cback) {
                    if (!currentUser) throw 'no currentUser';

                    try {
                        $http.post(baseURL + '/message',
                                {   username: currentUser,
                                    data: msg
                                },
                                {   timeout: 10000,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'HTTP_X_USERNAME': currentUser
                                    }
                                }
                        ).then(onSuccess, onError).catch(onCatch);
                    } catch (e) {
                        console.log('Chatroom: message: Try Catch: ' + JSON.stringify(e));
                        if (cback) cback({error: true});
                    }
                    //----- local functions
                    function onSuccess(response) {
                        response.error = response.error || null;
                        if (cback) cback(response);
                    }
                    function onError(error) {
                        console.log('Chatroom: message: Error: ', error);
                        if (cback) cback({error: true, message: 'Error sending message'});
                    }
                    function onCatch(error) {
                        console.log('Chatroom: message:  HTTP Catch: ' + JSON.stringify(error));
                        if (cback) cback({error: true});
                    }
                },
                //listen on message endpoint
                onMessage: function(cback) {
                    window.MessageBus.subscribe("/message", function (response) {
                        if (response.data) {
                            if (cback) cback(response);
                        }
                    },0);
                }

            };

            return Chatroom;
    })
    .directive('scrollBottomOn', function ($timeout) {
        return {
            scope: {
                scrollBottomOn: "="
            },
            link: function ($scope, $element) {
                $scope.$watchCollection('scrollBottomOn', function (newValue) {
                    if (newValue) {
                        $timeout(function () {  //$timeout to make sure $digest cycle is finished
                            $element[0].scrollTop = $element[0].scrollHeight;
                        }, 0);
                    }
                });
            }
        }
    })
;


//------------------------------------------------------------------------------------

angular.module('App').
    controller("ChatController", function($scope, $timeout, Chatroom) {

    //------ Local Functions -----------------------------------------------------------

    function updateUI(func) {                  //https://docs.angularjs.org/error/$rootScope/inprog?p0=$digest
       $scope.$evalAsync(function(scope) {
            if (func) func();
       });
    }

    //------ Local Variables -----------------------------------------------------------

    //------ Scope Variables ---------------------------------------------
    $scope.remoteMessages = []

    //------ Scope Functions ---------------------------------------------

    $scope.doLogin = function( ) {

        Chatroom.enter({newname: $scope.name}, function(response){
            if (!response.error) {

                updateUI(function(){
                    $scope.users = Object.keys(response.data.users);        //initial load of users on presence list
                    $scope.username = response.data.username;               //initial set for global username
                });

                window.onbeforeunload = function () {
                    Chatroom.leave($scope.username);
                };

                Chatroom.onPresence(function(msg){
                    updateUI(function() {
                        if (msg.enter) {
                            if ($scope.users.indexOf(msg.enter) == -1) {
                                $scope.users.push(msg.enter);
                            }
                        }
                        if (msg.leave) {
                            var idx = $scope.users.indexOf(msg.leave);
                            if (idx > -1) $scope.users.splice(idx, 1);
                        }
                    });

                });

                Chatroom.onMessage(function(response){

                    if (response.data) {
                        updateUI(function(){
                            $scope.remoteMessages.push(response);
                        });                                 //directive scroll-bottom-on triggers phase
                    }

                });

            } else {
                alert('Error Entering Chat: ', response.message);
            }
        });
    }
    $scope.sendMessage = function () {

        if ($scope.message.length==0) {
            return
        }
        if ($scope.message.length>500) {
            alert('message too long');
            return;
        }
        Chatroom.message($scope.message, function(response){
            if (!response.error) {
                $scope.message = '';
            }
        })

    }

    //------ Scope Events ---------------------------------------------

    //------ M A I N --------------------------------------------------

});

