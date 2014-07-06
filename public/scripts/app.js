$(document).ready(function() {
  // handle the form submit
  $("#searchText").on('keypress', function(e) {
    if (e.which == 13 || e.keyCode == 13) {
      if ($(this).val().trim().length > 0) {
        // initiate an AJAX call to send the data
        fireAJAX($(this).val().trim());
      }
    }
  });

  function fireAJAX(text) {
    $.ajax({
      type: "POST",
      url: "/search",
      data: {
        "search": text
      },
      beforeSend: function(xhr) {
        $('.tweet-results').html('');
        $('.results').show();
        enableState();
      },
      success: parseData,
      error: oops
    });
  }

  function parseData(data) {
    disableState();
    var html = '';
    for (var i = 0; i < data.length; i++) {
      var s = data[i].sentiment,
        t = data[i].tweet;

      var _o = {
        imgSrc: t.user.profile_image_url,
        tweetLink: 'http://twitter.com/' + t.user.screen_name + '/status/' + t.id_str,
        tweet: t.text,
        score: s.score ? s.score : '--',
        comparative: s.comparative ? s.comparative : '--',
        favorited: t.favorite_count ? t.favorite_count : 0,
        retweet: t.retweet_count ? t.retweet_count : 0,
        wordsMatched: s.words && s.words.length ? s.words : '--',
        positiveWords: s.positive && s.positive.length ? s.positive : '--',
        negativeWords: s.negative && s.negative.length ? s.negative : '--'
      };

      html += tmpl('tweet_tmpl', _o);
    };
    $('.tweet-results').html(html);
  }

  function oops(data) {
    $('.error').show();
    disableState();
  }

  function disableState() {
    $('.loading').hide();
    $('#searchText').prop('disabled', false);
  }

  function enableState() {
    $('.loading').show();
    $('#searchText').prop('disabled', true);
  }

});


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
  var cache = {};

  this.tmpl = function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +

      // Introduce the data as local variables using with(){}
      "with(obj){p.push('" +

      // Convert the template into pure JavaScript
      str
      .replace(/[\r\t\n]/g, " ")
      .split("{{").join("\t") // modified
      .replace(/((^|\}\})[^\t]*)'/g, "$1\r") // modified
      .replace(/\t=(.*?)}}/g, "',$1,'") // modified
      .split("\t").join("');") 
      .split("}}").join("p.push('") // modified
      .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };
})();
