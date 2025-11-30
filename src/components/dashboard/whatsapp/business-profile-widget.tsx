'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Mail, Globe, MapPin, Info, RefreshCw, User, Phone } from 'lucide-react';
import { getBusinessProfile, getPhoneNumberInfo } from '@/app/dashboard/whatsapp/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  vertical?: string;
  websites?: string[];
  profile_picture_url?: string;
}

interface PhoneInfo {
  verified_name?: string;
  display_phone_number?: string;
  quality_rating?: string;
  platform_type?: string;
  throughput?: { level: string };
  id?: string;
}

export function BusinessProfileWidget() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [phoneInfo, setPhoneInfo] = useState<PhoneInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, phoneResult] = await Promise.all([
        getBusinessProfile(),
        getPhoneNumberInfo()
      ]);

      if (profileResult.success && profileResult.profile) {
        setProfile(profileResult.profile);
      } else if (profileResult.error) {
        setError(profileResult.error);
      }

      if (phoneResult.success && phoneResult.phoneNumber) {
        setPhoneInfo(phoneResult.phoneNumber);
      }
    } catch (error: any) {
      console.error('Failed to load business data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getQualityColor = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Business Profile</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>WhatsApp Business account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && !profile && !phoneInfo ? (
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 text-sm">
            <p className="font-medium mb-1">Configuration Required</p>
            <p className="text-xs">{error}</p>
            <p className="text-xs mt-2">Add WHATSAPP_ACCESS_TOKEN to see business profile</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.profile_picture_url} />
                <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                  {phoneInfo?.verified_name?.charAt(0) || 'W'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {phoneInfo?.verified_name || 'WhatsApp Business'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span className="font-mono">{phoneInfo?.display_phone_number || 'Not configured'}</span>
                </div>
                {phoneInfo?.quality_rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Quality:</span>
                    <div className={`h-2 w-2 rounded-full ${getQualityColor(phoneInfo.quality_rating)}`} />
                    <Badge variant="outline" className="text-xs capitalize">
                      {phoneInfo.quality_rating}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {(profile?.about || profile?.description) && (
              <>
                <Separator />
                <div className="space-y-2">
                  {profile?.about && (
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{profile.about}</p>
                    </div>
                  )}
                  {profile?.description && (
                    <p className="text-xs text-muted-foreground pl-6">{profile.description}</p>
                  )}
                </div>
              </>
            )}

            <div className="grid gap-2">
              {profile?.email && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              )}
              
              {profile?.address && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.address}</span>
                </div>
              )}

              {profile?.websites && profile.websites.length > 0 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {profile.websites.map((url, i) => (
                      <a 
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {profile?.vertical && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{profile.vertical}</span>
                </div>
              )}
            </div>

            {phoneInfo?.throughput && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Messaging Throughput</span>
                  <Badge>{phoneInfo.throughput.level}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Messages per second limit for this phone number
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
