const AWS = require("aws-sdk");
AWS.config.loadFromPath("/etc/awsinfo");
const EC2 = new AWS.EC2();

const arg = process.argv.slice(2)[0];


const getEC2InstanceByName = function(instanceName){
    var params = {
        "Filters":[
            {
                "Name":"tag-key",
                "Values":["Name"]
            },
            {
                "Name":"tag-value",
                "Values":[instanceName]
            }
        ]
    };
    return EC2.describeInstances(params).promise();
};

const main = () => {
    if (!arg) {
        console.log("Error: No instance name given. Exiting.");
        process.exitCode = 1;
        return;
    }
    getEC2InstanceByName(arg)
    .then(response => {
        //first filter out only whats running.
        let reservations = response.Reservations;
        let goodReservations = reservations.filter(reservation => {
            return reservation.Instances[0].State.Name == "running";
        });
        if (goodReservations.length == 1){ //we have exactly one good one.
            console.log(goodReservations[0].Instances[0].PublicIpAddress);
        } else if (goodReservations.length > 1){ //we have more than one good one.
            console.log("Multiple instances for that name found.");
            console.log("Please alert Ops regarding this issue, as instance names should be unique.");
            process.exitCode = 1;
        } else { //none found
            console.log("No instances for that name found.");
            console.log("The instance is either off or doesn't exist.");
            process.exitCode = 1;
        }
    });
};

main();
