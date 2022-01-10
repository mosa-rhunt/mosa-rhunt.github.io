let pay_data = {};

function on_form_change() {
    let fields = ["income", "pay_amount", "pay_date", "pay_method", "pay_frequency", "check_num"];
    //enable or disable the form
    if ($("#pay_created").prop("checked")) {
        for (let field of fields) {
            $("#" + field).prop("readonly", true).css("background-color", "#bbb").find("option:not(:selected)").prop("disabled", true);
        }
        $("#create_donation").hide();
    }
    else {
        for (let field of fields) {
            $("#" + field).removeProp("readonly").css("background-color", "").find("option:not(:selected)").removeProp("disabled");
        }
        $("#create_donation").removeProp("disabled").css("background-color", "").show();
    }

    //populate json based on form inputs
    pay_data["pay_created"] = $("#pay_created").is(":checked");
    pay_data["record_link"] = $("#record_link").prop("href");
    for (let field of fields) {
        pay_data[field] = $("#" + field).val();
    }
    $("#FOpenText187").val(JSON.stringify(pay_data));
}

jQuery(document).ready(function() {
    let custom_field = $("#FOpenText187"); //text which gets replaced by hidden
    let field_name = $(custom_field).prop("name");
    let hidden = $(`<input type='hidden' id='FOpenText187' name='${field_name}' value='{}' />`);
    let chk_pay_created = $("<input type='checkbox' id='pay_created' />").on("change", on_form_change);
    let txt_income = $("<input type='text' id='income' class='form-control' />").on("change", on_form_change).on("keypress", on_form_change);
    let txt_pay_amount = $("<input type='text' id='pay_amount' class='form-control' />").on("change", on_form_change).on("keypress", on_form_change);
    let txt_pay_date = $("<input type='text' id='pay_date' class='form-control datepicker' data-toggle='datepicker' onblur='checkDate(this)' />").on("change", on_form_change).on("keypress", on_form_change);
    let txt_check_num = $("<input type='text' id='check_num' class='form-control' />").on("change", on_form_change).on("keypress", on_form_change);
    let sel_pay_methods = $("<select id='pay_method' class='form-control'></select>").on("change", on_form_change);
    let sel_pay_frequency = $("<select id='pay_frequency' class='form-control'></select>").on("change", on_form_change);
    let lnk_url = $("<a id='record_link' target='_blank' style='font-weight:bold'></a>");
    
    let methods = ["", "AMEX", "DISCOVER", "MASTERCARD", "VISA", "Cash", "Check", "Milk Check", "Invoice Me", "Other"];
    //also "Credit Card Offline", "Credit Memo", "Invoice Me", "Pay by Credit Card over Phone", "Pledge", "Pledge - Write Off"
    for (let method of methods) {
        $(sel_pay_methods).append(`<option value='${method}'>${method}</option>`);
    }

    let frequencies = ["", "Annual", "Quarterly", "Milk Check"];
    for (let freq of frequencies) {
        $(sel_pay_frequency).append(`<option value='${freq}'>${freq}</option>`);
    }

    let btn_save = $("<input type='button' id='create_donation' value='Create Payment' />").on("click", function() {
        on_form_change(); //get latest data
        if (!pay_data["pay_amount"] 
        || !pay_data["pay_date"]
        || !pay_data["pay_method"]
        || !pay_data["pay_frequency"]
        || !pay_data["income"]) {
            alert("Please fill out all payment fields");
            return;
        }

        let client_id = $("#h_customerex").val();
        let donation_data = {
            "CustomerNum": client_id,
            "EventCustDonationNum": "",
            "DonationNum_h": "33", //always 33?
            "Action": "Save",
            "@create@comp.Donations_Create": "Save",
            "@field.CustomerAllNum": client_id,
            "@field.CustomerSubNum": "",

            "@field.CreateDate@comp.Donations_Create": pay_data["pay_date"],
            "@field.Type@comp.Donations_Create": pay_data["pay_method"],
            "@field.Amount@comp.Donations_Create": pay_data["pay_amount"],
            "@field.Description@comp.Donations_Create": "",
            "@field.Source@comp.Donations_Create": "Certification Fee Mail",
            "@field.Recipient@comp.Donations_Create": "General Account",
            "@field.Class@comp.Donations_Create": "1", //1=Certification Payments, 2=General Payment
            "@field.Status@comp.Donations_Create": "Active", //or Void
            "@field.CheckNumber@comp.Donations_Create": pay_data["check_num"],
            "@field.CardExpiration@comp.Donations_Create": "", //card expiration
            "@field.CardId@comp.Donations_Create": "", //cc security code
            "@field.DonationNumPledge@comp.Donations_Create": "", //link to pledge
            
            "@field.OpenText1": "", //Income Range
            "@field.OpenText2": pay_data["pay_frequency"],
            "@field.OpenText3": "", //Invoice Numbers
            "@field.OpenText4": "", //Allow Recurring
            "@field.OpenText5": "", //?
            // "@field.OpenText6": "", //unused
            "@field.OpenText7": pay_data["income"], 
            "@field.OpenText8": "", //Producer Type
            "@field.OpenText9": "", //Invoice Event?
            "@field.OpenText10": "" + (new Date().getFullYear()),

            "@field.HonorCustomerAllNum": "",
            "@field.HonorName": "",
            "@field.HonorEmail": "",
            "@field.HonorAddress": "",
            "@field.HonorMessage": "",
            "@field.TributeName": "",
            "@field.HonorType": "", 
        };
        $("#create_donation").prop("disabled", true).css("background-color", "#bbb");

        $.ajax({
            url: "DonationUpdate.asp",
            type: "POST",
            data: donation_data,
            success: function(response) {
                //response is the html/page as a string, and for some reason contains its own url in the js somewhere
                let url_match = response.match(/location='(?<url>.*Donationnum=\d+&.*)';/);
                if (url_match.groups?.url) {
                    $("#record_link").prop("href", url_match.groups.url).text("Donation Record");
                }
                else { //fallback
                    let url = "CustomerUpdate.asp?Page=Donations&Action=View&CustomerNum=" + $("#h_customerex").val();
                    $("#record_link").prop("href", url).text("Donation List");
                }

                $("#pay_created").prop("checked", true);
                on_form_change();
            },
            error: function(response) {
                console.log(response);
                alert("Error creating donation? Tell Ryan...");
                $("#create_donation").removeProp("disabled");
            }
        }); 
    });

    //read and populate existing data
    let json_data = $(custom_field).val();
    try {
        pay_data = JSON.parse(json_data);
    }
    catch (e) {
        pay_data = {"pay_created": false};
    }

    $(txt_income).val(pay_data["income"] || "");
    $(txt_pay_amount).val(pay_data["pay_amount"] || "");
    $(txt_pay_date).val(pay_data["pay_date"] || "");
    $(sel_pay_methods).val(pay_data["pay_method"] || "");
    $(sel_pay_frequency).val(pay_data["pay_frequency"] || "");
    if (pay_data["pay_created"]) {
        $(chk_pay_created).prop("checked", true);
    }
    if (pay_data["record_link"]) {
        let text = "Donation List";
        if (pay_data["record_link"].includes("DonationUpdate")) text = "Donation Record";
        $(lnk_url).prop("href", pay_data["record_link"]).text(text);
    }

    //now we add the UI
    function label(txt) { return $(`<label style='color:white'>${txt}</label>`); }
    function td(lbl, el) { return $("<td></td>").append(label(lbl)).append("<br>").append(el); }
    
    let row1 = $("<tr></tr>")
    .append(td("Payment Amount", txt_pay_amount))
    .append(td("Payment Date", txt_pay_date))
    .append(td("Annual Income", txt_income));
    let row2 = $("<tr></tr>")
    .append(td("Payment Frequency", sel_pay_frequency))
    .append(td("Payment Method", sel_pay_methods))
    .append(td("Check Number", txt_check_num));
    let table = $("<table></table>").append(row1).append(row2);
    
    let the_div = $("<div></div>")
    .append("<hr>")
    .append(label("AU Payment Form"))
    .append(hidden)
    .append("<br>")
    .append(table)
    .append(btn_save)
    .append("<br>")
    .append("<br>")
    .append(lnk_url)
    .append("<br>")
    .append(label("Payment Created&nbsp;"))
    .append(chk_pay_created)
    .append("<br><br>");

    $(custom_field).parent("label").empty().parent().append(the_div);
    $(txt_pay_date).datepicker({format:"mm/dd/yyyy", autoHide:true, assumeNearbyYear:20});
    on_form_change();
});
