//prepopulate events based on MosaPrepopulate parameter
//https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
jQuery(document).ready(function() {
    //console.log(jQuery().jquery); //version
    let parameters = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        parameters[key] = value; //decodeURIComponent(value)
    });

    let val = parameters["MosaPrepopulate"];
    if (!val) return;

    const eventTypes = {
        "21": "Admin - Application Details",
        "38": "Adverse Action",
        "54": "Communications",
        "53": "Complaint",
        "34": "Final Review",
        "55": "Final Review - Additional",
        "44": "Financial Transaction",
        "58": "Grass-Fed Certification",
        "26": "Initial Review",
        "52": "Initial Review - Additional",
        "32": "Inspection",
        "51": "Inspection - Additional",
        "45": "NewOrg System Notice",
        "49": "Staff Reminder",
        "56": "Sub Contact Certification",
        "48": "Surrender",
        "60": "Surrender DRAFT ",
        "57": "Timing Need",
        "59": "Transfers",
    };

    // let eventType = eventTypes[parameters["EventTypeNum"]] || "Communications"; //maybe not necessary
    
    let year = (new Date()).getFullYear();
    let textsUpdated = 0;
    let setNicEditText = function(id, text) {
        let editor = nicEditors.findEditor(id);
        if (editor) {
            editor.setContent(text);
            textsUpdated++;
        }
        else {
            setTimeout(function() { setNicEditText(id, text); }, 500);
        }
    };

    let autosaveEvent = function(textsRequired) {
        if (textsUpdated < textsRequired) setTimeout(function() { autosaveEvent(textsRequired); }, 500);
        else jQuery("#btnSave").trigger("click");
    };

    /* 
    //==|| STATUSES ||==//
    Certification
    Fees
    Paperwork
    Paperwork and Fees
    Certification; Fees
    Certification; Paperwork
    Certification; Paperwork and Fees
    
    //==|| TYPES ||==//

    */

    if (val.startsWith("PaperworkAndFees")) {
        jQuery("#FOpenText112").val("Paperwork and Fees"); //AA status
        jQuery("#FOpenText108").val("Q1"); //Quarter

        if (val.endsWith("Resolution")) {
            jQuery("#FOpenText35").val("Noncompliance Resolution"); //AA type
            jQuery("#event").val(year + " Q1 Paperwork and Fees NONC Resolution"); //event title
            jQuery("#EventDate").val("05/27/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/27/2021"); //AA letter date
            jQuery("select[name*='field.Status']").val("Void"); //Event status
            setNicEditText("FOpenText38", textResolution); //nonc letter text
            autosaveEvent(1);
        }
        else {
            jQuery("#FOpenText35").val("Noncompliance"); //AA type
            jQuery("#event").val(year + " Q1 Paperwork and Fees NONC"); //event title
            jQuery("#EventDate").val("05/05/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/05/2021"); //AA letter date
            jQuery("#FOpenText72").val("05/26/2021"); //Due By
            // jQuery("#FOpenText110").attr("checked", "checked"); //cc: NOP Appeals Team
            jQuery("#FOpenText110_x").val("Yes"); //cc: NOP Appeals Team
            setNicEditText("FOpenText38", textPaperworkAndFees); //nonc letter text
            autosaveEvent(1);
            //resolution event
            //window.open(window.location.href.replace(val, val + "Resolution"), "_blank").focus();
        }
    }
    else if (val.startsWith("Paperwork")) {
        jQuery("#FOpenText112").val("Paperwork"); //AA status
        jQuery("#FOpenText108").val("Q1"); //Quarter

        if (val.endsWith("Resolution")) {
            jQuery("#FOpenText35").val("Noncompliance Resolution"); //AA type
            jQuery("#event").val(year + " Q1 Paperwork NONC Resolution"); //event title
            jQuery("#EventDate").val("05/27/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/27/2021"); //AA letter date
            jQuery("select[name*='field.Status']").val("Void"); //Event status
            setNicEditText("FOpenText38", textResolution); //nonc letter text
            autosaveEvent(1);
        }
        else {
            jQuery("#FOpenText35").val("Noncompliance"); //AA type
            jQuery("#event").val(year + " Q1 Paperwork NONC"); //event title
            jQuery("#EventDate").val("05/05/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/05/2021"); //AA letter date
            jQuery("#FOpenText72").val("05/26/2021"); //Due By
            // jQuery("#FOpenText110").attr("checked", "checked"); //cc: NOP Appeals Team
            jQuery("#FOpenText110_x").val("Yes"); //cc: NOP Appeals Team
            setNicEditText("FOpenText38", textPaperwork); //nonc letter text
            autosaveEvent(1);
            //resolution event
            //window.open(window.location.href.replace(val, val + "Resolution"), "_blank").focus();
        }
    }
    else if (val.startsWith("Fees")) {
        jQuery("#FOpenText112").val("Fees"); //AA status
        jQuery("#FOpenText108").val("Q1"); //Quarter

        if (val.endsWith("Resolution")) {
            jQuery("#FOpenText35").val("Noncompliance Resolution"); //AA type
            jQuery("#event").val(year + " Q1 Fees NONC Resolution"); //event title
            jQuery("#EventDate").val("05/27/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/27/2021"); //AA letter date
            jQuery("select[name*='field.Status']").val("Void"); //Event status
            setNicEditText("FOpenText38", textResolution); //nonc letter text
            autosaveEvent(1);
        }
        else {
            jQuery("#FOpenText35").val("Noncompliance"); //AA type
            jQuery("#event").val(year + " Q1 Fees NONC"); //event title
            jQuery("#EventDate").val("05/05/2021"); //EventDate obv
            jQuery("#FOpenText144").val("05/05/2021"); //AA letter date
            jQuery("#FOpenText72").val("05/26/2021"); //Due By
            // jQuery("#FOpenText111").attr("checked", "checked"); //cc: NOP Appeals Team (w/out enclosure)
            jQuery("#FOpenText111_x").val("Yes"); //cc: NOP Appeals Team (w/out enclosure)
            setNicEditText("FOpenText38", textFees); //nonc letter text
            setNicEditText("FOpenText94", "Invoice"); //enclosures
            autosaveEvent(2);
            //resolution event
            //window.open(window.location.href.replace(val, val + "Resolution"), "_blank").focus();
        }
    }
    else if (val == "EZIR") {
        jQuery("#event").val(year + " EZ IR"); //event title
        jQuery("select[name*=AssignedTo]").val("90");
        jQuery("input[type=button][value*=Close]").trigger("click");
    }
    else if (val == "AnnualInspection") {
        jQuery("#event").val(year + " Annual"); //event title

        let today = jQuery("#EventDate").val(); //upon event creation neworg uses today for the event date
        jQuery("#FOpenText77").val(today); //File Sent to Inspector

        //increment day so it can't conflict with IR
        let eventDate = new Date(today); //don't even need to use today since js would assume that...
        eventDate.setDate(eventDate.getDate() + 1); //increment
        let d = eventDate.getDate(); 
        let m = eventDate.getMonth() + 1; //Month from 0 to 11
        let y = eventDate.getFullYear();
        let newDate = m + "/" + d + "/" + y;
        jQuery("#EventDate").val(newDate);

        let inspector_id = jQuery("select[name*=OpenText1052]").val();
        jQuery("select[name*=AssignedTo]").val(inspector_id);
        
        jQuery("input[type=button][value*=Close]").trigger("click");
    }
    else if (val == "InspectionCorrection") {
        //one-time correction to push event date ahead one so it can't confluct with IRs
        let eventDate = new Date(jQuery("#EventDate").val());
        eventDate.setDate(eventDate.getDate() + 1); //increment
        let d = eventDate.getDate(); 
        let m = eventDate.getMonth() + 1; //months are from 0 to 11
        let y = eventDate.getFullYear();
        let newDate = m +"/" + d + "/" + y;
        jQuery("#EventDate").val(newDate);
        jQuery("input[type=button][value*=Close]").trigger("click");
    }
});

const textResolution = "Thank you for submitting your 2021 annual update application paperwork and fees to our office. This resolves the issues identified in the Notice of Noncompliance dated 5/5/2021";

const textPaperworkAndFees =
"<p>" + 
"This letter is an official Notice of Noncompliance according to USDA National Organic Program regulations Section 205.662(a). NOP Standard 205.406(a) says to continue certification, a certified operation must annually pay the certification fees and submit an updated organic system plan to the certifying agent."
+ "</p><p>" +
"In January 2021, MOSA sent 2021 annual update paperwork and certification fee payment instructions. The completed update paperwork and fees payment were due 4/1/2021 (4/15/2021 if an extension was requested and granted)."
+ "</p><p>" +
"We have not received the required paperwork or fees. "
+ "</p><p>" +
"For MOSA to continue its work as your certification agency and to ensure your operation’s compliance with the regulations, we urge you to give this Notice of Noncompliance your immediate attention. MOSA understands the ongoing situation with Covid-19 (Coronavirus) may have been a factor in the missed annual update deadline."
+ "</p><p>" +
"This noncompliance must be fully addressed by 5/26/2021. We request that you submit your required annual update paperwork and fees plus applicable late fees. A late fee of $150.00 has been assessed to your account. If this noncompliance is not fully addressed by 5/26/2021, the late fee may increase to $300.00. MOSA accepts credit cards."
+ "</p><p>" +
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification, but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
+ "</p><p>" +
"You may also submit a rebuttal to this notice."
+ "</p><p>" +
"If this noncompliance is not adequately addressed by 5/26/2021, we will propose suspension of your MOSA certification. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"If you have any questions or concerns regarding this Notice of Noncompliance, Please contact MOSA immediately."
 + "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions."
 + "</p>";

const textPaperwork = 
"<p>" +
"This letter is an official Notice of Noncompliance according to USDA National Organic Program regulations Section 205.662(a). NOP Standard 205.406(a) says to continue certification, a certified operation must annually pay the certification fees and submit an updated organic system plan to the certifying agent."
+ "</p><p>" +
"In January 2021, MOSA sent 2021 annual update paperwork and certification fee payment instructions. The completed update paperwork and fees payment were due 4/1/2021 (4/15/2021 if an extension was requested and granted)."
+ "</p><p>" +
"We have not received the required 2021 annual update paperwork."
+ "</p><p>" +
"For MOSA to continue its work as your certification agency and to ensure your operation’s compliance with the regulations, we urge you to give this Notice of Noncompliance your immediate attention. MOSA understands the ongoing situation with Covid-19 (Coronavirus) may have been a factor in the missed annual update deadline."
+ "</p><p>" +
"This noncompliance must be fully addressed by 5/26/2021. We request that you submit your required annual update paperwork plus applicable late fees. A late fee of $150.00 has been assessed to your account. If this noncompliance is not fully addressed by 5/26/2021, the late fee may increase to $300.00. MOSA accepts credit cards."
+ "</p><p>" +
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification, but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
+ "</p><p>" +
"You may also submit a rebuttal to this notice."
+ "</p><p>" +
"If this noncompliance is not adequately addressed by 5/26/2021, we will propose suspension of your MOSA certification. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"If you have any questions or concerns regarding this Notice of Noncompliance, Please contact MOSA immediately."
+ "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions."
+ "</p>";

const textFees = 
"<p>" +
"This letter is an official Notice of Noncompliance according to USDA National Organic Program regulations Section 205.662(a). NOP Standard 205.406(a) says to continue certification, a certified operation must annually pay the certification fees and submit an updated organic system plan to the certifying agent."
+ "</p><p>" +
"In January 2021, MOSA sent 2021 annual update paperwork and certification fee payment instructions. The completed update paperwork and fees payment were due 4/1/2021 (4/15/2021 if an extension was requested and granted)."
+ "</p><p>" +
"We have not received the required 2021 fees."
+ "</p><p>" +
"For MOSA to continue its work as your certification agency and to ensure your operation’s compliance with the regulations, we urge you to give this Notice of Noncompliance your immediate attention. MOSA understands the ongoing situation with Covid-19 (Coronavirus) may have been a factor in the missed annual update deadline."
+ "</p><p>" +
"This noncompliance must be fully addressed by 5/26/2021. We request that you submit your required 2021 fees. A late fee of $150.00 has been assessed to your account. If this noncompliance is not fully addressed by 5/26/2021, the late fee may increase to $300.00. MOSA accepts credit cards."
+ "</p><p>" +
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification, but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
+ "</p><p>" +
"You may also submit a rebuttal to this notice."
+ "</p><p>" +
"If this noncompliance is not adequately addressed by 5/26/2021, we will propose suspension of your MOSA certification. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"If you have any questions or concerns regarding this Notice of Noncompliance, Please contact MOSA immediately."
+ "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions."
+ "</p>";

