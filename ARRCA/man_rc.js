frappe.ui.form.on ('Man RC', {
  calculate_balance: function (frm, cdt, cdn) {
    calculateBalance (frm);
  },
  type:function(frm,cdt,cdn){
    var costPerkm = 0;
    if (frm.doc.type == 'Periodic') {
      costPerkm = periodic;
    } else if (frm.doc.type == 'Routine') {
      costPerkm = routine;
    }
    frm.set_value("km_cost_birr",costPerkm)
    frm.refresh_field("km_cost_birr")
  }
});
var routine;
var periodic;
var ownForce; //outsource
frappe.ui.form.on ('Man RC', {
  onload: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    frappe.call ({
      method: 'frappe.client.get_list',
      args: {
        doctype: 'Type of Road Maintainance',
        fields: ['*'],
      },
      callback: function (response) {
        console.log ('response', response);
        var res = response.message;
        var length = res.length;
        for (var i = 0; i < length; i++) {
          if (res[i].name == 'መደበኛ ጥገና በሌንግዝ ፐርሰን') {
            ownForce = res[i].cost_per_km;
            console.log("some own force")
          } else if (res[i].name == 'መደበኛ ጥገና በመሣሪያ') {
            routine = res[i].cost_per_km;
          } else if (res[i].name == 'ወቅታዊ ጥገና') {
            periodic = res[i].cost_per_km;
          } else {
          }
        }
      },
    });
  },
  for_analyze_assumption: function (frm, cdt, cdn) {
    var costPerkm = 0;
    if (frm.doc.type == 'Periodic') {
      costPerkm = periodic;
    } else if (frm.doc.type == 'Routine') {
      costPerkm = routine;
    }
  frm.set_value("activity_work_payment_ask_cost",costPerkm*frm.doc.for_analyze_assumption)
 frm.refresh_field("activity_work_payment_ask_cost")
  },
});
frappe.ui.form.on ('Man Rc Table', {
  data1: function (frm, cdt, cdn) {
    updateTotalsProduct (
      frm,
      cdt,
      cdn,
      'skilled_manpower_running_cost',
      'skilled_manpower_cost',
      3
    );
  },
  data2: function (frm, cdt, cdn) {
    updateTotalsProduct (
      frm,
      cdt,
      cdn,
      'skilled_manpower_running_cost',
      'skilled_manpower_cost',
      3
    );
  },
  data3: function (frm, cdt, cdn) {
    updateTotalsProduct (
      frm,
      cdt,
      cdn,
      'skilled_manpower_running_cost',
      'skilled_manpower_cost',
      3
    );
  },
  data4: function (frm, cdt, cdn) {
    updateTotalsProduct (
      frm,
      cdt,
      cdn,
      'skilled_manpower_running_cost',
      'skilled_manpower_cost',
      3
    );
  },
});

function updateTotalsSum (frm, cdt, cdn, rowField, totalField, dataLength) {
  var child = locals[cdt][cdn];
  calculateRowTotalSum (frm, child, rowField, dataLength);
  calculateRowsTotal (frm, rowField, totalField);
}
function updateTotalsProduct (frm, cdt, cdn, rowField, totalField, dataLength) {
  var child = locals[cdt][cdn];
  calculateRowTotalProduct (frm, child, rowField, dataLength);
  calculateRowsTotal (frm, rowField, totalField);
}
function calculateRowTotalSum (frm, child, field, dataLength) {
  var rowTotal = 0;
  for (var i = 1; i <= dataLength; i++) {
    rowTotal += child[`data${i}`] || 0;
  }
  child.row_total = rowTotal;
  frm.refresh_field (field);
}
function calculateRowTotalProduct (frm, child, field, dataLength) {
  var rowTotal = 1;
  for (var i = 1; i <= dataLength; i++) {
    rowTotal *= child[`data${i}`] || 1;
  }
  child.row_total = rowTotal;
  frm.refresh_field (field);
}

function calculateRowsTotal (frm, table, field) {
  var rowsTotal = frm.doc[table].reduce (
    (total, row) => total + (row.row_total || 0),
    0
  );
  frm.set_value (field, rowsTotal);
  frm.refresh_field (field);
}

function calculateBalance (frm) {
  var type = frm.doc.data_1;
  var costPerkm = 0;
  if (frm.doc.type == 'Periodic') {
    costPerkm = periodic;
  } else if (frm.doc.type == 'Routine') {
    costPerkm = routine;
  }
  var activityCost = costPerkm * (frm.doc.for_analyze_assumption || 1);
  var manpowerCost = frm.doc.skilled_manpower_cost;
  var operationCost = 0.8 * activityCost;
  var generallRunning=((frm.doc.equipment_running_cost||0)+(frm.doc.material_running_cost||0)+(frm.doc.skilled_manpower_cost||0))
  var overheadCost = generallRunning * 0.15;
  var expCost = generallRunning + overheadCost;
  frm.set_value ('km_cost_birr', costPerkm);
  frm.set_value ('activity_work_payment_ask_cost', activityCost);
  frm.set_value ('operation_cost', 0.8 * activityCost);
  frm.set_value ('generally_running_cost',generallRunning);
  frm.set_value ('manpower__running_cost', manpowerCost);
  frm.set_value ('over_head_costs_15', overheadCost);
  frm.set_value ('total_expenditure_cost', expCost);
  frm.set_value ('balance_cost', operationCost - expCost);
  frm.refresh ();
}
