/*
Bulk event creation form. Used on ReportGeneral.asp?RptNum=462

Custom fields
  1 - 120: Events
121 - 250: EventsExtra
251 - 370: EventsExtra2
371 - 490: EventsExtra3
*/


const fields = {
    //prototype
    "fieldnum": {
        "name": "field name",
        "input": "text", //or date, number, checkbox, select. default is text
        "options": ["one", "two"], //values in the select

        // "contact_field": true, //only set/true for event fields that are also contact fields 
        //(but don't use event fields to update contact fields)
    },

    //Scopes/specialties
    "54": {"input":"checkbox", "name":"Farm"},
    "58": {"input":"checkbox", "name":"Livestock"},
    "56": {"input":"checkbox", "name":"Handler"},
    "55": {"input":"checkbox", "name":"Greenhouse"},
    "59": {"input":"checkbox", "name":"Maple Syrup"},
    "60": {"input":"checkbox", "name":"Mushroom"},
    "62": {"input":"checkbox", "name":"Sprout"},
    "63": {"input":"checkbox", "name":"Wild Crop"},
    "53": {"input":"checkbox", "name":"Apiculture"},
    "61": {"input":"checkbox", "name":"Retail"},
    "217": {"input":"checkbox", "name":"Livestock Sales Facility"},
    "142": {"input":"checkbox", "name":"Non-Processing Handler"},
    "181": {"input":"checkbox", "name":"Grass-Fed Dairy"},
    "182": {"input":"checkbox", "name":"Grass-Fed Meat"},
    "216": {"input":"checkbox", "name":"Grass-Fed Dairy Handling"},
    "188": {"input":"checkbox", "name":"Grass-Fed Meat Handling"},

    //Common fields
    "69": {"name":"Sent On", "input":"date"},
    "91": {"name":"Generic Text"},
    "94": {"name":"Enclosures"},
    "110": {"name":"cc: NOP Appeals Team", "input":"checkbox"},
    "111": {"name":"cc: NOP Appeals Team - (w/out enclosures)", "input":"checkbox"},
    "107": {"name":"Letter Date", "input":"date"},
    "72": {"name":"Due By", "input":"date"},
    "71": {"name":"Info Received Date", "input":"date"},
    // "": {"name":""},

    //New Client Outeach fields
    "150": {"name":"Client's overall satisfaction"}, 
    "215": {"name":"Client's Organic Certificate"}, 
    "153": {"name":"Re-certification application"}, 
    "156": {"name":"Any anticipated changes"}, 
    "127": {"name":"Communication with MOSA"},

    //AAD
    "75": {"name":"Application Status", "input":"select", "options":["Application Requested", "Application Received In Office", "Application Received Web", "Update application sent", "Initial Application Sent"]},
    "66": {"name":"Reason for Sending", "input":"select", "options":["Annual Update", "New Application", "Adding New OSP", "Significant Change to OSP"]},

    //Communications
    "214": {"name":"Subject Line"},
    
    //Adverse Action
    "112": {"name":"Adverse Action Status", "input":"select", "options":["", "Certification", "Fees", "Paperwork", "Paperwork and Fees", "Certification; Fees", "Certification; Paperwork", "Certification; Paperwork and Fees"]},
    "108": {"name":"Quarter", "input":"select", "options":["", "Q1", "Q2", "Q3", "Q4"]},
    "144": {"name":"Adverse Action Letter Date", "input":"date"},
    "38": {"name":"Noncompliances"},
    "35": {"name":"Adverse Action Type", "input":"select", "options":[
        "",
        "Noncompliance",
        "Noncompliance Resolution",
        "Noncompliance and Resolution",
        "Noncompliance/Proposed Suspension",
        "Proposed Revocation",
        "Proposed Suspension",
        "Suspension of Certification",
        "Settlement Agreement",
        "Revocation",
        "Noncompliance and Proposed Revocation",
        "Denial of Certification",
        "Rejection of Mediation",
        "Acceptance of Mediation",
        "Grass Fed Noncompliance"
    ]},

    //Timing Needs
    "124": {"name":"Timing Need start date", "input":"date"},
    "128": {"name":"Timing Need deadline", "input":"date"},
    "126": {"name":"Reason for Timing Need", "input":"select", "options":[
        "",
        "Client question",
        "Client request",
        "Compliance issue",
        "Final Review deadline",
        "Initial Review deadline",
        "Inspection deadline",
        "Inspection dept request",
        "Inspection: special circumstance",
        "New client",
        "New client - Expedited service",
        "New facilities",
        "New label",
        "New land",
        "New product",
        "New scope/ OSP",
        "Review: special circumstance",
        "Seasonal client need",
        "Staff request",
        "Third party deadline",
    ]},

    //GrassFed Certification
    "202": {"name":"Grass-Fed Certificate Expiration Date", "input":"date"},
    
    // "": {"name":""},
};


const event_types = {
    //"event type name": [array of field ids from above],
    //scopes "54", "58", "56", "55", "59", "60", "62", "63", "53", "61", // "217", "142", "181", "182", "216", "188", 

    "Communications": ["214", "107", "91", "94"],
    "Admin - Application Details": ["54", "58", "56", "55", "59", "60", "62", "63", "53", "61", "75", "66", "69"],
    "Adverse Action": ["112", "35", "71", "108", "144", "38", "107", "91", "72", "94", "110", "111"],
    "Initial Review": ["54", "58", "56", "55", "59", "60", "62", "63", "53", "61", "181", "182", "216", "188", "217", "142"],
    "Inspection": ["54", "58", "56", "55", "59", "60", "62", "63", "53", "61"],
    "New Client Outreach": ["150", "215", "153", "156", "127"],
    "Timing Need": ["124", "128", "126"],
    "Grass-Fed Certification": ["181", "182", "216", "188", "202"],
    
    // "Complaint",
    // "Final Review",
    // "Final Review - Additional",
    // "Financial Transaction",
    // "Initial Review - Additional",
    // "Inspection - Additional",
    // "NewOrg System Notice",
    // "Staff Reminder",
    // "Sub Contact Certification",
    // "Surrender",
    // "Transfers",
};


const datepicker_config = {
    "format": "mm/dd/yyyy", 
    "autoHide": true, 
    "assumeNearbyYear": 20,
};


const users = {
     "90": " Unassigned",
    "265": "Adam Clopton",
     "29": "Alexandra W Petrovits",
     "70": "Ben Caldwell",
    "252": "Cate Eddy",
    "250": "Cathie Gotthardt",
     "40": "Cori Skolaski",
    "199": "Curt Parr",
     "81": "Erik Gundersen",
     "21": "Gabrielle Daniels",
     "24": "Jackie DeMinter",
    "260": "Jake Overgaard",
     "16": "Jodi Shrum",
    "109": "Joe Pedretti",
    "211": "Karin Woods",
     "23": "Katie Starr",
    // "178": "Kelley Belina",
    // "232": "Kelsey Barale",
    // "197": "Kendra Volk ",
    "139": "Kristen Adams",
    // "251": "Liz Happ",
     "35": "Lynne Haynor",
     "25": "Mark Geistlinger",
    "222": "Mike Tuszynski",
    "285": "Olive Reynolds",
    "229": "Rebekah Phillips",
    "253": "Ryan Hunt",
    "248": "Sammy Clopton",
    "241": "Sarah Forsythe",
    "261": "Shannon Bly",
    "196": "Stephanie Leahy",
     // "22": "Stephen Walker",
     "20": "Susan Perry",
    "189": "Terri Okrasinski",
    "198": "Tracy Trahan",
    "249": "Val Torres",
};


const basic_event_fields = {
    //empty fields
    "sigFieldHolder": "",
    "EventTypeChanged": "",
    "FollowUpValue": "",
    "FollowUpType": "",
    "hidden_save_new2": "",
    "copycontacts": "",
    "copyevent": "",
    "@field.Minutes@comp.Events_Create": "",
    "@field.Result@comp.Events_Create": "",
    "@field.DriveTime@comp.Events_Create": "",
    "@field.Miles@comp.Events_Create": "",
    //static fields
    "Action": "Save",
    "@CREATE@comp.Events_Create": "Save",
    "@CREATE@comp.EE_C": "Save",
    "@CREATE@comp.EE2_C": "Save",
    "@CREATE@comp.EE3_C": "Save",
    "@field.Reminder@comp.Events_Create": "0",
    "@field.Attendees@comp.Events_Create": "1",
    "@field.Access@comp.Events_Create": "Public",
    "EventStartHour": "12",
    "EventStartMinute": "00",
    "EventStartAMPM": "PM",
    "EventEndHour": "12",
    "EventEndMinute": "00",
    "EventEndAMPM": "PM",
    "IF_CLOSE": "True",
};


function td(lbl, el, attr="") { 
    return $(`<td ${attr}></td>`).append(`<label style='color:white'>${lbl}</label>`).append("<br>").append(el); 
}


$(document).ready(function() {
    //Create UI
    let static_field_section = $("<thead></thead>");
    let dynamic_field_section = $("<tbody id='dynamic_field_section'></tbody>");
    let create_button_section = $("<tfoot></tfoot>");

    //static event fields
    let txt_client_ids = $("<textarea id='client_ids' cols=90 rows=4></textarea>"); 
    let txt_event_name = $("<input type='text' id='event_name' class='form-control' />");
    let txt_event_desc = $("<input type='text' id='event_desc' class='form-control' />");
    let txt_event_date = $("<input type='text' id='event_date' class='form-control datepicker' data-toggle='datepicker' />");

    let sel_event_type = $("<select id='event_type' class='form-control'></select>").on("change", generate_event_fields);
    for (let event_type in event_types) {
        $(sel_event_type).append(`<option value='${event_type}'>${event_type}</option>`);
    }

    let sel_assigned_to = $("<select id='assigned_to' class='form-control'></select>");
    for (let user of Object.entries(users).sort((a, b) => a[1].localeCompare(b[1]))) {
        $(sel_assigned_to).append(`<option value='${user[0]}'>${user[1]}</option>`);
    }

    let sel_event_status = $("<select id='event_status' class='form-control'></select>");
    for (let event_status of ["Complete", "Pending", "Void"]) {
        $(sel_event_status).append(`<option value='${event_status}'>${event_status}</option>`);
    }

    let sel_event_open = $("<select id='event_open' class='form-control'></select>");
    for (let event_open of ["Closed", "Open"]) {
        $(sel_event_open).append(`<option value='${event_open}'>${event_open}</option>`);
    }

    //assemble
    $(static_field_section)
    .append(
        $("<tr></tr>")
        .append(td("", "<h3 style='color:white'>Bulk Event Creator</h3>", "colspan=2"))
    )
    .append(
        $("<tr></tr>")
        .append(td("Client IDs", txt_client_ids, "colspan=2"))
    )
    .append(
        $("<tr></tr>")
        .append(td("Event Name", txt_event_name))
        .append(td("Event Type", sel_event_type))
    )
    .append(
        $("<tr></tr>")
        .append(td("Event Date", txt_event_date))
        .append(td("Assigned To", sel_assigned_to))
    )
    .append(
        $("<tr></tr>")
        .append(td("Event Status", sel_event_status))
        .append(td("Open/Closed", sel_event_open))
    )
    .append(
        $("<tr></tr>")
        .append(td("Event Description", txt_event_desc, "colspan=2"))
    )
    .append(
        $("<tr></tr>")
        .append(td("", "<hr>", "colspan=2"))
    );

    //assemble
    $(create_button_section)
    .append(
        $("<tr></tr>")
        .append(td("", "<hr>", "colspan=2"))
    )
    .append(
        $("<tr></tr>")
        .append(td("", $("<input type='button' value='Create Events' style='border:1px solid black;' />").on("click", create_bulk_events)))
        .append(td("", $("<label id='response' style='color:white'></label>").append("<label id='errors' style='color:white'></label>")))
    )
    .append(
        $("<tr></tr>")
        .append(td("", $("<input type='button' value='Create from CSV' style='border:1px solid black;' onclick='$(\"#csv_file\").trigger(\"click\");' />")))
        .append(td("", $("<input type='file' id='csv_file' style='opacity:0' />").on("change", parse_csv)))
    );

    //add to DOM
    $("#Search").parent().empty()
    .append(
        $("<table id='bulk_event_table' style='background-color:#607584; width:600px;'></table>")
        .append(static_field_section)
        .append(dynamic_field_section)
        .append(create_button_section)
    );
    //enable datepicker
    $(txt_event_date).datepicker(datepicker_config); 
    //create dynamic fields
    generate_event_fields();
});


function generate_event_fields() {
    let event_type = $("#event_type").val();
    if (!Object.keys(event_types).includes(event_type)) {
        alert(`Event Type ${event_type} not recognized`);
        return;
    }

    //create fields
    let field_tds = [];
    let date_fields = [];
    for (let field_num of event_types[event_type]) {
        let def = fields[field_num];
        if (!def) {
            console.log(field_num + " not found?!");
            continue;
        }

        let inp;
        if (def["input"] == "select") {
            inp = $(`<select id='F${field_num}' class='form-control'></select>`);
            for (let opt of def["options"]) {
                $(inp).append(`<option value='${opt}'>${opt}</option>`);
            }
        }
        else if (def["input"] == "date") {
            inp = $(`<input type='text' id='F${field_num}' class='form-control datepicker' data-toggle='datepicker' />`);
            date_fields.push(inp);
        }
        else if (def["input"] == "number") { 
            inp = $(`<input type='number' id='F${field_num}' class='form-control' />`);
        }
        else if (def["input"] == "checkbox") { 
            inp = $(`<input type='checkbox' id='F${field_num}' />`);
        }
        else { 
            inp = $(`<input type='text' id='F${field_num}' class='form-control' />`);
        }
        $(inp).prop("title", `OpenText${field_num}`);

        field_tds.push(td(def["name"], inp));
    }

    //assemble (2 inputs per row)
    let rows = [];
    for (let i = 0; i < field_tds.length; i += 2) {
        let row = $("<tr></tr>").append(field_tds[i]);
        if (i + 1 < field_tds.length) $(row).append(field_tds[i + 1]);
        rows.push(row);
    }
    $("#dynamic_field_section").empty().append(rows);

    //enable datepickers
    for (let date_field of date_fields) {
        $(date_field).datepicker(datepicker_config); 
    }
}


function create_bulk_events() {
    let client_ids = $("#client_ids").val().replaceAll(/\n| /g, ",").split(",").filter(id => /^[1-9][0-9]{0,4}$/.test(id));
    let event_name = $("#event_name").val().trim();
    let event_desc = $("#event_desc").val().trim();
    let event_date = $("#event_date").val().trim();
    let event_type = $("#event_type").val();
    let event_open = $("#event_open").val();
    let event_status = $("#event_status").val();
    let assigned_to = $("#assigned_to").val();

    //required fields
    if (!Object.keys(event_types).includes(event_type)) {
        alert(`Event Type '${event_type}' not recognized`);
        return;
    }
    if (!["Complete", "Pending", "Void"].includes(event_status)) {
        alert(`Event Status ${event_status} not recognized`);
        return;
    }
    if (!["Open", "Closed"].includes(event_open)) {
        alert(`${event_open} is not Open/Closed`);
        return;
    }
    if (client_ids.length == 0 || !event_name || !event_date) {
        alert("You must enter client id(s), event name and date");
        return;
    }
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(event_date)) {
        alert("Date is invalid");
        return;
    }
    if (!(assigned_to in users)) {
        alert("User is not valid?");
        return;
    }
    // if (!event_desc && !confirm("Do you wish to leave the description blank?")) {
    //     return;
    // }

    //are you sure?
    if (!confirm(`Proceed with creating ${client_ids.length} ${event_type} events?`)) {
        return;
    }

    //assemble data
    let event_data = {};
    for (let field in basic_event_fields) {
        event_data[field] = basic_event_fields[field];
    }

    event_data["@field.AssignedTo@comp.Events_Create"] = assigned_to;
    event_data["@field.Name@comp.Events_Create"] = event_name;
    event_data["@field.Description@comp.Events_Create"] = event_desc;
    event_data["@FIELD.EventDate@comp.Events_Create"] = event_date;
    event_data["@field.Type@comp.Events_Create"] = event_type;
    event_data["@field.ReminderStatus@comp.Events_Create"] = event_open;
    event_data["@field.Status@comp.Events_Create" ] = event_status;

    //gather data from custom fields
    for (let field_num of event_types[event_type]) {
        let def = fields[field_num];
        let num = parseInt(field_num);

        let key = `@field.OpenText${field_num}@comp.`;
        // if (num > 490) key += "EE4_C";
        if (num > 370) key += "EE3_C";
        else if (num > 250) key += "EE2_C";
        else if (num > 120) key += "EE_C";
        else key += "Events_Create";
        // if (def["contact_field"] === true) {
        //     key = `@field.OpenText${field_num}@key.CLIENT_ID@comp.Customers_Update`;
        // }

        let value = "";
        if (def["input"] != "checkbox") value = $(`#F${field_num}`).val();
        else if ($(`#F${field_num}`).is(":checked")) value = "Yes";

        if (value) event_data[key] = value;
    }

    //UI stuff
    $("#response").empty();
    $("#errors").empty();
    $("#bulk_event_table").find(":input").css("background-color", "#bbbbbb").prop("disabled", true).find("option:not(:selected)").prop("disabled", true);
    let index = -1; //gets incremented immediately

    //finalize and send calls
    function create_next_event() {
        index++;
        $("#response").text(`(${index}/${client_ids.length})`);

        //check to see if it reached the end
        if (index >= client_ids.length) {
            //re-enable form inputs
            $("#bulk_event_table").find(":input").css("background-color", "").removeProp("disabled").find("option:not(:selected)").removeProp("disabled");
            return;
        }

        //gather data
        let client_id = client_ids[index];
        let this_event_data = {};
        for (let key in event_data) {
            this_event_data[key] = event_data[key];

            //this isn't needed aynmore since deciding to not include contact fields
            // if (key.includes("CLIENT_ID")) {
            //     this_event_data[key.replace("CLIENT_ID", client_id)] = event_data[key];
            //     //flag contact for updating
            //     this_event_data[`@UPDATE@key.${client_id}@comp.Customers_Update`] = client_id
            // }
            // else {
            //     this_event_data[key] = event_data[key];
            // }
        }
        this_event_data["@field.billable"] = client_id;
        this_event_data["@field.CustomerAllNum@comp.Events_Create"] = client_id;
        // console.log(this_event_data);
    
        $.ajax({
            url: "EventUpdate.asp",
            type: "POST",
            data: this_event_data,
            // async: false,
            success: function(response) {
                //console.log(response);
            },
            error: function(response) {
                let err = $("#errors").html();
                $("#errors").html(`${err}error for ${client_id}<br>`);
            },
            complete: function() {
                create_next_event(); //effectively synchronous
            }
        });

    }

    //begin
    create_next_event();
}


function parse_csv() {
    let file = $("#csv_file")[0].files[0];
    if (!file) return;
    // console.log(file);

    let reader = new FileReader();
    reader.onload = function() {
        import_csv(CSVToArray(reader.result));
    };
    reader.readAsText(file);
    $("#csv_file").val(null);
}


function import_csv(csv_arrays) {
    let config_fields = {
        //field: [possible header values],
        "client_id": ["id", "client", "client id", "client_id", "customerallnum", "customer all num", "customer_all_num", "customer num", "customer_num", "customernum"],
        "event_name": ["name", "event name", "event_name"],
        "event_type": ["type", "event type", "event_type"],
        "event_date": ["date", "event date", "event_date"],
        "event_description": ["description", "desc", "event description", "event_description"],
        "event_status": ["status", "event status", "event_status"],
        "open_closed": ["open", "closed", "open closed", "open_closed", "open/closed", "openclosed"],
        "assigned_to": ["user", "user_id", "user id", "userid", "event assigned to", "event_assigned_to", "assigned_to", "assigned to"],
    };

    let config = [];
    let unknown_headers = [];

    //read and validate header row, determine field order
    for (let header of csv_arrays[0]) {
        let invalid = true;
        for (let field in config_fields) {
            if (config_fields[field].includes(header.toLowerCase())) {
                config.push(field);
                delete config_fields[field];
                invalid = false;
                break;
            }
        }

        //confirm that custom fields say opentext### (or just ###) and that the number is valid
        if ((/^(opentext)?\d+$/i.test(header))
        && (header.match(/\d+/)[0] in fields)) {
            if (!header.toLowerCase().startsWith("opentext")) header = "opentext" + header;
            config.push(header);
            invalid = false;
        }

        if (invalid) unknown_headers.push(header);
    }

    //exit if headers were incorrect
    let remaining_headers = Object.keys(config_fields);
    if (remaining_headers.length > 0) {
        alert("File is missing headers: " + remaining_headers.toString());
        return;
    }
    if (unknown_headers.length > 0) {
        alert("File contains unknown headers: " + unknown_headers.toString());
        return;
    }

    //loop through csv lines and create objects
    let new_records = [];
    let no_id_count, no_name_count, no_date_count, no_type_count, no_status_count, no_open_count, no_user_count, field_count_mismatch;
    no_id_count = no_name_count = no_date_count = no_type_count = no_status_count = no_open_count = no_user_count = field_count_mismatch = 0;
    for (let i = 1; i < csv_arrays.length; i++) {
        let csv_line = csv_arrays[i];
        let record = {};

        //ensure field count matches
        if (csv_line.length < 2) continue;
        if (csv_line.length != config.length) {
            field_count_mismatch++;
            continue;
        }

        //validate and assign data from row to record fields
        let no_id, no_name, no_date, no_type, no_status, no_open, no_user;
        no_id = no_name = no_date = no_type = no_status = no_open = no_user = false;
        for (let c = 0; c < config.length; c++) {
            let field = config[c];
            let value = csv_line[c];

            if (field == "client_id") {
                if (!/^[1-9][0-9]{0,4}$/.test(value)) no_id = true;
                record["@field.billable"] = value;
                record["@field.CustomerAllNum@comp.Events_Create"] = value;
            }
            else if (field == "event_name") {
                if (value.length == 0) no_name = true;
                record["@field.Name@comp.Events_Create"] = value;
            }
            else if (field == "event_date") {
                if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) no_date = true;
                record["@FIELD.EventDate@comp.Events_Create"] = value;
            }
            else if (field == "event_type") {
                if (!Object.keys(event_types).includes(value)) no_type = true;
                record["@field.Type@comp.Events_Create"] = value;
            }
            else if (field == "event_status") {
                if (!["Complete", "Pending", "Void"].includes(value)) no_status = true;
                record["@field.Status@comp.Events_Create" ] = value;
            }
            else if (field == "event_description") {
                //validation not really needed here...
                record["@field.Description@comp.Events_Create"] = value;
            }
            else if (field == "open_closed") {
                if (!["Open", "Closed"].includes(value)) no_open = true;
                record["@field.ReminderStatus@comp.Events_Create"] = value;
            }
            else if (field == "assigned_to") {
                if (!(value in users)) no_user = true;
                record["@field.AssignedTo@comp.Events_Create"] = value;
            }
            else if (value) {
                let num = parseInt(field.match(/t(\d+)$/)[1]);
                let key = `@field.${field}@comp.`;
                if (num > 370) key += "EE3_C";
                else if (num > 250) key += "EE2_C";
                else if (num > 120) key += "EE_C";
                else key += "Events_Create";

                record[key] = value;
            }
        } //for c

        if (no_id) no_id_count++;
        else if (no_name) no_name_count++;
        else if (no_date) no_date_count++;
        else if (no_type) no_type_count++;
        else if (no_status) no_status_count++;
        else if (no_open) no_open_count++;
        else if (no_user) no_user_count++;
        else new_records.push(record);
    } //for i

    let invalid_count = no_id_count + no_name_count + no_date_count + no_type_count + no_status_count + no_open_count + no_user_count + field_count_mismatch;
    let invalid_message = "";
    if (no_id_count) invalid_message += `(${no_id_count} without id)`;
    if (no_name_count) invalid_message += `(${no_name_count} without name)`;
    if (no_date_count) invalid_message += `(${no_date_count} without date)`;
    if (no_type_count) invalid_message += `(${no_type_count} without type)`;
    if (no_status_count) invalid_message += `(${no_status_count} without status)`;
    if (no_open_count) invalid_message += `(${no_open_count} without open/closed)`;
    if (no_user_count) invalid_message += `(${no_user_count} without user)`;
    if (field_count_mismatch) invalid_message += `(${field_count_mismatch} without correct field count)`;

    //final confirmation
    if (new_records.length == 0) {
        alert(`No valid records found in file. ${invalid_message}`)
        return;
    }
    else if (!confirm(`Proceed with importing ${new_records.length} events? \nIgnored ${invalid_count} ${invalid_message}`)) {
        return;
    }

    //UI stuff
    $("#response").empty();
    $("#errors").empty();
    $("#bulk_event_table").find(":input").css("background-color", "#bbbbbb").prop("disabled", true).find("option:not(:selected)").prop("disabled", true);

    let total_records = new_records.length;

    //finalize and send calls
    function import_next_event() {
        let count = total_records - new_records.length;
        $("#response").text(`(${count}/${total_records})`);

        let record;
        if (new_records.length > 0) {
            record = new_records.shift();
        }
        else {
            //re-enable form inputs
            $("#bulk_event_table").find(":input").css("background-color", "").removeProp("disabled").find("option:not(:selected)").removeProp("disabled");
            return;
        }

        //add in event data basics
        for (let field in basic_event_fields) {
            record[field] = basic_event_fields[field];
        }
    
        $.ajax({
            url: "EventUpdate.asp",
            type: "POST",
            data: record,
            // async: false,
            success: function(response) {
                //console.log(response);
            },
            error: function(response) {
                let client_id = record["@field.CustomerAllNum@comp.Events_Create"];
                let err = $("#errors").html();
                $("#errors").html(`${err}error for ${client_id}<br>`);
            },
            complete: function() {
                import_next_event(); //effectively synchronous
            }
        });
    }

    //begin
    import_next_event();
}


function CSVToArray(strData, strDelimiter=",") {
    //http://stackoverflow.com/a/1293163/2343
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + // Delimiters.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + // Quoted fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))" // Standard fields.
    ), "gi");

    // Create an array to hold our data with a default empty first row
    var arrData = [[]];

    // Create an array to hold our individual pattern matching groups
    var arrMatches = null;

    // Keep looping over the regular expression matches until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            // Since we have reached a new row of data, add an empty row to our data array.
            arrData.push([]);
        }

        var strMatchedValue;
        if (arrMatches[2]) {
            // We found a quoted value. When we capture this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(/\"\"/g, "\"");
        } 
        else { 
            // non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}
