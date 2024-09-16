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
    for (const num of ["54", "58", "56", "55", "59", "60", "62", "63", "53", "61", "217", "142", "181", "182", "216", "188", "242"]) {
        if (!$("#FOpenText" + num).is(":checked")) $("#OpenText" + num).hide();
    }

    //REARRANGE
    const fieldRearrange = [
        // [ "field", "fieldToBeInsertedBefore" ]
        [ "26", "77" ], //comm method : file sent to inspector
        [ "140", "77" ], //this year insp : file sent to inspector
        [ "37", "54" ], //Custom Fields : farm
        [ "91", "54" ], //generic text : farm
        [ "145", "28" ], //insp stock statements : fees for this client...
        [ "84", "28" ], //notes to insp : fees for this client...
        [ "136", "28" ], //notes to insp addl : fees for this client...
        [ "16", "213" ], //notes to fr : insp type
    ];
    for (const arr of fieldRearrange) {
        $("#OpenText" + arr[0]).insertBefore("#OpenText" + arr[1]);
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

    //prepopulate drive time hourly rate with $60
    if (!$("#FOpenText210").val()) $("#FOpenText210").val("60");
});


function calculate_inspection_fees() {
    const field = (id) => parseFloat($("#FOpenText" + id).val()) || 0;

    let inspectionDate = new Date($("#FOpenText78").val());

    let inspectionDeposit = 0,
        baseFee = field("116"),
        contractedHourlyFee = field("3"),
        totalHoursOverBase = field("8"),
        hourlyTotal = contractedHourlyFee * totalHoursOverBase,
        //additionalOnSiteTotal = field("176"),
        //additionalOffSiteTotal = field("177"),
        residueTestTotal = field("158"),
        expeditedServiceFee = field("159"),
        lodging = field("12"),
        otherFeesTotal = field("178"),
        miscFee = field("241"),
        incentiveFee = field("34"), 

        miles = field("27"),
        mileageRate = (inspectionDate.getFullYear() == 2024 ?  0.67 : 0.655),
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
        inspectionDeposit = (clientType.includes("Handler") ? -450 : -350);
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
        // addInspectorFee("Lodging", lodging);
        addInspectorFee("Personal phone use", personalPhone);

        addClientFee("Base inspection fee", baseFee);
        addClientFee(`Hourly fee @ $${contractedHourlyFee} for ${totalHoursOverBase} hours`, hourlyTotal);
        
        // addClientFee("Additional on-site time", additionalOnSiteTotal);
        // addClientFee("Additional off-site time", additionalOffSiteTotal);
        addClientFee(`Mileage @ $${mileageRate} for ${miles} miles`, mileageTotal);
        addClientFee("Lodging", lodging);
        addClientFee("Misc Fee", miscFee);
        addClientFee("Other fees", otherFeesTotal);
        // addClientFee("Admin 7% fee", clientFee * 0.07);
        addClientFee("- Inspection Deposit", inspectionDeposit);
    }
    else { //contract inspector
        addInspectorFee("Base inspection fee", baseFee);
        addInspectorFee(`Hourly fee @ $${contractedHourlyFee} for ${totalHoursOverBase} hours`, hourlyTotal);
        // addInspectorFee("Additional on-site time", additionalOnSiteTotal);
        // addInspectorFee("Additional off-site time", additionalOffSiteTotal);
        addInspectorFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addInspectorFee("Lodging", lodging);
        addInspectorFee("Residue test & postage", residueTestTotal);
        addInspectorFee((isAdditionalInspection ? "Rush fee" : "Expedited service fee"), expeditedServiceFee);
        addInspectorFee("Misc Fee", miscFee);
        addInspectorFee("Incentive Fee", incentiveFee);
        addInspectorFee("Other fees", otherFeesTotal);

        addClientFee("Base inspection fee", baseFee);
        addClientFee(`Hourly fee @ $${contractedHourlyFee} for ${totalHoursOverBase} hours`, hourlyTotal);
        // addClientFee("Additional on-site time", additionalOnSiteTotal);
        // addClientFee("Additional off-site time", additionalOffSiteTotal);
        addClientFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addClientFee("Lodging", lodging);
        // addClientFee("Residue test & postage", residueTestTotal);
        if (isAdditionalInspection) addClientFee("Rush fee", expeditedServiceFee);
        addClientFee("Misc Fee", miscFee);
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
    let residueExpeditedAndIncentive = ["158", "159", "34"];

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
        for (let id of driveHoursAndRate.concat(residueExpeditedAndIncentive)) {
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
