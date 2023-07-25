//get the approvals of the material request
cur_frm.add_fetch('cheque_payment_request', 'mr_prepared_by', 'mr_prepared_by');
cur_frm.add_fetch('cheque_payment_request', 'mr_checked_by', 'mr_checked_by');
cur_frm.add_fetch('cheque_payment_request', 'mr_approved_by', 'mr_approved_by');

//get the approvals of purchase order
cur_frm.add_fetch('cheque_payment_request', 'po_prepared_by', 'po_prepared_by');
cur_frm.add_fetch('cheque_payment_request', 'po_checked_by', 'po_checked_by');
cur_frm.add_fetch('cheque_payment_request', 'po_verified_by', 'po_verified_by');
cur_frm.add_fetch('cheque_payment_request', 'po_approved_by', 'po_approved_by');

//get the approvals of Cheque Payment Request
cur_frm.add_fetch('cheque_payment_request', 'cpr_prepared_by', 'cpr_prepared_by');
cur_frm.add_fetch('cheque_payment_request', 'cpr_checked_by', 'cpr_checked_by');
cur_frm.add_fetch('cheque_payment_request', 'cpr_verified_by', 'cpr_verified_by');
cur_frm.add_fetch('cheque_payment_request', 'cpr_approved_by', 'cpr_approved_by');


frappe.ui.form.on('Cheque Payment Approval', {
	cheque_payment_request: function(frm) {

		console.log("\n mr");
		console.log('prepare', frm.doc.mr_prepared_by);
		console.log('check', frm.doc.mr_checked_by);
		console.log('approved', frm.doc.mr_approved_by);

		console.log("\n po");
		console.log('prepare', frm.doc.po_prepared_by);
		console.log('check', frm.doc.po_checked_by);
		console.log('verified', frm.doc.po_verified_by);
		console.log('approved', frm.doc.po_approved_by);

		console.log("\n cpr");
		console.log('prepare', frm.doc.cpr_prepared_by);
		console.log('check', frm.doc.cpr_checked_by);
		console.log('verified', frm.doc.cpr_verified_by);
		console.log('approved', frm.doc.cpr_approved_by);

	}
})


frappe.ui.form.on('Cheque Payment Approval', {
	cheque_payment_request: function(frm) {

		// Check if the "cheque_payment_request" field has a value
		if (frm.doc.cheque_payment_request) {

			frappe.model.with_doc("Cheque Payment Request", frm.doc.cheque_payment_request, function() {

				// Get the loaded document
				var linked_doc = frappe.model.get_doc("Cheque Payment Request", frm.doc.cheque_payment_request);

				// Check if the linked document's status is submitted
				console.log("doc status", linked_doc.docstatus);
				if (linked_doc.docstatus === 1) {

					// Fetch the required fields from the linked document
					cur_frm.add_fetch("cheque_payment_request", "purpose_for_payment", "purpose_for_payment");
					cur_frm.add_fetch("cheque_payment_request", "requested_by", "requested_by");
					cur_frm.add_fetch("cheque_payment_request", "site", "site");
					cur_frm.add_fetch("cheque_payment_request", "date", "date");
					cur_frm.add_fetch("cheque_payment_request", "company", "company");
					cur_frm.add_fetch("cheque_payment_request", "payment_reason_type", "payment_reason_type");
					cur_frm.add_fetch("cheque_payment_request", "please_effect_payment", "please_effect_payment");
					cur_frm.add_fetch("cheque_payment_request", "account", "account");
					cur_frm.add_fetch("cheque_payment_request", "amount_in_word_birr", "amount_in_word_birr");
					cur_frm.add_fetch("cheque_payment_request", "amount_in_figure", "amount_in_figure");
					cur_frm.add_fetch("cheque_payment_request", "net_amount", "net_amount");
					cur_frm.add_fetch("cheque_payment_request", "project", "project");
					cur_frm.add_fetch("cheque_payment_request", "cheque_status", "cheque_status");
					cur_frm.add_fetch("cheque_payment_request", "bank", "bank");
					cur_frm.add_fetch("cheque_payment_request", "department", "department");
					cur_frm.add_fetch("cheque_payment_request", "prepared_by", "prepared_by");
				} else {
					// Reset the fetched fields if the linked document's status is not submitted
					cur_frm.set_value("purpose_for_payment", "");
					cur_frm.set_value("requested_by", "");
					cur_frm.set_value("site", "");
					cur_frm.set_value("date", "");
					cur_frm.set_value("company", "");
					cur_frm.set_value("payment_reason_type", "");
					cur_frm.set_value("please_effect_payment", "");
					cur_frm.set_value("account", "");
					cur_frm.set_value("amount_in_word_birr", "");
					cur_frm.set_value("amount_in_figure", "");
					cur_frm.set_value("net_amount", "");
					cur_frm.set_value("project", "");
					cur_frm.set_value("cheque_status", "");
					cur_frm.set_value("bank", "");
					cur_frm.set_value("department", "");
					cur_frm.set_value("prepared_by", "");
				}
			});
		}
	}
});



//see the status of the cpa document
console.log("Cpa workflow state", cur_frm.workflow_state);

frappe.ui.form.on('Cheque Payment Approval', {
	onload: function(frm) {
		console.log("Test ");

		if (frm.doc.workflow_state == 'draft') {
			if (!frm.doc.cpr_prepared_by) {
				frm.set_value('cpa_prepared_by', frappe.user.full_name());
				console.log("cpa prepared by", frm.doc.cpa_prepared_by);
			}
		}
		else if (frm.doc.workflow_state == 'Checked') {
			if (!frm.doc.cpa_checked_by) {
				frm.set_value('cpa_checked_by', frappe.user.full_name());
				console.log("cpa checked by", frm.doc.cpa_checked_by);
			}
		}
		else if (frm.doc.workflow_state == 'Verified') {
			if (!frm.doc.cpa_verified_by) {
				frm.set_value('cpa_verified_by', frappe.user.full_name());
				console.log("cpa verified by", frm.doc.cpa_verified_by);
			}
		}
		else if (frm.doc.workflow_state == 'Approved') {
			if (!frm.doc.cpa_approved_by) {
				frm.set_value('cpa_approved_by', frappe.user.full_name());
				console.log("cpa approved by", frm.doc.cpa_approved_by);
			}
		}
	}
});

