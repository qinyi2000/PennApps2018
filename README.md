# PennApps2018
Usage instructions:
This guide assumes you have npm installed. If not, go install that.
Go into the frontend directory and run "npm i".
Then, run the same in frontend/client.
Then, run "npm install localtunnel -g".
Then, run "export DANGEROUSLY_DISABLE_HOST_CHECK=true". This allows localtunnel hosting.
Afterwards, run "npm i yarn -g" and then "yarn dev" in frontend.
Then, in a new terminal tab/window, run "lt --port 3000 --subdomain [YOURNAME]pa18", to ensure subdomains don't conflict. Only first names are necessary I would think.
