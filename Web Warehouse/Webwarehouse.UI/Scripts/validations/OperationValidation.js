//Adding of new operation validation

//User tries send info for server
$("#operationCreateSubmit").on("click", function (event) {


    //cleaning previous errors
    $(".qtyerror").remove();

    //checking all textboxes by different rules
    //if no errors exec next
    //else - prevent button click

    //check that input is filed
    request();

    //check for characters or punctuation
    if (noErrors()) {
        notString();
    }

    //check for positive number
    if (noErrors()) {
        isPositive();
    }
    //if any error - prevent button click
    if (!noErrors()) {
        event.preventDefault();
    }
    else
    {
        addingSuccesseful();
    }
});

//input is filled
function request() {


    if (($("#Quantity").val() == "")) {
        $(this).after("<span class=\"txterror\">Must be filled</span>").css("borderColor", "red");
    }
        //returning textbox border to normal
    else
    {
        $(this).css("border", "none");
    }
}

//check that number doesn't contain characters
function notString() {

    var pattern = /[^0-9-]/;
    //Checking textbox by pattern
    if (pattern.test($("#Quantity").val())) {
        $("#validation-info-anchor").after("<span class=\"qtyerror\">Must be interer number</span>").css("borderColor", "red");
    }
        //returning textbox border to normal
    else
    {
        $(this).css("border", "none");
    }
}

//check that figure is positive
function isPositive()
{
    if ($("#Quantity").val() <= 0) {
        $("#validation-info-anchor").after("<span class=\"qtyerror\">Value must be more than 0</span>").css("borderColor", "red");
    }
        //returning textbox border to normal
    else {
        $(this).css("border", "none");
    }
}

//checking that it isn't any errors in code - no .qtyerror span
function noErrors() {
    if ($("form").find(".qtyerror").val() == null) {
        return true;
    } else {
        return false;
    }

}


//successufuly added
function addingSuccesseful() {
    //hiding adding operation
    $(".operationEditForm").hide();
    // $(".good-det-inf").remove();
}