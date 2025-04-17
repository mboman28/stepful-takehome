Running the backend:
- In the backend directory:
  - Ensure you have django, django-rest-framework, and django-cors-headers installed
    - `pip install django djangorestframework django-cors-headers`
  - Start the backend server: `python manage.py runserver`
  - By default, the server will start at `http://localhost:8000`
    - Do not change this. The frontend code assumes this is the location for API calls.
  - I've included the testing database in the repo. You should be able to use the coaches and students already present in the database, but you can use the django admin view to add additional coaches and students if you wish:
    - Navigate to `http://localhost:8000/admin`
      - username: `admin`
      - password: `admin`

Running the frontend:
- In the frontend directory:
  - Run `npm install` to get dependencies
  - Run `npm run dev` to start the React app
  - The output will tell you where it's running on (should be `http://localhost:5173/`)
    - Navigate to that location on a webpage to see the app

Assumptions:

- For the sake of scoping down the scenario, not worrying about:
  - Auth
  - Encryption
  - CORS
- Assuming that all users (students/coaches) are in the same time zone.
- All time slots start on the hour or half hour between 8am and 5pm.
- Coaches can only schedule availability starting tomorrow, they CANNOT schedule availability later today.
  - However, they can still cancel upcoming slots later today.
- Students CAN book slots later today.
- Notes are not allowed to be empty.