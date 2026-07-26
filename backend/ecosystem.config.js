require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_REF,
  DEPLOY_PATH,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: './dist/app.js',
      env: {
        NODE_ENV: 'production',
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
        `ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/shared"`,
        `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      ].join(' && '),
      'pre-deploy': `mkdir -p ${DEPLOY_PATH}/shared`,
      'post-deploy': [
        'cd backend',
        'cp ../../shared/.env .env',
        'npm ci',
        'npm run build',
        'pm2 startOrReload ecosystem.config.js --env production',
      ].join(' && '),
    },
  },
};
