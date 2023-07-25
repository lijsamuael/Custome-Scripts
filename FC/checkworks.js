

frappe.ui.form.on('Cheque Payment Approval', {
    cheque_payment_request: function(frm) {
        // Check if the "cheque_payment_request" field has a value
        if (frm.doc.cheque_payment_request) {
            console.log("Test 1");
            frappe.model.with_doc("Cheque Payment Request", frm.doc.cheque_payment_request, function() {
                // Get the loaded document
                console.log("Test 2");
                var linked_doc = frappe.model.get_doc("Cheque Payment Request", frm.doc.cheque_payment_request);

                // Check if the linked document's status is submitted
                console.log("doc status", linked_doc.docstatus);
                if (linked_doc.docstatus === 1) {
                    console.log("Test 3");
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

                    frm.refresh_field('purpose_for_payment');
                    frm.refresh_field('requested_by');
                    frm.refresh_field('site');
                    frm.refresh_field('date');
                    frm.refresh_field('company');
                    frm.refresh_field('payment_reason_type');
                    frm.refresh_field('please_effect_payment');
                    frm.refresh_field('account');
                    frm.refresh_field('amount_in_word_birr');
                    frm.refresh_field('amount_in_figure');
                    frm.refresh_field('net_amount');
                    frm.refresh_field('project');
                    frm.refresh_field('cheque_status');
                    frm.refresh_field('bank');
                    frm.refresh_field('department');
                    frm.refresh_field('prepared_by');
                } else if (linked_doc.docstatus === 0) {
                    console.log("Test 4");
                    
                    cur_frm.add_fetch("cheque_payment_request", "purpose_for_payment", "");
                    cur_frm.add_fetch("cheque_payment_request", "requested_by", "");
                    cur_frm.add_fetch("cheque_payment_request", "site", "");
                    cur_frm.add_fetch("cheque_payment_request", "date", "");
                    cur_frm.add_fetch("cheque_payment_request", "company", "");
                    cur_frm.add_fetch("cheque_payment_request", "payment_reason_type", "");
                    cur_frm.add_fetch("cheque_payment_request", "please_effect_payment", "");
                    cur_frm.add_fetch("cheque_payment_request", "account", "account");
                    cur_frm.add_fetch("cheque_payment_request", "amount_in_word_birr", "");
                    cur_frm.add_fetch("cheque_payment_request", "amount_in_figure", "");
                    cur_frm.add_fetch("cheque_payment_request", "net_amount", "");
                    cur_frm.add_fetch("cheque_payment_request", "project", "");
                    cur_frm.add_fetch("cheque_payment_request", "cheque_status", "");
                    cur_frm.add_fetch("cheque_payment_request", "bank", "");
                    cur_frm.add_fetch("cheque_payment_request", "department", "");
                    cur_frm.add_fetch("cheque_payment_request", "prepared_by", "");

                    frm.refresh_field('purpose_for_payment');
                    frm.refresh_field('requested_by');
                    frm.refresh_field('site');
                    frm.refresh_field('date');
                    frm.refresh_field('company');
                    frm.refresh_field('payment_reason_type');
                    frm.refresh_field('please_effect_payment');
                    frm.refresh_field('account');
                    frm.refresh_field('amount_in_word_birr');
                    frm.refresh_field('amount_in_figure');
                    frm.refresh_field('net_amount');
                    frm.refresh_field('project');
                    frm.refresh_field('cheque_status');
                    frm.refresh_field('bank');
                    frm.refresh_field('department');
                    frm.refresh_field('prepared_by');
                }
            });
        }
    }
});
