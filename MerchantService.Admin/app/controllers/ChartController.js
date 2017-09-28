app.controller('SalesChartCtrl', function ($scope) {
    $scope.chartObject = {};

    $scope.chartObject.type = "ColumnChart";
  
    $scope.chartObject.data = {
        "cols": [
            { id: "t", label: "Month", type: "string" },
            { id: "s", label: "Amount", type: "number" }
        ], "rows": [
            {
                c: [
                   
                   { v: "30/6/2015" },
                   { v: 20000 }
                ]
            },            
            {
                c: [
                  
                   { v: "30/7/2015" },
                   { v: 15000 },
                ]
            },
            {
                c: [
                   
                   { v: "31/8/2015" },
                   { v: 7000 }
                ]
            },
            {
                c: [
                  
                   { v: "30/9/2015" },
                    { v: 12000 },
                ]
            }
        ]
    };

    $scope.chartObject.options = {
        'title': 'Sales'
    };
});
app.controller('PurchaseChartCtrl', function ($scope) {
    $scope.chartObject = {};

    $scope.chartObject.type = "ColumnChart";

    $scope.chartObject.data = {
        "cols": [
            { id: "t", label: "Month", type: "string" },
            { id: "s", label: "Amount", type: "number" }
            
        ], "rows": [
            {
                c: [
                   { v: "30/6/2015" },
                   { v: 40000 }
                ]
            },
            {
                c: [
                   { v: "30/7/2015" },
                   { v: 33000 }
                ]
            },
            {
                c: [
                   { v: "31/8/2015" },
                   { v: 22000 }
                ]
            }
        ]
    };

    $scope.chartObject.options = {
        'title': 'Purchase',
        'colors': ['#e2431e']

    };
});
