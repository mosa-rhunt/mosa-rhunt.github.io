<script>
const osp_defs = {
    "112": { 
        "printformnum": "131", 
        "name": "Farm OSP", 
        "q_content_id": "1454",
        "r_content_id": "1455",
        "d_content_ids": ["1456", "1457", "1458", "1459"],
    },
    "101": { 
        "printformnum": "132", 
        "name": "Apiculture OSP", 
        "q_content_id": "1461",
        "r_content_id": "1494",
        "d_content_ids": [],
    },
    "105": { 
        "printformnum": "133", 
        "name": "Greenhouse OSP", 
        "q_content_id": "1502",
        "r_content_id": "1462",
        "d_content_ids": ["1463", "1464"],
    },
    "114": { 
        "printformnum": "134", 
        "name": "Handler OSP", 
        "q_content_id": "1495",
        "r_content_id": "1465",
        "d_content_ids": ["1466"],
    },
    "113": { 
        "printformnum": "135", 
        "name": "Livestock OSP", 
        "q_content_id": "1496",
        "r_content_id": "1467",
        "d_content_ids": ["1468", "1469", "1470", "1471", "1472", "1473", "1474", "1475"],
    },
    "106": { 
        "printformnum": "136", 
        "name": "Maple Syrup OSP", 
        "q_content_id": "1497",
        "r_content_id": "1476",
        "d_content_ids": ["1477", "1478", "1479", "1480"],
    },
    "102": { 
        "printformnum": "137", 
        "name": "Mushroom OSP", 
        "q_content_id": "1498",
        "r_content_id": "1481",
        "d_content_ids": ["1482", "1483", "1484", "1485"],
    },
    "115": { 
        "printformnum": "138", 
        "name": "Retail OSP", 
        "q_content_id": "1499",
        "r_content_id": "1486",
        "d_content_ids": ["1487", "1488"],
    },
    "104": { 
        "printformnum": "139", 
        "name": "Sprout OSP", 
        "q_content_id": "1500",
        "r_content_id": "1489",
        "d_content_ids": ["1490"],
    },
    "107": { 
        "printformnum": "140", 
        "name": "Wild Crop OSP", 
        "q_content_id": "1501",
        "r_content_id": "1491",
        "d_content_ids": ["1492", "1493"],
    },
};

//https://web5.neworg.com/MC2_MOSA/FormQuestions.asp?FormNum=112&FormUsedNum=108870

$(document).ready(function() {
    let container = $("<div class='container has-text-centered'></div>").append("<h1 class='title'>OSP Validation</h1>");

    //query on this page for which OSPs have responses
    for (let formused of array_from_content("1447")) {
        let formnum = formused[0];
        let formusednum = formused[1];
    }




    //take control of styling
    $("head").find("style").remove();
    $("head").find("link").remove();
    $("head").append(
    "<style>" +
    // ".container > div { padding: 10px; }" +
    "</style>")
    .append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css'>");   

    //take control of DOM
    $("body").empty().append(container);
    document.title = "Validate OSPs";

});

//find content in NewOrg table and return a 2d array
function array_from_content(content_id) {
    let results = [];
    $(`span.content${content_id} table.display${content_id} tbody tr`).each(function() {
        let row = [];
        $(this).find("td").each(function() {
            row.push($(this).text());
        })
        results.push(row);
    });
    return results;
}

function get_osp_data(form_id, q_content_id, r_content_id, d_content_ids=[]) {
    //call "api"
    $.ajax({
        url: `PrintForm.asp?PrintFormNum=${form_id}&Action=View&CustomerAllNum=${client_id}`,
        type: "GET",
        success: function(response) {
            let html = $($.parseHTML(response));
            let rows = $(html).contents().find("table.display1455 tbody tr");
            console.log(html);
            console.log($(rows).length);
            // console.log(html);
        },
        error: function(response) {
        },
    });

    return {};
}

function populate(form_id, q_content_id, r_content_id, d_content_ids=[]) {

</script>
