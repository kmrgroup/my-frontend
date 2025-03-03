import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, UpdateUser } from "@shared/schema";
import { Pencil, Check, X, Brain, Network, Award, Activity, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { CacheService } from "@/lib/cacheService";
import { StateRecoveryService } from "@/lib/stateRecoveryService";

// Predefined avatar options
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=2",
  "https://api.dicebear.com/7.x/bottts/svg?seed=3",
  "https://api.dicebear.com/7.x/bottts/svg?seed=4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=5",
  "https://api.dicebear.com/7.x/bottts/svg?seed=6",
];

export default function Profile() {
  const userId = sessionStorage.getItem("userId");
  const { data: user, refetch: refetchUser } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId && userId !== "null" && !isNaN(parseInt(userId, 10)),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
    initialData: userId ? CacheService.getProfileCache(userId) : undefined,
    onSuccess: (data) => {
      if (userId && data) {
        CacheService.setProfileCache(userId, data);
      }
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    avatarUrl: "",
    bio: "",
    profession: "",
  });
  const { toast } = useToast();

  // Auto-save interval reference
  const [autoSaveInterval, setAutoSaveInterval] = useState<number | null>(null);

  // Initialize form data and check for unsaved changes
  useEffect(() => {
    if (user && userId) {
      // Check for unsaved state
      const savedState = StateRecoveryService.getState(userId);

      if (savedState && savedState.isDirty) {
        const confirmRecover = window.confirm(
          "We found unsaved changes in your profile. Would you like to recover them?"
        );

        if (confirmRecover) {
          setEditForm(savedState.formData);
          setIsEditing(true);
        } else {
          StateRecoveryService.clearState(userId);
        }
      } else {
        setEditForm({
          displayName: user.displayName || user.username || "",
          avatarUrl: user.avatarUrl || AVATAR_OPTIONS[0],
          bio: user.bio || "",
          profession: user.profession || "",
        });
      }
    }
  }, [user, userId]);

  // Handle auto-save when editing
  useEffect(() => {
    if (isEditing && userId) {
      const intervalId = StateRecoveryService.startAutoSave(userId, editForm);
      setAutoSaveInterval(intervalId);
    } else if (autoSaveInterval) {
      StateRecoveryService.stopAutoSave(autoSaveInterval);
      setAutoSaveInterval(null);
    }

    return () => {
      if (autoSaveInterval) {
        StateRecoveryService.stopAutoSave(autoSaveInterval);
      }
    };
  }, [isEditing, editForm, userId]);

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      try {
        if (!userId) throw new Error("No user ID found");

        const response = await fetch(`/api/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update profile');
        }

        const updatedUser = await response.json();
        if (userId) {
          CacheService.updateProfileCache(userId, updatedUser);
          // Clear the recovery state after successful update
          StateRecoveryService.clearState(userId);
        }
        return updatedUser;
      } catch (error) {
        console.error('Update mutation error:', error);
        throw error;
      }
    },
    onSuccess: async (updatedUser) => {
      // Update query cache
      queryClient.setQueryData([`/api/users/${userId}`], updatedUser);
      await refetchUser();
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile",
      });
    },
  });

  // Handle edit button click
  const handleEdit = () => {
    if (user) {
      setEditForm({
        displayName: user.displayName || user.username || "",
        avatarUrl: user.avatarUrl || AVATAR_OPTIONS[0],
        bio: user.bio || "",
        profession: user.profession || "",
      });
    }
    setIsEditing(true);
  };

  // Handle cancel with recovery state clearing
  const handleCancel = () => {
    if (userId) {
      StateRecoveryService.clearState(userId);
    }
    if (user) {
      setEditForm({
        displayName: user.displayName || user.username || "",
        avatarUrl: user.avatarUrl || AVATAR_OPTIONS[0],
        bio: user.bio || "",
        profession: user.profession || "",
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      if (!editForm.displayName?.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Display name cannot be empty",
        });
        return;
      }

      await updateMutation.mutateAsync(editForm);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Please check your form inputs and try again.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const stats = {
    mining: {
      currentHashRate: user?.currentHashRate?.toString() || "0",
      totalMined: user?.totalMined || "0",
      activeTime: "45 days",
      efficiency: "98.5%",
      nodesContributed: 3,
      lastReward: "2.5 NC (1 hour ago)",
    },
    network: {
      reputation: user?.reputation || 0,
      totalTransactions: user?.totalTransactions || 0,
      peersConnected: user?.peersConnected || 0,
      activeChallenges: user?.activeChallenges || 0,
      networkContribution: user?.networkContribution || "Unknown",
      validatorStatus: user?.validatorStatus || "Unknown",
    },
    verification: {
      status: user?.verification?.status || "Unverified",
      level: user?.verification?.level || "Basic",
      completedSteps: user?.verification?.completedSteps || [],
      badges: user?.verification?.badges || [],
    },
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and view your stats</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center gap-2 w-full sm:w-auto">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="flex-1 sm:flex-none">
              <Check className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={editForm.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <Label>Avatar</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-2">
                  {AVATAR_OPTIONS.map((url, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-lg p-2 ${
                        editForm.avatarUrl === url ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => setEditForm(prev => ({ ...prev, avatarUrl: url }))}
                    >
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={url} />
                        <AvatarFallback>Avatar</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className="h-24"
                />
              </div>

              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  name="profession"
                  value={editForm.profession}
                  onChange={handleInputChange}
                  placeholder="Your profession"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage
                  src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                  alt={user?.displayName || user?.username}
                />
                <AvatarFallback>
                  {(user?.displayName?.[0] || user?.username?.[0])?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold">{user?.displayName || user?.username}</h2>
                  {user?.profession && (
                    <p className="text-muted-foreground">{user.profession}</p>
                  )}
                </div>
                {user?.bio && <p className="text-muted-foreground">{user.bio}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats and Activities */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="mining" className="w-full">
            <div className="border-b overflow-x-auto">
              <TabsList className="h-14 w-full justify-start gap-2 sm:gap-6 p-2 sm:p-4">
                <TabsTrigger value="mining" className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                  Neural Mining
                </TabsTrigger>
                <TabsTrigger value="network" className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Network className="h-4 w-4 sm:h-5 sm:w-5" />
                  Network Stats
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mining" className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Hash Rate</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.mining.currentHashRate} H/s</p>
                      </div>
                      <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Mined</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.mining.totalMined} NC</p>
                      </div>
                      <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Mining Efficiency</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.mining.efficiency}</p>
                      </div>
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Mining History</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Time</span>
                      <span className="font-medium">{stats.mining.activeTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Nodes Contributed</span>
                      <span className="font-medium">{stats.mining.nodesContributed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Reward</span>
                      <span className="font-medium">{stats.mining.lastReward}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="network" className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Network Reputation</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.network.reputation}%</p>
                      </div>
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                    <Progress value={stats.network.reputation} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Connected Peers</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.network.peersConnected}</p>
                      </div>
                      <Network className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Challenges</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{stats.network.activeChallenges}</p>
                      </div>
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Network Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Transactions</span>
                      <span className="font-medium">{stats.network.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Network Contribution</span>
                      <Badge variant="outline">{stats.network.networkContribution}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Validator Status</span>
                      <Badge variant="outline" className="bg-primary/10">{stats.network.validatorStatus}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="p-4 sm:p-6 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      {
                        type: "Mining Reward",
                        description: "Received 2.5 NC for successful mining operation",
                        time: "1 hour ago",
                        icon: Award,
                      },
                      {
                        type: "Network Contribution",
                        description: "Validated 50 transactions in the latest block",
                        time: "3 hours ago",
                        icon: Network,
                      },
                      {
                        type: "Badge Earned",
                        description: "Achieved 'Power Miner' status",
                        time: "1 day ago",
                        icon: Award,
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                        <div className="p-2 rounded-full bg-primary/10">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.type}</p>
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}