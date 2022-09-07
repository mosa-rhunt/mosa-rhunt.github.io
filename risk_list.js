// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
// <script>
const html_interface = `
    <style>
        #risk_launcher {
            position: fixed;
            left: 100%;
            top: 20%;
            width: 50px;
            transform: translate(-100%, 0%);
            background-color: #72899A; 
            color: #ff0;
            padding: 9px 3px; 
            text-align: center;
            text-decoration: none;
            border: 1px solid black; 
            border-radius: 5px
        }

        #risk_container {
            position: fixed;
            width: 70%;
            height: 70%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff; /* #72899A; */
            border: 1px solid black; 
            border-radius: 15px;
            padding: 15px;
        }

        #risk_list {
            height: 50%;
            overflow-y: scroll;
        }

        #risk_list table {
            width: 100%; 
            border-collapse: collapse;
        }

        #risk_list table th {
            color: #fff;
        }

        #risk_list table tbody tr:nth-child(odd) {
            background-color: #ddd;
        }

        .modal_button {
            font-weight: bold;
            margin-left: auto;
            text-decoration: none;
            border: 1px solid black; 
            border-radius: 5px;
            padding: 5px;
            background-color: #ccc;
            color: #000;
            margin-right: 8px;
        }
        
        .modal_button:hover {
            color: #22c;
        }
    </style>

    <a id="risk_launcher" href="#">
        <span class="fa fa-lg fa-triangle-exclamation"></span>
        <span>Risks</span>
    </a>

    <div id="risk_container" style="display: none;">
        <div>
            <div style="text-align: right;">
                <a id="risk_refresher" class="modal_button" href="#">
                    <span class="fa fa-arrows-rotate"></span>
                </a>
                <a id="risk_closer" class="modal_button" href="#">
                    <span class="fa fa-lg fa-xmark"></span>
                </a>
            </div>
            <div style="text-align: center;">
                <span class="fa fa-triangle-exclamation"></span>
                <span style="font-weight: bold; font-size: 24px;">Risks</span>
            </div>
        </div>

        <div>
            <div style="vertical-align: top; display: inline-block;">
                <span style="vertical-align: top;">Category</span> 
                <select id="newrisk_category" multiple size=9>
                    <option>Grazing</option>
                    <option>Animal Care</option>
                    <option>Outdoor Access</option>
                    <option>Visual Observation Missed</option>
                    <option>Marketplace</option>
                    <option>Recordkeeping</option>
                    <option>Prohibited Input</option>
                    <option>Out of Season Annual Inspection</option>
                    <option>Drift Follow-up</option>
                </select>
            </div>

            <div style="display: inline-block;">
                <div>
                    <span>Severity</span>
                    <select id="newrisk_severity">
                        <option></option>
                        <option>High</option>
                        <option>Med</option>
                        <option>Low</option>
                    </select>
                </div>

                <div>
                    <span>Follow-up Type</span>
                    <select id="newrisk_followup_type">
                        <option></option>
                        <option>Annual Inspection Next Year</option>
                        <option>Additional Inspection</option>
                        <option>Unannounced Inspection</option>
                        <option>Residue Sample</option>
                    </select>
                </div>

                <div>
                    <span>Follow-up Timing</span>
                    <select id="newrisk_followup_timing">
                        <option></option>
                        <option>Immediately</option>
                        <option>Spring</option>
                        <option>Summer</option>
                        <option>Fall</option>
                        <option>Winter</option>
                    </select>
                </div>

                <div>
                    <span>Source</span>
                    <input id="newrisk_source" type="text">
                </div>

                <div>
                    <span style="vertical-align: top;">Description</span> 
                    <textarea id="newrisk_description" rows=3 cols=25></textarea>
                </div>

                <div>
                    <input id="risk_create" type="button" style="float: right;" value="Create">
                </div>
            </div>
        </div>

        <div id="risk_loading" style="text-align: center;">
            <span class="fa fa-spinner fa-pulse"></span>
            <span>Loading</span>
        </div>

        <div id="risk_list">
            <table>
                <thead>
                    <tr style="background-color: #72899A;">
                        <th>Severity</th>
                        <th>Category</th>
                        <th>Source</th>
                        <th>Description</th>
                        <th>Follow-up</th>
                    </tr>
                </thead>
                <tbody id="risk_tbody">
                </tbody>
            </table>
        </div>
    </div>
`;

let risks = {};
let risks_loaded = false;
let client_id = 12145; //default is my test account
$(document).ready(function() {
    let html = $.parseHTML(html_interface);
    $("body").append(html);

    $("#risk_launcher").on("click", function() {
        $("#risk_launcher").hide();
        $("#risk_container").show();
        if (!risks_loaded) retrieve_risks();
    });
    
    $("#risk_closer").on("click", function() {
        $("#risk_launcher").show();
        $("#risk_container").hide();
    });

    $("#risk_refresher").on("click", retrieve_risks);
    
    $("#risk_create").on("click", function() {
        //determine SourceKey
        let new_source_key = 0;
        for (let risk_id in risks) {
            risk_id = parseInt(risk_id);
            if (risk_id > new_source_key) new_source_key = risk_id;
        }
        new_source_key++;

        //CusomData object
        let new_risk = {
            "CustomerAllNum": client_id,
            "Type": "Risk",
            "Status": "Active",
            "SourceKey": new_source_key,
            "SourceDate": todays_date(),
            "EventNum": 0,
            "DonationNum": 0,
            "InventoryNum": 0,
            "FormUsedNum": 0,
            "ImportDate": todays_date(),
            "ImportNum": 0,
        };

        //gather JSON Data
        let categories = $("#newrisk_category").val();
        let severity = $("#newrisk_severity").val();
        let followup_type = $("#newrisk_followup_type").val();
        let followup_timing = $("#newrisk_followup_timing").val();
        let source = $("#newrisk_source").val();
        let description = $("#newrisk_description").val();

        if (!categories || !severity || !description) {
            alert("You must specify a category, severity, and description.");
            return;
        }
        // if (!followup_type || !followup_timing) {
        //     if (!confirm("You have not specified a follow-up. Create anyways?")) return;
        // }
        if (typeof categories == "string") categories = [categories];

        new_risk["Data"] = {
            "categories": categories,
            "severity": severity,
            "description": description, 
            "source": source,
            "followup_timing": followup_timing,
            "followup_type": followup_type,
        };

        //construct URL
        let url = "SetCustomData.asp?";
        for (let key in new_risk) {
            let val = new_risk[key];
            if (typeof val == "object") val = encodeURIComponent(JSON.stringify(val).replace(/'/g, "\'").replace(/"/g, "'"));
            url += `@field.${key}=${val}&`;
        }
        url += "@CREATE";

        //call API
        $.ajax({
            url: url,
            type: "GET",
            success: function(response) {
                let arr = JSON.parse(response);
                if (!arr[0] || !arr[0]["CustomNum"]) {
                    alert("Creation failed?");
                }
                else {
                    let new_id = arr[0]["CustomNum"];
                    new_risk["CustomNum"] = new_id;
                    new_risk["Data"] = JSON.stringify(new_risk["Data"]);
                    risks[new_id] = new_risk;
                    display_risks();
                }
            },
            error: function(response) {
                console.log(response);
                alert("error while reading?");
            },
        });
    });

    //determine client ID
    let path = window.location.pathname;
    if (path.includes("CustomerUpdate.asp")) {
        let parameters = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            parameters[key] = value; //decodeURIComponent(value)
        });
        if ("CustomerNum" in parameters) client_id = parameters["CustomerNum"];
        else $("#risk_launcher").hide(); //console.log("CustomerNum not in URL");
    }
    else if (path.includes("EventUpdate.asp")) {
        let href = $("a[href*=CustomerUpdate]").prop("href");
        let regex = /CustomerNum=(\d+)/;
        let match = href.match(regex);
        if (match[1]) client_id = match[1];
        else $("#risk_launcher").hide(); //console.log("CustomerNum not on page");
    }
    else {
        // $("#risk_launcher").hide();
    }


    

    // $("#delete").on("click", function() {
    //     let custom_num = $("#custom_num").val();
    //     if (isNaN(custom_num)) return;
    //     $.ajax({
    //         url: `SetCustomData.asp?CustomNum=${custom_num}&@DELETE`,
    //         type: "GET",
    //         success: function(response) {
    //             console.log(response);
    //         },
    //         error: function(response) {
    //             console.log(response);
    //             alert("error while reading?");
    //         },
    //     });
    // });

    // $("#update").on("click", function() {
    //     let custom_num = $("#custom_num").val();
    //     if (isNaN(custom_num)) return;

    //     let risk = {
    //         "CustomerAllNum": 12145,
    //         // "CustomNum": 0,
    //         "Type": "Risk",
    //         "Status": "Active",
    //         "SourceKey": "1",
    //         "SourceDate": todays_date(),
    //         "Data": {
    //             "level": "high",
    //             "category": "Crops",
    //             "notes": "O'Neil"
    //         },
    //         "EventNum": 0,
    //         "DonationNum": 0,
    //         "InventoryNum": 0,
    //         "FormUsedNum": 0,
    //         "ImportDate": todays_date(),
    //         "ImportNum": 0,
    //     }

    //     let url = "SetCustomData.asp?";
    //     for (let key in risk) {
    //         let val = risk[key];
    //         if (typeof val == 'object') val = encodeURIComponent(JSON.stringify(val).replace(/'/g, "\'").replace(/"/g, "'"));
    //         url += `@field.${key}=${val}&`;
    //     }
    //     url += `CustomNum=${custom_num}&@UPDATE`;

    //     $.ajax({
    //         url: url,
    //         type: "GET",
    //         success: function(response) {
    //             console.log(response);
    //         },
    //         error: function(response) {
    //             console.log(response);
    //             alert("error while reading?");
    //         },
    //     });
    // });
});


function display_risks() {
    $("#risk_list").show();
    let tbody = $("#risk_tbody").empty();
    for (let risk of Object.values(risks)) {
        let row = $(`<tr data-id="${risk.CustomNum}"></tr>`).appendTo("#risk_tbody");
        let data = {};
        try {
            data = JSON.parse(risk.Data.replaceAll("'", "\""));
        }
        catch {
            $(row).append(`<td colspan=5>Parse failed? "${risk.Data}"</td>`);
            continue;
        }

        let cats = data.categories.join("<br>");
        $(row).append(`<td>${data.severity}</td>`)
        .append(`<td>${cats}</td>`)
        .append(`<td>Date: ${risk.SourceDate}<br>Source: ${data.source}</td>`)
        .append(`<td>${data.description}</td>`)
        .append(`<td>Type: ${data.followup_type}<br>Timing: ${data.followup_timing}</td>`);
    }
}


function retrieve_risks() {
    $("#risk_loading").show();
    $("#risk_list").hide();
    $.ajax({
        url: "PrintForm.asp?PrintFormNum=142&Action=View&CustomerAllNum=12145",
        type: "GET",
        success: function(response) {
            $("#risk_loading").hide();
            let html = $.parseHTML(response);
            risks = object_from_neworg_content("1508", html);
            for (let risk_id in risks) {
                if (risks[risk_id].Type != "Risk") {
                    delete risks[risk_id];
                }
            }
            risks_loaded = true;
            display_risks();
        },
        error: function(response) {
            console.log(response);
            alert("Error while retrieving risks?");
        },
    });
}


function object_from_neworg_content(content_id, context=null) {
    let results = {};
    let headers = [];
    let row_index = 0;
    $(context || "body").find(`span.content${content_id} table.display${content_id} tr`).each(function() {
        let row = [];
        $(this).find("td").each(function() {
            $(this).find("style").remove(); //gets rid of style tags that are in some question text
            row.push($(this).text());
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


function todays_date() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0
    let yyyy = today.getFullYear();
    return mm + "/" + dd + "/" + yyyy
}
// </script>