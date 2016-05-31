//resize jqgrid for fitting current window size
$(window).resize(function () {
    var dataGrid = $("#GridTable");
    //sets the grid size initially
    dataGrid.jqGrid("setGridWidth", parseInt($("#jqgrid-td").width()));
    //$(body).height(parseInt($(window).height()));
});

//initial float cells format - comma instead of dot 
function numFormat(cellvalue, options, rowObject) {
    var e = String(cellvalue);
    return e.replace(".", ",");
    
}

//refresing detailes of good when good info or sekection changed
function detailedInfoViewRefresh() {
    var myGrid = $("#GridTable"),
                        selRowId = myGrid.jqGrid("getGridParam", "selrow"),
                        celValue = myGrid.jqGrid("getCell", selRowId, "GoodId");

    $.ajax({
        url: "/Goods/DetailInfo",
        type: "GET",
        data: { id: celValue }
    })
        .done(function (partialViewResult) {
            $("#good-det-inf").html(partialViewResult);
        });

    //clearing operationAdd View for previous good
    $(".operationEditForm").empty();
}
$(function() {
    $("#GridTable").jqGrid({
        url: "/Goods/GoodsList",
        editurl: "/Goods/Edit",
        datatype: "json",
        mtype: "Get",
        colNames: ["GoodId", "Good Name", "Price"],
        colModel: [
            //column for good's ids
            { key: true, hidden: true, name: "GoodId", index: "GoodId", editable: true },
            {
                key: false,
                name: "GoodName",
                index: "GoodName",
                editable: true,
                sortable: true,
                editrules: {
                    required: true,
                    custom: true,
                    custom_func: notATag
                }
            },
            //column for good's prices
            {
                key: false,
                name: "Price",
                index: "Price",
                editable: true,
                sortable: true,
                formatter: numFormat,
                editrules: { required: true, custom: true, custom_func: figureValid }
            }
        ],
        
        pager: jQuery("#pager"),
        rowNum: 10,
        //rows on page variants
        rowList: [10, 25, 50, 100],
        height: "100%",
        viewrecords: true,
        caption: "Goods list",
        sortable: true,

        //to save current page on sorting
        onSortCol: function(index, columnIndex, sortOrder) {
            var postpage = jQuery("#GridTable").getGridParam("postData");
            jQuery("#GridTable").setGridParam({ page: postpage.page });
        },

        emptyrecords: "No records to display",
        cellsubmit: "remote",

        //information from server
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        autowidth: true,
        multiselect: false,

        //to get good's detailed info view when row is selected
        onSelectRow:
            function() {
                detailedInfoViewRefresh();
            },
        gridComplete:
            function() {
                detailedInfoViewRefresh();
            },
        //to change good's full view after row deleting
        loadComplete: function(data) {
            detailedInfoViewRefresh();
        }
    }).navGrid("#pager", { edit: false, add: true, del: true, search: false, refresh: true, refreshstate: "current" },
    {
        // edit options
        zIndex: 100,
        url: "/Goods/Edit",
        closeOnEscape: true,
        closeAfterEdit: true,
        recreateForm: true,
    },
    {
        // add options
        zIndex: 100,
        url: "/Goods/Create",
        closeOnEscape: true,
        closeAfterAdd: true,

        afterComplete: function(response) {
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
        afterComplete: function(response) {
            if (response.responseText) {
                alert(response.responseText);
            }
        }
    });

    $("#GridTable").inlineNav("#pager", {
        edit: true,
        add: false,
        del: false,
        cancel: true,
        editParams: {
            keys: true,
            //to change view after edit
            aftersavefunc: function(response) {

                detailedInfoViewRefresh()
                alert("Good was edited");
            }
            //on edit click event - save for future
            //oneditfunc: ReloadAdd
        }
    });

});

//JQGRID validation options

//function ReloadAdd() {
//    alert("Reload");
//}
//checking that price is valid
function figureValid(value, colname) {
    //1)is positive number
    if (value <= 0)
        return [false, "Price must be positive"];
    var commaPattern = /^\d+,*\d*$/;
    var dotPattern = /^\d+\.*\d*$/;
    //2)right number
    if (commaPattern.test(value)) {
        return [true, ""];
    } else {
        //3)Using .
        if (dotPattern.test(value)) {
            return [false, "Use comma instead of dot"];
        }
        //4)Using characters
        else {
            return [false, "Input number"];
        }
    }
}

//Check that name doesn't include tags
function notATag(value, colname) {
    //patterns
    var openTag = /<\w*>/;
    var closetag = /<\w*\/\w*>/;
    if (!openTag.test(value) && !closetag.test(value)) {
        return [true, ""];
    } else {
        return [false, "name cann't contain tags"];
    }
}