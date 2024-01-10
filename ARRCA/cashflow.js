cur_frm.add_fetch('act_code', 'act_name', 'act_name');
cur_frm.add_fetch('act_code', 'uom', 'uom');
cur_frm.add_fetch('act_code', 'unit_rate', 'unit_rate');
frappe.ui.form.on("Road Cashflow Table",{
 data1:function(frm,cdt,cdn){
 var child=locals[cdt][cdn]
 rowCalculate(frm,child);
 },
 data2:function(frm,cdt,cdn){
    var child=locals[cdt][cdn]
    rowCalculate(frm,child);
    }
    ,
    data3:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        rowCalculate(frm,child);
        }
        ,data4:function(frm,cdt,cdn){
            var child=locals[cdt][cdn]
            rowCalculate(frm,child);
            }
            ,data5:function(frm,cdt,cdn){
                var child=locals[cdt][cdn]
                rowCalculate(frm,child);
                }
                ,data6:function(frm,cdt,cdn){
                    var child=locals[cdt][cdn]
                    rowCalculate(frm,child);
                    }
                    ,data7:function(frm,cdt,cdn){
                        var child=locals[cdt][cdn]
                        rowCalculate(frm,child);
                        }
                        ,data8:function(frm,cdt,cdn){
                            var child=locals[cdt][cdn]
                            rowCalculate(frm,child);
                            }
                            ,data9:function(frm,cdt,cdn){
                                var child=locals[cdt][cdn]
                                rowCalculate(frm,child);
                                }
                                ,data10:function(frm,cdt,cdn){
                                    var child=locals[cdt][cdn]
                                    rowCalculate(frm,child);
                                    }
                                    

})
function rowCalculate(frm,child){
    console.log("it is excuting please wait")
    console.log("child",child)
    var rowTotal=0;
   for(var i=1;i<=10;i++){
       rowTotal+=parseFloat(child[`data${i}`]||0)
   }
child.row_total=rowTotal
console.log("the value of total is",rowTotal)

frm.refresh_field("cashflow_table")
frm.refresh_field("periodic_maintenance")
frm.refresh_field("drainage_maintenace")
frm.refresh_field("structures")
frm.refresh_field("road_side_works")
frm.refresh_field("material_production")
frm.refresh_field("new_construction_for_betterment")
frm.refresh_field("length_person_own_force__outsource")
}

