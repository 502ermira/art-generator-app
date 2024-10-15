# Art Generator Application

**Art Generator Application** is an innovative platform that leverages AI to generate images based on user prompts. Built with **React Native** (Expo) and powered by a microservice using **Python**, this application allows users to explore their creativity by transforming text descriptions into stunning AI-generated images.

## Features

- **AI Image Generation**: 
  - Users can input descriptive text prompts to generate unique AI images.
  - Generate AI images using the **Stability AI Stable Diffusion 2** model hosted on Hugging Face.
  - Each generated image includes the prompt, its URL, and embeddings from a Python microservice utilizing the SBERT pre-trained model.

- **Favorites**: 
  - Users can see all favorited images, with options to unfavorite and share images.
  - A preview of up to six favorited images is displayed, with a button to view all favorites.
  - Unfavorite images directly from the favorites screen.

  - **Image Posting**: 
  - Share generated images by posting them on your profile.
  - Users must log in (if he isn't already) before posting.
  - After posting, the image will appear on the user's profile in the posts section.

- **User Profiles**: 
  - The application includes a ProfileScreen for logged-in users to view their followers, followings, posts, reposts, and liked posts.
  - Explore other users' profiles through the **UserProfileScreen**.
  - Users can edit their profile information, including username, full name, email, password, and profile picture (stored in Firebase).

- **Personalized Home Screen**: 
  - Displays posts primarly from users the logged-in user follows, utilizing a Flask microservice to retrieve the most relevant posts based on personalized engagement scores.

- **Personalized Post Ranking**: 
  - Each post shown to a user is ranked using a final score that combines three key factors:
    - **Engagement Score**:
      - Based on user interactions such as likes, comments, views, and reposts.
    - **Recency Score**:
      - Reflects how recent the post was shared, with older posts receiving a lower score.
    - **Relevance Score**:
      - Determined by comparing the post's  content (description, image) with the user's recent search history using a microservice built on SBERT embeddings.

- **User Interaction**:
  - Users can engage with posts by liking, commenting, reposting, and viewing. These interactions directly affect the post’s engagement score and, consequently, its visibility in the user’s feed.

- **Search Functionality**: 
  - Users can search for posts and users, with SBERT embeddings aiding in results.

- **Explore Screen**: 
  - The Explore Screen allows users to discover popularized posts from accounts they do not follow, allowing users to browse through content from accounts they are not yet connected with but that is highly engaging and relevant. This screen showcases posts from across the platform, curated to highlight engaging and recent content that the user might find interesting.

- **Block Feature**: 
  - Users can block other users to prevent them from interacting with their content. Blocked users are added to a designated blocked list, accessible in the settings. Users can unblock others at any time from this list.

- **Settings Screen**: 
  - The settings include options to change passwords, switch app themes, log out, view the blocked list, and navigate to the favorites screen.

- **Notifications**: 
  - Users receive real-time notifications for likes, follows, comments, mentions, and reposts in the NotificationScreen.

## Technologies Used

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express
- **Database**: MongoDB, Firebase
- **Microservice**: Flask with SBERT for generating embeddings
- **Image Generation**: Hugging Face, StabilityAI Stable Diffusion 2 model
- **Real-Time Notifications**: Socket.io 

### User Instructions

- **Sign Up**:  
  - Create a new account using the **Signup** form, which can be accessed by clicking on the Sign Up button in the Top navigation Bar when you first open the app.  
  - You can also access the Signup form, from the login screen, by clicking on the **Signup** text on the login page to navigate to the signup screen.  

- **Login**:  
  - Log in using your credentials (email & password) to access full app features.  
  - Some actions, like sharing posts, will prompt a login if you are not logged in.  

- **Guest Mode**:  
  - As a guest, you can generate images by typing prompts and clicking the Generate button.  
  - Favorite images by clicking the **Favorite** button to store them in async (local) storage.  
  - View up to six recent favorites below the prompt field.  
  - Click **See All Favorites** to open the **Favorites** screen.  

- **Favorites Screen**:  
  - Click on an image to open it in a modal (close it with the **X** button).  
  - Unfavorite images by clicking the **Star** icon at the top right of each image.  
  - Use the **Share** button under images to post them.  
    - **Note**: Sharing requires logging in. If prompted, click **Go to Login** to navigate to the login screen (from there you can then navigate to the Signup screen if you don't have an account yet).  

---

### Navigation  
Use the **Bottom Navigation Bar** to switch between key sections:

1. **Home**:  
   - View personalized content, including posts from users you follow.  
   - Each post displays the username, prompt, description, and post time.  
   - Interact with posts by **liking, commenting, reposting**, or mentioning users.  
   - See lists of **likes, comments, and reposts** on each post.  

2. **Search**:  
   - Use the **search bar** to find relevant posts or user accounts.  
   - Switch between **Images** and **Users** tabs to filter results.  
   - Explore trending content from users you don’t follow under the **Explore** section, located inside the Search Screen.  

3. **Generate Image**:  
   - Create new images by typing prompts.  
   - In logged-in mode, favorited images are saved in the **database**.  

4. **Notifications**:  
   - Track your interactions (follows, likes, comments, reposts, and mentions).  

5. **Profile**:  
   - View personal details (full name, username, bio, followers, and following).  
   - Switch between **posts, reposts, and liked posts** using the tab bar.  
   - **Edit Profile** to update your personal information.  
   - **Delete posts or comments** (swipe left to delete comments).  
   - Manage followers and following lists.  
   - Access other users' profiles from posts, comments, or searches.  

5. **Blocking Users**:  
  - Block users by tapping **Block User** at the top right of their profile.  
  - Manage blocked users in the **Blocked List** under **Settings**.  
  - Unblock users from the **Blocked List** if needed.  

6. **Settings**:  
  - Change the app theme (light or dark mode).  
  - Update your password.  
  - Log out of your account.  
  - Access **Favorites** and **Blocked List** from the settings menu.  

7. **Posting and Sharing**  

- **Sharing Images**:  
  - Click **Share** after generating an image to open the post creation screen.  
  - Add a description to your image and proceed to post (login required).  
  - If not logged in, a prompt will appear. Use **Go to Login** to access the login screen.  