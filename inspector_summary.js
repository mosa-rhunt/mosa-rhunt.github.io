/*
This script rearranges and enhances the NewOrg print form for our Inspector Summary
It's intimately linked with PrintFormNum 115
*/
$(document).ready(function() {
    //fix cell widths so Description is extra wide
    $("table.display1371").last().find("thead td").each(function() {
        $(this).prop("width", "10%");
    })
    .last().prop("width", "60%");

    //Input Inventory link
    let querystring_dict = {};
    location.search.substr(1).split("&").forEach(function(item) { querystring_dict[item.split("=")[0]] = item.split("=")[1] });
    $("#ii_link").prop("href", "?PrintFormNum=105&Action=View&EventNum=" + querystring_dict["EventNum"]);
});


function define_section(title, groups, color="#ccc", begin_open=true) {
    //called from the print form so that updates to the layout don't require updates to the code
    //title: string
    //groups: array of ids (numbers as strings) indicating which neworg blocks are included in the section
    //color: hex value for decoration
    
    let expando = $("<button type=button class='expand_button noprint' data-is_expanded=1>-</button>").on("click", function() {
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
    for (let group of groups) {
        $("table.display" + group).first().css("border-left", "3px solid " + color).css("border-right", "3px solid " + color);
        //fix inner lists
        if ($("table.display" + group).length > 1) {
            $("table.display" + group).last().addClass("nested_table").find("td").removeClass();
        }
    }

    //add bottom border to last in the group
    $("table.display" + groups[groups.length - 1]).first().css("border-bottom", "3px solid " + color);

    //add to dom
    $("table.display" + groups[0]).first().before(heading);
    if (!begin_open) $(expando).trigger("click");
}


function colorize_event_types(group_id, cell_index) {
    $("table.display" + group_id).last().find("tbody > tr").each(function() {
        let event_type_cell = $(this).find("td").find("span")[cell_index];
        let event_type = $(event_type_cell).text();
        
        if (["Adverse Action", "Complaint", "Surrender", "Timing Need"].includes(event_type)) $(event_type_cell).addClass("et_bad");
        else if (["Initial Review", "Initial Review - Additional"].includes(event_type)) $(event_type_cell).addClass("et_initialreview");
        else if (["Final Review", "Final Review - Additional"].includes(event_type)) $(event_type_cell).addClass("et_finalreview");
        else if (["Grass-Fed Certification", "Inspection", "Inspection - Additional", "Sub Contact Certification"].includes(event_type)) $(event_type_cell).addClass("et_green");
        else $(event_type_cell).addClass("et_neutral");
        
        if (event_type.includes("Additional") || event_type.includes("Grass-Fed")) $(event_type_cell).addClass("et_additional");
    });
}


function download_files_in_zip(include_folders=false) {
    let checked_ids = $("input[name=idfile]:checked").map(() => $(this).val()).get().join(",");
    if (checked_ids.length == 0) alert("Please select at least one file for download");
    else openWindow("downfiles" + (include_folders ? "2" : "") + ".asp?idfile=" + checked_ids, "", "");
}


function toggle_checkboxes(source) {
    $("input[name=idfile]").prop("checked", source.checked);
}
