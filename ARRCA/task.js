//calcula the overhead cost
cur_frm.add_fetch('id_mac', 'mc_number', 'qty');

frappe.ui.form.on("Task", {
    indirectcost: function (frm, cdt, cdn) {
        frm.set_value("indirect_cost_total", frm.doc.indirectcost * frm.doc.activity_total_cost / 100)
        frm.refresh_field("indirect_cost_total")
    },
    profitmargin: function (frm, cdt, cdn) {
        var indirect_cost = frm.doc.indirect_cost_total + frm.doc.activity_total_cost
        frm.set_value("total_with_profit_margin", indirect_cost * frm.doc.profitmargin / 100)
        frm.refresh_field("total_with_profit_margin")
    },

});




//calculate the total small equipment cost
frappe.ui.form.on("Task", {
    equipment_total_cost: function (frm, cdt, cdn) {
        get_equipment_total_cost(frm, cdt, cdn)
    },
    small_tools_in_percentage: function (frm, cdt, cdn) {
        get_equipment_total_cost(frm, cdt, cdn)
    },
    productivity: function (frm, cdt, cdn) {
        get_equipment_total_cost(frm, cdt, cdn)
    }
});

function get_equipment_total_cost(frm, cdt, cdn) {
    if (frm.doc.equipment_total_cost && frm.doc.small_tools_in_percentage) {
        frm.set_value("small_tools_cost", frm.doc.equipment_total_cost * frm.doc.small_tools_in_percentage)
        frm.refresh_field("small_tools_cost")

        if (frm.doc.productivity) {
            frm.set_value("equipment_unit_cost", (frm.doc.equipment_total_cost + frm.doc.small_tools_cost) / frm.doc.productivity)
            frm.refresh_field("equipment_unit_cost")
        }
    }
}


//calculate the budget cost and unit for each machinery
frappe.ui.form.on("Machinery Detail2", {
    qty: function (frm, cdt, cdn) {
        console.log("i am there qty")
        calculate_brides(frm, cdt, cdn)
    },
    uf: function (frm, cdt, cdn) {
        console.log("i am there uf")
        calculate_brides(frm, cdt, cdn)
    },
    efficency: function (frm, cdt, cdn) {
        console.log("i am there eff")
        calculate_brides(frm, cdt, cdn)
    }
});

frappe.ui.form.on("Manpower Detail", {
    labor_no: function (frm, cdt, cdn) {
        calculate_brides_mp(frm, cdt, cdn)
    },
    uf: function (frm, cdt, cdn) {
        calculate_brides_mp(frm, cdt, cdn)
    },
    efficency: function (frm, cdt, cdn) {
        calculate_brides_mp(frm, cdt, cdn)
    }
});

frappe.ui.form.on("Material DetailARRCA", {
    qaty: function (frm, cdt, cdn) {
        calculate_brides_mtOne(frm, cdt, cdn)
        calculate_brides_mtTwo(frm, cdt, cdn)
    },
    uf: function (frm, cdt, cdn) {
        calculate_brides_mtOne(frm, cdt, cdn)
        calculate_brides_mtTwo(frm, cdt, cdn)
    },
    unit_price: function (frm, cdt, cdn) {
        calculate_brides_mtOne(frm, cdt, cdn)
        calculate_brides_mtTwo(frm, cdt, cdn)
    }
});

function calculate_brides(frm, cdt, cdn) {
    console.log("hee in the function above")
    if (frm.doc.quantity && frm.doc.productivity && frm.doc.no_of_crew) {
        console.log("here in the function below")
        var row = locals[cdt][cdn];
        var placeholder = frm.doc.quantity * frm.doc.no_of_crew / frm.doc.productivity;

        if (row.qty && row.uf && row.efficency) {
            console.log("here in the function below below")
            var bu = frm.doc.no_of_crew * frm.doc.working_hour_per_day * row.qty * row.efficency * row.uf
            var bc = bu * row.rental_rate / frm.doc.productivity;
            console.log("bu", bu)
            row.budget_unit = bu * frm.doc.duration_in_days;
            row.budget_cost = row.budget_unit * row.rental_rate
            row.budgeted_unit_per_time = bu;

            frm.refresh_field("machinery");
        }
    }
}

function calculate_brides_mp(frm, cdt, cdn) {
    if (frm.doc.quantity && frm.doc.productivity && frm.doc.no_of_crew) {
        var row = locals[cdt][cdn];
        var placeholder = frm.doc.quantity * frm.doc.no_of_crew / frm.doc.productivity;

        if (row.labor_no && row.uf && row.efficency) {
            var bu = frm.doc.no_of_crew * frm.doc.working_hour_per_day * row.labor_no * row.efficency * row.uf
            console.log("bu", bu)
            var bc = bu * row.li_permanent / frm.doc.productivity;
            row.budgeted_unit_per_time = bu;
            row.budget_unit = bu * frm.doc.duration_in_days;
            row.budget_cost = row.budget_unit * row.hourly_cost
            frm.refresh_field("manpower1");
        }
    }
}

function calculate_brides_mtOne(frm, cdt, cdn) {
    if (frm.doc.quantity) {
        var row = locals[cdt][cdn];
        console.log("row", row);
        if (row.qaty && row.unit_price) {
            console.log("we arae here", row.qaty, row.unit_price)
            var bu = row.qaty * frm.doc.no_of_crew * frm.doc.working_hour_per_day
            var bc = bu;
            row.total_cost = row.qaty * row.unit_price
            row.budgeted_unit_per_time = bu;
            row.budget_unit = bu * frm.doc.duration_in_days;
            row.budget_cost = row.budget_unit * row.unit_price;
            frm.refresh_field("material1");
        }
    }
}

function calculate_brides_mtTwo(frm, cdt, cdn) {
    if (frm.doc.quantity) {
        var row = locals[cdt][cdn];
        console.log("row", row);
        if (row.qaty && row.unit_price) {
            console.log("we arae here", row.qaty, row.unit_price)
            var bu = row.qaty * frm.doc.no_of_crew * frm.doc.working_hour_per_day
            var bc = bu;
            row.total_cost = row.qaty * row.unit_price
            row.budgeted_unit_per_time = bu;
            row.budget_unit = bu * frm.doc.duration_in_days;
            row.budget_cost = row.budget_unit * row.unit_price;
            frm.refresh_field("material_2");
        }
    }
}






//calculate duration

frappe.ui.form.on("Task", {
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});

frappe.ui.form.on("Task", {
    no_of_crew: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});


frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * (d.no_of_crew | 1))));
    }
});

frappe.ui.form.on("Task", {
    duration: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
    }
});

frappe.ui.form.on("Task", {
    working_hour_per_day: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
    }
});//calculate end date

frappe.ui.form.on("Task", {
    exp_start_date: function (frm) {
        if (frm.doc.exp_start_date) {
            var start_date = new Date(frm.doc.exp_start_date);
            var duration = Math.ceil(flt(frm.doc.duration || 0));

            // Calculate end date
            var end_date = new Date(start_date.getTime() + (duration * 24 * 60 * 60 * 1000)); // duration in milliseconds

            // Format the dates
            frm.set_value("exp_end_date", formatDateString(end_date));
            frm.refresh_field("exp_end_date");
        }
    },
    duration: function (frm) {
        if (frm.doc.exp_start_date && frm.doc.duration) {
            var start_date = new Date(frm.doc.exp_start_date);
            var duration = Math.ceil(flt(frm.doc.duration));

            // Calculate end date
            var end_date = new Date(start_date.getTime() + (duration * 24 * 60 * 60 * 1000)); // duration in milliseconds

            // Format the dates
            frm.set_value("exp_end_date", formatDateString(end_date));
            frm.refresh_field("exp_end_date");
        }
    }
});

function formatDateString(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return day + "-" + month + "-" + year;
}
















// Machinery Filter
frappe.ui.form.on("Task", "project", function (frm) {
    frm.set_query("id_mac", "machinery", function () {
        return {
            "filters": {
                "project": frm.doc.project,
            }
        };
    });
});
// Manpower Filter
frappe.ui.form.on("Task", "project", function (frm) {
    frm.set_query("id_map", "manpower1", function () {
        return {
            "filters": {
                "project": frm.doc.project,
            }
        };
    });
});
// Material Filter
frappe.ui.form.on("Task", "project", function (frm) {
    frm.set_query("id_mat", "material1", function () {
        return {
            "filters": {
                "project": frm.doc.project,
            }
        };
    });
});


// Machinary
cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
cur_frm.add_fetch('id_mac', 'make_model', 'make_model');
cur_frm.add_fetch('id_mac', 'standard_fuel_consumption', 'standard_fuel_consumption');
cur_frm.add_fetch('id_mac', 'fuel_cost_per_hour', 'fuel_cost_per_hour');
cur_frm.add_fetch('id_mac', 'uf', 'uf');
cur_frm.add_fetch('id_mac', 'efficiency', 'efficency');
cur_frm.add_fetch('id_mac', 'type', 'type');

// Manpower
cur_frm.add_fetch('id_map', 'mp_number', 'labor_no');
cur_frm.add_fetch('id_map', 'uf', 'uf');
cur_frm.add_fetch('id_map', 'efficency', 'efficency');


cur_frm.add_fetch('id_map', 'hourly_cost', 'hourly_cost');
cur_frm.add_fetch('id_map', 'total_hourly_cost', 'total_hourly_cost');
cur_frm.add_fetch('id_map', 'job_title', 'job_title');
cur_frm.add_fetch('id_map', 'li_permanent', 'li_permanent');

//Material
cur_frm.add_fetch('id_mat', 'item', 'item1');
cur_frm.add_fetch('id_mat', 'uom', 'uom');
cur_frm.add_fetch('id_mat', 'quantity', 'qaty');
cur_frm.add_fetch('id_mat', 'uf', 'uf');
cur_frm.add_fetch('id_mat', 'machinery_qty', 'machinery_qty');
cur_frm.add_fetch('id_mat', 'unit_price', 'unit_price');
cur_frm.add_fetch('id_mat', 'loading_unloading_cost', 'loading_unloading_cost');
cur_frm.add_fetch('id_mat', 'transportation_cost', 'transportation_cost');

// Fetch Task from Task Master
cur_frm.add_fetch('task_name', 'name1', 'subject');
cur_frm.add_fetch('task_name', 'type', 'type');
cur_frm.add_fetch('task_name', 'productivity', 'productivity');
cur_frm.add_fetch('task_name', 'project', 'project');

//Fetch Consultant from Project
cur_frm.add_fetch('project', 'consultant', 'consultant');

// Populate Machinery, Manpower and Material From Task Master DocType
// TASK
// MACHINERY
frappe.ui.form.on('Task', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('machinery');
            frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                $.each(source_doc.machinery, function (index, source_row) {
                    const target_row = frm.add_child('machinery');
                    target_row.type = source_row.type;
                    target_row.uf = source_row.uf;
                    target_row.rental_rate = source_row.rental_rate;
                    frm.refresh_field('machinery');
                });
            });
        }
    },
});
frappe.ui.form.on("Task", {
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'task_amount', (d.quantity * d.activity_unit_rate));

    }
});

frappe.ui.form.on("Task", {
    activity_unit_rate: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'task_amount', (d.quantity * d.activity_unit_rate));

    }
});


frappe.ui.form.on("Task", {
    duration: function (frm) {
        if(frm.doc.duration && frm.doc.project_total_duration){
            console.log("abe 1")
            frm.set_value('task_physical_weightage', ((frm.doc.duration / frm.doc.project_total_duration)));
            frm.refresh_field("task_physical_weightage");
        }
    },
    project_total_duration: function (frm) {
        if(frm.doc.duration && frm.doc.project_total_duration){
            console.log("abe 2")
            frm.set_value('task_physical_weightage', ((frm.doc.duration / frm.doc.project_total_duration)));
            frm.refresh_field("task_physical_weightage");
        }
    }
});

frappe.ui.form.on("Task", {
    task_amount: function (frm) {
        if(frm.doc.task_amount && frm.doc.project_total_amount){
            frm.set_value('task_financial_weightage', ((frm.doc.task_amount / frm.doc.project_total_amount)));
            frm.refresh_field("task_financial_weightage");
        }
    },
    project_total_amount: function (frm) {
        if(frm.doc.task_amount && frm.doc.project_total_amount){
            frm.set_value('task_financial_weightage', ((frm.doc.task_amount / frm.doc.project_total_amount)));
            frm.refresh_field("task_financial_weightage");
        }
    },
    percent_of_finance: function (frm) {
        if(frm.doc.percent_of_finance && frm.doc.task_financial_weightage){
            frm.set_value('weighted_avarage', ((frm.doc.percent_of_finance * frm.doc.task_financial_weightage)));
            frm.refresh_field("weighted_avarage");
        }
    },
    task_financial_weightage: function (frm) {
        if(frm.doc.percent_of_finance && frm.doc.task_financial_weightage){
            frm.set_value('weighted_avarage', ((frm.doc.percent_of_finance * frm.doc.task_financial_weightage)));
            frm.refresh_field("weighted_avarage");
        }
    }
});




// TASK 1
// MANPOWER 1
frappe.ui.form.on('Task', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('manpower1');
            frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                $.each(source_doc.manpower, function (index, source_row) {
                    const target_row = frm.add_child('manpower1');
                    target_row.job_title = source_row.job_title;
                    target_row.qty = source_row.qty;
                    target_row.li_permanent = source_row.li_permanent;
                    target_row.hourly_cost = source_row.hourly_cost;
                    frm.refresh_field('manpower1');
                });
            });
        }
    },
});

// TASK 1
// MATERIAL 1
frappe.ui.form.on('Task', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('material1');
            frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                $.each(source_doc.material, function (index, source_row) {
                    const target_row = frm.add_child('material1');
                    target_row.item = source_row.item;
                    target_row.uom = source_row.uom;
                    target_row.qty = source_row.qty;
                    target_row.unit_price = source_row.unit_price;
                    // target_row.total_cost = source_row.total_cost;
                    frm.refresh_field('material1');
                });
            });
        }
    },
});

/* REFERENCE
frappe.ui.form.on('Target DocType', {
    link_to_source: function (frm) {
        if (frm.doc.link_to_source) {
            frm.clear_table('target_table');
            frappe.model.with_doc('Source DocType', frm.doc.link_to_source, function () {
                let source_doc = frappe.model.get_doc('Source DocType', frm.doc.link_to_source);
                $.each(source_doc.source_table, function (index, source_row) {
                    frm.add_child('target_table').column_name = source_row.column_name; // this table has only one column. You might want to fill more columns.
                    frm.refresh_field('target_table');
                });
            });
        }
    },
});
*/
// END OF POPULATING CHILD TABLE



// MACHINERY RELATED SCRIPTS
frappe.ui.form.on("Machinery Detail2", {
    qty: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

        set_total_amt_mac(frm);
    }
});

frappe.ui.form.on("Machinery Detail2", {
    uf: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

        set_total_amt_mac(frm);
    }
});

frappe.ui.form.on("Machinery Detail2", {
    efficency: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

        set_total_amt_mac(frm);
    }
});

frappe.ui.form.on("Machinery Detail2", {
    rental_rate: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
        set_total_amt_mac(frm);

    }
});// TOTAL CALCULATIONS FOR QUANTITY AND TOTAL HOURLY COST OF MACHINERY
// Set total quantity of machineryplan on save of Activity Type

// Set total amount of machineryplan on save of Activity Type
frappe.ui.form.on("Task", "validate", function (frm) {
    set_total_amt_mac(frm);
});

//Set total amount of machineryplan on change of amount
frappe.ui.form.on("Machinery Detail2", "total_hourly_cost", function (frm, cdt, cdn) {
    set_total_amt_mac(frm);
});

// Calculate and set total_qty_mac
var set_total_amt_mac = function (frm) {
    var total_amt_mac = 0.0;
    $.each(frm.doc.machinery, function (i, row) {
        total_amt_mac += flt(row.total_hourly_cost);
    })
    frm.set_value("equipment_total_cost", total_amt_mac);
    //frm.refresh();
}


frappe.ui.form.on("Task", {
    equipment_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity));
    }
});

frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity));
    }
});

//END OF MACHINERY RELATED TOTAL CALCULATIONS

// END OF MACHINERY RELATED SCRIPT

// Manpower

frappe.ui.form.on("Manpower Detail", {
    labor_no: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
        set_total_man(frm);
    }

});

frappe.ui.form.on("Manpower Detail", {
    uf: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
        set_total_man(frm);
    }

});

frappe.ui.form.on("Manpower Detail", {
    li_permanent: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
        set_total_man(frm);
    }

});

frappe.ui.form.on("Manpower Detail", {
    efficency: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
        set_total_man(frm);
    }

});

frappe.ui.form.on("Manpower Detail", {
    hourly_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
        set_total_man(frm);
    }

});

/*
frappe.ui.form.on("Manpower Detail", {
      uf: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                  frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 

set_total_man(frm);
     }

 });

frappe.ui.form.on("Manpower Detail", {
      hourly_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                  frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
set_total_man(frm);
     }

 });

frappe.ui.form.on("Manpower Detail", {
      efficency: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 

set_total_man(frm);
     }

 }); */
frappe.ui.form.on("Task", "validate", function (frm) {

    // var d = locals[cdt][cdn];
    // frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 



    set_total_man(frm);
});

var set_total_man = function (frm) {
    var total_man = 0.0;
    $.each(frm.doc.manpower1, function (i, row) {
        total_man += flt(row.total_hourly_cost);
    })
    frm.set_value("man_power_total_cost", total_man);
    //frm.refresh();
}

frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity));
    }
});

frappe.ui.form.on("Task", {
    man_power_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity));
    }
});



// EDN OF MATERIAL RELATED SCRIPT

// Material
frappe.ui.form.on("Material DetailARRCA", {
    qaty: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.
            qaty * d.unit_price )));

        set_total_mat(frm);
    }

});


frappe.ui.form.on("Task", {
    material_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_total_cost / d.productivity));
    }
});

frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_total_cost / d.productivity));
    }
});


frappe.ui.form.on("Task", {
    material_direct_cost1: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_direct_cost1 / d.productivity));
    }
});

frappe.ui.form.on("Task", {
    productivity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_direct_cost1 / d.productivity));
    }
});


frappe.ui.form.on("Material DetailARRCA", {
    unit_price: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price )));

        set_total_mat(frm);
    }

});



frappe.ui.form.on("Material DetailARRCA", {
    uf: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price)));

        set_total_mat(frm);
    }

});


frappe.ui.form.on("Material DetailARRCA", {
    machinery_qty: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price)));

        set_total_mat(frm);
        set_total_matout(frm);
    }

});



var set_total_mat = function (frm) {
    var total_mat = 0.0;
    $.each(frm.doc.material1, function (i, row) {
        total_mat += flt(row.total_cost);
    })
    frm.set_value("material_total_cost", total_mat);
    //frm.refresh();
}

var set_total_matout = function (frm) {
    var total_mat = 0.0;
    $.each(frm.doc.material_2, function (i, row) {
        total_mat += flt(row.total_cost);
    })
    frm.set_value("material_direct_cost1", total_mat);
    //frm.refresh();
}



frappe.ui.form.on("Task", "validate", function (frm) {
    set_total_mat(frm);
});




// CALCULATE MATERIAL FINAL COST

frappe.ui.form.on("Task", {
    loading_unloading_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];

        frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

    }
});

frappe.ui.form.on("Task", {
    transportation_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];

        frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

    }
});

frappe.ui.form.on("Task", {
    material_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];

        frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

    }
});


// END OF MATERIAL RELATED SCRIPT

// ACTIVITY TOTAL COST RELATED SCRIPT
frappe.ui.form.on("Task", "man_power_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
});

frappe.ui.form.on("Task", "equipment_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
});

frappe.ui.form.on("Task", "material_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
});
frappe.ui.form.on("Task", "man_power_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Own Force') {
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});

frappe.ui.form.on("Task", "equipment_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Own Force') {
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});

frappe.ui.form.on("Task", "material_total_cost", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Own Force') {
        frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});

frappe.ui.form.on("Task", "man_power_unit_rate_sc", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});

frappe.ui.form.on("Task", "equipment_unit_rate_sc", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});

frappe.ui.form.on("Task", "material_unit_rate_sc", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
        frm.doc.man_power_unit_rate = 0;
        //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
    }
    if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
        frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
        frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
        frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
    }
    if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
    if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
    if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
    if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
    if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
    if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
    frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
});


frappe.ui.form.on("Task", {
    activity_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tools', (d.
            activity_total_cost * d.small_tools_percentage));
    }
});

frappe.ui.form.on("Task", {
    small_tools_percentage: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tools', (d.
            activity_total_cost * d.small_tools_percentage));
    }
});

frappe.ui.form.on("Task", {
    activity_total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tool', (d.
            activity_total_cost + d.direct_cost_with_small_tools));
    }
});

frappe.ui.form.on("Task", {
    direct_cost_with_small_tools: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tool', (d.
            activity_total_cost + d.direct_cost_with_small_tools));
    }
});


// INDIRECT COST TOTAL COST RELATED SCRIPT
frappe.ui.form.on("Task", "direct_cost_with_small_tools", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.direct_cost_with_small_tool * d.indirectcost) / 100);
});

frappe.ui.form.on("Task", "indirectcost", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.direct_cost_with_small_tool * d.indirectcost) / 100);
});

// TOTAL COST WITH INDIRECT COST
frappe.ui.form.on("Task", "direct_cost_with_small_tool", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.direct_cost_with_small_tool + d.indirect_cost_total);
});

frappe.ui.form.on("Task", "indirect_cost_total", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.direct_cost_with_small_tool + d.indirect_cost_total);
});


// TOTAL WITH PROFIT MARGIN
frappe.ui.form.on("Task", "activity_total_cost", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.total_cost_with_indirect_cost * d.profitmargin) / 100);
});

frappe.ui.form.on("Task", "profitmargin", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.total_cost_with_indirect_cost * d.profitmargin) / 100);
});

// TOTAL WITH PROFIT MARGIN
frappe.ui.form.on("Task", "total_cost_with_indirect_cost", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
});

frappe.ui.form.on("Task", "total_with_profit_margin", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
});


frappe.ui.form.on("Task", "activity_unit_rate_collective", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
});

cur_frm.add_fetch('item', 'quantity', 'quantity');
cur_frm.add_fetch('item', 'direct_cost_after_conversion', 'activity_unit_rate');
cur_frm.add_fetch('item', 'unit', 'uom');

// Total Cost
frappe.ui.form.on("Quotation Items", {
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
        set_total_cost(frm);
    }
});

frappe.ui.form.on("Quotation Items", {
    activity_unit_rate: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
        set_total_cost(frm);
    }
});


frappe.ui.form.on("Task", "validate", function (frm) {
    set_total_cost(frm);
});

//Set total cost of quotation items on change of total cost
frappe.ui.form.on("Quotation Items", "total_cost", function (frm, cdt, cdn) {
    set_total_cost(frm);
});


// Calculate total quantity
var set_total_cost = function (frm) {
    var total_cost = 0.0;
    $.each(frm.doc.task_list, function (i, row) {
        total_cost += flt(row.total_cost);
    })
    frm.set_value("activity_unit_rate_collective", total_cost);
    //frm.refresh();
}

// Other UOM Conversion
frappe.ui.form.on("Task", "qty", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate);
});

frappe.ui.form.on("Task", "conversion_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate);
});

// Direct Cost After Conversion
frappe.ui.form.on("Task", "conversion_multiplier", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate);
});

frappe.ui.form.on("Task", "activity_unit_rate", function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate);
});





frappe.ui.form.on("Item", {
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
        set_total_cost(frm);
    }
});




function calculateTotal(frm, childTable, valueField, input) {
    var totalAmount = 0;

    if (!frm || !frm.doc || !frm.doc[childTable]) {
        console.error("Invalid form or child table data.");
        return NaN;
    }

    frm.doc[childTable].forEach((row) => {
        if (typeof row[input] === 'number') {
            totalAmount += row[input];
        } else if (typeof row[input] === 'string' && !isNaN(parseFloat(row[input]))) {
            totalAmount += parseFloat(row[input]);
        } else {
            console.error("Invalid input value in the child table:", row[input]);
        }
    });

    frm.set_value(valueField, totalAmount);
    frm.refresh_field(valueField);

    frm.refresh_field(valueField, totalAmount);
    frm.set_value(valueField, totalAmount);


    return parseFloat(totalAmount);
}




frappe.ui.form.on("Task", {
    onload: function (frm, cdt, cdn) {
        if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
            physicalWastage(frm);
            financialWastage(frm);
        }
    },
    project_total_duration: function (frm, cdt, cdn) {
        if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
            physicalWastage(frm);
        }
    },
    duration_in_days: function (frm, cdt, cdn) {
        if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
            physicalWastage(frm);
        }
    },
    task_amount: function (frm, cdt, cdn) {
        if (frm.doc.task_amount && frm.doc.project_total_amount) {
            financialWastage(frm);
        }
    },
    project_total_amount: function (frm, cdt, cdn) {
        if (frm.doc.task_amount && frm.doc.project_total_amount) {
            financialWastage(frm);
        }
    }
});

function physicalWastage(frm) {//calculate the total small equipment cost
    frappe.ui.form.on("Task", {
        equipment_total_cost: function (frm, cdt, cdn) {
            get_equipment_total_cost(frm, cdt, cdn)
        },
        small_tools_in_percentage: function (frm, cdt, cdn) {
            get_equipment_total_cost(frm, cdt, cdn)
        },
        productivity: function (frm, cdt, cdn) {
            get_equipment_total_cost(frm, cdt, cdn)
        }
    });

    function get_equipment_total_cost(frm, cdt, cdn) {
        if (frm.doc.equipment_total_cost && frm.doc.small_tools_in_percentage) {
            frm.set_value("small_tools_cost", frm.doc.equipment_total_cost * frm.doc.small_tools_in_percentage)
            frm.refresh_field("small_tools_cost")

            if (frm.doc.productivity) {
                frm.set_value("equipment_unit_cost", (frm.doc.equipment_total_cost + frm.doc.small_tools_cost) / frm.doc.productivity)
                frm.refresh_field("equipment_unit_cost")
            }
        }
    }


    //calculate the budget cost and unit for each machinery
    frappe.ui.form.on("Machinery Detail2", {
        qty: function (frm, cdt, cdn) {
            calculate_brides(frm, cdt, cdn)
        },
        uf: function (frm, cdt, cdn) {
            calculate_brides(frm, cdt, cdn)
        },
        efficency: function (frm, cdt, cdn) {
            calculate_brides(frm, cdt, cdn)
        }
    });

    frappe.ui.form.on("Manpower Detail", {
        labor_no: function (frm, cdt, cdn) {
            calculate_brides_mp(frm, cdt, cdn)
        },
        uf: function (frm, cdt, cdn) {
            calculate_brides_mp(frm, cdt, cdn)
        },
        efficency: function (frm, cdt, cdn) {
            calculate_brides_mp(frm, cdt, cdn)
        }
    });

    frappe.ui.form.on("Material DetailARRCA", {
        labor_no: function (frm, cdt, cdn) {
            calculate_brides_mtOne(frm, cdt, cdn)
            calculate_brides_mtTwo(frm, cdt, cdn)
        },
        uf: function (frm, cdt, cdn) {
            calculate_brides_mtOne(frm, cdt, cdn)
            calculate_brides_mtTwo(frm, cdt, cdn)
        },
        efficency: function (frm, cdt, cdn) {
            calculate_brides_mtOne(frm, cdt, cdn)
            calculate_brides_mtTwo(frm, cdt, cdn)
        }
    });

    function calculate_brides(frm, cdt, cdn) {
        if (frm.doc.quantity && frm.doc.productivity && frm.doc.no_of_crew) {
            var row = locals[cdt][cdn];
            var placeholder = frm.doc.quantity * frm.doc.no_of_crew / frm.doc.productivity;

            if (row.qty && row.uf && row.efficency) {
                var bu = placeholder * row.qty * row.efficency * row.uf
                var bc = bu * row.rental_rate / frm.doc.productivity;
                row.budget_unit = bu;
                row.budget_cost = bc;
                frm.refresh_field("machinery");
            }
        }
    }

    function calculate_brides_mp(frm, cdt, cdn) {
        if (frm.doc.quantity && frm.doc.productivity && frm.doc.no_of_crew) {
            var row = locals[cdt][cdn];
            var placeholder = frm.doc.quantity * frm.doc.no_of_crew / frm.doc.productivity;

            if (row.labor_no && row.uf && row.efficency) {
                var bu = placeholder * row.labor_no * row.efficency * row.uf
                var bc = bu * row.li_permanent / frm.doc.productivity;
                row.budget_unit = bu;
                row.budget_cost = bc;
                frm.refresh_field("manpower1");
            }
        }
    }

    function calculate_brides_mtOne(frm, cdt, cdn) {
        if (frm.doc.quantity) {
            var row = locals[cdt][cdn];

            if (row.qaty && row.unit_price) {
                var bu = row.qaty / row.unit_price * frm.doc.quantity;
                var bc = bu;
                row.budget_unit = bu;
                row.budget_cost = bc;
                frm.refresh_field("material1");
            }
        }
    }

    function calculate_brides_mtTwo(frm, cdt, cdn) {
        if (frm.doc.quantity) {
            var row = locals[cdt][cdn];

            if (row.qaty && row.unit_price) {
                var bu = row.qaty / row.unit_price * frm.doc.quantity;
                var bc = bu;
                row.budget_unit = bu;
                row.budget_cost = bc;
                frm.refresh_field("material_2");
            }
        }
    }






    //calculate duration

    frappe.ui.form.on("Task", {
        quantity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * d.no_of_crew)));
        }
    });

    frappe.ui.form.on("Task", {
        no_of_crew: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * d.no_of_crew)));
        }
    });


    frappe.ui.form.on("Task", {
        productivity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'duration', (d.quantity / (d.productivity * d.no_of_crew)));
        }
    });

    frappe.ui.form.on("Task", {
        duration: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
        }
    });

    frappe.ui.form.on("Task", {
        working_hour_per_day: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'duration_in_days', (d.duration / d.working_hour_per_day));
        }
    });//calculate end date

    frappe.ui.form.on("Task", {
        exp_start_date: function (frm) {
            if (frm.doc.exp_start_date) {
                var start_date = new Date(frm.doc.exp_start_date);
                var duration = Math.ceil(flt(frm.doc.duration || 0));

                // Calculate end date
                var end_date = new Date(start_date.getTime() + (duration * 24 * 60 * 60 * 1000)); // duration in milliseconds

                // Format the dates
                frm.set_value("exp_end_date", formatDateString(end_date));
                frm.refresh_field("exp_end_date");
            }
        },
        duration: function (frm) {
            if (frm.doc.exp_start_date && frm.doc.duration) {
                var start_date = new Date(frm.doc.exp_start_date);
                var duration = Math.ceil(flt(frm.doc.duration));

                // Calculate end date
                var end_date = new Date(start_date.getTime() + (duration * 24 * 60 * 60 * 1000)); // duration in milliseconds

                // Format the dates
                frm.set_value("exp_end_date", formatDateString(end_date));
                frm.refresh_field("exp_end_date");
            }
        }
    });

    function formatDateString(date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        return day + "-" + month + "-" + year;
    }
















    // Machinery Filter
    frappe.ui.form.on("Task", "project", function (frm) {
        frm.set_query("id_mac", "machinery", function () {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });
    // Manpower Filter
    frappe.ui.form.on("Task", "project", function (frm) {
        frm.set_query("id_map", "manpower1", function () {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });
    // Material Filter
    frappe.ui.form.on("Task", "project", function (frm) {
        frm.set_query("id_mat", "material1", function () {
            return {
                "filters": {
                    "project": frm.doc.project,
                }
            };
        });
    });


    // Machinary
    cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
    cur_frm.add_fetch('id_mac', 'make_model', 'make_model');
    cur_frm.add_fetch('id_mac', 'standard_fuel_consumption', 'standard_fuel_consumption');
    cur_frm.add_fetch('id_mac', 'fuel_cost_per_hour', 'fuel_cost_per_hour');
    cur_frm.add_fetch('id_mac', 'uf', 'uf');
    cur_frm.add_fetch('id_mac', 'efficiency', 'efficency');
    cur_frm.add_fetch('id_mac', 'type', 'type');

    // Manpower
    cur_frm.add_fetch('id_map', 'mp_number', 'labor_no');
    cur_frm.add_fetch('id_map', 'uf', 'uf');
    cur_frm.add_fetch('id_map', 'efficency', 'efficency');


    cur_frm.add_fetch('id_map', 'hourly_cost', 'hourly_cost');
    cur_frm.add_fetch('id_map', 'total_hourly_cost', 'total_hourly_cost');
    cur_frm.add_fetch('id_map', 'job_title', 'job_title');
    cur_frm.add_fetch('id_map', 'li_permanent', 'li_permanent');

    //Material
    cur_frm.add_fetch('id_mat', 'item', 'item1');
    cur_frm.add_fetch('id_mat', 'uom', 'uom');
    cur_frm.add_fetch('id_mat', 'quantity', 'qaty');
    cur_frm.add_fetch('id_mat', 'uf', 'uf');
    cur_frm.add_fetch('id_mat', 'machinery_qty', 'machinery_qty');
    cur_frm.add_fetch('id_mat', 'unit_price', 'unit_price');
    cur_frm.add_fetch('id_mat', 'loading_unloading_cost', 'loading_unloading_cost');
    cur_frm.add_fetch('id_mat', 'transportation_cost', 'transportation_cost');

    // Fetch Task from Task Master
    cur_frm.add_fetch('task_name', 'name1', 'subject');
    cur_frm.add_fetch('task_name', 'type', 'type');
    cur_frm.add_fetch('task_name', 'productivity', 'productivity');
    cur_frm.add_fetch('task_name', 'project', 'project');

    //Fetch Consultant from Project
    cur_frm.add_fetch('project', 'consultant', 'consultant');

    // Populate Machinery, Manpower and Material From Task Master DocType
    // TASK
    // MACHINERY
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('machinery');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.machinery, function (index, source_row) {
                        const target_row = frm.add_child('machinery');
                        target_row.type = source_row.type;
                        target_row.uf = source_row.uf;
                        target_row.rental_rate = source_row.rental_rate;
                        frm.refresh_field('machinery');
                    });
                });
            }
        },
    });
    frappe.ui.form.on("Task", {
        quantity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'task_amount', (d.quantity * d.activity_unit_rate));

        }
    });

    frappe.ui.form.on("Task", {
        activity_unit_rate: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'task_amount', (d.quantity * d.activity_unit_rate));

        }
    });


    frappe.ui.form.on("Task", {
        duration_in_days: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'task_physical_weightage', ((d.duration_in_days / d.project_total_duration) * 100));

        }
    });

    frappe.ui.form.on("Task", {
        task_amount: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'task_financial_weightage', ((d.task_amount / d.project_total_amount) * 100));

        }
    });




    // TASK 1
    // MANPOWER 1
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('manpower1');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.manpower, function (index, source_row) {
                        const target_row = frm.add_child('manpower1');
                        target_row.job_title = source_row.job_title;
                        target_row.qty = source_row.qty;
                        target_row.li_permanent = source_row.li_permanent;
                        target_row.hourly_cost = source_row.hourly_cost;
                        frm.refresh_field('manpower1');
                    });
                });
            }
        },
    });

    // TASK 1
    // MATERIAL 1
    frappe.ui.form.on('Task', {
        task_name: function (frm) {
            if (frm.doc.task_name) {
                frm.clear_table('material_2');
                frappe.model.with_doc('Task Master', frm.doc.task_name, function () {
                    let source_doc = frappe.model.get_doc('Task Master', frm.doc.task_name);
                    $.each(source_doc.material, function (index, source_row) {
                        const target_row = frm.add_child('material_2');
                        target_row.item = source_row.item;
                        target_row.uom = source_row.uom;
                        target_row.qty = source_row.qty;
                        target_row.unit_price = source_row.unit_price;
                        // target_row.total_cost = source_row.total_cost;
                        frm.refresh_field('material1');
                    });
                });
            }
        },
    });

    /* REFERENCE
    frappe.ui.form.on('Target DocType', {
        link_to_source: function (frm) {
            if (frm.doc.link_to_source) {
                frm.clear_table('target_table');
                frappe.model.with_doc('Source DocType', frm.doc.link_to_source, function () {
                    let source_doc = frappe.model.get_doc('Source DocType', frm.doc.link_to_source);
                    $.each(source_doc.source_table, function (index, source_row) {
                        frm.add_child('target_table').column_name = source_row.column_name; // this table has only one column. You might want to fill more columns.
                        frm.refresh_field('target_table');
                    });
                });
            }
        },
    });
    */
    // END OF POPULATING CHILD TABLE



    // MACHINERY RELATED SCRIPTS
    frappe.ui.form.on("Machinery Detail2", {
        qty: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

            set_total_amt_mac(frm);
        }
    });

    frappe.ui.form.on("Machinery Detail2", {
        uf: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

            set_total_amt_mac(frm);
        }
    });

    frappe.ui.form.on("Machinery Detail2", {
        efficency: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));

            set_total_amt_mac(frm);
        }
    });

    frappe.ui.form.on("Machinery Detail2", {
        rental_rate: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
            set_total_amt_mac(frm);

        }
    });// TOTAL CALCULATIONS FOR QUANTITY AND TOTAL HOURLY COST OF MACHINERY
    // Set total quantity of machineryplan on save of Activity Type

    // Set total amount of machineryplan on save of Activity Type
    frappe.ui.form.on("Task", "validate", function (frm) {
        set_total_amt_mac(frm);
    });

    //Set total amount of machineryplan on change of amount
    frappe.ui.form.on("Machinery Detail2", "total_hourly_cost", function (frm, cdt, cdn) {
        set_total_amt_mac(frm);
    });

    // Calculate and set total_qty_mac
    var set_total_amt_mac = function (frm) {
        var total_amt_mac = 0.0;
        $.each(frm.doc.machinery, function (i, row) {
            total_amt_mac += flt(row.total_hourly_cost);
        })
        frm.set_value("equipment_total_cost", total_amt_mac);
        //frm.refresh();
    }


    frappe.ui.form.on("Task", {
        equipment_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity));
        }
    });

    frappe.ui.form.on("Task", {
        productivity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity));
        }
    });

    //END OF MACHINERY RELATED TOTAL CALCULATIONS

    // END OF MACHINERY RELATED SCRIPT

    // Manpower

    frappe.ui.form.on("Manpower Detail", {
        labor_no: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
            set_total_man(frm);
        }

    });

    frappe.ui.form.on("Manpower Detail", {
        uf: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
            set_total_man(frm);
        }

    });

    frappe.ui.form.on("Manpower Detail", {
        li_permanent: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
            set_total_man(frm);
        }

    });

    frappe.ui.form.on("Manpower Detail", {
        efficency: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
            set_total_man(frm);
        }

    });

    frappe.ui.form.on("Manpower Detail", {
        hourly_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.uf * d.labor_no * d.li_permanent * d.efficency * d.hourly_cost));
            set_total_man(frm);
        }

    });

    /*
    frappe.ui.form.on("Manpower Detail", {
          uf: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                      frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    
    set_total_man(frm);
         }
    
     });
    
    frappe.ui.form.on("Manpower Detail", {
          hourly_cost: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                      frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    set_total_man(frm);
         }
    
     });
    
    frappe.ui.form.on("Manpower Detail", {
          efficency: function(frm, cdt, cdn) {
            var d = locals[cdt][cdn];
                    frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 
    
    set_total_man(frm);
         }
    
     }); */
    frappe.ui.form.on("Task", "validate", function (frm) {

        // var d = locals[cdt][cdn];
        // frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (frm.doc.labor_index1 * d.mp_number * d.hourly_cost * d.uf * d.efficency)); 



        set_total_man(frm);
    });

    var set_total_man = function (frm) {
        var total_man = 0.0;
        $.each(frm.doc.manpower1, function (i, row) {
            total_man += flt(row.total_hourly_cost);
        })
        frm.set_value("man_power_total_cost", total_man);
        //frm.refresh();
    }

    frappe.ui.form.on("Task", {
        productivity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity));
        }
    });

    frappe.ui.form.on("Task", {
        man_power_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity));
        }
    });



    // EDN OF MATERIAL RELATED SCRIPT

    // Material
    frappe.ui.form.on("Material DetailARRCA", {
        qaty: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.
                qaty * d.unit_price )));

            set_total_mat(frm);
        }

    });


    frappe.ui.form.on("Task", {
        material_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_total_cost / d.productivity));
        }
    });

    frappe.ui.form.on("Task", {
        productivity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_total_cost / d.productivity));
        }
    });


    frappe.ui.form.on("Task", {
        material_direct_cost1: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_direct_cost1 / d.productivity));
        }
    });

    frappe.ui.form.on("Task", {
        productivity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'material_unit_rate', (d.material_direct_cost1 / d.productivity));
        }
    });


    frappe.ui.form.on("Material DetailARRCA", {
        unit_price: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price )));

            set_total_mat(frm);
        }

    });

    frappe.ui.form.on("Material DetailARRCA", {
        loading_unloading_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price )));

            set_total_mat(frm);
        }

    });

    frappe.ui.form.on("Material DetailARRCA", {
        transportation_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price)));

            set_total_mat(frm);
        }

    });

    frappe.ui.form.on("Material DetailARRCA", {
        qaty: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price)));
            set_total_mat(frm);
            set_total_matout(frm);
        }

    });


    frappe.ui.form.on("Material DetailARRCA", {
        unit_price: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', ((d.qaty * d.unit_price )))
            set_total_mat(frm);
            set_total_matout(frm);
        }

    });



    var set_total_mat = function (frm) {
        var total_mat = 0.0;
        $.each(frm.doc.material1, function (i, row) {
            total_mat += flt(row.total_cost);
        })
        frm.set_value("material_total_cost", total_mat);
        //frm.refresh();
    }

    var set_total_matout = function (frm) {
        var total_mat = 0.0;
        $.each(frm.doc.material_2, function (i, row) {
            total_mat += flt(row.total_cost);
        })
        frm.set_value("material_direct_cost1", total_mat);
        //frm.refresh();
    }



    frappe.ui.form.on("Task", "validate", function (frm) {
        set_total_mat(frm);
        set_total_matout(frm);
    });




    // CALCULATE MATERIAL FINAL COST

    frappe.ui.form.on("Task", {
        loading_unloading_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];

            frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

        }
    });

    frappe.ui.form.on("Task", {
        transportation_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];

            frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

        }
    });

    frappe.ui.form.on("Task", {
        material_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];

            frappe.model.set_value(d.doctype, d.name, 'material_final_cost', (d.loading_unloading_cost + d.transportation_cost + d.material_total_cost));

        }
    });


    // END OF MATERIAL RELATED SCRIPT

    // ACTIVITY TOTAL COST RELATED SCRIPT
    frappe.ui.form.on("Task", "man_power_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
    });

    frappe.ui.form.on("Task", "equipment_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
    });

    frappe.ui.form.on("Task", "material_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost);
    });
    frappe.ui.form.on("Task", "man_power_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Own Force') {
            frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });

    frappe.ui.form.on("Task", "equipment_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Own Force') {
            frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });

    frappe.ui.form.on("Task", "material_total_cost", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Own Force') {
            frm.doc.man_power_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate_sc = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });

    frappe.ui.form.on("Task", "man_power_unit_rate_sc", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
            frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });

    frappe.ui.form.on("Task", "equipment_unit_rate_sc", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
            frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });

    frappe.ui.form.on("Task", "material_unit_rate_sc", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Man Power Only') {
            frm.doc.man_power_unit_rate = 0;
            //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0); 
        }
        if (frm.doc.work_type == 'Sub Contract' && frm.doc.sub_contract_type == 'Full Sub Contract') {
            frm.doc.man_power_unit_rate = 0; //frm.model.set_value(cdt, cdn, "man_power_unit_rate", 0);
            frm.doc.equipment_unit_rate = 0; //frm.model.set_value(cdt, cdn, "equipment_unit_rate", 0);
            frm.doc.material_unit_rate = 0; //frm.model.set_value(cdt, cdn, "material_unit_rate ", 0);
        }
        if (frm.doc.man_power_unit_rate == '') { frm.doc.man_power_unit_rate = 0; }
        if (frm.doc.equipment_unit_rate == '') { frm.doc.equipment_unit_rate = 0; }
        if (frm.doc.material_unit_rate == '') { frm.doc.material_unit_rate = 0; }
        if (frm.doc.man_power_unit_rate_sc == '') { frm.doc.man_power_unit_rate_sc = 0; }
        if (frm.doc.equipment_unit_rate_sc == '') { frm.doc.equipment_unit_rate_sc = 0; }
        if (frm.doc.material_unit_rate_sc == '') { frm.doc.material_unit_rate_sc = 0; }
        frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_unit_rate + d.equipment_unit_cost + d.material_total_cost + d.man_power_unit_rate_sc + d.equipment_unit_rate_sc + d.material_unit_rate_sc);
    });


    frappe.ui.form.on("Task", {
        activity_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tools', (d.
                activity_total_cost * d.small_tools_percentage));
        }
    });

    frappe.ui.form.on("Task", {
        small_tools_percentage: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tools', (d.
                activity_total_cost * d.small_tools_percentage));
        }
    });

    frappe.ui.form.on("Task", {
        activity_total_cost: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tool', (d.
                activity_total_cost + d.direct_cost_with_small_tools));
        }
    });

    frappe.ui.form.on("Task", {
        direct_cost_with_small_tools: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'direct_cost_with_small_tool', (d.
                activity_total_cost + d.direct_cost_with_small_tools));
        }
    });


    // INDIRECT COST TOTAL COST RELATED SCRIPT
    frappe.ui.form.on("Task", "direct_cost_with_small_tools", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.direct_cost_with_small_tool * d.indirectcost) / 100);
    });

    frappe.ui.form.on("Task", "indirectcost", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.direct_cost_with_small_tool * d.indirectcost) / 100);
    });

    // TOTAL COST WITH INDIRECT COST
    frappe.ui.form.on("Task", "direct_cost_with_small_tool", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.direct_cost_with_small_tool + d.indirect_cost_total);
    });

    frappe.ui.form.on("Task", "indirect_cost_total", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.direct_cost_with_small_tool + d.indirect_cost_total);
    });


    // TOTAL WITH PROFIT MARGIN
    frappe.ui.form.on("Task", "activity_total_cost", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.total_cost_with_indirect_cost * d.profitmargin) / 100);
    });

    frappe.ui.form.on("Task", "profitmargin", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.total_cost_with_indirect_cost * d.profitmargin) / 100);
    });

    // TOTAL WITH PROFIT MARGIN
    frappe.ui.form.on("Task", "total_cost_with_indirect_cost", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
    });

    frappe.ui.form.on("Task", "total_with_profit_margin", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
    });


    frappe.ui.form.on("Task", "activity_unit_rate_collective", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective);
    });

    cur_frm.add_fetch('item', 'quantity', 'quantity');
    cur_frm.add_fetch('item', 'direct_cost_after_conversion', 'activity_unit_rate');
    cur_frm.add_fetch('item', 'unit', 'uom');

    // Total Cost
    frappe.ui.form.on("Quotation Items", {
        quantity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
            set_total_cost(frm);
        }
    });

    frappe.ui.form.on("Quotation Items", {
        activity_unit_rate: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
            set_total_cost(frm);
        }
    });


    frappe.ui.form.on("Task", "validate", function (frm) {
        set_total_cost(frm);
    });

    //Set total cost of quotation items on change of total cost
    frappe.ui.form.on("Quotation Items", "total_cost", function (frm, cdt, cdn) {
        set_total_cost(frm);
    });


    // Calculate total quantity
    var set_total_cost = function (frm) {
        var total_cost = 0.0;
        $.each(frm.doc.task_list, function (i, row) {
            total_cost += flt(row.total_cost);
        })
        frm.set_value("activity_unit_rate_collective", total_cost);
        //frm.refresh();
    }

    // Other UOM Conversion
    frappe.ui.form.on("Task", "qty", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate);
    });

    frappe.ui.form.on("Task", "conversion_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "quantity", d.qty * d.conversion_rate);
    });

    // Direct Cost After Conversion
    frappe.ui.form.on("Task", "conversion_multiplier", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate);
    });

    frappe.ui.form.on("Task", "activity_unit_rate", function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "direct_cost_after_conversion", d.conversion_multiplier * d.activity_unit_rate);
    });





    frappe.ui.form.on("Item", {
        quantity: function (frm, cdt, cdn) {
            var d = locals[cdt][cdn];
            frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
            set_total_cost(frm);
        }
    });




    function calculateTotal(frm, childTable, valueField, input) {
        var totalAmount = 0;

        if (!frm || !frm.doc || !frm.doc[childTable]) {
            console.error("Invalid form or child table data.");
            return NaN;
        }

        frm.doc[childTable].forEach((row) => {
            if (typeof row[input] === 'number') {
                totalAmount += row[input];
            } else if (typeof row[input] === 'string' && !isNaN(parseFloat(row[input]))) {
                totalAmount += parseFloat(row[input]);
            } else {
                console.error("Invalid input value in the child table:", row[input]);
            }
        });

        frm.set_value(valueField, totalAmount);
        frm.refresh_field(valueField);

        frm.refresh_field(valueField, totalAmount);
        frm.set_value(valueField, totalAmount);


        return parseFloat(totalAmount);
    }




    frappe.ui.form.on("Task", {
        onload: function (frm, cdt, cdn) {
            if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
                physicalWastage(frm);
                financialWastage(frm);
            }
        },
        project_total_duration: function (frm, cdt, cdn) {
            if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
                physicalWastage(frm);
            }
        },
        duration_in_days: function (frm, cdt, cdn) {
            if (frm.doc.project_total_duration && frm.doc.duration_in_days) {
                physicalWastage(frm);
            }
        },
        task_amount: function (frm, cdt, cdn) {
            if (frm.doc.task_amount && frm.doc.project_total_amount) {
                financialWastage(frm);
            }
        },
        project_total_amount: function (frm, cdt, cdn) {
            if (frm.doc.task_amount && frm.doc.project_total_amount) {
                financialWastage(frm);
            }
        }
    });

    function physicalWastage(frm) {
        frm.set_value("task_physical_weightage", frm.doc.duration_in_days / frm.doc.project_total_duration)
        frm.refresh_field("task_physical_weightage");
    }

    function financialWastage(frm) {
        frm.set_value("task_financial_weightage", frm.doc.task_amount / frm.doc.project_total_amount)
        frm.refresh_field("task_financial_weightage");
    }



    /////////////////////////////////////////////////////


    frappe.ui.form.on("Task Depends On", {
        amount: function (frm, cdt, cdn) {
            var child = locals[cdt][cdn];
            console.log("we are here");
            calculateTotal(frm, child);
        },
        duration: function (frm, cdt, cdn) {
            var child = locals[cdt][cdn];
            console.log("we are here");
            calculateTotal(frm, child);
        },
        task: function (frm, cdt, cdn) {
            console.log("task depends on excuted");
            var child = locals[cdt][cdn];
            // Call getTaskDetails and update child.amount when the call is complete
            getTaskDetails(frm, child.task)
                .then(function (amount) {

                    child.amount = amount;
                    console.log("child task amount is", child.amount)
                    frm.refresh_field("depends_on");

                    // Now that the async call is complete, calculate the total again
                    calculateTotal(frm, child);




                })
                .catch(function (err) {
                    console.error(err);
                });

            getDuration(frm, child.task)
                .then(function (duration) {
                    child.duration = duration;
                    console.log("child task amount is", child.duration)
                    frm.refresh_field("depends_on");

                    // Now that the async call is complete, calculate the total again
                    calculateTotal(frm, child);
                })
                .catch(function (err) {
                    console.error(err);
                });


        }
    });

    function getDuration(frm, task) {
        return new Promise(function (resolve, reject) {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'Task',
                    filters: { name: task },
                    fieldname: ['is_group', 'duration_in_days']
                },
                callback: function (response) {
                    try {
                        if (response.message) {
                            var is_group = response.message.is_group;

                            if (is_group == 1) {
                                getChildDuration(frm, task)
                                    .then(function (totalDuration) {
                                        resolve(totalDuration);
                                    })
                                    .catch(function (err) {
                                        reject(err);
                                    });
                            } else {
                                var amount = response.message.duration_in_days || 0;
                                resolve(amount);
                            }
                        } else {
                            reject("Error fetching task details");
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

    function getChildDuration(frm, task) {
        return new Promise(function (resolve, reject) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Task',
                    filters: { parent_task: task },
                    fields: ['name', 'is_group', 'duration_in_days']
                },
                callback: function (response) {
                    try {
                        if (response.message) {
                            var duration_in_days = 0;
                            var promises = [];

                            for (var i = 0; i < response.message.length; i++) {
                                var is_group_again = response.message[i].is_group;
                                var task_name = response.message[i].name;

                                if (is_group_again == 1) {
                                    promises.push(getChildTasks(frm, task_name));
                                } else {
                                    duration_in_days += response.message[i].duration_in_days || 0;
                                }
                            }

                            Promise.all(promises)
                                .then(function (results) {
                                    results.forEach(function (result) {
                                        duration_in_days += result;
                                    });
                                    resolve(duration_in_days);
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        } else {
                            reject("Error fetching child tasks");
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }



    function getTaskDetails(frm, task) {
        return new Promise(function (resolve, reject) {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'Task',
                    filters: { name: task },
                    fieldname: ['is_group', 'task_amount']
                },
                callback: function (response) {
                    try {
                        if (response.message) {
                            var is_group = response.message.is_group;

                            if (is_group == 1) {
                                getChildTasks(frm, task)
                                    .then(function (totalCost) {
                                        resolve(totalCost);
                                    })
                                    .catch(function (err) {
                                        reject(err);
                                    });
                            } else {
                                var amount = response.message.task_amount || 0;
                                resolve(amount);
                            }
                        } else {
                            reject("Error fetching task details");
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

    function getChildTasks(frm, task) {
        return new Promise(function (resolve, reject) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Task',
                    filters: { parent_task: task },
                    fields: ['name', 'is_group', 'task_amount']
                },
                callback: function (response) {
                    try {
                        if (response.message) {
                            var task_amount = 0;
                            var promises = [];

                            for (var i = 0; i < response.message.length; i++) {
                                var is_group_again = response.message[i].is_group;
                                var task_name = response.message[i].name;

                                if (is_group_again == 1) {
                                    promises.push(getChildTasks(frm, task_name));
                                } else {
                                    task_amount += response.message[i].task_amount || 0;
                                }
                            }

                            Promise.all(promises)
                                .then(function (results) {
                                    results.forEach(function (result) {
                                        task_amount += result;
                                    });
                                    resolve(task_amount);
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        } else {
                            reject("Error fetching child tasks");
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }

    function calculateTotal(frm, child) {
        console.log("calculate total called")
        var totalAmount = 0;
        var totalDuration = 0;
        $.each(frm.doc.depends_on, function (i, d) {
            // calculate incentive
            totalAmount += d.amount;
            totalDuration += d.duration
            console.log("total amount is", totalAmount)

        });
        frm.set_value("total_cost", totalAmount);
        frm.refresh_field("total_cost")
        frm.set_value("duration_in_days", totalDuration);
        frm.refresh_field("duration_in_days")
    }








    ///////////////////////////////////////////////////

    frm.set_value("task_physical_weightage", frm.doc.duration_in_days / frm.doc.project_total_duration)
    frm.refresh_field("task_physical_weightage");
}

function financialWastage(frm) {
    frm.set_value("task_financial_weightage", frm.doc.task_amount / frm.doc.project_total_amount)
    frm.refresh_field("task_financial_weightage");
}



/////////////////////////////////////////////////////


frappe.ui.form.on("Task Depends On", {
    amount: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        console.log("we are here");
        calculateTotal(frm, child);
    },
    duration_in_days: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        console.log("we are here");
        calculateTotal(frm, child);
    },
    task: function (frm, cdt, cdn) {
        console.log("task depends on excuted");
        var child = locals[cdt][cdn];
        // Call getTaskDetails and update child.amount when the call is complete
        getTaskDetails(frm, child.task)
            .then(function (amount) {

                child.amount = amount;
                console.log("child task amount is", child.amount)
                frm.refresh_field("depends_on");

                // Now that the async call is complete, calculate the total again
                calculateTotal(frm, child);
            })
            .catch(function (err) {
                console.error(err);
            });


        getDurationDetails(frm, child.task)
            .then(function (duration) {
                child.duration = duration;
                console.log("child task amount is", child.duration)
                frm.refresh_field("depends_on");

                // Now that the async call is complete, calculate the total again
                calculateTotal(frm, child);
            })
            .catch(function (err) {
                console.error(err);
            });
    }
});

function getDurationDetails(frm, task) {
    return new Promise(function (resolve, reject) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'Task',
                filters: { name: task },
                fieldname: ['is_group', 'duration_in_days']
            },
            callback: function (response) {
                try {
                    if (response.message) {
                        var is_group = response.message.is_group;

                        if (is_group == 1) {
                            getChildDuration(frm, task)
                                .then(function (totalCost) {
                                    resolve(totalCost);
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        } else {
                            var amount = response.message.duration_in_days || 0;
                            resolve(amount);
                        }
                    } else {
                        reject("Error fetching task details");
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

function getChildDuration(frm, task) {
    return new Promise(function (resolve, reject) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Task',
                filters: { parent_task: task },
                fields: ['name', 'is_group', 'duration_in_days']
            },
            callback: function (response) {
                try {
                    if (response.message) {
                        var duration_in_days = 0;
                        var promises = [];

                        for (var i = 0; i < response.message.length; i++) {
                            var is_group_again = response.message[i].is_group;
                            var task_name = response.message[i].name;

                            if (is_group_again == 1) {
                                promises.push(getChildDuration(frm, task_name));
                            } else {
                                duration_in_days += response.message[i].duration_in_days || 0;
                            }
                        }

                        Promise.all(promises)
                            .then(function (results) {
                                results.forEach(function (result) {
                                    duration_in_days += result;
                                });
                                resolve(duration_in_days);
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                    } else {
                        reject("Error fetching child tasks");
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}



function getTaskDetails(frm, task) {
    return new Promise(function (resolve, reject) {
        frappe.call({
            method: 'frappe.client.get_value',
            args: {
                doctype: 'Task',
                filters: { name: task },
                fieldname: ['is_group', 'task_amount']
            },
            callback: function (response) {
                try {
                    if (response.message) {
                        var is_group = response.message.is_group;

                        if (is_group == 1) {
                            getChildTasks(frm, task)
                                .then(function (totalCost) {
                                    resolve(totalCost);
                                })
                                .catch(function (err) {
                                    reject(err);
                                });
                        } else {
                            var amount = response.message.task_amount || 0;
                            resolve(amount);
                        }
                    } else {
                        reject("Error fetching task details");
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

function getChildTasks(frm, task) {
    return new Promise(function (resolve, reject) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Task',
                filters: { parent_task: task },
                fields: ['name', 'is_group', 'task_amount']
            },
            callback: function (response) {
                try {
                    if (response.message) {
                        var task_amount = 0;
                        var promises = [];

                        for (var i = 0; i < response.message.length; i++) {
                            var is_group_again = response.message[i].is_group;
                            var task_name = response.message[i].name;

                            if (is_group_again == 1) {
                                promises.push(getChildTasks(frm, task_name));
                            } else {
                                task_amount += response.message[i].task_amount || 0;
                            }
                        }

                        Promise.all(promises)
                            .then(function (results) {
                                results.forEach(function (result) {
                                    task_amount += result;
                                });
                                resolve(task_amount);
                            })
                            .catch(function (err) {
                                reject(err);
                            });
                    } else {
                        reject("Error fetching child tasks");
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

function calculateTotal(frm, child) {
    console.log("calculate total called")
    var totalAmount = 0;
    var totalDuration = 0;
    $.each(frm.doc.depends_on, function (i, d) {
        // calculate incentive
        totalAmount += d.amount;
        totalDuration += d.duration
        console.log("total amount is", totalAmount)

    });
    frm.set_value("task_amount", totalAmount);
    frm.refresh_field("task_amount")
    frm.set_value("duration_in_days", totalDuration);
    frm.refresh_field("duration_in_days")
}

