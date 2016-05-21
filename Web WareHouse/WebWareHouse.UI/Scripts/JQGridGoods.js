$(function () {
    $("#GridTable").jqGrid({
        url: "/Goods/GoodsList",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['GoodId', 'GoodName', 'Price'],
        colModel: [
            { key: true, hidden: true, name: 'GoodId', index: 'GoodId', editable: true },
            { key: false, name: 'GoodName', index: 'GoodName', editable: true, sortable: true },
            { key: false, name: 'Price', index: 'Price', editable: true, sortable: true }, ],
        pager: jQuery('#pager'),
        rowNum: 10,
        rowList: [10, 20, 30, 40],
        height: '100%',
        viewrecords: true,
        caption: 'Goods',
        emptyrecords: 'No records to display',
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
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
        autowidth: true,
        multiselect: false
    }).navGrid('#pager', { edit: true, add: true, del: true, search: false, refresh: true },
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
});

function onSuccess(result) {
    if (result.url) {
        // if the server returned a JSON object containing an url
        // property we redirect the browser to that url
        window.location.href = result.url;
    }
}