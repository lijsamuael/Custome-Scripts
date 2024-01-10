cur_frm.add_fetch('activity', 'quantity', 'quantity');
cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
cur_frm.add_fetch('activity', 'unit', 'uom');
cur_frm.add_fetch('activity', 'subject', 'activity_name');
cur_frm.add_fetch('activity', 'productivity', 'productivity');
cur_frm.add_fetch('activity', 'duration_in_days', 'duration');
cur_frm.add_fetch('activity', 'task_amount', 'amount');



//fetch the attributes of the wbs
cur_frm.add_fetch('task_id', 'percent_of_finance', 'financial_weight_percentage');
cur_frm.add_fetch('task_id', 'percent_of_duration', 'duration_weight_percentage');
cur_frm.add_fetch('task_id', 'task_physical_weightage', 'duration_weight');
cur_frm.add_fetch('task_id', 'task_financial_weightage', 'financial_weight');
cur_frm.add_fetch('task_id', 'weighted_avarage', 'average_weight');

cur_frm.add_fetch('task_id', 'subject', 'task_name');
cur_frm.add_fetch('task_id', 'unit', 'uom');
cur_frm.add_fetch('task_id', 'quantity', 'contract_qty');
cur_frm.add_fetch('task_id', 'activity_unit_rate', 'task_unit_rate');
cur_frm.add_fetch('task_id', 'task_amount', 'amount');
cur_frm.add_fetch('task_id', 'duration_in_days', 'duration');


cur_frm.add_fetch('id_mac', 'type', 'task_unit_rate');
cur_frm.add_fetch('id_mac', 'mc_number', 'equp_no');
cur_frm.add_fetch('id_mac', 'uf', 'uf');
cur_frm.add_fetch('id_mac', 'efficiency', 'efficency');
cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');

//adding the predecessor the the wbs
frappe.ui.form.on('Operational Plan Machinery Detail', {
	equp_no: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	},
    efficency: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	},
    rental_rate: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	},
    uf: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	},
    qty: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	},
    productivity: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
        row.total_hourly_cost = (row.efficency || 1) * (row.rental_rate || 1) * (row.uf || 1) * (row.qty || 1) * (row.productivity || 1)
        refresh_field("machinery")
	}
});


frappe.ui.form.on('Master Plan', {
    cal_equip: function(frm, cdt, cdn) {
		console.log("test 1")
        var total = 0;
        frm.doc.machinery.map((row) => {
            total += row.total_hourly_cost;
        })
        frm.doc.equipment_total_cost = total;
        frm.refresh_field("equipment_total_cost")
	},
    cal_man: function(frm, cdt, cdn) {
		console.log("test 1")
        var total = 0;
        frm.doc.manpower1.map((row) => {
            total += row.total_hourly_cost;
        })
        frm.doc.man_power_total_cost = total;
        frm.refresh_field("man_power_total_cost")
	},
    cal_mat: function(frm, cdt, cdn) {
		console.log("test 1")
        var total = 0;
        frm.doc.material1.map((row) => {
            total += row.total_cost;
        })
        frm.doc.material_total_cost = total;
        frm.refresh_field("material_total_cost")
	}
});





//calcula the total budgeted costs
frappe.ui.form.on("WBS", {
    task_id: function (frm, cdt, cdn) {
       var row = locals[cdt][cdn];
       var eqt_total_budget = 0;
       var man_total_budget = 0;
       var mat_total_budget = 0;

       //calculate the total budget for machinery
       frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Machinery Detail2',
            filters: { parent: row.task_id },
            fields: ['budget_cost']
        },
        callback: function (response) {
            if(response.message.length > 0){

                var machins = response.message;
                machins.map((item, index) => {
                    if(item.budget_cost){
                        eqt_total_budget += item.budget_cost 
                    }
                })
                row.eqt_budgeted_cost = eqt_total_budget;
             }
        }
		});
		//calculate the total budget for manpower
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Manpower Detail',
				filters: { parent: row.task_id },
				fields: ['budget_cost']
			},
			callback: function (response) {
				if(response.message.length > 0){

					var machins = response.message;
					machins.map((item, index) => {
						if(item.budget_cost){
							man_total_budget += item.budget_cost 
						}
					})
					row.man_budgeted_cost = man_total_budget;
				}
			}
		});
		//calculate the total budget for machinery
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Material DetailARRCA',
				filters: { parent: row.task_id },
				fields: ['budget_cost']
			},
			callback: function (response) {
				if(response.message.length > 0){

					var machins = response.message;
					machins.map((item, index) => {
						if(item.budget_cost){
							mat_total_budget += item.budget_cost 
						}
					})
					row.mat_budgeted_cost = mat_total_budget;
					row.total_budgeted_cost = parseFloat(row.mat_budgeted_cost) + parseFloat(row.man_budgeted_cost) + parseFloat(row.eqt_budgeted_cost);
				}
			}
		});
		
			frm.refresh_field("wbs")
    },
});

//adding the predecessor the the wbs
frappe.ui.form.on('Activity Sequencing', {
	predecessor_activity: function(frm, cdt, cdn) {
		console.log("test 1")
		var row = locals[cdt][cdn];
		var wbs = frm.doc.wbs;
		if(row.predecessor_activity && row.activity){
			console.log("test 2")
			wbs.map((item) => {
				if(item.task_id == row.activity){
					console.log("test 3")
					item.predecessor = row.predecessor_activity
				}
			})
			console.log("wbs", wbs)
			frm.refresh_field("wbs")
		}
	}
});





frappe.ui.form.on('Master Plan Detail', {
	before_task_list_remove: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var removed_activity = row.activity;
		console.log("removed task id", removed_activity);

		var operational_plan_detail_one = frm.doc.operational_plan_detail_one;
		var operational_plan_detail_two = frm.doc.operational_plan_detail_two;

		deleteRow(frm, removed_activity, "operational_plan_detail_one");
		deleteRow(frm, removed_activity, "operational_plan_detail_two");

		deleteRow(frm, removed_activity, "machinery");
		deleteRow(frm, removed_activity, "manpower1");
		deleteRow(frm, removed_activity, "material1");



	}
});

function deleteRow(frm, removed_activity, childTable) {
	var table = frm.doc[childTable];
	for (var i = 0; i < table.length; i++) {
		if (table[i].activity === removed_activity) {
			// Remove the row from the child table
			console.log("removed")
			table.splice(i, 1);
			// Update the form
			frm.refresh_field(childTable);
		}
	}
}



frappe.ui.form.on("Master Plan", {
	project: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	},
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	}
});


//preventing assigning  a planed quantity which is greter than the remining
frappe.ui.form.on('Master Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("duration", frm.doc.duration_in_days)
		console.log("calculation", ((row.planned * row.duration) / (row.quantity)))
		if (row.planned > row.quantity) {
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied day duration!")
		} else if (((row.planned * row.duration) / (row.quantity)) > frm.doc.duration_in_days) {
			console.log("i am hereeee")
			row.planned = null;
			frappe.show_alert("Please select lower amount of quantity. It can not be done with the specidied operational task duration!")
		}
		else {
			row.planned_day = (row.planned * row.duration) / (row.quantity);
			console.log("ppppppppppppppp", row.planned_day, row.planned_day)
			frm.refresh_field("task_list");
			AutoPopulate(frm, cdt, cdn);
		}
		frm.refresh_field("task_list")
	}
});

//about the critical path calculation
function findMaxDate(dateArray) {
	console.log("date arrya", dateArray)
	if (dateArray.length == 0) {
		return null;
	}
	const timestamps = dateArray.map(date => new Date(date).getTime());
	const maxTimestamp = Math.max(...timestamps)
	return maxTimestamp && new Date(maxTimestamp).toISOString().split('T')[0];
}

function findMinDate(dateArray) {
	console.log("date array", dateArray)
	if (dateArray.length == 0) {
		return null;
	}
	const timestamps = dateArray.map(date => new Date(date).getTime());
	const minTimestamp = Math.min(...timestamps);
	return new Date(minTimestamp).toISOString().split('T')[0];
}


frappe.ui.form.on('Activity Sequencing', {
	activity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("row", row)
		if (row.idx == 1) {
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Task',
					filters: {
						'name': row.activity,
					},
					fields: ["exp_start_date"],
				},
				callback: async function(response) {
					console.log("Response ", response.message[0].exp_start_date)
					frm.set_value('start_date_of_first_task', response.message[0].exp_start_date);
					frm.refresh_field("start_date_of_first_task")

				}
			})



		}
	}
});


function isNonWorkingDay(date) {
    return nonWokringDays.includes(date);
}


function countNonWorkingDays(startDate, endDate) {
    let count = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        if (isNonWorkingDay(currentDate)) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
}


frappe.ui.form.on('Master Plan', {
	get_critical_path: function(frm) {
		// console.log("abe", frm.doc)

		var dependency = frm.doc.activity_sequencing;

		let nodes = {}


		if (dependency && frm.doc.start_date_of_first_task) {

			dependency.forEach(task => {
				if (!nodes[task.activity]) {

					if (!task.predecessor_activity) {
						nodes[task.activity] = { es: [frm.doc.start_date_of_first_task], ef: [frappe.datetime.add_days(frm.doc.start_date_of_first_task, task.duration)] };
					}

					else {
						nodes[task.activity] = { es: [], ef: [] };
						console.log("nodes final", nodes)

						if (task.relationship_type == "Finish to Start") {
							let predecessorEf = nodes[task.predecessor_activity]["ef"].length - 1;
							nodes[task.activity]["es"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["ef"][predecessorEf], (task.lag_days - task.lead_days)));
							nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1], task.duration));
						}
						else if (task.relationship_type == "Start to Finish") {
							let predecessorEs = nodes[task.predecessor_activity]["es"].length - 1;
							nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["es"][predecessorEs], (task.lag_days - task.lead_days)));
							// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
						}
						else if (task.relationship_type == "Start to Start") {
							let predecessorEs = nodes[task.predecessor_activity]["es"].length - 1;
							nodes[task.activity]["es"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["es"][predecessorEs], (task.lag_days - task.lead_days)));
							nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1], task.duration));
						}
						else if (task.relationship_type == "Finish to Finish") {
							let predecessorEf = nodes[task.predecessor_activity]["ef"].length - 1;
							nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["ef"][predecessorEf], (task.lag_days - task.lead_days)));
							// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
						}
					}
				}

				else {

					if (task.relationship_type == "Finish to Start") {
						let predecessorEf = nodes[task.predecessor_activity]["ef"].length - 1;
						nodes[task.activity]["es"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["ef"][predecessorEf], (task.lag_days - task.lead_days)));
						nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1], task.duration));
					}
					else if (task.relationship_type == "Start to Finish") {
						let predecessorEs = nodes[task.predecessor_activity]["es"].length - 1;
						nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["es"][predecessorEs], (task.lag_days - task.lead_days)));
						// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1]);
					}
					else if (task.relationship_type == "Start to Start") {
						let predecessorEs = nodes[task.predecessor_activity]["es"].length - 1;
						nodes[task.activity]["es"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["es"][predecessorEs], (task.lag_days - task.lead_days)));
						nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1], task.duration));
					}
					else if (task.relationship_type == "Finish to Finish") {
						let predecessorEf = nodes[task.predecessor_activity]["ef"].length - 1;
						nodes[task.activity]["ef"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["ef"][predecessorEf], (task.lag_days - task.lead_days)));
						// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] );
					}
				}
			});




			for (let i = dependency.length - 1; i >= 0; i--) {

				let task = dependency[i];


				if (i == dependency.length - 1) {
					// console.log("task", nodes[task.activity].ef)
					// console.log("max value", findMaxDate(nodes[task.activity].ef))
					nodes[task.activity].lf = [findMaxDate(nodes[task.activity].ef)];
					// console.log("lf of the last task", nodes[task.activity].lf)
					// console.log("task duration", task.duration)
					nodes[task.activity].ls = [frappe.datetime.add_days(nodes[task.activity].lf[0], -(task.duration))];
					// console.log("ls of the last task", nodes[task.activity].ls)
				}

				if (task.predecessor_activity) {
					if (!nodes[task.predecessor_activity].lf) {
						nodes[task.predecessor_activity].lf = [];
					}
					if (!nodes[task.predecessor_activity].ls) {
						nodes[task.predecessor_activity].ls = [];
					}


					if (task.relationship_type == "Finish to Start") {
						let value = nodes[task.activity]["ls"].length - 1;
						nodes[task.predecessor_activity]["lf"].push(frappe.datetime.add_days(nodes[task.activity]["ls"][value], - (task.lag_days + task.lead_days)));
						let duration = dependency.find((item) => item.activity == task.predecessor_activity).duration;
						nodes[task.predecessor_activity]["ls"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["lf"][nodes[task.predecessor_activity]["lf"].length - 1], - duration));
					}

					else if (task.relationship_type == "Start to Finish") {
						nodes[task.predecessor_activity]["ls"].push(frappe.datetime.add_days(nodes[task.activity]["lf"][nodes[task.predecessor_activity]["lf"].length - 1], - (task.lag_days + task.lead_days)));
					}

					else if (task.relationship_type == "Start to Start") {
						nodes[task.predecessor_activity]["ls"].push(frappe.datetime.add_days(nodes[task.activity]["ls"][nodes[task.predecessor_activity]["ls"].length - 1], - (task.lag_days + task.lead_days)));
					}

					else if (task.relationship_type == "Finish to Finish") {
						let value = nodes[task.activity]["lf"].length - 1;
						nodes[task.predecessor_activity]["lf"].push(frappe.datetime.add_days(nodes[task.activity]["lf"][value], - (task.lag_days + task.lead_days)));
						let duration = dependency.find((item) => item.activity == task.predecessor_activity).duration;
						nodes[task.predecessor_activity]["ls"].push(frappe.datetime.add_days(nodes[task.predecessor_activity]["lf"][nodes[task.predecessor_activity]["lf"].length - 1], - duration));
					}
				}

			}


			const nodesArray = Object.entries(nodes).map(([key, value]) => ({ [key]: value }));

			console.log("node arryaaa", nodesArray)

			const processedNodesArray = nodesArray.map(obj => {
				const [key, value] = Object.entries(obj)[0];
				const es = findMaxDate(value.es);
				const ef = findMaxDate(value.ef);

				const lf = findMinDate(value.lf);
				const ls = findMinDate(value.ls);
				const ss = frappe.datetime.get_diff(ls, es);
				const ff = frappe.datetime.get_diff(lf, ef);

				return { [key]: { es, ef, lf, ls, ss, ff } };
			});

			console.log("before", processedNodesArray);

			console.log("non working days", non_working_days);
			// Adjusting the dates in processedNodesArray
			for (let i = 1; i < processedNodesArray.length; i++) {
				let taskKey = Object.keys(processedNodesArray[i])[0];
				let currentTask = processedNodesArray[i][taskKey];
			
				let esDate = new Date(currentTask.es);
				let efDate = new Date(currentTask.ef);
				let lsDate = new Date(currentTask.ls);
				let lfDate = new Date(currentTask.lf);
			
				let nonWorkingDaysCount = 0;
			
				// Count non-working days between previous EF and current EF
				console.log("es", esDate, "ef", efDate)
				for (let date = new Date(esDate); date <= efDate; date.setDate(date.getDate() + 1)) {
					let formattedDate = date.getFullYear() + '-' + 
						(date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
						date.getDate().toString().padStart(2, '0');

						console.log("formated date", formattedDate)
			
					if (non_working_days.includes(formattedDate)) {
						nonWorkingDaysCount++;
					}
				}
			
				efDate.setDate(efDate.getDate() + nonWorkingDaysCount);
			
				// Count non-working days between LF and current EF
				nonWorkingDaysCount = 0;
				for (let date = new Date(lsDate); date <= lfDate; date.setDate(date.getDate() + 1)) {
					let formattedDate = date.getFullYear() + '-' + 
						(date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
						date.getDate().toString().padStart(2, '0');
			
					if (non_working_days.includes(formattedDate)) {
						nonWorkingDaysCount++;
					}
				}
			
				lfDate.setDate(lfDate.getDate() + nonWorkingDaysCount);
			
				console.log("Count", nonWorkingDaysCount);
			
				// Assign the adjusted dates back to the task object
				currentTask.ef = efDate.toISOString().slice(0, 10);
				currentTask.lf = lfDate.toISOString().slice(0, 10);
			}

			var firstKey = Object.keys(processedNodesArray[0])[0];
			var lastKey = Object.keys(processedNodesArray[processedNodesArray.length - 1])[0];

			var totalDuration = frappe.datetime.get_diff(processedNodesArray[processedNodesArray.length - 1][lastKey].ef, processedNodesArray[0][firstKey].es);
			// console.log("project", frm.doc.end_date)
			// console.log("critical", processedNodesArray[processedNodesArray.length - 1][lastKey].ef)
			if(processedNodesArray[processedNodesArray.length - 1][lastKey].ef > frm.doc.end_date){
				var start_date = frappe.datetime.str_to_obj(frm.doc.end_date);
				var end_date = frappe.datetime.str_to_obj(processedNodesArray[processedNodesArray.length - 1][lastKey].ef);
				frappe.show_alert(`The critical path takes ${(start_date.getDate() - end_date.getDate())} days longer than expected for this project. Please adjust your tasks to make it fit!!!`);
			}

			// console.log("1, ", firstKey)
			// console.log("2, ", lastKey)
			// console.log("duration", totalDuration)

			frm.set_value('critical_path_duration_in_days', totalDuration)
			frm.refresh_field('critical_path_duration_in_days')


			const nodesWithSSZero = processedNodesArray.filter(obj => Object.values(obj)[0].ss === 0);
			const nodeNamesWithSSZero = nodesWithSSZero.map(obj => Object.keys(obj)[0]);
			const tasksString = nodeNamesWithSSZero.join(" ------> ");
			frm.set_value("tasks_on_the_critical_path", tasksString);
			frm.refresh_field("tasks_on_the_critical_path");

			// console.log(nodeNamesWithSSZero);
			frm.doc.critical_path_table = []
			processedNodesArray.map((item) => {
				// console.log("iteeem", item)
				var tableRow = frm.add_child("critical_path_table")
				tableRow.activity = Object.keys(item)[0];
				tableRow.es = item[Object.keys(item)[0]].es;
				tableRow.ef = item[Object.keys(item)[0]].ef;
				tableRow.lf = item[Object.keys(item)[0]].lf;
				tableRow.ls = item[Object.keys(item)[0]].ls;
				tableRow.free_float = item[Object.keys(item)[0]].ff;
				var wbsRow = frm.doc.wbs;
				wbsRow.map((row) => {
					// console.log("task id ", row.task_id, " task from cc ", Object.keys(item)[0])
					if(row.task_id == Object.keys(item)[0]){
						// console.log("we get free float")
						row.total_float = item[Object.keys(item)[0]].ff;
					}else{
						// console.log("not cached")
					}
				});
			})
			frm.refresh_field("critical_path_table")
			frm.refresh_field("wbs")
		}
		else (
			frappe.show_alert("please select list of activities first")
		)

	}
});



var non_working_days;



frappe.ui.form.on('Holidayss', {
	to_date: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		console.log("test 1")
		if(row.from_date && row.to_date){
			console.log("test 1")
			var start_date = frappe.datetime.str_to_obj(row.from_date);
			var end_date = frappe.datetime.str_to_obj(row.to_date);
			row.total = end_date.getDate() - start_date.getDate() + 1;
			frm.refresh_field("holiday")
		}
	}
})


// Calfulate total Holidayss
frappe.ui.form.on('Master Plan', {
	get_calender: function(frm, cdt, cdn) {
		var table = frm.doc.holiday;
		console.log("child", table)
		if (table) {
			frm.doc.no = []
			var month_totals = {};
			non_working_days = [];
			table.map((child) => {
				if (child.from_date && child.to_date) {
					var start_date = frappe.datetime.str_to_obj(child.from_date);
					var end_date = frappe.datetime.str_to_obj(child.to_date);
		
					// Iterate through each day between start_date and end_date
					for (var date = new Date(start_date); date <= end_date; date.setDate(date.getDate() + 1)) {
						var formattedDate = date.getFullYear() + '-' +
							(date.getMonth() + 1).toString().padStart(2, '0') + '-' +
							date.getDate().toString().padStart(2, '0');
		
						non_working_days.push(formattedDate); // Push the formatted date to the array
					}
					console.log("non woking days list", non_working_days)
		
					var day_diff = end_date.getDate() - start_date.getDate() + 1;
		
					var month_number = start_date.getMonth() + 1;
					var year_number = end_date.getFullYear();
					child.month = month_number;
		
					if (!month_totals[year_number]) {
						month_totals[year_number] = {};
					}
		
					if (!month_totals[year_number][month_number]) {
						month_totals[year_number][month_number] = day_diff;
					} else {
						month_totals[year_number][month_number] += day_diff;
					}
		
					var existingRow = frm.doc.no.find(row => row.year === year_number);
					if (!existingRow) {
						var new_row = frm.add_child('no');
						new_row.year = year_number;
						for (var i = 1; i <= 12; i++) {
							var daysInMonth = new Date(year_number, i, 0).getDate();
							console.log("day in month first", year_number)
							new_row[`${i}`] = daysInMonth - (month_totals[year_number][i] || 0);
						}
						frm.refresh_field('no');
					} else {
						for (var i = 1; i <= 12; i++) {
							var daysInMonth = new Date(year_number, i, 0).getDate();
							console.log("day in month second", year_number)
							existingRow[`${i}`] = daysInMonth - (month_totals[year_number][i] || 0);
						}
						frm.refresh_field('no');
					}
				}
			});
		}
		
		console.log("month total values are like the following", month_totals)
	}
});






frappe.ui.form.on('Master Plan', {
	end_date_ec: function(frm) {
		if (frm.doc.end_date_ec) {
			var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
			frm.doc.end_date = finalgc;
			frm.refresh_field("end_date")
		}

	},
	start_date_ec: function(frm) {
		if (frm.doc.start_date_ec) {
			var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
			frm.doc.start_date = finalgc;
			frm.refresh_field("start_date")
		}
	}
});




//calculating duration
frappe.ui.form.on('Master Plan', {
	end_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var year_diff = end_date.getFullYear() - start_date.getFullYear();
			var month_diff = end_date.getMonth() - start_date.getMonth();
			var day_diff = end_date.getDate() - start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;
			frm.set_value('duration', year_diff_decimal.toFixed(2));
			frm.set_value('duration_in_days', total_months * 30);
			console.log("duration", year_diff_decimal.toFixed(2));
			frm.refresh_field("duration")
		}
	}
});


//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

function DurationMessage(years, months, days) {
	var message = "";
	if (years > 0) {

		if (years == 1)
			message += years + " year ";
		else
			message += years + " years ";
	}

	if (months > 0 || years > 0) {

		if (months == 1)
			message += months + " month ";
		else if (months != 0)
			message += months + " months";

	}

	if (days == 1)
		message += days + " day ";
	else if (days != 0)
		message += days + " days ";

	return message;
}

function CalDaysInBetweenDates(date1, date2) {
	if ((Object.prototype.toString.call(date1) === '[object Date]') && (Object.prototype.toString.call(date2) === '[object Date]')) {

		var diff = Math.floor(date2.getTime() - date1.getTime());
		var secs = Math.floor(diff / 1000);
		var mins = Math.floor(secs / 60);
		var hours = Math.floor(mins / 60);
		var days = Math.floor(hours / 24);
		return days;
	}
	var days = 0;
	return days;
}

function RemainDays(days) {
	days = Math.floor(days % 31);
	return days
}

function CalMonthFromDays(days) {
	var months = Math.floor(days / 31);
	return months;
}

function RemainMonths(months) {
	months = Math.floor(months % 12);
	return months
}

function CalYearFromMonth(months) {
	var years = Math.floor(months / 12);
	return years;
}

function GetDuration(date1, date2) {
	var totalDays = CalDaysInBetweenDates(date1, date2);
	var month = CalMonthFromDays(totalDays);
	var year = CalYearFromMonth(month);
	var remainDays = RemainDays(totalDays);
	var remainMonth = RemainMonths(month);
	var message = DurationMessage(year, remainMonth, remainDays);
	return message;
}

frappe.ui.form.on("Master Plan", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Master Plan", {
	productivity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Master Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "task_list", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

		frm.set_query("activity", "activity_sequencing", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	}
});


frappe.ui.form.on("Master Plan", {
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project
					}
				}
			});

			frm.set_query("activity", "activity_sequencing", function() {
				return {
					"filters": {
						"project": frm.doc.project
					}
				}
			});
		}
	}
});


function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

frappe.ui.form.on("Master Plan", {
	start_date: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");
		if (start_date) {

			var end_date = addDays(start_date, 372);
			frappe.model.set_value(d.doctype, d.name, "end_date", end_date);

			var date1 = new Date(start_date.toString());
			var date2 = new Date(end_date.toString());

			var duration_result = GetDuration(date1, date2);
			frappe.model.set_value(d.doctype, d.name, "duration", duration_result);


			refresh_field("end_date");
			refresh_field("duration");
		}
	}
});

function AutoPopulate(frm, cdt, cdn) {


	var d = locals[cdt][cdn];


	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	// frm.doc.machinary_detail_summarized_by_month_section_a = []
	// frm.doc.machinary_detail_summarized_by_month_section_b = []

	frm.doc.manpower_detail_summerized = []
	// frm.doc.manpower_detail_summarized_by_month_section_a = []
	// frm.doc.manpower_detail_summarized_by_month_section_b = []

	frm.doc.material_detail_summerized = []
	// frm.doc.material_detail_summarized_by_month_section_a = []
	// frm.doc.material_detail_summarized_by_month_section_b = []

	var allMachinesMap = new Map();
	var allManpowerMap = new Map();
	var allMaterialMap = new Map();



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
	allManpowerMap.clear();
	allMaterialMap.clear();

	var task_lists = frm.doc.wbs;
	console.log("year list", frm.doc.no)
	var years = [];
	frm.doc.no.map((item)=> {
		if(item.year){
			years.push(item.year)
		}
	})

	$.each(task_lists, function(_i, eMain) {

		//Script to populate child tables for machinary
		var taskParent = eMain.task_id;
		var subject = eMain.task_name;
		var planned_qty = eMain.planned ? eMain.planned : 1;




		if (taskParent) {
			frappe.call({
				method: "erpnext.machinary_populate_api.get_machinary_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {



					var entry = frm.add_child("machinery");
					entry.id_mac = e.id_mac;
					entry.type = e.type;
					entry.activity = taskParent;
					entry.equp_no = e.qty;
					console.log("eee", e);
					entry.subject = subject;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.rental_rate = e.rental_rate;
							grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
							number_of_items_for_machinary += 1;
							sum_of_unit_rate_for_machinary += entry.rental_rate;
							entry.total_hourly_cost = entry.qty * entry.rental_rate;
							entry.machinery_cost = entry.total_hourly_cost / entry.productivity
							console.log("uf ", entry.uf, "eff ", entry.efficency, "qty ", entry.qty, "item no ", entry.item_no, "prod", entry.productivity)
							entry.eqt_hour = (entry.uf * entry.efficency * entry.qty * entry.item_no) / entry.productivity;
							frm.refresh_field("machinery")

						}
					})





					if (allMachinesMap.has(e.id_mac)) {

						var existingVal = allMachinesMap.get(entry.id_mac);
						existingVal.qty += (entry.qty);
						existingVal.total_hourly_cost += (entry.total_hourly_cost);
						allMachinesMap.set(entry.id_mac, existingVal);
					}
					else {

						var newEntrySummerized = frm.add_child("machinery_detail_summerized");
						newEntrySummerized.id_mac = e.id_mac;
						newEntrySummerized.type = e.type;
						newEntrySummerized.qty = e.qty * planned_qty;
						newEntrySummerized.uf = e.uf;
						newEntrySummerized.efficency = e.efficency;
						newEntrySummerized.rental_rate = e.rental_rate;
						newEntrySummerized.total_hourly_cost = entry.qty * entry.rental_rate;
						allMachinesMap.set(e.id_mac, newEntrySummerized);

						var machinery_exist1 = false;
						var machinery_exist2 = false;

						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							console.log("eeeee", e)
							if (row.activity === e.parent) {
								machinery_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});
						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								machinery_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log("machinery exist 1", machinery_exist1)
						console.log("machinery exist 2", machinery_exist2)
						console.log("yeaers exist", years)

						// Handling machinery entries
						if (!machinery_exist1) {
							if (years[0]) {
								var newEntrySummerized_section_a = frm.add_child("machinary_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.year = years[0];
								newEntrySummerized_section_a.id_mac = e.id_mac;
								newEntrySummerized_section_a.activity = e.parent;
								newEntrySummerized_section_a.type = e.type;
							}
							if (years[1]) {
								var newEntrySummerized_section_a2 = frm.add_child("machinary_detail_summarized_by_month_section_a_y2");
								newEntrySummerized_section_a2.year = years[1];
								newEntrySummerized_section_a2.id_mac = e.id_mac;
								newEntrySummerized_section_a2.activity = e.parent;
								newEntrySummerized_section_a2.type = e.type;
							}
							if (years[2]) {
								var newEntrySummerized_section_a3 = frm.add_child("machinary_detail_summarized_by_month_section_a_y3");
								newEntrySummerized_section_a3.year = years[2];
								newEntrySummerized_section_a3.id_mac = e.id_mac;
								newEntrySummerized_section_a3.activity = e.parent;
								newEntrySummerized_section_a3.type = e.type;
							}
							if (years[3]) {
								var newEntrySummerized_section_a4 = frm.add_child("machinary_detail_summarized_by_month_section_a_y4");
								newEntrySummerized_section_a4.year = years[3];
								newEntrySummerized_section_a4.id_mac = e.id_mac;
								newEntrySummerized_section_a4.activity = e.parent;
								newEntrySummerized_section_a4.type = e.type;
							}
						}

						if (!machinery_exist2) {
							if (years[0]) {
								var newEntrySummerized_section_b = frm.add_child("machinary_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.year = years[0];
								newEntrySummerized_section_b.id_mac = e.id_mac;
								newEntrySummerized_section_b.activity = e.parent;
								newEntrySummerized_section_b.type = e.type;
							}
							if (years[1]) {
								var newEntrySummerized_section_b2 = frm.add_child("machinary_detail_summarized_by_month_section_b_y2");
								newEntrySummerized_section_b2.year = years[1];
								newEntrySummerized_section_b2.id_mac = e.id_mac;
								newEntrySummerized_section_b2.activity = e.parent;
								newEntrySummerized_section_b2.type = e.type;
							}
							if (years[2]) {
								var newEntrySummerized_section_b3 = frm.add_child("machinary_detail_summarized_by_month_section_b_y3");
								newEntrySummerized_section_b3.year = years[2];
								newEntrySummerized_section_b3.id_mac = e.id_mac;
								newEntrySummerized_section_b3.activity = e.parent;
								newEntrySummerized_section_b3.type = e.type;
							}
							if (years[3]) {
								var newEntrySummerized_section_b4 = frm.add_child("machinary_detail_summarized_by_month_section_b_y4");
								newEntrySummerized_section_b4.year = years[3];
								newEntrySummerized_section_b4.id_mac = e.id_mac;
								newEntrySummerized_section_b4.activity = e.parent;
								newEntrySummerized_section_b4.type = e.type;
							}
						}

					}

				})

				frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
				frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary / number_of_items_for_machinary);



				refresh_field("machinery");
				refresh_field("equipment_total_cost");
				refresh_field("equipment_unit_rate");
				refresh_field("machinery_detail_summerized");
				refresh_field("machinary_detail_summarized_by_month_section_a");
				refresh_field("machinary_detail_summarized_by_month_section_b");

				refresh_field("machinary_detail_summarized_by_month_section_a_y2");
				refresh_field("machinary_detail_summarized_by_month_section_b_y2");

				refresh_field("machinary_detail_summarized_by_month_section_a_y3");
				refresh_field("machinary_detail_summarized_by_month_section_b_y3");

				refresh_field("machinary_detail_summarized_by_month_section_a_y4");
				refresh_field("machinary_detail_summarized_by_month_section_b_y4");
			})
		}

		//Script to populate child tables for manpower
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					console.log("mppppe eeeee", e)
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = subject;
					entry.labor_no = e.labor_no;
					// entry.productivity = frm.doc.task_list[0].productivity;

					entry.qty = e.qty * planned_qty;
					entry.li_permanent = e.li_permanent;
					entry.mp_number = parseFloat(e.qty);
					console.log("mppppppp number", entry.mp_number)
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.mp_hour = entry.uf
					grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
					number_of_items_for_manpower += 1;
					sum_of_unit_rate_for_manpower += entry.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.act_quantity = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.mp_hour = (entry.uf * entry.li_permanent * entry.mp_number * entry.act_quantity) / entry.productivity;
							entry.act_quantity = entry.act_quantity;


							frm.refresh_field("manpower1")

						}
					})


					if (!frm.doc.manpower_detail_summarized_by_month_section_a) {
						console.log("first")
						var manpower_exist1 = false;
						var manpower_exist2 = false;
						console.log("eeeeeee2", e);
						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						if (!manpower_exist1) {
							if(years[0]){
								var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.year = years[0];
								newEntrySummerized_section_a.id_map = e.id_map;
								newEntrySummerized_section_a.activity = e.parent;
	
								newEntrySummerized_section_a.job_title = e.job_title;
							}
							if(years[1]){
								var newEntrySummerized_section_a2 = frm.add_child("manpower_detail_summarized_by_month_section_a_y2");
								newEntrySummerized_section_a2.year = years[1];

								newEntrySummerized_section_a2.id_map = e.id_map;
								newEntrySummerized_section_a2.activity = e.parent;
	
								newEntrySummerized_section_a2.job_title = e.job_title;
							}
							if(years[2]){
								var newEntrySummerized_section_a3 = frm.add_child("manpower_detail_summarized_by_month_section_a_y3");
								newEntrySummerized_section_a3.year = years[2];

								newEntrySummerized_section_a3.id_map = e.id_map;
								newEntrySummerized_section_a3.activity = e.parent;
	
								newEntrySummerized_section_a3.job_title = e.job_title;
							}
							if(years[3]){
								var newEntrySummerized_section_a4 = frm.add_child("manpower_detail_summarized_by_month_section_a_y4");
								newEntrySummerized_section_a4.year = years[3];

								newEntrySummerized_section_a4.id_map = e.id_map;
								newEntrySummerized_section_a4.activity = e.parent;
	
								newEntrySummerized_section_a4.job_title = e.job_title;
							}

						}

						if (!manpower_exist2) {
							if(years[0]){
								var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.year = years[0];
								newEntrySummerized_section_b.id_map = e.id_map;
								newEntrySummerized_section_b.activity = e.parent;
	
								newEntrySummerized_section_b.job_title = e.job_title;
							}
							if(years[1]){
								var newEntrySummerized_section_b2 = frm.add_child("manpower_detail_summarized_by_month_section_b_y2");
								newEntrySummerized_section_b2.year = years[1];
								newEntrySummerized_section_b2.id_map = e.id_map;
								newEntrySummerized_section_b2.activity = e.parent;
	
								newEntrySummerized_section_b2.job_title = e.job_title;
							}
							if(years[2]){
								var newEntrySummerized_section_b3 = frm.add_child("manpower_detail_summarized_by_month_section_b_y3");
								newEntrySummerized_section_b3.year = years[2];
								newEntrySummerized_section_b3.id_map = e.id_map;
								newEntrySummerized_section_b3.activity = e.parent;
	
								newEntrySummerized_section_b3.job_title = e.job_title;
							}
							if(years[3]){
								var newEntrySummerized_section_b4 = frm.add_child("manpower_detail_summarized_by_month_section_b_y4");
								newEntrySummerized_section_b4.year = years[3];
								newEntrySummerized_section_b4.id_map = e.id_map;
								newEntrySummerized_section_b4.activity = e.parent;
	
								newEntrySummerized_section_b4.job_title = e.job_title;
							}
						}


						var entryMPSummerized = frm.add_child("manpower_detail_summerized");

						entryMPSummerized.id_map = e.id_map;
						entryMPSummerized.job_title = e.job_title;
						entryMPSummerized.qty = e.qty * planned_qty;
						entryMPSummerized.uf = e.uf;
						entryMPSummerized.efficency = e.efficency;
						entryMPSummerized.hourly_cost = e.hourly_cost;
						entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
					}
					
					else {

						var manpower_exist = false;


						$.each(frm.doc.manpower_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_map === e.id_map) {
								manpower_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!manpower_exist) {
							console.log("ohoo")

							var manpower_exist1 = false;
							var manpower_exist2 = false;
							console.log("eeeeeee2", e);
							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!manpower_exist1) {
								if(years[0]){
									var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
									newEntrySummerized_section_a.year = years[0];
									newEntrySummerized_section_a.id_map = e.id_map;
									newEntrySummerized_section_a.activity = e.parent;
		
									newEntrySummerized_section_a.job_title = e.job_title;
								}
								if(years[1]){
									var newEntrySummerized_section_a2 = frm.add_child("manpower_detail_summarized_by_month_section_a_y2");
									newEntrySummerized_section_a2.year = years[1];

									newEntrySummerized_section_a2.id_map = e.id_map;
									newEntrySummerized_section_a2.activity = e.parent;
		
									newEntrySummerized_section_a2.job_title = e.job_title;
								}
								if(years[2]){
									var newEntrySummerized_section_a3 = frm.add_child("manpower_detail_summarized_by_month_section_a_y3");
									newEntrySummerized_section_a3.year = years[2];

									newEntrySummerized_section_a3.id_map = e.id_map;
									newEntrySummerized_section_a3.activity = e.parent;
		
									newEntrySummerized_section_a3.job_title = e.job_title;
								}
								if(years[3]){
									var newEntrySummerized_section_a4 = frm.add_child("manpower_detail_summarized_by_month_section_a_y4");
									newEntrySummerized_section_a4.year = years[3];

									newEntrySummerized_section_a4.id_map = e.id_map;
									newEntrySummerized_section_a4.activity = e.parent;
		
									newEntrySummerized_section_a4.job_title = e.job_title;
								}
	
							}
	
							if (!manpower_exist2) {
								if(years[0]){
									var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
									newEntrySummerized_section_b.year = years[0];
									newEntrySummerized_section_b.id_map = e.id_map;
									newEntrySummerized_section_b.activity = e.parent;
		
									newEntrySummerized_section_b.job_title = e.job_title;
								}
								if(years[1]){
									var newEntrySummerized_section_b2 = frm.add_child("manpower_detail_summarized_by_month_section_b_y2");
									newEntrySummerized_section_b2.year = years[1];
									newEntrySummerized_section_b2.id_map = e.id_map;
									newEntrySummerized_section_b2.activity = e.parent;
		
									newEntrySummerized_section_b2.job_title = e.job_title;
								}
								if(years[2]){
									var newEntrySummerized_section_b3 = frm.add_child("manpower_detail_summarized_by_month_section_b_y3");
									newEntrySummerized_section_b3.year = years[2];
									newEntrySummerized_section_b3.id_map = e.id_map;
									newEntrySummerized_section_b3.activity = e.parent;
		
									newEntrySummerized_section_b3.job_title = e.job_title;
								}
								if(years[3]){
									var newEntrySummerized_section_b4 = frm.add_child("manpower_detail_summarized_by_month_section_b_y4");
									newEntrySummerized_section_b4.year = years[3];
									newEntrySummerized_section_b4.id_map = e.id_map;
									newEntrySummerized_section_b4.activity = e.parent;
		
									newEntrySummerized_section_b4.job_title = e.job_title;
								}
							}

						} else {
							var entryMPSummerized = frm.add_child("manpower_detail_summerized");
							entryMPSummerized.id_map = e.id_map;
							entryMPSummerized.job_title = e.job_title;
							entryMPSummerized.qty = e.qty * planned_qty;
							entryMPSummerized.uf = e.uf;
							entryMPSummerized.efficency = e.efficency;
							entryMPSummerized.hourly_cost = e.hourly_cost;
							entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
						}
					}











				})


				frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
				frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

				refresh_field("manpower1");
				refresh_field("man_power_total_cost");
				refresh_field("man_power_unit_rate");
				refresh_field("manpower_detail_summerized");

				refresh_field("manpower_detail_summarized_by_month_section_a");
				refresh_field("manpower_detail_summarized_by_month_section_b");

				refresh_field("manpower_detail_summarized_by_month_section_a_y2");
				refresh_field("manpower_detail_summarized_by_month_section_b_y2");

				refresh_field("manpower_detail_summarized_by_month_section_a_y3");
				refresh_field("manpower_detail_summarized_by_month_section_b_y3");

				refresh_field("manpower_detail_summarized_by_month_section_a_y4");
				refresh_field("manpower_detail_summarized_by_month_section_b_y4");

			})
		}


		;
		//Script to populate child tables for material
		if (taskParent) {
			console.log("weyeeeee")
			
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Material DetailARRCA',
					filters: {
						'parent': taskParent
					},
					fields: ["*"],
				},
				// method: "erpnext.material_populate_api.get_material_by_task",
				// args: { parent: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {
					console.log("test 1", e)
					var entry = frm.add_child("material1");
					console.log("test 2")

					entry.id_mat = e.id_mat;
					entry.item1 = e.item1;
					entry.activity = taskParent;
					entry.subject = subject;
					entry.uom = e.uom;
					entry.qty = e.qty;
					
					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.task_qty = response.message[0].quantity;
							entry.qty = e.qty
							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.unit_price = e.unit_price;
							grand_total_cost_for_material += entry.qty * entry.unit_price;
							number_of_items_for_material += 1;
							sum_of_unit_rate_for_material += entry.unit_price;
							entry.total_cost = e.total_cost;

							entry.material_qty = entry.qaty;


							frm.refresh_field("material1")

						}
					})

					if (!frm.doc.material_detail_summarized_by_month_section_a) {
						console.log("kezAS")
						var entryMaterialSummerized = frm.add_child("material_detail_summerized");
						console.log("neja")

						entryMaterialSummerized.id_mat = e.id_mat;
						entryMaterialSummerized.item1 = e.item1;
						entryMaterialSummerized.uom = e.uom;
						entryMaterialSummerized.qty = e.qty * planned_qty;
						entryMaterialSummerized.uf = e.uf;
						entryMaterialSummerized.efficency = e.efficency;
						entryMaterialSummerized.unit_price = e.unit_price;
						entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;

						var material_exist1 = false;
						var material_exist2 = false;

						console.log("eeeeeeeeee material", e);

						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								material_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one, function(index, row) {
							if (row.activity === e.parent) {
								material_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log(" material exist 1", material_exist1);
						console.log(" material exist 2", material_exist2);


				// Handling material entries
				if (!material_exist1) {
					if (years[0]) {
						var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
						newEntrySummerized_section_a.year = years[0];
						newEntrySummerized_section_a.id_mat = e.id_mat;
						newEntrySummerized_section_a.unit = e.uom;
						newEntrySummerized_section_a.item = e.item1;
					}
					if (years[1]) {
						var newEntrySummerized_section_a2 = frm.add_child("material_detail_summarized_by_month_section_a_y2");
						newEntrySummerized_section_a2.year = years[1];
						newEntrySummerized_section_a2.id_mat = e.id_mat;
						newEntrySummerized_section_a2.unit = e.uom;
						newEntrySummerized_section_a2.item = e.item1;
					}
					if (years[2]) {
						var newEntrySummerized_section_a3 = frm.add_child("material_detail_summarized_by_month_section_a_y3");
						newEntrySummerized_section_a3.year = years[2];
						newEntrySummerized_section_a3.id_mat = e.id_mat;
						newEntrySummerized_section_a3.unit = e.uom;
						newEntrySummerized_section_a3.item = e.item1;
					}
					if (years[3]) {
						var newEntrySummerized_section_a4 = frm.add_child("material_detail_summarized_by_month_section_a_y4");
						newEntrySummerized_section_a4.year = years[3];
						newEntrySummerized_section_a4.id_mat = e.id_mat;
						newEntrySummerized_section_a4.unit = e.uom;
						newEntrySummerized_section_a4.item = e.item1;
					}
				}

				if (!material_exist2) {
					if (years[0]) {
						var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
						newEntrySummerized_section_b.year = years[0];
						newEntrySummerized_section_b.id_mat = e.id_mat;
						newEntrySummerized_section_b.unit = e.uom;
						newEntrySummerized_section_b.item = e.item1;
					}
					if (years[1]) {
						var newEntrySummerized_section_b2 = frm.add_child("material_detail_summarized_by_month_section_b_y2");
						newEntrySummerized_section_b2.year = years[1];
						newEntrySummerized_section_b2.id_mat = e.id_mat;
						newEntrySummerized_section_b2.unit = e.uom;
						newEntrySummerized_section_b2.item = e.item1;
					}
					if (years[2]) {
						var newEntrySummerized_section_b3 = frm.add_child("material_detail_summarized_by_month_section_b_y3");
						newEntrySummerized_section_b3.year = years[2];
						newEntrySummerized_section_b3.id_mat = e.id_mat;
						newEntrySummerized_section_b3.unit = e.uom;
						newEntrySummerized_section_b3.item = e.item1;
					}
					if (years[3]) {
						var newEntrySummerized_section_b4 = frm.add_child("material_detail_summarized_by_month_section_b_y4");
						newEntrySummerized_section_b4.year = years[3];
						newEntrySummerized_section_b4.id_mat = e.id_mat;
						newEntrySummerized_section_b4.unit = e.uom;
						newEntrySummerized_section_b4.item = e.item1;
					}
				}

					}
					else {

						var material_exist = false;


						$.each(frm.doc.material_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_mat === e.id_mat) {
								material_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!material_exist) {
							var material_exist1 = false;
							var material_exist2 = false;

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									material_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one, function(index, row) {
								if (row.activity === e.parent) {
									material_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

				// Handling material entries
				if (!material_exist1) {
					if (years[0]) {
						var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
						newEntrySummerized_section_a.year = years[0];
						newEntrySummerized_section_a.id_mat = e.id_mat;
						newEntrySummerized_section_a.unit = e.uom;
						newEntrySummerized_section_a.item = e.item1;
					}
					if (years[1]) {
						var newEntrySummerized_section_a2 = frm.add_child("material_detail_summarized_by_month_section_a_y2");
						newEntrySummerized_section_a2.year = years[1];
						newEntrySummerized_section_a2.id_mat = e.id_mat;
						newEntrySummerized_section_a2.unit = e.uom;
						newEntrySummerized_section_a2.item = e.item1;
					}
					if (years[2]) {
						var newEntrySummerized_section_a3 = frm.add_child("material_detail_summarized_by_month_section_a_y3");
						newEntrySummerized_section_a3.year = years[2];
						newEntrySummerized_section_a3.id_mat = e.id_mat;
						newEntrySummerized_section_a3.unit = e.uom;
						newEntrySummerized_section_a3.item = e.item1;
					}
					if (years[3]) {
						var newEntrySummerized_section_a4 = frm.add_child("material_detail_summarized_by_month_section_a_y4");
						newEntrySummerized_section_a4.year = years[3];
						newEntrySummerized_section_a4.id_mat = e.id_mat;
						newEntrySummerized_section_a4.unit = e.uom;
						newEntrySummerized_section_a4.item = e.item1;
					}
				}

				if (!material_exist2) {
					if (years[0]) {
						var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
						newEntrySummerized_section_b.year = years[0];
						newEntrySummerized_section_b.id_mat = e.id_mat;
						newEntrySummerized_section_b.unit = e.uom;
						newEntrySummerized_section_b.item = e.item1;
					}
					if (years[1]) {
						var newEntrySummerized_section_b2 = frm.add_child("material_detail_summarized_by_month_section_b_y2");
						newEntrySummerized_section_b2.year = years[1];
						newEntrySummerized_section_b2.id_mat = e.id_mat;
						newEntrySummerized_section_b2.unit = e.uom;
						newEntrySummerized_section_b2.item = e.item1;
					}
					if (years[2]) {
						var newEntrySummerized_section_b3 = frm.add_child("material_detail_summarized_by_month_section_b_y3");
						newEntrySummerized_section_b3.year = years[2];
						newEntrySummerized_section_b3.id_mat = e.id_mat;
						newEntrySummerized_section_b3.unit = e.uom;
						newEntrySummerized_section_b3.item = e.item1;
					}
					if (years[3]) {
						var newEntrySummerized_section_b4 = frm.add_child("material_detail_summarized_by_month_section_b_y4");
						newEntrySummerized_section_b4.year = years[3];
						newEntrySummerized_section_b4.id_mat = e.id_mat;
						newEntrySummerized_section_b4.unit = e.uom;
						newEntrySummerized_section_b4.item = e.item1;
					}
				}


						} else {
							var entryMaterialSummerized = frm.add_child("material_detail_summerized");
							entryMaterialSummerized.id_mat = e.id_mat;
							entryMaterialSummerized.item1 = e.item1;
							entryMaterialSummerized.uom = e.uom;
							entryMaterialSummerized.qty = e.qty * planned_qty;
							entryMaterialSummerized.uf = e.uf;
							entryMaterialSummerized.efficency = e.efficency;
							entryMaterialSummerized.unit_price = e.unit_price;
							entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;
						}
					}





				})

				frm.doc.material_total_cost = grand_total_cost_for_material;
				//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

				refresh_field("material1");
				refresh_field("material_total_cost");
				refresh_field("material_detail_summerized");
				refresh_field("material_detail_summarized_by_month_section_a");
				refresh_field("material_detail_summarized_by_month_section_b");

				refresh_field("material_detail_summarized_by_month_section_a_y2");
				refresh_field("material_detail_summarized_by_month_section_b_y2");

				refresh_field("material_detail_summarized_by_month_section_a_y3");
				refresh_field("material_detail_summarized_by_month_section_b_y3");

				refresh_field("material_detail_summarized_by_month_section_a_y4");
				refresh_field("material_detail_summarized_by_month_section_b_y4");

			})
		}

		//Script to populate child tables for task detail by month
		if (taskParent) {
			console.log("we are heeeeeeeeeeeeeeeeeeeeeeeeeeeeeer")
			frappe.call({

				method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
				args: { activity: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {
					console.log("materials list, ", e)
					var activity_exists1 = false;
					var activity_exists2 = false;

					$.each(frm.doc.operational_plan_detail_one, function(index, row) {
						if (row.activity === e[0]) {
							activity_exists1 = true;
							if (eMain.planned) {
								row.planned = eMain.planned;
							}
							return false;
						}
					});

					$.each(frm.doc.operational_plan_detail_two, function(index, row) {
						if (row.activity === e[0]) {
							activity_exists2 = true;
							return false;
						}
					});

					if (!activity_exists1) {

						if (years[0]) {
							var entryTwoYear1 = frm.add_child("operational_plan_detail_one");
							entryTwoYear1.year = years[0];
							entryTwoYear1.activity = e[0];
							entryTwoYear1.activity_name = e[17];
							entryTwoYear1.uom = e[61];
						}
						if (years[1]) {
							var entryTwoYear2 = frm.add_child("operational_plan_detail_one_y2");
							entryTwoYear2.year = years[1];
							entryTwoYear2.activity = e[0];
							entryTwoYear2.activity_name = e[17];
							entryTwoYear2.uom = e[61];
						}
						if (years[2]) {
							var entryTwoYear1 = frm.add_child("operational_plan_detail_one_y3");
							entryTwoYear1.year = years[2];
							entryTwoYear1.activity = e[0];
							entryTwoYear1.activity_name = e[17];
							entryTwoYear1.uom = e[61];
						}
						if (years[3]) {
							var entryTwoYear2 = frm.add_child("operational_plan_detail_one_y4");
							entryTwoYear2.year = years[3];
							entryTwoYear2.activity = e[0];
							entryTwoYear2.activity_name = e[17];
							entryTwoYear2.uom = e[61];
						}
					}

					if (!activity_exists2) {

						if (years[0]) {
							var entryTwoYear1 = frm.add_child("operational_plan_detail_two");
							entryTwoYear1.year = years[0];
							entryTwoYear1.activity = e[0];
							entryTwoYear1.activity_name = e[17];
							entryTwoYear1.uom = e[61];
						}
						if (years[1]) {
							var entryTwoYear2 = frm.add_child("operational_plan_detail_two_y2");
							entryTwoYear2.year = years[1];
							entryTwoYear2.activity = e[0];
							entryTwoYear2.activity_name = e[17];
							entryTwoYear2.uom = e[61];
						}
						if (years[2]) {
							var entryTwoYear1 = frm.add_child("operational_plan_detail_two_y3");
							entryTwoYear1.year = years[2];
							entryTwoYear1.activity = e[0];
							entryTwoYear1.activity_name = e[17];
							entryTwoYear1.uom = e[61];
						}
						if (years[3]) {
							var entryTwoYear2 = frm.add_child("operational_plan_detail_two_y4");
							entryTwoYear2.year = years[3];
							entryTwoYear2.activity = e[0];
							entryTwoYear2.activity_name = e[17];
							entryTwoYear2.uom = e[61];
						}

					}
				});


				refresh_field("operational_plan_detail_one");
				refresh_field("operational_plan_detail_two");

				refresh_field("operational_plan_detail_one_y2");
				refresh_field("operational_plan_detail_two_y2");

				refresh_field("operational_plan_detail_one_y3");
				refresh_field("operational_plan_detail_two_y3");

				refresh_field("operational_plan_detail_one_y4");
				refresh_field("operational_plan_detail_two_y4");
			})
		}

	});
}

function AutoCalculateMonthValueOne(doctype, name, planned) {

	console.log("One DocType: " + doctype);
	console.log("One Name: " + name);

	frappe.model.set_value(doctype, name, 'm_1', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_2', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_3', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_4', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_5', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_6', (planned / 12));
}

function AutoCalculateMonthValueTwo(doctype, name, planned) {

	console.log("Two DocType: " + doctype);
	console.log("Two Name: " + name);

	frappe.model.set_value(doctype, name, 'm_7', (planned / 25));
	frappe.model.set_value(doctype, name, 'm_8', (planned / 26));
	frappe.model.set_value(doctype, name, 'm_9', (planned / 27));
	frappe.model.set_value(doctype, name, 'm_10', (planned / 26));
	frappe.model.set_value(doctype, name, 'm_11', (planned / 25));
	frappe.model.set_value(doctype, name, 'm_12', (planned / 24));
}

frappe.ui.form.on("WBS", {
	task_id: function(frm, cdt, cdn) {
		console.log("actvity is selected on wbs")
		AutoPopulate(frm, cdt, cdn);
	},
});

frappe.ui.form.on("Master Plan Detail One", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueOne(d.doctype, d.name, d.planned);
	}
});

frappe.ui.form.on("Master Plan Detail Two", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueTwo(d.doctype, d.name, d.planned);
	}
});



frappe.ui.form.on("Master Plan", {
    fetch_physical: function(frm, cdt, cdn) {
        var task_list = frm.doc.wbs;
        var critical_list = frm.doc.critical_path_table;
        var working_list = frm.doc.no;

        var organizedData = [];

        // Iterate through each task in the task list
        task_list.forEach(function(task) {
            var taskId = task.task_id;

            // Find the corresponding critical path entry
            var criticalEntry = critical_list.find(function(critical) {
                return critical.activity === taskId;
            });

            // Check if critical path entry exists for the task
            var es;
            var ef;
            if (criticalEntry) {
                es = criticalEntry.es || null;
                ef = criticalEntry.ef || null;
            }

            // Find the corresponding working days entry for each year
            var taskWorkingDays = {};
            working_list.forEach(function(workingDays) {
                if (workingDays.year) {
                    var year = workingDays.year;
                    var monthWiseWorkingDays = {};

                    // Extract month-wise working days for each year
                    for (var month = 1; month <= 12; month++) {
                        var currentMonth = month.toString();
                        var currentDate = new Date(year, month - 1, 1);
                        var daysInMonth = new Date(year, month, 0).getDate();

                        if (es && ef) {
                            var esDate = new Date(es);
                            var efDate = new Date(ef);
                            if (currentDate < esDate || currentDate > efDate) {
                                // For months before ES and after EF, set working days to zero
                                monthWiseWorkingDays[currentMonth] = 0;
                            } else if (currentDate.getMonth() === (esDate.getMonth()+1)) {
								console.log("i am here eco", workingDays.year, month, esDate.getMonth() + 1)

                                // For the month of ES, calculate working days as day number - es_day
                                monthWiseWorkingDays[currentMonth] = workingDays[currentMonth] - esDate.getDate();
                            } else if (currentDate.getMonth() === efDate.getMonth()) {
                                if (currentDate.getMonth() === new Date(ef).getMonth()) {
                                    // For the month of EF, set working days as ef_day
                                    monthWiseWorkingDays[currentMonth] = efDate.getDate() + 1;
                                } else {
                                    // For other months within ES and EF range, use original working days
                                    monthWiseWorkingDays[currentMonth] = workingDays[currentMonth] || 0;
                                }
                            } else {
                                // For months within ES and EF range, use original working days
                                monthWiseWorkingDays[currentMonth] = workingDays[currentMonth] || 0;
                            }
                        }
                    }

                    taskWorkingDays[year] = monthWiseWorkingDays;
                }
            });

            // Combine the task details with critical path, working days, and UOM
            var combinedData = {
                task_id: taskId,
                task_name: task.task_name,
                uom: task.uom,
                duration: task.duration,
                qty: task.contract_qty,
                es: es,
                ef: ef,
                working_days: taskWorkingDays
            };

            // Add the combined data to the organizedData array
            organizedData.push(combinedData);
        });

        console.log("Organized Data:", organizedData);
        // Here you can use 'organizedData' as needed in your application

		
// Update each task_detail array using the updateTaskDetails function
updateTaskDetails(frm.doc.operational_plan_detail_one, organizedData);
updateTaskDetails(frm.doc.operational_plan_detail_one_y2, organizedData);
updateTaskDetails(frm.doc.operational_plan_detail_one_y3, organizedData);
updateTaskDetails(frm.doc.operational_plan_detail_one_y4, organizedData);

// Refresh the fields after updating the task_detail arrays
frm.refresh_field("operational_plan_detail_one");
frm.refresh_field("operational_plan_detail_one_y2");
frm.refresh_field("operational_plan_detail_one_y3");
frm.refresh_field("operational_plan_detail_one_y4");

    }
});



function updateTaskDetails(taskDetail, organizedData) {
    taskDetail.forEach(function(item) {
        var itemId = item.activity; // Assuming activity holds the task_id
        var itemYear = item.year;

        // Find the corresponding task from organizedData based on task_id and year
        var correspondingTask = organizedData.find(function(task) {
            return task.task_id === itemId && task.working_days.hasOwnProperty(itemYear);
        });

        if (correspondingTask) {
            var monthWiseWorkingDays = correspondingTask.working_days[itemYear];
            var productivity = (correspondingTask.qty / (correspondingTask.duration || 1)); // Use qty or productivity from organizedData

            // Multiply each month's working day value with the qty/productivity value
            for (var month = 1; month <= 12; month++) {
                var currentMonth = month.toString();
                if (monthWiseWorkingDays.hasOwnProperty(currentMonth)) {
                    var multipliedValue = monthWiseWorkingDays[currentMonth] * productivity;
                    item[currentMonth] = multipliedValue;
                }
            }
        }
    });
}












frappe.ui.form.on('Master Plan', {
	fetch_resource: function(frm, cdt, cdn) {
		console.log("i am going to save it")
		calculateMachineryValues(frm, cdt, cdn, "1");
		calculateMaterialValues(frm, cdt, cdn, "1");
		calculateManpowerValues(frm, cdt, cdn, "1");

		calculateMachineryValues2(frm, cdt, cdn, "1")
		calculateManpowerValues2(frm, cdt, cdn, "1")
		calculateMaterialValues2(frm, cdt, cdn, "1")

		calculateMachineryValues(frm, cdt, cdn, "2");
		calculateMaterialValues(frm, cdt, cdn, "2");
		calculateManpowerValues(frm, cdt, cdn, "2");

		calculateMachineryValues2(frm, cdt, cdn, "2")
		calculateManpowerValues2(frm, cdt, cdn, "2")
		calculateMaterialValues2(frm, cdt, cdn, "2")


		calculateMachineryValues(frm, cdt, cdn, "3");
		calculateMaterialValues(frm, cdt, cdn, "3");
		calculateManpowerValues(frm, cdt, cdn, "3");

		calculateMachineryValues2(frm, cdt, cdn, "3")
		calculateManpowerValues2(frm, cdt, cdn, "3")
		calculateMaterialValues2(frm, cdt, cdn, "3")


		calculateMachineryValues(frm, cdt, cdn, "4");
		calculateMaterialValues(frm, cdt, cdn, "4");
		calculateManpowerValues(frm, cdt, cdn, "4");

		calculateMachineryValues2(frm, cdt, cdn, "4")
		calculateManpowerValues2(frm, cdt, cdn, "4")
		calculateMaterialValues2(frm, cdt, cdn, "4")


		calculateMachineryValues(frm, cdt, cdn, "5");
		calculateMaterialValues(frm, cdt, cdn, "5");
		calculateManpowerValues(frm, cdt, cdn, "5");

		calculateMachineryValues2(frm, cdt, cdn, "5")
		calculateManpowerValues2(frm, cdt, cdn, "5")
		calculateMaterialValues2(frm, cdt, cdn, "5")


		calculateMachineryValues(frm, cdt, cdn, "6");
		calculateMaterialValues(frm, cdt, cdn, "6");
		calculateManpowerValues(frm, cdt, cdn, "6");

		calculateMachineryValues2(frm, cdt, cdn, "6")
		calculateManpowerValues2(frm, cdt, cdn, "6")
		calculateMaterialValues2(frm, cdt, cdn, "6")


		calculateMachineryValues(frm, cdt, cdn, "7");
		calculateMaterialValues(frm, cdt, cdn, "7");
		calculateManpowerValues(frm, cdt, cdn, "7");

		calculateMachineryValues2(frm, cdt, cdn, "7")
		calculateManpowerValues2(frm, cdt, cdn, "7")
		calculateMaterialValues2(frm, cdt, cdn, "7")


		calculateMachineryValues(frm, cdt, cdn, "8");
		calculateMaterialValues(frm, cdt, cdn, "8");
		calculateManpowerValues(frm, cdt, cdn, "8");

		calculateMachineryValues2(frm, cdt, cdn, "8")
		calculateManpowerValues2(frm, cdt, cdn, "8")
		calculateMaterialValues2(frm, cdt, cdn, "8")


		calculateMachineryValues(frm, cdt, cdn, "9");
		calculateMaterialValues(frm, cdt, cdn, "9");
		calculateManpowerValues(frm, cdt, cdn, "9");

		calculateMachineryValues2(frm, cdt, cdn, "9")
		calculateManpowerValues2(frm, cdt, cdn, "9")
		calculateMaterialValues2(frm, cdt, cdn, "9")


		calculateMachineryValues(frm, cdt, cdn, "10");
		calculateMaterialValues(frm, cdt, cdn, "10");
		calculateManpowerValues(frm, cdt, cdn, "10");

		calculateMachineryValues2(frm, cdt, cdn, "10")
		calculateManpowerValues2(frm, cdt, cdn, "10")
		calculateMaterialValues2(frm, cdt, cdn, "10")


		calculateMachineryValues(frm, cdt, cdn, "11");
		calculateMaterialValues(frm, cdt, cdn, "11");
		calculateManpowerValues(frm, cdt, cdn, "11");

		calculateMachineryValues2(frm, cdt, cdn, "11")
		calculateManpowerValues2(frm, cdt, cdn, "11")
		calculateMaterialValues2(frm, cdt, cdn, "11")


		calculateMachineryValues(frm, cdt, cdn, "12");
		calculateMaterialValues(frm, cdt, cdn, "12");
		calculateManpowerValues(frm, cdt, cdn, "12");

		calculateMachineryValues2(frm, cdt, cdn, "12")
		calculateManpowerValues2(frm, cdt, cdn, "12")
		calculateMaterialValues2(frm, cdt, cdn, "12")

	},
});



function calculateMaterialValues(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};
	var materialAggregatedValuesCost = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData[m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}

		if (materialAggregatedValuesCost[itemName]) {
			materialAggregatedValuesCost[itemName] += activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		} else {
			materialAggregatedValuesCost[itemName] = activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_a[i];
		// var currentItemQty = frm.doc.operational_plan_material_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_material_detail_summarized_one_cost[i];

		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {

			var month_name = m
			console.log("silkshn newa", materialAggregatedValuesCost)
			currentItem[m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = materialAggregatedValuesCost[itemName]


		} else {
			currentItem[m] = 0;
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_a");
	frm.refresh_field("operational_plan_material_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_material_detail_summarized_one_cost");


}

function calculateMaterialValues2(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};
	var materialAggregatedValuesCost = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one_y2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one_y2[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData[m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}

		if (materialAggregatedValuesCost[itemName]) {
			materialAggregatedValuesCost[itemName] += activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		} else {
			materialAggregatedValuesCost[itemName] = activityMonthQuantity * materialItem.qty * materialItem.unit_price;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_a_y2.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_a_y2[i];
		// var currentItemQty = frm.doc.operational_plan_material_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_material_detail_summarized_one_cost[i];

		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {

			var month_name = m
			console.log("silkshn newa", materialAggregatedValuesCost)
			currentItem[m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = materialAggregatedValuesCost[itemName]


		} else {
			currentItem[m] = 0;
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_a_y2");
	frm.refresh_field("operational_plan_material_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_material_detail_summarized_one_cost");


}




function calculateManpowerValues(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};
	var manpowerAggregatedValuesCost = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData[ m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		}

		if (manpowerAggregatedValuesCost[job_title]) {
			manpowerAggregatedValuesCost[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		} else {
			manpowerAggregatedValuesCost[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		}
	}

	console.log("manppppppppp aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_a[i];
		// var currentItemQty = frm.doc.operational_plan_manpower_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_manpower_detail_summarized_one_cost[i];

		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			var month_name = m;
			console.log("silke", month_name, aggregatedValueForType);
			currentItem[m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = manpowerAggregatedValuesCost[job_title]
		} else {
			currentItem[m] = 0;
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_a");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_cost");

}

function calculateManpowerValues2(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};
	var manpowerAggregatedValuesCost = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one_y2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one_y2[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData[ m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity;
		}

		if (manpowerAggregatedValuesCost[job_title]) {
			manpowerAggregatedValuesCost[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		} else {
			manpowerAggregatedValuesCost[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.labor_no) / manpowerItem.productivity * manpowerItem.hourly_cost;
		}
	}

	console.log("manppppppppp aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_a_y2.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_a_y2[i];
		// var currentItemQty = frm.doc.operational_plan_manpower_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_manpower_detail_summarized_one_cost[i];

		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			var month_name = m;
			console.log("silke", month_name, aggregatedValueForType);
			currentItem[m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = manpowerAggregatedValuesCost[job_title]
		} else {
			currentItem[m] = 0;
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_a_y2");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_qty");
	frm.refresh_field("operational_plan_manpower_detail_summarized_one_cost");

}



function calculateMachineryValues(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};
	var machineryAggregatedValuesCost = {};


	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData[m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		}

		if (machineryAggregatedValuesCost[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValuesCost[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValuesCost[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		}

	}
	console.log("AGGRICAGEeeeejjjjjjjjeeeee", machineryAggregatedValuesCost)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_a[i];
		// var currentItemQty = frm.doc.operational_plan_machinery_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_machinery_detail_summarized_one_cost[i];

		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			var month_name = m;
			console.log("silkshn newa", machineryAggregatedValuesCost)
			currentItem[ m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = machineryAggregatedValuesCost[type]
			
		} else {
			currentItem[m] = 0; // or handle the case where there is no aggregated value for the type
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_a");
	// frm.refresh_field("operational_plan_machinery_detail_summarized_one_qty");
	// frm.refresh_field("operational_plan_machinery_detail_summarized_one_cost");

}

function calculateMachineryValues2(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};
	var machineryAggregatedValuesCost = {};


	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one_y2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one_y2[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData[m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity;
		}

		if (machineryAggregatedValuesCost[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValuesCost[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValuesCost[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.equp_no / machineryItem.productivity * machineryItem.rental_rate;
		}

	}
	console.log("AGGRICAGEeeeejjjjjjjjeeeee", machineryAggregatedValuesCost)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_a_y2.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_a_y2[i];
		// var currentItemQty = frm.doc.operational_plan_machinery_detail_summarized_one_qty[i];
		// var currentItemCost = frm.doc.operational_plan_machinery_detail_summarized_one_cost[i];

		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			var month_name = m;
			console.log("silkshn newa", machineryAggregatedValuesCost)
			currentItem[ m] = aggregatedValueForType;
			// currentItemQty[m] = aggregatedValueForType / (8 * frm.doc.no[0][month_name]);
			// currentItemCost[m] = machineryAggregatedValuesCost[type]
			
		} else {
			currentItem[m] = 0; // or handle the case where there is no aggregated value for the type
			// currentItemQty[m] = 0;
			// currentItemCost[m] = 0;
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_a_y2");
	// frm.refresh_field("operational_plan_machinery_detail_summarized_one_qty");
	// frm.refresh_field("operational_plan_machinery_detail_summarized_one_cost");

}

