cur_frm.add_fetch('mr_no', 'approved_by', 'mr_approved_by');
cur_frm.add_fetch('mr_no', 'checked_by', 'mr_checked_by');
cur_frm.add_fetch('mr_no', 'prepared_by', 'mr_prepared_by');


frappe.ui.form.on('Purchase Order', {

	mr_no: function(frm) {
		if (frm.doc.mr_no) {
			frm.clear_table('items');
			console.log("Test 1");
			frappe.model.with_doc('Material Request', frm.doc.mr_no, function() {

				let source_doc = frappe.model.get_doc('Material Request', frm.doc.mr_no);
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


frappe.ui.form.on('Purchase Order', {
	onload: function(frm) {
		console.log("Test ");

		if (frm.doc.workflow_state == 'draft') {
			if (!frm.doc.po_prepared_by) {
				frm.set_value('po_prepared_by', frappe.user.full_name());
				console.log("po prepared by", frm.doc.po_prepared_by);
			}
		}
		else if (frm.doc.workflow_state == 'Checked') {
			if (!frm.doc.po_checked_by) {
				frm.set_value('po_checked_by', frappe.user.full_name());
				console.log("po checked by", frm.doc.po_checked_by);
			}
		}
		else if (frm.doc.workflow_state == 'Verified') {
			if (!frm.doc.po_verified_by) {
				frm.set_value('po_verified_by', frappe.user.full_name());
				console.log("po verified by", frm.doc.po_verified_by);
			}
		}
		else if (frm.doc.workflow_state == 'Approved') {
			if (!frm.doc.po_approved_by) {
				frm.set_value('po_approved_by', frappe.user.full_name());
				console.log("po approved by", frm.doc.po_approved_by);
			}
		}
	}
});

