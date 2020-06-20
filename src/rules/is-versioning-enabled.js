exports.check = async function (context) {
    const resources = context.getResources()
    let problems = []
    for (const key of Object.keys(resources)) {
        for (const resource of resources[key]) {
            if(resource.type === 'aws::s3::bucket') {
                if(resource.properties.VersioningConfiguration && ('Status' in resource.properties.VersioningConfiguration)) {
                    problems.push({
                        message: `AWS S3 Bucket: ${resource.name} does not enable versioning`
                    })
                }

            }
        }
    }
    return problems
}
