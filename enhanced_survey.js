$(document).ready(function() {
    if (!window.location.href.includes("FormQuestions.asp")) return; //only show in the "edit" version
    
    $("table.text").find("p.text")
    .append("<span class='NoPrint' style='color:red; display:block; margin:20px 0;'><b>IMPORTANT:</b> Please click the Save Changes button below to save your entries before closing this window. You can return to complete or edit the OSP later.</span>")
    .append("<input type='button' value='Save Changes' class='menu' onclick='SaveForm()'>");

    //change "Print" to "Print Preview"
    $("a[href*='FormQuestionsPrint']").html("<img src='Images/Printer.gif'> Print Preview");

    //save button at bottom
    $("a.menu").each(function() {
        if ($(this).text().includes("Next")) {
            $("<td></td>")
            .append($("<input type='button' class='menu' value='Save Changes' />").on("click", SaveForm))
            .insertAfter($(this).parent("td"));
        }
    });

    //replace "Page #1" with section header, so the sticky header has better info
    $(".header").each(function() {
        let title = $(this).text();
        $(this).closest("table.outer").prev("div.nav-container").find("p.text").empty().text(title).css("padding", "8px").css("font-size", "12pt");
    });

    // hide all the "pencil-man" icons/links
    $("a[target=ContactUpdate]").hide();
});


function create_inline_table(field_id, field_defs) {
    // ensure field_id begins with #
    field_id = (field_id.substring(0, 1) == "#" ? field_id : "#" + field_id);
    const tbody_id = field_id + "-tbody";
    
    // field_defs needs to be an array of objects containing the keys header and key_name
    // [ { header:"Column 1", key_name:"col1"} ]

    function td(content="") {
        return ([ "string", "number" ].includes(typeof content) ? $(`<td>${content}</td>`) : $("<td></td>").append(content));
    }

    function create_row(record=null) {
        if (!record) {
            record = {};
            for (let field of field_defs) {
                let val = "";
                if (field.type == "checkbox") {
                    val = false;
                }
                record[field.key_name] = val;
            }
        }

        let row = $("<tr></tr>").appendTo(tbody_id);
        for (let field of field_defs) {
            let input;
            if (field.type == "checkbox") {
                let is_checked = (record[field.key_name] ? "checked" : "");
                input = $(`<input type='checkbox' ${is_checked}>`).on("change keyup", store_as_json);
            }
            else {
                input = $("<input type='text' style='width:100%'>").val(record[field.key_name]).on("change keyup", store_as_json);
            }
            $(row).append(td(input));
        }

        let button = $("<button type='button' class='btn btn-sm btn-danger'><i class='fa fa-trash'></i></button>").on("click", function() {
            $(this).closest("tr").remove();
            store_as_json();
        });
        $(row).append(td(button));
        
        store_as_json();
    }

    function store_as_json() {
        let records = [];
        $(tbody_id).find("tr").each(function() {
            let cells = $(this).find("td");
            let record = {};
            let any_values = false;
            for (let i = 0; i < field_defs.length; i++) {
                let field = field_defs[i];
                let val = "";
                if (field.type == "checkbox") {
                    val = $(cells[i]).find("input[type=checkbox]").is(":checked");
                }
                else {
                    val = $(cells[i]).find("input[type=text]").val().trim();
                }
                record[field.key_name] = val;
                if (val) any_values = true;
            }
            if (any_values) records.push(record);
        });

        $(field_id).val(JSON.stringify(records));
    }


    let thead = $("<thead class='bg-warning'></thead>");
    let thead_row = $("<tr></tr>").appendTo(thead);
    for (let header of field_defs.map(x => x.header)) {
        $(thead_row).append(`<th>${header}</th>`);
    }
    $(thead_row).append("<th>Delete</th>");

    let table = $("<table class='table table-sm table-hover border'></table>").append(thead);
    let tbody = $(`<tbody id='${tbody_id.substring(1)}'></tbody>`).appendTo(table);
    let tfoot = $("<tfoot></tfoot>").appendTo(table);
    
    // tfoot row
    $("<tr></tr>")
    .append(
        $(`<td colspan=${field_defs.length}></td>`)
        .append($("<button type='button' class='btn btn-sm btn-primary'>+ Add row</button>").on("click", () => create_row()))
    )
    .appendTo(tfoot);

    // hide textbox, add UI
    $(table).appendTo($(field_id).hide().parent());

    // add existing records
    try {
        for (let record of JSON.parse($(field_id).val())) {
            create_row(record);
        }
    }
    catch {
        // failed to parse, so we kinda lose existing data if this happens
        console.log("failed to parse table data?");
    }

    create_row();
}