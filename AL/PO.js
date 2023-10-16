//get the material request approvals
cur_frm.add_fetch('pr_no', 'mr_approved_by', 'mr_approved_by');
cur_frm.add_fetch('pr_no', 'mr_checked_by', 'mr_checked_by');
cur_frm.add_fetch('pr_no', 'mr_prepared_by', 'mr_prepared_by');

//get the material request item
cur_frm.add_fetch('pr_no', 'mr_no', 'mr_item');

//get the purchase requistion approvals
cur_frm.add_fetch('pr_no', 'pr_approved_by', 'pr_approved_by');
cur_frm.add_fetch('pr_no', 'pr_checked_by', 'pr_checked_by');
cur_frm.add_fetch('pr_no', 'pr_prepared_by', 'pr_prepared_by');

cur_frm.add_fetch('pr_no', 'workflow_state', 'pr_state');

frappe.ui.form.on('Purchase Order', {

	pr_no: function(frm) {
		if (frm.doc.pr_no) {
			frm.clear_table('items');
			console.log("Test 1");
			frappe.model.with_doc('Purchase Requisition', frm.doc.pr_no, function() {
				console.log("Test 2")
				let source_doc = frappe.model.get_doc('Purchase Requisition', frm.doc.pr_no);
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
				console.log("\npr prepared by", frm.doc.pr_prepared_by);
				console.log("pr approved by", frm.doc.pr_approved_by);
				console.log("mr item", frm.doc.mr_item);
			});
		}
	},
});

frappe.ui.form.on('Purchase Order', {
	onload: function(frm) {

		if (frm.doc.__islocal) {
			frm.set_df_property('po_prepared_by', 'reqd', true);  // Make field mandatory
			console.log("test1");
		}
		else if (frm.doc.workflow_state === 'draft') {
			frm.set_df_property('po_checked_by', 'reqd', true);   // Make field mandatory
			console.log("test2");
			frm.refresh_field("po_checked_by");
		}

		else if (frm.doc.workflow_state === 'Checked') {
			frm.set_df_property('po_verified_by', 'reqd', true);  // Make field mandatory
			console.log("test3");
			frm.refresh_field("po_verified_by");

		}

		else if (frm.doc.workflow_state === 'Verified') {
			frm.set_df_property('po_approved_by', 'reqd', true);  // Make field mandatory
			console.log("test3");
			frm.refresh_field("po_approved_by");

		}

	}
});


frappe.ui.form.on('Purchase Order', {
	before_save: function(frm){
		console.log("Test 1111");
		if(frm.doc.pr_state !== "Approved"){
			console.log("Test 2222");
			frappe.msgprint(__("You can not use unapproved purchase requisition."));
           	frappe.validated = false; 
		}
	}
})


