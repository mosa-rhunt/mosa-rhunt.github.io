/*
Code to calculate Inspection + Client fees
and to manipulate form elements when Inspector Type
is changed from Contractor to Staff
*/


$(document).ready(function() {
    //label setup
    let nums = ["176", "177", "179", "180"];
    for (let num of nums) {
        $("#OpenText" + num).find("span").prop("id", "Label" + num).css("color", "white").remove("font");
    }
    $("#tdFees > label > span").prop("id", "Label116").css("color", "white").remove("font");
    $("#FOpenText213").on("change", updateLabels); //inspection type dropdown

    //Legacy fields (Food, Rental car, Air fare) disabled
    $("#FOpenText32").attr("readonly", "readonly").css("background-color", "#bbb");
    $("#FOpenText211").attr("readonly", "readonly").css("background-color", "#bbb");
    $("#FOpenText212").attr("readonly", "readonly").css("background-color", "#bbb");

    //if it was obviously a staff inspector before, check that radio
    if ($("#FOpenText95 option:selected").val() !== "" || $("#FOpenText189 option:selected").val() !== "") {
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


function fee(id) {
    return parseFloat($("#FOpenText" + id).val()) || 0;
}


function calculate_inspection_fees() {
    let inspectionDate = new Date($("#FOpenText78").val()), jul1 = new Date("07/01/2022");
    // let mileageRate = inspectionDate > jul1 ? 0.625 : 0.585;
    let mileageRate = 0.655; //2023

    let baseFee = fee("116"),
        additionalOnSiteTotal = fee("176"),
        additionalOffSiteTotal = fee("177"),
        miles = fee("27"),
        mileageCost = miles * mileageRate,
        driveTimeHours = fee("209"),
        driveTimeRate = fee("210"),
        residueTestTotal = fee("158"),
        expeditedServiceFee = fee("159"),
        // food = fee("32"),
        // rentalCar = fee("211"),
        // airFare = fee("212"),
        lodging = fee("12"),
        otherFeesTotal = fee("178"),
        //staff inspector fields
        // personalComputer = ($("#FOpenText173 option:selected").val() == "Yes" ? 10 : 0),
        // usedMosaCC = $("#FOpenText6 option:selected").val(),
        usedMosaCar = $("#FOpenText95 option:selected").val(),
        personalPhone = ($("#FOpenText189 option:selected").val() == "Yes" ? 5 : 0),
        inspectorType = $("input:radio[name='inspector_type']:checked").val(),
        //totals/summaries
        inspectorFee = 0,
        clientFee = 0,
        inspFeeSummary = "",
        clientFeeSummary = ""; //unused now...
    
    //calculate inspector fee, and build summary strings
    inspFeeSummary = "Inspector Fees<br/>";
    if (inspectorType === "staff") {
        if (usedMosaCar === "Personal car") {
            inspectorFee += mileageCost;
            inspFeeSummary += "Mileage @ " + mileageRate + " for " + miles + " miles: $" + mileageCost + "<br/>";
        }
        // if (personalComputer > 0) {
        //     let computerFee = 10;
        //     inspFeeSummary += "Personal computer use: $" + personalComputer + "<br/>";
        // }
        if (personalPhone > 0) {
            inspectorFee += personalPhone;
            inspFeeSummary += "Personal phone use: $" + personalPhone + "<br/>";
        }
        // if (otherFeesTotal > 0) {
        //     inspectorFee += otherFeesTotal;
        //     inspFeeSummary += "Other fees: $" + otherFeesTotal + "<br/>";
        // }
        if (lodging > 0) {
            inspectorFee += lodging;
            inspFeeSummary += "Lodging: $" + lodging + "<br/>";
        }
        // if (usedMosaCC === "No") {
        //     if (food > 0) {
        //         inspectorFee += food;
        //         inspFeeSummary += "Food: $" + food + "<br/>";
        //     }
        //     if (rentalCar > 0) {
        //         inspectorFee += rentalCar;
        //         inspFeeSummary += "Rental car: $" + rentalCar + "<br/>";
        //     }
        //     if (residueTestTotal > 0) {
        //         inspectorFee += residueTestTotal;
        //         inspFeeSummary += "Residue test & postage: $" + residueTestTotal + "<br/>";
        //     }
        //     if (airFare > 0) {
        //         inspectorFee += airFare;
        //         inspFeeSummary += "Air fare: $" + airFare + "<br/>";
        //     }
        // } //end personal cc
    }
    else { //contract inspector
        if (baseFee > 0) {
            inspectorFee += baseFee;
            inspFeeSummary += "Base inspection fee: $" + baseFee + "<br/>";
        }
        if (additionalOnSiteTotal > 0) {
            inspectorFee += additionalOnSiteTotal;
            inspFeeSummary += "Additional on-site time: $" + additionalOnSiteTotal + "<br/>";
        }
        if (additionalOffSiteTotal > 0) {
            inspectorFee += additionalOffSiteTotal;
            inspFeeSummary += "Additional off-site time: $" + additionalOffSiteTotal + "<br/>";
        }
        if (driveTimeHours > 0) {
            let driveTotal = driveTimeHours * driveTimeRate;
            inspectorFee += driveTotal;
            inspFeeSummary += "Driving " + driveTimeHours + " hours @ " + driveTimeRate + ": $" + driveTotal + "<br/>";
        }
        if (lodging > 0) {
            inspectorFee += lodging;
            inspFeeSummary += "Lodging: $" + lodging + "<br/>";
        }
        // if (food > 0) {
        //     inspectorFee += food;
        //     inspFeeSummary += "Food: $" + food + "<br/>";
        // }
        // if (rentalCar > 0) {
        //     inspectorFee += rentalCar;
        //     inspFeeSummary += "Rental car: $" + rentalCar + "<br/>";
        // }
        // if (airFare > 0) {
        //     inspectorFee += airFare;
        //     inspFeeSummary += "Air fare: $" + airFare + "<br/>";
        // }
        if (residueTestTotal > 0) {
            inspectorFee += residueTestTotal;
            inspFeeSummary += "Residue test & postage: $" + residueTestTotal + "<br/>";
        }
        if (expeditedServiceFee > 0) {
            inspectorFee += expeditedServiceFee;
            inspFeeSummary += "Expedited service fee: $" + expeditedServiceFee + "<br/>";
        }
        if (otherFeesTotal > 0) {
            inspectorFee += otherFeesTotal;
            inspFeeSummary += "Other fees: $" + otherFeesTotal + "<br/>";
        }
    } //end contract inspector
    inspFeeSummary += "-------<br/>";
    inspFeeSummary += "Inspector total: $" + parseFloat(inspectorFee).toFixed(2);
    
    //finalize client fee
    let clientType = $("#OpenText44").html().toString();
    let inspectionDeposit = (clientType.includes("Handler") ? 400 : 300);
    if (inspectorType === "staff") {
        let subtotal = inspectorFee + baseFee + additionalOnSiteTotal + additionalOffSiteTotal + otherFeesTotal - personalPhone; //- personalComputer
        clientFee = subtotal * 1.07;
    }
    else { //contracted
        let subtotal = inspectorFee - residueTestTotal - expeditedServiceFee;
        clientFee = subtotal * 1.07;
    }
    if ($("#id_type option:selected").val() === "Inspection") clientFee -= inspectionDeposit; //won't happen for Inspection - Additional
    
    //round to 2 decimal points
    clientFee = parseFloat(clientFee).toFixed(2);

    $("#FOpenText80").val(inspectorFee);
    $("#FOpenText81").val(clientFee);
    $("#feeCalc").html(inspFeeSummary); // + "<br/><br/>" + clientFeeSummary);
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
    if (inspectorType === "staff") {
        for (let id of driveHoursAndRate.concat(residueAndExpedited)) {
            $("#FOpenText" + id).attr("readonly", "readonly").css("background-color", "#bbb");
        }
    }
    else {
        for (let id of staffDropdowns) {
            $("#FOpenText" + id).css("background-color", "#bbb");
            $("#FOpenText" + id + " option:not(:selected)").prop("disabled", true);
        }
    }

    //disable transportation related fields for virtual inspections
    if (inspectionType.endsWith("Virtual-Only") || inspectionType.endsWith("Desk Audit")) {
        for (let id of onSiteFields.concat(driveHoursAndRate)) {
            $("#FOpenText" + id).attr("readonly", "readonly").css("background-color", "#bbb");
        }
        //mosa or personal car? 
        $("#FOpenText95").css("background-color", "#bbb");
        $("#FOpenText95 option:not(:selected)").prop("disabled", true);
    }
}
