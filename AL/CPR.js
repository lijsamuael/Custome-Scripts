//get the approvals of the material request
cur_frm.add_fetch('po_id', 'mr_prepared_by', 'mr_prepared_by');
cur_frm.add_fetch('po_id', 'mr_checked_by', 'mr_checked_by');
cur_frm.add_fetch('po_id', 'mr_approved_by', 'mr_approved_by');
//get the material request item
cur_frm.add_fetch('po_id', 'mr_no', 'mr_item');

//get the purchase requistion approvals
cur_frm.add_fetch('po_id', 'pr_approved_by', 'pr_approved_by');
cur_frm.add_fetch('po_id', 'pr_checked_by', 'pr_checked_by');
cur_frm.add_fetch('po_id', 'pr_prepared_by', 'pr_prepared_by');
//get the purchase requisition item
cur_frm.add_fetch('po_id', 'mr_item', 'mr_item');
cur_frm.add_fetch('po_id', 'pr_no', 'pr_item');


//get the approvals of purchase order
cur_frm.add_fetch('po_id', 'po_prepared_by', 'po_prepared_by');
cur_frm.add_fetch('po_id', 'po_checked_by', 'po_checked_by');
cur_frm.add_fetch('po_id', 'po_verified_by', 'po_verified_by');
cur_frm.add_fetch('po_id', 'po_approved_by', 'po_approved_by');

cur_frm.add_fetch('po_id', 'workflow_state', 'po_state');


frappe.ui.form.on('Cheque Payment Request', {
	before_submit: function(frm) {
		if (frm.doc.cheque_no == null) {
			frappe.throw(__("Mandatory field: cheque_no"))
		}
	}
});


frappe.ui.form.on('Cheque Payment Request', {
	onload: function(frm) {

		if (frm.doc.__islocal) {
			frm.set_df_property('cpr_prepared_by', 'reqd', true);  // Make field mandatory
			console.log("test1");
			frm.refresh_field('cpr_prepared_by');
			frm.refresh_field('cpr_checked_by');
			frm.refresh_field('cpr_checked_by');
		}
		else if (frm.doc.workflow_state === 'draft') {
			frm.set_df_property('cpr_checked_by', 'reqd', true);   // Make field mandatory
			console.log("test2");
			frm.refresh_field("cpr_checked_by");
		}

		else if (frm.doc.workflow_state === 'Checked') {
			frm.set_df_property('cpr_approved_by', 'reqd', true);  // Make field mandatory
			console.log("test3");
			frm.refresh_field("cpr_approved_by");

		}

	}
});



frappe.ui.form.on('Cheque Payment Request', {
	before_save: function(frm){
		console.log("Test 1111");
		console.log("value", frm.doc.payment_reason_type);
		if(frm.doc.po_state !== "Approved" && frm.doc.payment_reason_type === "Purchase" ){
			console.log("Test 2222");
			frappe.msgprint(__("You can not use unapproved purchase order."));
           	frappe.validated = false; 
		}
	}
})

