/******************************************************************************
 *
 * Random Fill
 * ----------------
 *
 * Author: Alon Gruss
 * License: MIT
 *
 * 
 *
 * 
 *  
 *  
 *
 ******************************************************************************/

const { alert, confirm, prompt, error, warning } = require("./lib/dialogs.js");
var { Rectangle, Ellipse, Text, Group, RepeatGrid, Color } = require("scenegraph");
var params = {
    "rectangle": true,
    "ellipse": true,
    "text": true,
    "group": true,
    "grid": true
}

function randomColorsCommand(selection) {
    console.log("Random Fill command is running!");

    if (selection.items.length > 0) {
        selection.items.filter(item =>
            itemIsAllowed(item))
            .forEach(item => {
                if (item.isContainer) {
                    randomFillGroup(item);
                } else {
                    randomFill(item);
                }
            });
        return console.log(params);
    }
    showNoSelectionError();
}

function randomFillGroup(item) {
    console.log("Randomly filling " + item.constructor.name);
    item.children.filter(item =>
        itemIsAllowed(item))
        .forEach(item => {
            if (item.isContainer) {
                randomFillGroup(item);
            } else {
                randomFill(item);
            }
        });
}

function randomFill(input) {
    console.log("Randomly filling a " + input.constructor.name);
    var red = Math.floor((Math.random() * 255));
    var green = Math.floor((Math.random() * 255));
    var blue = Math.floor((Math.random() * 255));
    input.fill = new Color("rgb(" + red + ", " + green + ", " + blue + ")");
}

function itemIsAllowed(item) {
    if ((item instanceof Rectangle && params.rectangle) ||
        (item instanceof Ellipse && params.ellipse) ||
        (item instanceof Text && params.text) ||
        (item instanceof Group && params.group) ||
        (item instanceof RepeatGrid && params.grid)) return true;
    return false;
}

async function randomColorsOptionsCommand(selection) {
    if (selection.items.length > 0) {
        // Get and show the dialog
        const dialog = getDialog();
        const result = await dialog.showModal();

        // Exit if the user cancels the modal
        if (result === "reasonCanceled")
            return console.log("User clicked cancel or escape.");

        result.forEach((checkbox) => params[checkbox.value] = checkbox.checked);
        randomColorsCommand(selection);
        // Exit on user completion of task
        return console.log(params);
    }

    showNoSelectionError();

}

function getDialog() {
    // Get the dialog if it already exists
    let dialog = document.querySelector("dialog");

    if (dialog) {
        console.log("Dialog already loaded in DOM. Reusing...");
        return dialog;
    }

    // Otherwise, create and return a new dialog
    return createDialog();
}

async function showNoSelectionError() {
    console.log("Nothing selected (Random fill) - Nothing was selected to be randomaly filled :(\nPlease select an object or a group of objects.");
    return alert("Nothing selected (Random fill)", "Nothing was selected to be randomaly filled :(\nPlease select an object or a group of objects.");
}

async function showAbout() {
    return alert("About Random Colors",
        "Random Colors lets you randomly color selected objects:",
        "* ggg",
        "* ggg",
        "* ggg",
        "* ggg",
        "* ggg",
        " ",
        "## More Information",
        "----",
        "For more information, please see [my website](http://www.alongruss.com)."
    );
}

function getDialog() {
    // Get the dialog if it already exists
    let dialog = document.querySelector("dialog");

    if (dialog) {
        console.log("Dialog already loaded in DOM. Reusing...");
        return dialog;
    }

    // Otherwise, create and return a new dialog
    return createDialog();
}

function createDialog() {
    console.log(`
  Adding dialog to DOM. 
  This will remain in the DOM until \`dialog.remove()\ is called,
  or your plugin is reloaded.
    `);

    //// Add your HTML to the DOM
    document.body.innerHTML = `
      <style>
        dialog{
            //background-color: #7ac;
            //border: solid 10px #bb5;
        }

          form {
              
          }

          footer {
              background-color: #444;
              border-radius: 25px;
          }

        .row { align-items: center; }
      </style>
      <dialog>
          <form method="dialog">
              <h1>Random fill options</h1>
              <hr />
                <fieldset>
                  <legend>What objects do you want to fill?</legend>
                  <div>
                  <label class="row" for="rectangleChk"><input type="checkbox"  id="rectangleChk" name="shape" value="rectangle"><span>Rectangles</span></label>
                  <label class="row" for="ellipseChk"><input type="checkbox"  id="ellipseChk" name="shape" value="ellipse"><span>Ellipses</span></label>
                  <label class="row" for="textChk"><input type="checkbox"  id="textChk" name="shape" value="text"><span>Texts</span></label>
                  </div>
                </fieldset>
                <hr />
                <fieldset>
                  <legend>What container objects do you want to fill?</legend>
                  <div>
                  <label class="row" for="groupChk"><input type="checkbox"  id="groupChk" name="shape" value="group"><span>Groups</span></label>
                  <label class="row" for="gridChk"><input type="checkbox"  id="gridChk" name="shape" value="grid"><span>Grids</span></label>
                  </div>
                </fieldset>
              <footer>
                  <button id="cancel">Cancel</button>
                  <button type="submit" id="ok" uxp-variant="cta">OK</button>
              </footer>
          </form>
      </dialog>
    `;

    //// Get references to DOM elements
    // Each of these will be used in event handlers below
    const [dialog, form, cancel, ok, rectangleChk, ellipseChk, textChk, groupChk, gridChk] = [
        `dialog`,
        `form`,
        "#cancel",
        "#ok",
        "#rectangleChk",
        "#ellipseChk",
        "#textChk",
        "#groupChk",
        "#gridChk"
    ].map(s => document.querySelector(s));

    //// Add event handlers
    // Close dialog when cancel is clicked.
    // Note that XD handles the ESC key for you, also returning `reasonCanceled`
    cancel.addEventListener("click", () => dialog.close("reasonCanceled"));

    // Handle ok button click
    ok.addEventListener("click", e => handleSubmit(e, dialog, [rectangleChk, ellipseChk, textChk, groupChk, gridChk]));
    // Handle form submit via return key
    form.onsubmit = e => handleSubmit(e, dialog, [rectangleChk, ellipseChk, textChk, groupChk, gridChk]);

    return dialog;
}

function handleSubmit(e, dialog, result) {
    // Close the dialog, passing back data
    dialog.close(result);
    // Prevent further automatic close handlers
    e.preventDefault();
}

module.exports = {
    commands: {
        randomColorsCommand: randomColorsCommand,
        randomColorsOptionsCommand: randomColorsOptionsCommand,
        showAbout: showAbout
    }
};
