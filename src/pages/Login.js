import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// Firebase
import { auth, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const provider = new GoogleAuthProvider();

  // 🔐 Email Login / Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName || '',
          photo: user.photoURL || null,
          createdAt: new Date()
        });

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate('/');

    } catch (error) {
      alert(error.message);
    }
  };

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google user data:", {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      });

      // Store user in Firestore with all profile data
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || '',
        photo: user.photoURL || null,
        updatedAt: new Date()
      }, { merge: true });

      console.log("User data saved to Firestore");
      navigate('/');

    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-md mx-auto py-16 px-4 pt-16">
        <div className="border p-8 rounded-lg">

          <h1 className="text-2xl font-bold text-center mb-4 text-foreground">
            {isSignup ? "Create Account" : "Login"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label className="text-foreground">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-foreground">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" type="submit">
              {isSignup ? "Sign Up" : "Login"}
            </Button>

          </form>

          {/* Divider */}
          <div className="text-center my-4 text-sm text-muted-foreground">
            OR
          </div>

          {/* 🔥 Google Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>

          <p className="text-center mt-6 text-sm text-foreground">
            {isSignup ? "Already have an account?" : "No account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-primary font-semibold hover:underline"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>

        </div>
      </main>
    </div>
  );
}