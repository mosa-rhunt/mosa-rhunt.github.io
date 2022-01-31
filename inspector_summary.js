$(document).ready(function() {
    define_section("Contact Information", ["1361", "1364"]);
});

function define_section(title, groups, color="#AEBD37") {
    //title: string
    //groups: array of ids (numbers as strings) indicating which neworg blocks are included in the section
    //color: hex value for decoration
    
    let expando = $("<button type=button class=expand_button data-is_expanded=1>-</button>").on("click", function() {
        if (parseInt($(this).data("is_expanded"))) {
            for (let group of groups) {
                $("table.display" + group).hide();
            }
            $(this).text("+").data("is_expanded", 0);
        }
        else {
            for (let group of groups) {
                $("table.display" + group).show();
            }
            $(this).text("-").data("is_expanded", 1);
        }
    });
    let heading = $(`<div class=section_heading style='background-color:${color}'>${title}</div>`).append(expando);

    //set borders
    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        $("table.display" + group).css("border-left", "3px solid " + color).css("border-right", "3px solid " + color);
        if (i == groups.length - 1) $("table.display" + group).css("border-bottom", "3px solid " + color);
    }
    //add to dom
    $("table.display" + groups[0]).before(heading)
}
