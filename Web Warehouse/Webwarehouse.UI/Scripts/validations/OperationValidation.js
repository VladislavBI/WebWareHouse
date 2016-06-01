    //Adding of new operation validation (value of operation check).

    //User tries to send info for server.
$("#operationCreateSubmit").on("click", function (event)
{

        //Cleaning previous errors.
    $(".qtyerror").remove();

        //Checking all textboxes by different rules
        //if no errors on current rull, check next one
        //else - prevent button click.

        //Check that inputs are filled
    request();

        //Check for characters or punctuation.
    if (noErrors())
    {
        notString();
    }

        //Check for positive number.
    if (noErrors())
    {
        isPositive();
    }
        //If any error - prevent button click.
    if (!noErrors())
    {
        event.preventDefault();
    }
        //If no errors - hide addOperation Partial View..
    else
    {
        addingSuccesseful();
    }
});

//Input is filled.
function request()
{


    if (($("#Quantity").val() == ""))
    {
        //Adding error message.
        $(this).after("<span class=\"txterror\">Must be filled</span>").css("borderColor", "red");
    }
        //Returning textbox border to normal.
    else
    {
        $(this).css("borderColor", "#e2e2e2");
    }
}

//Check that number doesn't contain characters.
function notString()
{

    var pattern = /[^0-9-]/;

    //Checking textbox by pattern.
    if (pattern.test($("#Quantity").val()))
    {
        //Adding error message.
        $("#validation-info-anchor").after("<span class=\"qtyerror\">Must be integer number</span>").css("borderColor", "red");
    }

        //Returning textbox border to normal.
    else
    {
        $(this).css("borderColor", "#e2e2e2");
    }
}

//Check that figure is positive.
function isPositive()
{
    if ($("#Quantity").val() <= 0)
    {
        //Adding error message.
        $("#validation-info-anchor").after("<span class=\"qtyerror\">Value must be more than 0</span>").css("borderColor", "red");
    }
        //Returning textbox border to normal.
    else
    {
        $(this).css("borderColor", "#e2e2e2");
    }
}

//Checking that it isn't any errors in code - no .qtyerror span.
function noErrors()
{
    if ($("form").find(".qtyerror").val() == null)
    {
        return true;
    }

    else
    {
        return false;
    }

}


//Successufuly added
function addingSuccesseful()
{

    //hiding adding operation.
    $(".operationEditForm").hide();
}