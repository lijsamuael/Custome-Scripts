frappe.ui.form.on('PR', {
	sr_no: function(frm) {
		if (frm.doc.sr_no) {
			frm.clear_table('purchase_requisition_item');

			frappe.model.with_doc('Material Request', frm.doc.sr_no, function() {
				let source_doc = frappe.model.get_doc('Material Request', frm.doc.sr_no);

				$.each(source_doc.items, function(index, source_row) {
					console.log("doc status", source_row.docstatus)
					if (source_row.docstatus === 1) { // Check if the document is submitted (docstatus = 1)
						const target_row = frm.add_child('purchase_requisition_item');
						target_row.item_code = source_row.item_code;
						target_row.item_category = source_row.item_sub_category;
						target_row.description = source_row.description;
						target_row.uom = source_row.uom;
						target_row.qty = source_row.qty;
					}
				});

				frm.refresh_field('purchase_requisition_item');
				frm.refresh_field('item_category');
			});
		}
	},
});
