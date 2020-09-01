exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    const _ = require('lodash')


    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if (resource.type === 'aws::s3::bucket') {
                let isPublic = false;


                try{

                    if (_.has(resource.properties, 'BucketACLs.Grants')) {
                        for (const rule of resource.properties.BucketACLs.Grants) {
                            if (rule.Grantee.URI === "http://acs.amazonaws.com/groups/global/AllUsers") {
                                if (rule.Permission === 'READ' || rule.Permission === 'FULL_CONTROL') {
                                    isPublic = true;
                                    break;
                                }
                            }
                        }
                    }
                if (isPublic) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} has an ACL which allows public READ`
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