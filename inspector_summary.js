$(document).ready(function() {
    define_section("Contact Information", ["1361", "1364", "1367"], "#04e762");
    define_section("Inspection Details", ["1368", "1369"], "#f5b700");
    // define_section("", [""], "#00a1e4");
    // define_section("", [""], "#dc0073");
    //https://coolors.co/palette/04e762-f5b700-00a1e4-dc0073-89fc00

    //highlight residue tests
    $(".display1369").each(function() {
        if ($(this).text().includes("Yes")) {
            $(this).css("background", "#0c0");
      }
    });
    //highlight additional FR
    $(".display1066").each(function() {
        if ($(this).text().includes("Additional Final")) {
            $(this).css("background", "#0c0");
        }
    });

    //Input Inventory link
    let querystring_dict = {};
    location.search.substr(1).split("&").forEach(function(item) { querystring_dict[item.split("=")[0]] = item.split("=")[1] });
    $("#ii_link").prop("href", "?PrintFormNum=105&Action=View&EventNum=" + querystring_dict["EventNum"]);
    //Client's current Input Inventory <a id="ii_link" target="_blank">click here</a>
});


function define_section(title, groups, color="#ccc", begin_open=true) {
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
    $("table.display" + groups[0]).before(heading);
    if (!begin_open) $(expando).trigger("click");
}


function download_files_in_zip(include_folders=false) {
    let checked_ids = $('input[name=idfile]:checked').map(() => this.value).get().join(",");
    if (checked_ids.length == 0) alert("Please select at least one file for download");
    else openWindow("downfiles" + (include_folders ? "2" : "") + ".asp?idfile=" + checked_ids, "", "");
}


// <input type="checkbox" onClick="toggle_checkboxes(this)" /> Select All 
// <input TYPE=BUTTON VALUE="Download selected files as zip" NAME="" onclick="download_files_in_zip();">
// <input TYPE=BUTTON VALUE="Download selected into zip w folders" NAME="" onclick="download_files_in_zip(true);">

function toggle_checkboxes(source) {
    $("input[name=idfile]").prop("checked", source.checked);
    // checkboxes = document.getElementsByName('idfile');
    // for(var i=0, n=checkboxes.length;i<n;i++) {
    //     checkboxes[i].checked = source.checked;
    // }
}
