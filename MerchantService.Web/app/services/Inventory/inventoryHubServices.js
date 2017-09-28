
app.factory('inventoryHubServices', ['$rootScope', 'Hub', '$timeout', function ($rootScope, Hub, $timeout) {
    $.connection.hub.logging = true;
    //declaring the hub connection
    var hub = new Hub('inventoryHub', {

        //client side methods
        listeners:{
            'inventoryMoniter': function (issueInventory) {
                //var employee = find(id);
                //employee.Locked = true;
                //$rootScope.$apply();

                $rootScope.$broadcast("innventoryMonitering", issueInventory);
            },
        },

        //server side methods
        methods: ['InventoryMoniter'],

        //query params sent on initial connection
        queryParams:{
            'token': 'exampletoken'
        },

        //handle connection error
        errorHandler: function(error){
          //  console.error(error);
        },

        //specify a non default root
        //rootPath: '/api

        //stateChanged: function(state){
        //    switch (state.newState) {
        //        case $.signalR.connectionState.connecting:
        //            //your code here
        //            break;
        //        case $.signalR.connectionState.connected:
        //            //your code here
        //            break;
        //        case $.signalR.connectionState.reconnecting:
        //            //your code here
        //            break;
        //        case $.signalR.connectionState.disconnected:
        //            //your code here
        //            break;
        //    }
        //}
    });


    var viewInventory = function (issueInventoryId,moniterPath) {
        hub.InventoryMoniter(issueInventoryId,moniterPath); //Calling a server method
    };
   

    return {
        viewInventoryDetails: viewInventory,
       
    };
}]);