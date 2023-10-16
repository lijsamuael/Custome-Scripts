frappe.ui.form.on('Material Request', {
	onload: function(frm) {
		frm.set_value('requested_by', frappe.user.full_name());

		if (frm.doc.workflow_state == 'draft') {
			if (!frm.doc.prepared_by) {
				frm.set_value('prepared_by', frappe.user.full_name());
				console.log("prepared by", frm.doc.prepared_by)
			}
		}
		else if (frm.doc.workflow_state == 'Checked') {
			if (!frm.doc.checked_by) {
				frm.set_value('checked_by', frappe.user.full_name());
				console.log("checked by", frm.doc.checked_by)
			}

		}
		else if (frm.doc.workflow_state == 'Approved') {
			if (!frm.doc.approved_by) {
				frm.set_value('approved_by', frappe.user.full_name());
				console.log("approved by", frm.doc.approved_by)
				console.log("apporved by", frm.doc.checked_by);
				console.log("checked by", frm.doc.checked_by);
				console.log("verified by", frm.doc.verified_by);
			}

		}
	}
});

