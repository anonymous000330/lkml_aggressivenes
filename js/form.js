$( document ).ready(function() {
    // SHOW UNSURE CHECKBOX WHEN....

    var text = $("#subject").text();
    var time = measureTextAmount(text) * 2000; // note: do not add fixed amount of time here

    // 1. when looking at previous annotation (prev) after x seconds
    var radioChangeCounter = $("input[type='radio']:checked").length;

    if (radioChangeCounter == 1) {
        if (time) {
            setTimeout(function(){
                $("#unsure").show(1000);
            }, time/2);}
    }

    // 2. on label change , using the radio counter
    $("input[type='radio']").change(function(){
        radioChangeCounter += 1;
        if (radioChangeCounter >= 2) {
            $("#unsure").delay(2000).show(1000);
        }
    });

    // 3.  on first interface interaction after z seconds
    var firstInteractionFlag = false;

    $(":input:not([type=hidden])").change(function(event){
        if (!firstInteractionFlag) {
            // get text length, compute time to read, start timer

            if (time) {
                setTimeout(function(){
                    $("#unsure").show(1000);
                }, time + 4000);} // + min 4000

            firstInteractionFlag = true;
        }

        $("#update_label").val("1");

        if (validateInput()) {
            $('#next').val("save & next");
            $('#next').prop('disabled', false);

            $('#tutorial_next').prop('disabled', false);
        } else {
            $('#next').prop('disabled', true);

            $('#tutorial_next').prop('disabled',true);

        }
    });

    // 4. on '?' label click
    $("#label_unsure").click(function () {
        $("#unsure").toggle(500);
    });

    // ------------------------------------------------------------------

    // STYLE DIVS of TARGET CHECKBOXES (js due to absence of css parent selector)
    styleTargetCheckboxes();

    $("fieldset.checkbox_labels").find("input").change(function(event){
        // change class (/background color) of changed checkbox-div for upper fieldset, based on checked status

        var box = $("fieldset.checkbox_labels div").has($(this))[0];

        if (box) {
            if ($(this).filter(":checked").length) {
                $(box).addClass("checked");
            } else {
                $(box).removeClass("checked");
            }
        }
    });

    $("#checkbox_unsure").change(function () {
        if ($(this).is(":checked")){
            $("#unsure").addClass("checked");
        } else {
            $("#unsure").removeClass("checked");
        }
    });
    // ------------------------------------------------------------------


    // GUIDELINES
    var guidelines = $("#guidelines");



    guidelines.resizable({}).draggable({

    });


    $("#guidelines_btn").click(function () { // expand / hide guidelines
        $("#guidelines").toggleClass("guidelines_show");
    });

    $("#guidelines").dblclick(function () { // expand / hide guidelines
        $("#guidelines").toggleClass("guidelines_show");
    });


    // NAVIGATION - save guidelines position

    $('#next').click(function (event) {
        saveGuidelinesPosition();
    });


    $('#prev').click(function (event) {
        saveGuidelinesPosition();
    });


    // TUTORIAL NAVIGATION
    $('#tutorial_next').click(function (event) {
        saveGuidelinesPosition();
        event.preventDefault();
        // TODO:
        getUserAnnotations();
        $("#foo").slideToggle();
        $("#compare_annotations").slideToggle();
        $("span.highlight").css('background-color', 'yellow');
        $("span.subtle_highlight").css('background-color', '#ECFF79');
    });

    // ------------------------------------------------------------------

    // USER COMMENT

    $('#label_comment').click(function (event) {
        $('#writecomment').slideToggle();
    });


    $("#comment").focusout(function(event) {
        if ($(this).val() == "") {
            $('#label_comment').attr("class", "");
        } else {
            $('#label_comment').attr("class", "checked");
        }
    });

});

function measureTextAmount(text) {
    if (text == "") {
        return null;
    }
    var lines = text.split("\n");
    return lines.length;
}


function validateInput(){

    var overall = $("input[type='radio']:checked").length;
    var targets = $("#checkbox_labels").find("input[type='checkbox']:checked");
    var other = $("#other_labelboxes").find("input[type='checkbox']:checked").length;

    if (targets.length > 1 && targets.filter("#label_target_none").length) {
        $("form fieldset:first-child").css("border-color", "red");
        return false;
    } else {
        $("form fieldset:first-child").css("border-color", "gainsboro");
    }

    if (other) {  // 1. TRUE if any of the 'other' checkboxes is checked
        return true;
    }

    if (!overall || !targets.length) {
        return false;
    }

    // 2. TRUE if at least one target-checkbox checked && target-checkboxes checked correctly && one radio must be selected
    return true;

}


function saveGuidelinesPosition(){
    // grab the coordinates of the guidelines div and write it into the hidden form field
    pos = $('#guidelines').attr("style");
    $('#position_guidelines').val(pos);
    classes = $('#guidelines').attr("class");
    $('#classes_guidelines').val(classes);
}


function getTop(ele) { // for guidelines
    var eTop = ele.offset().top;
    var wTop = $(window).scrollTop();
    var top = eTop - wTop;

    return top;
}


function styleTargetCheckboxes() {
    $("fieldset.checkbox_labels div").each(function () {
        if ($(this).has("input:checked")[0]) {
            $(this).addClass("checked");
        }

    });

    if ($("#checkbox_unsure").is(":checked")){
        $("#unsure").addClass("checked");
    }
}



function getUserAnnotations(){
    // target
    var target = "<div class='labels_target'>Target: "
    var targets = $("#checkbox_labels input:checkbox:checked").map(function(){
        return "<span class='label_target'>" + $(this).next("label").text() + "</span>";
    }).get();
    if (targets == "") {
        targets = "&mdash;";
    }
    target += targets + "</div>";

    // meta
    var meta = "Meta: ";
    if ($("#meta_talk").is(":checked")) {
        meta += "<span class='label_meta'>This e-mail contains a meta-discussion.</span><br>";
    } else {
        meta += "&mdash;";
    }

    // overall
    var overall = "<br>Overall impression: <span class='label_overall'>";
    var overall_label = $("#radios input:radio:checked").map(function(){
        return $(this).next("label").text();
    }).get();

    if (overall_label == ""){
        overall_label = "&mdash;";
    }

    overall += overall_label;

    // unsure
    var unsure = "";
    if ($("#checkbox_unsure").is(":checked")){
        unsure = ", <em class='underline'>but not sure!</em>";
    }

    overall += (unsure + "</span>");

    // other
    var other = "<br>Other: ";
    var others = $("#other input:checkbox:checked").map(function(){
        return "<span class='label_other'>" + $(this).next("label").text() + "</span>";
    }).get();

    if (others == "") {
        others = "&mdash;"
    }

    other += others;

    // comment
    var comment = $("#comment").val();

    if (comment != "") {
        comment =  "<div class='note'>Comment: " + comment + "</div>";
    }

    $("#user_annotation").append(target + meta + overall + other + comment);
}