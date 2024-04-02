To set up SSH key-based authentication to connect from your Windows laptop to a RHEL (Red Hat Enterprise Linux) server without entering your password every time, follow these steps. The process involves creating a pair of SSH keys on your Windows laptop, then adding the public key to your RHEL server.

### Step 1: Install an SSH Client on Windows

First, ensure you have an SSH client installed on your Windows laptop. Windows 10 and later versions come with OpenSSH client features that you can enable through the Windows Features settings or use directly in PowerShell or Command Prompt. If you're using an older version of Windows or prefer a different tool, you might consider downloading PuTTY or another SSH client that supports key generation.

### Step 2: Generate an SSH Key Pair on Windows

#### Using OpenSSH in PowerShell or Command Prompt

1. Open PowerShell or Command Prompt.
2. Generate a new SSH key pair with the following command:
   ```shell
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   Replace `your_email@example.com` with your email address. This command creates a new SSH key, using the provided email as a label.

3. You will be asked to confirm the location of the saved key and to enter a passphrase for extra security. Press Enter to accept the default location (`C:\Users\your_username/.ssh/id_rsa`).

#### Using PuTTY on Windows

1. Download and install PuTTY from the official site.
2. Open PuTTYgen (PuTTY Key Generator) from the Start Menu.
3. For Type of key to generate, select `RSA` and set the number of bits in the generated key to `4096`.
4. Click `Generate`, and move your mouse over the blank area as instructed to generate randomness.
5. Once the key is generated, you can set a passphrase for extra security in the Key passphrase fields.
6. Save your private key by clicking `Save private key`. You can save the public key as well, but you'll need the text of the public key for the next steps.

### Step 3: Add Your SSH Public Key to the RHEL Server

1. Log into your RHEL server with your usual method.
2. Go to your home directory:
   ```shell
   cd ~
   ```
3. Create a `.ssh` directory if it doesn't already exist:
   ```shell
   mkdir -p .ssh
   ```
4. Append your public key to the `~/.ssh/authorized_keys` file:
   - If you used OpenSSH to generate your key, the public key is stored in `C:\Users\your_username/.ssh/id_rsa.pub`. Open this file with a text editor, copy its contents, and append them to `~/.ssh/authorized_keys` on your RHEL server.
   - If you used PuTTYgen, you can copy the public key directly from the PuTTYgen window.
5. Ensure correct permissions:
   ```shell
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
6. Log out from your RHEL server.

### Step 4: Connect to Your RHEL Server from Windows Using SSH

- If using OpenSSH in PowerShell or Command Prompt, simply use:
  ```shell
  ssh your_username@your_server_ip
  ```
- If using PuTTY, enter your server's IP address or hostname in the `Host Name` field, go to `Connection > SSH > Auth`, and load your private key file.

After following these steps, you should be able to connect to your RHEL server from your Windows laptop without needing to enter your password each time. Remember, the passphrase you set for your SSH key (if you chose to add one) is different from your account password and may be required unless you use an SSH agent to manage your keys.
