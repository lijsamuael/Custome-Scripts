//get the approvals of the material request
cur_frm.add_fetch('po_id', 'mr_prepared_by', 'mr_prepared_by');
cur_frm.add_fetch('po_id', 'mr_checked_by', 'mr_checked_by');
cur_frm.add_fetch('po_id', 'mr_approved_by', 'mr_approved_by');
 
//get the approvals of purchase order
 cur_frm.add_fetch('po_id', 'po_prepared_by', 'po_prepared_by');
 cur_frm.add_fetch('po_id', 'po_checked_by', 'po_checked_by');
 cur_frm.add_fetch('po_id', 'po_verified_by', 'po_verified_by');
 cur_frm.add_fetch('po_id', 'po_approved_by', 'po_approved_by');


frappe.ui.form.on('Cheque Payment Request', {
	before_submit: function(frm) {
		if (frm.doc.cheque_no == null) {
			frappe.throw(__("Mandatory field: cheque_no"))
		}
	}
}); 


frappe.ui.form.on('Cheque Payment Request', {
	onload: function(frm) {
		console.log("Test ");

		if (frm.doc.workflow_state == 'draft') {
			if (!frm.doc.cpr_prepared_by) {
				frm.set_value('cpr_prepared_by', frappe.user.full_name());
				console.log("cpr prepared by", frm.doc.cpr_prepared_by);
			}
		}
		else if (frm.doc.workflow_state == 'Checked') {
			if (!frm.doc.cpr_checked_by) {
				frm.set_value('cpr_checked_by', frappe.user.full_name());
				console.log("cpr checked by", frm.doc.cpr_checked_by);
			}
		}
		else if (frm.doc.workflow_state == 'Verified') {
			if (!frm.doc.cpr_verified_by) {
				frm.set_value('cpr_verified_by', frappe.user.full_name());
				console.log("cpr verified by", frm.doc.cpr_verified_by);
			}
		}
		else if (frm.doc.workflow_state == 'Approved') {
			if (!frm.doc.cpr_approved_by) {
				frm.set_value('cpr_approved_by', frappe.user.full_name());
				console.log("cpr approved by", frm.doc.cpr_approved_by);
			}
		}
	}
});

