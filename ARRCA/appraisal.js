frappe.ui.form.on ('Appraisal Goal', {
  score_final: function (frm, cdt, cdn) {
    var child = locals[cdt][cdn];
    console.log ('child', child);
    var total = 0;
    var table = frm.doc.goals;
    for (var i = 0; i < table.length; i++) {
      total += table[i].score_final || 0;
      console.log ('score', total);
    }
    frm.set_value ('total_scores', total);
    frm.refresh_field ('total_scores');
  },
});

frappe.ui.form.on ('Appraisal', {
  evaluation_percent: function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];

    frappe.model.set_value (
      d.doctype,
      d.name,
      'final_result',
      d.evaluation_percent * d.total_scores / 5
    );
  },
});

frappe.ui.form.on ('Appraisal', {
  total_scores: function (frm, cdt, cdn) {
    var d = locals[cdt][cdn];

    frappe.model.set_value (
      d.doctype,
      d.name,
      'final_result',
      d.evaluation_percent * d.total_scores / 5
    );
  },
});

//  frappe.ui.form.on("Appraisal", {

//     start_date_ec:function(frm, cdt, cdn) {
//         if(frm.doc.start_date_ec) {

//             var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
//             frm.doc.start_date = finalgc;
//             refresh_field("start_date");

//         }
//     },

//     end_date_ec:function(frm, cdt, cdn) {
//         if(frm.doc.end_date_ec) {

//             var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
//             frm.doc.end_date = finalgc;
//             refresh_field("end_date");

//         }
//     }
// });

frappe.ui.form.on ('Performance Levels', {
  value: function (frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.value && row.type) {
      if (row.type != 'ጊዜ') {
        if (row.value >= row.five) {
          row.grade = 5;
        } else if (row.value >= row.four) {
          row.grade = 4;
        } else if (row.value >= row.three) {
          row.grade = 3;
        } else if (row.value >= row.two) {
          row.grade = 2;
        } else {
          row.grade = 1;
        }
      } else {
        console.log ('wer are here');
        if (row.value >= row.one) {
          row.grade = 1;
        } else if (row.value >= row.two) {
          row.grade = 2;
        } else if (row.value >= row.three) {
          row.grade = 3;
        } else if (row.value >= row.four) {
          row.grade = 4;
        } else {
          row.grade = 5;
        }
      }
      // calculateWeight(frm, cdt, cdn);
      console.log ('grade value', row.grade);
      row.score = row.grade * row.per_weightage * (frm.doc.percent_value / 500);
      calculateTotal (frm);
      refresh_field ('goals');
    }
  },
  grade: function (frm, cdt, cdn) {
	console.log("kldj")
    var row = locals[cdt][cdn];
    if (row.value && row.type) {
      if (row.type != 'ጊዜ') {
        if (row.value >= row.five) {
          row.grade = 5;
        } else if (row.value >= row.four) {
          row.grade = 4;
        } else if (row.value >= row.three) {
          row.grade = 3;
        } else if (row.value >= row.two) {
          row.grade = 2;
        } else {
          row.grade = 1;
        }
      } else {
        console.log ('wer are here');
        if (row.value >= row.one) {
          row.grade = 1;
        } else if (row.value >= row.two) {
          row.grade = 2;
        } else if (row.value >= row.three) {
          row.grade = 3;
        } else if (row.value >= row.four) {
          row.grade = 4;
        } else {
          row.grade = 5;
        }
      }

    }
	      // calculateWeight(frm, cdt, cdn);
		  console.log ('grade value', row.grade);
		  row.score = row.grade * row.per_weightage * (frm.doc.percent_value / 500);
		  calculateTotal (frm);
		  refresh_field ('goals');
  },
});

// function calculateWeight(frm, cdt, cdn){
// 	var row = locals[cdt][cdn];
// 	if(row.score && row.per_weightage){
// 		console.log("enen new")
// 		row.weight_score = row.score * row.per_weightage /100;
// 	}
// }

function calculateTotal (frm) {
  var table = frm.doc.goals;
  var total = 0;
  table.map ((row, idx) => {
    total += row.score || 0;
  });
  frm.set_value ('total_scores', total);
  frm.refresh_field ('total_scores');
}
