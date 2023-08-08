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
            nicEditors.findEditor("FOpenText227").setContent(old_text + settlement_agreement_template);
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

    //highlight fields based on printform selection
    $("#FileName").on("change", function() {
        //blank all
        $("div[id^='OpenText']").find("font").css("background-color", "");
        //selectively highlight labels
        let match = $(this).val().match(/PrintFormNum=(\d+)/i);
        if (match && match[1] in printform_field_dict) {
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
}


const printform_field_dict = {
    // "printform_id": ["field_ids"],
    "171": ["144", "219", "38", "220", "52"], //combined notice
    "169": ["223"], //denial of certification
    "173": ["91", "107", "214"], //followup letter
    "23": ["91", "107", "214"], //generic letter
    "167": ["221", "223", "224", "225", "226", "228", "232"], //mediation notice
    "170": ["144", "231", "72"], //nonc reminder
    "121": ["144", "160", "38"], //nonc resolution
    "120": ["144", "72", "38", "52"], //notice of nonc
    "165": ["221", "222", "38"], //prop susp - broken settlement
    "164": ["144", "221"], //prop susp - unresolved nonc
    "168": ["227"], //settlement agreement
    "166": ["223"], //suspension of certification
    "2": ["9", "72", "101", "94"], //IR MIN
    "81": ["9", "133", "72", "94"], //IR MIN Reminder
    "3": ["70", "101", "39", "94"], //IR Notification
    "4": ["40", "9", "39", "94"], //IR Resolution
    "": [""], //fees nonc Letter
    "": [""], //
};

//The following letter text must exist in this script because the HTML Pre/Post text spots in NewOrg have a character limit

const settlement_agreement_template = `
<p>
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
</p><br><br><p>
_______________________Date: _________
</p><p>
Shelby Wheeler, Compliance Manager
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
Within ten (10) days of receipt of this letter, please contact me, or Shelby Wheeler, MOSA Compliance Manager, (608) 296-9287, to set up a time for a mediation session by phone.
</p><p>
A settlement agreement, signed both parties, will conclude the proposed suspension and enable continued certification. The NOP provides 30 days to reach a settlement agreement following mediation. If mediation fails, you have the option to submit an appeal to the NOP.
</p><p>
We look forward to working with you for a positive outcome.
</p><p>
If you have any questions or concerns, please contact us right away.
</p>
`;

const mediation_rejected_template = `
<p>
We have considered your request for mediation, in response to the Notice of Proposed Suspension (or Revocation) dated OpenText221. We have decided to reject mediation. We have rejected mediation because OpenText228
</p><p>
If you so choose, you may file an appeal pursuant to §205.681. Your appeal must be filed within 30 days of your receiving this written notification of Rejection of Mediation. The appeal should be submitted in writing to: Administrator, USDA, AMS, c/o NOP Appeals Team, 1400 Independence Ave SW., Room 2648-So., Stop 0268, Washington, D.C. 20250-0268. Alternatively, you can submit your appeal via email to <a href="mailto:NOPAppeals@usda.gov">NOPAppeals@usda.gov</a>.
</p><p>
If you do not file an appeal within the time frame indicated above, your operation's certificate as a producer under the National Organic Program will be suspended as of OpenText223. You will be unable to sell or label your products as organic. If you have questions regarding this letter, please contact the MOSA office.
</p>
`;
