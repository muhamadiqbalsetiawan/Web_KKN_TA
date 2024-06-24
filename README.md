## KKN UIN SGD Bandung
Lembaga Penelitian dan Pengabdian Kepada Masyarakat UIN Sunan Gunung Djati Bandung.

## Deploy to VPS - DEVELOPMENT

1. Connect to Server:

- ip : `103.55.33.61`
- port `1031`
- username : `root`
- password : `appkkn2022!`

2. Run this Command:

> Install `Nginx`

```
apt install nginx
``` 

> Install `pm2`

```
sudo npm install -g pm2
```

> Delete the default server configuration

```
rm -rf /var/www/html
rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
```

> Installing and configure Firewall

```
apt install ufw
ufw enable
ufw allow "Nginx Full"
```

> First configuration

```
nano /etc/nginx/sites-available/kkn-dev-2023
```

> Configure Nginx for Your Domain

```
server {
    listen 80;
    server_name kkn.uinsgd.site;

    location / {
        proxy_pass http://localhost:3000; # Assuming your Next.js app is running on port 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and Close the File: If you're using nano, press `Ctrl + O` to save and `Ctrl + X` to exit.

> Enable the Configuration

```
sudo ln -s /etc/nginx/sites-available/kkn-dev-2023 /etc/nginx/sites-enabled/
```

> Restart Nginx

```
sudo systemctl restart nginx
```

3. Run the Next.js App

> Move to this directory first

```
cd /var/www/
```

> Clone this repository

```
git clone https://github.com/Team-Dev-KKN-UIN-SGD-BDG-2023/kkn-dev-2023.git
```

> Go to directory folder

```
cd kkn-dev-2023
```

> Command

```
npm install
npm run build
```

> Create file config to run using pm2


```
nano ecosystem.config.js
```

> Use this example configuration

```
module.exports = {
  apps : [{
    name   : "kkn-dev2023",
    script : "npm run dev",
    // cron_restart: "0 0/5 * 1/1 ? *"
  }]
}
```

> Finally, run this command

```
pm2 start ecosystem.config.js
```

## Deploy to VPS - PRODUCTION

1. Connect to Server:

- ip : `103.55.33.114`
- port `22`
- username : `manager`
- password : `uinsgd#2k21`

2. Run this Command:

> Install `Apache2`

```
sudo apt-get update
sudo apt-get install apache2
``` 

> Install `pm2`

```
npm install pm2@latest -g
```

> Enable necessary Apache modules

```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod ssl
```

> Navigate to the Apache sites-available directory

```
cd /etc/apache2/sites-available/
```

> Create a new configuration file for `kkn.uinsgd.ac.id.conf`

```
sudo nano kkn.uinsgd.ac.id.conf
```

> Insert the following configuration for `kkn.uinsgd.ac.id.conf`

```
<VirtualHost *:80>
    ServerName kkn.uinsgd.ac.id
    ServerAlias www.kkn.uinsgd.ac.id

    ProxyRequests Off
    ProxyPreserveHost On

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/kkn.uinsgd.ac.id_error.log
    CustomLog ${APACHE_LOG_DIR}/kkn.uinsgd.ac.id_access.log combined
</VirtualHost>
```

> Create a new configuration file for `kkn.uinsgd.ac.id-le-ssl.conf`

```
sudo nano /etc/apache2/sites-available/kkn.uinsgd.ac.id-le-ssl.conf
```

> Insert the following configuration for `kkn.uinsgd.ac.id-le-ssl.conf`

```
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerAdmin webmaster@localhost
    ServerName kkn.uinsgd.ac.id
    ServerAlias www.kkn.uinsgd.ac.id

    SSLEngine on
    SSLCertificateFile /home/manager/ssl2023/STAR_uinsgd_ac_id.crt
    SSLCertificateKeyFile /home/manager/ssl2023/uinsgd_ac_id.key
    SSLCertificateChainFile /home/manager/ssl2023/STAR_uinsgd_ac_id.ca-bundle

    # Exclude phpMyAdmin from proxy
    Alias /phpmyadmin "/usr/share/phpmyadmin"
    <Directory "/usr/share/phpmyadmin">
        Require all granted
        Options FollowSymLinks MultiViews
        AllowOverride All
    </Directory>

    ProxyRequests Off
    ProxyPreserveHost On
    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass /phpmyadmin !
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/kkn.uinsgd.ac.id-error.log
    CustomLog ${APACHE_LOG_DIR}/kkn.uinsgd.ac.id-access.log combined
</VirtualHost>
</IfModule>
```

> Enable the kkn site
```
sudo a2ensite kkn.uinsgd.ac.id.conf
```

> Reload Apache to apply changes

```
sudo systemctl reload apache2
```

or restart

```
sudo systemctl restart apache2
```

> Go to directory

```
cd /var/www/
```

> Create a folder named `kkn.uinsgd.ac.id`

```
mkdir kkn.uinsgd.ac.id
```

> Clone this repository

```
cd kkn.uinsgd.ac.id
git clone https://github.com/Team-Dev-KKN-UIN-SGD-BDG-2023/kkn-dev-2023.git .
```

> Go to your application directory if already created the folder and clone this repository

```
cd /var/www/kkn.uinsgd.ac.id
```

> Install dependencies

```
npm install
```

> Build your Next.js application

```bash
npm run build
```

> Start your application. You might want to use a process manager like PM2 to keep it running in the background

```bash
pm2 start npm --name "kkn-unisgd-ac-id" -- start
```

## Import Database

> Got to directory file

```bash
cd /var/www/kkn-dev-2023
```

> Command

```bash
mysql -u username -p database_name < your_sql_file.sql
```

> e.g.

```bash
mysql -u root -p kknv3 < kknv3.sql
```

> Credentials

- Username: `root`
- Password: `@v.Kbu8nBceNVUS`
