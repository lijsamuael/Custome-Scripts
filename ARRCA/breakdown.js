cur_frm.add_fetch('act_code', 'act_name', 'act_name');
cur_frm.add_fetch('act_code', 'uom', 'uom');
frappe.ui.form.on('Machine Requirement Breakdown', {
    calculate_dozer: function (frm, cdt, cdn) {
        var numDozer = (frm.doc.total_days / frm.doc.total_working_days)
        frm.set_value("dozer_number", numDozer)
        frm.refresh_field("dozer_number")
    },
    summarize:function(frm,cdt,cdn){
    frm.doc.machinery_table=[]    
    summary(frm);
    }
});
function summary(frm){
    console.log("excute summarize")
var child=frm.add_child("machinery_table")
child.machine="Dozer"
child.qty=frm.doc.dozer_number||0
child.round=frm.doc.round_to||0
child.unit="No"
var child2=frm.add_child("machinery_table")
child2.machine="Grader"
child2.qty=frm.doc.number_of_grader||0
child2.round=frm.doc.round_to_grader||0
child2.unit="No"
var child3=frm.add_child("machinery_table")
child3.machine="Roller"
child3.qty=frm.doc.number_of_roller||0
child3.round=frm.doc.round_to_roller||0
child3.unit="No"
var child4=frm.add_child("machinery_table")
child4.machine="Loader"
child4.qty=frm.doc.number_of_loader_required||0
child4.round=frm.doc.round_to_loader||0
child4.unit="No"
var child5=frm.add_child("machinery_table")
child5.machine="Dump truck"
child5.qty=frm.doc.number_of_dump_truck||0
child5.round=frm.doc.round_to_dump||0
child5.unit="No"
var child6=frm.add_child("machinery_table")
child6.machine="Water truck"
child6.qty=frm.doc.number_of_water_truck||0
child6.round=frm.doc.round_watertruck||0
child6.unit="No"
 frm.refresh_field("machinery_table")

}
// frappe.ui.form.on('Machine Requirement Breakdown Periodic', {
//     capacity_of_grader: graderWorkingCapacity,
//     effective_grading_width: graderWorkingCapacity,
//     work_efficiency: graderWorkingCapacity
// });
frappe.ui.form.on('Grader Table', {
    qty: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },
    thickness_of_gwc: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },

    grading_speed: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },
    number_of_grading: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },
    length: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },
    width: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateGraderRow(frm, child);

    },

});
frappe.ui.form.on('Roller Table', {
    qty: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateRollerRow(frm, child);

    },
    thickness_of_gwc: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateRollerRow(frm, child);

    },
    grading_speed: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateRollerRow(frm, child);

    },
    number_of_grading: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateRollerRow(frm, child);
    },

});
frappe.ui.form.on('Shower Table', {
    qty: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    density_material: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    omc: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    wastage: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    density_of_water: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    avarage_distance: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    shower_truck_capacity: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    driving_speed: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
    loading_time: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateShowrRow(frm, child);

    },
});
function calculateShowrRow(frm,child) {
    var totalMassOfMaterial = (((child.density_material||1) * (child.qty||1)) / 1000)
    child.total_mass_of_material = totalMassOfMaterial
    var totalMassOfWater = totalMassOfMaterial * (child.omc||1) * (child.wastage||1)
    child.total_water_mass_required = totalMassOfWater
    var totalWaterVolume = (child.density_of_water||1) * totalMassOfWater
    child.total_water_volume = totalWaterVolume
    var onetrip = ((child.avarage_distance||1) /(child.driving_speed||1)) + (child.loading_time||1)
    child.one_trip_in_hrs = onetrip
    var outputtripperday = parseFloat(frm.doc.working_hours_in_the_day||0) / (onetrip||1)
    child.output_trip_per_day = outputtripperday
    var outputm3day = outputtripperday *(child.shower_truck_capacity||1)
    child.output_m3day = outputm3day
    var totalNumberOfdays = totalWaterVolume / outputm3day
    child.required_days = totalNumberOfdays
    frm.refresh_field("shower_table")
    var waterDays = 0;
    $.each(frm.doc.shower_table, function (i, row) {
        waterDays += row.required_days
    });
    var greater;
    if (waterDays > frm.doc.greater) {
        greater = waterDays
    }
    else {
        greater = frm.doc.greater
    }
    frm.set_value("total_days_water",waterDays)
    frm.refresh_field("total_days_water")
    frm.set_value("greater2", greater)
    frm.refresh_field("greater2")
    frm.set_value("number_of_water_truck", greater / frm.doc.total_working_days_in_the_year)
    frm.refresh_field("number_of_water_truck")
}

function calculateRollerRow(frm, child) {
    console.log("calculating ")
    var graderCapacity = ((frm.doc.effective_grading_width2 || 1) * (child.grading_speed) * (frm.doc.work_efficincy2)) / (child.number_of_grading)
    console.log("grader capacity", graderCapacity)
    child.working_capacity_per_hour = graderCapacity
    child.work_capacity_per_layer_per_day = graderCapacity * 8
    frm.refresh_field("roller_table")
    var gwc = (graderCapacity * 8) * child.thickness_of_gwc
    child.gwc_placing = gwc
    child.number_of_required_days = child.qty / gwc
    frm.refresh_field("roller_table")
    var rollerDays = 0;
    $.each(frm.doc.roller_table, function (i, row) {
        rollerDays += row.number_of_required_days
    });
    frm.set_value("total_required_days_roller", rollerDays)
    frm.refresh_field("total_required_days_roller")
    var greater;
    if (frm.doc.total_required_days_roller > frm.doc.total_days_grader) {
        greater = frm.doc.total_required_days_roller
    }
    else {
        greater = frm.doc.total_days_grader
    }
    frm.set_value("greater", greater)
    frm.set_value("number_of_roller", greater / frm.doc.total_working_days)
    frm.refresh_field("number_of_roller")
}
function calculateGraderRow(frm, child) {
    if (child.type_of_activity == "Material Placing(resurfacing,heavy blading)") {
        var graderCapacity = ((frm.doc.capacity_of_grader || 1) * (frm.doc.effective_grading_width) * (child.grading_speed) * (frm.doc.work_efficiency)) / (child.number_of_grading)
        child.working_capacity_per_hour = graderCapacity
        child.work_capacity_per_layer_per_day = graderCapacity * 8
        frm.refresh_field("grader_table")
        var gwc = (graderCapacity * 8) * child.thickness_of_gwc
        child.gwc_placing = gwc
        child.number_of_required_days = child.qty / gwc
        frm.refresh_field("grader_table")

    }
    else if (child.type_of_activity == "ditch clearing" || child.type_of_activity == "light blading") {
        var graderCapacity = ((frm.doc.capacity_of_grader || 1) * (frm.doc.effective_grading_width || 1) * (child.grading_speed || 1) * (frm.doc.work_efficiency)) / (child.number_of_grading)
        child.working_capacity_per_hour = graderCapacity
        child.work_capacity_per_layer_per_day = graderCapacity * 8
        frm.refresh_field("grader_table")
        //quantity is as area in this  case
        var area = (child.length || 1) * (child.width || 1)
        console.log("area is", area)
        // child.number_of_required_days=area/graderCapacity
        child.number_of_required_days = area / child.work_capacity_per_layer_per_day
        console.log("grader capacity",)
        frm.refresh_field("grader_table")

        frm.refresh_field("grader_table")
    }
    else {
    }
    var graderDays = 0;
    $.each(frm.doc.grader_table, function (i, row) {
        graderDays += row.number_of_required_days
    });
    frm.set_value("total_days_grader", graderDays)
    frm.refresh_field("total_days_grader")
    frm.set_value("number_of_grader", graderDays / frm.doc.total_working_days)
    frm.refresh_field("number_of_grader")

}



frappe.ui.form.on('Dozer Table', {
    data1: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "dozer_table", "total_days", 3);
    },
    data2: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "dozer_table", "total_days", 3);
    },
    data3: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "dozer_table", "total_days", 3);
    },
    data4: function (frm, cdt, cdn) {
        updateTotalsProduct(frm, cdt, cdn, "dozer_table", "total_days", 3);
    },
});
function updateTotalsSum(frm, cdt, cdn, rowField, totalField, dataLength) {
    var child = locals[cdt][cdn];
    calculateRowTotalSum(frm, child, rowField, dataLength);
    calculateRowsTotal(frm, rowField, totalField);
}
function updateTotalsProduct(frm, cdt, cdn, rowField, totalField, dataLength) {
    var child = locals[cdt][cdn];
    calculateRowTotalProduct(frm, child, rowField, dataLength);
    calculateRowsTotal(frm, rowField, totalField);
}
function calculateRowTotalSum(frm, child, field, dataLength) {
    var rowTotal = 0;
    for (var i = 1; i <= dataLength; i++) {
        rowTotal += child[`data${i}`] || 0;
    }
    child.row_total = rowTotal;
    child.hourly_output = (child.row_total / 8)
    child.total_days = (child.data / child.row_total)
    frm.refresh_field(field);
}
function calculateRowTotalProduct(frm, child, field, dataLength) {
    var rowTotal = 1;
    for (var i = 1; i <= dataLength; i++) {
        rowTotal *= child[`data${i}`] || 1;
    }
    child.row_total = rowTotal;
    child.hourly_output = (child.row_total / 8)
    child.total_days = (child.data/ child.row_total)
    frm.refresh_field(field);
}

function calculateRowsTotal(frm, table, field) {
  var rowsTotal=0;
    $.each(frm.doc[table], function(i, row) {
         rowsTotal+=(row.total_days||0)
    });
    frm.set_value(field, rowsTotal);
    frm.refresh_field(field);
}












frappe.ui.form.on('Loader Table', {
    data: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateLoaderRow(frm, child)
    },
    data1: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateLoaderRow(frm, child)
    },
    data2: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateLoaderRow(frm, child)

    },
    data3: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateLoaderRow(frm, child)
    },
});
frappe.ui.form.on('Dumptruck Table', {
    dump_capacity: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateDumptruckRow(frm, child)
    },
    hauling: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn]
        calculateDumptruckRow(frm, child)
    },
});
function calculateDumptruckRow(frm, child) {
    console.log("excute dumptruck")
    var loadingAndUnloading = (frm.doc.loading_time_per_truckmin || 0) + (frm.doc.waiting_time || 0)
    child.loading_unloading = loadingAndUnloading
    frm.refresh_field("dumptruck_table")
    console.log("loading and unloading is", loadingAndUnloading)
    var dailyOutput = (child.dump_capacity || 1) * (parseFloat(frm.doc.working_hours_in_the_day) / (2 * ((child.hauling || 0) / child.avarage_speed) + (loadingAndUnloading / 60)))
    console.log("daily output is", dailyOutput)
    child.daily_output = dailyOutput
    child.total_days = child.data / dailyOutput
    var dumptruckDays = 0;
    $.each(frm.doc.dumptruck_table, function (i, row) {
        dumptruckDays += row.total_days

    });
    var loadingCapacityOfLoader = ((parseFloat(frm.doc.working_hours_in_the_day) / (frm.doc.loading_time_per_truckmin / 60)))
    var daily = (parseFloat(frm.doc.working_hours_in_the_day) / (2 * ((child.hauling || 0) / child.avarage_speed) + (loadingAndUnloading / 60)))
    frm.set_value("total_required_days", dumptruckDays)
    console.log("days", dumptruckDays)
    frm.refresh_field("total_required_days",)
    frm.set_value("number_of_dump_truck",)
    frm.set_value("loading_capacity", loadingCapacityOfLoader)
    frm.refresh_field("loading_capacity")
    frm.set_value("loading_capacity_truck", daily)
    frm.refresh_field("loading_capacity_truck")
    frm.set_value("number_of_dump_truck", loadingCapacityOfLoader / daily)
    frm.refresh_field("working_days_dump")
    frm.set_value("working_days_dump", dumptruckDays / frm.doc.number_of_dump_truck)
    frm.refresh_field("working_days_dump")
    frm.refresh_field("dumptruck_table")
}
function calculateLoaderRow(frm, child) {
    var multiplier = 1;
    if (child.mat_type == "sel-mat") {
        console.log("excute function")
        multiplier = frm.doc.dump_truck_cap_mat
    }
    else {
        multiplier = frm.doc.dump_truck_cap_rock
    }
    var equipment_output_perday = multiplier * (frm.doc.working_hours_in_the_day / (frm.doc.loading_time_per_truck / 60))
    child.data1 = equipment_output_perday
    var total = (child.data1 || 1) * (child.data2 || 1) * (child.data3 || 1)
    child.actual_total_perday = total
    child.actual_total_perhour = total / 8
    child.total_days = child.data / total
    frm.refresh_field("loader_table")
    var totalDays = 0;
    $.each(frm.doc.loader_table, function (i, row) {
        totalDays += row.total_days
    });
    frm.set_value("total_required_loader", totalDays)
    frm.refresh_field("total_required_loader")
    frm.set_value("number_of_loader_required", totalDays / frm.doc.total_working_days)
    frm.refresh_field("number_of_loader_required")
}
//these are mainly for Dozer

