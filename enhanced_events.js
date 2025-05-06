$(document).ready(function() {    
    //floating save buttons
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

    //add floating save to DOM
    $("<div style='position:fixed; left:1200px; top:50%; background-color:#6fa2c9; padding:15px; border:1px solid black; border-radius:5px'></div>")
    .append(label)
    .append("<br>")
    .append(save)
    .append("<span>&nbsp;</span>")
    .append(save_and_close)
    .insertAfter("#wrap");

    //settlement agreement (if exists)
    $("#OpenText227").append(
        $("<button type=button>Settlement Agreement Template</button>").on("click", function() {
            //new editor
            // let ed = editors["FOpenText227"];
            // let view_fragment = ed.data.processor.toView(settlement_agreement_template);
            // let model_fragment = ed.data.toModel(view_fragment);
            // ed.model.insertContent(model_fragment, ed.model.document.selection);

            //old editor
            let old_text = nicEditors.findEditor("FOpenText227").getContent();
            nicEditors.findEditor("FOpenText227").setContent(old_text + settlement_agreement_template.replace("CLIENTID", $("#h_customerex").val()));
        })
    );

    //mediation notice (if exists)
    $("#OpenText232").append(
        $("<button type=button>Mediation Notice Template</button>").on("click", function() {
            let old_text = nicEditors.findEditor("FOpenText232").getContent();
            let new_text = "";
            if ($("#FOpenText226").val().includes("Accepted")) {
                let ot221 = $("#FOpenText221").val() || "PROPOSED SUSPENSION LETTER DATE";
                let ot225 = $("#FOpenText225").val() || "DATE MEDIATION REQUEST RECEIVED";
                new_text = mediation_accepted_template.replace("OpenText221", ot221).replace("OpenText225", ot225);
            }
            else if ($("#FOpenText226").val().includes("Rejected")) {
                let ot221 = $("#FOpenText221").val() || "PROPOSED SUSPENSION LETTER DATE";
                let ot223 = $("#FOpenText223").val() || "DATE OF SUSPENSION";
                let ot228 = $("#FOpenText228").val() || "REASON FOR REJECTION";
                new_text = mediation_rejected_template.replace("OpenText221", ot221).replace("OpenText223", ot223).replace("OpenText228", ot228);
            }
            nicEditors.findEditor("FOpenText232").setContent(old_text + new_text);
        })
    );

    //Reinstatement letter
    if ($("#id_type").val() == "Communications") {
        const template_definitions = {
            "Reinstatement": {
                template: reinstatement_template,
                attachments: "NOP Instruction 2605 - Reinstating Suspended Operations<br>Application Packet<br>Sent by priority mail",
            },
            "Crop Inspection Fee Estimate": {
                template: producer_estimate_template,
                attachments: "Producer Fee Schedule",
            },
            "Livestock Inspection Fee Estimate": {
                template: livestock_estimate_template,
                attachments: "Producer Fee Schedule",
            },
            "Handler Inspection Inspection Fee Estimate": {
                template: handler_estimate_template,
                attachments: "Handler Fee Schedule",
            },
            "Application Accepted": {
                template: app_accepted_template,
                attachments: "",
            },
            "Application Rejected": {
                template: app_rejected_template,
                attachments: "",
            },
        };

        let select = $("<select id='letter_template'></select>");
        for (let key of Object.keys(template_definitions).sort((a, b) => a.localeCompare(b))) {
            $(select).append(`<option value="${key}">${key}</option>`);
        }

        let button = $("<button type=button>Add</button>").on("click", function() {
            // let old_text = nicEditors.findEditor("FOpenText91").getContent();
            let definition = template_definitions[$("#letter_template").val()] || {};
            nicEditors.findEditor("FOpenText91").setContent(definition.template);
            nicEditors.findEditor("FOpenText94").setContent(definition.attachments);
        });

        $("#OpenText91").append(select).append(button);
    }
    // Transfer letter
    else if ($("#id_type").val() == "Transfers") {
        $("#OpenText91").append(
            $("<button type=button>Instructions for Transfer Template</button>").on("click", function() {
                //old editor
                let old_text = nicEditors.findEditor("FOpenText91").getContent();
                let year = (new Date()).getFullYear();
                nicEditors.findEditor("FOpenText91").setContent(old_text + transfer_template.replaceAll("FULLYEAR", year));

                let enclosureText = "NOP 2604 Responsibilities of Certified Operations Changing Certifiying Agents<br>MOSA Fee Schedule<br>Sent by Priority Mail # ___";
                nicEditors.findEditor("FOpenText94").setContent(enclosureText);
            })
        );
    }

    //highlight fields based on printform selection
    $("#FileName").on("change", function() {
        //reset to normal
        $("div[id^='OpenText']").show();
        $("div[id^='OpenText']").find("font").css("background-color", "");

        //determine selected letter
        let match = $(this).val().match(/PrintFormNum=(\d+)/i);
        if (!(match && match[1] in printform_field_dict)) return;

        if ($("#id_type").val() == "Noncompliance") {
            //hide all
            $("div[id^='OpenText']").hide();
            //selectively show divs
            for (let field_id of printform_field_dict[match[1]]) {
                $("#OpenText" + field_id).show();
            }
        }
        else {
            //selectively highlight labels
            for (let field_id of printform_field_dict[match[1]]) {
                $("#OpenText" + field_id).find("font").first().css("background-color", "#ff0");
            }
        }
    });

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
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
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


function enable_stock_statement_copy(dropdown_id, textbox_id, sep1_or_transform="<br>", sep2="<br>") {
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
        let stock_statement_title = $("#FOpenText" + dropdown_id).find(":selected").text();
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        let old_text = nicEditors.findEditor("FOpenText" + textbox_id).getContent();
        
        let new_text = "";
        if (typeof sep1_or_transform == "function") {
            new_text = sep1_or_transform(stock_statement, stock_statement_title) || "";
        }
        else if (typeof sep1_or_transform == "string") {
            new_text = sep1_or_transform + stock_statement + sep2;
        }

        nicEditors.findEditor("FOpenText" + textbox_id).setContent(old_text + new_text);
    });

    let div = $("<div></div>")
    .append(looky)
    .append(add_button)
    .append(`<div id='preview${dropdown_id}' style='width:500px; display:block'></div>`);
    $("#FOpenText" + dropdown_id).parent().after(div);

    const nonc_fields = [
        ["37", "65"],
        ["219", "112", "108", "230", "144", "72", "231", "71", "160", "52", "163", "23", "38"],
        ["214", "107", "91"],
        [""],
    ]
}


function enable_stock_statement_copy2(dropdown_id, textbox_id, sep1_or_transform="<br>", sep2="<br>") {
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
        let stock_statement_title = $("#FOpenText" + dropdown_id).find(":selected").text();
        let stock_statement = $("#FOpenText" + dropdown_id).val();
        let old_text = nicEditors.findEditor("FOpenText" + textbox_id).getContent();
        
        let new_text = "";
        if (typeof sep1_or_transform == "function") {
            new_text = sep1_or_transform(stock_statement, stock_statement_title) || "";
        }
        else if (typeof sep1_or_transform == "string") {
            new_text = sep1_or_transform + stock_statement + sep2;
        }

        nicEditors.findEditor("FOpenText" + textbox_id).setContent(old_text + new_text);
    });

    let div = $("<div></div>")
    .append(looky)
    .append(add_button)
    .append(`<div id='preview${dropdown_id}' style='width:500px; display:block'></div>`);
    $("#FOpenText" + dropdown_id).parent().after(div);

    // const nonc_fields = [
    //     ["37", "65"],
    //     ["219", "112", "108", "230", "144", "72", "231", "71", "160", "52", "163", "23", "38"],
    //     ["214", "107", "91"],
    //     [""],
    // ]
}


const printform_field_dict = {
    // "printform_id": ["field_ids"],
    "171": ["144", "219", "38", "220", "52"], //combined notice
    "169": ["223", "144", "121", "109", "94"], //denial of certification
    "173": ["91", "107", "214"], //followup letter
    "23": ["91", "107", "214"], //generic letter
    "174": ["230", "72", "38", "109", "94"], //fees nonc Letter
    "167": ["221", "223", "224", "225", "226", "228", "232", "109", "94"], //mediation notice
    "170": ["144", "231", "72", "109", "94"], //nonc reminder
    "121": ["144", "160", "38", "109", "94"], //nonc resolution
    "120": ["144", "72", "38", "52", "74"], //notice of nonc
    "165": ["220", "221", "222", "121", "74"], //prop susp - broken settlement
    "164": ["220", "144", "221", "121", "74"], //prop susp - unresolved nonc
    "168": ["227"], //settlement agreement
    "166": ["223", "167", "74"], //suspension of certification
    "2": ["9", "72", "101", "109", "94"], //IR MIN
    "81": ["9", "133", "72", "109", "94"], //IR MIN Reminder
    "3": ["70", "101", "39", "109", "94"], //IR Notification
    "4": ["40", "9", "39", "109", "94"], //IR Resolution
    "": [""], //
};

//The following letter text must exist in this script because the HTML Pre/Post text spots in NewOrg have a character limit

const settlement_agreement_template = `
<p>
Account #CLIENTID 
</p><p>
THIS SETTLEMENT AGREEMENT is entered into by Midwest Organic Services Association (MOSA), and <span style='background: #ff0;'>___name of operation__. (additional language for corporations/non individuals): , and anyone responsibly connected with __name of operation__ </span>
</p><p>
MOSA and <span style='background: #ff0;'>__name of operation___</span> and have decided to compromise and settle the issues among them related to alleged violations of the Organic Foods Production Act of 1990 (7 U.S.C. §§ 6501 et seq.) (OFPA), and USDA organic regulations (7 C.F.R. §§ 205 et seq.).
</p><p>
Accordingly, the parties agree to the following: 
</p><p>
1. MOSA agrees not to suspend the organic certification for <span style='background: #ff0;'>___name of operation_____________</span> for failure to adequately respond to the Notice of Noncompliance (dated <span style='background: #ff0;'>________</span>) which gave rise to this agreement.
</p><p>
<i><span style='color:#f00'>(Above is all boilerplate taken from NOP training samples. Variables include the operation name, which should be consistent with their legal status information - contact and business name or sole proprietor - and the date of the noncompliance notice or notices - sometimes a settlement can pull several issues into one conclusion.)</span></i>
</p><p>
2. <span style='background: #ff0;'>____name of operation_____________</span> agrees to the following:
</p><p>
A. <span style='background: #ff0;'>____name of operation_____________</span> agrees that failure to comply with the settlement agreement shall automatically void paragraph 1 above, and that MOSA may thereafter institute the proposed suspension.
</p><p>
B. <span style='background: #ff0;'>_____name of operation____________</span> agrees to<span style='background: #ff0;'> __specific terms, could be a sub list of terms (ie: 2) B. i, ii, iii___)_</span>
</p><p>
<i><span style='color:#f00'>(Terms listed above can be creative and can be rather prescriptive, must be compliant with the standards, and often may include something beyond usual compliance expectations, such as extra inspections at client expense, or submitting certain documents by certain timeframes.)</span></i>
</p><p>
This agreement will become effective upon being signed by all persons named below, and the terms shall remain in effect for a period of three years from the date of signing.
</p><p>
<i><span style='color:#f00'>(An end date is needed. Two or three years is typical. )</span></i>
</p><br><p>
________________________ Date: _________
</p><p>
<span style='background: #ff0;'>Name , Organization</span>
</p>
<br>MOSA<br>
<p>
_______________________Date: _________
</p><p>
Shelby Thomas, Compliance Manager
</p><p>
<i><span style='color:#f00'>(Note - the printed settlement agreement includes no letter date nor enclosures or cc: NOP. If a proposed settlement and acceptance of mediation are written from one event - an option - then these parts of the acceptance letter should be adjusted before printing.)</span></i>
</p>
`;


const mediation_accepted_template = `
<p>
On OpenText225, MOSA received your written request for mediation of the OpenText221 Notice of Proposed Suspension. This letter is to inform you that MOSA has accepted your request for mediation.
</p><p>
In mediation the certifying agency (MOSA) and the certified operation (you) work together to try to come to an agreement that addresses the issues resulting in the proposed suspension. Mediation can be a formal process, with a third party mediator, or, it can be pretty informal. In either case, a settlement agreement resulting from mediation typically describes steps that will be taken to address the issues which resulted in proposed suspension. Please note that MOSA charges a $100 per hour administrative fee for mediations.
</p><p>
Within ten (10) days of receipt of this letter, please contact me, or Shelby Thomas, MOSA Compliance Manager, (844) 637-2526, to set up a time for a mediation session by phone.
</p><p>
A settlement agreement, signed by both parties, will conclude the proposed suspension and enable continued certification. The NOP provides 30 days to reach a settlement agreement following mediation. If mediation fails, you have the option to submit an appeal to the NOP.
</p><p>
We look forward to working with you for a positive outcome.
</p><p>
If you have any questions or concerns, please contact us right away.
</p>
`;


const mediation_rejected_template = `
<p>
We have considered your request for mediation, in response to the Notice of Proposed Suspension (or Revocation) dated OpenText221. We have decided to reject mediation. We have rejected mediation because OpenText228.
</p><p>
If you so choose, you may file an appeal pursuant to §205.681. Your appeal must be filed within 30 days of your receiving this written notification of Rejection of Mediation. The appeal should be submitted in writing to: Administrator, USDA, AMS, c/o NOP Appeals Team, 1400 Independence Ave SW., Room 2648-So., Stop 0268, Washington, D.C. 20250-0268. Alternatively, you can submit your appeal via email to <a href="mailto:NOPAppeals@usda.gov">NOPAppeals@usda.gov</a>.
</p><p>
If you do not file an appeal within the time frame indicated above, your operation's certificate as a producer under the National Organic Program will be suspended as of OpenText223. You will be unable to sell or label your products as organic. If you have questions regarding this letter, please contact the MOSA office.
</p>
`;


const transfer_template = `
<p>
Thank you for letting us know you will be seeking organic certification with __________ for the FULLYEAR certification year. On _________, I reviewed with you both the National Organic Program's and MOSA's related requirements and procedures for operations changing certifying agents. I noted MOSA would send a follow-up letter describing requirements. We're providing the information below to clarify the transfer process, identify potential compliance concerns, and also help support a smooth transition. Please review this letter carefully and contact me with any questions or concerns.
</p><p>
Enclosed is the <b><i>National Organic Program Instruction 2604 - Responsibilities of Certified Operations Changing Certifying Agents (NOP 2604)</i></b>. The instruction applies to organic operations changing (transferring) from one accredited agency to another. MOSA's requirements for operations changing certifying agents are also described.
</p><p>
<b><u>National Organic Program Instructions and Requirements for Organic Operations Changing Certifiers</u></b>
<br>The enclosed NOP 2604 instruction says, 
"When changing certifying agents, the certified operation must either maintain the prior certification according to the USDA organic regulations or surrender their prior certification in writing. Certified Operations that are changing certifying agents and intend to continue to produce or sell products as organic must maintain their current certification until they have been granted certification by the new certifying agent." (Section 4.1.4)
</p><p>
<i>If you intend to continue to produce or sell product as organic while you are changing certifiers, you must maintain your current MOSA certification until your new certificate is issued</i>. NOP 2604 describes that maintaining your certificate includes 
"... submitting annual updates, allowing timely inspections, and paying all required fees to the current certifying agent." (Section 5.1.4)
</p><p>
You've told us that you intend to produce and sell product as organic during the transfer process. Therefore, you'll need to maintain your MOSA certificate until the new certificate is issued. You may voluntarily surrender your MOSA certificate once your new certificate is issued.
</p><p>
<b><u>MOSA's Requirements and Responsibilities for Operations Changing Certifiers</u></b>
<br>MOSA's annual update paperwork and fees are due 4/1/FULLYEAR. To meet the annual update requirement described in NOP instruction 2604, by 4/1/FULLYEAR you must submit your FULLYEAR annual update paperwork and fees to MOSA. If by 4/1/FULLYEAR you have not submitted to MOSA your annual update paperwork and fees (or alternatively, have not voluntarily surrendered your MOSA organic certificate), MOSA may issue a Notice of Noncompliance for failure to meet the annual update requirements. In addition, as your current certifier, MOSA requires that once you've submitted your application and fees to your new certifier, you provide us written confirmation of the new certifying agent's name (e.g., _______) and the date you submitted your application. MOSA may also periodically check on the progress of the application. This will support our responsibility to verify compliance during the transfer process and help determine reasonable steps for review. Until you voluntarily surrender your MOSA certificate, or until such time as your new certificate is issued, MOSA may continue with the FULLYEAR annual review of your operation.  Depending upon the process of your application with your new certifier, our work may include conducting the initial review, inspection, and final review.
<br><br>
If you will be maintaining your MOSA organic certificate during the transfer process, once your new certificate is issued, you may voluntarily terminate or "surrender" your MOSA certificate, in writing.  <b>NOP 2604 notes that "Operations should surrender their organic certifications only after the new certification process is complete."</b> (Section 5.1.5). 
<br><br>
If you choose not to maintain your MOSA certificate while changing certifiers, by 4/1/FULLYEAR please notify MOSA of your voluntary surrender in writing.  Please keep in mind that if you surrender your MOSA certificate prior receiving an organic certificate from your new certifier, you may not sell or represent products as organic.
<br><br>
<b><u>MOSA Fees</u></b>
<br>Our Program Manual notes that clients are responsible for any charges incurred up to the point of surrender. Please carefully review MOSA's <b><i>Surrender, Withdrawal, Transfer, or Other Termination</i></b> Policy described in the enclosed Fee Schedule.
<br><br>
<b><u>Cooperation between Accredited Agencies and Exchange of Information</u></b>
<br>Accredited certification agencies work cooperatively during transfers, and your new agency may request information from MOSA. This information typically includes your certification determination letter and certificate. Other information may also be requested.  As noted above, MOSA will also periodically check on the status of your new application.
<br><br>
<b><u>Comments and Considerations</u></b>
<br>We understand the logistical challenges that come with changing certifiers.  It may seem cumbersome. During the transfer, your operation will be subject to two separate certification processes, varying documentation requirements, and associated costs. We anticipate your new certification process will move forward in a timely fashion and that MOSA's role and responsibilities as your current certifier will conclude in reasonable time and with reasonable cost.  MOSA is available to answer any questions or concerns and will work with you and your new certifier during this process.";
`;


const reinstatement_template = `
<p>
This letter is a follow up to our_________ phone conversation regarding reinstatement of your MOSA organic certificate.
</p><p>
Your organic certificate was suspended on _______________, as described in the enclosed _____________ Notice of Suspension. Also enclosed are the related ______________Notice of Proposed Suspension and ______________ Notice of Noncompliance.
</p><p>
Because your certificate is suspended and no longer active, you are required to seek reinstatement. Enclosed is NOP Instruction 2605  -  Reinstating Suspended Operations. The Instruction describes the reinstatement process and procedures.
</p><p>
As a suspended operation, your application would be considered a new or initial application. Enclosed is an initial application packet. The suspension will remain so until all of the following items have been completed.
</p><p>
1. <u>Complete the New Client Overview form:</u> Complete and submit the New Client Overview (NCO). The NCO must provide a description of your production and timing needs. After we've reviewed your NCO, we'll let you know whether you may submit your initial application.  (If you would like, you may complete and return the enclosed initial application forms with the NCO. However, we can not accept your application and fee payment until Step 1 is completed).
</p><p>
2. <u>Submit initial application and Fees (after Step 1 is completed):</u>
</p><p>
<u>Initial Application:</u> The enclosed initial application forms must be completed and submitted to MOSA. As an alternative to sending in a paper application, you may complete and submit your application online using MyMOSA, our online application system. To access MyMOSA, please call the MOSA office - 844-637-2526, or call me directly - 608-572-7276. Make sure to complete all documents required and/or applicable to your operation. 
</p><p>
<u>Fees:</u>  Submit total payment of $______________ This includes initial certification fee ($______________) and a minimum, non-refundable reinstatement review fee ($500.00). Fees include an inspection deposit or base fee of $___________. If your inspection costs exceed $_______________, you will be billed for the difference. Please do not submit payment until Step 1 is completed and you have heard back from MOSA.
</p><p>
3. <u>Review and Inspection:</u> MOSA will conduct a full review and inspect the operation. All identified noncompliances must be resolved. 
</p><p>
4. <u>NOP Review:</u> The USDA/NOP Instruction for Reinstating Suspended Organic Operations <a href="https://www.ams.usda.gov/sites/default/files/media/2605.pdf">https://www.ams.usda.gov/sites/default/files/media/2605.pdf</a> is enclosed. MOSA must ensure all requirements for certification have been met and that the operation is capable of remaining in compliance before submitting written statements to the NOP in support of reinstatement.  Once the NOP receives the written request from the suspended operation and statement of compliance from MOSA, the NOP will review the request and either approve the reinstatement, or deny it with a letter sent to the operation with the reasons for denying eligibility for reinstatement.  If reinstatement is approved, MOSA will send you a certificate and a notice of reinstatement. 
</p><p>
The reinstatement process can take up to 4 - 6 months. MOSA cannot provide an exact time frame. 
</p><p>
Please contact me with any questions or concerns regarding the reinstatement process.
</p>
`;


const producer_estimate_template = `
<p>
MOSA has received your New Client Overview, and before we proceed with your application, we want to make sure you understand the potential inspection and certification costs. The USDA National Organic Program requires that your facility undergo an inspection every year, and we want to make sure that you understand these annual fees.
</p><p>
As a new client, you will pay $1375 when you submit your application. Included in the $1375 payment is a $350 deposit towards the final cost of inspection. After your first year, your certification fee is based on your organic sales, plus the inspection deposit. Attached is our fee schedule to give you an idea of what your fees might be in future years.
</p><p>
You may be billed later for inspection fees beyond the initial deposit. Your final Inspection Fees reflect the Organic Inspector's total time and expenses (travel, inspection, and report writing) and are affected by your organization and preparation, the complexity and location of your operation, and by post-inspection reporting. Good preparation can keep your costs down.
</p><p>
Based on the closest inspector to your area ( ______ miles away) the inspection fee could be approximately an additional _______ in cost above the _______ certification base fee. 
</p><p>
If possible, our inspectors try to coordinate multiple inspections on the same trip in order to save clients' expenses, however due to timing, location, and the complexity of scheduling other operations, it may not be possible for the inspector to coordinate multiple inspections in your area.
</p><p>
Before we move forward with your application, we need to be sure that you understand and approve the potential costs. Total costs (certification fees + inspection fees) will be around _______ to _______ for your first year of certification. 
</p><p>
<b>We need your approval indicating you understand the potential fees before we proceed further.</b> Please call or email me at your earliest convenience.
</p>
`;


const livestock_estimate_template = `
<p>
MOSA has received your New Client Overview, and before we proceed with your application, we want to make sure you understand the potential inspection and certification costs. The USDA National Organic Program requires that your facility undergo an inspection every year, and we want to make sure that you understand these annual fees.
</p><p>
As a new client, you will pay $1525 when you submit your application. Included in the $1525 payment is a $350 deposit towards the final cost of inspection. After your first year, your certification fee is based on your organic sales, plus the inspection deposit. Attached is our fee schedule to give you an idea of what your fees might be in future years.
</p><p>
You may be billed later for inspection fees beyond the initial deposit. Your final Inspection Fees reflect the Organic Inspector’s total time and expenses (travel, inspection, and report writing) and are affected by your organization and preparation, the complexity and location of your operation, and by post-inspection reporting. Good preparation can keep your costs down.
</p><p>
Based on the closest inspector to your area ( ______ miles away) the inspection fee could be approximately an additional _______ in cost above the _______ certification base fee. 
</p><p>
If possible, our inspectors try to coordinate multiple inspections on the same trip in order to save clients' expenses, however due to timing, location, and the complexity of scheduling other operations, it may not be possible for the inspector to coordinate multiple inspections in your area.
</p><p>
Before we move forward with your application, we need to be sure that you understand and approve the potential costs. Total costs (certification fees + inspection fees) will be around _______ to _______ for your first year of certification. 
</p><p>
<b>We need your approval indicating you understand the potential fees before we proceed further.</b> Please call or email me at your earliest convenience.
</p>
`;


const handler_estimate_template = `
<p>
MOSA has received your New Client Overview, and before we proceed with your application, we want to make sure you understand the potential inspection and certification costs. The USDA National Organic Program requires that your facility undergo an inspection every year, and we want to make sure that you understand these annual fees.
</p><p>
As a new client, you will pay $1600 when you submit your application. Included in the $1600 payment is a $450 deposit towards the final cost of inspection. After your first year, your certification fee is based on your organic sales, plus the inspection deposit. Attached is our fee schedule to give you an idea of what your fees might be in future years.
</p><p>
You may be billed later for inspection fees beyond the initial deposit. Your final Inspection Fees reflect the Organic Inspector's total time and expenses (travel, inspection, and report writing) and are affected by your organization and preparation, the complexity and location of your operation, and by post-inspection reporting. Good preparation can keep your costs down.
</p><p>
Based on the closest inspector to your area ( ______ miles away) the inspection fee could be approximately an additional _______ in cost above the _______ certification base fee. 
</p><p>
If possible, our inspectors try to coordinate multiple inspections on the same trip in order to save clients' expenses, however due to timing, location, and the complexity of scheduling other operations, it may not be possible for the inspector to coordinate multiple inspections in your area.
</p><p>
Before we move forward with your application, we need to be sure that you understand and approve the potential costs. Total costs (certification fees + inspection fees) will be around _______ to _______ for your first year of certification. 
</p><p>
We need your approval indicating you understand the potential fees before we proceed further. Please call or email me at your earliest convenience.
</p>
`;


const app_accepted_template = `
<p>
Congratulations! MOSA has secured an inspector, and with your acceptance of our cost estimate, MOSA will accept your application for certification. It is now your responsibility to pay fees and submit all paperwork required for certification in a timely manner. Keep in mind that while we have located an inspector for you, all of your paperwork and fees must be submitted before an inspection can be scheduled. If paperwork and fees are not submitted in a timely manner, the inspector’s schedule may fill up and they may no longer be able to accept this assignment, resulting in delayed inspection and increased inspection fees. 
</p><p>
Thank you for your interest in organic certification, and for choosing MOSA as your partner. Please contact MOSA’s Client Services with any questions. They can help you complete your application in a timely manner. They can be reached by phone at: 1-844-637-2526, by email at 
<a href="mailto:mosa@mosaorganic.org">mosa@mosaorganic.org</a>, or by text at 608-424-4118. MOSA office hours are Monday through Friday from 8:30 to 4:30 Central. 
</p>
`;


const app_rejected_template = `
<p>
Thank you for your interest in MOSA's certification services. After careful consideration, we regret to inform you that we are currently unable to accept your application. Due to the limited capacity of our inspectors, and the significant cost of sending an inspector to your location each year, we are unable to provide the required level of service and support.
</p><p>
We understand the importance of finding a certifier who can meet your needs efficiently. We recommend using the following USDA resource to locate another accredited certification agency offering services in your area: <a href="https://organic.ams.usda.gov/integrity/Certifiers/CertifiersLocationsSearchPage" target="_blank">Certifier Locator</a>.
</p><p>
You are also welcome to contact MOSA's Client Services team for assistance with finding an alternative certification service. They can be reached by phone at 1-844-637-2526, by email at <a href="mailto:mosa@mosaorganic.org">mosa@mosaorganic.org</a>, or by text at 608-424-4118. MOSA office hours are Monday through Friday from 8:30 to 4:30 Central.
</p><p>
We appreciate your understanding and wish you the best in your certification journey.
</p>
`;
