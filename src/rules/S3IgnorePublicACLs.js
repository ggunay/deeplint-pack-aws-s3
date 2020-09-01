exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    const _ = require('lodash')
    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if (resource.type === 'aws::s3::types::publicaccessblockconfiguration') {
                let isEnabled = false;


                try{

                if (_.has(resource.properties, 'ignore_public_acls') && resource.properties.ignore_public_acls == true) {
                    
                    isEnabled = true;

                    
                    
                }
                if (!isEnabled) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} does not have ignore public ACLS enabled`
                    })
                }
            }

                catch(e) {

                    console.error(e.message);
                }
        
                finally{
        
                    continue
        
                }
            }
        }
    }
    return problems
}