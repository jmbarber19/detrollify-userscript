# What is This?
A Firefox extension to translate the translatable troll Pesterchum "quirks" from Homestuck.

# How to Use
After installation, Detrollify should work automatically, cleaning up troll quirks where it can.

### Trolls Currently translated:

* GC
* GA
* AT
* CG
* TC
* AC
* TA
* AA
* AG
* CT

### Show Troll

Unfortunately, all troll chatlogs are hand-written by the author of Homestuck, Andrew Hussie, and thus don't necessarily follow hard and fast rules. This means that Detrollify can't correct all of them perfectly. In those cases, fear not! Hover over a line of troll chat and you'll see the "Show Troll" link appear to the right. Clicking it will Re-trollify the line, letting you see it in its original glory.

![Example of Showing Trolltext](https://i.imgur.com/a3PIfp6.gif)

# Installation
Since this module is not listed in the Firefox add-on store, you'll need to add it yourself

1. Open Firefox.
1. Click on the Hamburger menu, normally in the upper-right, and click "Add-ons".
1. Click on the Cog menu at the top of the page and select "Install Add-on From File..."
1. Locate the .xpi file contained in this repo and add it.

# Contributing

Did you make updates to this module, and need to re-submit it so that you can use it? In other words, are you probably me? Follow these instructions:

1. Run `zip -r detrollify.zip . -x ".*" -x "__MACOSX" -x "README.md" -x "*.DS_Store"`
1. Rename the Compressed file to have the version in it.
1. Remove the old version.
1. Go to https://addons.mozilla.org/en-US/developers/
1. Modify the add-on and upload the new version.
1. After verification, wait for an email from Firefox that it's ready for use.
1. Use the link in the email to find the new version and use it.
