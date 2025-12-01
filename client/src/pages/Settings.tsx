import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Mail, Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />
          Settings & Team
        </h2>
        <p className="text-muted-foreground">Manage your profile, team members, and roles.</p>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage who has access to this Nexus Core instance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { name: "Admin User", email: "admin@nexus.com", role: "Owner", initials: "AD" },
              { name: "Developer One", email: "dev@nexus.com", role: "Developer", initials: "DV" },
              { name: "Support Agent", email: "support@nexus.com", role: "Viewer", initials: "SA" },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="min-w-[80px] justify-center">{user.role}</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium mb-3">Invite New Member</h4>
            <div className="flex gap-2">
              <Input placeholder="colleague@company.com" />
              <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-[150px]">
                <option>Viewer</option>
                <option>Developer</option>
                <option>Admin</option>
              </select>
              <Button>Invite</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
