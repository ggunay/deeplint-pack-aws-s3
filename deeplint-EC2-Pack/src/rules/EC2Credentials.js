exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    const _ = require('lodash')
    const  access_key_pattern = '(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])'
    const  secret_key_pattern = '(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])'
    accessRex = new RegExp(access_key_pattern)
    secretRex = new RegExp(secret_key_pattern)

    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if (resource.type === 'aws::ec2::instance' || resource.type === 'aws::ec2::host') {
                let hasKeys = false;

                if (_.has(resource.properties, 'user_data') && !(accessRex.test(resource.properties.user_data) && !(secretRex.test(resource.properties.user_data)) )) {
                    hasKeys = true;
                }
                if (!hasKeys) {
                    problems.push({
                        message: `AWS EC2 Instace or Host : ${resource.name} contains static access or secret keys`
                    })
                }
            }
        }
    }
    return problems


    
}