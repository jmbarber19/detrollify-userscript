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

// Emoticons only needs to include ones that have a letter character which will
// be affected by the lowercasifying.
var emoticons = [
  '>:D',
  '>8D',
  ':P'
];

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

  return {
    'handle' : handle,
    'quirks' : quirks,
    'lowercase' : lowercase
  };
};

/**
 * A definition of a find and replace pair, and the Regex used to locate the issue.
 *
 * @param fixed
 *   What to replace with.
 * @param broken
 *   The succinct example of what needs to be replaced.
 * @param find
 *   Regex for the replaced text, to specify. Be sure to escape your slashes! \e should be \\e.
 * @returns {{find: *, replace: *}}
 * @constructor
 */
var Quirk = function(fixed, broken, find) {
  if (typeof fixed !== 'string') {
    throw "Quirk's replace is not a string!";
  }
  if (typeof broken !== 'string') {
    throw "Quirk's broken is not a string!";
  }
  if (typeof find !== 'string') {
    throw "Quirk's find is not a string!";
  }

  return {
    'fixed' : fixed,
    'broken' : broken,
    'find' : find
  }
};

/**
 * An object where each parameter is a different troll's handle, and the Troll
 * object they correspond to.
 */
var trolls = {
  'GC' : new Troll('GC', [ // 3V3RY S3SS1ON 1S D1FF3R3NT 4 YOU
    new Quirk('I', '1', '\w*(1)|(1)\w*'),
    new Quirk('TO', '2', '\s+(2)\s+'),
    new Quirk('E', '3', '\w*(3)|(3)\w*'),
    new Quirk('A', '4', '\w*(4)|(4)\w*') // "4" only means "for" when alone.
  ], true),
  'GA' : new Troll('GA', [], true), // So You May Have Some Insight Into Her Disposition
  'AT' : new Troll('AT', [], true), // oH, tHE ONE WHO'S SUPPOSED TO BE "cool", i THINK,
  'CG' : new Troll('CG', [], true), // MUST EXPLAIN WHY IT SPROUTED SUCH A MISERABLE CROP OF PLAYERS.
  'TA' : new Troll('TA', [ // whoa HERE2 an iidea.
    new Quirk('I', 'II', '(I{2,})'),
    new Quirk('I', 'II', '\b(i{2,})\b'),
    new Quirk('i', 'ii', '(i{2,})'),
    new Quirk('s', '2', '[a-z](2+)[a-z]|[a-z](2+)|(2+)[a-z]'), // We separate by caps here since TA tends to utilize caps
    new Quirk('S', '2', '[A-Z](2+)[A-Z]|[A-Z](2+)|(2+)[A-Z]'), // This makes it a bit trickier.
    new Quirk('to', 'two', '(two)'), // "two" can mean "too" or "to", but I'm willing to settle on them all being "to".
    new Quirk('TO', 'TWO', '(TWO)') // This character is definitely my first headache.
  ], false),
  'TC' : new Troll('TC', [], true), // wHaT iS uUuUuP mY iNvErTeBrOtHeR?
  'AC' : new Troll('AC', [ // :33 < *she thinks that goblin wishes n33d to come true too just like any other kind of purrsons wishes*
    new Quirk('', ':33 < ', '(\:33 \< )'), // Get rid of the multiple-mouths prefix
    new Quirk('e', '3', '[a-z]([3]+)[a-z]|[a-z]([3]+)|([3]+)[a-z]'), // Double-ees in sentences have been turned to 3s.
    new Quirk('pur', 'purr', '(purr)pose'),
    new Quirk('pre', 'purr', '(purr)tend'),
    new Quirk('po', 'purr', '(purr)sition'),
    new Quirk('pro', 'purr', '(purr)mise'),
    new Quirk('pa', 'purr', 'tele(purr)thy'),
    new Quirk('per', 'purr', '(purr)') // Actual uses of "purring" or "purrs" incorrectly change.
  ], false),
  'AA' : new Troll('AA', [ // im 0k with a l0t 0f things
    new Quirk('o', '0', '[a-z]([0]+)[a-z]|[a-z]([0]+)|([0]+)[a-z]')
  ], false),
  'AG' : new Troll('AG', [ // You were f8ed for a team of losers, full of 8lind girls and lame 8oys and cranky iiiiiiiim8eciles.
    new Quirk('ate', '8', '[a-zA-Z](8)s[^a-z]|[fh](8)[^a-z]|[fh](8)$'), // First go for the 8s that replace "ate". More word possibilities added as we go.
    new Quirk('at', '8', '[a-zA-Z](8)ed[^a-z]|[a-zA-Z](8)ing[^a-z]'),
    new Quirk('eat', '8', 'gr(8)[^a-z]|Gr(8)[^a-z]'),
    new Quirk('ATE', '8', '[A-Z](8)ED[^A-Z]|[A-Z](8)ING[^A-Z]|[A-Z](8)S[^A-Z]|[^A-Z][FH](8)[^a-z]|[^A-Z][FH](8)$'),
    new Quirk('EAT', '8', 'GR(8)[^a-z]'),
    new Quirk('ain', '8', '[^a-z](8)in\\\'t'),
    new Quirk('b', '8', '[a-z](8+)[a-z]|[a-z](8+)|(8+)[a-z]'),
    new Quirk('B', '8', '[A-Z](8+)[A-Z]|[A-Z](8+)|(8+)[A-Z]')
  ], false),
  'CT' : new Troll('CT', [ // D --> This is f001ishness upon one hundred thousand prior. What are you e%pecting.
    new Quirk('', 'D --> ', '(D \-\-\> )'),
    new Quirk('pollute', 'pol100t', '(pol100t)'), // What the hell.
    new Quirk('blue', 'b100', '(b100)'),
    new Quirk('Ool', '001', '^CT: (001)'),
    new Quirk('ool', '001', '(001)'),
    new Quirk('Loo', '100', '^CT: (100)'),
    new Quirk('loo', '100', '(100)'),
    new Quirk('ct', '%', '[a-z](%)ion[^a-z]'),
    new Quirk('sc', '%', '[Dd]i(%)ussion'),
    new Quirk('cc', '%', '[Aa](%)eptable'),
    new Quirk('cross', '%', '[^a-zA-Z](%)[^a-zA-Z]'),
    new Quirk('x', '%', '(%)')
  ], false),
  'CC' : new Troll('CC', [ // -Everyt)(ing we are about to do next is exciting.
    new Quirk('H', ')(', '(\\)\\()[A-Z]|(\\)\\()-E'),
    new Quirk('H', ')(', 'CC: (\\)\\()'),
    new Quirk('h', ')(', '(\\)\\()'),
    new Quirk('E', '-E', '(-E)')
  ], false),
  'CA' : new Troll('CA', [ // wwhatEVVER you are so the vvillage twwo wwheel devvice wwhen it comes to auspisticing
    new Quirk('w', 'ww', '(ww)'),
    new Quirk('W', 'WW', '(WW)'),
    new Quirk('v', 'vv', '(vv)'),
    new Quirk('V', 'VV', '(VV)')
  ], false)
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

      // Loop through the quirks and execute the replacements defined therein.
      for (var quirkindex in currentTroll.quirks) {
        if (currentTroll.quirks.hasOwnProperty(quirkindex)) {
          var quirk = currentTroll.quirks[quirkindex];

          // Quirks should be a pair of find/replace pairs, where replace is a REGEX-ready string.
          var re = new RegExp(quirk.find, 'g');
          fixedString = fixedString.replace(re, function (match) {
            // RegExp.replace functions are passed the following arguments:
            // match, [matched string 1, matched string 2, ...], offset, fullstring.
            // Since we can't deter HOW many possible matched strings there are,
            // we have to loop through the arguments, starting from the first
            // matched string, and ending two arguments before the end.
            for (var p = 1; p <= arguments.length - 2; p++) {
              if (arguments[p] !== '') {
                // In order to make certain that a couple of edge cases are taken
                // care of, create a NEW regex in order to capture, say, multiple
                // instances of the same capture group in a row, such as the "ss"
                // in "press".
                var rere = new RegExp(escape_reg_exp(quirk.broken), 'g');
                return match.replace(rere, quirk.fixed);
              }
            }

            return match;
          });
        }
      }
    }

    if (currentTroll.lowercase) {
      // Temporarily remove the Handle from the front of the string so it doesn't
      // get lowercasified, then lowercasify all dialogue.
      fixedString = fixedString.substring(currentTroll.handle.length);
      fixedString = fixedString.toLowerCase();
      fixedString = currentTroll.handle + fixedString;

      // Replace any lowercasified emoticons with uppercase ones.
      for (var index in emoticons) {
        var emoticon = emoticons[index];
        fixedString = fixedString.replace(emoticon.toLowerCase(), emoticon);
      }
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

/**
 * Escapes any escapable characters in a regex string.
 *
 * Should only be used if you're selecting your capture group later, since
 * parentheses are escaped via this function.
 *
 * @param string
 */
function escape_reg_exp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}
