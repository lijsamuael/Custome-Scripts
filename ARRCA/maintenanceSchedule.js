frappe.ui.form.on('Maintenance Schedule Item', {
    item_code: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Stock Ledger Entry',
                filters: {
                    item_code: child.item_code,
                },
                fields: ['*']
            },
            callback: function(response) {
                if (response.message) {
                    console.log("response", response.message)
                    let warehouseEntries = {};

                    response.message.forEach((entry) => {
                        if (!warehouseEntries[entry.warehouse]) {
                            warehouseEntries[entry.warehouse] = entry;
                        } else {
                            if (
                                new Date(entry.posting_time) >
                                new Date(warehouseEntries[entry.warehouse].posting_time)
                            ) {
                                warehouseEntries[entry.warehouse] = entry;
                            }
                        }
                    });

                    let total = 0;

                    Object.values(warehouseEntries).forEach((entry) => {
                        total += entry.qty_after_transaction;
                    });

                    frappe.model.set_value(cdt, cdn, "stock_quantity", total);
                    frappe.model.set_value(cdt, cdn, "stock_uom", response.message[0].stock_uom);
                    frm.refresh();
                }
            }
        });
    }
});
