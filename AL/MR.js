frappe.ui.form.on('Material Request', {
	onload: function(frm) {

		if (frm.doc.__islocal) {
			frm.set_df_property('prepared_by', 'reqd', true);  // Make field mandatory
			console.log("test1");
		}
		else if (frm.doc.workflow_state === 'draft') {
			frm.set_df_property('checked_by', 'reqd', true);   // Make field mandatory
			console.log("test2");
			frm.refresh_field("checked_by");
		}

		else if (frm.doc.workflow_state === 'Checked') {
			frm.set_df_property('approved_by', 'reqd', true);  // Make field mandatory
			console.log("test3");
			frm.refresh_field("approved_by");

		}

	}
});


frappe.ui.form.on('Material Request Item', {
	for_which_task: function(frm, cdt, cdn) {
		console.log("Test 1");
		var child_doc = locals[cdt][cdn];
		console.log("child doc", child_doc)

		// Fetch the value of 'for_which_task' from the Material Request Item
		var forWhichTask = child_doc.for_which_task;
		console.log("form which task", forWhichTask)


		// Fetch the corresponding Task document
		frappe.model.with_doc("Task", forWhichTask, function() {
			console.log("Test 2");

			var taskDoc = frappe.model.get_doc("Task", forWhichTask);
			console.log("Task doc", taskDoc);
			console.log("item code", taskDoc.item_code);



			// Fetch the value of 'quantity1' from the item_detail_planning child table of the Task doctype
			var plannedQuantity = 0;

			console.log("planned quantity", plannedQuantity);

			// Loop through the item_detail_planning table in Material Request and set 'quantity1' field in each row
			taskDoc.item_detail_planning.forEach(function(row) {
				console.log("Test 3")
				if (row.item === child_doc.item_code) {
					console.log("Task 4")
					console.log("quantity", row.quantity1);
					// frappe.model.set_value(row.doctype, row.name, "task_planned_item_quantity", row.quantity1);
					child_doc.task_planned_item_quantity = row.quantity1;
					console.log(child_doc.task_planned_item_quantity)
					frm.refre

				}
			});
			//prevent saving if the quantity is greater than the planned quantity
			console.log("requested quantity", child_doc.qty);
			console.log("Planned quantity", child_doc.task_planned_item_quantity)

			// if(child_doc.qty > child_doc.task_planned_item_quantity){
			// 	console.log("Test 5")

			// 	frappe.msgprint(__("You can not request a quantity more than the planned quantity."));
			//         		frappe.validated = false; 

			// }

		});
	}
});


frappe.ui.form.on('Material Request', {
	before_save: function(frm, cdt, cdn) {
		console.log("Test 11");
		var child_doc = locals[cdt][cdn];
		console.log("child doc 11", child_doc)
		//iterate throw each row in a child table
		child_doc.items.forEach(function(row) {
			console.log("Test 44")

			console.log("requested quantity", row.qty);
			console.log("Planned quantity", row.task_planned_item_quantity)
			// Check your condition here; for example, if the field 'my_field' is empty, prevent saving
			if (row.qty > row.task_planned_item_quantity) {
				console.log("Test 55")

				frappe.msgprint(__("You can not request a quantity more than the planned quantity."));
				frappe.validated = false;

			}

		})

	}
});



