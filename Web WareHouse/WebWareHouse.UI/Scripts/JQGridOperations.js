$(window).resize(function() {
    var dataGrid = $("#GridTable");
    //sets the grid size initially
    dataGrid.jqGrid("setGridWidth", parseInt($("body").width()) - 20);


    //$(body).height(parseInt($(window).height()));
});

$(function() {
    $("#GridTable").jqGrid({
        url: "/Operations/OperationsList",
        datatype: "json",
        mtype: "Get",
        colNames: ["OpId", "User", "Operation type", "Value", "Date"],
        colModel: [
            { key: true, hidden: true, name: "OperationId", index: "OperationId", editable: false },
            { key: false, name: "UserName", index: "UserName", uName: false, sortable: true },
            { key: false, name: "OperType", index: "OperType", editable: false, sortable: true },
            { key: false, name: "Quantity", index: "Quantity", editable: false, sortable: true },
            { key: false, name: "OperationTime", index: "OperationTime", editable: false, sortable: true, formatter: "date", formatoptions: { newformat: "d/m/Y" } }
        ],
        pager: jQuery("#pager"),
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        height: "100%",
        viewrecords: true,
        caption: "Opeartions list",
        emptyrecords: "No records to display",
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        //to save current page on sorting
        onSortCol: function(index, columnIndex, sortOrder) {
            var postpage = jQuery("#GridTable").getGridParam("postData");
            jQuery("#GridTable").setGridParam({ page: postpage.page });
        },
        autowidth: true,
        multiselect: false,

    }).navGrid("#pager", { edit: false, add: false, del: false, search: false, refresh: false });
});