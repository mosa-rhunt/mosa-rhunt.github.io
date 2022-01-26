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

    //old code that might need to stick around??? related to stock statements
    $(".chzn-select_span").next().next().attr("data-placeholder", "Choose a reason").css("width:400px;").addClass("chzn-select");
    if(!jQuery().chosen) {
        // the plugin is not loaded => load it:
        jQuery.getScript("js/chosen.jquery.min.js", function() {
            $(".chzn-select").chosen({no_results_text: "No results matched"});

        });
    }
});


function enable_stock_statement_copy(dropdown_id, textbox_id) {
    let looky = $("<img src='images/search.gif' style='margin-right:10px' />").on("click", function() {
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        $("#preview" + dropdown_id).text(stock_statement);
    });

    let add_button = $("<button type=button >Add</button>").on("click", function() {
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        let old_text = nicEditors.findEditor("FOpenText" + textbox_id).getContent();
        let new_text = old_text + "<br>" + stock_statement + "<br>";
        nicEditors.findEditor("FOpenText" + textbox_id).setContent(new_text);
    });

    let div = $("<div></div>")
    .append(looky)
    .append(add_button)
    .append(`<div id='preview${dropdown_id}' style='width:500px'></div>`);
    $("#FOpenText" + dropdown_id).parent().after(div);
}
