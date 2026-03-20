import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, Loader } from 'lucide-react';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  // 🔐 Email Login / Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
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
      setError("Google login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex items-center justify-center min-h-screen px-4 pt-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-muted-foreground">
                {isSignup ? "Join us today" : "Sign in to your account"}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Input */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 bg-secondary border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent rounded-lg"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 bg-secondary border-input text-foreground placeholder-muted-foreground focus:border-accent focus:ring-accent rounded-lg"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full py-3 mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    {isSignup ? "Creating..." : "Signing in..."}
                  </>
                ) : (
                  isSignup ? "Sign Up" : "Sign In"
                )}
              </Button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-muted-foreground text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full py-3 border-border hover:bg-secondary text-foreground rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Toggle Auth Mode */}
            <p className="text-center mt-6 text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
                className="ml-2 text-accent font-semibold hover:text-accent/80 transition-colors duration-200"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>

          </div>

          {/* Footer Info */}
          <p className="text-center mt-8 text-muted-foreground text-sm">
            © 2024 Your Store. All rights reserved.
          </p>

        </div>
      </main>
    </div>
  );
}