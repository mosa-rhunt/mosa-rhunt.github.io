<script>
$(document).ready(function() {
    render_completed_form("Farm OSP", "1447", "1448", ["1449", "1450", "1451", "1452"]);
}); 


function parse_questions(content_id) {
    let questions = {};
    let fields = [
        "question_id",
        "sort_order",
        "question_text",
        "response_type",
        "required",
        "section_name",
        "section_description",
    ]

    //extract data from table
    $("span.content" + content_id + " table.display" + content_id).find("tbody tr").each(function() {
        let index = -1;
        let q_id = 0;
        let question = {};
        $(this).find("td").each(function() {
            if (++index == 0) q_id = $(this).text();
            question[fields[index]] = $(this).children("span").html();
        });
        // questions[q_id] = { "question": question };
        questions[q_id] = question;
    });

    return questions;
}


function parse_responses(content_id) {
    let responses = {};

    //extract data from table
    $("span.content" + content_id + " table.display" + content_id).find("tbody tr").each(function() {
        let index = -1;
        let year = 0;
        let response = null;

        //fields:
        //question_id
        //year
        //opentext1 
        //..to..
        //opentext50
        $(this).find("td").each(function() {
            let text = $(this).text();
            if (++index == 0) {
                //question_id
                // if (!(text in responses)) responses[text] = { "responses": {} };
                // response = responses[text]["responses"];
                if (!(text in responses)) responses[text] = {};
                response = responses[text];
            }
            else if (index == 1) {
                year = text;
                if (!(year in response)) response[year] = []
            }
            else if (text != "") {
                response[year].push(text);
            }
        });
    });

    // //compare values    
    // for (let q_id in responses) {
    //     let years = Object.keys(responses[q_id]["responses"]);
    //     if (years.length == 0) {
    //         responses[q_id]["comparison"] = null;
    //         continue;
    //     }
        
    //     let last_value = "";
    //     let changed = false;
    //     for (let year of years) {
    //         let value = responses[q_id][year].replaceAll("<br>", "").trim();
    //         if (value != "" && last_value != value) {
    //             changed = true;
    //             break;
    //         }
    //         last_value = value;
    //     }

    //     let dyntable_changed = false;
    //     if (q_id in dyntables && dyntables[q_id][""])

    //     if (changed || dyntable_changed) responses[q_id]["comparison"] = "Changed";
    //     else if (last_value == "") responses[q_id]["comparison"] = null;
    //     else responses[q_id]["comparison"] = "Same";
    // }


    return responses;
}


function parse_dyntable(content_id) {
    let dyntable = {};
    
    //gather headers
    let headers = [];
    let index = -1;
    $("span.content" + content_id + " table.display" + content_id).find("thead tr td").each(function() {
        if (++index >= 3) headers.push($(this).text());
    });
    dyntable["headers"] = headers;
    dyntable["responses"] = {};

    //gather responses
    $("span.content" + content_id + " table.display" + content_id).find("tbody tr").each(function() {
        let index = -1;
        let year = 0;
        let responses = [];

        //table_name and question_id have redundant writes here, but whatever
        $(this).find("td").each(function() {
            // inventorytab
            // formquestionnum
            // type
            // fields...
            let text = $(this).text();
            if (++index == 0) dyntable["table_name"] = text
            else if (index == 1) dyntable["question_id"] = text
            else if (index == 2) year = text
            else responses.push(text);
        });
        
        if (!(year in dyntable["responses"])) dyntable["responses"][year] = []
        dyntable["responses"][year].push(responses);
    });

    return dyntable;
}


function render_completed_form(form_name, q_content_id, r_content_id, d_content_ids=[]) {
    let db = {}; //question_id: { questions:{}, responses:{}, dyntable:{} }
    let questions = parse_questions(q_content_id);
    Object.assign(db, questions);

    let responses = parse_responses(r_content_id);
    for (let q_id in responses) {
        Object.assign(db[q_id], responses[q_id]);
    }

    let dyntables = {};
    for (let content_id of d_content_ids) {
        let parsed = parse_dyntable(content_id);
        dyntables[parsed["question_id"]] = parsed;
        if (parsed["question_id"]) db[parsed["question_id"]]["dyntable"] = parsed;
    }

    console.log(questions);
    console.log(responses);
    console.log(dyntables);
    // console.log(db);
    // return;
    
    /*
    console.log(questions);
    questions = {
        question_id {
            sort: 1,
            question: "How hairy are your cows?",
            response_type: "text",
        },
        ...
    }

    console.log(responses);
    responses = {
        question_id: {
            year1: ["asdf"],
            year2: ["qwerty"],
            year3: ["qwertyuiop"],
        },
        ...
    }

    console.log(dyntables);
    dyntables = {
        question_id: {
            table_name: "Crop Rotation",
            headers: ["asdf", "qwerty"],
            responses: {
                year1: [
                    ["answer1", "answer2"],
                    ["answer1", "answer2"],
                ],
                year2: [
                    ["answer1", "answer2"],
                    ["answer1", "answer2"],
                ],
            }
        },
        ...
    }
    */

    //judge and build responses first

    //dynamic table
    // for (let q_id in dyntables) {

    // }

    // //response(s)
    // for (let q_id in responses) {
    //     let years = Object.keys(responses[q_id]);
    //     if (years.length == 0) {
    //         responses[q_id]["comparison"] = null;
    //         continue;
    //     }
        
    //     let last_value = "";
    //     let changed = false;
    //     for (let year of years) {
    //         let value = responses[q_id][year].replaceAll("<br>", "").trim();
    //         if (value != "" && last_value != value) {
    //             changed = true;
    //             break;
    //         }
    //         last_value = value;
    //     }

    //     let dyntable_changed = false;
    //     if (q_id in dyntables && dyntables[q_id][""])

    //     if (changed || dyntable_changed) responses[q_id]["comparison"] = "Changed";
    //     else if (last_value == "") responses[q_id]["comparison"] = null;
    //     else responses[q_id]["comparison"] = "Same";
    // }





    // for (let year of ["2022", "2021", "2020"]) {
    //     if (!(year in responses[question.question_id])) continue;
    //     let question_responses = responses[question.question_id][year];
    //     let response_html = "";
    //     if (question_responses.length == 1) {
    //         response_html = `<span><span class='has-text-weight-bold'>${year}:</span> ${question_responses[0]}</span>`;
    //     }
    //     else {
    //         let ul = $("<ul></ul>");
    //         for (let choice of question_responses) {
    //             $(`<li>${choice}</li>`).appendTo(ul);
    //         }
    //     }
        
    //     //add to container
    //     $("<div></div>")
    //     .append(response_html)
    //     .appendTo(container);
    // }





    let container = $("<div class='container'></div>").append(`<h1 class='title'>${form_name}</h1>`);

    //build questions and their responses
    for (let question of Object.values(questions).sort((a, b) => a.sort_order - b.sort_order)) {
        //skip "hidden" questions
        if (question.required == "Admin") continue;

        //create section if necessary
        if (question.section_name) {
            $("<div class='has-background-warning'></div>")
            .append(`<span class='is-size-2'>${question.section_name}</span>`)
            .append("<br>")
            .append(`<span>${question.section_description}</span>`)
            .appendTo(container);
        }

        let chance = Math.random();
        let changed_tag = $("<span class='tag is-light'>Blank</span>");
        if (chance > 0.3) changed_tag = $("<span class='tag is-success'>Same</span>");
        if (chance > 0.7) changed_tag = $("<span class='tag is-danger'>Changed</span>");

        let tag_div = $("<div class='has-text-weight-bold'></div>")
        .append(changed_tag)
        .append(`<span class="tag is-dark">${question.response_type}</span>`);
        //if (question.required == "Yes") 
        $(tag_div).append("<span class='tag is-warning'>required</span>");
 
        //add question to container
        $("<div class='has-background-info'></div>")
        .append(`<span class='has-text-white is-size-5'>#${question.sort_order} -- ${question.question_text}</span>`)
        .append(tag_div)
        .appendTo(container);

        //dynamic table?
        if (question.question_id in dyntables) {
            let dyntable = dyntables[question.question_id];
            for (let year of ["2022", "2021", "2020"]) {
                if (!(year in dyntable["responses"])) continue;

                //generate table
                let header_row = $("<tr></tr>");
                for (let header of dyntable["headers"]) {
                    $(header_row).append(`<th>${header}</th>`);
                }
                let thead = $("<thead></thead>").append(header_row);
                let tbody = $("<tbody></tbody>");
                for (let response_row of dyntable["responses"][year]) {
                    let row = $("<tr></tr>").appendTo(tbody);
                    for (let response of response_row) {
                        $(`<td>${response}</td>`).appendTo(row);
                    }
                }

                //assemble table
                let table = $("<table class='table'></table>")
                .append(thead)
                .append(tbody);

                //add to container
                $("<div class='my-3'></div>")
                .append(`<span class='is-size-3'>${dyntable.table_name} (${year})</span>`)
                .append(table)
                .appendTo(container);
            }
        }

        // response(s)
        for (let year of ["2022", "2021", "2020"]) {
            if (!(year in responses[question.question_id])) continue;
            let question_responses = responses[question.question_id][year];
            let response_html = "";
            if (question_responses.length == 1) {
                response_html = `<span><span class='has-text-weight-bold'>${year}:</span> ${question_responses[0]}</span>`;
            }
            else {
                let ul = $("<ul></ul>");
                for (let choice of question_responses) {
                    $(`<li>${choice}</li>`).appendTo(ul);
                }
            }
            
            //add to container
            $("<div></div>")
            .append(response_html)
            .appendTo(container);
        }
    }

    //take control of styling
    let style = "<style>" +
    ".container > div { padding: 10px; }" +
    "</style>";
    $("head").find("style").remove();
    $("head").find("link").remove();
    $("head").append(style).append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css'>");   

    //take control of DOM
    $("body").empty().append(container);
    document.title = "Check - Farm OSP";
}
</script>
