frappe.ui.form.on ('Calender Table', {
   
  data1: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  
  data2: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data3: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data4: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data5: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data6: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data7: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data8: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data9: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  data10: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
    calculateTotal (child, frm);
  },
  act: function (frm,cdt,cdn) {
    var child = locals[cdt][cdn];
 workingDays (child, frm);
  },
});
function calculateTotal (child, frm) {
console.log("excute this function")
var total=0;
for(var i=1;i<=10;i++){
 total+=parseFloat(child[`data${i}`]||0)
}
child.total=total
frm.refresh_field("calender_table")
}
function workingDays(frm,child){
 var workingArray=[];
 if(child.act=="Calender Day"){
    

 }

}