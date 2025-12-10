import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Calendar,
  ArrowRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { serverUrl, Workspace } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // Optional: Good for "2 hours ago"
import { useState } from "react";
import axios from "axios";

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (id: string, close: () => void) => void;
  onEdit: (id: string, newName: string, close: () => void) => void;
}

const WorkspaceCard = ({ workspace, onDelete, onEdit }: WorkspaceCardProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(workspace.title);

  // Mocking the date since your API might send it as a string
  const dateStr = workspace?.updated_at || new Date();
  const timeAgo = formatDistanceToNow(new Date(dateStr), { addSuffix: true });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsDropdownOpen(false);
    setEditedName(workspace.title);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editedName.trim() && editedName !== workspace.title) {
      onEdit(workspace.id, editedName.trim(), () => setIsEditing(false));
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditedName(workspace.title);
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border-border/60 bg-card hover:border-primary/50 hover:bg-accent/5 transition-all duration-300 cursor-pointer h-[180px]">
      {/* Options Menu (Three dots) with Dropdown */}
      {!isEditing && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {/* Animated Dropdown Menu */}
          <div
            className={`absolute right-0 mt-1 w-40 bg-card border border-border rounded-md shadow-lg overflow-hidden transition-all duration-200 origin-top-right ${
              isDropdownOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="py-1">
              <button
                onClick={handleEditClick}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Name</span>
              </button>
              <button
                onClick={() =>
                  onDelete(workspace.id, () => setIsDropdownOpen(false))
                }
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <CardContent
        className="pt-6"
        onClick={() => !isEditing && navigate(`/workspace/${workspace.id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          {/* Icon representing a Chat Workspace */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Title or Edit Form */}
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-9 text-sm"
              placeholder="Workspace name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave(e as any);
                } else if (e.key === "Escape") {
                  handleCancel(e as any);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="h-7 px-2 flex-1"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="h-7 px-2 flex-1"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {workspace.title}
          </h3>
        )}
      </CardContent>

      <CardFooter
        onClick={() => !isEditing && navigate(`/workspace/${workspace.id}`)}
        className="pb-4 pt-0 flex justify-between items-center text-sm text-muted-foreground"
      >
        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>Edited {timeAgo}</span>
        </div>

        {/* Hover Arrow */}
        {!isEditing && (
          <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
            <ArrowRight className="h-5 w-5" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkspaceCard;
