$(window).resize(function () {
    var DataGrid = $('#GridTable');
    //sets the grid size initially
    DataGrid.jqGrid('setGridWidth', parseInt($("#jqgridtd").width()) - 20);


    //$(body).height(parseInt($(window).height()));
});

$(function () {
    $("#GridTable").jqGrid({
        url: "/Operations/OperationsList",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['OpId', 'Пользователь', 'Тип операции', 'Кол-во', 'Дата'],
        colModel: [
            { key: true, hidden: true, name: 'OperationId', index: 'OperationId', editable: false },
            { key: false, name: 'UserName', index: 'UserName', uName: false, sortable: true },
            { key: false, name: 'OperType', index: 'OperType', editable: false, sortable: true },
            { key: false, name: 'Quantity', index: 'Quantity', editable: false, sortable: true },
            { key: false, name: 'OperationTime', index: 'OperationTime', editable: false, sortable: true, formatter: 'date', formatoptions: { newformat: 'd/m/Y' } }],
        pager: jQuery('#pager'),
        rowNum: 10,
        rowList: [10, 25, 50, 100],
        height: '100%',
        viewrecords: true,
        caption: 'Список операций по товару',
        emptyrecords: 'No records to display',
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        //to save current page on sorting
        onSortCol: function (index, columnIndex, sortOrder) {
            var postpage = jQuery("#GridTable").getGridParam('postData');
            jQuery("#GridTable").setGridParam({ page: postpage.page });
        },
        autowidth: true,
        multiselect: false,
        oadComplete: function (data) {
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
                $(".operationEditForm").empty();
            });
        },
       
    }).navGrid('#pager', { edit: false, add: false, del: false, search: false, refresh: false });
});

