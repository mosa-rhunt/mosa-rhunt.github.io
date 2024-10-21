let html;
let client_id;

$(document).ready(function() {
    client_id = $("#h_customerex").val();
    $.ajax({
        url: `PrintForm.asp?PrintFormNum=41&Action=View&CustomerAllNum=${client_id}`,
        type: "GET",
        success: function(response) {
            html = $.parseHTML(response)
            // go
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
});


function object_from_neworg_content(content_id, context=null) {
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

    return results;
}


function array_from_neworg_content(content_id, context=null) {
    return Object.values(object_from_neworg_content(content_id, context));
}


function specialties() {
    let root = $("#specialties");
    let parsed = object_from_neworg_content("315", html);
    let specialties = [];
    for (let key in Object.values(parsed)[0]) {
        if (key == "CustomerNum") continue;
        if (parsed[key] == "Yes") specialties.push(key);
    }
    $(root).text(specialties.join(", "));
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
    let root = $("#comm-events");
    let parsed = object_from_neworg_content("1822", html);
    for (let event of Object.values(parsed)) {
        $(root).append(event.Name).append("<br>");
    }
}


function tasks() {
    let root = $("#tasks");
    $("<label>DYNAMICALLY ADDED TASKS</label>").appendTo(root);
}
