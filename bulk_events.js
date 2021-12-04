//Bulk event creation form. Used on a report page

const fields = {
    //prototype
    "fieldnum": {
        "name": "field name",
        "input": "text", //or date, number, checkbox, select
        "values": ["one", "two"], //for select options
        "contact_field": true, //only set/true for event fields that are also contact fields
    }

    //New Client Outeach fields
    "150": { "input":"text", "name":"Client's overall satisfaction" }, 
    "215": { "input":"text", "name":"Client's Organic Certificate" }, 
    "153": { "input":"text", "name":"Re-certification application" }, 
    "156": { "input":"text", "name":"Any anticipated changes" }, 
    "127": { "input":"text", "name":"Communication with MOSA" },

};

const event_types = {
    // "Admin - Application Details",
    // "Adverse Action",
    // "Communications",
    // "Initial Review",
    // "Inspection",
    "New Client Outreach": ["150", "215", "153", "156", "127"],
    //
    // "Complaint",
    // "Final Review",
    // "Final Review - Additional",
    // "Financial Transaction",
    // "Grass-Fed Certification",
    // "Initial Review - Additional",
    // "Inspection - Additional",
    // "NewOrg System Notice",
    // "Staff Reminder",
    // "Sub Contact Certification",
    // "Surrender",
    // "Timing Need",
    // "Transfers",
};

const picker_config = {
    "format": "mm/dd/yyyy", 
    "autoHide": true, 
    "assumeNearbyYear": 20
};

function td(lbl, el, attr="") { 
    return $(`<td ${attr}></td>`).append(`<label style='color:white'>${lbl}</label>`).append("<br>").append(el); 
}


jQuery(document).on("load", create_initial_form);
function create_initial_form() {
    if ($("#Search").length == 0) {
        console.log("No search form yet");
        setTimeout(create_initial_form, 500);
        return;
    }
    
    //Create UI
    let static_field_section = $("<thead></thead>");
    let dynamic_field_section = $("<tbody id='dynamic_field_section'></tbody>");
    let create_button_section = $("<tfoot></tfoot>");

    //static event fields
    let txt_client_ids = $("<textarea id='client_ids'></textarea>"); 
    let txt_event_name = $("<input type='text' id='event_name' class='form-control' />");
    let txt_event_desc = $("<input type='text' id='event_desc' class='form-control' />");
    let txt_event_date = $("<input type='text' id='event_date' class='form-control datepicker' data-toggle='datepicker' />");

    let sel_event_type = $("<select id='event_type' class='form-control'></select>").on("change", generate_event_fields);
    for (let event_type in event_types) {
        $(sel_event_type).append(`<option value='${event_type}'>${event_type}</option>`);
    }

    //assemble
    $(static_field_section)
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
        .append(td("Event Description", txt_event_desc))
        .append(td("Event Date", txt_event_date))
    );

    //assemble
    $(create_button_section)
    .append(
        $("<tr></tr>")
        .append($("<td></td>").append($("<input id='create_events_button' type='button' value='Create Events' />").on("click", create_bulk_events)))
        .append($("<td></td>").append("<span id='response'></span>").append("<span id='errors'></span>"))
    );

    //add to DOM
    let script = $("#the_script"); //this file
    $("#Search").parent().empty()
    .append(script)
    .append(
        $("<table id='bulk_event_table' style='background-color:#BDCAD4'></table>")
        .append(static_field_section)
        .append(dynamic_field_section)
        .append(create_button_section)
    );
    //enable datepicker
    $(txt_event_date).datepicker(picker_config); 
    //create dynamic fields
    generate_event_fields();
}


function generate_event_fields() {
    let event_type = $("#event_type").val();
    if (!Object.keys(event_types).includes(event_type)) {
        alert(`Event Type ${event_type} not recognized`);
        return;
    }

    //create fields
    let field_tds = [];
    let date_fields = [];
    for (let fnum of event_types[event_type]) {
        let def = fields[fnum];
        if (!def) {
            console.log(fnum + " not found?!");
            continue;
        }

        let inp;    
        if (def["input"] == "select") {
            inp = $(`<select id='F${fnum}' class='form-control'></select>`);
            for (let opt of def["values"]) {
                $(inp).append(`<option value='${opt}'>${opt}</option>`);
            }
        }
        else if (def["input"] == "date") {
            inp = $(`<input type='text' id='F${fnum}' class='form-control datepicker' data-toggle='datepicker' />`);
            date_fields.push(inp);
        }
        else if (["text", "number", "checkbox"].includes(def["input"])) { 
            inp = $(`<input type='${def["input"]}' id='F${fnum}' class='form-control' />`);
        }
        else { 
            inp = $(`<input type='text' id='F${fnum}' class='form-control' />`);
            console.log(def["input"] + " not a valid input type");
        }

        field_tds.push(td(def["name"], inp));
    }

    //assemble
    let rows = [];
    for (let i = 0; i < field_tds.length; i += 2) {
        let row = $("<tr></tr>").append(field_tds[i]);
        if (i + 1 < field_tds.length) $(row).append(field_tds[i + 1]);
        rows.push(row);
    }
    $("#dynamic_field_section").empty().append(rows);

    //enable datepickers
    for (let date_field of date_fields) {
        $(date_field).datepicker({"format":"mm/dd/yyyy", "autoHide":true, "assumeNearbyYear":20}); 
    }
}


function create_bulk_events() {
    let client_ids = $("#client_ids").val().replaceAll(/\n| /g, ",").split(",").filter(id => id.length > 0);
    let event_name = $("#event_name").val().trim();
    let event_desc = $("#event_desc").val().trim();
    let event_date = $("#event_date").val().trim();
    let event_type = $("#event_type").val();

    //required fields
    if (client_ids.length == 0 || !event_name || !event_date || !event_type) {
        alert("You must enter client id(s) and event name, date, type");
        return;
    }
    if (!/\d{1,2}\/\d{1,2}\/\d{4}/.test(event_date)) {
        alert("Date is invalid");
        return;
    }
    if (!event_desc && !confirm("Do you wish to leave the description blank?")) {
        return;
    }
    if (!Object.keys(event_types).includes(event_type)) {
        alert(`Event Type ${event_type} not recognized`);
        return;
    }

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
        "@CREATE@comp.Events_Create": "Save",
        "@CREATE@comp.EE_C": "Save",
        "@CREATE@comp.EE2_C": "Save",
        "@CREATE@comp.EE3_C": "Save",
        "@field.Reminder@comp.Events_Create": "0",
        "@field.Attendees@comp.Events_Create": "1",
        "EventStartHour": "12",
        "EventStartMinute": "00",
        "EventStartAMPM": "PM",
        "EventEndHour": "12",
        "EventEndMinute": "00",
        "EventEndAMPM": "PM",
        "IF_CLOSE": "True", //if this isn't set then the page thinks it should reload after saving
    };

    let event_data = {};
    for (let field in basic_event_fields) {
        event_data[field] = basic_event_fields[field];
    }
    event_data["@field.AssignedTo@comp.Events_Create"] = "90"; //"Unassigned"
    event_data["@field.Name@comp.Events_Create"] = event_name;
    event_data["@field.Description@comp.Events_Create"] = event_desc;
    event_data["@FIELD.EventDate@comp.Events_Create"] = event_date;
    event_data["@field.Type@comp.Events_Create"] = event_type;

    //custom fields
    for (let field_num in event_types[event_type]) {
        let def = fields[field_num];

        let key;
        if (def["contact_field"]) {
            
            //DAMN GOTTA STASH THESE...
            key = `@field.OpenText${field_num}@key.${client_id}@comp.Customers_Update`;
            key = `@field.OpenText${field_num}@key.CLIENT_ID@comp.Customers_Update`;

            continue;
        }
        else if (false) {
            key = `@field.OpenText${field_num}@comp.EE_C`;
        }
        else {
            key = `@field.OpenText${field_num}@comp.Events_Create`;
        }

        let value;
        if (def["input"] == "checkbox") {
            if ($(`#F${field_num}`).is(":checked")) value = "Yes";
            else value = "";
        }
        else {
            value = $(`#F${field_num}`).val();
        }

        if (value) event_data[key] = value;
    }

    //UI stuff
    $("#response").empty();
    $("#errors").empty();
    $("#bulk_event_table").find(":input").prop("readonly", true).prop("disabled", true).css("background-color", "#bbb").find("option:not(:selected)").prop("disabled", true);
    let index = 0;

    //finalize and send calls
    function create_next_event() {
        if (index >= client_ids.length) {
            //re-enable form inputs
            $("#bulk_event_table").find(":input").removeProp("readonly").removeProp("disabled").css("background-color", "").find("option:not(:selected)").removeProp("disabled");
            // $("#create_events_button").removeProp("disabled");
            return;
        }

        let client_id = client_ids[index];
        if (!Number.isInteger(parseInt(client_id))) {
            let err = $("#errors").html();
            $("#errors").html(`${err}<br>${client_id} is not valid`);
            index++;
            create_next_event();
        }

        let this_event_data = {};
        for (let key in event_data) {
            if (key.includes("CLIENT_ID")) {
                this_event_data[key.replace("CLIENT_ID", client_id)] = event_data[key];
            }
            else {
                this_event_data[key] = event_data[key];
            }
        }
        this_event_data["@field.billable"] = client_id;
        this_event_data["@field.CustomerAllNum@comp.Events_Create"] = client_id
        this_event_data[`@UPDATE@key.${client_id}@comp.Customers_Update`] = client_id
    
        $.ajax({
            url: "EventUpdate.asp",
            type: "POST",
            async: false, //important to not overload the site with requests
            data: event_data,
            success: function(response) {
                //console.log(response);
            },
            error: function(response) {
                let err = $("#errors").html();
                $("#errors").html(`${err}<br>error for ${client_id}`);
            }
            complete: function() {
                index++;
                $("#response").text(`(${index}/${client_ids.length})`)
                create_next_event();
            }
        });

    }

    //begin
    create_next_event();
}