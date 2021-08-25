/*
let width = $(window).width();
let scrollHeight = width*0.44;
let frontpageTableHeight = width*0.46;
let path = window.location.href;
console.log(path);

$(document).ready(function() {

    //Reload the page when using the browser back and forward button
    $(window).on('popstate', function () {
        location.reload(true);
    });

    $("#frontpage").css({top: frontpageTableHeight + 'px'});

    $(window).resize(function () {
        location.reload();
    });

    $(window).scroll(function() {

        if(path === "http://localhost:4000/#/") {
            //Check if window is scrolled more than the image height, adds/removes solid class
            if ($(this).scrollTop() > scrollHeight) {
                $('.navbar').addClass('solid');
            } else {
                $('.navbar').removeClass('solid');
            }
        } else {
            $('.navbar').addClass('solid');
        }
    });
});
*/
