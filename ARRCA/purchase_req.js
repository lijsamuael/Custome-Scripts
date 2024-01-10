cur_frm.add_fetch('plate_no', 'chasis_no', 'chasis_no');
cur_frm.add_fetch('plate_no', 'motor_number', 'engine_no');
cur_frm.add_fetch('plate_no', 'equipment_type', 'equipent_type');
cur_frm.add_fetch('plate_no', 'model', 'model_no');

frappe.ui.form.on('MRI', {
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
                    let warehouseEntries = {};

                    response.message.forEach((entry) => {
                        if (!warehouseEntries[entry.warehouse]) {
                            warehouseEntries[entry.warehouse] = entry;
                        } else {
                            if (new Date(entry.posting_time) > new Date(warehouseEntries[entry.warehouse].posting_time)) {
                                warehouseEntries[entry.warehouse] = entry;
                            }
                        }
                    });

                    let total = 0;
                    Object.values(warehouseEntries).forEach((entry) => {
                        total += entry.qty_after_transaction;
                    });

                    frappe.model.set_value(cdt, cdn, "stock_quantity", total);
                    frm.refresh();
                }
            }
        });
    }
});

frappe.ui.form.on('Purchase Requisition', {
    store_request_no: function(frm, cdt, cdn) {
        if (frm.doc.store_request_no) {
            frm.clear_table('table_12');

            frappe.model.with_doc('Material Request', frm.doc.store_request_no, function() {
                let source_doc = frappe.model.get_doc('Material Request', frm.doc.store_request_no);
                let stockEntries = {};

                // Fetch Stock Ledger Entry for all items in Material Request
                frappe.call({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: 'Stock Ledger Entry',
                        filters: {
                            item_code: ['in', source_doc.items.map(item => item.item_code)],
                        },
                        fields: ['*']
                    },
                    callback: function(response) {
                        if (response.message) {
                            response.message.forEach((entry) => {
                                if (!stockEntries[entry.item_code]) {
                                    stockEntries[entry.item_code] = entry;
                                } else {
                                    if (new Date(entry.posting_time) > new Date(stockEntries[entry.item_code].posting_time)) {
                                        stockEntries[entry.item_code] = entry;
                                    }
                                }
                            });

                            // Update child table rows with data
                            source_doc.items.forEach((source_row) => {
                                const target_row = frm.add_child('table_12');
                                target_row.item_code = source_row.item_code;
                                target_row.description = source_row.description;
                                target_row.uom = source_row.uom;

                                if (stockEntries[source_row.item_code]) {
                                    target_row.stock_quantity = stockEntries[source_row.item_code].qty_after_transaction;
                                }

                                target_row.qty = source_row.qty;
                                target_row.rate = source_row.rate;
                                target_row.amount = source_row.amount;
                            });

                            frm.refresh_field('table_12');
                        }
                    }
                });
            });
        }
    },
    maintainance_schedule: function(frm, cdt, cdn) {
        if (frm.doc.maintainance_schedule) {
            frm.clear_table('table_12');

            frappe.model.with_doc('Maintenance Schedule', frm.doc.maintainance_schedule, function() {
                let source_doc = frappe.model.get_doc('Maintenance Schedule', frm.doc.maintainance_schedule);
                let stockEntries = {};

                // Fetch Stock Ledger Entry for all items in Material Request
                frappe.call({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: 'Stock Ledger Entry',
                        filters: {
                            item_code: ['in', source_doc.items.map(item => item.item_code)],
                        },
                        fields: ['*']
                    },
                    callback: function(response) {
                        if (response.message) {
                            response.message.forEach((entry) => {
                                if (!stockEntries[entry.item_code]) {
                                    stockEntries[entry.item_code] = entry;
                                } else {
                                    if (new Date(entry.posting_time) > new Date(stockEntries[entry.item_code].posting_time)) {
                                        stockEntries[entry.item_code] = entry;
                                    }
                                }
                            });

                            // Update child table rows with data
                            source_doc.items.forEach((source_row) => {
                                if(parseFloat(source_row.stock_quantity) < parseFloat(source_row.qty)){
                                    console.log(`${source_row.stock_quantity}, ${source_row.qty}`)
                                    const target_row = frm.add_child('table_12');
                                    target_row.item_code = source_row.item_code;
                                    target_row.description = source_row.description;
                                    target_row.uom = source_row.uom;
                                    if (stockEntries[source_row.item_code]) {
                                        target_row.stock_quantity = stockEntries[source_row.item_code].qty_after_transaction;
                                    }
                                    target_row.qty = source_row.qty;
                                    target_row.rate = source_row.rate;
                                    target_row.amount = source_row.amount;
                                }else{}
                               
                            });

                            frm.refresh_field('table_12');
                        }
                    }
                });
            });
        }
    },

    budget_year_plan: function(frm, cdt, cdn) {
        if (frm.doc.budget_year_plan) {
            frm.clear_table('table_12');

            frappe.model.with_doc('Budget Year Procurement Plan', frm.doc.budget_year_plan, function() {
                let source_doc = frappe.model.get_doc('Budget Year Procurement Plan', frm.doc. budget_year_plan);
               
                            source_doc.procurement_table.forEach((source_row) => {   
                                    const target_row = frm.add_child('table_12');
                                    target_row.item_code = source_row.type_of_material;
                                    target_row.qty =source_row.amount;
                                    target_row.uom = source_row.uom;
                                    target_row.item_name=source_row.type_of_material
                                    target_row.description=source_row.type_of_material
                             
                            })
                            frm.refresh_field('table_12');
                        }
              
            );
        }
    },
});

frappe.ui.form.on("Purchase Requisition", {
    purchase_requisition_date_ec: function(frm, cdt, cdn) {
        if (frm.doc.purchase_requisition_date_ec) {
            var finalgc = convertDateTOGC(frm.doc.purchase_requisition_date_ec.toString());
            frm.doc.date = finalgc;
            refresh_field("date");
        }
    }
});

// Assuming these fetches are required, adjust as needed
cur_frm.add_fetch("item_code", "item_name", "item_name");
cur_frm.add_fetch("item_code", "description", "description");
cur_frm.add_fetch("item_code", "stock_uom", "uom");
