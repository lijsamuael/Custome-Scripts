var dependency = [
	{
		activity: "A",
		predecessor: null,
		lag_day: null,
		relation: null,
		duration: 5
	},
	{
		activity: "B",
		predecessor: "A",
		lag_day: null,
		relation: "F-S",
		duration: 10
	},
	{
		activity: "C",
		predecessor: "B",
		lag_day: 10,
		relation: "S-S",
		duration: 10
	},
	{
		activity: "D",
		predecessor: "B",
		lag_day: 5,
		relation: "S-S",
		duration: 15
	},
	{
		activity: "E",
		predecessor: "B",
		lag_day: null,
		relation: "F-S",
		duration: 15
	},
	{
		activity: "E",
		predecessor: "C",
		lag_day: 10,
		relation: "F-F",
		duration: 15
	},
	{
		activity: "E",
		predecessor: "D",
		lag_day: 10,
		relation: "F-F",
		duration: 15
	},
	{
		activity: "F",
		predecessor: "E",
		lag_day: null,
		relation: "F-S",
		duration: 10
	},
	{
		activity: "G",
		predecessor: "D",
		lag_day: null,
		relation: "F-S",
		duration: 4
	},
	{
		activity: "G",
		predecessor: "F",
		lag_day: 10,
		relation: "S-F",
		duration: 4
	},
	{
		activity: "H",
		predecessor: "C",
		lag_day: 5,
		relation: "F-S",
		duration: 5
	},
	{
		activity: "I",
		predecessor: "F",
		lag_day: null,
		relation: "F-S",
		duration: 5
	},
	{
		activity: "I",
		predecessor: "G",
		lag_day: 10,
		relation: "F-F",
		duration: 5
	},
	{
		activity: "I",
		predecessor: "H",
		lag_day: 10,
		relation: "F-F",
		duration: 5
	}

]

function calculateCriticalPath(dependency) {
  let nodes = {};

  dependency.forEach(task => {
	if (!nodes[task.activity]) {

	  if (!task.predecessor) {
		nodes[task.activity] = { es: [0], ef: [task.duration] };
		console.log("nodes first", nodes)
	  }

	  else {
		nodes[task.activity] = { es: [], ef: [] };
		console.log("nodes final", nodes)

		if (task.relation == "F-S") {
		  let predecessorEf = nodes[task.predecessor]["ef"].length - 1;
		  nodes[task.activity]["es"].push(nodes[task.predecessor]["ef"][predecessorEf] + task.lag_day);
		  nodes[task.activity]["ef"].push(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1] + task.duration);
		}
		else if (task.relation == "S-F") {
		  let predecessorEs = nodes[task.predecessor]["es"].length - 1;
		  nodes[task.activity]["ef"].push(nodes[task.predecessor]["es"][predecessorEs] + task.lag_day);
		  // nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
		}
		else if (task.relation == "S-S") {
		  let predecessorEs = nodes[task.predecessor]["es"].length - 1;
		  nodes[task.activity]["es"].push(nodes[task.predecessor]["es"][predecessorEs] + task.lag_day);
		  nodes[task.activity]["ef"].push(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1] + task.duration);
		}
		else if (task.relation == "F-F") {
		  let predecessorEf = nodes[task.predecessor]["ef"].length - 1;
		  nodes[task.activity]["ef"].push(nodes[task.predecessor]["ef"][predecessorEf] + task.lag_day);
		  // nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
		}
	  }
	}

	else {

	  if (task.relation == "F-S") {
		let predecessorEf = nodes[task.predecessor]["ef"].length - 1;
		nodes[task.activity]["es"].push(nodes[task.predecessor]["ef"][predecessorEf] + task.lag_day);
		nodes[task.activity]["ef"].push(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1] + task.duration);
	  }
	  else if (task.relation == "S-F") {
		let predecessorEs = nodes[task.predecessor]["es"].length - 1;
		nodes[task.activity]["ef"].push(nodes[task.predecessor]["es"][predecessorEs] + task.lag_day);
		// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
	  }
	  else if (task.relation == "S-S") {
		let predecessorEs = nodes[task.predecessor]["es"].length - 1;
		nodes[task.activity]["es"].push(nodes[task.predecessor]["es"][predecessorEs] + task.lag_day);
		nodes[task.activity]["ef"].push(nodes[task.activity]["es"][nodes[task.activity]["es"].length - 1] + task.duration);
	  }
	  else if (task.relation == "F-F") {
		let predecessorEf = nodes[task.predecessor]["ef"].length - 1;
		nodes[task.activity]["ef"].push(nodes[task.predecessor]["ef"][predecessorEf] + task.lag_day);
		// nodes[task.activity]["es"].push(nodes[task.activity]["ef"][nodes[task.activity]["ef"].length - 1] - task.duration);
	  }
	}
  });




 for (let i = dependency.length - 1; i >= 0; i--) {

	  let task = dependency[i];


		 if( i == dependency.length -1){
			 console.log("task", nodes[task.activity].ef)
			 console.log("max value", Math.max.apply(null, nodes[task.activity].ef))
			 nodes[task.activity].lf = [Math.max.apply(null, nodes[task.activity].ef)];
			 nodes[task.activity].ls = [nodes[task.activity].lf - task.duration];
		 }

		if(task.predecessor){
				 if(!nodes[task.predecessor].lf){
					 nodes[task.predecessor].lf = [];
				 }
			 if(!nodes[task.predecessor].ls){
				 nodes[task.predecessor].ls = [];
			 }


			   if (task.relation == "F-S") {
				 let value = nodes[task.activity]["ls"].length -1;
				 nodes[task.predecessor]["lf"].push(nodes[task.activity]["ls"][value] - task.lag_day);
				 let duration = dependency.find((item) => item.activity == task.predecessor).duration;
				 nodes[task.predecessor]["ls"].push(nodes[task.predecessor]["lf"][nodes[task.predecessor]["lf"].length - 1] - duration);
			   }

			   else if (task.relation == "S-F") {
				 nodes[task.predecessor]["ls"].push(nodes[task.activity]["lf"][nodes[task.predecessor]["lf"].length - 1] -  task.lag_day);
			   }

			   else if (task.relation == "S-S") {
				 nodes[task.predecessor]["ls"].push(nodes[task.activity]["ls"][nodes[task.predecessor]["ls"].length - 1] - task.lag_day);
			   }

			   else if (task.relation == "F-F") {
				   let value = nodes[task.activity]["lf"].length -1;
				   nodes[task.predecessor]["lf"].push(nodes[task.activity]["lf"][value] - task.lag_day);
				   let duration = dependency.find((item) => item.activity == task.predecessor).duration;
				   nodes[task.predecessor]["ls"].push(nodes[task.predecessor]["lf"][nodes[task.predecessor]["lf"].length - 1] - duration);
			   }
		}
	 console.log("node from ", task.activity, nodes)
  }

  return nodes;
}




const result = calculateCriticalPath(dependency);


console.log("Nodes of final result:", result);


const nodesArray = Object.entries(result).map(([key, value]) => ({ [key]: value }));

const processedNodesArray = nodesArray.map(obj => {
  const [key, value] = Object.entries(obj)[0];
  const es = Math.max(...value.es);
  const ef = Math.max(...value.ef);
  const lf = Math.min(...value.lf);
  const ls = Math.min(...value.ls);
  const ss = ls - es;
  const ff = lf - ef;

  return { [key]: { es, ef, lf, ls, ss, ff } };
});

console.log(processedNodesArray);

const nodesWithSSZero = processedNodesArray.filter(obj => Object.values(obj)[0].ss === 0);
const nodeNamesWithSSZero = nodesWithSSZero.map(obj => Object.keys(obj)[0]);

console.log(nodeNamesWithSSZero);
