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
 * @param quirks
 * @param lowercase
 * @constructor
 */
var Troll = function(handle, quirks, lowercase) {
  if (typeof handle !== 'string') {
    throw "Handle is not string!";
  }
  if (!Array.isArray(quirks)) {
    throw "Quirks is not an array!";
  }
  if (typeof lowercase !== 'boolean') {
    throw "Lowercase is not boolean!";
  }
console.log('okay');
  return {
    'handle' : handle,
    'quirks' : quirks,
    'lowercase' : lowercase
  };
};

/**
 * A definition of a find and replace pair, where the replace is a Regex string.
 *
 * @param replace
 * @param find
 * @returns {{find: *, replace: *}}
 * @constructor
 */
var Quirk = function(replace, find) {
  if (typeof replace !== 'string') {
    throw "Quirk's replace is not a string!";
  }
  if (typeof find !== 'string') {
    throw "Quirk's find is not a string!";
  }

  return {
    'replace' : replace,
    'find' : find
  }
};

/**
 * An object where each parameter is a different troll's handle, and the Troll
 * object they correspond to.
 */
var trolls = {
  'GC' : new Troll('GC', [ // 3V3RY S3SS1ON 1S D1FF3R3NT 4 YOU
      new Quirk('I', '\w*(1)|(1)\w*|\b\w*(1)\w*\b'),
      new Quirk('TO', '\s+(2)\s+'),
      new Quirk('E', '\w*(3)|(3)\w*|\b\w*(3)\w*\b'),
      new Quirk('A', '\w*(4)|(4)\w*|\b\w*(4)\w*\b') // "4" only means "for" when alone.
    ], true),
  'GA' : new Troll('GA', [], true) // So You May Have Some Insight Into Her Disposition
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
    if (currentTroll.quirks) {
      console.log('current troll');
      for (var quirkindex in currentTroll.quirks) {
        if (currentTroll.quirks.hasOwnProperty(quirkindex)) {
          var quirk = currentTroll.quirks[quirkindex];
          console.log(quirkindex);

          // Quirks should be a pair of find/replace pairs, where replace is a REGEX-ready string.
          var re = new RegExp(quirk.find, 'g');
          fixedString = fixedString.replace(re, function (match, p1, offset, string) {
            console.log('match: ' + match + ', p1: ' + p1 + ', string: ' + string);
            if (p1) {
              return match.replace(p1, quirk.replace);
            }
            return match;
          });
        }
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
