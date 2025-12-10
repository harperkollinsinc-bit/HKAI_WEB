import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, X } from "lucide-react";
import WorkspaceCard from "@/components/WorkspaceCard";
import { serverUrl, Workspace } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useAuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { workspaces, setWorkspaces, user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkpaces();
    if (!user) {
      navigate("/login");
    }
  }, []);

  const loadWorkpaces = async () => {
    try {
      const response = await axios.get(`${serverUrl}/users/workspaces`, {
        withCredentials: true,
      });
      setWorkspaces(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your workspaces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const creatNewWorkspace = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("workspaceTitle") as HTMLInputElement;
    if (input.value.trim() == "") return;

    try {
      const response = await axios.post(
        `${serverUrl}/workspace`,
        { title: input.value },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Workspace created successfully",
        });
        // add the new workspace to the once we have the id
        setWorkspaces([response.data.data, ...workspaces]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = async (id: string, close: () => void) => {
    // TODO: Implement delete functionality
    try {
      const res = await axios.delete(`${serverUrl}/workspace/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Workspace deleted successfully",
        });
        // remove the workspace from the list
        setWorkspaces(workspaces.filter((w) => w.id !== id));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workspace",
        variant: "destructive",
      });
    } finally {
      close();
    }
  };

  const handleEditWkName = async (id: string, newName: string, close: () => void) => {
    // TODO: Implement edit functionality
    try {
      const res = await axios.put(`${serverUrl}/workspace/${id}`, { title: newName }, {withCredentials: true});
      if (res.data.success) {
        toast({
          title: "Success",
          description: "Workspace name updated successfully",
        });
        // update the workspace in the list
        setWorkspaces(workspaces.map((w) => (w.id === id ? {...w, title: newName} : w)));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update workspace name",
        variant: "destructive",
      });
    } finally {
      close();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-secondary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
            <p className="text-muted-foreground">
              Continue your journey or start something new
            </p>
          </div>
          <Button
            onClick={() => {
              setShowModal(true);
            }}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground hover-lift"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Workspaces
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    {workspaces.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Modules */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6">Your Active Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace, idx) => (
              <div
                key={workspace.id}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <WorkspaceCard workspace={workspace} onDelete={handleDelete} onEdit={handleEditWkName} />
              </div>
            ))}
          </div>
        </div>

        {/* new workspace form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-2">
            <Card className="max-w-md w-full border-border bg-card animate-scale-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-center flex-grow">
                  Create New Workspace
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={creatNewWorkspace} className="space-y-4">
                  <div>
                    <label htmlFor="workspaceTitle" className="sr-only">
                      Workspace Title
                    </label>
                    <Input
                      id="workspaceTitle"
                      name="workspaceTitle"
                      type="text"
                      placeholder="Enter workspace title"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Workspace
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
