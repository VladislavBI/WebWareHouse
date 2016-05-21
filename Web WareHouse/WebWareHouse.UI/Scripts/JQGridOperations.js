$(function () {
    $("#GridTable").jqGrid({
        url: "/Operations/OperationsList",
        datatype: 'json',
        mtype: 'Get',
        colNames: ['OpId', 'UserName', 'Type', 'Quantity', 'Time'],
        colModel: [
            { key: true, hidden: true, name: 'OperationId', index: 'OperationId', editable: false },
            { key: false, name: 'UserName', index: 'UserName', uName: false, sortable: true },
            { key: false, name: 'OperType', index: 'OperType', editable: false, sortable: true },
            { key: false, name: 'Quantity', index: 'Quantity', editable: false, sortable: true },
            { key: false, name: 'OperationTime', index: 'OperationTime', editable: false, sortable: true, formatter: 'date', formatoptions: { newformat: 'd/m/Y' } }],
        pager: jQuery('#pager'),
        rowNum: 10,
        rowList: [10, 20, 30, 40],
        height: '100%',
        viewrecords: true,
        caption: 'Operations',
        emptyrecords: 'No records to display',
        jsonReader: {
            root: "rows",
            page: "page",
            total: "total",
            records: "records",
            repeatitems: false,
            Id: "0"
        },
        autowidth: true,
        multiselect: false
    }).navGrid('#pager', { edit: false, add: false, del: false, search: false, refresh: false });
});

