export const environment = {
  production: false,
  apiUrl: "https://j6qi93krkk.execute-api.us-east-2.amazonaws.com/staging/backend",
  s3config: {
    accessKeyId: 'AKIAWQIZ5BOBWTIK4KFV',
    secretAccessKey: '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',
    region: 'us-east-1',
  },
  awsconfig: {
    aws_project_region: "us-east-2",
    aws_cognito_identity_pool_id:
      "us-east-2:8b6f0392-7976-40c9-98ad-24b0517d3cb3",
    aws_cognito_region: "us-east-2",
    aws_user_pools_id: "us-east-2_PFDjNf0MO",
    aws_user_pools_web_client_id: "2vi2pdqc5bife3gsu9flmmbj8a",
    oauth: {},
  }
};
