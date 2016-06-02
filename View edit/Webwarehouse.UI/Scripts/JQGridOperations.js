    //Resize jqgrid for fitting current window size.
$(window).resize(function ()
{
        //Sets the grid size initially.
    var dataGrid = $("#GridTable");
    dataGrid.jqGrid("setGridWidth", parseInt($("body").width()) - 20);

});

$(function ()
{
    $("#GridTable").jqGrid({
        url: "/Operations/OperationsList",
        datatype: "json",
        mtype: "Get",
        colNames: ["OpId", "User", "Operation type", "Value", "Date"],
        colModel: [
                //Column for operation's ids.
            { key: true, hidden: true, name: "OperationId", index: "OperationId", editable: false },
                //Column for User's, who executed operation, names.
            { key: false, name: "UserName", index: "UserName", uName: false, sortable: true },
                //Column for operation's types.
            { key: false, name: "OperType", index: "OperType", editable: false, sortable: true },
                //Column for operation's values.
            { key: false, name: "Quantity", index: "Quantity", editable: false, sortable: true },
                //Column for operation's execution dates.
            { key: false, name: "OperationTime", index: "OperationTime", editable: false, sortable: true, formatter: "date", formatoptions: { newformat: "d/m/Y" } }
        ],
            //Binding to footer navigation tag. 
        pager: jQuery("#pager"),

            //Jqgrid properties.
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        height: "100%",
        viewrecords: true,
        caption: "Opeartions list",
        emptyrecords: "No records to display",
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

            //To save current page on sorting
        onSortCol: function (index, columnIndex, sortOrder)
        {
            var postpage = jQuery("#GridTable").getGridParam("postData");
            jQuery("#GridTable").setGridParam({ page: postpage.page });
        },
       
        //Disabling CRUD operations for grid.
    }).navGrid("#pager", { edit: false, add: false, del: false, search: false, refresh: false });
});