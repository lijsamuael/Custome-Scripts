frappe.ui.form.on('Leave Application', {
    employee: function(frm) {
		console.log("Test 1")
        // Set the "Approver" field to "omen"
        frm.set_value('approver', 'omen');
    }
});
