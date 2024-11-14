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