/*
Code to calculate Inspection + Client fees
and to manipulate form elements when Inspector Type
is changed from Contractor to Staff
*/

const grey = "#777!important";
$(document).ready(function() {
    //label setup
    let nums = ["176", "177", "179", "180"];
    for (let num of nums) {
        $("#OpenText" + num).find("span").prop("id", "Label" + num).remove("font");
    }
    $("#tdFees > label > span").prop("id", "Label116").remove("font");
    $("#FOpenText213").on("change", updateLabels); //inspection type dropdown

    //Legacy fields (Food, Rental car, Air fare) disabled
    $("#FOpenText32").attr("readonly", "readonly").css("background-color", grey);
    $("#FOpenText211").attr("readonly", "readonly").css("background-color", grey);
    $("#FOpenText212").attr("readonly", "readonly").css("background-color", grey);

    //if it was obviously a staff inspector before, check that radio
    if ($("#FOpenText95 option:selected").val() != "" || $("#FOpenText189 option:selected").val() != "") {
        $("input:radio[value='staff']").prop("checked", true);
    }

    $("input:radio[name=inspector_type]").on("change", disableFormInputs);
    updateLabels();

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

    $("label[for='Date']").text("Event Date (Office Use Only):");
    $("label[for='Start']").text("Inspection Start Time:");
    $("label[for='End']").text("Inspection End Time:"); 
});


function calculate_inspection_fees() {
    function fee(id) {
        return parseFloat($("#FOpenText" + id).val()) || 0;
    }

    let inspectionDate = new Date($("#FOpenText78").val()); //, jul1 = new Date("07/01/2022");
    //let mileageRate = inspectionDate > jul1 ? 0.625 : 0.585;

    let baseFee = fee("116"),
        additionalOnSiteTotal = fee("176"),
        additionalOffSiteTotal = fee("177"),
        residueTestTotal = fee("158"),
        expeditedServiceFee = fee("159"),
        lodging = fee("12"),
        otherFeesTotal = fee("178"),
        
        miles = fee("27"),
        mileageRate = (inspectionDate.getFullYear() == 2023 ? 0.655 : 0.625),
        mileageTotal = miles * mileageRate,
        
        driveTimeHours = fee("209"),
        driveTimeRate = fee("210"),
        driveTotal = driveTimeHours * driveTimeRate,

        //staff inspector fields
        // personalComputer = ($("#FOpenText173 option:selected").val() == "Yes" ? 10 : 0),
        // usedMosaCC = $("#FOpenText6 option:selected").val(),
        usedMosaCar = $("#FOpenText95 option:selected").val(),
        personalPhone = ($("#FOpenText189 option:selected").val() == "Yes" ? 5 : 0),
        inspectorType = $("input:radio[name='inspector_type']:checked").val(),

        //totals/summaries
        inspectorFee = 0,
        clientFee = 0,
        inspectorFeeItemized = ["<b>Inspector Fees:</b>"],
        clientFeeItemized = ["<b>Inspector Fees:</b>"];

    function addInspectorFee(name, amount) {
        if (amount == 0) return;
        inspectorFee += amount;
        inspectorFeeItemized.push(`${name}: $${amount}`);
    }
    function addClientFee(name, amount) {
        if (amount == 0) return;
        clientFee += amount;
        clientFeeItemized.push(`${name}: $${amount}`);
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
    }
    else { //contract inspector
        addInspectorFee("Base inspection fee", baseFee);
        addInspectorFee("Additional on-site time", additionalOnSiteTotal);
        addInspectorFee("Additional off-site time", additionalOffSiteTotal);
        addInspectorFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addInspectorFee("Lodging", lodging);
        addInspectorFee("Residue test & postage", residueTestTotal);
        addInspectorFee("Expedited service fee", expeditedServiceFee);
        addInspectorFee("Other fees", otherFeesTotal);

        addClientFee("Base inspection fee", baseFee);
        addClientFee("Additional on-site time", additionalOnSiteTotal);
        addClientFee("Additional off-site time", additionalOffSiteTotal);
        addClientFee(`Driving @ $${driveTimeRate} for ${driveTimeHours} hours`, driveTotal);
        addClientFee("Lodging", lodging);
        // addClientFee("Residue test & postage", residueTestTotal);
        // addClientFee("Expedited service fee", expeditedServiceFee);
        addClientFee("Other fees", otherFeesTotal);
    } 

    //finalize inspector fees
    inspectorFee = parseFloat(inspectorFee).toFixed(2);
    inspectorFeeItemized.push("========");
    inspectorFeeItemized.push(`Inspector total: $${inspectorFee}`);
    $("#FOpenText80").val(inspectorFee);
    
    //finalize client fees, beginning with inspection depsosit (only for annual inspection, not for additionals)
    if ($("#id_type option:selected").val() == "Inspection") {
        let clientType = $("#OpenText44").html().toString();
        let inspectionDeposit = (clientType.includes("Handler") ? -400 : -300);
        addClientFee("- Inspection Deposit", inspectionDeposit);
    }
    //7% admin fee
    let adminFee = parseFloat(clientFee * 0.07).toFixed(2);
    addClientFee("Admin 7% fee", adminFee);
    //total
    clientFee = parseFloat(clientFee).toFixed(2);
    clientFeeItemized.push("========");
    clientFeeItemized.push(`Client total: $${clientFee}`);
    $("#FOpenText81").val(clientFee);
    
    //display summary lines
    $("#feeCalc").html(inspectorFeeItemized.join("<br/>") + "<br/><br/>" + clientFeeItemized.join("<br/>"));
}


function updateLabels() {
    let inspectionType = $("#FOpenText213 option:selected").val();
    if (inspectionType.endsWith("Onsite/Traditional Inspection")) {
        $("#Label116").html("Base Contract Fee for Traditional Inspection");
        $("#Label176").html("Total Cost of Additional Time On-site for Traditional Inspection");
        $("#Label179").html("Description: REQUIRED Itemized Additional Time On-Site for Traditional Inspection");
        $("#Label177").html("Total Cost of Additional Paperwork Off-site for Traditional Inspection");
        $("#Label180").html("Description: REQUIRED Itemized Additional Paperwork Off-Site for Traditional Inspection");
    }
    else if (inspectionType.endsWith("Hybrid Inspection")) {
        $("#Label116").html("Base Contract Fee for Hybrid Inspection");
        $("#Label176").html("Total Cost of Additional Time On-site for Hybrid Inspection");
        $("#Label179").html("Description: REQUIRED Itemized Additional Time On-Site for Hybrid Inspection");
        $("#Label177").html("Total Cost of Additional Paperwork Off-site for Hybrid Inspection");
        $("#Label180").html("Description: REQUIRED Itemized Additional Paperwork Off-Site for Hybrid Inspection");
    }
    else if (inspectionType.endsWith("Virtual-Only")) {
        $("#Label116").html("Base Contract Fee");
        $("#Label176").html("Total Cost of Additional Time On-site");
        $("#Label179").html("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").html("Total Cost of Virtual Only Inspection");
        $("#Label180").html("Description: REQUIRED Itemized # of hours at contracted hourly rate for Virtual Only Inspection");
    }
    else if (inspectionType.endsWith("Desk Audit")) {
        $("#Label116").html("Base Contract Fee");
        $("#Label176").html("Total Cost of Additional Time On-site");
        $("#Label179").html("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").html("Total Cost of Desk Audit Inspection");
        $("#Label180").html("Description: REQUIRED Itemized # of hours at contracted hourly rate for Desk Audit Inspection");
    }
    else { //Additional inspection where the dropdown doesn't even exist
        $("#Label116").html("Base Contract Fee");
        $("#Label176").html("Total Cost of Additional Time On-site");
        $("#Label179").html("Description: REQUIRED Itemized Additional Time On-Site");
        $("#Label177").html("Total Cost of Additional Paperwork Off-site");
        $("#Label180").html("Description: REQUIRED Itemized Additional Paperwork Off-Site");
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
    // let contractorFees = ["116", "176", "179", "177", "180"]; //includes a few dupes from onSiteFields but w/e

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
            $("#FOpenText" + id).css("background-color", grey);
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
