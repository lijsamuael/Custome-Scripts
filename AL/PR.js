cur_frm.add_fetch('mr_no', 'approved_by', 'mr_approved_by');
cur_frm.add_fetch('mr_no', 'checked_by', 'mr_checked_by');
cur_frm.add_fetch('mr_no', 'prepared_by', 'mr_prepared_by');
cur_frm.add_fetch('mr_no', 'workflow_state', 'mr_state');


frappe.ui.form.on('Purchase Requisition', {
	mr_no: function(frm) {
		console.log("Test 1");
		if (frm.doc.mr_no) {
			console.log("Test 2");
			frm.clear_table('items');
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


frappe.ui.form.on('Purchase Requisition', {
	onload: function(frm) {

		if (frm.doc.__islocal) {
			frm.set_df_property('pr_prepared_by', 'reqd', true);  // Make field mandatory
			console.log("test1");
		}
		else if (frm.doc.workflow_state === 'draft') {
			frm.set_df_property('pr_checked_by', 'reqd', true);   // Make field mandatory
			console.log("test2");
			frm.refresh_field("pr_checked_by");
		}

		else if (frm.doc.workflow_state === 'Checked') {
			frm.set_df_property('pr_approved_by', 'reqd', true);  // Make field mandatory
			console.log("test3");
			frm.refresh_field("pr_approved_by");

		}

	}
});




frappe.ui.form.on('Purchase Requisition', {
	before_save: function(frm){
		console.log("Test 1111");
		if(frm.doc.mr_state !== "Approved"){
			console.log("Test 2222");
			frappe.msgprint(__("You can not use unapproved material request."));
           	frappe.validated = false; 
		}
	}
})


