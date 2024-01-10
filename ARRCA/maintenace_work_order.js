cur_frm.add_fetch ('part_no', 'item_name', 'item_name');
cur_frm.add_fetch (
  'part_no',
  'description',
  'description_parts_or_lubricants_or_materials_or_issued'
);
cur_frm.add_fetch ('part_no', 'stock_uom', 'uom');

cur_frm.add_fetch ('labor_id', 'employee_name', 'labor_name');
cur_frm.add_fetch ('labor_id', 'salary', 'salary');
cur_frm.add_fetch ('activity', 'durationhour', 'durationhr');

cur_frm.add_fetch ('technician_id', 'employee_name', 'technician_name');
cur_frm.add_fetch ('technician_id', 'salary', 'salary');

cur_frm.add_fetch ('task', 'durationhour', 'duration');

cur_frm.add_fetch ('serial_or_plate_no', 'chasis_no', 'chasis_no');
cur_frm.add_fetch ('serial_or_plate_no', 'model', 'model');
cur_frm.add_fetch ('serial_or_plate_no', 'location', 'location');

cur_frm.add_fetch ('item_code', 'item_name', 'item_name');
cur_frm.add_fetch ('item_code', 'stock_uom', 'uom');
cur_frm.add_fetch ('item_code', 'location', 'location');

//calculate the labor cost
frappe.ui.form.on ('Work Assigned', {
  technician_id: function (frm, cdt, cdn) {
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
    frm.refresh_field ('work_done_completed_by_inspector');
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
    frm.refresh_field ('work_done_completed_by_inspector');
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
    frm.refresh_field ('work_done_completed_by_inspector');
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
    frm.refresh_field ('work_done_completed_by_inspector');
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
    frm.refresh_field ('work_done_completed_by_inspector');
  },
});

function calculateTotalLaborCost (frm) {
  var table = frm.doc.work_done_completed_by_inspector;
  console.log ('table', table);
  var total_labor_cost = 0;

  table.map (row => {
    console.log ('row cost', row.labor_cost);
    total_labor_cost += row.labor_cost;
  });
  calculateTotal (frm);
  console.log ('total labor cost', total_labor_cost);
  frm.set_value ('total_labor_cost', total_labor_cost);
  frm.refresh_field ('total_labor_cost');
}

frappe.ui.form.on ('Replaced parts', {
  cost_summary_type: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.cost_summary_type & row.qty) {
      row.cost_summary_birr = row.cost_summary_type * row.qty;
      console.log ('total', row.cost_summary_birr);
      totalCostCalculator (frm);
      frm.refresh_field ('replaced_part_and_labor_cost_summary');
    }
  },
  qty: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.cost_summary_type & row.qty) {
      row.cost_summary_birr = row.cost_summary_type * row.qty;
      console.log ('total', row.cost_summary_birr);
      totalCostCalculator (frm);
      frm.refresh_field ('replaced_part_and_labor_cost_summary');
    }
  },
});

function totalCostCalculator (frm) {
  var total_cost = 0;
  $.each (frm.doc.replaced_part_and_labor_cost_summary, function (i, d) {
    console.log ('total cost', total_cost);
    total_cost += d.cost_summary_birr;
  });
  frm.set_value ('total_item_cost', total_cost);
  calculateTotal (frm);
  frm.refresh_field ('total_item_cost');
}

function calculateTotal (frm) {
  var total = (frm.doc.total_labor_cost || 0) + (frm.doc.total_item_cost || 0);
  console.log ('total', total);
  frm.set_value ('total_cost', total);
  frm.refresh_field ('total_cost');
}

frappe.ui.form.on ('Work Assigned', {
  main_parts: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here');
    frappe.meta.get_docfield (
      'Work Assigned',
      'task',
      frm.doc.name
    ).get_query = function () {
      return {
        filters: {
          specific_equipment_type: row.main_parts,
        },
      };
    };
    if (frm.doc.equipment_type && row.main_parts) {
      frappe.meta.get_docfield (
        'Work Assigned',
        'task',
        frm.doc.name
      ).get_query = function () {
        return {
          filters: {
            specific_equipment_type: row.main_parts,
            equipment_type: frm.doc.equipment_type,
          },
        };
      };
    }
    frm.refresh_field ('work_done_completed_by_inspector');
  },
});

frappe.ui.form.on ('Complain Table', {
  budn: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here');
    frappe.meta.get_docfield (
      'Complain Table',
      'act',
      frm.doc.name
    ).get_query = function () {
      return {
        filters: {
          specific_equipment_type: row.budn,
        },
      };
    };
    if (frm.doc.equipment_type && row.budn) {
      frappe.meta.get_docfield (
        'Complain Table',
        'act',
        frm.doc.name
      ).get_query = function () {
        return {
          filters: {
            specific_equipment_type: row.budn,
            equipment_type: frm.doc.equipment_type,
          },
        };
      };
    }
    frm.refresh_field ('complain_detail');
  },
});

frappe.ui.form.on ('Complain Table For Inspector', {
  budn: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log ('we are here');
    frappe.meta.get_docfield (
      'Complain Table For Inspector',
      'act',
      frm.doc.name
    ).get_query = function () {
      return {
        filters: {
          specific_equipment_type: row.budn,
        },
      };
    };
    if (frm.doc.equipment_type && row.budn) {
      frappe.meta.get_docfield (
        'Complain Table For Inspector',
        'act',
        frm.doc.name
      ).get_query = function () {
        return {
          filters: {
            specific_equipment_type: row.budn,
            equipment_type: frm.doc.equipment_type,
          },
        };
      };
    }
    frm.refresh_field ('problem_identification');
  },
});

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

frappe.ui.form.on ('work done', {
  technician_name: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    if (frm.doc.serial_or_plate_no) {
      var plat_no = frm.doc.serial_or_plate_no;
      var technician_name = child.technician_name;
      var date_ec = frm.doc.date_ec;
      var date = frm.doc.date;
      frappe.call ({
        method: 'frappe.client.get_list',
        args: {
          doctype: 'Stock Entry',
          filters: {
            plate_no: plat_no,
            transfer_no: technician_name,
            posting_date_ec: date_ec
              ? date ? ['between', [date_ec, date]] : ['>=', date_ec]
              : date ? ['<=', date] : undefined,
          },
          fields: ['name'],
        },
        callback: function (response) {
          if (response.message.length > 0) {
            console.log ('response', response.message);
            response.message.forEach (function (stockEntry) {
              frappe.call ({
                method: 'frappe.client.get_list',
                args: {
                  doctype: 'Stock Entry Detail',
                  filters: {
                    parent: stockEntry.name,
                  },
                  fields: ['*'],
                },
                callback: function (resp) {
                  if (resp.message) {
                    var source = resp.message;
                    console.log ('response for the detail', resp.message);
                    source.forEach (function (detail) {
                      var rowTable = frm.add_child (
                        'replaced_part_and_labor_cost_summary'
                      );
                      console.log ('row table', rowTable);
                      rowTable.part_no = detail.item_code;
                      rowTable.description_parts_or_lubricants_or_materials_or_issued =
                        detail.item_name;
                      rowTable.uom = detail.uom;
                      rowTable.qty = detail.qty;
                      rowTable.cost_summary_type = detail.rate;
                      rowTable.cost_summary_birr = detail.amount;
                      frm.refresh_field (
                        'replaced_part_and_labor_cost_summary'
                      );
                    });
                  }
                  totalCostCalculator (frm);
                },
              });
            });
          } else {
            frappe.show_alert (
              `There is no Stock Entry(ሞዴል 22) which has plate no: ${plat_no}, technician name: ${technician_name} and date: ${date_ec}`
            );
          }
        },
      });
    }
  },
});

frappe.ui.form.on ('work done', {
  date_ec: function (frm) {
    if (frm.doc.date_ec) {
      var date = convertDateTOGC (frm.doc.date_ec.toString ());
      frm.set_value ('date', date);
      frm.refresh_field ('date');
    }
  },
});

frappe.ui.form.on ('Maintenance Work order', {
  date_ec: function (frm) {
    if (frm.doc.date_ec) {
      var date = convertDateTOGC (frm.doc.date_ec.toString ());
      var dateObject = new Date (date);
      // Format the date as a string in a desired format
      var formattedDate = dateObject.toISOString ().slice (0, 10); // YYYY-MM-DD
      frm.set_value ('from_date_gc', formattedDate);
      frm.refresh_field ('from_date_gc');
    }
  },
  date: function (frm) {
    if (frm.doc.date_ec) {
      var date = convertDateTOGC (frm.doc.date.toString ());
      var dateObject = new Date (date);
      var formattedDate = dateObject.toISOString ().slice (0, 10); // YYYY-MM-DD
      frm.set_value ('to_date_gc', formattedDate);
      frm.refresh_field ('to_date_gc');
    }
  },
});

frappe.ui.form.on ('Complain Table', {
  group: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    var group = child.group;
    // Set the value of 'group' field
    frm.set_value ('group', group);
    console.log ('the group is', frm.doc.group);
    console.log ('step 1');
    frm.refresh_field ('group');
    frm.refresh_field ('complain_detail');
    // Refresh the 'complain_detail' grid to apply the changes
    frm.fields_dict['complain_detail'].grid.refresh ();
    console.log ('step2');
    // Refresh the 'group' field
  },
});

frappe.ui.form.on ('Maintenance Work order', {
  group: function (frm, cdt, cdn) {
    console.log ('group here is ', frm.doc.group);
    frm.fields_dict['complain_detail'].grid.get_field (
      'name1'
    ).get_query = function (doc, cdt, cdn) {
      return {
        filters: {
          group_main: frm.doc.group,
        },
      };
    };
    frm.refresh_field ('group');
    frm.refresh_field ('complain_detail');
    frm.fields_dict['complain_detail'].grid.refresh ();
    // Refresh the 'group' field
  },
  refresh: function (frm, cdt, cdn) {
    console.log ('group here is ', frm.doc.group);
    frm.fields_dict['complain_detail'].grid.get_field (
      'name1'
    ).get_query = function (doc, cdt, cdn) {
      return {
        filters: {
          group_main: frm.doc.group,
        },
      };
    };
    frm.refresh_field ('group');
    frm.refresh_field ('complain_detail');
    frm.fields_dict['complain_detail'].grid.refresh ();
    // Refresh the 'group' field
  },
});

frappe.ui.form.on ('Maintenance Work order', {
  serial_or_plate_no: function (frm) {
    frappe.call ({
      method: 'frappe.client.get_list',
      args: {
        doctype: 'Maintenance Schedule',
        filters: {
          vehicle_plate_no: frm.doc.serial_or_plate_no,
        },
        fields: ['*'],
      },
      callback: async function (response) {
        if (response && response.message && response.message.length > 0) {
          var plan = response.message[0];
          console.log ('plan', plan.name);
          frappe.call ({
            method: 'frappe.client.get_list',
            args: {
              doctype: 'Description of Maintenance Type',
              filters: {
                parent: plan.name, // Accessing plan name instead of the whole plan object
              },
              fields: ['*'],
            },
            callback: async function (rsp) {
              if (rsp && rsp.message) {
                var tasks = rsp.message;
                console.log ('tasks', tasks);
                var uniqueTasks = {}; // Object to store unique tasks

                // Filtering unique tasks based on 'task' property
                tasks.forEach (row => {
                  uniqueTasks[row.task] = row;
                });

                frm.doc.work_done_completed_by_inspector = [];
                // Adding unique tasks to the table
                Object.values (uniqueTasks).forEach (task => {
                  var table = frm.add_child (
                    'work_done_completed_by_inspector'
                  );
                  table.main_parts = task.equipment_specific_type;
                  table.task = task.task;
                  table.duration = task.duration;
                });
                frm.refresh_field ('work_done_completed_by_inspector');
              }
            },
          });
        }
      },
    });
  },
});

//populate the finish time from the start time and the duration of the task automatically.
frappe.ui.form.on ('Work Assigned', {
  started_date_and_time: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    var startDateTime = new Date (row.started_date_and_time);
    var duration = parseFloat (row.duration);
    var endTimeInMillis = startDateTime.getTime () + duration * 60 * 60 * 1000;
    var endTime = new Date (endTimeInMillis);
    var formattedEndTime = frappe.datetime.str_to_user (endTime);
    console.log ('formated end timem', formattedEndTime);
    row.completed_date_and_time = endTime;
    frm.refresh_field ('work_done_completed_by_inspector');
  },
});

frappe.ui.form.on ('Maintenance Work Orders By Technician', {
  qty: function (frm, cdt, cdn) {
    console.log ('i am here');
    var row = locals[cdt][cdn];
    if (row.unit_price) {
      console.log ('i am also here');
      row.total_price = row.qty * row.unit_price;
    }
    frm.refresh_field ('items');
  },
});

frappe.ui.form.on ('Maintenance Work Orders By Technician', {
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




frappe.ui.form.on ('Maintenance Work order', {
  before_submit: function (frm) {
    console.log("On Summit")
    frappe.call ({
      method: 'erpnext.update_equipment_status.update_equipment_status',
      args: {
        serial_or_plate_no: frm.doc.serial_or_plate_no,
        action: 'submit',
      },
      callback: function (r) {
        frappe.msgprint(`Vehicle or Machinery (${frm.doc.serial_or_plate_no}) set to Non-Operable.`);
        console.log ('message', r);
      },
    });
  },
  on_trash: function(frm) {
    console.log("On Cancel");
    frappe.call({
      method: 'erpnext.update_equipment_status.update_equipment_status',
      args: {
        serial_or_plate_no: frm.doc.serial_or_plate_no,
        action: 'cancel',
      },
      callback: function(r) {
        frappe.msgprint(`Vehicle or Machinery (${frm.doc.serial_or_plate_no}) set to Operable.`);
        console.log ('message', r);
      },
    });
  }
});
