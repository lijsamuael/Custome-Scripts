frappe.ui.form.on('Payment Request', {
	contract_no: function(frm) {
		if (frm.doc.contract_no) {
			frm.clear_table('cft');
			console.log("Test 1");
			frappe.model.with_doc('Contract Form', frm.doc.contract_no, function() {
				console.log("Test 2")
				let source_doc = frappe.model.get_doc('Contract Form', frm.doc.contract_no);
				console.log("source doc", source_doc)
				var totalAmount = 0;
				$.each(source_doc.cft, function(index, source_row) {

					console.log("Test 3");
					const target_row = frm.add_child('cft');
					target_row.for_which_task = source_row.for_which_task;
					target_row.quantity = source_row.quantity;
					target_row.rate = source_row.rate;
					target_row.amount = source_row.amount;
					//addding the total amount
					totalAmount += target_row.amount;
				});
				frm.refresh_field('cft');
				frm.set_value("grand_total", totalAmount);
			});
		}
	},
});

frappe.ui.form.on('Payment Request', {
	amount: function(frm) {
		set_value("grand_total")
	},
});