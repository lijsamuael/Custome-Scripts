cur_frm.add_fetch('employee', 'date_of_joining', 'date_of_joining');

const currentDate = new Date();

// Extract the day, month, and year from the Date object
const day = currentDate.getDate().toString().padStart(2, '0');
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
const year = currentDate.getFullYear();

// Create the formatted date string
const formattedCurrentDate = `${year}-${month}-${day}`;

console.log(formattedCurrentDate); 

frappe.ui.form.on('Leave Allocation', {
  to_date: function(frm) {
    // Get the value of the "from_date" field
    if (frm.doc.date_of_joining && frm.doc.leave_type == "Annual Leave") {
      const dateOfJoining = frm.doc.date_of_joining;
      const toDate = frm.doc.to_date;
      console.log("Date of Joining:", dateOfJoining);
      console.log("Current Date:", formattedCurrentDate);
  
      const dayDifference = getDayDifference(toDate, formattedCurrentDate);
		
      console.log("Date of Joining:", dateOfJoining);
      console.log("Current Date:", formattedCurrentDate);
	  console.log("Day difference", dayDifference); 

	  cur_frm.set_value("total_leave_allocated", dayDifference);
	  refresh_field("total_leaves_allocated");

		
      console.log("total leaves allocated", cur_frm.doc.total_leaves_allocated)
      console.log("new leaves allocated", cur_frm.doc.new_leaves_allocated)
		
    }
  }
});

function getDayDifference(toDate, fromDate) {
  const to_date = new Date(toDate);
  const joining_date = new Date(fromDate);

  
  // Calculate the time difference in milliseconds
  const timeDifference = to_date.getTime() - joining_date.getTime();
  
  // Convert milliseconds to days
  const dayDifference = ((timeDifference / (1000 * 60 * 60 * 24))/ 30) * (16/12);


  
  return dayDifference;
}

