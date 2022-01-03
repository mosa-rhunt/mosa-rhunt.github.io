//Bulk event creation form. Used on ReportGeneral.asp?RptNum=462

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
    "54": { "input": "checkbox", "name": "Farm" },
    "58": { "input": "checkbox", "name": "Livestock" },
    "56": { "input": "checkbox", "name": "Handler" },
    "55": { "input": "checkbox", "name": "Greenhouse" },
    "59": { "input": "checkbox", "name": "Maple Syrup" },
    "60": { "input": "checkbox", "name": "Mushroom" },
    "62": { "input": "checkbox", "name": "Sprout" },
    "63": { "input": "checkbox", "name": "Wild Crop" },
    "53": { "input": "checkbox", "name": "Apiculture" },
    "61": { "input": "checkbox", "name": "Retail" },
    "217": { "input": "checkbox", "name": "Livestock Sales Facility" },
    "181": { "input": "checkbox", "name": "Grass-Fed Dairy" },
    "182": { "input": "checkbox", "name": "Grass-Fed Meat" },
    "216": { "input": "checkbox", "name": "Grass-Fed Dairy Handling" },
    "188": { "input": "checkbox", "name": "Grass-Fed Meat Handling" },

    //Common fields
    "69": { "name": "Sent On", "input": "date" },
    "91": { "name": "Generic Text" },
    "94": { "name": "Enclosures" },
    "110": { "name": "cc: NOP Appeals Team", "input": "checkbox" },
    "111": { "name": "cc: NOP Appeals Team - (w/out enclosures)", "input": "checkbox" },
    "107": { "name": "Letter Date", "input": "date" },
    // "": { "name": "" },

    //New Client Outeach fields
    "150": { "name": "Client's overall satisfaction" }, 
    "215": { "name": "Client's Organic Certificate" }, 
    "153": { "name": "Re-certification application" }, 
    "156": { "name": "Any anticipated changes" }, 
    "127": { "name": "Communication with MOSA" },

    //AAD
    "75": { "name": "Application Status", "input": "select", "options": ["Application Requested", "Application Received In Office", "Application Received Web", "Update application sent", "Initial Application Sent"] },
    "66": { "name": "Reason for Sending", "input": "select", "options": ["Annual Update", "New Application", "Adding New OSP", "Significant Change to OSP"] },
    // "": { "name": "" },

    //Communications
    "214": { "name": "Subject Line" },
    
    // "": { "name": "" },
};


const event_types = {
    "Communications": ["214", "107", "91", "94"],
    "Admin - Application Details": [
        //scopes
        "54", "58", "56", "55", "59", "60", "62", "63", "53", "61", //"217", "181", "182", "216", "188", 
        //other
        "75", "66", "69",
    ],

    // "Adverse Action",
    // "Initial Review",
    // "Inspection": [],
    "New Client Outreach": ["150", "215", "153", "156", "127"],
    
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


//unused so far
const users = {
"90": "Unassigned",

"16": "Jo Anne Shrum",
"20": "Susan Perry",
"21": "Gabrielle Daniels",
"22": "Stephen Walker",
"23": "Katie Starr",
"24": "Jackie DeMinter",
"25": "Mark Geistlinger",
"29": "Alexandra W Petrovits",
"35": "Lynne Haynor",
"40": "Cori Skolaski",
"70": "Ben Caldwell",
"81": "Erik Gundersen",
"196": "Stephanie Leahy",
"197": "Kendra Volk ",
"198": "Tracy Trahan",
"199": "Curt Parr",
"109": "Joe Pedretti",
"139": "Kristen Adams",
"178": "Kelley Belina",
"189": "Terri Okrasinski",
"211": "Karin Woods",
"222": "Mike Tuszynski",
"229": "Rebekah Phillips",
"232": "Kelsey Barale",
"241": "Sarah Forsythe",
"248": "Sammy Clopton",
"249": "Val Torres",
"250": "Cathie Gotthardt",
"251": "Liz Happ",
"252": "Cate Eddy",
"253": "Ryan Hunt",
"260": "Jake Overgaard",
"261": "Shannon Bly",
"265": "Adam Clopton",
"285": "Olive Reynolds",

"4": "Mike Bruyere",
"60": "Kelly Skoda",
"37": "Rebecca Claypool",
"14": "Jenny Cruse",
"27": "Kim Wahl",
"30": "Robert Caldwell ",
"32": "Michael Crotser",
"38": "Feliciana Puig",
"47": "Wendy Paulsen",
"49": "Jeremy Dobson ",
"55": "Dennis Jipson - (Paper Inspector)",
"61": "Rich Pierce - (Paper Inspector)",
"65": "Gary LeMasters ",
"72": "Jeane Myszka - (Paper Inspector)",
"75": "Steve Thorne ",
"117": "Matt Urch - (Paper Inspector)",
"118": "Roberta Ducharme",
"123": "Elijah Beach",
"131": "Steve Kinder ",
"134": "Zachary J. Heth ",
"175": "Kevin Channell",
"180": "Alan Armstrong ",
"181": "Liz O'Donnell ",
"190": "Myrrh-Anna Kienitz",
"191": "Tracy Noel ",
"192": "Mike Gessel - (Paper Inspector)",
"194": "Kate Plachetka",
"200": "Chuck Anderas",
"201": "Sara Tedeschi ",
"202": "Gino Whitaker",
"203": "Staff Inspector",
"205": "Annaliese Eberle",
"208": "Elizabeth Anderas",
"209": "Moira Hastings",
"210": "Beth Stephenson",
"213": "Terrance Layhew  ",
"216": "Kathy Turner ",
"217": "Glen Ellickson",
"219": "Mariann Holm - (Paper Inspector)",
"220": "Lynn Johansen",
"225": "Amanda Birk",
"227": "Margarito Cal ",
"228": "Tom Wozniak ",
"231": "Dusty Kline",
"234": "Eric Campbell ",
"235": "Liana Nichols ",
"239": "Richard Ehlers ",
"240": "Robert Alexander ",
"242": "Pat Madden ",
"244": "Bec Anderson ",
"245": "Sam Karns ",
"246": "Willow Lovecky",
"247": "Cecilia Kouba",
"254": "Reagan Hulbert ",
"256": "Anne Drehfal ",
"257": "Karen Lehto ",
"259": "Mat Eddy ",
"262": "Don Erb ",
"266": "Justine Dobson ",
"267": "Karen Mischel ",
"268": "Keith Moehn ",
"275": "Pam Erb ",
"276": "Dean Dickel ",
"277": "Chris Lent",
"278": "Trish Clarkweiss ",
"280": "Jodi Ehlers ",
"281": "Ben Bisbach ",
"282": "Andre Barnaud ",
"287": "Jack Gross ",
};


function td(lbl, el, attr="") { 
    return $(`<td ${attr}></td>`).append(`<label style='color:white'>${lbl}</label>`).append("<br>").append(el); 
}


// jQuery(document).ready(create_initial_form);
// function create_initial_form() {
//     if ($("#Search").length == 0) {
//         console.log("No search form yet");
//         setTimeout(create_initial_form, 500);
//         return;
//     }
jQuery(document).ready(function() {
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
        .append(td("Event Description", txt_event_desc))
        .append(td("Event Date", txt_event_date))
    )
    .append(
        $("<tr></tr>")
        .append(td("Event Status", sel_event_status))
        .append(td("Open/Closed", sel_event_open))
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
        .append($("<td></td>").append($("<input id='create_events_button' type='button' value='Create Events' style='border:1px solid black;' />").on("click", create_bulk_events)))
        .append($("<td></td>").append("<label id='response' style='color:white'></label>").append("<label id='errors' style='color:white'></label>"))
    );

    //add to DOM
    // let script = $("#the_script"); //this file
    // .append(script)
    $("#Search").parent().empty()
    .append(
        $("<table id='bulk_event_table' style='background-color:#607584; width:600px;'></table>")
        .append(static_field_section)
        .append(dynamic_field_section)
        .append(create_button_section)
    );
    //enable datepicker
    $(txt_event_date).datepicker(picker_config); 
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
        else if (["text", "number", "checkbox"].includes(def["input"])) { 
            inp = $(`<input type='${def["input"]}' id='F${field_num}' class='form-control' />`);
        }
        else { 
            inp = $(`<input type='text' id='F${field_num}' class='form-control' />`);
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
        $(date_field).datepicker(picker_config); 
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
    // if (!event_desc && !confirm("Do you wish to leave the description blank?")) {
    //     return;
    // }

    //are you sure?
    if (!confirm(`Proceed with creating ${client_ids.length} ${event_type} events?`)) {
        return;
    }

    //assemble data
    let event_data = {};

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
        "IF_CLOSE": "True", //if this isn't set then the page thinks it should reload after saving
    };

    for (let field in basic_event_fields) {
        event_data[field] = basic_event_fields[field];
    }

    event_data["@field.AssignedTo@comp.Events_Create"] = "90"; //90 = "Unassigned"
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

        let key = `@field.OpenText${field_num}`;
        // if (num > 490) key += "@comp.EE4_C";
        if (num > 370) key += "@comp.EE3_C";
        else if (num > 250) key += "@comp.EE2_C";
        else if (num > 120) key += "@comp.EE_C";
        else key += "@comp.Events_Create";
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
