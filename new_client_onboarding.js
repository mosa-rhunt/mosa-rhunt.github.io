let html;
let client_id;

$(document).ready(function() {
    $("head").append($.parseHTML(`
    <style>

    </style>
    `));

    // fetch data from print form
    client_id = $("#h_customerex").val();
    $.ajax({
        url: `PrintForm.asp?PrintFormNum=41&Action=View&CustomerAllNum=${client_id}`,
        type: "GET",
        success: function(response) {
            html = $.parseHTML(response);
            specialties();
            osps();
            nco_info();
            gatekeeper();
            forms_required();
            forms_suggested();
            compliance_topics();
            comm_events();
            tasks();
        },
        error: function(response) {
            console.log("error");
            console.log(response);
        },
    });

    // make the headers big
    for (let id of [ "header-overview", "header-education", "header-staff-notes" ]) {
        $(`#${id}`).css("color", "#333").css("font-size", "20pt");
    }
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


function specialties() {
    let parsed = parse_neworg_content("315", html)[0];
    let list = [];
    for (let key in parsed) {
        if (parsed[key] == "Yes") list.push(key);
    }
    $("#specialties").text(list.join(", "));
}


function osps() {
    let root = $("#osps");
    $("<label>DYNAMICALLY ADDED OSPS</label>").appendTo(root);
}


function nco_info() {
    let root = $("#nco-info");
    $("<label>DYNAMICALLY ADDED NCO INFO</label>").appendTo(root);
}


function gatekeeper() {
    let root = $("#gatekeeper");
    $("<label>DYNAMICALLY ADDED GATEKEEPER</label>").appendTo(root);
}


function forms_required() {
    let root = $("#forms-required");
    $("<label>DYNAMICALLY ADDED FORMS REQUIRED</label>").appendTo(root);
}


function forms_suggested() {
    let root = $("#forms-suggested");
    $("<label>DYNAMICALLY ADDED FORMS SUGGESTED</label>").appendTo(root);
}


function compliance_topics() {
    let root = $("#compliance-topics");
    $("<label>DYNAMICALLY ADDED COMPLIANCE TOPICS</label>").appendTo(root);
}


function comm_events() {
    let table = $("<table></table>");
    let thead = $("<thead class='thead-light'></thead>").appendTo(table);
    let tbody = $("<tbody></tbody>").appendTo(table);

    $("<tr></tr>")
    .append("<th>Event Date</th>")
    .append("<th>Topic (Name)</th>")
    .append("<th>Minutes</th>")
    .appendTo(thead);

    let parsed = parse_neworg_content("1822", html);
    for (let event of parsed) {
        $("<tr></tr>")
        .append(`<td><a href="https://web5.neworg.com/MC2_MOSA/EventUpdate.asp?Action=View&EventNum=${event.EventNum}" target="_blank">${event.EventDate}</a></td>`)
        .append(`<td>${event.Name}</td>`)
        .append(`<td>${event.Minutes}</td>`)
        .appendTo(tbody);
    }

    $("#comm-events").append(table);
}


function tasks() {
    let root = $("#tasks");
    $("<label>DYNAMICALLY ADDED TASKS</label>").appendTo(root);
}
