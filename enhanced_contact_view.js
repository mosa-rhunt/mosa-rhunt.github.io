//various tweaks to NewOrg functionality
$(document).ready(function() {
    //hide NewOrg's "Comm Pref" because we already have a custom field called "Communication Method"
    let tbls = $(".row > div").find("table.text");
    let td = $(tbls[2]).find("td");
    let inner = $(td[0]).html();
    let i = inner.indexOf("<br><b>Comm Pref");
    if (i > 0) $(td[0]).html(inner.substring(0, i));
    
    //highlight border red if client isn't active or prospective
    let status_td = $(tbls[1]).find("td")[1];
    let status_text = $(status_td).find("font");
    if (["Surrendered", "Suspended", "Suspended/Reinstating", "Revoked", "Denied"].includes($(status_text).text())) {
        $(status_text).css("color", "#f00").css("font-weight", "bold");
        $(tbls[0]).css("border", "3px solid #f00");
    }

    //add download attribute to certain file types
    let download_file_types = [".rtf"];
    $("a[href^='downfiles.asp'").each(function() {
        for (let file_type of download_file_types) {
            if ($(this).text().endsWith(file_type)) {
                $(this).prop("download", true);
                break;
            }
        }
    });

    //make it so form/surveys can again open in separate tabs
    $("a[target='SurveyUpdate']").each(function() {
        $(this).prop("target", "_blank");
    });

    //add collapse- and expand-all functions on Files tab
    let file_types = [
        "AdverseAction",
        "Audittrail",
        "Fieldinformation",
        "Generalsanitation",
        "Ingredients,Certificates&Non-GMODocuments",
        "Inputs",
        "InspectionReports",
        "Livestocklist",
        "Mapsandflow charts",
        "MOSATermsandConditionsAgreement",
        "Other",
        "Pest/wastemanagement",
        "PrivateLabel",
        "Productprofiles&amp;labels",
        "Rations",
        "Regulatorycompliances",
        "Releaseofinformation",
        "Seed/plantingstockinformation",
    ];

    const expand_all = $("<a href='#' style='margin:0 10px'>Expand All</a>").on("click", function() {
        let elements = [];
        for (let file_type of file_types) {
            elements.push("FileType" + file_type);
            elements.push("HideType" + file_type);
        }
        HM_f_ToggleElementList(true, elements, "id"); //NewOrg function 
        // HM_f_ToggleElementList(true,['FileTypeProductprofiles&amp;labels','HideTypeProductprofiles&amp;labels'],'id'); 
        // js_session('FileProductprofiles&amp;labels'); //dunno what this does
    });

    const collapse_all = $("<a href='#' style='margin:0 10px'>Collapse All</a>").on("click", function() {
        let elements = [];
        for (let file_type of file_types) {
            elements.push("ShowType" + file_type);
        }
        HM_f_ToggleElementList(false, elements, "id"); 
    });

    //add to DOM
    $("a[href*='Files=History']").parent().prepend(collapse_all).prepend(expand_all);
});
