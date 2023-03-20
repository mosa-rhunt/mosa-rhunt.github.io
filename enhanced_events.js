$(document).ready(function() {    
    //FLOATING SAVE BUTTONS
    let scroll_pos = localStorage.getItem("scroll_pos");
    if (scroll_pos) {
        $(window).scrollTop(scroll_pos);
        localStorage.removeItem("scroll_pos");
    }

    let now = new Date();
    let label = $("<label style='color:white' title='This is only a reference for the last time the event was saved'></label>").html("Last save:<br>" + now.toLocaleTimeString());
    let save = $("<input type='button' value='Save' />").on("click", function() {
        let scroll_pos = $(window).scrollTop();
        localStorage.setItem("scroll_pos", scroll_pos);
        $("#btnSave").trigger("click");
    });
    let save_and_close = $("<input type='button' value='Save & Close' />").on("click", function() {
        let scroll_pos = $(window).scrollTop();
        localStorage.setItem("scroll_pos", scroll_pos);
        //same as NewOrg's Save_Close() function
        $("#IF_CLOSE").val("True");
        $("#btnSave").trigger("click");
    });

    //add to DOM
    $("<div style='position:fixed; left:1200px; top:50%; background-color:#72899A; padding:15px; border:1px solid black; border-radius:5px'></div>")
    .append(label)
    .append("<br>")
    .append(save)
    .append("<span>&nbsp;</span>")
    .append(save_and_close)
    .insertAfter("#wrap");

    //ensure fancy text boxes resize with window
    $(window).on("resize", function() {
        let textboxes = $(".nicEdit-main").css("width", "100%").parent();
        let toolbars = $(textboxes).prev();
        let max_w = window.innerWidth * 0.9;
        $(textboxes).css("width", "100%").css("max-width", max_w);
        $(toolbars).css("width", "100%").css("max-width", max_w);
    });


    //code to prepopulate events based on MosaPrepopulate querystring
    let parameters = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        parameters[key] = value; //decodeURIComponent(value)
    });

    //support functions
    let textsUpdated = 0, textsRequired = 0;
    let setNicEditText = function(id, text, first=true) {
        if (first) textsRequired++;
        let editor = nicEditors.findEditor(id);
        if (editor) {
            editor.setContent(text);
            textsUpdated++;
        }
        else {
            setTimeout(function() { setNicEditText(id, text, false); }, 500);
        }
    }
    let autosaveEvent = function() {
        if (textsUpdated < textsRequired) setTimeout(function() { autosaveEvent(); }, 500);
        else $("#btnSave").trigger("click");
    }
    function save_event() {
        $("input[type=button][value*=Close]").trigger("click");
    }

    let year = (new Date()).getFullYear();
    let prepopulate_parameter = parameters["MosaPrepopulate"];
    if (!prepopulate_parameter) return;

    if (prepopulate_parameter == "AnnualInspection") {
        $("#event").val(year + " Annual"); //event title

        let today = $("#EventDate").val(); //upon event creation neworg uses today for the event date
        $("#FOpenText77").val(today); //File Sent to Inspector

        //increment day so it can't conflict with IR
        let event_date = new Date();
        event_date.setDate(event_date.getDate() + 1); //increment
        let d = event_date.getDate(); 
        let m = event_date.getMonth() + 1; //Month from 0 to 11
        let y = event_date.getFullYear();
        let new_date = m + "/" + d + "/" + y;
        $("#EventDate").val(new_date);

        let inspector_id = $("select[name*=OpenText1052]").val();
        $("select[name*=AssignedTo]").val(inspector_id);

        save_event();
    }
});


function enable_stock_statement_copy(dropdown_id, textbox_id, sep1="<br>", sep2="<br>") {
    if ($("#FOpenText" + textbox_id).length == 0) {
        console.log(`Textbox ${textbox_id} not found`);
        return;
    }

    //old code that might need to stick around???
    $("#FOpenText" + dropdown_id).addClass("chzn-select").css("z-index", "20")
    .next().next().addClass("chzn-select_span");
    if ($().chosen) $(".chzn-select").chosen({no_results_text: "No results matched"});

    //create interface and functionality
    let looky = $("<img src='images/search.gif' style='margin-right:10px' />").on("click", function() {
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        $("#preview" + dropdown_id).text(stock_statement);
    });

    let add_button = $("<button type=button>Add</button>").on("click", function() {
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        let old_text = nicEditors.findEditor("FOpenText" + textbox_id).getContent();
        let new_text = old_text + sep1 + stock_statement + sep2;
        nicEditors.findEditor("FOpenText" + textbox_id).setContent(new_text);
    });

    let div = $("<div></div>")
    .append(looky)
    .append(add_button)
    .append(`<div id='preview${dropdown_id}' style='width:500px; display:block'></div>`);
    $("#FOpenText" + dropdown_id).parent().after(div);
}
