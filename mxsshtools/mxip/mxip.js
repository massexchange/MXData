var AWS = require("aws-sdk");
AWS.config.loadFromPath("/etc/awsinfo");
var EC2 = new AWS.EC2();

var args = process.argv.slice(2);


const getEC2InstanceByName = function(instanceName){
	var params = {
		"Filters":[{
			"Name":"tag-key",
			"Values":["Name"]
		},
		{
			"Name":"tag-value",
			"Values":[instanceName]
		}
		]
	};
	return EC2.describeInstances(params, function(err,data){
		if (err){
			console.log(err, err.stack);
			console.log("getRelevantEC2InstancesByEnvironment failed");
		}
	})
};

const main = () => {
	if (!args[0]) {
		console.log("Error: No instance name given. Exiting.");
		process.exitCode = 1;
		return
	}
	getEC2InstanceByName(args[0]).on("success", function(response){
		console.log(response.data.Reservations[0].Instances[0].PublicIpAddress);
	});
}
