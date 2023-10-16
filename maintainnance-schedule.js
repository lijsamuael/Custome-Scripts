frappe.ui.form.on('Employee External Work History', {
    from_date: function(frm, cdt, cdn) {
        calculateYearDifference(frm, cdt, cdn);
    },
    to_date: function(frm, cdt, cdn) {
        calculateYearDifference(frm, cdt, cdn);
    }
});

function calculateYearDifference(frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var from_date = child.from_date;
    var to_date = child.to_date;

    if (from_date && to_date) {
        var fromDateParts = from_date.split('-');
        var toDateParts = to_date.split('-');

        var fromYear = parseInt(fromDateParts[2]);
        var toYear = parseInt(toDateParts[2]);

        var yearDifference = toYear - fromYear;
		console.log("year differnce", yearDifference)

        frappe.model.set_value(cdt, cdn, 'total_experience', yearDifference);
    }
}