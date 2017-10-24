$(document).ready(function() {
    var $tweetForm = $("form");

    $tweetForm.on("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        $.post("/tweet", { tweet: $('#tweet-textarea').val() }, tweet => {
            console.log('new tweet', tweet);
            $(".app--tweet--list").load(location.href + " .app--tweet--list");
        });
    });
});


  