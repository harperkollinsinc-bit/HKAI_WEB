import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, USER } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";
import { useAuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuthContext();
  const [profile, setProfile] = useState<USER | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleSave = async () => {
    toast({
      title: "Edit Profile",
      description: "This feature is not available yet",
    });
    // if (!profile) return;

    // setSaving(true);
    // try {
    //   await api.updateUserProfile(profile);
    //   toast({
    //     title: "Success",
    //     description: "Profile updated successfully",
    //   });
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update profile",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setSaving(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account and learning preferences
            </p>
          </div>

          {/* Profile Info Card */}
          <Card className="border-border bg-card animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 bg-secondary/10 rounded-full flex items-center justify-center text-5xl">
                  {profile?.avatar || "👤"}
                </div>
                <Button variant="outline" className="hover:border-secondary">
                  Change Avatar
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile?.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile?.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
