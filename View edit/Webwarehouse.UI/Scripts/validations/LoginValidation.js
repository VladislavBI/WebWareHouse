    //Validation of login and register views.

    //User tries to confirm his info.
$(":submit").on("click", function (event)
{


        //Cleaning previous errors.
    $(".txterror").remove();
    $(".pswerror").remove();

        //Checking all textboxes by different rulles
        //if no errors on current rull, check next one
        //else - prevent button click.

        //Check that inputs are filled
    request();

        //Checking "tagslike" text in inputs.
    if (noErrors()) {
        noTag();
    }
        //Checking passwords equality.
    if (noErrors()) {
        EqualPasswords();
    }
        //Checking length of passwords.
    if (noErrors()) {
        LengthCheck();
    }
        //If any error - prevent button click.
    if (!noErrors()) {
        event.preventDefault();
    }
});

    //No errors in inputs - no .txterror or .pswerror spans.
function noErrors()
{
        //No errors.
    if ($("form").find(".txterror").val() == null && $("form").find(".pswerror").val() == null)
    {
        return true;
    }

        //Have errors.
    else
    {
        return false;
    }

}

    //Check that all inputs are filled.
function request()
{

        //Checking all textboxes.
    $(":text").each(function (index, obj)
    {

        if (($(this).val() == ""))
        {
            //Adding error message.
            $(this).after("<span class=\"txterror message-fix\">Must be filled</span>").css("borderColor", "red");

        }

          //Returning textbox border to normal.
        else
        {
            $(this).css("borderColor", "#e2e2e2");
        }
    });
    
        //Checking all passwords.
    $(":password").each(function (index, obj)
    {
        if ((($(this).val() == "")))
        {
            //Adding error message.
            $(this).after("<span class=\"pswerror message-fix\">Must be filled</span>").css("borderColor", "red");
        }

            //Returning textbox border to normal.
        else
        {
            $(this).css("borderColor", "#e2e2e2");
        }
    });
}

    //Checking that inputs don't include tags.
function noTag()
{


        //Patterns.
    var openTag = /<.+>/;
    var closetag = /<.*\/.+>/;

        //Checking all textboxes.
    $(":text").each(function (index, obj)
    {
             //Adding error message.
        if (openTag.test($(this).val()) || closetag.test($(this).val()))
        {
            $(this).after("<span class=\"txterror message-fix\">Name can't be tag</span>").css("borderColor", "red");
        }

            //Returning textbox border to normal.
        else
        {
            $(this).css("borderColor", "#e2e2e2");
        }
    });

        //Checking all passwords.
    $(":password").each(function (index, obj)
    {
        if (openTag.test($(this).val()) || closetag.test($(this).val()))
        {
            //Adding error message.
            $(this).after("<span class=\"pswerror message-fix\">Passsword can't be tag</span>").css("borderColor", "red");
        }

            //Returning textbox border to normal.
        else
        {
            $(this).css("borderColor", "#e2e2e2");
        }

    });
}

    //Checking that passwords texts are equal to each other.
function EqualPasswords()
{

        //Creating and filling new array by texts from passwordboxes.
    var e = new Array();
    $(":password").each(function (index, obj)
    {
        e[index] = $(this).val();
    });

        //If more than one passwordbox
    if (e.length > 1)
    {

           //Checking for equality.
        if (e[0] != e[1])
        {
            //Adding error message.
            $(":password").after("<span class=\"pswerror message-fix\">Passwords are not equal</span>").css("borderColor", "red");
        }
            //Returning textbox border to normal.
        else {
            $(this).css("borderColor", "#e2e2e2");
        }
    }
}

    //Checking lenght of inputs 
    //textboxes don't checked here in case of "request" rule.
function LengthCheck()
{

        //Checking all passwords
    $(":password").each(function (index, obj)
    {
        if ((($(this).val().length < 3)))
        {
                //Adding error message.
            $(this).after("<span class=\"pswerror message-fix\">Minimum length for password is 3</span>").css("borderColor", "red");
        }
            //Returning textbox border to normal.
        else
        {
            $(this).css("borderColor", "#e2e2e2");
        }
    });
}