import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, PhoneOff, Mic, MicOff, Video, MoreVertical, Delete, User, History, Voicemail } from "lucide-react";

export default function MockSoftphone() {
  const [activeCall, setActiveCall] = useState<any>(null);
  const [dialNumber, setDialNumber] = useState("");
  const [callStatus, setCallStatus] = useState("idle"); // idle, calling, connected

  const handleCall = () => {
    if (!dialNumber) return;
    setCallStatus("calling");
    setTimeout(() => {
      setCallStatus("connected");
      setActiveCall({
        number: dialNumber,
        name: "Unknown Caller",
        duration: "00:00"
      });
    }, 1500);
  };

  const handleHangup = () => {
    setCallStatus("idle");
    setActiveCall(null);
    setDialNumber("");
  };

  const dialPad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div className="flex h-[calc(100vh-8rem)] justify-center items-center p-6">
      <div className="w-full max-w-sm grid gap-6">
        
        {/* Connection Status Card */}
        <Card className="bg-slate-900/80 backdrop-blur border-slate-800 shadow-xl">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <div className="space-y-0.5">
                 <p className="text-sm font-medium text-slate-200">Main Company Line</p>
                 <p className="text-xs text-muted-foreground font-mono">+1 862-277-0131</p>
               </div>
             </div>
             <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
               Online
             </Badge>
          </CardContent>
        </Card>

        {/* Dialer Card */}
        <Card className="bg-slate-950 border-slate-800 shadow-2xl overflow-hidden relative">
          
          {/* Active Call Overlay */}
          {callStatus !== "idle" && (
            <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center space-y-2">
                <Avatar className="h-24 w-24 mx-auto border-4 border-slate-800 shadow-xl">
                  <AvatarFallback className="bg-slate-800 text-slate-400 text-2xl">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-white">{dialNumber}</h2>
                <p className="text-emerald-400 font-medium animate-pulse">
                  {callStatus === "calling" ? "Calling..." : "00:42"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-[200px]">
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-700 hover:bg-slate-800">
                  <Mic className="h-6 w-6 text-slate-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-700 hover:bg-slate-800">
                  <Video className="h-6 w-6 text-slate-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-700 hover:bg-slate-800">
                  <MoreVertical className="h-6 w-6 text-slate-300" />
                </Button>
              </div>

              <Button 
                size="lg" 
                className="h-16 w-full rounded-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 text-lg font-medium"
                onClick={handleHangup}
              >
                <PhoneOff className="mr-2 h-6 w-6" /> End Call
              </Button>
            </div>
          )}

          <CardContent className="p-6 space-y-6">
            {/* Display */}
            <div className="text-center py-4">
              <Input 
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                className="text-center text-3xl font-mono bg-transparent border-none focus-visible:ring-0 placeholder:text-slate-800"
                placeholder="Enter Number"
              />
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4">
              {dialPad.map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  className="h-16 w-16 rounded-full text-2xl font-medium hover:bg-slate-800/50 hover:text-white transition-all mx-auto"
                  onClick={() => setDialNumber(prev => prev + key)}
                >
                  {key}
                </Button>
              ))}
            </div>

            {/* Call Action */}
            <div className="flex justify-center pt-2">
              <Button 
                size="icon" 
                className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20 transition-all hover:scale-105"
                onClick={handleCall}
                disabled={!dialNumber}
              >
                <Phone className="h-8 w-8 text-white" />
              </Button>
            </div>
          </CardContent>

          {/* Bottom Tabs */}
          <div className="grid grid-cols-3 border-t border-slate-800 bg-slate-900/50">
            <Button variant="ghost" className="h-14 rounded-none border-t-2 border-primary bg-slate-800/50 text-primary">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="h-14 rounded-none hover:bg-slate-800 text-slate-400 hover:text-slate-200">
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="h-14 rounded-none hover:bg-slate-800 text-slate-400 hover:text-slate-200">
              <Voicemail className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Right Side Info (Optional - Recent Logs) */}
      <div className="hidden lg:block w-80 ml-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-200 px-1">Recent Calls</h3>
        <ScrollArea className="h-[500px] w-full rounded-xl border border-slate-800 bg-slate-900/30 p-4">
          <div className="space-y-4">
            {[1,2,3,4,5].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                    {i % 2 === 0 ? <Phone className="h-4 w-4" /> : <PhoneOff className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">+1 (555) 000-000{i}</p>
                    <p className="text-xs text-muted-foreground">Today, 10:{30 + i} AM</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-mono">02:1{i}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}