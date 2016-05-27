﻿
$(":submit").on("click", function (event) {


    //cleaning previous errors
    $(".txterror").remove();
    $(".pswerror").remove();

    //checking all textboxes by dif rulles
    //if no errors exec next
    //else - prevent button click
    request();

    //checking tagslike text in inputs
    if (noErrors()) {
        noTag();
    }
    //checking passwords equality
    if (noErrors()) {
        EqualPasswords();
    }
    //checking length of passwords
    if (noErrors()) {
        LengthCheck();
    }
    //if any error - prevent button click
    if (!noErrors()) {
        event.preventDefault();
    }
});

//No errors in inputs
function noErrors() {
    if ($("form").find(".txterror").val() == null && $("form").find(".pswerror").val() == null)
    {
        return true;
    }
    else
    {
        return false;
    }
    
}

//all inputs are filled
function request() {
    $(":text").each(function (index, obj) {
        if (($(this).val() == "")) {
            $(this).after('<span class="txterror">Must be filled</span>').css("borderColor", "red");
        }
        else {
            $(this).css("border", "none");
        }
    });

    //checking all passwords
    $(":password").each(function (index, obj) {
        if ((($(this).val() == ""))) {
            $(this).after('<span class="pswerror">Must be filled</span>').css("borderColor", "red");
        }
        else {
            $(this).css("border", "none");
        }
    });
}

//Inputs don't include tags
function noTag() {
        


    //patterns
    var openTag = /<\w*>/;
    var closetag = /<\w*\/\w*>/

        
    //checking all textboxes
    $(":text").each(function (index, obj) {
        if (openTag.test($(this).val()) || closetag.test($(this).val())) {
            $(this).after('<span class="txterror">can not be tag</span>').css("borderColor", "red");
        }
        else
        {
            $(this).css("border", "none");
        }
    });

    //checking all passwords
    $(":password").each(function (index, obj) {
        if (openTag.test($(this).val()) || closetag.test($(this).val())) {
            $(this).after('<span class="pswerror">passsword can not be tag</span>').css("borderColor", "red");
        }
        else {
            $(this).css("border", "none");
        }
    });
}

//Passwordboxes text is equal
function EqualPasswords() {
    //Creating and filling new arra y by all password boxes instances
    var e = new Array();
    $(":password").each(function (index, obj) {
        e[index] = $(this).val();
    });

    //more than two passwordboxes
    if (e.length > 1) {
        //checking for equality
        if (e[0] != e[1]) {
            $(":password").after('<span class="pswerror">passwords are not equal</span>').css("borderColor", "red");
        }
    }
}

//Checking lenght of inputs
function LengthCheck() {

    //checking all passwords
    $(":password").each(function (index, obj) {
        if ((($(this).val().length < 3))) {
            $(this).after('<span class="pswerror">minimum length for password is 3</span>').css("borderColor", "red");
        }
        else {
            $(this).css("border", "none");
        }
    });
}

   