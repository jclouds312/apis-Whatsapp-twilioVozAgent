import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogIn, LogOut, User, Users, Image as ImageIcon, Share2 } from "lucide-react";
import { toast } from "sonner";
import { initializeFacebookService, getFacebookService } from "@/services/FacebookService";

export default function FacebookIntegration() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [appId] = useState("YOUR_FACEBOOK_APP_ID"); // Replace with actual App ID

  // Initialize Facebook Service
  useEffect(() => {
    try {
      initializeFacebookService(appId, "v21.0");
    } catch (error) {
      console.error("Facebook initialization error:", error);
    }
  }, [appId]);

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const service = getFacebookService();
        const status = await service.getLoginStatus();
        if (status) {
          setIsAuthenticated(true);
          const userInfo = await service.getMe();
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle Facebook Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const service = getFacebookService();
      const response = await service.login(["public_profile", "email", "user_friends", "user_photos"]);
      
      if (response.authResponse) {
        setIsAuthenticated(true);
        const userInfo = await service.getMe("id,name,email,picture");
        setUser(userInfo);
        toast.success("¡Conectado a Facebook!");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al conectar con Facebook");
    } finally {
      setLoading(false);
    }
  };

  // Handle Facebook Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const service = getFacebookService();
      await service.logout();
      setIsAuthenticated(false);
      setUser(null);
      setFriends([]);
      setPhotos([]);
      toast.success("Desconectado de Facebook");
    } catch (error: any) {
      toast.error("Error al desconectar");
    } finally {
      setLoading(false);
    }
  };

  // Get Friends
  const handleGetFriends = async () => {
    setLoading(true);
    try {
      const service = getFacebookService();
      const friendsList = await service.getFriends("id,name,picture");
      setFriends(friendsList);
      toast.success(`${friendsList.length} amigos cargados`);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar amigos");
    } finally {
      setLoading(false);
    }
  };

  // Get Photos
  const handleGetPhotos = async () => {
    setLoading(true);
    try {
      const service = getFacebookService();
      const photosList = await service.getPhotos(20);
      setPhotos(photosList);
      toast.success(`${photosList.length} fotos cargadas`);
    } catch (error: any) {
      toast.error(error.message || "Error al cargar fotos");
    } finally {
      setLoading(false);
    }
  };

  // Share Content
  const handleShare = async () => {
    try {
      const service = getFacebookService();
      await service.share("https://nexuscore.app", "¡Prueba NEXUSCORE!");
      toast.success("¡Contenido compartido!");
    } catch (error: any) {
      toast.error(error.message || "Error al compartir");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          📱 Facebook SDK v21.0 Integration
        </h1>
        <p className="text-muted-foreground mt-2">
          Integración completa con Facebook SDK v21.0 • Promise-based API • Async/Await support
        </p>
      </div>

      {/* Authentication Status */}
      <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 border-primary/30 shadow-lg">
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.picture?.data?.url && (
                  <img
                    src={user.picture.data.url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-700">Conectado</Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">No conectado</p>
              <Badge className="bg-gray-500/20 text-gray-700">Desconectado</Badge>
            </div>
          )}

          <div className="flex gap-2">
            {!isAuthenticated ? (
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Conectar Facebook
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleLogout} disabled={loading} variant="destructive" className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Desconectando...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Desconectar
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Section - Only show if authenticated */}
      {isAuthenticated && (
        <>
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Disponibles</CardTitle>
              <CardDescription>Utiliza el SDK de Facebook v21.0 con Promises</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button
                onClick={handleGetFriends}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Cargar Amigos
              </Button>
              <Button
                onClick={handleGetPhotos}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Cargar Fotos
              </Button>
              <Button
                onClick={handleShare}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </CardContent>
          </Card>

          {/* Friends */}
          {friends.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amigos ({friends.length})</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 max-h-96 overflow-y-auto">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3 p-2 border rounded">
                    {friend.picture?.data?.url && (
                      <img src={friend.picture.data.url} alt={friend.name} className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-sm">{friend.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fotos ({photos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.picture}
                        alt="photo"
                        className="w-full h-24 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded transition-opacity" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* SDK Info */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Información del SDK</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2 font-mono">
          <p>
            <strong>SDK URL:</strong> https://connect.facebook.net/en_US/sdk.js
          </p>
          <p>
            <strong>API Version:</strong> v21.0
          </p>
          <p>
            <strong>Features:</strong> Promise-based API, async/await support
          </p>
          <p className="text-muted-foreground">
            El SDK se carga automáticamente en client/index.html
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
