vldr
---------------------------------------------------------------
vldr is a JavaScript-less configuration jQuery validator plugin.

It doesn't required any JavaScript code to make it run.

This is the first draft.

Usage
---------------------------------------------------------------
In required field use "vldr-required" class. Works on 

+ input[type=text]
+ input[type=checkbox] (Make checked required)
+ input[type=radio] (Made checked required for a radio in a name group)
+ select
+ textarea

Use the "data-vldr-required-msg" attribute to set up the error message.

In inputs with a required pattern use the "vldr-pattern". Works on:

+ input[type=text]

Set the JavaScript RegEx on the "data-vldr-pattern" attribute. And the "data-vldr-pattern-msg" attribute to set the error message.

Finally is no button is classified with "vldr-submit" all the forms will be validated. In case you use the "vldr-submit" class on a button only the parent's form will be validate



Dependencies
---------------------------------------------------------------

+ jQuery 1.5
+ HTML5 doctype to avoid validation issue 

TODO
---------------------------------------------------------------

+ Examples
+ Doc
+ Testing Cross-Browser
+ Allow configuration
