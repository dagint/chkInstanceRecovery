// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');

AWS.config.update({
		region: 'us-east-2'
});

// Create ec2 service object
var ec2 = new AWS.EC2();
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});

printStatuses();

function printStatuses () {
	var params = {
		Filters: [
			{
				Name: 'instance-state-name',
				Values: [
					'running'
				],
			}
		]
	};

	ec2.describeInstances(params,function(err,data) {
		if
			(err) console.log(err, err.stack);
		else
			var currentTime = new Date();
			//console.log(currentTime.toString());


			for(var r=0,rlen=data.Reservations.length; r<rlen; r++) {
				var reservation = data.Reservations[r];
				for(var i=0,ilen=reservation.Instances.length; i<ilen; ++i) {
					var instance = reservation.Instances[i];

					var name = '';
					for(var t=0,tlen=instance.Tags.length; t<tlen; ++t) {
						if(instance.Tags[t].Key === 'Name') {
							name =instance.Tags[t].Value;
						}
					}

					//console.log('\t'+name+'\t'+instance.InstanceId+'\t'+instance.PublicIpAddress+'\t'+instance.InstanceType+'\t'+instance.ImageId+'\t'+instance.State.Name)
					chkRecoveryAlarm(instance.InstanceId);
				}
			}

	});
}


function chkRecoveryAlarm(strInstanceId) {
	var isEnabled = false;
	var params = {
		MetricName: 'StatusCheckFailed_System',
		Namespace: 'AWS/EC2',
		Dimensions: [
			{
			Name: 'InstanceId',
			Value: strInstanceId
		}
		]
	};
	cw.describeAlarmsForMetric(params, function(err, data) {
		//console.log(params);
		//console.log(data);
		if (err) {
			//console.log('test1');
			//console.log(err, err.stack+'\n'+'Error the following instance does not have recovery enabled:'+'\t'+strInstanceId);

		} else {
			//console.log('test2');
			// List the names of the current alarms
			data.MetricAlarms.forEach(function(item, index, array) {
				if (item.ActionsEnabled === true) {
					isEnabled = true;
				}
			});

			//console.log('Instance Recovery enabled:'+'\t'+strInstanceId)
			//console.log('test3');
		}
		console.log(strInstanceId+'\t'+isEnabled)
		//console.log (isEnabled+'\t'+"testing is now over");
		//return isEnabled;
	})
}
