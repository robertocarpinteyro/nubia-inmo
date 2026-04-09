const { Sequelize } = require('sequelize');
const fs = require('fs');

const seq = new Sequelize('postgres', 'postgres.fafjujnwwcgijzvouwgb', 'NubiaDB2026', {
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 6543,
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
});

const PROJECT_URL = "https://fafjujnwwcgijzvouwgb.supabase.co/storage/v1/object/public";

seq.query('SELECT bucket_id, name FROM storage.objects ORDER BY bucket_id, name;').then(res => {
  const objects = res[0];
  let md = "# Enlaces a tus Imágenes en Supabase\n\n";
  let currentBucket = "";

  objects.forEach(obj => {
    if(obj.name === '.emptyFolderPlaceholder') return;
    if(obj.bucket_id !== currentBucket) {
       currentBucket = obj.bucket_id;
       md += `\n### Bucket: ${currentBucket}\n\n`;
    }
    const safeUrl = `${PROJECT_URL}/${obj.bucket_id}/${obj.name.replace(/ /g, '%20')}`;
    md += `${safeUrl}\n\n`;
  });

  fs.writeFileSync('C:\\Users\\AMD FX\\Documents\\InmoAltara\\Hozn-RealEstate-Fullstack-main\\enlaces.txt', md);
  console.log("SUCCESS");
  process.exit(0);
}).catch(console.error);
