$(":submit").on("click", function (event) {


    //cleaning previous errors
    $(".qtyerror").remove();

    //checking all textboxes by dif rulles
    //if no errors exec next
    //else - prevent button click
    notFloat();

    if (noErrors()) {
        isPositive();
    }
    //if any error - prevent button click
    if (!noErrors()) {
        event.preventDefault();
    }

    $(".operationEditForm").hide();
   // $(".goodDetInfo").remove();
});

//not a dloat number
function notFloat() {
    
   

        if ($("#Quantity").val().search(/\.+/) == "" ) {
            $("#Quantity").after('<span class="qtyerror">Must be filled</span>').css("borderColor", "red");
        }
        if ($("#Quantity").val().search(/,+/) == "") {
            $("#Quantity").after('<span class="qtyerror">Heyo</span>').css("borderColor", "red");

        }

        else {
            $(this).css("border", "none");
        }
  
}
function isPositive() {
    if ($("#Quantity").val() <= 0) {
        $("#Quantity").after('<span class="qtyerror">Value must be more than 0</span>').css("borderColor", "red");
    }
    else {
        $(this).css("border", "none");
    }
}
function noErrors() {
    if ($("form").find(".qtyerror").val() == null) {
        return true;
    }
    else {
        return false;
    }

}