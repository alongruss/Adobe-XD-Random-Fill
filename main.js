/******************************************************************************
 *
 * Random Colors
 * ----------------
 *
 * Author: Alon Gruss
 * License: MIT
 * 
 * This Adobe XD plug-in helps you randomly
 *
 * 
 *
 * 
 *  
 *  
 *
 ******************************************************************************/

const { alert, confirm, prompt, error, warning } = require("./lib/dialogs.js");
let { Line, Rectangle, Ellipse, Path, Text, Group, RepeatGrid, Color } = require("scenegraph");
let commands = require("commands");
let params = {
    "rectangleFill": true,
    "ellipseFill": true,
    "pathFill": true,
    "textFill": true,
    "lineStroke": true,
    "rectangleStroke": true,
    "ellipseStroke": true,
    "pathStroke": true,
    "textStroke": true,
    "group": true,
    "grid": false
}

let bufferSelection = [];

function randomColorsCommand(selection) {
    console.clear();
    console.log("--------------------------------------");
    console.log("Random Color command is running!");
    if (selection.items.length > 0) {
        selection.items.filter(item =>
            itemIsAllowed(item))
            .forEach(item => {
                if (item instanceof RepeatGrid) { // if we found a RepeatGrid
                    /* console.log(item.constructor.name);
                     // save our selection in the buffer
                     let bufferSelectionItems = [...selection.items];
                     //selection.items = arrayRemove(selection.items, item);
                     // set the active selection to be the RepeatGrid
                     selection.items = [item];
                     // ungroup the RepeatGrid
                     commands.ungroup();
                     // add our selection buffer to the ungrouped result
                     //selection.items = bufferSelectionItems;
                     //bufferSelectionItems.push(selection.items);
                     //selection.items = bufferSelectionItems;
                     //Array.prototype.push.apply(selection.items, bufferSelection.items);
                     //console.log(item.editContextFill);
                     //console.log(item.children.at(0).children.at(0));
                     //console.log(item.children.at(0).children.at(0).width);
                     //item.children.at(0).children.at(0).width = 50;
                     //item.children.at(0).children.at(0).fill = new Color("rgb(255,0,0)");*/
                } else {
                    if (item.isContainer) {
                        randomFillGroup(item);
                    } else {
                        //randomFill(item);
                        randomStroke(item);
                    }
                }
            });
        return console.log(params);
    }
    showNoSelectionError();
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });

}

function randomFillGroup(item) {
    console.log("Randomly filling " + item.constructor.name);
    item.children.filter(item =>
        itemIsAllowed(item))
        .forEach(item => {
            if (item.isContainer) {
                randomFillGroup(item);
            } else {
                //randomFill(item);
                randomStroke(item);
            }
        });
}

function randomFill(input) {
    console.log("Randomly filling a " + input.constructor.name);
    input.fill = getRandomColor();
}

function randomStroke(input){
    console.log("Randomly stroking a " + input.constructor.name);
    input.stroke = getRandomColor();
}

function getRandomColor() {
    const red = Math.floor((Math.random() * 255));
    const green = Math.floor((Math.random() * 255));
    const blue = Math.floor((Math.random() * 255));
    const randomColor = new Color("rgb(" + red + ", " + green + ", " + blue + ")");
    return randomColor;
}

function itemIsAllowed(item) {
    if ((item instanceof Line && params.line) ||
        (item instanceof Rectangle && params.rectangleFill) ||
        (item instanceof Ellipse && params.ellipseFill) ||
        (item instanceof Path && params.pathFill) ||
        (item instanceof Text && params.textFill) ||
        (item instanceof Group && params.group) ||
        (item instanceof RepeatGrid && params.grid)) return true;
    return false;
}

async function randomColorsOptionsCommand(selection) {
    console.clear();
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
    console.log("Nothing selected (Random Color) - Nothing was selected to be randomaly filled :(\nPlease select an object or a group of objects.");
    return alert("Nothing selected (Random Color)", "Nothing was selected to be randomaly filled :(\nPlease select an object or a group of objects.");
}

async function showAbout() {
    return alert("Random Colors by Alon Gruss",
        "Random Colors lets you randomly fill and/or stroke the following selected objects:",
        "* Rectangles",
        "* Ellipses",
        "* Texts",
        " ",
        "----",
        "Random Colors can also work inside the following container objects:",
        "* Groups",
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

          form {
            //background-color: black;
          }

          .bold {
            font-weight: bold;
          }

          footer {
              background-color: #444;
              border-radius: 25px;
          }

        .flex {
            display: flex;
        }

      

        .between { justify-content: space-between; }
        .around  { justify-content: space-around; }
        .start   { justify-content: flex-start; }
        .end     { justify-content: flex-end; }
        .center  { justify-content: center; }
        .border * {
            border: 1px solid blue;
            padding: 4px;
            margin: 0 4px;
        }

      </style>
      <dialog>
          <form method="dialog">
              <h1>Random fill options</h1>
              <hr />
                <fieldset>
                  <legend>What objects properties do you want to randomize?</legend>
                  <div class="row between" id="wholeTable">
                    <div class="column between" id="labels">
                        <label>Type</label>
                        <label>Lines</label>
                        <label>Rectangles</label>
                        <label>Ellipses</label>
                        <label>Paths</label>
                        <label>Texts</label>
                    </div>
                    <div class="row end" id="boxes">
                        <div class="column between" id="fillBoxes">
                            <label>Fill</label>
                            <input type="checkbox" id="lineFillChk" name="shape" value="lineFill" disabled>
                            <input type="checkbox" id="rectangleFillChk" name="shape" value="rectangleFill">
                            <input type="checkbox" id="ellipseFillChk" name="shape" value="ellipseFill">
                            <input type="checkbox" id="pathFillChk" name="shape" value="pathFill">
                            <input type="checkbox" id="textFillChk" name="shape" value="textFill">
                        </div>
                        <div class="column between" id="strokeBoxes">
                            <label>Stroke</label>
                            <input type="checkbox" id="lineStrokeChk" name="shape" value="lineStroke">
                            <input type="checkbox" id="rectangleStrokeChk" name="shape" value="rectangleStroke">
                            <input type="checkbox" id="ellipseStrokeChk" name="shape" value="ellipseStroke">
                            <input type="checkbox" id="pathStrokeChk" name="shape" value="pathStroke">
                            <input type="checkbox" id="textStrokeChk" name="shape" value="textStroke">
                        </div>
                    </div>
    

                  </div>
                </fieldset>
                <hr />
                <fieldset>
                  <legend>What container objects do you want to fill?</legend>
                  <div>
                  <label class="row" for="groupChk"><input type="checkbox"  id="groupChk" name="shape" value="group"><span>Groups</span></label>
                  <label class="row" for="gridChk"><input type="checkbox"  id="gridChk" name="shape" value="grid" disabled><span>Grids <span class="bold">(currently unavailable)</span></span></label>
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
    const [dialog, form, cancel, ok,
        lineFillChk, rectangleFillChk, ellipseFillChk, pathFillChk, textFillChk,
        lineStrokeChk, rectangleStrokeChk, ellipseStrokeChk, pathStrokeChk, textStrokeChk,
        groupChk, gridChk] = [
        `dialog`,
        `form`,
        "#cancel",
        "#ok",
        "#lineFillChk", "#rectangleFillChk", "#ellipseFillChk", "#pathFillChk", "#textFillChk",
        "#lineStrokeChk", "#rectangleStrokeChk", "#ellipseStrokeChk", "#pathStrokeChk", "#textStrokeChk",
        "#groupChk",
        "#gridChk"
    ].map(s => document.querySelector(s));

    //// Populate checkbox elements from saved/default parameters.
    let checkboxArray = [
        lineFillChk, rectangleFillChk, ellipseFillChk, pathFillChk, textFillChk,
        lineStrokeChk, rectangleStrokeChk, ellipseStrokeChk, pathStrokeChk, textStrokeChk,
        groupChk, gridChk
    ];
    checkboxArray.forEach(checkbox => checkbox.checked = params[checkbox.value]);

    //// Add event handlers
    // Close dialog when cancel is clicked.
    // Note that XD handles the ESC key for you, also returning `reasonCanceled`
    cancel.addEventListener("click", () => dialog.close("reasonCanceled"));

    // Handle ok button click
    ok.addEventListener("click", e => handleSubmit(e, dialog, checkboxArray));
    // Handle form submit via return key
    form.onsubmit = e => handleSubmit(e, dialog, checkboxArray);

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
