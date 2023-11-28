frappe.ui.form.on('work done', {
    technician_name: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];

        if(frm.doc.serial_or_plate_no){
            var plat_no = frm.doc.serial_or_plate_no;
            var technician_name = child.technician_name;
            var date_ec = frm.doc.date_ec;
            console.log("jldkl", plat_no, "technician_name", technician_name)
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: 'Stock Entry',
                    filters: {
                        "plate_no": plat_no,
                        "transfer_no": technician_name,
                        "posting_date_ec": date_ec
                    },
                    fields: ['name']
                },
                callback: function(response) {
                    if (response.message.length > 0) {
                        console.log("response", response.message)
                        frappe.call({
                            method: "frappe.client.get_list",
                            args: {
                                doctype: 'Stock Entry Detail',
                                filters: {
                                    "parent": response.message[0].name,
                                },
                                fields: ['*']
                            },
                            callback: function(resp) {
                                if (resp.message) {
                                    var source = resp.message[0];
                                    console.log("response for the detail", resp.message)
                                    var rowTable = frm.add_child("replaced_part_and_labor_cost_summary");
                                    console.log("row table", rowTable);
                        
                                    rowTable.part_no = source.item_code;
                                    rowTable.description_parts_or_lubricants_or_materials_or_issued = source.item_name;
                                    rowTable.uom = source.uom;
                                    rowTable.qty = source.qty;
                                    rowTable.cost_summary_type = source.rate;
                                    rowTable.cost_summary_birr = source.amount;
                        
                                    frm.refresh_field("replaced_part_and_labor_cost_summary");
                                }
                            }
                            
                        });
  
                    } else{
                        frappe.show_alert(`There is no Stock Entry(ሞዴል 22) which has plate no: ${plat_no}, technician name: ${technician_name} and date: ${date_ec}`)
                    }
                }
            });
        }
    }
});


frappe.ui.form.on('work done', {
    date_ec: function(frm) {
        if(frm.doc.date_ec){
            var date = convertDateTOGC(frm.doc.date_ec.toString());
            frm.set_value("date", date);
            frm.refresh_field("date")
        }
    }
});


frappe.ui.form.on('Replaced parts', {
    cost_summary_type: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.cost_summary_type & row.qty){
            row.cost_summary_birr = row.cost_summary_type * row.qty
            frm.refresh_field("replaced_part_and_labor_cost_summary")
        }
    },
    qty: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.cost_summary_type & row.qty){
            row.cost_summary_birr = row.cost_summary_type * row.qty
            frm.refresh_field("replaced_part_and_labor_cost_summary")
        }
    }
});

