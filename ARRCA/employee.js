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
			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var year_diff = end_date.getFullYear() - start_date.getFullYear();
			var month_diff = end_date.getMonth() - start_date.getMonth();
			var day_diff = end_date.getDate() - start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;

        frappe.model.set_value(cdt, cdn, 'total_experience', year_diff_decimal.toFixed(2));
    }
}





frappe.ui.form.on('Employee Internal Work History', {
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
			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var year_diff = end_date.getFullYear() - start_date.getFullYear();
			var month_diff = end_date.getMonth() - start_date.getMonth();
			var day_diff = end_date.getDate() - start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;

        frappe.model.set_value(cdt, cdn, 'total_experience', year_diff_decimal.toFixed(2));
    }
}

