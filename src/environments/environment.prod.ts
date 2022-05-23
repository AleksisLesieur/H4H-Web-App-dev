export const environment = {
  production: true,
  apiUrl: "https://lbpur12oe8.execute-api.us-east-1.amazonaws.com/prod/backend",
  s3config: {
    accessKeyId: 'AKIAWQIZ5BOBWTIK4KFV',
    secretAccessKey: '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',
    region: 'us-east-1',
  },
  awsconfig: {
    aws_project_region: "us-east-1",
    aws_cognito_identity_pool_id:
      "us-east-1:4146f836-5f2d-4cae-b910-d94ebd1e287b",
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: "us-east-1_fAF1gzXO5",
    aws_user_pools_web_client_id: "5p35rao6p6h0ao9630vg2nin64",
    oauth: {},
  }
};
