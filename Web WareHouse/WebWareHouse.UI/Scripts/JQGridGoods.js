    //Resize jqgrid for fitting current window size.
$(window).resize(function ()
{
        //Sets the grid size initially.
    var dataGrid = $("#GridTable");
    dataGrid.jqGrid("setGridWidth", parseInt($("#jqgrid-td").width()));

});

    //Initial float cells format - comma instead of dot. 
function numFormat(cellvalue, options, rowObject)
{
    var e = String(cellvalue);
    return e.replace(".", ",");
    
}

    //Refresing detailes of good when good is edited or selection changed.
function detailedInfoViewRefresh()
{
        //Getting selected good's id   
    var myGrid = $("#GridTable"),
                        selRowId = myGrid.jqGrid("getGridParam", "selrow"),
                        celValue = myGrid.jqGrid("getCell", selRowId, "GoodId");

        //Ajax for server  
    $.ajax(
        {
        url: "/Goods/DetailInfo",
        type: "GET",
        data: { id: celValue }
        })
        .done(function (partialViewResult)
        {
                //Changing good's detail info.
            $("#good-det-inf").html(partialViewResult);
        });

        //Clearing operationAdd View for previous good.
    $(".operationEditForm").empty();
}

$(function ()
{
    $("#GridTable").jqGrid(
        {
        url: "/Goods/GoodsList",
        editurl: "/Goods/Edit",
        datatype: "json",
        mtype: "Get",
        colNames: ["GoodId", "Good Name", "Price"],
        colModel: [
                //Column for good's ids.
            { key: true, hidden: true, name: "GoodId", index: "GoodId", editable: true },
                //Column for good's names.
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
                //Column for good's prices.
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
        
            //Binding to footer navigation tag. 
        pager: jQuery("#pager"),

            //Jqgrid properties.
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        height: "100%",
        viewrecords: true,
        caption: "Goods list",
        sortable: true,
        emptyrecords: "No records to display",
        cellsubmit: "remote",
        autowidth: true,
        multiselect: false,

            //Information from server.
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },

            //To save current page on sorting.
        onSortCol: function (index, columnIndex, sortOrder) {
            var postpage = jQuery("#GridTable").getGridParam("postData");
            jQuery("#GridTable").setGridParam({ page: postpage.page });
        },

            //To get good's detailed info view when row is selected.
        onSelectRow:
            function ()
            {
                detailedInfoViewRefresh();
            },

        gridComplete:
            function ()
            {
                detailedInfoViewRefresh();
            },
            //To change good's full view after row deleting.
        loadComplete: function (data)
        {
            detailedInfoViewRefresh();
        }
    }).navGrid("#pager", { edit: false, add: true, del: true, search: false, refresh: true, refreshstate: "current" },
    {

            // Edit options
        zIndex: 100,
        url: "/Goods/Edit",
        closeOnEscape: true,
        closeAfterEdit: true,
        recreateForm: true,
    },

    {
           //Add options.
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
            //Delete options.
        zIndex: 100,
        url: "/Goods/Delete",
        closeOnEscape: true,
        closeAfterDelete: true,
        recreateForm: true,

        msg: "Are you sure you want to delete this task?",
        afterComplete: function (response)
        {
            if (response.responseText) {
                alert(response.responseText);
            }
        }
    });
        //Applying inline edit.
    $("#GridTable").inlineNav("#pager", {
        edit: true,
        add: false,
        del: false,
        cancel: true,
        editParams: {
            keys: true,
                //To change view after edit.
            aftersavefunc: function(response) {

                detailedInfoViewRefresh()
                alert("Good was edited");
            }
                //on edit click event - save for future
                //oneditfunc: ReloadAdd
        }
    });

});

//JQGRID validation options.

//Checking that price is valid:
function figureValid(value, colname)
{
        //1) is positive number
    if (value <= 0)
        return [false, "Price must be positive"];
    var commaPattern = /^\d+,*\d*$/;
    var dotPattern = /^\d+\.*\d*$/;
        //2) right number
    if (commaPattern.test(value))
    {
        return [true, ""];
    }
    else
    {
            //3)Using dot
        if (dotPattern.test(value))
        {
            return [false, "Use comma instead of dot"];
        }
            //4)Using characters.
        else
        {
            return [false, "Input number"];
        }
    }
}

    //Check that name doesn't include tags.
function notATag(value, colname)
{
    //Patterns.
    var openTag = /<.+>/;
    var closetag = /<.*\/.+>/;


    if (!openTag.test(value) && !closetag.test(value))
    {
            //If doesn't contain.
        return [true, ""];
    }
    else
    {
        //If contain.
        return [false, "Name cann't contain tags"];
    }
}