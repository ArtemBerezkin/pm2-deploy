require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF,
  DEPLOY_PATH,
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy': `mkdir -p ${DEPLOY_PATH}`,
      'post-deploy': [
        'cd frontend',
        'npm ci',
        'npm run build',
      ].join(' && '),
    },
  },
};
