import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Friend, User } from "@shared/schema";
import { SiFacebook } from "react-icons/si"; 
import { MessageSquare } from "lucide-react";

export default function Social() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data: friends } = useQuery<Friend[]>({
    queryKey: ["/api/friends/1"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    refetchInterval: 2000,
  });

  const { toast } = useToast();

  const addFriendMutation = useMutation({
    mutationFn: async (friendId: number) => {
      const res = await apiRequest("POST", "/api/friends", {
        userId: 1,
        friendId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends/1"] });
      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send friend request",
      });
    }
  });

  const handleSocialConnect = (platform: string) => {
    // Define OAuth configuration
    const config = {
      facebook: {
        appId: "YOUR_FB_APP_ID", 
        redirectUri: `${window.location.origin}/auth/facebook/callback`,
        scope: "email,public_profile",
      },
      twitter: {
        appId: "YOUR_TWITTER_APP_ID", 
        redirectUri: `${window.location.origin}/auth/twitter/callback`,
        scope: "tweet.read,users.read",
      }
    };

    if (platform === 'facebook') {
      const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.facebook.appId}&redirect_uri=${encodeURIComponent(config.facebook.redirectUri)}&scope=${config.facebook.scope}`;
      openOAuthPopup(url, platform);
    } else if (platform === 'twitter') {
      const url = `https://twitter.com/i/oauth2/authorize?client_id=${config.twitter.appId}&redirect_uri=${encodeURIComponent(config.twitter.redirectUri)}&scope=${config.twitter.scope}&response_type=code`;
      openOAuthPopup(url, platform);
    }
  };

  const openOAuthPopup = (url: string, platform: string) => {
    const width = 600;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      url,
      `Connect with ${platform}`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Handle OAuth response
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        if (!popup) {
          toast({
            title: "Connection Failed",
            description: "Please ensure pop-ups are enabled and try again.",
            variant: "destructive",
          });
        }
      }
    }, 1000);
  };

  const handleSendSMS = () => {
    if (!phoneNumber.match(/^\+?[\d\s-]{10,}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
      });
      return;
    }

    // Here we would integrate with an SMS service
    toast({
      title: "Invite Sent",
      description: `Invitation SMS sent to ${phoneNumber}`,
    });
    setPhoneNumber("");
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <h1 className="text-3xl font-bold">Social</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Friends</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {friends?.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {friend.friendId.toString()[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Friend #{friend.friendId}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Invite Friends</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialConnect('facebook')}
              >
                <SiFacebook className="h-5 w-5 text-[#1877F2]" />
                Connect with Facebook
              </Button>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialConnect('twitter')}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Connect with X (Twitter)
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Invite via SMS
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite via SMS</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button 
                      className="w-full" 
                      onClick={handleSendSMS}
                    >
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Leaderboard</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {users?.sort((a, b) => {
              const aTotal = Number(a.totalMined || 0);
              const bTotal = Number(b.totalMined || 0);
              return bTotal - aTotal;
            }).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {Number(user.totalMined || 0).toFixed(8)} mined
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addFriendMutation.mutate(user.id)}
                  disabled={friends?.some(f => f.friendId === user.id)}
                >
                  {friends?.some(f => f.friendId === user.id) ? 'Friends' : 'Add Friend'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}