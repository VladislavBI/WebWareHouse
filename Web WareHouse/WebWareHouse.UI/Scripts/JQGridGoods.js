function numFormat(cellvalue, options, rowObject) {
    var e = String(cellvalue);
    return e.replace(".", ",");
}

function numUnformat(cellvalue, options, rowObject) {
    var e = String(cellvalue);
    return e.replace(".", ",");
}


$(function () {
    $("#GridTable").jqGrid({
        url: "/Goods/GoodsList",
        editurl: "/Goods/Edit",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['GoodId', 'Имя', 'Цена'],
        colModel: [
            { key: true, hidden: true, name: 'GoodId', index: 'GoodId', editable: true },
            {
                key: false, name: 'GoodName', index: 'GoodName', editable: true, sortable: true,
                editrules: {
                    required: true, custom: true, custom_func: notATag
                }
            },
            
            {
                key: false, name: 'Price', index: 'Price', editable: true, sortable: true, formatter: numFormat,
                unformat: numUnformat,
                //sorttype: 'float',
                editrules: { required: true, custom: true, custom_func: figureValid}
            }, ],
        pager: jQuery('#pager'),
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        height: '100%',
        viewrecords: true,
        caption: 'Список товаров',
        sortable: true,
        emptyrecords: 'No records to display',
        cellsubmit : 'remote',
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        //to get good's full view when row is selected
        onSelectRow:

            function () {
                var myGrid = $('#GridTable'),
                selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                celValue = myGrid.jqGrid('getCell', selRowId, 'GoodId');
                $.ajax({
                    url: "/Goods/DetailInfo",
                    type: "GET",
                    data: { id: celValue }
                })
                .done(function (partialViewResult) {
                    $("#goodDetInfo").html(partialViewResult);
                });
            },
        gridComplete:
            function () {
                var myGrid = $('#GridTable'),
                selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                celValue = myGrid.jqGrid('getCell', selRowId, 'GoodId');
                $.ajax({
                    url: "/Goods/DetailInfo",
                    type: "GET",
                    data: { id: celValue }
                })
                .done(function (partialViewResult) {
                    $("#goodDetInfo").html(partialViewResult);
                });
            },
        //to change good's full view after row deleting
        loadComplete: function(data){
            var myGrid = $('#GridTable'),
                selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                celValue = myGrid.jqGrid('getCell', selRowId, 'GoodId');
            $.ajax({
                url: "/Goods/DetailInfo",
                type: "GET",
                data: { id: celValue }
            })
            .done(function (partialViewResult) {
                $("#goodDetInfo").html(partialViewResult);
            });
        },
        autowidth: true,
        multiselect: false
    }).navGrid('#pager', { edit: false, add: true, del: true, search: false, refresh: true },
        {
            // edit options
            zIndex: 100,
            url: '/Goods/Edit',
            closeOnEscape: true,
            closeAfterEdit: true,
            recreateForm: true,
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
                var myGrid = $('#GridTable'),
                selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                celValue = myGrid.jqGrid('getCell', selRowId, 'GoodId');
                $.ajax({
                    url: "/Goods/DetailInfo",
                    type: "GET",
                    data: { id: celValue }
                })
                .done(function (partialViewResult) {
                    $("#goodDetInfo").html(partialViewResult);
                });
            }
        },
        {
            // add options
            zIndex: 100,
            url: "/Goods/Create",
            closeOnEscape: true,
            closeAfterAdd: true,
            
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
            }
        },
        {
            // delete options
            zIndex: 100,
            url: "/Goods/Delete",
            closeOnEscape: true,
            closeAfterDelete: true,
            recreateForm: true,
            msg: "Are you sure you want to delete this task?",
            afterComplete: function (response) {
                if (response.responseText) {
                    alert(response.responseText);
                }
            }
        });

    $('#GridTable').inlineNav('#pager', {
        edit: true,
        add: false,
        del: false,
        cancel: true,
        editParams: {
            keys: true,
            //to change view after edit
            aftersavefunc: function (response) {
                alert("aftersave");
                var myGrid = $('#GridTable'),
                selRowId = myGrid.jqGrid('getGridParam', 'selrow'),
                celValue = myGrid.jqGrid('getCell', selRowId, 'GoodId');
                $.ajax({
                    url: "/Goods/DetailInfo",
                    type: "GET",
                    data: { id: celValue }
                })
                .done(function (partialViewResult) {
                    $("#goodDetInfo").html(partialViewResult);
                });
            },
            //on edit click event - save for future
            //oneditfunc: ReloadAdd
        },
    });

});


function onSuccess(result) {
    if (result.url) {
        // if the server returned a JSON object containing an url
        // property we redirect the browser to that url
        window.location.href = result.url;
    }
}

//function ReloadAdd() {
//    alert("Reload");
//}
//checking that price is valid
function figureValid(value, colname) {
    //1)is positive number
        if (value <=0) 
            return [false, "Price must be positive"];
        var commaPattern = /^\d+,*\d*$/;
        var dotPattern = /^\d+\.*\d*$/;
    //2)right number
        if (commaPattern.test(value))
            {
                return [true,""];
            }
        else
        {
            //3)Using .
            if (dotPattern.test(value)) {
                return [false, "Use comma instead of dot"];
            }
            //4)Using characters
            else
            {
                return [false, "Input number"];
            }
        }
}

//Check that name doesn't include tags
function notATag(value, colname) {
    //patterns
    var openTag = /<\w*>/;
    var closetag = /<\w*\/\w*>/

    if (!openTag.test(value) && !closetag.test(value)) 
    {
        return [true,""];
    }
    else {
        return [false, "name cann't contain tags"];
    }
}


