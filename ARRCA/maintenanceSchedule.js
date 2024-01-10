cur_frm.add_fetch ('item_code', 'item_name', 'item_name');
cur_frm.add_fetch ('item_code', 'description', 'description');
cur_frm.add_fetch ('item_code', 'stock_uom', 'uom');
cur_frm.add_fetch ('item_code', 'location', 'location');
cur_frm.add_fetch ('item_code', 'valuation_rate', 'unit_price');

cur_frm.add_fetch ('tech_id', 'employee_name', 'employee_name');
cur_frm.add_fetch ('tech_id', 'salary', 'salary');

cur_frm.add_fetch ('task', 'durationhour', 'duration');

cur_frm.add_fetch ('vehicle_plate_no', 'chasis_no', 'chasis_number');

frappe.ui.form.on ('Maintenance Schedule Item', {
  start_date_ec: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.start_date_ec) {
      var date = convertDateTOGC (row.start_date_ec.toString ());
      var dateObject = new Date (date);
      var formattedDate = dateObject.toISOString ().slice (0, 10);
      row.start_date = formattedDate;
      frm.refresh_field ('items');
    }
  },
});

frappe.ui.form.on ('Maintenance Schedule Item', {
  end_date_ec: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.end_date_ec) {
      var date = convertDateTOGC (row.end_date_ec.toString ());
      var dateObject = new Date (date);
      var formattedDate = dateObject.toISOString ().slice (0, 10);
      row.end_date = formattedDate;
      frm.refresh_field ('items');
    }
  },
});

frappe.ui.form.on ('Description of Maintenance Type', {
  equipment_specific_type: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here');
    frappe.meta.get_docfield (
      'Description of Maintenance Type',
      'task',
      frm.doc.name
    ).get_query = function () {
      return {
        filters: {
          specific_equipment_type: row.equipment_specific_type,
        },
      };
    };
    if (frm.doc.equipment_type) {
      frappe.meta.get_docfield (
        'Description of Maintenance Type',
        'task',
        frm.doc.name
      ).get_query = function () {
        return {
          filters: {
            specific_equipment_type: row.equipment_specific_type,
            equipment_type: frm.doc.equipment_type,
          },
        };
      };
    }
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
});

var warehouses = [];
frappe.ui.form.on ('Maintenance Schedule', {
  schedule_date_ec: function (frm) {
    if (frm.doc.schedule_date_ec) {
      var date = convertDateTOGC (frm.doc.schedule_date_ec.toString ());
      var dateObject = new Date (date);
      // Format the date as a string in a desired format
      var formattedDate = dateObject.toISOString ().slice (0, 10); // YYYY-MM-DD
      frm.set_value ('date', formattedDate);
      frm.refresh_field ('date');
    }
  },
  warehouse: function (frm, cdt, cdn) {
    console.log ('group here is ', frm.doc.warehouse);
    frm.fields_dict['items'].grid.get_field ('location').get_query = function (
      doc,
      cdt,
      cdn
    ) {
      return {
        filters: [['name', 'in', warehouses]],
      };
    };
    frm.refresh_field ('warehouse');
    frm.refresh_field ('items');
    frm.fields_dict['items'].grid.refresh ();
    // Refresh the 'group' field
  },
  refresh: function (frm, cdt, cdn) {
    console.log ('group here is ', frm.doc.warehouse);
    frm.fields_dict['items'].grid.get_field ('location').get_query = function (
      doc,
      cdt,
      cdn
    ) {
      return {
        filters: [['name', 'in', warehouses]],
      };
    };
    frm.refresh_field ('warehouse');
    frm.refresh_field ('items');
    frm.fields_dict['items'].grid.refresh ();
    // Refresh the 'group' field
  },
});
//complain_detail...table field in parent field
//name_of_task.....field in the current table we want to set
//group_main....field in doctype Maintaince case Linked by name_of_task field
//group...parent field in the current document linked to
//please be takecare name_of_task Link field and group_main in another doctype not in this child table

frappe.ui.form.on ('Maintenance Schedule', {
  po_no: function (frm) {
    if (frm.doc.po_no) {
      frm.clear_table ('items_from_purchase_order');
      console.log ('Test 1');
      frappe.model.with_doc ('Purchase Order', frm.doc.po_no, function () {
        console.log ('Test 2', frm.doc.po_no);
        let source_doc = frappe.model.get_doc ('Purchase Order', frm.doc.po_no);
        console.log ('source doc', source_doc);
        $.each (source_doc.items, function (index, source_row) {
          console.log ('Test 3');
          const target_row = frm.add_child ('items_from_purchase_order');
          target_row.item_code = source_row.item_code;
          target_row.stock_quantity = source_row.stock_quantity;
          target_row.item_name = source_row.item_name;
          target_row.uom = source_row.uom;
          target_row.amount = source_row.amount;
          target_row.qty = source_row.qty;
          target_row.rate = source_row.rate;
          target_row.description = source_row.description;
        });

        frm.refresh_field ('items_from_purchase_order');
      });
    }
  },
});

frappe.ui.form.on ('Maintenance Schedule Item', {
  qty: function (frm, cdt, cdn) {
    calSpare (frm, cdt, cdn);
  },
  unit_price: function (frm, cdt, cdn) {
    calSpare (frm, cdt, cdn);
  },
});

function calSpare (frm, cdt, cdn) {
  var row = locals[cdt][cdn];
  if (row.unit_price && row.qty) {
    console.log ('i am also here');
    row.total_price = row.qty * row.unit_price;
  }
  calSpareTotal (frm);
  frm.refresh_field ('items');
}

function calSpareTotal (frm) {
  var table = frm.doc.items;
  console.log ('tables', table);
  if (table) {
    var total = 0;
    table.map (item => {
      total += item.total_price;
    });
    console.log ('total', total);
    frm.set_value ('total_item_cost', total);
    frm.refresh_field ('total_item_cost');
  }
  calGrandTotal (frm);
}

function calGrandTotal (frm) {
  var labor = frm.doc.total_labor_cost;
  var spare = frm.doc.total_item_cost;
  var total = (labor || 0) + (spare || 0);
  frm.set_value ('total_cost', total);
  frm.refresh_field ('total_cost');
}

frappe.ui.form.on ('Maintenance Schedule Item', {
  item_code: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    frappe.call ({
      method: 'frappe.client.get_list',
      args: {
        doctype: 'Stock Ledger Entry',
        filters: {
          item_code: child.item_code,
        },
        fields: ['*'],
      },
      callback: function (response) {
        if (response.message) {
          let warehouseEntries = {};

          response.message.forEach (entry => {
            if (!warehouseEntries[entry.warehouse]) {
              warehouseEntries[entry.warehouse] = entry;
            } else {
              if (
                new Date (entry.posting_time) >
                new Date (warehouseEntries[entry.warehouse].posting_time)
              ) {
                warehouseEntries[entry.warehouse] = entry;
              }
            }
          });

          let total = 0;
          Object.values (warehouseEntries).forEach (entry => {
            total += entry.qty_after_transaction;
          });

          // Set the stock_quantity field
          frappe.model.set_value (cdt, cdn, 'stock_quantity', total);

          // Set the location field with all warehouses
          let warehouseArray = Object.keys (warehouseEntries);
          warehouses = warehouseArray;
          frm.fields_dict['items'].grid.get_field (
            'location'
          ).get_query = function (doc, cdt, cdn) {
            return {
              filters: [['name', 'in', warehouseArray]],
            };
          };

          frm.refresh_field ('items');
        }
      },
    });
  },

  location: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var warehouse = child.location;

    if (child.item_code) {
      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Stock Ledger Entry',
          filters: {
            item_code: child.item_code,
          },
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            let warehouseEntries = {};

            response.message.forEach (entry => {
              if (!warehouseEntries[entry.warehouse]) {
                warehouseEntries[entry.warehouse] = entry;
              } else {
                if (
                  new Date (entry.posting_time) >
                  new Date (warehouseEntries[entry.warehouse].posting_time)
                ) {
                  warehouseEntries[entry.warehouse] = entry;
                }
              }
            });

            let total = 0;
            let warehouse_balance = 0;

            Object.values (warehouseEntries).forEach (entry => {
              if (entry.warehouse == warehouse) {
                warehouse_balance += entry.qty_after_transaction;
              }
              total += entry.qty_after_transaction;
            });

            frappe.model.set_value (cdt, cdn, 'stock_quantity', total);
            frappe.model.set_value (
              cdt,
              cdn,
              'store_balance',
              warehouse_balance
            );

            frm.refresh_field ('items');
          }
        },
      });
    }
  },
});

frappe.ui.form.on ('Purchase Order Item', {
  //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
  item_code: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    // Fetch information from the linked doctype using a server call
    frappe.call ({
      method: 'frappe.client.get_value',
      args: {
        doctype: 'Stock Ledger Entry',
        filters: {item_code: child.item_code},
        fieldname: ['qty_after_transaction'],
      },
      callback: function (response) {
        if (response.message) {
          // Update the "equipment_type" field in the current child table row
          frappe.model.set_value (
            cdt,
            cdn,
            'stock_quantity',
            response.message.qty_after_transaction
          );
          frappe.model.set_df_property (
            cdt,
            cdn,
            'stock_quantity',
            'read_only',
            1
          ); // Make stock_quantity readonly
          frm.refresh_field ('items');
          //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_
        }
      },
    });
  },
});

//generating the 4 maintenace plan
frappe.ui.form.on ('Maintenance Schedule', {
  generate_plan: function (frm, cdt, cdn) {
    console.log ('abebe beso bela');
    if (frm.doc.equipment_type) {
      frm.doc.plan_1 = [];
      frm.doc.plan_2 = [];
      frm.doc.plan_3 = [];
      frm.doc.plan_4 = [];
      frm.doc.plan_5 = [];
    }

    if (frm.doc.equipment_type == 'Light Vehicle') {
      console.log ('we are light');

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 1-Light Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          console.log ('response', response);
          if (response.message) {
            var plan_one = response.message;
            plan_one.map ((item, idx) => {
              var table = frm.add_child ('plan_1');
              table.name_of_task = item.task;
            });
            frm.doc.km = 5000;
            frm.refresh_field ('km');
            frm.refresh_field ('plan_1');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 2-Light Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_two = response.message;
            plan_two.map ((item, idx) => {
              var table = frm.add_child ('plan_2');
              table.name_of_task = item.task;
            });
            frm.doc.km2 = 10000;
            frm.refresh_field ('km2');
            frm.refresh_field ('plan_2');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 3-Light Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_three = response.message;

            plan_three.map ((item, idx) => {
              var table = frm.add_child ('plan_3');
              table.name_of_task = item.task;
            });
            frm.doc.km3 = 40000;
            frm.refresh_field ('km3');
            frm.refresh_field ('plan_3');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 4-Light Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_four = response.message;
            plan_four.map ((item, idx) => {
              var table = frm.add_child ('plan_4');
              table.name_of_task = item.task;
            });
            frm.doc.km4 = 100000;
            frm.refresh_field ('km4');
            frm.refresh_field ('plan_4');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 5-Light Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_five = response.message;
            plan_five.map ((item, idx) => {
              var table = frm.add_child ('plan_5');
              table.name_of_task = item.task;
            });
            frm.doc.km5 = 200000;
            frm.refresh_field ('km5');
            frm.refresh_field ('plan_5');
          }
        },
      });
    }

    if (frm.doc.equipment_type == 'Heavy Duty Vehicle') {
      console.log ('we are heavy');

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 1-Heavy Duty Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          console.log ('response', response);
          if (response.message) {
            var plan_one = response.message;
            plan_one.map ((item, idx) => {
              var table = frm.add_child ('plan_1');
              table.name_of_task = item.task;
            });
            frm.doc.km = 10000;
            frm.refresh_field ('km');
            frm.refresh_field ('plan_1');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 2-Heavy Duty Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_two = response.message;
            plan_two.map ((item, idx) => {
              var table = frm.add_child ('plan_2');
              table.name_of_task = item.task;
            });
            frm.doc.km2 = 20000;
            frm.refresh_field ('km2');
            frm.refresh_field ('plan_2');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 3-Heavy Duty Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_three = response.message;

            plan_three.map ((item, idx) => {
              var table = frm.add_child ('plan_3');
              table.name_of_task = item.task;
            });
            frm.doc.km3 = 60000;
            frm.refresh_field ('km3');
            frm.refresh_field ('plan_3');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 4-Heavy Duty Vehicle'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_four = response.message;
            plan_four.map ((item, idx) => {
              var table = frm.add_child ('plan_4');
              table.name_of_task = item.task;
            });
            frm.doc.km4 = 12000;
            frm.refresh_field ('km4');
            frm.refresh_field ('plan_4');
          }
        },
      });
    }

    if (frm.doc.equipment_type == 'Machinery') {
      console.log ('we are machinery');

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 1-Machinery'},
          fields: ['*'],
        },
        callback: function (response) {
          console.log ('response', response);
          if (response.message) {
            var plan_one = response.message;
            plan_one.map ((item, idx) => {
              var table = frm.add_child ('plan_1');
              table.name_of_task = item.task;
            });
            frm.doc.hr = 250;
            frm.refresh_field ('hr');
            frm.refresh_field ('plan_1');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 2-Machinery'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_two = response.message;
            plan_two.map ((item, idx) => {
              var table = frm.add_child ('plan_2');
              table.name_of_task = item.task;
            });
            frm.doc.hr2 = 500;
            frm.refresh_field ('hr2');
            frm.refresh_field ('plan_2');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 3-Machinery'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_three = response.message;

            plan_three.map ((item, idx) => {
              var table = frm.add_child ('plan_3');
              table.name_of_task = item.task;
            });
            frm.doc.hr3 = 2000;
            frm.refresh_field ('hr3');
            frm.refresh_field ('plan_3');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 4-Machinery'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_four = response.message;
            plan_four.map ((item, idx) => {
              var table = frm.add_child ('plan_4');
              table.name_of_task = item.task;
            });
            frm.doc.hr4 = 6000;
            frm.refresh_field ('hr4');
            frm.refresh_field ('plan_4');
          }
        },
      });

      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'MP Table',
          filters: {parent: 'MP 5-Machinery'},
          fields: ['*'],
        },
        callback: function (response) {
          if (response.message) {
            var plan_five = response.message;
            plan_five.map ((item, idx) => {
              var table = frm.add_child ('plan_5');
              table.name_of_task = item.task;
            });
            frm.doc.hr5 = 10000;
            frm.refresh_field ('hr5');
            frm.refresh_field ('plan_5');
          }
        },
      });
    }

    frm.refresh_field ('plan_1');
    frm.refresh_field ('plan_2');
    frm.refresh_field ('plan_3');
    frm.refresh_field ('plan_4');
    frm.refresh_field ('plan_5');
  },
});

frappe.ui.form.on ('Description of Maintenance Type', {
  task: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    console.log ('child task', child.task);
    frappe.call ({
      method: 'frappe.client.get_list',
      args: {
        doctype: 'Spare Parts For Activities',
        filters: {parent: child.task},
        fields: ['*'],
      },
      callback: function (response) {
        if (response.message) {
          var parts = response.message;
          console.log ('parts', parts);
          parts.map (item => {
            var table = frm.add_child ('items');
            table.item_name = item.name1;
          });
          frm.refresh_field ('items');
        }
      },
    });
  },
});

//calculate the labor cost
frappe.ui.form.on ('Description of Maintenance Type', {
  tech_id: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here', row);
    if (row.duration && row.salary) {
      var labor_cost =
        row.salary *
        12 /
        1778 *
        1.15 *
        1.1 *
        parseFloat (row.duration) *
        (row.uf || 1);
      console.log ('labor cost', labor_cost);
    }
    row.labor_cost = labor_cost;
    calculateTotalLaborCost (frm);
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
  task: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here', row);

    if (row.duration && row.salary) {
      var labor_cost =
        row.salary *
        12 /
        1778 *
        1.15 *
        1.1 *
        parseFloat (row.duration) *
        (row.uf || 1);
      console.log ('labor cost', labor_cost);
    }
    row.labor_cost = labor_cost;
    calculateTotalLaborCost (frm);
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
  duration: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here', row);

    if (row.duration && row.salary) {
      var labor_cost =
        row.salary *
        12 /
        1778 *
        1.15 *
        1.1 *
        parseFloat (row.duration) *
        (row.uf || 1);
      console.log ('labor cost', labor_cost);
    }
    row.labor_cost = labor_cost;
    calculateTotalLaborCost (frm);
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
  salary: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here', row);

    if (row.duration && row.salary) {
      var labor_cost =
        row.salary *
        12 /
        1778 *
        1.15 *
        1.1 *
        parseFloat (row.duration) *
        (row.uf || 1);
      console.log ('labor cost', labor_cost);
    }
    row.labor_cost = labor_cost;
    calculateTotalLaborCost (frm);
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
  uf: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here', row);

    if (row.duration && row.salary) {
      var labor_cost =
        row.salary *
        12 /
        1778 *
        1.15 *
        1.1 *
        parseFloat (row.duration) *
        (row.uf || 1);
      console.log ('labor cost', labor_cost);
    }
    row.labor_cost = labor_cost;
    calculateTotalLaborCost (frm);
    frm.refresh_field ('descriptions_of_maintenance_type');
  },
});

function calculateTotalLaborCost (frm) {
  var table = frm.doc.descriptions_of_maintenance_type;
  console.log ('table', table);
  var total_labor_cost = 0;

  table.map (row => {
    console.log ('row cost', row.labor_cost);
    total_labor_cost += row.labor_cost;
  });
  console.log ('total labor cost', total_labor_cost);
  frm.set_value ('total_labor_cost', total_labor_cost);
  frm.refresh_field ('total_labor_cost');
  calGrandTotal (frm);
}

frappe.ui.form.on ('Maintenance Schedule', {
  generate_schedules: function (frm, cdt, cdn) {
    var items = frm.doc.items;
    console.log ('child task', items);
    frm.doc.schedules = [];
    items.map((item) => {
    var schedules = createScheduleList(item.start_date_ec, item.end_date_ec, item.no_of_visit)
    console.log("shedules", schedules)

    })
  },
});


function createScheduleList(start_date, end_date, no_of_visit) {
    let schedule_list = [];

    // Splitting date strings into day, month, and year for Ethiopian calendar
    let [from_day_ec, from_month_ec, from_year_ec] = start_date.split('/').map(Number);
    let [to_day_ec, to_month_ec, to_year_ec] = end_date.split('/').map(Number);

    // Creating Date objects for the given dates in Ethiopian calendar
    let start_date_ec = new Date(from_year_ec, from_month_ec - 1, from_day_ec);
    let end_date_ec = new Date(to_year_ec, to_month_ec - 1, to_day_ec);
    console.log("start date ec", start_date_ec)
    console.log("end date ec", end_date_ec)

    let start_date_ec_copy = new Date(start_date_ec);
    let date_diff = Math.floor((end_date_ec - start_date_ec) / (1000 * 60 * 60 * 24));
    console.log("day difference", date_diff)
    let add_by = date_diff / no_of_visit;

    for (let visit = 0; visit < no_of_visit; visit++) {
        if (start_date_ec_copy < end_date_ec) {
            start_date_ec_copy.setDate(start_date_ec_copy.getDate() + add_by);
            if (schedule_list.length < no_of_visit) {
                let schedule_date_ec = start_date_ec_copy
                if (schedule_date_ec > end_date_ec) {
                    schedule_date_ec = end_date_ec;
                }
                schedule_list.push(schedule_date_ec);
            }
        }
    }

    return schedule_list;
}

