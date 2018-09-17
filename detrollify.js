/**
 detrollify.js by @jwaxo
 This seeks out the chat logs on a page of Homestuck and attempts to remove the
 various typing "quirks" of Trolls to make them more legible.

 As typing quirks are considered a large part of a troll's personality, and may
 have some story implications, this can be seen as a hostile move by the
 Homestuck fandom. You have been warned.
 **/

var chatlogs = $(".o_chat-log span");
var showtrolltext = "(show troll)";
var hidetrolltext = "(hide troll)";

/**
 * A constructor to hold necessary data on a per-Troll basis.
 * I created this object in case I need to create a unique function for each
 * troll.
 *
 * @param handle
 * @param quirk
 * @param lowercase
 * @constructor
 */
var Troll = function(handle, quirk, lowercase) {
  if (typeof handle !== 'string') {
    throw "Handle is not string!";
  }
  if (typeof quirk !== 'object') {
    throw "Quirk is not key->value object!!";
  }
  if (typeof lowercase !== 'boolean') {
    throw "Lowercase is not boolean!";
  }

  return {
    'handle' : handle,
    'quirk' : quirk,
    'lowercase' : lowercase
  };
};

/**
 * An object where each parameter is a different troll's handle, and the Troll
 * object they correspond to.
 */
var trolls = {
  // 3V3RY S3SS1ON 1S D1FF3R3NT
  'GC' : new Troll('GC', {
      '1': 'I',
      '3': 'E',
      '4': 'A'
    }, true)
};

/**
 * Loop through each line in the log and, if it's a recognized troll line,
 * translate according to the trolls array.
 */
chatlogs.each(function(index, e) {
  var originalString = $(this).text();
  var fixedString = originalString;
  var testHandle = fixedString.match(/^([A-Z]+):/);
  var chatlog = $(this);
  if (testHandle && trolls[testHandle[1]]) {
    // Run replacements based on which handle was found.
    var currentTroll = trolls[testHandle[1]];
    if (currentTroll.quirk) {
      for (var quirk in currentTroll.quirk) {

        // Currently this will look for individual characters that appear within
        // words, IE a single number-letter replacement. This may need to be
        // moved to the Troll definition if they start using more complex quirks.
        var re = new RegExp('\w*(' + quirk + ')|(' + quirk + ')\w*|\b\w*(' + quirk + ')\w*\b', 'g');

        fixedString = fixedString.replace(re, function (match, p1, offset, string) {
          if (currentTroll.quirk[p1]) {
            return currentTroll.quirk[p1];
          }
          return match;
        })
      }
    }

    // Currently we make all troll lines entirely lowercase; making a more
    // intelligent replacement scheme, which allows emoticons for example, would
    // be ideal.
    if (currentTroll.lowercase) {
      fixedString = fixedString.toLowerCase();
    }

    // Add our link to the end of every line, allowing toggle of quirky roll.
    var link = document.createElement("a");
    $(this).after(link);
    $(link).css({
      "color" : "red",
      "cursor" : "pointer",
      "opacity" : "0",
      "padding-left" : "10px",
      "transition" : "opacity .5s"
    });
    $(link).html(showtrolltext);
    $(link).on("click", function() {
      if ($(this).html() === showtrolltext) {
        $(link).html(hidetrolltext);
        $(link).css({"color" : "blue"});
        chatlog.html(originalString);
      }
      else if($(this).html() === hidetrolltext) {
        $(link).html(showtrolltext);
        $(link).css({"color" : "red"});
        chatlog.html(fixedString);
      }
    });

    // Ensure that the link is hidden unless hovering over the line or the link
    // itself.
    var fadeout;
    $(link).on("mouseenter", function() {
      $(link).css("opacity", "100");
      window.clearTimeout(fadeout);
    });
    $(link).on("mouseleave", function() {
      fadeout = window.setTimeout(function() {
        $(link).css("opacity", "0");
      }, 200);
    });

    $(this).on("mouseenter", function() {
      $(link).css("opacity", "100");
      window.clearTimeout(fadeout);
    });
    $(this).on("mouseleave", function() {
      fadeout = window.setTimeout(function() {
        $(link).css("opacity", "0");
      }, 200);
    });

    // Finally, replace our fixed string!
    $(this).html(fixedString);
  }
});
