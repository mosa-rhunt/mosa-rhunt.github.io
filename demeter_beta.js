const { createApp } = Vue;

let vue = createApp({
    data() {
        return {
            client: {},

            this_year: "2022", 
            last_year: "2021",

            selected_tab: "client",
            selected_question_group: "all",

            osps: {
                Farm: {
                    name: "Farm",
                    form_id: 112,
                    formused_id: 123456,
                    is_loading: false,
                    questions: {
                        "123": {
                            question_text: "Hey, gimme the deets.",
                            sort_order: 1,
                            is_blank: false,
                            is_changed: false,
                            response_type: "Text Box",
                            responses: {
                                "2022": ["Ya probably"],
                                "2021": ["Nah"],
                            }
                        },
                        "456": {
                            question_text: "No change here.",
                            sort_order: 2,
                            is_blank: false,
                            is_changed: true,
                            response_type: "Select List",
                            choices: ["Yessir", "No way", "Eh probably"],
                            responses: {
                                "2022": ["Yessir"],
                                "2021": ["No way", "Blah"],
                            }
                        },
                        "789": {
                            question_text: "Blank q yo.",
                            sort_order: 3,
                            is_blank: true,
                            is_changed: false,
                            response_type: "Text Box",
                            required: "Admin",
                            responses: {
                                "2022": [""],
                                "2021": [""],
                            }
                        },
                        "135": {
                            section_name: "SECTION 123.456",
                            section_description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad error aspernatur ratione expedita necessitatibus laborum, laudantium aperiam voluptas quae officiis.",
                            question_text: "Blank and different.",
                            sort_order: 4,
                            is_blank: true,
                            is_changed: true,
                            response_type: "Text Box",
                            required: "Yes",
                            responses: {
                                "2022": [""],
                                "2021": ["something"],
                            }
                        },
                        "246": {
                            question_text: "Dynamic Table my dude",
                            sort_order: 5,
                            is_blank: false,
                            is_changed: true,
                            response_type: "Dynamic Table",
                            responses: {
                                "2022": ["extra comment"],
                                "2021": ["extra comment"],
                            },
                            dynamic_table: {
                                headers: ["First", "Next", "Another", "And then some"],
                                "2022": [
                                    ["asdf", "qwert", "123", "4567"],
                                    ["123", "456", "asdf", "qwert"],
                                ],
                                "2021": [
                                    ["asdf", "qwert", "123", "456"],
                                    ["123", "456", "asdf", "qwert"],
                                ]
                            }
                        },
                    }
                },
                /*
                Livestock: {
                    name: "Livestock",
                    loading: false,
                },
                Greenhouse: {
                    name: "Greenhouse",
                    loading: true,
                }
            */
            },
        };
    },

    computed: {
        sel_osp() { 
            return this.osps[this.selected_tab]; 
        },

        sel_questions() { 
            let questions = [];
            if (this.selected_question_group == "changes") {
                questions = Object.values(this.sel_osp.questions).filter(q => q.is_changed);
            }
            else if (this.selected_question_group == "blanks") {
                questions = Object.values(this.sel_osp.questions).filter(q => q.is_blank);
            }
            else {
                questions = Object.values(this.sel_osp.questions);
            }
            return questions.sort((a, b) => a.sort_order - b.sort_order);;
        },

        sub_items() {
            if (this.selected_tab == "client") {
                return [{
                    text: "Info",
                    group: "info",
                }];
            }
            else if (this.selected_tab in this.osps) {
                let num_changes = Object.values(this.sel_osp.questions).filter(q => q.is_changed).length;
                let num_blanks = Object.values(this.sel_osp.questions).filter(q => q.is_blank).length;
                return [{
                    text: num_changes + " Changes",
                    group: "changes",
                }, {
                    text: num_blanks + " Blanks",
                    group: "blanks",
                }, {
                    text: "All Questions",
                    group: "all",
                }];
            }
            else {
                return [];
            }
        },

    },

    methods: {
        retrieve_osps() {

            $.ajax({
                url: `PrintForm.asp?PrintFormNum=${osp_defs[form_id].printform_id}&Action=View&CustomerAllNum=${client_id}`,
                type: "GET",
                success: function(response) {
                    parse_and_populate(form_id, response);
                },
                error: function(response) {
                    console.log(response);
                },
            });
        },
    },
})
.component("osp-response", {
    props: ["question", "year"],
    template: `
         <span v-if="question.choices" class="tags has-text-weight-bold">
            <span v-for="choice in question.choices" :class="'tag ' + (question.responses[year].includes(choice) ? 'is-info' : 'is-dark')">
                {{ choice }}
            </span>
            <!-- weirdo selections that aren't in the question choices anymore -->
            <span v-for="choice in question.responses[year]">
                <span v-if="!question.choices.includes(choice)" class="tag is-info">
                    {{ choice }}
                </span>
            </span>
        </span>
        <span v-else-if="question.dynamic_table" class="box p-0">
            <table class="table is-fullwidth">
                <tr class="has-background-info">
                    <th v-for="header in question.dynamic_table.headers">{{ header }}</th>
                </tr>
                <tr v-for="row in question.dynamic_table[year]">
                    <td v-for="cell in row">{{ cell }}</td>
                </tr>
            </table>
            <span>
                <span class="has-text-weight-bold">Additional Comments: </span>
                {{ question.responses[year][0] }}
            </span>
        </span>
        <span v-else>
            {{ question.responses[year][0] }}
        </span>
    `,
})
.mount("#vue_app");


const osp_defs = { //form_id: {}
    "112": { 
        "form_name": "Farm", 
        "printform_id": "131", 
        "q_content_id": "1454",
        "r_content_id": "1455",
        "d_content_ids": ["1456", "1457", "1458", "1459"],
    },
    "101": { 
        "form_name": "Apiculture", 
        "printform_id": "132", 
        "q_content_id": "1461",
        "r_content_id": "1494",
        "d_content_ids": [],
    },
    "105": { 
        "form_name": "Greenhouse", 
        "printform_id": "133", 
        "q_content_id": "1502",
        "r_content_id": "1462",
        "d_content_ids": ["1463", "1464"],
    },
    "114": { 
        "form_name": "Handler", 
        "printform_id": "134", 
        "q_content_id": "1495",
        "r_content_id": "1465",
        "d_content_ids": ["1466"],
    },
    "113": { 
        "form_name": "Livestock", 
        "printform_id": "135", 
        "q_content_id": "1496",
        "r_content_id": "1467",
        "d_content_ids": ["1468", "1469", "1470", "1471", "1472", "1473", "1474", "1475"],
    },
    "106": { 
        "form_name": "Maple Syrup", 
        "printform_id": "136", 
        "q_content_id": "1497",
        "r_content_id": "1476",
        "d_content_ids": ["1477", "1478", "1479", "1480"],
    },
    "102": { 
        "form_name": "Mushroom", 
        "printform_id": "137", 
        "q_content_id": "1498",
        "r_content_id": "1481",
        "d_content_ids": ["1482", "1483", "1484", "1485"],
    },
    "115": { 
        "form_name": "Retail", 
        "printform_id": "138", 
        "q_content_id": "1499",
        "r_content_id": "1486",
        "d_content_ids": ["1487", "1488"],
    },
    "104": { 
        "form_name": "Sprout", 
        "printform_id": "139", 
        "q_content_id": "1500",
        "r_content_id": "1489",
        "d_content_ids": ["1490"],
    },
    "107": { 
        "form_name": "Wild Crop", 
        "printform_id": "140", 
        "q_content_id": "1501",
        "r_content_id": "1491",
        "d_content_ids": ["1492", "1493"],
    },
};


//setup
$(document).ready(function() {
    //client query
    let client_def = array_from_content("1504", "body", false);
    for (let i = 0; i < client_def[0].length; i++) {
        let header = client_def[0][i];
        let value = client_def[1][i];
        vue.client[header] = value;
    }
    console.log(vue.client);

    //query on this page for which OSPs have responses
    for (let formused of array_from_content("1505")) {
        let form_id = formused[0];
        let formused_id = formused[1];
        let form_name = osp_defs[form_id].form_name;
        

        if (form_name == "Farm") continue;
        

        vue.osps[form_name] = {
            name: form_name,
            form_id: form_id,
            formused_id: formused_id,
            is_loading: null,
            questions: {},
            responses: {},
        };
    }
    console.log(vue.osps);


    let containers = [$("#vue_app"), $("#externals")]; //, $("#code")];
    $("body").empty().append(containers);
    $("head style").remove();
    $("head link").remove();

    $("").appendTo("head");
    $("html").css("background-color", "#0a0a0a");

    document.title = "Demeter - #" + vue.client.id;
    


    //get client/basic info
    // $.ajax({
    //     url: base_url + "client_info",
    //     headers: api_headers("json"),
    //     type: "GET",
    //     dataType: "json",
    //     data: {"client_id": client_id},
    //     success: function(response) {
    //         vue.client = response.client;
    //     },
    //     error: function(response) {
    //         if (response.responseText.length < 100) {
    //             vue.warn(response.responseText);
    //         }
    //         else {
    //             vue.warn("Initial call failed. See console.");
    //             console.log(response.responseText);
    //         }
    //     }
    // });

});


function array_from_content(content_id, context=null, skip_header_row=true) {
    let results = [];
    let skip = (skip_header_row ? "tbody": ""); //only used for dynamic tables
    $(context || "body").find(`span.content${content_id} table.display${content_id} ${skip} tr`).each(function() {
        let row = [];
        $(this).find("td").each(function() {
            $(this).find("style").remove(); //gets rid of <style> tags that are in the question text
            row.push($(this).text());
        });
        results.push(row);
    });
    return results;
}
