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


    //prepopulate
    let parameters = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        parameters[key] = value; //decodeURIComponent(value)
    });

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


function save_event() {
    $("input[type=button][value*=Close]").trigger("click");
}


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

    let add_button = $("<button type=button >Add</button>").on("click", function() {
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











/*
//prepopulate events based on MosaPrepopulate parameter
//https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
//EventUpdate.asp?Action=Create&new=New+Event&MosaPrepopulate=DroughtLetter&EventTypeNum=54&%40where.CustomerNum%40op.EQ=12145
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
    };

    let autosaveEvent = function() {
        if (textsUpdated < textsRequired) setTimeout(function() { autosaveEvent(); }, 500);
        else jQuery("#btnSave").trigger("click");
    };

     
    //==|| STATUSES ||==//
    Certification
    Fees
    Paperwork
    Paperwork and Fees
    Certification; Fees
    Certification; Paperwork
    Certification; Paperwork and Fees
    
    //==|| TYPES ||==//

    

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
            autosaveEvent();
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
            autosaveEvent();
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
            autosaveEvent();
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
            autosaveEvent();
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
            autosaveEvent();
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
            autosaveEvent();
            //resolution event
            //window.open(window.location.href.replace(val, val + "Resolution"), "_blank").focus();
        }
    }
    else if (val.startsWith("Q2Fees")) {
        jQuery("#event").val(year + " Q2 Fees NONC"); //event title
        jQuery("#EventDate").val("09/07/2021"); //EventDate obv
        jQuery("#FOpenText112").val("Fees"); //AA status
        jQuery("#FOpenText35").val("Noncompliance"); //AA type
        jQuery("#FOpenText108").val("Q2"); //Quarter
        jQuery("#FOpenText144").val("09/07/2021"); //AA letter date
        jQuery("#FOpenText72").val("09/28/2021"); //Due By
        jQuery("#FOpenText111").attr("checked", "checked"); //cc: NOP Appeals Team (w/out enclosure)
        jQuery("#FOpenText111_x").val("Yes"); //cc: NOP Appeals Team (w/out enclosure)
        setNicEditText("FOpenText94", "Statement"); //enclosures
        setNicEditText("FOpenText38", textQ2Fees); //nonc letter text
        autosaveEvent();
    }
    else if (val.startsWith("Q3Fees")) {
        jQuery("#event").val(year + " Q3 and/or past-due fees NONC"); //event title
        jQuery("#EventDate").val("11/23/2021"); //EventDate obv
        jQuery("#FOpenText112").val("Fees"); //AA status
        jQuery("#FOpenText35").val("Noncompliance"); //AA type
        jQuery("#FOpenText108").val("Q3"); //Quarter
        jQuery("#FOpenText144").val("11/23/2021"); //AA letter date
        jQuery("#FOpenText72").val("12/14/2021"); //Due By
        jQuery("#FOpenText111").attr("checked", "checked"); //cc: NOP Appeals Team (w/out enclosure)
        jQuery("#FOpenText111_x").val("Yes"); //cc: NOP Appeals Team (w/out enclosure)
        setNicEditText("FOpenText94", "Statement"); //enclosures
        setNicEditText("FOpenText38", textQ3Fees); //nonc letter text
        autosaveEvent();
    }
    else if (val == "EZIR") {
        jQuery("#event").val(year + " EZ IR"); //event title
        jQuery("select[name*=AssignedTo]").val("90"); //Unassigned
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
    else if (val == "DroughtLetter") {
        //event title and description
        jQuery("#event").val("2021 Extreme Weather and Organic Certification Requirements"); 
        setNicEditText("id_desc", "Letter sent to a mailing list, via both Letterstream and, where applicable, to clients with an email address. Ryan has been given the mailing list. -Gabrielle");
    
        jQuery("select[name*='field.Status']").val("Complete"); //Event status
        let openclose = jQuery("select[name*='eminderStatu']").val("Closed"); //Open/closed
        console.log(openclose);
        jQuery("select[name*='AssignedTo']").val("21"); //Gabrielle
        jQuery("#FOpenText107").val("09/09/2021"); //Letter Date

        setNicEditText("FOpenText91", DroughtLetter); //Generic Text
        // autosaveEvent();
        // jQuery("input[type=button][value*=Close]").trigger("click");
    }
    // else if (val == "InspectionCorrection") {
    //     //one-time correction to push event date ahead one so it can't confluct with IRs
    //     let eventDate = new Date(jQuery("#EventDate").val()); 
    //     eventDate.setDate(eventDate.getDate() + 1); //increment
    //     let d = eventDate.getDate(); 
    //     let m = eventDate.getMonth() + 1; //Month from 0 to 11
    //     let y = eventDate.getFullYear();
    //     let newDate = m + "/" + d + "/" + y;
    //     jQuery("#EventDate").val(newDate);
    //     jQuery("input[type=button][value*=Close]").trigger("click");
    // }
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
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification,but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
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
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification,but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
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
"Alternatively, you may inform us of your surrender of your certification and pay all fees due through the effective date of the surrender. If you surrender your certification,but fail to pay the balance of your fees due, the unpaid fees will remain as an unresolved noncompliance. If you decide in the future to certify with MOSA or another accredited certifier, the unresolved noncompliance must be addressed"
+ "</p><p>" +
"You may also submit a rebuttal to this notice."
+ "</p><p>" +
"If this noncompliance is not adequately addressed by 5/26/2021, we will propose suspension of your MOSA certification. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"If you have any questions or concerns regarding this Notice of Noncompliance, Please contact MOSA immediately."
+ "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions."
+ "</p>";


const textQ2Fees = 
"<p>" +
"This letter is an official Notice of Noncompliance. The noncompliance procedure is described in Section 205.662(a) of the National Organic Program (NOP) Standards. The noncompliance is as follows: "
+ "</p><p>" +
"NOP Standard 205.400(e) says a person seeking to maintain certification must pay the applicable fees charged by the certifying agent. Our records show that you have past-due MOSA fees. Your past-due statement, showing all past-due amounts and all amounts invoiced through 8/1/2021, is enclosed. Please note the due dates. MOSA's Program Manual explains that noncompliance proceedings are instituted if financial requirements are not met in a timely manner. "
+ "</p><p>" +
"This noncompliance must be addressed by 9/28/2021. We request that you submit these past-due fees. Credit card payments are accepted."
+ "</p><p>" +
"You may submit a rebuttal to this noncompliance."
+ "</p><p>" +
"Failure to adequately address this noncompliance by the stated deadline can lead to the issuance of a proposed suspension of your organic certification. Additionally, as described in MOSA's fee schedule, there is a $10.00 quarterly late fee charged on accounts with balances 30 days pay due. The $10.00 charge is shown on the enclosed statement."
+ "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"Please contact the MOSA office if you have any questions."
+ "</p>";


const textQ3Fees = 
"<p>" +
"This letter is an official Notice of Noncompliance. The noncompliance procedure is described in Section 205.662(a) of the National Organic Program (NOP) Standards. The noncompliance is as follows:"
+ "</p><p>" +
"NOP Standard 205.400(e) says a person seeking to maintain certification must pay the applicable fees charged by the certifying agent. Our records show that you have past-due MOSA fees. Your statement, which includes all past-due amounts, is enclosed. Please note the due dates. MOSA's Program Manual explains that noncompliance proceedings are instituted if financial requirements are not met in a timely manner."
+ "</p><p>" +
"This noncompliance must be addressed by 12/14/2021. We request that you submit these past-due fees. Credit card payments are accepted."
+ "</p><p>" +
"You may submit a rebuttal to this noncompliance."
+ "</p><p>" +
"Failure to adequately address this noncompliance by the stated deadline can lead to the issuance of a proposed suspension of your organic certification. Additionally, as described in MOSA's fee schedule, there is a $10.00 quarterly late fee charged on accounts with balances 30 days pay due. The $10.00 charge is shown on the enclosed statement."
+ "</p><p>" +
"The NOP is notified of all noncompliances, proposed suspensions, and resolutions. To avoid suspension and the costly and cumbersome reinstatement process, we urge you to address this noncompliance as soon as possible."
+ "</p><p>" +
"Please contact the MOSA office if you have any questions."
+ "</p>";


const DroughtLetter = 
"<p>" +
"<b>Extreme Weather and Organic Certification Requirements</b>"
+ "</p><p>" +
"MOSA has received several recent inquiries from organic farmers who are concerned about their ability to meet the pasture requirements when faced with significant drought conditions. We also recognize that weather extremes are becoming more common. In some cases, the USDA may grant a variance from some organic requirements when compliance is not possible due to drought or other weather extremes. For example, due to significant drought conditions, in June, 2021, the USDA granted a temporary variance from the National Organic Program regulations regarding feed and pasture (§205.237(c)(1) and §205.239(a)(2)) for all certified organic ruminant livestock operations located in counties in California and Oregon that have been designated as primary or contiguous disaster areas. MOSA and the NOP monitor drought and other weather extremes, and MOSA can help advocate for consideration of temporary standards variance requests to the USDA."
+ "</p><p>" +
"Temporary Variances are addressed at section 205.290 of the NOP regulations. And National Organic Program Handbook Instruction 2601 provides more detail regarding temporary variances. That document is found here: <a href='https://www.ams.usda.gov/sites/default/files/media/2606.pdf'>https://www.ams.usda.gov/sites/default/files/media/2606.pdf</a>"
+ "</p><p>" +
"Variances may only be granted for the production and handling requirements at 7 C.F.R. §§ 205.203 - 205.207, 205.236 - 205.240, and 205.270 - 205.272. Reasons for requesting a variance may include natural disasters, damage caused by extreme weather or other business interruption, or research practices.&nbsp; A temporary variance may not be granted for any practice, material or procedure prohibited under §205.105, for feeding non-organic feed to organic livestock, or for any regulation not included in the sections listed above."
+ "</p><p>" +
"MOSA-certified operations may submit a written request for a temporary variance to MOSA. Requests should include supporting documentation justifying the need for the temporary variance. Documentation could include drought maps, news articles describing conditions related to the need for a variance, information from government authorities, or other evidence. MOSA would then review the information and make a recommendation to the USDA. If the USDA grants the temporary variance, a Notice of Temporary Variance Approval would describe the scope, restrictions, and duration of the temporary variance and operators must maintain records on any procedures or practices impacted by the variance."
+ "</p><p>" +
"Similarly, variances are possible under the OPT Grass-Fed program. For drought, operators must show they’re located in a county that is categorized as Moderate to Exceptional Drought conditions by the U.S. Drought Monitor (drought.gov); must provide facts showing that need for the variance was unavoidable and is ongoing, must explain why the short- and long-term pasture management strategies proved inadequate; and describe strategies for managing the available pasture if a variance is authorized."
+ "</p><p>" +
"Please contact MOSA if you’d like more information."
+ "</p><p>" +
"Current variances granted by the USDA can be found here: <a href='https://www.ams.usda.gov/sites/default/files/media/TemporaryVariancesCurrent.pdf'>https://www.ams.usda.gov/sites/default/files/media/TemporaryVariancesCurrent.pdf</a>"
+ "</p>";



*/