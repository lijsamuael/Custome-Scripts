frappe.ui.form.on('Item', {
    item_category: updateItemCode,
    item_name: updateItemCode,
    item_sub_category: updateItemCode
});
function updateItemCode(frm) {
    if (frm.doc.item_category && frm.doc.item_sub_category && frm.doc.item_name) {
        frappe.model.with_doc("Item Category", frm.doc.item_category, function() {
            var category = frappe.model.get_doc("Item Category", frm.doc.item_category);
			console.log("category", category);
            var categoryPrefix = category.category_code.substring(0, 2);
            frappe.model.with_doc("Item Sub Category", frm.doc.item_sub_category, function() {
                var subCategory = frappe.model.get_doc("Item Sub Category", frm.doc.item_sub_category);
				console.log("item sub category", subCategory);
                var subCategoryPrefix = subCategory.sub_category_code.substring(0, 2);
                var name_prefix = frm.doc.item_name.substring(0, 1).toUpperCase();

				//aderaw, your mistake was here on the filters, you was filtering with the entire object
				//which means they should be filtered with the sub and the major category, and they exist on .name property
				//i only fix this issue all the other was correct
				  
				var filters = {
					item_sub_category: subCategory.name,
					item_category: category.name
				}
             
                // Query the database to fetch all item_code_counter values
                frappe.call({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: "Item",
                        filters: filters,
                        fields: ["item_code"],                        
                    },
                    callback: function(response) {
                        var maxCounter = 0;
                        if (name_prefix && response.message && Array.isArray(response.message)) {
                            var records = response.message;
							console.log("records", records);
                                for (var i = 0; i < records.length; i++) {
                                    var itemCode = response.message[i].item_code;
                                    // console.log(`the digits $`)
                                    var lastDigits = itemCode.slice(-5);
                                    // console.log(`item code ${itemCode}`)
                                    var numDigits=lastDigits.slice(-4)
                                    // console.log(`number digits are ${numDigits}`)
                                     // console.log(`last digits ${lastDigits}`)
                                    var counter = parseInt(numDigits);
                                    // console.log(`name prefix is ${name_prefix} firstDigit :${lastDigits[0]}`)
                                     if(lastDigits[0]==name_prefix){
                                         // console.log(` here is the last digit's ${lastDigits[0]}`)                                        
                                            if (counter > parseInt(maxCounter)) {
                                                maxCounter = counter;
                                            }
                                      
                                     }

                                   
                                }
                            
                        } else {
                            
                            // Handle the case when response.message is not an array
                        }
                        console.log(`maximum counter is ${maxCounter}`);
                        var itemCode = categoryPrefix + subCategoryPrefix + "-" + name_prefix + ("0000" + (maxCounter + 1)).slice(-4);
                    
                        frm.set_value("item_code", itemCode);
                        console.log(`the maximum added counter is ${maxCounter + 1}`);
                        frm.set_value("item_code_counter", maxCounter + 1);
                       
                    }
                    
                });
            });
        });
    }
}


frappe.ui.form.on("Item", {
    item_category: function(frm, cdt, cdn) {
     
     var d = locals[cdt][cdn];

     frm.set_query("item_sub_category", function() {
        return {
            "filters": {
                "item_category": frm.doc.item_category
            }
        }
     });
   },
});

frappe.ui.form.on("Item", {
    
    item_sub_category:function(frm, cdt, cdn) {
        cur_frm.add_fetch('item_sub_category', 'item_category', 'item_category');
        refresh_field('item_category')
    }
});

//set the value of the item name automatically to the description
frappe.ui.form.on("Item", {
    item_name:function(frm, cdt, cdn) {
		console.log("test 1");
        if(frm.doc.item_name){
			console.log("test 2");
			frm.set_value("description",frm.doc.item_name)
		}
        refresh_field('description')
    }
});
  