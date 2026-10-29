module.exports = {
  apps: [
    {
      name: "personal-constitution",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "./personal_constitution",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};

