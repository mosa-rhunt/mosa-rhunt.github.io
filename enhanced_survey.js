$(document).ready(function() {
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
        $(this).closest("table.outer").prev("div.nav-container").find("p.text").empty().text(title);
    });
});