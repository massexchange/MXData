var AWS = require("aws-sdk");
AWS.config.loadFromPath("/etc/awsinfo");
var EC2 = new AWS.EC2();

var args = process.argv.slice(2);


getRelevantEC2InstanceByName = function(instanceName){
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

getRelevantEC2InstanceByName(args[0]).on("success", function(response){
	console.log(response.data.Reservations[0].Instances[0].PublicIpAddress);
});
