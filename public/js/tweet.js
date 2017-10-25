$(document).ready(function() {
  var $tweetForm = $("form");
// when the form submits, post to the server which will return the new tweet as a html fragment
  $tweetForm.on("submit", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $.post("/tweet", { tweet: $("#tweet-textarea").val() }, function (tweet) {
      $("ul.app--tweet--list").prepend(tweet);
      $("#tweet-textarea").val("");
    });
  });
  $("#tweet-textarea").on('keyup', function (e) {
    $("#tweet-char").text(140 - $("#tweet-textarea").val().length);
  });
});
