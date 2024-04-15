/*
Code to calculate Inspection + Client fees
and to manipulate form elements when Inspector Type
is changed from Contractor to Staff
*/

const grey = "#777";
const isAdditionalInspection = ($("#id_type").val() == "Inspection - Additional");
$(document).ready(function() {
    //label setup. add ids to labels for ease of changing their text later
    for (let num of ["176", "177", "179", "180", "159", "132"]) {
        $("#OpenText" + num + " span").prop("id", "Label" + num).empty();
    }
    $("#Label159").text((isAdditionalInspection ? "Rush Fee for Additional Inspections" : "Expedited Fee for ANNUAL Inspection"));
    $("#Label132").text("Description of Misc. fee with name of person who approved it"); //TODO move to NewOrg directly

    //this one is different because it's the beginning of the inserted table to change the layout
    $("#tdFees > label > span").prop("id", "Label116").empty();
    //inspection type dropdown
    $("#FOpenText213").on("change", updateLabels); 

    //if it was obviously a staff inspector before, check that radio
    if ($("#FOpenText95 option:selected").val() || $("#FOpenText189 option:selected").val()) {
        $("input:radio[value='staff']").prop("checked", true);
    }

    $("input:radio[name=inspector_type]").on("change", disableFormInputs);
    updateLabels();

    //hide any specialties that are not checked
    for (const num of ["54", "58", "56", "55", "59", "60", "62", "63", "53", "61", "217", "142", "181", "182", "216", "188"]) {
        if (!$("#FOpenText" + num).is(":checked")) $("#OpenText" + num).hide();
    }

    //REARRANGE
    const fieldRearrange = {
        // "field": "fieldToBeInsertedBefore" 
        "26": "77", //comm method : file sent to inspector
        "140": "77", //this year insp : file sent to inspector
        "37": "54", //Custom Fields : farm
        "91": "54", //generic text : farm
        "84": "28", //notes to insp : fees for this client...
        "16": "213", //notes to fr : insp type
        "": "", 
    };
    for (const [field, anchor] of Object.entries(fieldRearrange)) {
        $("#OpenText" + field).insertBefore("#OpenText" + anchor);
    }

    //Rearrange boxes event date boxes so it's more intuitive
    let rows = $("table.fillerin div.row");
    let divs = $(rows[3]).children("div");
    let container = $("<div class='row'></div>").insertAfter("#OpenText78");

    //move Event Start/End time
    for (let i = 1; i < 4; i++) {
        $(divs[i]).appendTo(container);
    }
    $(divs[4]).hide(); //minutes box
    $(divs[0]).removeClass("col-lg-2").removeClass("col-md-2").addClass("col-lg-3").addClass("col-md-3");

    //move event status just before Scheduled Date
    $("select[name*='field.Status']").closest("div.col-6").insertAfter($("#OpenText87 label").eq(0));

    // $("label[for='Date']").text("Event Date (Office Use Only):");
    $("label[for='Start']").text("Inspection Start Time:");
    $("label[for='End']").text("Inspection End Time:"); 
    $("#event").closest(".row").prepend("<label style='margin-left:15px; color:#333; font-size: 16px'>OFFICE USE ONLY</label>");

});


function calculate_inspection_fees() {
    const field = (id) => parseFloat($("#FOpenText" + id).val()) || 0;

    let inspectionDate = new Date($("#FOpenText78").val());

    let inspectionDeposit = 0,
        baseFee = field("116"),
        additionalOnSiteTotal = field("176"),
        additionalOffSiteTotal = field("177"),
        residueTestTotal = field("158"),
        expeditedServiceFee = field("159"),
        lodging = field("12"),
        otherFeesTotal = field("178"),

        miles = field("27"),
        mileageRate = (inspectionDate.getFullYear() == 2023 ? 0.655 : 0.67),
        mileageTotal = miles * mileageRate,
        driveTimeHours = field("209"),
        driveTimeRate = field("210"),
        driveTotal = driveTimeHours * driveTimeRate,

        //staff inspector fields
        usedMosaCar = $("#FOpenText95 option:selected").val(),
        personalPhone = ($("#FOpenText189 option:selected").val() == "Yes" ? 5 : 0),
        inspectorType = $("input:radio[name='inspector_type']:checked").val(),

        //totals/summaries
        inspectorFee = 0,
        clientFee = 0,
        inspectorFeeItemized = ["<b>Inspector Fees:</b>"],
        clientFeeItemized = ["<b>Client Fees:</b>"];

    //inspection depsosit (only for annual inspection, not for additionals)
    if ($("#id_type option:selected").val() == "Inspection") {
        let clientType = $("#OpenText44").html().toString();
        inspectionDeposit = (clientType.includes("Handler") ? -400 : -300);
    }

    function addInspectorFee(name, amount) {
        if (amount == 0) return;
        amount = Math.round(amount * 100) / 100;
        inspectorFee += amount;
        inspectorFeeItemized.push(`${name}: <span style="display:inline-block;width:60px;">$${amount}</span>`);
    }
    function addClientFee(name, amount) {
        if (amount == 0) return;
        amount = Math.round(amount * 100) / 100;
        clientFee += amount;
        clientFeeItemized.push(`${name}: <span style="display:inline-block;width:60px;">$${amount}</span>`);
    }
    
    //add up fees
    if (inspectorType == "staff") {
        if (usedMosaCar == "Personal car") addInspectorFee(`Mileage @ $${mileageRate} for ${miles} miles`, mileageTotal);
        addInspectorFee("Lodging", lodging);
        addInspectorFee("Personal phone use", personalPhone);

        addClientFee("Base inspection fee", baseFee);
        addClientFee("Additional on-site time", additionalOnSiteTotal);
        addClientFee("Additional off-site time", additionalOffSiteTotal);
        addClientFee(`Mileage @ $${mileageRate} for ${miles} miles`, mileageTotal);
        addClientFee("Lodging", lodging);
        addClientFee("Other fees", otherFeesTotal);
        // addClientFee("Admin 7% fee", clientFee * 0.07);
        addClientFee("- Inspection Deposit", inspectionDeposit);
    }
    else { //contract inspector
        addInspectorFee("Base inspection fee", baseFee);
        addInspectorFee("Additional on-site time", additionalOnSiteTotal);
        addInspectorFee("Additional off-site time", additionalOffSiteTotal);
        addInspectorFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addInspectorFee("Lodging", lodging);
        addInspectorFee("Residue test & postage", residueTestTotal);
        addInspectorFee((isAdditionalInspection ? "Rush fee" : "Expedited service fee"), expeditedServiceFee);
        addInspectorFee("Other fees", otherFeesTotal);

        addClientFee("Base inspection fee", baseFee);
        addClientFee("Additional on-site time", additionalOnSiteTotal);
        addClientFee("Additional off-site time", additionalOffSiteTotal);
        addClientFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addClientFee("Lodging", lodging);
        // addClientFee("Residue test & postage", residueTestTotal);
        if (isAdditionalInspection) addClientFee("Rush fee", expeditedServiceFee);
        addClientFee("Other fees", otherFeesTotal);
        // addClientFee("Admin 7% fee", clientFee * 0.07);
        addClientFee("- Inspection Deposit", inspectionDeposit);
    } 

    //finalize inspector fees
    inspectorFee = parseFloat(inspectorFee).toFixed(2);
    inspectorFeeItemized.push("========");
    inspectorFeeItemized.push(`Inspector total: $${inspectorFee}`);
    $("#FOpenText80").val(inspectorFee);
    
    //finalize client fees
    clientFee = parseFloat(clientFee).toFixed(2);
    clientFeeItemized.push("========");
    clientFeeItemized.push(`Client total: $${clientFee}`);
    $("#FOpenText81").val(clientFee);
    
    //display summary lines
    $("#feeCalc").html(inspectorFeeItemized.join("<br>") + "<br><br>" + clientFeeItemized.join("<br>"));
}


function updateLabels() {
    let inspectionType = $("#FOpenText213 option:selected").val();
    if (inspectionType.endsWith("Onsite/Traditional Inspection")) {
        $("#Label116").text("Base Contract Fee for Traditional Inspection");
        $("#Label176").text("Total Cost of Additional Time On-site for Traditional Inspection");
        $("#Label179").text("Description: REQUIRED Itemized Additional Time On-Site for Traditional Inspection");
        $("#Label177").text("Total Cost of Additional Paperwork Off-site for Traditional Inspection");
        $("#Label180").text("Description: REQUIRED Itemized Additional Paperwork Off-Site for Traditional Inspection");
    }
    else if (inspectionType.endsWith("Hybrid Inspection")) {
        $("#Label116").text("Base Contract Fee for Hybrid Inspection");
        $("#Label176").text("Total Cost of Additional Time On-site for Hybrid Inspection");
        $("#Label179").text("Description: REQUIRED Itemized Additional Time On-Site for Hybrid Inspection");
        $("#Label177").text("Total Cost of Additional Paperwork Off-site for Hybrid Inspection");
        $("#Label180").text("Description: REQUIRED Itemized Additional Paperwork Off-Site for Hybrid Inspection");
    }
    else if (inspectionType.endsWith("Virtual-Only")) {
        $("#Label116").text("Base Contract Fee");
        $("#Label176").text("Total Cost of Additional Time On-site");
        $("#Label179").text("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").text("Total Cost of Virtual Only Inspection");
        $("#Label180").text("Description: REQUIRED Itemized # of hours at contracted hourly rate for Virtual Only Inspection");
    }
    else if (inspectionType.endsWith("Desk Audit")) {
        $("#Label116").text("Base Contract Fee");
        $("#Label176").text("Total Cost of Additional Time On-site");
        $("#Label179").text("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").text("Total Cost of Desk Audit Inspection");
        $("#Label180").text("Description: REQUIRED Itemized # of hours at contracted hourly rate for Desk Audit Inspection");
    }
    else { //Additional inspection where the dropdown doesn't even exist
        $("#Label116").text("Base Contract Fee");
        $("#Label176").text("Total Cost of Additional Time On-site");
        $("#Label179").text("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").text("Total Cost of Additional Paperwork Off-site");
        $("#Label180").text("Description: REQUIRED Itemized Additional Paperwork Off-Site");
    }
    disableFormInputs(); //in case the transportation fields need to get disabled
}


function disableFormInputs() {
    let inspectorType = $("input:radio[name=inspector_type]:checked").val();
    let inspectionType = $("#FOpenText213 option:selected").val();
    let onSiteFields = ["116", "176", "179", "158", "159", "12", "27"];
    let driveHoursAndRate = ["209", "210"];
    let staffDropdowns = ["6", "189", "95"];
    let residueAndExpedited = ["158", "159"];

    //re-enable all inputs
    for (let id of onSiteFields.concat(driveHoursAndRate)) {
        $("#FOpenText" + id).attr("readonly", null).css("background-color", "#fff");
    }
    for (let id of staffDropdowns) {
        $("#FOpenText" + id).css("background-color", "#fff");
        $("#FOpenText" + id + " option:not(:selected)").prop("disabled", false);
    }

    //then we'll selectively disable inputs
    if (inspectorType == "staff") {
        for (let id of driveHoursAndRate.concat(residueAndExpedited)) {
            $("#FOpenText" + id).attr("readonly", "readonly").css("background-color", grey);
        }
    }
    else {
        for (let id of staffDropdowns) {
            $("#FOpenText" + id).css("background-color", grey + "!important");
            $("#FOpenText" + id + " option:not(:selected)").prop("disabled", true);
        }
    }

    //disable transportation related fields for virtual inspections
    if (inspectionType.endsWith("Virtual-Only") || inspectionType.endsWith("Desk Audit")) {
        for (let id of onSiteFields.concat(driveHoursAndRate)) {
            $("#FOpenText" + id).attr("readonly", "readonly").css("background-color", grey);
        }
        //mosa or personal car? 
        $("#FOpenText95").css("background-color", grey);
        $("#FOpenText95 option:not(:selected)").prop("disabled", true);
    }
}

/*

function testMockup() {
    const originalFieldOrder = [
        "78", //Actual Inspection Date
        "37", //Custom Fields
        "54", //Farm
        "58", //
        "56", //
        "55", //
        "59", //
        "60", //
        "62", //
        "63", //
        "61", //
        "53", //
        "217", //
        "142", //
        "181", //
        "182", //
        "216", //
        "188", //GF Meat Handling
        "169", //TNs
        "170", //When
        "87", //scheduled date

        "115", //2023 Residue
        "89", //2024 Residue
        "143", //Date sample taken
        "28", //fees pre-approved by
        "42", //fees split with
        "140", //This Year Inspector
        "26", //Comm method
        "93", //Postcard Sent
        "91", //Generic Text
        "77", //File Sent to inspector
        "84", //Notes to inspector
        "16", //Notes to FR
        "213", //Insp type
        "116", //base contract fee -- BEGIN TABLE
        "2", //Date paper file rec
        "44", //cust type
        "81", //total client fee
        "129", //note?
        "64", //billing approved by
        "146", //date billing approved
        "82", //insp rpt sent to client
        "83", //insp rpt sent by
    ];

    const fieldOrder = [
        "140", //This Year Inspector
        "26", //Comm method
        "77", //File Sent to inspector
        "91", //Generic Text
        "37", //Custom Fields
        "54", //Farm
        "58", //
        "56", //
        "55", //
        "59", //
        "60", //
        "62", //
        "63", //
        "61", //
        "53", //
        "217", //
        "142", //
        "181", //
        "182", //
        "216", //
        "188", //GF Meat Handling

        "87", //scheduled date
        "115", //2023 Residue
        "89", //2024 Residue
        "84", //Notes to inspector

        "28", //fees pre-approved by
        "42", //fees split with
        "78", //Actual Inspection Date
        "169", //TNs
        "170", //When
        "16", //Notes to FR
        "213", //Insp type
        "116", //base contract fee -- BEGIN TABLE

        // "143", //Date sample taken
        // "93", //Postcard Sent
        // "2", //Date paper file rec
        // "44", //cust type

        "81", //total client fee
        "129", //note?
        "64", //billing approved by
        "146", //date billing approved
        "82", //insp rpt sent to client
        "83", //insp rpt sent by
    ];

    
    //rearrange event time boxes so it's more helpful for inspectors
    let divs = $("table.fillerin div.row").eq(3).children("div");
    let container = $("<div class='row'></div>").insertAfter("#OpenText78"); //Actual Inspection Date

    //move Event Start/End time
    for (let i = 1; i < 4; i++) {
        $(divs[i]).appendTo(container);
    }
    //hide Reminder box
    $(divs[4]).hide(); 
    //widen Event Date field
    $(divs[0]).removeClass("col-lg-2").removeClass("col-md-2");

    



    //LABEL STUFF

    //setup labels for fee fields relating to inspection type
    for (let num of ["176", "177", "179", "180"]) {
        $("#OpenText" + num).find("span").prop("id", "Label" + num);
    }
    //this one is different because in the event field configurations a <table> is jammed in
    $("#tdFees > label > span").prop("id", "Label116");
    $("#FOpenText213").on("change", updateLabels).trigger("change"); //inspection type dropdown
    $("input:radio[name=inspector_type]").on("change", disableFormInputs); //staff v contractor radio

    //if it was obviously a staff inspector before (use personal cell phone, personal car?), check the staff radio
    if ($("#FOpenText95 option:selected").val() != "" || $("#FOpenText189 option:selected").val() != "") {
        $("input:radio[value='staff']").prop("checked", true);
    }

    
}

*/