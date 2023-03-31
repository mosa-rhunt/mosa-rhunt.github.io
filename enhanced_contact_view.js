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
    if (window.location.toString().includes("Page=Forms")) {
        $("a[target='SurveyUpdate']").each(function() {
            $(this).prop("target", "_blank");
        });
    }

    //add collapse- and expand-all functions on Files tab
    if (window.location.toString().includes("Page=Files")) {
        let file_types = [
            "AdverseAction",
            "Audittrail",
            "Fieldinformation",
            "Generalsanitation",
            "Ingredients,Certificates&Non-GMODocuments",
            "Inputs",
            "InspectionReports",
            "Livestocklist",
            "Mapsandflowcharts",
            "MOSATermsandConditionsAgreement",
            "Other",
            "Pest/wastemanagement",
            "PrivateLabel",
            "Productprofiles&labels",
            "Rations",
            "Regulatorycompliances",
            "Releaseofinformation",
            "Seed/plantingstockinformation",
        ];

        const expand_all = $("<a href='#filetop' style='margin-right:15px'>Expand All</a>").on("click", function() {
            let true_elements = [];
            let false_elements = [];
            for (let file_type of file_types) {
                true_elements.push("FileType" + file_type);
                true_elements.push("HideType" + file_type);
                false_elements.push("ShowType" + file_type);
                // js_session("File" + file_type); //NewOrg function, dunno what this does tbh
            }
            HM_f_ToggleElementList(true, true_elements, "id"); //NewOrg function 
            HM_f_ToggleElementList(false, false_elements, "id"); 
        });

        const collapse_all = $("<a href='#filetop' style='margin-right:15px'>Collapse All</a>").on("click", function() {
            let true_elements = [];
            let false_elements = [];
            for (let file_type of file_types) {
                false_elements.push("FileType" + file_type);
                false_elements.push("HideType" + file_type);
                true_elements.push("ShowType" + file_type);
                // js_sessionfalse("File" + file_type);
            }
            HM_f_ToggleElementList(true, true_elements, "id");
            HM_f_ToggleElementList(false, false_elements, "id"); 
        });

        //add to DOM
        $("a[href*='Page=Files']").prop("id", "filetop").parent().prop("align", null).prepend(collapse_all).prepend(expand_all);
    }
});
