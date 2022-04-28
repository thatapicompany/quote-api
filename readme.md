### A Demo of how to use The Auth API in a Firebase API

#### Setup

Inside the Functions folder

Create a new Firebase Project:
Run `firebase use [PROJECT ID]`
Run `firebase deploy`

#### frontend code

The code is using Create React App.

Open a new terminal window and run:

```
cd frontend

#to open a new server
npm run start

#to make a build ready for deployment
npm run build`
```

#### Deploy

```
cd ../ #(make sure you're in the root of the project)
npm run deploy --debug
```

Roadmap:

- [ ] Show how to use The Auth API to generate api keys for users when they signup via firebase
- [x] Show how to integrate The Auth API as middleware to verify the api key
- [x] Pull Quotes from JSON file
- [ ] Retrieve and Save Quotes to a database
- [ ] Pull Quotes from the Data API
