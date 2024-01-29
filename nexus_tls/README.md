Setting up SSL on Nexus Repository Manager 3 (OSS) using an Apache reverse proxy involves several steps. Here’s a detailed guide:

### Prerequisites
1. **Apache Web Server Installed**: Ensure you have Apache installed on your server.
2. **SSL Certificate**: Obtain an SSL certificate from a Certificate Authority (CA) or generate a self-signed certificate if it's for testing purposes.
3. **Nexus Repository Manager 3**: Installed and running on your server.

### Steps

#### 1. Prepare SSL Certificate and Key
- Place your SSL certificate and key files on the server. Common locations are `/etc/ssl/certs` for the certificate and `/etc/ssl/private` for the key.
- If you're using a self-signed certificate, you can generate one using OpenSSL:
  ```
  openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
  ```
- Make sure the permissions on the key file are secure (`chmod 600 /path/to/key.pem`).

#### 2. Configure Apache as a Reverse Proxy
- **Enable Necessary Modules**: Make sure the following Apache modules are enabled: `ssl`, `proxy`, `proxy_http`.
  ```
  a2enmod ssl proxy proxy_http
  ```
- **Create a Virtual Host Configuration**:
  - Edit the Apache configuration file or create a new one under `/etc/apache2/sites-available/`. For example, `nexus-ssl.conf`.
  - Configure the VirtualHost to listen on port 443 and proxy requests to Nexus. Here’s an example configuration:
    ```apache
    <VirtualHost *:443>
        ServerName nexus.example.com

        SSLEngine on
        SSLCertificateFile /etc/ssl/certs/cert.pem
        SSLCertificateKeyFile /etc/ssl/private/key.pem

        ProxyRequests Off
        ProxyPreserveHost On
        ProxyPass / http://localhost:8081/
        ProxyPassReverse / http://localhost:8081/

        <Proxy *>
            Order deny,allow
            Allow from all
        </Proxy>

        ErrorLog ${APACHE_LOG_DIR}/nexus_error.log
        CustomLog ${APACHE_LOG_DIR}/nexus_access.log combined
    </VirtualHost>
    ```
  - Replace `nexus.example.com` with your domain, and adjust paths for your SSL certificate and key.

#### 3. Enable the Virtual Host
- Enable your new site configuration:
  ```
  a2ensite nexus-ssl.conf
  ```
- Restart Apache to apply the changes:
  ```
  systemctl restart apache2
  ```

#### 4. Update Nexus Base URL
- Log into Nexus as an admin.
- Go to `Administration` → `Server`.
- Update the `Base URL` to reflect the new HTTPS address (e.g., `https://nexus.example.com`).

#### 5. Test Your Configuration
- Open a web browser and navigate to `https://nexus.example.com` (or your configured domain).
- Ensure that you can access Nexus Repository Manager via HTTPS without any security warnings.
- Check the Apache logs for any errors if you encounter issues.

#### 6. Optional Steps
- Redirect HTTP to HTTPS by adding a redirect rule in Apache configuration.
- Implement HSTS (HTTP Strict Transport Security) for enhanced security.

### Conclusion
Setting up SSL for Nexus OSS with Apache as a reverse proxy enhances the security of your repository. Always test thoroughly and ensure your SSL certificates are kept up to date. For troubleshooting, the Apache and Nexus logs are valuable resources.
