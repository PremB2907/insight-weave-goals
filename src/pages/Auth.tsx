import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

const Auth = () => {
  const { currentUser, signIn, signUp } = useAppContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "login") {
      const success = await signIn(email.trim(), password.trim());
      if (!success) {
        setError("Invalid email or password.");
      }
    } else {
      if (!username.trim()) {
        setError("A username is required to sign up.");
        return;
      }
      const success = await signUp(username.trim(), email.trim(), password.trim());
      if (!success) {
        setError("A user with that email already exists.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="space-y-6 p-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{mode === "login" ? "Welcome Back" : "Create an Account"}</h1>
              <p className="text-muted-foreground mt-2">
                {mode === "login"
                  ? "Sign in to access your notes, habits, and leaderboard data."
                  : "Sign up quickly and start tracking your habits alongside shared notes."}
              </p>
            </div>

            {mode === "signup" ? (
              <div>
                <Label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">Username</Label>
                <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
              </div>
            ) : null}

            <div>
              <Label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button className="w-full" onClick={handleSubmit}>
              {mode === "login" ? "Sign In" : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
              >
                {mode === "login" ? "Create one." : "Sign in."}
              </button>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
