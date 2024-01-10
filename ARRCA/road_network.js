frappe.ui.form.on('Road Network Table', {
    data_1: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_value",
            args: {
                doctype: 'Road Segment Data',
                filters: {"name": child.data_1},
                fieldname: ['road_length']
            },
            callback: function (response) {
                   console.log("The parent of this list: ", response);            
                    frappe.model.set_value(cdt, cdn, "roads_length",parseFloat(response.message.road_length));
                    frm.refresh()   
            }
        });
    },
    data1:function(frm,cdt,cdn){
    var child=locals[cdt][cdn]
    rowTotal(frm,child);

    },
    data2:function(frm,cdt,cdn){
        var child=locals[cdt][cdn]
        rowTotal(frm,child);
    
        },
        data3:function(frm,cdt,cdn){
            var child=locals[cdt][cdn]
            rowTotal(frm,child);
        
            },
            data4:function(frm,cdt,cdn){
                var child=locals[cdt][cdn]
                rowTotal(frm,child);
            
                }
});
function rowTotal(frm,child){
  var maintained=(child.data1||0)+(child.data2||0)+(child.data3||0)+(child.data4||0);
  child.maintained=maintained
  var not_maintained=child.roads_length-maintained;
  child.not_maintained=not_maintained
  child.periodic=child.data1||1*10
  child.routine__by_machine=child.data2||1*10
  child.length_person_own_force=child.data3||1*10
  child.length_person_outsource=child.data4||1*10
  frm.refresh_field("road_network_table")
  child.total_allocated_budget=child.periodic + child.routine__by_machine + child.length_person_own_force + child.length_person_outsource
  frm.refresh_field("road_network_table")

}