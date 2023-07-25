frappe.ui.form.on('Employee Monthly Timesheet', {
    onload: function(frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: ['full_name']
            },
            callback: function(response) {
                var user = response.message;
                if (user) {
                    frm.set_value('employee_name', user.full_name);
                }
            }
        });
    }
});










frappe.ui.form.on('Employee Monthly Timesheet', {
    onload: function(frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: ['full_name']
            },
            callback: function(response) {
                var user = response.message;
                if (user) {
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args: {
                            doctype: 'Employee',
                            filters: { employee_name: user.full_name },
                            fieldname: ['department', 'position']
                        },
                        callback: function(response) {
                            var employee = response.message;
                            if (employee) {
                                frm.set_value('employee_name', user.full_name);
                                frm.set_value('department', employee.department);
                                frm.set_value('position', employee.position);
                            }
                        }
                    });
                }
            }
        });
    }
});





frappe.ui.form.on('Employee Monthly Timesheet', {
    onload: function(frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: ['full_name', 'middle_name', 'last_name']
            },
            callback: function(response) {
				console.log("first name", user.full_name)
				console.log("middle name", user.middle_name)
				console.log("last name", user.last_namt)
                var user = response.message;
                if (user) {
					console.log("full name", employeeName)
                    var employeeName = user.full_name + ' ' + user.middle_name + ' ' + user.last_name;
										console.log("full name", employeeName)
                    frm.set_value('employee_name', employeeName);
					refresh_field('employee_name');
                }
            }
        });
    }
});


frappe.ui.form.on('Employee Monthly Timesheet', {
    onload: function(frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: ['full_name', 'mobile_no']
            },
            callback: function(response) {
                var user = response.message;
				consolog.log(user.mobile_no)
                if (user) {
                    frm.set_value('employee_name', user.full_name);
                }
            }
        });
    }
});




frappe.ui.form.on('Employee Monthly Timesheet', {
    onload: function(frm) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'User',
                filters: { name: frappe.session.user },
                fieldname: ['full_name', 'middle_name']
            },
            callback: function(response) {
                var user = response.message;
                if (user) {
                    frm.set_value('employee_name', user.full_name);

                    // Call the second code block after setting the full_name value
                    runSecondCodeBlock(frm);
                }
            }
        });
    }
});

// function runSecondCodeBlock(frm) {
//     frappe.ui.form.on('Employee Monthly Timesheet', {
//         department: function(frm) {
//             // Ensure that department field is not empty
//                 frappe.call({
//                     method: 'frappe.client.get_value',
//                     args: {
//                         doctype: 'Employee',
//                         filters: { 'employee_name': frm.doc.employee_name },
//                         fieldname: ['department', 'designation']
//                     },
//                     callback: function(response) {
// 						console.log("employee name" , frm.doc.employee_name)
//                         var employee = response.message;
// 						console.log("response" , resonse.)
//                         if (employee) {
//                             frm.set_value('department', employee.department);
//                             frm.set_value('designation', employee.designation);
//                         }
//                     }
//                 });
//         }
//     });
// }








frappe.ui.form.on('Stock Entry', {
    grn: function (frm) {
        if (frm.doc.grn) {
            frm.clear_table('items');
            frappe.model.with_doc('Purchase Receipt', frm.doc.grn, function () {

                let source_doc = frappe.model.get_doc('Purchase Receipt', frm.doc.grn);

                $.each(source_doc.items, function (index, source_row) {

                    const target_row = frm.add_child('items');	
                    target_row.item_category = source_row.item_group;
                    target_row.item_code= source_row.item_code; 
                    target_row.qty= source_row.qty;
                    target_row.description = source_row.description;
                    target_row.uom = source_row.uom;
                    target_row.basic_rate = source_row.rate;
                    target_row.basic_amount = source_row.amount;
                });

                frm.refresh_field('items');
            });
        }
    },
});

frappe.ui.form.on("Employee Monthly Timesheet", {
    refresh: function(frm) {

            for (let i = 0; i < 30; i++) {
                frm.add_child('time_sheets');
            }
            // Refresh the form to display the added rows
            frm.refresh_field("time_sheets");
    }
});
