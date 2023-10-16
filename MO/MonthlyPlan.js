//Old Script Section Begin
cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

frappe.ui.form.on("Monthly Plan", {
      quantity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));	
     }
 });
frappe.ui.form.on("Monthly Plan", {
      productivity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));	
     }
 });
 //Old Script Section End

 

//Script by Bereket Begin
//Script to get the total execution plan to date

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  frappe.ui.form.on("Monthly Plan", {
    start_date:function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");
        if(start_date){
            var end_date = addDays(start_date, 6);
            frappe.model.set_value(d.doctype, d.name, "end_date", end_date);
            var sD = document.getElementsByName("start_date");
            console.log("Length: "+sD.length);
            console.log("Start Date: "+sD[0]);
        }
    }
});

function AutoPopulate(frm, cdt, cdn) {
    
        cur_frm.add_fetch('activity', 'quantity', 'quantity');
        cur_frm.add_fetch('activity', 'unit', 'uom');

        refresh_field("uom");
        refresh_field("quantity");

        var date1 = frm.doc.start_date;
        var date2 = frm.doc.end_date;

        var d = locals[cdt][cdn];
        var activity  = frappe.model.get_value(d.doctype, d.name, "activity");

        if(activity && date1 && date2) {
            frappe.call({
                method:  "erpnext.taskapi.get_executed_quantity_from_timesheet",
                args: {activity: activity, date1: date1, date2: date2}
            }).done((r) => {
                if(r.message.length >= 1)
                    if(r.message[0]) {
                        
                        var to_date_executed = r.message[0];
                        frappe.model.set_value(d.doctype, d.name, "to_date_executed", parseFloat(to_date_executed));
                        var quantity  = frappe.model.get_value(d.doctype, d.name, "quantity");
                        var remaining_planned_qty = quantity - parseFloat(to_date_executed);
                        frappe.model.set_value(d.doctype, d.name, "remaining_planned_qty", remaining_planned_qty);
                    }
            })

            refresh_field("to_date_executed");
        }
        
        frm.doc.monthly_plan_detail_week_view = []

        frm.doc.machinery = []
        frm.doc.manpower1 = []
        frm.doc.material1 = []

        frm.doc.machinery_detail_summerized = []
        frm.doc.manpower_detail_summerized = []
        frm.doc.material_detail_summerized = []

        var allMachinesMap = new Map();
        var allMaterialMap = new Map();
        var allManpowerMap = new Map();

        //console.log(frm);

        var grand_total_cost_for_machinary = 0;
        var number_of_items_for_machinary = 0;
        var sum_of_unit_rate_for_machinary = 0;

        var grand_total_cost_for_manpower = 0;
        var number_of_items_for_manpower = 0;
        var sum_of_unit_rate_for_manpower = 0;

        var grand_total_cost_for_material = 0;
        var number_of_items_for_material = 0;
        var sum_of_unit_rate_for_material = 0;

        allMachinesMap.clear();
        allMaterialMap.clear();
        allManpowerMap.clear();

        var task_lists = frm.doc.task_list;
        $.each(task_lists, function(_i, eMain) {

                //Script to populate child tables for machinary
                var taskParent  = eMain.activity;

                if(taskParent) {
                    frappe.call({
                        method:  "erpnext.machinary_populate_api.get_machinary_by_task",
                        args: {parent: taskParent}
                    }).done((r) => {
                        $.each(r.message, function(_i, e) {

                            //console.log("ID is "+e.id_mac+" On Current Task: "+taskParent);

                            var entry = frm.add_child("machinery");
                            entry.id_mac = e.id_mac;
                            entry.type = e.type;
                            entry.qty = e.qty*eMain.planned_this_month;
                            entry.uf = e.uf;
                            entry.efficency = e.efficency;
                            entry.rental_rate = e.rental_rate;
                            grand_total_cost_for_machinary += entry.qty*entry.rental_rate;
                            number_of_items_for_machinary += 1;
                            sum_of_unit_rate_for_machinary += entry.rental_rate;
                            entry.total_hourly_cost = entry.qty*entry.rental_rate;

                            if(allMachinesMap.has(e.id_mac)) { 
                                
                                console.log("Added to has "+e.id_mac);
                                var existingVal = allMachinesMap.get(entry.id_mac);
                                existingVal.qty += (entry.qty);
                                existingVal.total_hourly_cost += (entry.total_hourly_cost);
                                allMachinesMap.set(entry.id_mac, existingVal);
                            }
                            else {

                                var newEntrySummerized = frm.add_child("machinery_detail_summerized");
                                newEntrySummerized.id_mac = e.id_mac;
                                newEntrySummerized.type = e.type;
                                newEntrySummerized.qty = e.qty*eMain.planned_this_month;
                                newEntrySummerized.uf = e.uf;
                                newEntrySummerized.efficency = e.efficency;
                                newEntrySummerized.rental_rate = e.rental_rate;
                                newEntrySummerized.total_hourly_cost = entry.qty*entry.rental_rate;
                                allMachinesMap.set(e.id_mac, newEntrySummerized);
                            }

                        })

                        frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
                        frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary/number_of_items_for_machinary);

                        //console.log(allMachinesMap);

                        allMachinesMap.forEach(function(val, key) {

                            
                        })

                        refresh_field("machinery");
                        refresh_field("equipment_total_cost");
                        refresh_field("equipment_unit_rate");
                        refresh_field("machinery_detail_summerized");
                    })
                }

                //Script to populate child tables for manpower
                if(taskParent) {
                    frappe.call({
                        method:  "erpnext.manpower_populate_api.get_manpower_by_task",
                        args: {parent: taskParent}
                    }).done((r) => {
                        $.each(r.message, function(_i, e){
                            var entry = frm.add_child("manpower1");
                            entry.id_map = e.id_map;
                            entry.job_title = e.job_title;
                            entry.qty = e.qty*eMain.planned_this_month;
                            entry.uf = e.uf;
                            entry.efficency = e.efficency;
                            entry.hourly_cost = e.hourly_cost;
                            grand_total_cost_for_manpower += entry.qty*entry.hourly_cost;
                            number_of_items_for_manpower += 1;
                            sum_of_unit_rate_for_manpower += entry.hourly_cost;
                            entry.total_hourly_cost = entry.qty*entry.hourly_cost;


                            var entryMPSummerized = frm.add_child("manpower_detail_summerized");
                            entryMPSummerized.id_map = e.id_map;
                            entryMPSummerized.job_title = e.job_title;
                            entryMPSummerized.qty = e.qty*eMain.planned_this_month;
                            entryMPSummerized.uf = e.uf;
                            entryMPSummerized.efficency = e.efficency;
                            entryMPSummerized.hourly_cost = e.hourly_cost;
                            entryMPSummerized.total_hourly_cost = entryMPSummerized.qty*entryMPSummerized.hourly_cost;
                        })


                        frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
                        frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower/number_of_items_for_manpower);

                        refresh_field("manpower1");
                        refresh_field("man_power_total_cost");
                        refresh_field("man_power_unit_rate");
                        refresh_field("manpower_detail_summerized");
                    })
                }


                ;
                //Script to populate child tables for material
                if(taskParent) {
                    frappe.call({

                        method:  "erpnext.material_populate_api.get_material_by_task",
                        args: {parent: taskParent}

                    }).done((r) => {
                        $.each(r.message, function(_i, e){

                            var entry = frm.add_child("material1");
                            entry.id_mat = e.id_mat;
                            entry.item1 = e.item1;
                            entry.uom = e.uom;
                            entry.qty = e.qty*eMain.planned_this_month;
                            entry.uf = e.uf;
                            entry.efficency = e.efficency;
                            entry.unit_price = e.unit_price;
                            grand_total_cost_for_material += entry.qty*entry.unit_price;
                            number_of_items_for_material += 1;
                            sum_of_unit_rate_for_material += entry.unit_price;
                            entry.total_cost = entry.qty*entry.unit_price;


                            var entryMaterialSummerized = frm.add_child("material_detail_summerized");
                            entryMaterialSummerized.id_mat = e.id_mat;
                            entryMaterialSummerized.item1 = e.item1;
                            entryMaterialSummerized.uom = e.uom;
                            entryMaterialSummerized.qty = e.qty*eMain.planned_this_month;
                            entryMaterialSummerized.uf = e.uf;
                            entryMaterialSummerized.efficency = e.efficency;
                            entryMaterialSummerized.unit_price = e.unit_price;
                            entryMaterialSummerized.total_cost = entryMaterialSummerized.qty*entryMaterialSummerized.unit_price;
                        })

                        frm.doc.material_total_cost = grand_total_cost_for_material;
                        //frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

                        refresh_field("material1");
                        refresh_field("material_total_cost");
                        refresh_field("material_detail_summerized");
                    })
                }

                //Script to populate child tables for task detail by week
                if(taskParent) {

                    frappe.call({

                        method:  "erpnext.task_week_detail_populate_api.get_task_by_task_id",
                        args: {activity: taskParent}

                    }).done((r) => {
                        $.each(r.message, function(_i, e){

                            var entry = frm.add_child("monthly_plan_detail_week_view");
                            entry.activity = e[0];
                            entry.uom = e[61];

                            if(eMain.planned_this_month) {
                                entry.planned_this_month = eMain.planned_this_month;
                                //entry.w_1  = eMain.planned_this_month/4;
                                //entry.w_2  = eMain.planned_this_month/4;
                                //entry.w_3  = eMain.planned_this_month/4;
                                //entry.w_4  = eMain.planned_this_month/4;
                            }

                        })

                        refresh_field("monthly_plan_detail_week_view");
                    })
                }
        });
}

function AutoCalculateWeekValue(doctype, name, planned_this_month) {
      
      console.log("DocType: "+doctype);
      console.log("Name: "+name);

      //frappe.model.set_value(doctype, name, 'w_1', (planned_this_month / 4));
      //frappe.model.set_value(doctype, name, 'w_2', (planned_this_month / 4));
      //frappe.model.set_value(doctype, name, 'w_3', (planned_this_month / 4));
      //frappe.model.set_value(doctype, name, 'w_4', (planned_this_month / 4));
}

frappe.ui.form.on("Monthly Plan Detail", {
    activity:function(frm, cdt, cdn) {
        AutoPopulate(frm,cdt,cdn);
    },

    planned_this_month:function(frm, cdt, cdn) {
        AutoPopulate(frm,cdt,cdn);
    }
});

frappe.ui.form.on("Monthly Plan Detail Week View", {
    planned_this_month: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        AtoCalculateWeekValue(d.doctype, d.name, d.planned_this_month);
   }
});