# static
An experimental self-constructing website/server that utilizes Base64 encoded JavaScript code which is itself encoded as QR-Codes.

This project is very experimental so beware!

**Important Note:**

The rusthttp.exe file has been included for ease of testing to avoid CORS restrictions and the loading of local scripts/files.

The rusthttp source code can be found here: https://github.com/txtatech/rusthttp

Once the server is running, you can access it through your web browser by visiting http://127.0.0.1:8080/

**Step 1:**

Start the rusthttp.exe or host the files yourself on a local (or non-local) web server.

**Step 2:**

Once the initial page loads open Developer Tools in your browser and switch to Console. (This is important for the next step).

**Step 3:**

Click the 'Cache QR Codes' link on the page. (The page named index.html)

Watch in the Developer Tools as the QR-Codes are 'cached'. This is reading the contents of the QR-Codes and extracting the code within them which can take some time to finsih so be patient.

You should see the scripts loaded and note that it starts (or attempts to start) a service-worker but fails because it is set to null. 
Assigning the worker to null was done intentionally for security purposes. 

**Notes:**

Once the QR-Codes have been 'cached' (and their code executed) the page should be written to memory, the cache and as a binary string in the browser. After the QR-Codes are cached any edits made to the html files will not be reflected until the previous versions are manually purged from the afore-mentioned places in the browser.
 
Only the QR-Codes with the name schema of 'commands-' work properly. The QR-Codes with the name schema of 'nodebase64-' I never got to work properly.  
