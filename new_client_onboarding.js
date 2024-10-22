let html;
let client_id;
let client_specialties = [];

$(document).ready(function() {
    client_id = $("#h_customerex").val();

    // make the headers big
    for (let id of [ "header-overview", "header-education", "header-staff-notes" ]) {
        $(`#${id}`).css("color", "#333").css("font-size", "20pt");
    }

    // this is stored locally in the event
    init_tasks();

    // fetch data from print form
    $.ajax({
        url: `PrintForm.asp?PrintFormNum=41&Action=View&CustomerAllNum=${client_id}`,
        type: "GET",
        success: function(response) {
            html = $.parseHTML(response);
            init_specialties();
            init_osps();
            init_nco_info();
            init_gatekeeper();
            init_forms_required();
            init_forms_suggested();
            init_compliance_topics();
            init_comm_events();
        },
        error: function(response) {
            console.log("error");
            console.log(response);
        },
    });
});


function parse_neworg_content(content_id, context=null, as_array=true) {
    //this function uses the first column for the object keys, so its best to use an id for that column in the query
    let results = {};
    let headers = [];
    let row_index = 0;
    $(context || "body").find(`span.content${content_id} table.display${content_id} tr`).each(function() {
        if (!$(this).closest("table").hasClass(`display${content_id}`)) return; //skip table rows in question text (Q56 in Farm OSP)
        let row = [];
        $(this).find("td").each(function() {
            //$(this).find("style").remove(); //gets rid of style tags that are in some question text
            row.push($(this).children("span:nth-child(1)").html().trim());
        });

        if (row_index++ == 0) {
            headers = row;
        }
        else {
            let obj = {};
            for (let i = 0; i < headers.length; i++) {
                obj[headers[i]] = row[i];
            }
            results[row[0]] = obj;
        }
    });

    return (as_array ? Object.values(results) : results);
}


function new_table(headers=[]) {
    let thead = $("<thead class='thead-default thead-light'></thead>"); // -light for new BS version, -default for old
    let row = $("<tr></tr>").appendTo(thead);
    for (let header of headers) {
        $(row).append(`<th>${header}</th>`);
    }
    return $("<table class='table table-sm table-hover border'></table>").append(thead);
}


function td(content="") {
    return ([ "string", "number" ].includes(typeof content) ? $(`<td>${content}</td>`) : $("<td></td>").append(content));
}


//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_specialties() {
    let parsed = parse_neworg_content("315", html)[0];
    for (let key in parsed) {
        if (parsed[key] == "Yes") client_specialties.push(key);
    }
    $("#specialties").text(client_specialties.join(", ")).css("margin-left", "15px").css("color", "#333");
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_osps() {
    let table = new_table([ "OSP", "Is Complete", "Start Date" ]);
    let tbody = $("<tbody></tbody>").appendTo(table);

    let parsed = parse_neworg_content("1821", html);
    for (let row of parsed) {
        $("<tr></tr>")
        .append(td(row.FormName))
        .append(td(row.IsComplete))
        .append(td(row.CreateDate))
        .appendTo(tbody);
    }

    $("#osps")
    .append($("<label>Organic System Plans</label>"))
    .appendTo(table);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_nco_info() {
    let root = $("#nco-info");
    $("<label>DYNAMICALLY ADDED NCO INFO</label>").appendTo(root);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_gatekeeper() {
    let table = new_table([ "Topic", "Something" ]);
    let tbody = $("<tbody></tbody>").appendTo(table);

    for (let specialty of client_specialties) {
        $("<tr></tr>")
        .append(td(specialty))
        .append(td("-"))
        .appendTo(tbody);
    }

    $("#gatekeeper")
    .append($("<label>Gatekeeper Requirements</label>"))
    .appendTo(table);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_forms_required() {
    let table = new_table([ "Form", "Is Required", "Something" ]);
    let tbody = $("<tbody></tbody>").appendTo(table);

    for (let specialty of client_specialties) {
        $("<tr></tr>")
        .append(td(specialty))
        .append(td( Math.floor(Math.random() * 11) % 2 == 0 ? "Yes" : "No" ))
        .append(td("-"))
        .appendTo(tbody);
    }

    $("#forms-required")
    .append($("<label>Additional Forms</label>"))
    .appendTo(table);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_forms_suggested() {
    // let root = $("#forms-suggested");
    // $("<label>DYNAMICALLY ADDED FORMS SUGGESTED</label>").appendTo(root);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_compliance_topics() {
    let table = new_table([ "Topic", "Something" ]);
    let tbody = $("<tbody></tbody>").appendTo(table);

    for (let specialty of client_specialties) {
        $("<tr></tr>")
        .append(td(specialty))
        .append(td("-"))
        .appendTo(tbody);
    }

    $("#compliance-topics")
    .append($("<label>Compliance Topics</label>"))
    .appendTo(table);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

function init_comm_events() {
    let table = new_table([ "Event Date", "Person", "Name/Topic", "Category", "Minutes" ]);
    let tbody = $("<tbody></tbody>").appendTo(table);

    let parsed = parse_neworg_content("1822", html);
    for (let event of parsed) {
        $("<tr></tr>")
        .append(td(`<a class="font-weight-bold" href="https://web5.neworg.com/MC2_MOSA/EventUpdate.asp?Action=View&EventNum=${event.EventNum}" target="_blank">${event.EventDate}</a>`))
        .append(td(event.Person))
        .append(td(event.Name))
        .append(td("-"))
        .append(td(event.Minutes))
        .appendTo(tbody);
    }

    $("#comm-events")
    .append($("<label>Communications Chart</label>"))
    .append(table);
}

//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////==========//////////

// since tasks are so simple we're gonna store em quick and dirty in the textbox
// and every on-change event we'll just rewrite the value
const task_textbox_id = "#FOpenText175"
function init_tasks() {
    let table = new_table([ "Task", "Status", "Action" ]).appendTo("#tasks");
    let tbody = $("<tbody id='tasks-tbody'></tbody>").appendTo(table);
    let tfoot = $("<tfoot></tfoot>").appendTo(table);
    
    $("<tr></tr>")
    .append(td())
    .append(td())
    .append(td($("<button type='button' class='btn btn-sm btn-success'>New</button>").on("click", () => create_task_row())))
    .appendTo(tfoot);

    // add existing tasks
    try {
        for (let task of JSON.parse($(task_textbox_id).hide().val())) {
            create_task_row(task);
        }
    }
    catch {
        // oh well
    }
}

function store_tasks_as_json() {
    let task_list = [];
    $("#tasks-tbody tr").each(function() {
        let cells = $(this).find("td");
        task_list.push({
            // id: $(this).prop("id"),
            task: $(cells[0]).find("input").val(),
            status: $(cells[1]).find("select").val(),
        });
    });
    $(task_textbox_id).val(JSON.stringify(task_list));
}

// create new task row in table
function create_task_row(record=null) {
    record = record || { task:"", status:"Needs followup" };
    
    let text = $("<input type='text' style='min-width:400px'>").val(record.task).on("change keyup", store_tasks_as_json)
    
    let select = $("<select></select>").val(record.status).on("change", store_tasks_as_json);
    for (let status of [ "Needs followup", "Complete" ]) {
        $(`<option value="${status}">${status}</option>`).appendTo(select);
    }
    $(select).val(record.status);

    let button = $("<button type='button' class='btn btn-sm btn-danger'>X</button>").on("click", function() {
        $(this).closest("tr").remove();
        store_tasks_as_json();
    });

    $("<tr></tr>")
    .append(td(text))
    .append(td(select))
    .append(td(button))
    .appendTo("#tasks-tbody");
    
    store_tasks_as_json();
}
