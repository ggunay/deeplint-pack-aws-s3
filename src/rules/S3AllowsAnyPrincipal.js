exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    const _ = require('lodash')
    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if (resource.type === 'aws::s3::bucketpolicy') {
                let isPrincipleBlocked = true;

                try {

                if (_.has(resource.properties, 'policy') && _.has(resource.properties.policy, 'Statement'))
                 {
                    if (_.has(resource.properties.policy.statement, 'Effect') && resource.properties.policy.statement.effect != "Deny") 
                    {
                    isPrincipleBlocked = false;
                    
                    }

                    
                    if (_.has(resource.properties.policy.statement, 'Principal') && resource.properties.policy.statement.principal == "*") 
                    {
                    isPrincipleBlocked = false;
                    
                    }
                    else if ((_.has(resource.properties.policy.statement, 'Principal')) && String(resource.properties.policy.statement.principal).includes("AWS"))
                            {

                                aws = resource.properties.policy.statement.principal.aws;

                                if (typeof(aws) == "string" && aws == "*") or (aws.isArray && aws.includes("*"))
                                {isPrincipleBlocked = false;}
                            }

                }
                if (!isPrincipleBlocked) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} allows action with any Principle`
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