$( document ).ready(function() {

    $('input[name="num_opensource"]').change(function () {

        if ($(this).val() > 0 ) {
            //show
            $('#input_oss_listing').show('slow');
        } else {
            //hide
            $('#input_oss_listing').hide('fast');
        }
    });
});