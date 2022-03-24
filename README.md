# rpi-ph-temp-sensor-server

This project contains both a Flask backend server and a React frontend. 

![image](https://user-images.githubusercontent.com/4730591/152600756-0ee44244-883a-4162-a8d1-ad7f9a6f056d.png)

![image](https://user-images.githubusercontent.com/4730591/152600793-dc360285-f4e5-4e25-9031-a97b65b711b2.png)


# Getting started
## Dependencies
* Node
* Python 3+
* Linux (maybe)

## Create a copy of the config
TODO: switch to an .env

## Create a virtual environment
Create a Python virtual environment called "venv" using `python3 -m venv venv`. Activate the venv with `source venv/bin/activate`.

Install the Python dependencies using `pip install -r requirements.txt`.

## Compile and run the frontend code
`cd` into `webapp`. Run `npm run build` to build to production, or `npm run dev` to run a local development server. 

## Run the backend server
While in an activated venv, run `flask run`.
