// ==UserScript==
// @name         Detrollify
// @version      2024-02-06
// @description  A userscript to clean the troll Pesterchum "quirks" from Homestuck for ease of access when reading.
// @author       https://github.com/jwaxo - original script
// @author       https://github.com/jmbarber19 - userscript port
// @match        https://www.homestuck.com/*
// @icon         https://www.homestuck.com/favicon.ico
// ==/UserScript==

const CHATLOGS = document.querySelectorAll(".o_chat-log span");
const TOGGLE_TEXT = "👁";
const RED_COLOR = "rgba(255,0,0,1)";
const CLEAR_COLOR = "rgba(255,0,0,0)";
const EMOTICONS = [
  'D:',
  '>:D',
  '>8D',
  ':P'
];

const escape_reg_exp = (stringToEscape) => {
  return stringToEscape.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
}

const Troll = (quirks, usesLowercase) => ({ quirks, usesLowercase });
const Quirk = (output, input, matchRegex) => ({ output, input, matchRegex });

const TROLLS = {
  'GA': Troll([], true), // So You May Have Some Insight Into Her Disposition
  'AT': Troll([], true), // oH, tHE ONE WHO'S SUPPOSED TO BE "cool", i THINK,
  'CG': Troll([], true), // MUST EXPLAIN WHY IT SPROUTED SUCH A MISERABLE CROP OF PLAYERS.
  'TC': Troll([], true), // wHaT iS uUuUuP mY iNvErTeBrOtHeR?
  'GC':
    Troll([ // 3V3RY S3SS1ON 1S D1FF3R3NT 4 YOU
      Quirk('I', '1', '\w*(1)|(1)\w*'),
      Quirk('TO', '2', '\s+(2)\s+'),
      Quirk('E', '3', '\w*(3)|(3)\w*'),
      Quirk('A', '4', '\w*(4)|(4)\w*') // "4" only means "for" when alone.
    ], true),
  'TA':
    Troll([ // whoa HERE2 an iidea.
      Quirk('I', 'II', '(I{2,})'),
      Quirk('I', 'II', '\b(i{2,})\b'),
      Quirk('i', 'ii', '(i{2,})'),
      Quirk('s', '2', '[a-z](2+)[a-z]|[a-z](2+)|(2+)[a-z]'), // We separate by caps here since TA tends to utilize caps
      Quirk('S', '2', '[A-Z](2+)[A-Z]|[A-Z](2+)|(2+)[A-Z]'), // This makes it a bit trickier.
      Quirk('to', 'two', '(two)'), // "two" can mean "too" or "to", but I'm willing to settle on them all being "to".
      Quirk('TO', 'TWO', '(TWO)') // This character is definitely my first headache.
    ], false),
  'AC':
    Troll([ // :33 < *she thinks that goblin wishes n33d to come true too just like any other kind of purrsons wishes*
      Quirk('', ':33 < ', '(\:33 \< )'), // Get rid of the multiple-mouths prefix
      Quirk('e', '3', '[a-z]([3]+)[a-z]|[a-z]([3]+)|([3]+)[a-z]'), // Double-ees in sentences have been turned to 3s.
      Quirk('pur', 'purr', '(purr)pose'),
      Quirk('pre', 'purr', '(purr)tend'),
      Quirk('po', 'purr', '(purr)sition'),
      Quirk('pro', 'purr', '(purr)mise'),
      Quirk('pa', 'purr', 'tele(purr)thy'),
      Quirk('per', 'purr', '(purr)') // Actual uses of "purring" or "purrs" incorrectly change.
    ], false),
  'AA':
    Troll([ // im 0k with a l0t 0f things
      Quirk('o', '0', '[a-z]([0]+)[a-z]|[a-z]([0]+)|([0]+)[a-z]')
    ], false),
  'AG':
    Troll([ // You were f8ed for a team of losers, full of 8lind girls and lame 8oys and cranky iiiiiiiim8eciles.
      Quirk('ate', '8', '[a-zA-Z](8)s[^a-z]|[fh](8)[^a-z]|[fh](8)$'), // First go for the 8s that replace "ate". More word possibilities added as we go.
      Quirk('at', '8', '[a-zA-Z](8)ed[^a-z]|[a-zA-Z](8)ing[^a-z]'),
      Quirk('eat', '8', 'gr(8)[^a-z]|Gr(8)[^a-z]'),
      Quirk('ATE', '8', '[A-Z](8)ED[^A-Z]|[A-Z](8)ING[^A-Z]|[A-Z](8)S[^A-Z]|[^A-Z][FH](8)[^a-z]|[^A-Z][FH](8)$'),
      Quirk('EAT', '8', 'GR(8)[^a-z]'),
      Quirk('ain', '8', '[^a-z](8)in\\\'t'),
      Quirk('b', '8', '[a-z](8+)[a-z]|[a-z](8+)|(8+)[a-z]'),
      Quirk('B', '8', '[A-Z](8+)[A-Z]|[A-Z](8+)|(8+)[A-Z]')
    ], false),
  'CT':
    Troll([ // D --> This is f001ishness upon one hundred thousand prior. What are you e%pecting.
      Quirk('', 'D --> ', '(D \-\-\> )'),
      Quirk('pollute', 'pol100t', '(pol100t)'), // What the hell.
      Quirk('blue', 'b100', '(b100)'),
      Quirk('Ool', '001', '^CT: (001)'),
      Quirk('ool', '001', '(001)'),
      Quirk('Loo', '100', '^CT: (100)'),
      Quirk('loo', '100', '(100)'),
      Quirk('ct', '%', '[a-z](%)ion[^a-z]'),
      Quirk('sc', '%', '[Dd]i(%)ussion'),
      Quirk('cc', '%', '[Aa](%)eptable'),
      Quirk('cross', '%', '[^a-zA-Z](%)[^a-zA-Z]'),
      Quirk('x', '%', '(%)')
    ], false),
  'CC':
    Troll([ // -Everyt)(ing we are about to do next is exciting.
      Quirk('H', ')(', '(\\)\\()[A-Z]|(\\)\\()-E'),
      Quirk('H', ')(', 'CC: (\\)\\()'),
      Quirk('h', ')(', '(\\)\\()'),
      Quirk('E', '-E', '(-E)')
    ], false),
  'CA':
    Troll([ // wwhatEVVER you are so the vvillage twwo wwheel devvice wwhen it comes to auspisticing
      Quirk('w', 'ww', '(ww)'),
      Quirk('W', 'WW', '(WW)'),
      Quirk('v', 'vv', '(vv)'),
      Quirk('V', 'VV', '(VV)')
    ], false)
};

///////

const css = 'table td:hover{ background-color: #00ff00 }';
const style = document.createElement('style');


for (let i = 0; i < CHATLOGS.length; i++) {
  const currentLog = CHATLOGS[i];
  let finalLog = currentLog.textContent;
  const logHandle = currentLog.textContent.match(/^([A-Z]+):/);
  if (currentLog.childNodes.length == 1 && logHandle && TROLLS[logHandle[1]]) {
    const currentTroll = TROLLS[logHandle[1]];

    if (currentTroll.quirks) {
      for (var q = 0; q < currentTroll.quirks.length; q++) {
        var currentQuirk = currentTroll.quirks[q];
        var re = new RegExp(currentQuirk.matchRegex, 'g');

        finalLog = finalLog.replace(re, function (match) {
          for (var p = 1; p <= arguments.length - 2; p++) {
            if (arguments[p] !== '') {
              var rere = new RegExp(escape_reg_exp(currentQuirk.input), 'g');
              return match.replace(rere, currentQuirk.output);
            }
          }
          return match;
        });
      }
    }

    if (currentTroll.usesLowercase) {
      finalLog = logHandle[1] + finalLog.substring(2).toLowerCase();
      for (var emoticon in EMOTICONS) {
        finalLog = finalLog.replaceAll(emoticon.toLowerCase(), emoticon);
      }
    }

    const toggleButton = document.createElement("a");
    toggleButton.className = "asdf"
    toggleButton.style.display = "inline";
    toggleButton.style.color = "rgba(255,0,0,0)";
    toggleButton.style.paddingLeft = "0.5em";
    toggleButton.style.textDecoration = "none";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.userSelect = "none";
    toggleButton.style.transition = "color 0.5s";
    toggleButton.dataset.originalText = currentLog.textContent;
    toggleButton.dataset.finalText = finalLog;
    toggleButton.dataset.showFinal = true;
    toggleButton.textContent = TOGGLE_TEXT;

    currentLog.onmouseover = (event) => {
      let localButton = event.target;
      if (event.target.tagName == "SPAN") {
        localButton = event.target.childNodes[event.target.childNodes.length - 1];
      }
      localButton.style.color = RED_COLOR;
    }

    currentLog.onmouseleave = (event) => {
      let localButton = event.target;
      if (event.target.tagName == "SPAN") {
        localButton = event.target.childNodes[event.target.childNodes.length - 1];
      }
      localButton.style.color = CLEAR_COLOR;
    }

    currentLog.onmousedown = (event) => {
      if (event.target.tagName != "A") {
        return;
      }
      let localButton = event.target;
      let textElement = event.target.parentNode.childNodes[0];

      if (localButton.dataset.showFinal == "true") {
        textElement.textContent = localButton.dataset.originalText;
        localButton.dataset.showFinal = false;
      } else {
        textElement.textContent = localButton.dataset.finalText;
        localButton.dataset.showFinal = true;
      }
    }

    currentLog.textContent = finalLog;
    currentLog.appendChild(toggleButton);

  }
}
