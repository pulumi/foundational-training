import os
import json

def handler(event, context):
    bucket_name = os.environ.get('BUCKET_NAME')
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Hello from Lambda! I can access the bucket: {bucket_name}'
        })
    }