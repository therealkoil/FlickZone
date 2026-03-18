1. Create a Firebase project in the Firebase console.
2. In `Build -> Authentication`, enable `Email/Password`.
3. In `Build -> Firestore Database`, create the database in production or test mode.
4. In `Project settings -> General -> Your apps`, add a Web app and copy the config values into [C:\Users\kylem.KOIL\Videos\red-box-app\firebase-config.js](C:\Users\kylem.KOIL\Videos\red-box-app\firebase-config.js).
5. Put your Firebase project ID into [C:\Users\kylem.KOIL\Videos\red-box-app\.firebaserc](C:\Users\kylem.KOIL\Videos\red-box-app\.firebaserc).
6. Publish the rules from [C:\Users\kylem.KOIL\Videos\red-box-app\firestore.rules](C:\Users\kylem.KOIL\Videos\red-box-app\firestore.rules).
7. Deploy the site with Firebase Hosting.

Deploy commands:
```powershell
cd C:\Users\kylem.KOIL\Videos\red-box-app
firebase login
firebase deploy
```

What to copy into `firebase-config.js`:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Notes:
- Usernames are stored in Firestore, while Firebase Auth uses a generated hidden email behind the scenes.
- The username `koil` becomes an admin account automatically.
- Global leaderboard data is pulled from player documents in Firestore.
- Account removal is a soft delete from the client. True Firebase Auth user deletion would need a trusted backend or Cloud Function.
- Firebase Hosting is already configured in [C:\Users\kylem.KOIL\Videos\red-box-app\firebase.json](C:\Users\kylem.KOIL\Videos\red-box-app\firebase.json).
