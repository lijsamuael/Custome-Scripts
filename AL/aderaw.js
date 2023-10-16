frappe.ui.form.on('Purchase Order', {

	pr_no: function(frm) {
		if (frm.doc.pr_no) {
			frm.clear_table('items');
			console.log("Test 1");
			frappe.model.with_doc('PR', frm.doc.pr_no, function() {

				let source_doc = frappe.model.get_doc('PR', frm.doc.pr_no);
				console.log("source doc", source_doc)

				$.each(source_doc.items, function(index, source_row) {

					console.log("Test 3");
					const target_row = frm.add_child('items');
					target_row.item_code = source_row.item_code;
					target_row.schedule_date = source_row.schedule_date;
					target_row.item_name = source_row.item_name;
					target_row.uom = source_row.uom;
					target_row.amount = source_row.amount;
					target_row.qty = source_row.qty;
					target_row.price_list_rate = source_row.price_list_rate;
					target_row.rate = source_row.rate;
					target_row.conversion_factor = source_row.conversion_factor;
					target_row.description = source_row.description;
					target_row.uom = source_row.stock_uom;

				});

				frm.refresh_field('items');
			});
		}
	},
});