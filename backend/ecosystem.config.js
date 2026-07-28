require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF,
  DEPLOY_PATH,
  DEPLOY_ENV_PATH = `${DEPLOY_PATH}/shared/.env`,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: './dist/app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': [
        `ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p $(dirname ${DEPLOY_ENV_PATH})"`,
        `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_ENV_PATH}`,
      ].join(' && '),
      'pre-deploy': `mkdir -p ${DEPLOY_PATH}/shared`,
      'post-deploy': [
        'cd backend',
        `cp ${DEPLOY_ENV_PATH} .env`,
        'npm ci',
        'npm run build',
        'pm2 startOrReload ecosystem.config.js --env production',
        'pm2 save',
      ].join(' && '),
    },
  },
};
